import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsArray } from "class-validator"; // CAMBIO: IsOptional y IsArray importados

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

  // CAMBIO: Se agrega el campo para recibir los IDs de adicionales.
  @ApiProperty({
    example: [1, 5],
    description: 'Array de IDs de los adicionales a vincular.',
    required: false,
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  adicionales?: number[];
}