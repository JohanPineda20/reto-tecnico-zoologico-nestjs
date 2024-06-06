import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RolesService } from 'src/roles/roles.service';
import * as bcryptjs from 'bcryptjs';
import { RoleEnum } from 'src/common/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly rolesService: RolesService
  ) {}
  async create(createUserDto: CreateUserDto) {
    const userDni = await this.usersRepository.findOneBy({dni: createUserDto.dni});
    if (userDni) {
      throw new ConflictException(`user already exists with dni: ${createUserDto.dni}`);
    }
    const userEmail = await this.findOneByEmail(createUserDto.email);
    if (userEmail) {
      throw new ConflictException(`user already exists with email: ${createUserDto.email}`);
    }
    const role = await this.rolesService.findByName(RoleEnum.EMPLOYEE);
    if (!role) {
      throw new NotFoundException("role not found");
    }
    createUserDto.password = await bcryptjs.hash(createUserDto.password, 10)
    const {password, token, role: { name: roleName }, ...user} = await this.usersRepository.save({...createUserDto, role});
    return {...user, roleName};
  }
  async findOneByEmail(email: string){
    return await this.usersRepository.findOne({
      where: { email },
      relations: ['role']
    });
  }
  async saveToken(user: User, token:string){
    user.token = token;
    await this.usersRepository.save(user);
  }
  async findOneByToken(token: string){
    return await this.usersRepository.findOneBy({token})
  }
  async findOneById(id: number){
    const user = await this.usersRepository.findOne({where: {id}, relations: ['role'] });
    if(!user){
      throw new NotFoundException(`user not found`);
    }
    return user;
  }
}
