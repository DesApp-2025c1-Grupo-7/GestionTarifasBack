import { IsString, IsNotEmpty, IsNumber, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransportistaDto {
  @ApiProperty({
    example: 'Transporte Martínez S.A.',
    description: 'Nombre del transportista',
  })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({
    example: 5000,
    description: 'Costo fijo del servicio de transporte',
  })
  @IsNumber()
  costoServicio: number;

  @ApiProperty({
    example: 'martinez@transportes.com',
    description: 'Información de contacto del transportista',
  })
  @IsString()
  @IsNotEmpty()
  contacto: string;

  @ApiProperty({
    example: '+54 9 11 2345-6789',
    description: 'Número de teléfono del transportista',
  })
  @IsString()
  @IsNotEmpty()
  telefono: string;

  @ApiProperty({
  example: [1, 2, 3],
  description: 'IDs de vehículos existentes a asociar con el nuevo transportista',
  })
  @IsArray()
  @IsNumber({}, { each: true })
  vehiculos: number[];

  @ApiProperty({
    example: [1, 4],
    description: 'Opcional. IDs de zonas de viaje asociadas al transportista',
  })
  @IsArray()
  @IsNumber({}, { each: true })
  zonasDeViaje: number[];

}
