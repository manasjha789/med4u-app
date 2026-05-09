import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../../redis/redis.constants';
import { Variant } from '../../database/entities/variant.entity';
import { Price } from '../../database/entities/price.entity';
import { PriceService } from './price.service';

const CACHE_TTL = 3600;

interface PriceShape {
  mrp: number;
  final_price: number;
  discount_percent: number;
  source: string;
}

export interface MedicineSearchResult {
  generic: string;
  brand: string;
  strength: string | null;
  form: string;
  pack_size: string | null;
  price: PriceShape | null;
}

export interface MedicineListItem {
  id: string;
  brand: string;
  generic: string;
  category: string;
  strength: string | null;
  form: string;
  pack_size: string | null;
  requires_prescription: boolean;
  price: PriceShape | null;
}

@Injectable()
export class MedicineService {
  private readonly logger = new Logger(MedicineService.name);

  constructor(
    @InjectRepository(Variant) private variantRepo: Repository<Variant>,
    @InjectRepository(Price) private priceRepo: Repository<Price>,
    @Inject(REDIS_CLIENT) private redis: Redis,
    private priceService: PriceService,
  ) {}

  async search(name: string): Promise<MedicineSearchResult[]> {
    const query = name.trim().toLowerCase();
    const cacheKey = `medicine:${query}`;

    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached) as MedicineSearchResult[];

    const variants = await this.variantRepo
      .createQueryBuilder('variant')
      .innerJoinAndSelect('variant.medicine', 'brand')
      .innerJoinAndSelect('brand.generic', 'generic')
      .leftJoinAndSelect('variant.prices', 'price')
      .where('variant.deletedAt IS NULL')
      .andWhere('brand.deletedAt IS NULL')
      .andWhere('generic.deletedAt IS NULL')
      .andWhere(
        '(LOWER(brand.name) LIKE :q OR LOWER(generic.name) LIKE :q)',
        { q: `%${query}%` },
      )
      .orderBy('brand.name', 'ASC')
      .getMany();

    // Optimistically fetch prices from myUpchar for variants that have no price yet
    const missingPrice = variants.filter((v) => !v.prices || v.prices.length === 0);
    if (missingPrice.length > 0) {
      await Promise.allSettled(
        missingPrice.map(async (v) => {
          try {
            await this.priceService.fetchAndStore(v.medicine.name, v.id);
          } catch {
            // non-fatal — fall back to DB-only result
          }
        }),
      );

      // Reload only the variants that were missing prices
      const ids = missingPrice.map((v) => v.id);
      const refreshed = await this.priceRepo.find({
        where: ids.map((id) => ({ variantId: id })),
      });
      const priceMap = new Map(refreshed.map((p) => [p.variantId, p]));

      for (const v of missingPrice) {
        const p = priceMap.get(v.id);
        if (p) v.prices = [p];
      }
    }

    const results: MedicineSearchResult[] = variants.map((v) => {
      const latestPrice = v.prices?.[0] ?? null;
      return {
        generic: v.medicine.generic.name,
        brand: v.medicine.name,
        strength: v.strength ?? null,
        form: v.form,
        pack_size: v.packSize ?? null,
        price: latestPrice
          ? {
              mrp: Number(latestPrice.mrp),
              final_price: Number(latestPrice.finalPrice),
              discount_percent: Number(latestPrice.discountPercent),
              source: latestPrice.source,
            }
          : null,
      };
    });

    await this.redis.setex(cacheKey, CACHE_TTL, JSON.stringify(results));
    return results;
  }

  // ── GET /api/medicines ────────────────────────────────────────────────────

  async list(limit = 20, offset = 0): Promise<MedicineListItem[]> {
    const cacheKey = `medicine:list:${limit}:${offset}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached) as MedicineListItem[];

    const allVariants = await this.variantRepo
      .createQueryBuilder('variant')
      .innerJoinAndSelect('variant.medicine', 'brand')
      .innerJoinAndSelect('brand.generic', 'generic')
      .leftJoinAndSelect('variant.prices', 'price')
      .where('variant.deletedAt IS NULL')
      .andWhere('brand.deletedAt IS NULL')
      .andWhere('generic.deletedAt IS NULL')
      .orderBy('brand.name', 'ASC')
      .addOrderBy('variant.id', 'ASC')
      .getMany();

    // One representative variant per medicine brand
    const seen = new Set<string>();
    const deduped: Variant[] = [];
    for (const v of allVariants) {
      if (!seen.has(v.medicine.id)) {
        seen.add(v.medicine.id);
        deduped.push(v);
      }
    }

    const paged = deduped.slice(offset, offset + limit);

    const results: MedicineListItem[] = paged.map((v) => {
      const p = v.prices?.[0] ?? null;
      return {
        id: v.medicine.id,
        brand: v.medicine.name,
        generic: v.medicine.generic.name,
        category: v.medicine.generic.category,
        strength: v.strength ?? null,
        form: v.form,
        pack_size: v.packSize ?? null,
        requires_prescription: v.medicine.requiresPrescription,
        price: p
          ? {
              mrp: Number(p.mrp),
              final_price: Number(p.finalPrice),
              discount_percent: Number(p.discountPercent),
              source: p.source,
            }
          : null,
      };
    });

    await this.redis.setex(cacheKey, CACHE_TTL, JSON.stringify(results));
    return results;
  }
}
