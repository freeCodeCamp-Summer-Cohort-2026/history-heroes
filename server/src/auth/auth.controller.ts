import {
  Body,
  ConflictException,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  Session,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { LoginRequestDto, loginRequestSchema } from './dto/login-request.dto';
import {
  RegisterRequestDto,
  registerRequestSchema,
} from './dto/register-request.dto';
import { UsersService } from '../users/users.service';
import { ZodValidationPipe } from '../core/pipes/zod-validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UsersService) {}

  @Post('login')
  async login(
    @Body(new ZodValidationPipe(loginRequestSchema)) body: LoginRequestDto,
    @Req() req: Request,
  ) {
    const user = await this.userService.getByEmail(body);

    if (!user || user.password !== body.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    req.session.userId = user.id;

    return {
      id: user.id,
      email: user.email,
    };
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    if (req.session) {
      await new Promise<void>((resolve, reject) => {
        req.session.destroy((err) => {
          if (err) {
            return reject(new InternalServerErrorException('Failed to logout'));
          }
          resolve();
        });
      });
    }

    res.clearCookie('connect.sid', { path: '/' });
    return { message: 'Logged out successfully' };
  }

  @Post('register')
  async register(
    @Body(new ZodValidationPipe(registerRequestSchema))
    body: RegisterRequestDto,
    @Req() req: Request,
  ) {
    const existingUser = await this.userService.getByEmail(body);
    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const createdUser = await this.userService.create(body);

    req.session.userId = createdUser.id;

    return {
      id: createdUser.id,
      email: createdUser.email,
    };
  }

  /**
   * Debug route that returns current session information.
   */
  @Get('session')
  getSession(@Session() session: Record<string, any>) {
    return { session_info: session };
  }
}
