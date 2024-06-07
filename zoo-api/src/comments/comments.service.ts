import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Payload } from 'src/common/interfaces/payload';
import { Comment } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Animal } from 'src/animals/entities/animal.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) 
    private commentRepository: Repository<Comment>){}
  
    
  /**
 * Creates a new comment for a specific post.
 *
 * @param id - The unique identifier of the post.
 * @param user - The user who is creating the comment.
 * @param createCommentDto - The data transfer object containing the details of the new comment.
 * @returns The new comment from database.
 */
  async create(animal: Animal, user:Payload, createCommentDto: CreateCommentDto) {
    return await this.commentRepository.save({
      body: createCommentDto.body,
      author: {id: parseInt(user.sub), email: user.username},
      animal:{id: animal.id, name: animal.name}
    })
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
