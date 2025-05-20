import { IsBoolean, IsNotEmpty, IsNumber, IsString, Min} from "class-validator"


export class TipoCargaDTO {

    @IsNotEmpty()
    @IsString()
    categoria: string

    @IsNotEmpty()
    @IsString()
    requisitoEspecial: string

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    pesoTotal: number

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    volumenTotal: number

    @IsNotEmpty()
    @IsBoolean()
    esPeligrosa:boolean

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    valorBase: number

}