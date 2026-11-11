import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  Delete,
} from '@nestjs/common';
import { JapaneseService } from './japanese.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('japanese')
export class JapaneseController {
  constructor(private readonly japaneseService: JapaneseService) {}

  @Post()
  create(
    @Request() req,
    @Body()
    body: {
      word: string;
      reading?: string;
      meaning: string;
      example?: string;
      type?: any;
      language?: string;
    },
  ) {
    return this.japaneseService.create(req.user.userId, body);
  }

  @Post('bulk')
  createBulk(
    @Request() req,
    @Body('items')
    items: Array<{
      word: string;
      reading?: string;
      meaning: string;
      example?: string;
      type?: any;
      language?: string;
    }>,
    @Body('language') language?: string,
  ) {
    return this.japaneseService.createBulk(req.user.userId, items || [], language);
  }

  @Get()
  findAll(@Request() req, @Query('language') language?: string) {
    return this.japaneseService.findAll(req.user.userId, language);
  }

  @Get('passages')
  listPassages(
    @Request() req,
    @Query('language') language?: string,
    @Query('kind') kind?: string,
  ) {
    return this.japaneseService.listPassages(req.user.userId, language, kind);
  }

  @Post('passages')
  createPassage(
    @Request() req,
    @Body()
    body: {
      language?: string;
      kind?: string;
      level?: string;
      title: string;
      content: string;
      translation: string;
      notes?: string;
    },
  ) {
    return this.japaneseService.createPassage(req.user.userId, body);
  }

  @Delete('passages/:id')
  removePassage(@Request() req, @Param('id') id: string) {
    return this.japaneseService.removePassage(id, req.user.userId);
  }

  @Post(':id/review')
  review(@Param('id') id: string, @Body('isCorrect') isCorrect: boolean) {
    return this.japaneseService.processReview(id, isCorrect);
  }

  @Delete('clear/all')
  clearAll(
    @Request() req,
    @Query('section') section?: string,
    @Query('language') language?: string,
  ) {
    return this.japaneseService.removeAll(req.user.userId, section, language);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.japaneseService.remove(id, req.user.userId);
  }
}
