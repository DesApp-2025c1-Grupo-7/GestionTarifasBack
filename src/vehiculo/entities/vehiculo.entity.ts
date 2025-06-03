import { TipoVehiculo } from "src/tipo-vehiculo/entities/tipo-vehiculo.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class Vehiculo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    patente: string;

    @Column()
    Precio_base: number;

    @ManyToOne(() => TipoVehiculo, tipoVehiculo => tipoVehiculo.vehiculos)
    tipoVehiculo: TipoVehiculo;
}