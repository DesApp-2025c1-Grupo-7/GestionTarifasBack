import { TipoVehiculo } from "src/tipo-vehiculo/entities/tipo-vehiculo.entity";
import { Column, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class Vehiculo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    patente: string;

    @Column()
    precioBase: number;

    @ManyToOne(() => TipoVehiculo, tipoVehiculo => tipoVehiculo.vehiculos)
    tipoVehiculo: TipoVehiculo;

    @DeleteDateColumn({ nullable: true })  
    deletedAt: Date | null

}