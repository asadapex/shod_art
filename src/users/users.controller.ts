import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('root', 'manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить список всех пользователей' })
  @ApiResponse({ status: HttpStatus.OK, type: [UserResponseDto], description: 'Список всех пользователей' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Неавторизован' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Доступ запрещен (требуется роль root или manager)' })
  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('root', 'manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить пользователя по ID' })
  @ApiParam({ name: 'id', description: 'ID пользователя', example: 'uuid' })
  @ApiResponse({ status: HttpStatus.OK, type: UserResponseDto, description: 'Пользователь успешно найден' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Пользователь не найден' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Неавторизован' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Доступ запрещен (требуется роль root или manager)' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('root')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать нового пользователя' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: UserResponseDto, description: 'Пользователь успешно создан' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Неверные данные' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Неавторизован' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Доступ запрещен (требуется роль root)' })
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('root')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить данные пользователя' })
  @ApiParam({ name: 'id', description: 'ID пользователя', example: 'uuid' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: HttpStatus.OK, type: UserResponseDto, description: 'Пользователь успешно обновлен' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Пользователь не найден' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Неверные данные' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Неавторизован' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Доступ запрещен (требуется роль root)' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('root')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить пользователя' })
  @ApiParam({ name: 'id', description: 'ID пользователя', example: 'uuid' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Пользователь успешно удален' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Пользователь не найден' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Неавторизован' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Доступ запрещен (требуется роль root)' })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}