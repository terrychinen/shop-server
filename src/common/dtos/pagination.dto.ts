import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    description: 'How many rows do you need',
    default: 5,
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    description: 'How many rows do you want to ski`',
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  offset?: number;
}
