import { IsString, IsNotEmpty, IsNumber} from 'class-validator';

export class CreateTransportistaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsNumber()
  costoServicio: number;

  @IsString()
  @IsNotEmpty()
  contacto: string;

  @IsString()
  @IsNotEmpty()
  telefono: string;

}