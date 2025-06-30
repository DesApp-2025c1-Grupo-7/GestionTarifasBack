import { Transform, Type } from 'class-transformer';
import {IsBoolean,IsNotEmpty,IsNumber,IsOptional,IsString,Min} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TipoCargaDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim().toLowerCase()) 
  categoria: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : ''))
  requisitoEspecial?: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  pesoTotal: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  volumenTotal: number;

  @ApiProperty()
  @IsBoolean()
  @Type(() => Boolean)
  esEspecial: boolean;
}
