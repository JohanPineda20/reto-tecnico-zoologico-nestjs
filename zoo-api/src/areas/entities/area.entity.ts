import { Species } from "src/species/entities/species.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Area {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @OneToMany(() => Species, (species) => species.area, { cascade: ['remove']})
    species: Species[];
}
