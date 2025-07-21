import {
  Controller,
  Post,
  Body,
  HttpStatus,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiProperty,
} from "@nestjs/swagger";

class LoginDto {
  @ApiProperty({ description: "Логин пользователя", example: "admin" })
  login: string;

  @ApiProperty({ description: "Пароль пользователя", example: "password123" })
  password: string;
}

class LoginResponseDto {
  @ApiProperty({
    description: "JWT токен",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  })
  access_token: string;
}

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  @ApiOperation({ summary: "Вход в систему" })
  @ApiResponse({
    status: HttpStatus.OK,
    type: LoginResponseDto,
    description: "Успешный вход",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Неверные учетные данные",
  })
  async login(@Body() body: any) {
    // Используем any вместо DTO для теста
    const user = await this.authService.validateUser(body.login, body.password);
    if (!user) throw new UnauthorizedException("Invalid credentials");
    return this.authService.login(user);
  }
}
