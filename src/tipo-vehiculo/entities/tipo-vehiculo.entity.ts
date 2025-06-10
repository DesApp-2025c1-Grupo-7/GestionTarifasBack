import { TipoCarga } from "src/tipo-carga/entities/tipo-carga.entity";
import { Vehiculo } from "src/vehiculo/entities/vehiculo.entity";
import { Column, DeleteDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class TipoVehiculo {

    @PrimaryGeneratedColumn('increment')
    id:number

    @Column()
    descripcion: string


    @ManyToMany(() => TipoCarga, carga => carga.tipoVehiculos, { cascade: true})
    @JoinTable({
        name: 'vehiculo_carga'
    })
    tipoCargas: TipoCarga[]

    @OneToMany(() => Vehiculo, vehiculo => vehiculo.tipoVehiculo)
    vehiculos: Vehiculo[]

    @DeleteDateColumn({ nullable: true })
    deletedAt: Date | null
}