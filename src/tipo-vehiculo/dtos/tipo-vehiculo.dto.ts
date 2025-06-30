import { Type } from "class-transformer";
import { IsArray, IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { TipoCargaDTO } from "src/tipo-carga/dtos/tipo-carga.dto";

export class CreateTipoVehiculoDTO {
  @ApiProperty({
    example: 'Camión refrigerado',
    description: 'Descripción del tipo de vehículo',
  })
  @IsNotEmpty()
  @IsString()
  descripcion: string;

  /*
  @ApiProperty({
      example: 15000,
      description: 'Precio base del vehículo',
    })
  @IsNumber()
  @Type(() => Number)
  precioBase: number;
  */
  @ApiProperty({
    type: [TipoCargaDTO],
    description: 'Lista de tipos de carga compatibles con este tipo de vehículo',
  })
  @IsArray()
  @Type(() => TipoCargaDTO)
  tipoCargas: TipoCargaDTO[];
}
