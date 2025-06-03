import { IsInt, IsNumber, IsString } from "class-validator";


export class CreateVehiculoDto {
  
  @IsString()  
  patente: string;

  @IsInt()
  precioBase: number;
  
  @IsNumber()
  tipoVehiculoId: number;
}