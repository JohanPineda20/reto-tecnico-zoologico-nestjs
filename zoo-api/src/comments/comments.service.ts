import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Payload } from 'src/common/interfaces/payload';
import { Comment } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
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

  async update(animalId: number, user: Payload, updateCommentDto: UpdateCommentDto, commentId: number) {
    const comment = await this.commentRepository.findOne({where: {id: commentId, animal: {id: animalId}}, relations: ['author'], select: { author: {id: true, email: true}}})
    if(!comment) throw new NotFoundException(`Comment ${commentId} not found`);
    if(updateCommentDto.body){
      comment.body = updateCommentDto.body
      if(user.username !== comment.author.email) throw new ConflictException(`cannot update comment because you are not the autor`);
    }
    return await this.commentRepository.save(comment);
  }

  async remove(animalId: number, user: Payload, commentId: number){
    const comment = await this.commentRepository.findOne({where: {id: commentId, animal: {id: animalId}}, relations: ['author', 'animal'], select: { animal: {id: true, name: true}, author: {id: true, email: true}}})
    if(!comment) throw new NotFoundException(`Comment ${commentId} not found`);
    if(user.username!== comment.author.email) throw new ConflictException(`cannot delete comment because you are not the autor`);
    return await this.commentRepository.remove(comment)
  }

  async createReply(animalId: number, user: Payload, createCommentDto: CreateCommentDto, commentId: number) {
    const comment = await this.commentRepository.findOne({where: {id: commentId, animal: {id: animalId}}, relations: ['author', 'animal'], select: { animal: {id: true, name: true}, author: {id: true, email: true}}})
    if(!comment) throw new NotFoundException(`Comment not found`);
    return await this.commentRepository.save({
      body: createCommentDto.body,
      author: {id: parseInt(user.sub), email: user.username},
      animal:{id: comment.animal.id, name: comment.animal.name},
      parentComment: {id: comment.id}
    })
  }
  async findPercentageOfCommentsWithReplies(){
    const comments = await this.commentRepository.find({where: {parentComment: IsNull()}, relations: ['replies']})
    const commentsWithReplies = comments.filter((comment) => comment.replies.length > 0)
    const percentage = (commentsWithReplies.length / comments.length) * 100
    return percentage.toFixed(2) + '%'
  }
}
