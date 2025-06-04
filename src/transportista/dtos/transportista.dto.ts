import { IsString, IsNotEmpty, IsNumber, IsArray} from 'class-validator';

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

  @IsArray()
  @IsNumber({}, { each: true }) // valida que cada item sea un número
  vehiculos: number[];
}