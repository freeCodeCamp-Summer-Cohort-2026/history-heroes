import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionEntity } from './entities/session.entity';
import { SessionStoreService } from './session-store.service';
import { ConfigService } from '@nestjs/config';
import session from 'express-session';
import { AuthController } from './auth.controller';

/**
 * The Auth module provides session management, and authentication management.
 */
@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity])],
  providers: [SessionStoreService],
  exports: [SessionStoreService],
  controllers: [AuthController],
})
export class AuthModule implements NestModule {
  constructor(
    private readonly sessionStore: SessionStoreService,
    private readonly configService: ConfigService,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    const isProduction =
      this.configService.get<string>('NODE_ENV')?.toLowerCase() ===
      'production';

    const defaultMaxAge = 1000 * 60 * 60 * 24 * 7; // 7 days
    const sessionMaxAge = Number(
      this.configService.get<number | string>('SESSION_MAX_AGE', defaultMaxAge),
    );
    const maxAge = Number.isFinite(sessionMaxAge)
      ? sessionMaxAge
      : defaultMaxAge;

    consumer
      .apply(
        session({
          store: this.sessionStore,
          secret: this.configService.get<string>(
            'SESSION_SECRET',
            'dev-secret',
          ),
          resave: false,
          saveUninitialized: false,
          cookie: {
            httpOnly: true,
            maxAge,
            secure: isProduction,
            sameSite: 'lax',
          },
        }),
      )
      .forRoutes('*');
  }
}
