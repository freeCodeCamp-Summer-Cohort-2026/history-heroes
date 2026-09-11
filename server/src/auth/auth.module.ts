import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionEntity } from './entities/session.entity';
import { SessionStoreService } from './session-store.service';
import { ConfigService } from '@nestjs/config';
import session from 'express-session';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';

/**
 * The Auth module provides session management, and authentication management.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([SessionEntity]),
    // we require the users module for login and registration, but we don't want to create a circular dependency, so we import it here.
    UsersModule,
  ],
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
          // if you see an error about this locally, make sure
          // you copied the .env.example to .env
          secret: this.configService.getOrThrow<string>('SESSION_SECRET'),
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
