import { TipoVehiculo } from "src/tipo-vehiculo/entities/tipo-vehiculo.entity";
import { Column, DeleteDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class TipoCarga {

    @PrimaryGeneratedColumn('increment')
    id: number

    @Column()
    categoria: string

    @Column()
    requisitoEspecial: string

    @Column()
    pesoTotal: number

    @Column()
    volumenTotal: number

    @Column()
    valorBase: number

    @Column()
    esPeligrosa: boolean
    
    @DeleteDateColumn({ nullable: true })  
    deletedAt: Date | null

    @ManyToMany(() => TipoVehiculo, tipoVehiculo => tipoVehiculo.tipoCargas)
    tipoVehiculos: TipoVehiculo[];

}