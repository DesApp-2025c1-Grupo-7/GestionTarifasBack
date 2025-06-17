import { IsBoolean, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateAdicionalDTO {
  @IsString()
  @MaxLength(255)
  descripcion: string;

  @IsNumber()
  @IsOptional()
  costo?: number;

  @IsBoolean()
  @IsOptional()
  esObligatorio?: boolean;
}
