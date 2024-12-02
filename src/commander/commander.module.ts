import { Module } from '@nestjs/common';
import { CommanderService } from './commander.service';
import { CommanderController } from './commander.controller';
import { HttpModule } from '@nestjs/axios';
import { DeckModule } from 'src/deck/deck.module';


@Module({
  imports: [HttpModule, DeckModule],
  controllers: [CommanderController],
  providers: [CommanderService],
})
export class CommanderModule {}
