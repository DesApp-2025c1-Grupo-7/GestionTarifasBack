import { IsInt, IsString } from "class-validator";


export class CreateZonaDeViaje {
  
  @IsString()
  origen: string;

  @IsString()
  destino: string;

  @IsInt()
  distancia: number;

  @IsInt()
  costoKilometro: number;
}