import {
  Controller,
  Get,
  Logger,
  Query,
  BadRequestException,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { MedicineService, MedicineSearchResult, MedicineListItem } from './medicine.service';

@ApiTags('Medicines')
@Controller('medicines')
export class MedicineController {
  private readonly logger = new Logger(MedicineController.name);

  constructor(private readonly medicineService: MedicineService) {}

  // ── GET /api/medicines ────────────────────────────────────────────────────

  @Public()
  @Get()
  @ApiOperation({ summary: 'List medicines (one variant per brand)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiQuery({ name: 'offset', required: false, type: Number, example: 0 })
  @ApiResponse({ status: 200, description: 'Medicine list returned' })
  async list(
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<MedicineListItem[]> {
    this.logger.log(`GET /medicines limit=${limit} offset=${offset}`);
    const result = await this.medicineService.list(limit, offset);
    this.logger.log(`Medicines returned: ${result.length}`);
    return result;
  }

  // ── GET /api/medicines/search ─────────────────────────────────────────────

  @Public()
  @Get('search')
  @ApiOperation({ summary: 'Search medicines by brand or generic name' })
  @ApiQuery({ name: 'name', required: true, description: 'Brand or generic name to search' })
  async search(@Query('name') name: string): Promise<MedicineSearchResult[]> {
    if (!name || name.trim().length < 2) {
      throw new BadRequestException('Query param "name" must be at least 2 characters');
    }
    this.logger.log(`GET /medicines/search name="${name}"`);
    const result = await this.medicineService.search(name);
    this.logger.log(`Search results: ${result.length}`);
    return result;
  }
}
