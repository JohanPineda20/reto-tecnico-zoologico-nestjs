import { Animal } from "src/animals/entities/animal.entity";
import { Area } from "src/areas/entities/area.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Species {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;

    @ManyToOne(() => Area, (area) => area.species)
    @JoinColumn({name: 'area_id'})
    area: Area

    @OneToMany(() => Animal, animal => animal.specie)
    animals: Animal[];
}
