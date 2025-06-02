import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { TipoCargaDTO } from "src/tipo-carga/dtos/tipo-carga.dto";

export class CreateTipoVehiculoDTO {
  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsArray()
  @Type(() => TipoCargaDTO)
  cargas: TipoCargaDTO[];  
}