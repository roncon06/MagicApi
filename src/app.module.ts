import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MagicModule } from './magic/magic.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import { CommanderModule } from './commander/commander.module';
import { RolesGuard } from './roles/role.guard';
import { DeckModule } from './deck/deck.module';
config();

@Module({
  imports: [ConfigModule.forRoot( {isGlobal: true} ),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    AuthModule, UsersModule, MagicModule, CommanderModule, DeckModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
