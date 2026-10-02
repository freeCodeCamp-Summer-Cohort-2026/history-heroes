import {
  Body,
  ConflictException,
  Controller,
  Get,
  InternalServerErrorException,
  OnModuleInit,
  Optional,
  Post,
  Req,
  Res,
  Session,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { LoginRequestDto, loginRequestSchema } from './dto/login-request.dto';
import {
  RegisterRequestDto,
  registerRequestSchema,
} from './dto/register-request.dto';
import { UsersService } from '../users/users.service';
import { ZodValidationPipe } from '../core/pipes/zod-validation.pipe';
import { AuthenticatedGuard } from './guards/authenticated.guard';

/**
 * The auth controller manages authentication, for:
 * - login
 * - register
 * - logout
 * - session (get the current session, for debugging)
 *
 * Sessions identify users, who could be logged in or not logged in.
 */
@Controller('auth')
export class AuthController implements OnModuleInit {
  private dummyPasswordHash: string;
  private readonly saltRounds: number;

  constructor(
    private readonly userService: UsersService,
    @Optional() private readonly configService?: ConfigService,
  ) {
    const rounds = Number(
      this.configService?.get<number | string>('BCRYPT_SALT_ROUNDS', 10) ?? 10,
    );
    if (!Number.isInteger(rounds) || rounds < 10) {
      throw new Error('BCRYPT_SALT_ROUNDS must be at least 10');
    }
    this.saltRounds = rounds;
    this.dummyPasswordHash = bcrypt.hashSync(
      'dummy-password-timing-mitigation',
      this.saltRounds,
    );
  }

  async onModuleInit() {
    this.dummyPasswordHash = await bcrypt.hash(
      'dummy-password-timing-mitigation',
      this.saltRounds,
    );
  }

  @Post('login')
  async login(
    @Body(new ZodValidationPipe(loginRequestSchema)) body: LoginRequestDto,
    @Req() req: Request,
  ) {
    const user = await this.userService.getByEmail(body, {
      includePassword: true,
    });

    const hashToCompare = user?.password || this.dummyPasswordHash;
    const isPasswordValid = await this.userService.comparePassword(
      body.password,
      hashToCompare,
    );

    if (!user || !user.password || !isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    req.session.userId = user.id;

    return {
      id: user.id,
      email: user.email,
      isContentAuthor: user.isContentAuthor,
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

    const createdUser = await this.userService.create({
      email: body.email,
      password: body.password,
      isContentAuthor: body.isContentAuthor,
    });

    req.session.userId = createdUser.id;

    // TODO: need to add another service to "map" existing data that the user has on their session to their account. Maybe called "auth mapping service"
    return {
      id: createdUser.id,
      email: createdUser.email,
      isContentAuthor: createdUser.isContentAuthor,
    };
  }

  /**
   * Debug route that returns current session information.
   */
  @Get('session')
  @UseGuards(AuthenticatedGuard)
  async getSession(@Session() session: Record<string, any>) {
    if (session?.userId) {
      const user = await this.userService.getById(session.userId);
      if (user) {
        return {
          session_info: {
            ...session,
            userId: user.id,
            email: user.email,
            isContentAuthor: user.isContentAuthor,
            user: {
              id: user.id,
              email: user.email,
              isContentAuthor: user.isContentAuthor,
            },
          },
        };
      }
    }
    return { session_info: session };
  }
}
