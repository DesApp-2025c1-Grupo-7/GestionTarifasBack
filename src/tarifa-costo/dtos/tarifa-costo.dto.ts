import {IsNumber, IsNotEmpty} from "class-validator"

export class CreateTarifaCostoDTO {

    @IsNotEmpty()
    @IsNumber()
    valorBase: number;

    @IsNotEmpty()
    @IsNumber()
    tipoVehiculo: number;

    @IsNotEmpty()
    @IsNumber()
    zonaDeViaje: number;

    @IsNotEmpty()
    @IsNumber()
    transportista: number;
}
