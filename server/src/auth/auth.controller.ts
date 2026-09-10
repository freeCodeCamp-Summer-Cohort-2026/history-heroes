import { Body, Controller, Get, Post, Session } from '@nestjs/common';
import { SessionStoreService } from './session-store.service';
import { LoginRequestDto, loginRequestSchema } from './dto/login-request.dto';
import {
  RegisterRequestDto,
  registerRequestSchema,
} from './dto/register-request.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly sessionStoreService: SessionStoreService) {}

  // TODO:
  @Post('login')
  login(@Body({ schema: loginRequestSchema }) body: LoginRequestDto) {
    // TODO: use sessionStoreService, auth
    return { message: 'login' };
  }

  @Post('logout')
  logout() {
    // TODO: use sessionStoreService,
    return { message: 'logout' };
  }

  /**
   * test within nodejs IDLE instance with:
   */
  @Post('register')
  register(@Body({ schema: registerRequestSchema }) body: RegisterRequestDto) {
    // TODO: use sessionStoreService,
    return { message: 'register' };
  }

  /**
   * Debug route that returns current session information.
   */
  @Get('session')
  getSession(@Session() session: Record<string, any>) {
    return { session_info: session };
  }
}
