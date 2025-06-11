import { IsBoolean, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class TipoCargaDTO {

  @ApiProperty({
    example: 'Electrónica',
    description: 'Categoría de la carga',
  })
  @IsNotEmpty()
  @IsString()
  categoria: string;

  @ApiProperty({
    example: 'Requiere refrigeración',
    description: 'Requisito especial que debe cumplirse para transportar esta carga',
  })
  @IsNotEmpty()
  @IsString()
  requisitoEspecial: string;

  @ApiProperty({
    example: 1500,
    description: 'Peso total de la carga en kilogramos',
    minimum: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  pesoTotal: number;

  @ApiProperty({
    example: 3.5,
    description: 'Volumen total de la carga en metros cúbicos',
    minimum: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  volumenTotal: number;

  @ApiProperty({
    example: true,
    description: 'Indica si la carga es peligrosa',
  })
  @IsNotEmpty()
  @IsBoolean()
  esPeligrosa: boolean;

  @ApiProperty({
    example: 2500,
    description: 'Valor base para el transporte de esta carga',
    minimum: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  valorBase: number;
}
