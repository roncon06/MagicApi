import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DeckService } from './deck.service';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';
import { Deck } from './schemas/deck.schema';

@Controller('deck')
export class DeckController {
  constructor(private readonly deckService: DeckService) {}

  @Get()
  async getAllDecks(): Promise<Deck[]> {
    return this.deckService.getDecks();
  }
  
}
