import { IsInt, IsString } from "class-validator";


export class ZonaDeViaje {
  
  @IsString()
  origen: string;

  @IsString()
  destino: string;

  @IsInt()
  distancia: number;

  @IsInt()
  costoKm: number;
}