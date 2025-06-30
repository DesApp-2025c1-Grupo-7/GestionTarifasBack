import { TarifaCosto } from "src/tarifa-costo/entities/tarifa-costo.entity";
import { TipoVehiculo } from "src/tipo-vehiculo/entities/tipo-vehiculo.entity";
import { Column, DeleteDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class TipoCarga {

    @PrimaryGeneratedColumn('increment')
    id: number

    @Column()
    categoria: string

    @Column({ nullable: true })
    requisitoEspecial?: string;

    @Column()
    pesoTotal: number

    @Column()
    volumenTotal: number

    @Column()
    esEspecial: boolean
    
    @DeleteDateColumn({ nullable: true })  
    deletedAt: Date | null

    @ManyToMany(() => TipoVehiculo, tipoVehiculo => tipoVehiculo.tipoCargas)
    tipoVehiculos: TipoVehiculo[];

    @OneToMany(() => TarifaCosto, tarifaCosto => tarifaCosto.tipoCarga, { cascade: true })
    tarifaCosto: TarifaCosto[];
}