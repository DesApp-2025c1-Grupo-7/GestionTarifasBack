import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


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

    @DeleteDateColumn({ nullable: true })  
    deletedAt: Date | null

}