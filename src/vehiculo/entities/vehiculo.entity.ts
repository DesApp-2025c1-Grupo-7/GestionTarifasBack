import { TipoVehiculo } from "src/tipo-vehiculo/entities/tipo-vehiculo.entity";
import { Transportista } from "src/transportista/entities/transportista.entity";
import { TarifaCosto } from "src/tarifa-costo/entities/tarifa-costo.entity";
import { Column, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class Vehiculo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    patente: string;

    @Column()
    precioBase: number;

    @ManyToOne(() => Transportista, transportista => transportista.vehiculos)
    transportista: Transportista

    @ManyToOne(() => TipoVehiculo, tipoVehiculo => tipoVehiculo.vehiculos)
    tipoVehiculo: TipoVehiculo;

    @OneToMany(() => TarifaCosto, tarifaCosto => tarifaCosto.vehiculo)
    tarifaCosto: TarifaCosto[];

    @DeleteDateColumn({ nullable: true })
    deletedAt: Date | null

}