import { Animal } from "src/animals/entities/animal.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @ManyToOne(() => User)
  @JoinColumn({name: 'user_id'})
  author: User;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Animal, animal => animal.comments, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'animal_id'})
  animal: Animal;

  @ManyToOne(() => Comment, { nullable: true, onDelete: 'CASCADE'})
  @JoinColumn({name: 'parent_id'})
  parentComment: Comment;

  @OneToMany(() => Comment, comment => comment.parentComment, {cascade: true})
  replies: Comment[];
}