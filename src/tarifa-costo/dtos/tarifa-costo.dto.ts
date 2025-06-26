import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateTarifaCostoDTO {

  @ApiProperty({
    example: 45000,
    description: 'Valor base de la tarifa sin incluir adicionales.',
  })
  @IsNotEmpty()
  @IsNumber()
  valorBase: number;

  @ApiProperty({
    example: 1,
    description: 'ID del tipo de vehículo que se utilizará en la tarifa.',
  })
  @IsNotEmpty()
  @IsNumber()
  tipoVehiculo: number;

  @ApiProperty({
    example: 2,
    description: 'ID de la zona de viaje asociada a esta tarifa.',
  })
  @IsNotEmpty()
  @IsNumber()
  zonaDeViaje: number;

  @ApiProperty({
    example: 3,
    description: 'ID del transportista que ofrece esta tarifa.',
  })
  @IsNotEmpty()
  @IsNumber()
  transportista: number;

  @ApiProperty({
    example: 4,
    description: 'ID del tipo de carga para la cual aplica esta tarifa.',
  })
  @IsNotEmpty()
  @IsNumber()
  tipoCarga: number;
}
