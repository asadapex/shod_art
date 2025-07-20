import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEnum, IsBoolean, IsOptional } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ description: "Логин пользователя", example: "admin" })
  @IsString()
  login: string;

  @ApiProperty({ description: "Пароль пользователя", example: "password123" })
  @IsString()
  password: string;

  @ApiProperty({
    description: "Роль пользователя",
    enum: ["root", "worker", "manager", "logistics", "smm", "call-center"],
    example: "root",
  })
  @IsEnum(["root", "worker", "manager", "logistics", "smm", "call-center"])
  role: "root" | "worker" | "manager" | "logistics" | "smm" | "call-center";

  @ApiProperty({
    description: "Может ли редактировать продукты",
    example: true,
  })
  @IsBoolean()
  canEditProducts: boolean;

  @ApiProperty({ description: "Может ли управлять логистикой", example: true })
  @IsBoolean()
  canManageLogistics: boolean;
}

export class UpdateUserDto {
  @ApiProperty({
    description: "Логин пользователя",
    example: "admin",
    required: false,
  })
  @IsString()
  @IsOptional()
  login?: string;

  @ApiProperty({
    description: "Пароль пользователя",
    example: "newpassword123",
    required: false,
  })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({
    description: "Роль пользователя",
    enum: ["root", "worker", "manager", "logistics", "smm", "call-center"],
    example: "manager",
    required: false,
  })
  @IsEnum(["root", "worker", "manager", "logistics", "smm", "call-center"])
  @IsOptional()
  role?: "root" | "worker" | "manager" | "logistics" | "smm" | "call-center";

  @ApiProperty({
    description: "Может ли редактировать продукты",
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  canEditProducts?: boolean;

  @ApiProperty({
    description: "Может ли управлять логистикой",
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  canManageLogistics?: boolean;
}

export class UserResponseDto {
  @ApiProperty({ description: "ID пользователя", example: "uuid" })
  id: string;

  @ApiProperty({ description: "Логин пользователя", example: "admin" })
  login: string;

  @ApiProperty({
    description: "Роль пользователя",
    enum: ["root", "worker", "manager", "logistics", "smm", "call-center"],
    example: "root",
  })
  role: "root" | "worker" | "manager" | "logistics" | "smm" | "call-center";

  @ApiProperty({
    description: "Может ли редактировать продукты",
    example: true,
  })
  canEditProducts: boolean;

  @ApiProperty({ description: "Может ли управлять логистикой", example: true })
  canManageLogistics: boolean;

  @ApiProperty({
    description: "Дата создания",
    example: "2025-07-19T10:18:00.000Z",
  })
  created_at: Date;

  @ApiProperty({
    description: "Дата обновления",
    example: "2025-07-19T10:18:00.000Z",
  })
  updated_at: Date;
}
