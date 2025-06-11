import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsNumber } from 'class-validator';

export class CreateVehiculoDto {
  @ApiProperty({
    example: 'ABC123',
    description: 'Patente del vehículo',
  })
  @IsString()
  patente: string;

  @ApiProperty({
    example: 15000,
    description: 'Precio base del vehículo',
  })
  @IsInt()
  precioBase: number;

  @ApiProperty({
    example: 1,
    description: 'ID del tipo de vehículo asociado',
  })
  @IsNumber()
  tipoVehiculo: number;
}