import { Comment } from "src/comments/entities/comment.entity";
import { Species } from "src/species/entities/species.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Animal {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Species, (specie) => specie.animals)
    @JoinColumn({name: 'specie_id'})
    specie: Species;

    @OneToMany(() => Comment, comment => comment.animal, { cascade:['remove'] })
    comments: Comment[];
}
