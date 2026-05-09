import {
  Entity,
  Column,
  Index,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Generic } from './generic.entity';
import { Variant } from './variant.entity';

@Entity('brands')
export class Medicine extends BaseEntity {
  @Index()
  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  manufacturer?: string;

  @Column({ type: 'uuid', name: 'generic_id' })
  genericId: string;

  @Column({ type: 'boolean', name: 'requires_prescription', default: false })
  requiresPrescription: boolean;

  @ManyToOne(() => Generic, (generic) => generic.medicines, { eager: true })
  @JoinColumn({ name: 'generic_id' })
  generic: Generic;

  @OneToMany(() => Variant, (variant) => variant.medicine)
  variants?: Variant[];
}
