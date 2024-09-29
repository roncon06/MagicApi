import { IsString, IsArray, ArrayNotEmpty } from 'class-validator';

export class ImportDeckDto {
  @IsString()
  commanderName: string;

  @IsArray()
  colors: string[];

  @IsArray()
  @ArrayNotEmpty() // Garante que o array de cartas não esteja vazio
  cards: string[];
}
