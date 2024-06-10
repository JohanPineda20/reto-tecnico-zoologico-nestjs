import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Animal } from './entities/animal.entity';
import { Between, IsNull, Repository } from 'typeorm';
import { SpeciesService } from 'src/species/species.service';
import { CommentsService } from 'src/comments/comments.service';
import { CreateCommentDto } from 'src/comments/dto/create-comment.dto';
import { Payload } from 'src/common/interfaces/payload';
import { UpdateCommentDto } from 'src/comments/dto/update-comment.dto';

@Injectable()
export class AnimalsService {
  constructor(
    @InjectRepository(Animal)
    private animalRepository: Repository<Animal>,
    private readonly specieService: SpeciesService,
    private readonly commentService: CommentsService){}
  async create(createAnimalDto: CreateAnimalDto) {
    const specie = await this.specieService.findOne(createAnimalDto.specieId)
    delete specie.animals
    return this.animalRepository.save({name: createAnimalDto.name, specie})
  }

  async findAll() {
    return await this.animalRepository.find({
      relations: ['specie', 'comments', 'comments.replies', /* 'comments.replies.replies' ... and so on for deeper levels */],
      where: { comments: { parentComment: IsNull() } },
    });
  }

  async findOne(id: number) {
    const animal = await this.animalRepository.findOne({relations: ['specie', 'comments', 'comments.author', 'comments.replies', 'comments.replies.author',  /* 'comments.replies.replies' ... and so on for deeper levels */],
      where: { id, comments: { parentComment: IsNull() } },
      select: {comments: {
        id: true,
        body: true,
        createdAt: true,
        author: { email: true },
        replies: {
          id: true,
          body: true,
          createdAt: true,
          author: { email: true },
        }}}})
    if (!animal) throw new NotFoundException(`animal not found`)
    return {
      id: animal.id,
      name: animal.name,
      createdAt: animal.createdAt,
      specie: animal.specie,
      comments: animal.comments.map((comment: any) => ({
        ...comment,
        author: comment.author.email,
        replies: comment.replies.map((reply: any) => ({
          ...reply,
          author: reply.author.email
        }))
      }))
      
  };
  }

  async update(id: number, updateAnimalDto: UpdateAnimalDto) {
    const animal = await this.findOne(id);
    delete animal.comments
    if(updateAnimalDto.specieId){
      const specie = await this.specieService.findOne(updateAnimalDto.specieId)
      animal.specie.id = specie.id;
    }
    const animalUpdated = this.animalRepository.merge(animal, updateAnimalDto)
    return await this.animalRepository.save(animalUpdated)
  }

  async remove(id: number) {
    const animal = await this.findOne(id);
    return this.animalRepository.remove(animal);
  }
  
  async createComment(id: number, user: Payload, createCommentDto: CreateCommentDto) {
    const animal = await this.findOne(id);
    return await this.commentService.create(animal, user, createCommentDto);
  }

  updateComment(id: number, user: Payload, updateCommentDto: UpdateCommentDto, commentId: number) {
    return this.commentService.update(id, user, updateCommentDto, commentId);
  }
  
  removeComment(id: number, user: Payload, commentId: number) {
    return this.commentService.remove(id, user, commentId);
  }
  createReply(id: number, user: Payload, createCommentDto: CreateCommentDto, commentId: number) {
    return this.commentService.createReply(id, user, createCommentDto, commentId);
  }
  
  findAnimalsByDate(date: string) {
    let startOfDay: Date;
    let endOfDay: Date;
    if(date){
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      if(!regex.test(date)) throw new ConflictException('Invalid date format. Use YYYY-MM-DD');
      let dateFormatted = new Date(date);
      if (isNaN(dateFormatted.getTime())) {
        throw new ConflictException('Invalid date.');
      }
      startOfDay = dateFormatted;
      endOfDay = new Date(Date.UTC(dateFormatted.getUTCFullYear(), dateFormatted.getUTCMonth(), dateFormatted.getUTCDate(),23,59,59,999));
    }
    else{
      const date = new Date();
      startOfDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0,0,0,0));
      endOfDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23,59,59,999));
    }
    return this.animalRepository.find({
      where: {
        createdAt: Between(startOfDay, endOfDay)
      },
      relations: ['specie', 'specie.area']
    })
  }
}
