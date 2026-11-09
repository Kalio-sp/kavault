import { CardType } from '@prisma/client';

export class CreateCardDto {
  word: string;
  reading?: string;
  meaning: string;
  example?: string;
  type?: CardType;
}
