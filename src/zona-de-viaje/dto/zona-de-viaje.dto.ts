import { IsInt, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateZonaDeViaje {
  
  @ApiProperty({
    example: 'Buenos Aires',
    description: 'Ciudad o región de origen del viaje',
  })
  @IsString()
  origen: string;

  @ApiProperty({
    example: 'Rosario',
    description: 'Ciudad o región de destino del viaje',
  })
  @IsString()
  destino: string;

  @ApiProperty({
    example: 300,
    description: 'Distancia entre origen y destino en kilómetros',
  })
  @IsInt()
  distancia: number;
  /*
  @ApiProperty({
    example: 150,
    description: 'Costo por kilómetro en la ruta especificada',
  })
  
  @IsInt()
  costoKilometro: number;
  */
}