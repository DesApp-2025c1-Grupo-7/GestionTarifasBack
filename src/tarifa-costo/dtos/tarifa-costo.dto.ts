import {IsNumber, IsNotEmpty} from "class-validator"

export class TarifaCostoDTO {

    @IsNotEmpty()
    @IsNumber()
    valorBase: number;

    @IsNotEmpty()
    @IsNumber()
    tarifaCostoId: number;
}