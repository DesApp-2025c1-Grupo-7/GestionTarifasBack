import { ApiProperty } from "@nestjs/swagger";
// --- AJUSTE: Se importan nuevos validadores ---
import { IsNotEmpty, IsNumber, IsOptional, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

// --- AJUSTE: Se crea una pequeña clase para validar cada objeto del array ---
class AdicionalConCostoDto {
  @IsNumber()
  idAdicional: number;

  @IsNumber()
  costo: number;
}

export class CreateTarifaCostoDTO {

  @ApiProperty({ example: 45000, description: 'Valor base de la tarifa.' })
  @IsNotEmpty()
  @IsNumber()
  valorBase: number;

  @ApiProperty({ example: 1, description: 'ID del tipo de vehículo.' })
  @IsNotEmpty()
  @IsNumber()
  tipoVehiculo: number;

  @ApiProperty({ example: 2, description: 'ID de la zona de viaje.' })
  @IsNotEmpty()
  @IsNumber()
  zonaDeViaje: number;

  @ApiProperty({ example: 3, description: 'ID del transportista.' })
  @IsNotEmpty()
  @IsNumber()
  transportista: number;

  @ApiProperty({ example: 4, description: 'ID del tipo de carga.' })
  @IsNotEmpty()
  @IsNumber()
  tipoCarga: number;

  // --- AJUSTE CLAVE: Se actualiza la definición de 'adicionales' ---
  @ApiProperty({
    example: [{ idAdicional: 1, costo: 50.50 }, { idAdicional: 5, costo: 120.00 }],
    description: 'Array de objetos, cada uno con el ID del adicional y su costo específico para esta tarifa.',
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true }) // Valida cada objeto del array
  @Type(() => AdicionalConCostoDto) // Especifica el tipo de objeto esperado
  adicionales?: AdicionalConCostoDto[];
}