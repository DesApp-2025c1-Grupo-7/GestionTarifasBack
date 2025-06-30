import { IsNumber, IsOptional } from 'class-validator';

export class CreateTarifaAdicionalDTO {
  @IsNumber({}, { message: 'El campo tarifaId debe ser un número.' })
  tarifaId: number;

  @IsNumber({}, { message: 'El campo adicionalId debe ser un número.' })
  adicionalId: number;

  @IsNumber({}, { message: 'El costo personalizado debe ser un número.' })
  @IsOptional()
  costoPersonalizado?: number;
}
