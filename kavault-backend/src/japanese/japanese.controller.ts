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
