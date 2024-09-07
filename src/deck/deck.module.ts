// src/deck/deck.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeckService } from './deck.service';
import { DeckSchema } from './schemas/deck.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Deck', schema: DeckSchema }])],
  providers: [DeckService],
  exports: [DeckService],
})
export class DeckModule {}
