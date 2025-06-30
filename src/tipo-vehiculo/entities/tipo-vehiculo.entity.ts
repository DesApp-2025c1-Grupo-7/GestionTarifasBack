import { TarifaCosto } from "src/tarifa-costo/entities/tarifa-costo.entity";
import { TipoCarga } from "src/tipo-carga/entities/tipo-carga.entity";
import { Transportista } from "src/transportista/entities/transportista.entity";
import { Column, DeleteDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class TipoVehiculo {

    @PrimaryGeneratedColumn('increment')
    id:number

    @Column()
    descripcion: string
    /*
    @Column()
    precioBase: number;
    */
    @ManyToMany(() => TipoCarga, carga => carga.tipoVehiculos, { cascade: true})
    @JoinTable({
        name: 'vehiculo_carga'
    })
    tipoCargas: TipoCarga[]
    
    @ManyToOne(() => Transportista, transportista => transportista.tipoVehiculos)
    transportista: Transportista
    
    
    @OneToMany(() => TarifaCosto, tarifaCosto => tarifaCosto.tipoVehiculo)
    tarifaCosto: TarifaCosto[];

    @DeleteDateColumn({ nullable: true })
    deletedAt: Date | null
}