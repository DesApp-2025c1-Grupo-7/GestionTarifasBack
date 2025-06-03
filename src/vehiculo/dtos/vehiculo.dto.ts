import { IsInt, IsString } from "class-validator";


export class CreateVehiculoDto {
  
  @IsString()  
  patente: string;

  @IsInt()
  precioBase: number;
  
  
  tipoVehiculoId: number;
}