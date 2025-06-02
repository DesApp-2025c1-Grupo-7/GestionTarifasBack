import { TipoCarga } from "src/tipo-carga/entities/tipo-carga.entity";
import { Column, DeleteDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";



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


    @DeleteDateColumn({ nullable: true })  
    deletedAt: Date | null
}