import { ApiProperty } from "@nestjs/swagger";
// --- AJUSTE: Se agrego is date string para validar fechas ---
import { IsNotEmpty, IsNumber, IsOptional, IsArray, ValidateNested, IsDateString } from "class-validator";
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

  //-- AJUSTE: Se agrega propiedad para la fecha de vigencia de la tarifa ---

  @ApiProperty({ 
    example: '2025-08-01', 
    description: 'Fecha en que la tarifa entra en vigencia (YYYY-MM-DD).',
    required: false})
  @IsNotEmpty()
  @IsDateString()
  @IsOptional()
  vigenciaDesde: Date;
  

  @ApiProperty({ 
    example: '2025-12-31', 
    description: 'Fecha en que la tarifa deja de ser válida (opcional).',
    required: false 
  })
  @IsOptional() 
  @IsDateString()
  vigenciaHasta?: Date;

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