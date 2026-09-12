import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/db/database.module';
import { SeedsModule } from './core/db/seeds/seeds.module';
import { ModulesModule } from './modules/modules.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // docs to extend:
      // https://docs.nestjs.com/techniques/configuration#configuration-validation
    }),

    // core database and seeding modules
    DatabaseModule,
    SeedsModule,

    // authentication module, primarily for session management
    AuthModule,

    // feature modules
    ModulesModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
