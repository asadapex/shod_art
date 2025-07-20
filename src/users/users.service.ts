import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.find();
    return users.map(user => this.mapToResponseDto(user));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.mapToResponseDto(user);
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Проверяем, не существует ли уже пользователь с таким логином
    const existingUser = await this.usersRepository.findOne({
      where: { login: createUserDto.login }
    });

    if (existingUser) {
      throw new ConflictException('User with this login already exists');
    }

    // Валидируем пароль
    if (createUserDto.password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters long');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(newUser);
    return this.mapToResponseDto(savedUser);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    // Проверяем, существует ли пользователь
    const existingUser = await this.usersRepository.findOne({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // Если обновляется логин, проверяем, не занят ли он
    if (updateUserDto.login && updateUserDto.login !== existingUser.login) {
      const userWithSameLogin = await this.usersRepository.findOne({
        where: { login: updateUserDto.login }
      });

      if (userWithSameLogin) {
        throw new ConflictException('User with this login already exists');
      }
    }

    // Если обновляется пароль, валидируем его
    if (updateUserDto.password) {
      if (updateUserDto.password.length < 6) {
        throw new BadRequestException('Password must be at least 6 characters long');
      }
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }

  async findByLogin(login: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { login } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  private mapToResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      login: user.login,
      role: user.role,
      canEditProducts: user.canEditProducts,
      canManageLogistics: user.canManageLogistics,
      created_at: user.createdAt,
      updated_at: user.updatedAt
    };
  }
}