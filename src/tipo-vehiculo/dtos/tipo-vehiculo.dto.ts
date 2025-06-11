import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsString } from "class-validator";
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

  @ApiProperty({
    type: [TipoCargaDTO],
    description: 'Lista de tipos de carga compatibles con este tipo de vehículo',
  })
  @IsArray()
  @Type(() => TipoCargaDTO)
  tipoCargas: TipoCargaDTO[];
}
