import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';
import { FilterGroupDto } from '../filters/filter.dto';

export class SearchDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  @ApiProperty({
    description: 'How many rows do you need',
    default: 10,
    required: false,
  })
  limit?: number = 10;

  @IsOptional()
  @Min(0)
  @Type(() => Number)
  @ApiProperty({
    description: 'How many rows do you want to skip',
    default: 0,
    required: false,
  })
  offset?: number = 0;

  @IsOptional()
  @ApiProperty({
    description: 'filters to apply',
    default: [],
    required: false,
  })
  filters?: FilterGroupDto[] = [];
}
