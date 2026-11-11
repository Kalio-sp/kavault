import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ThoughtsService, type ThoughtPreferences } from './thoughts.service';

@UseGuards(AuthGuard('jwt'))
@Controller('thoughts')
export class ThoughtsController {
  constructor(private readonly thoughtsService: ThoughtsService) {}

  @Get()
  listAll(@Request() req) {
    return this.thoughtsService.listAll(req.user.userId);
  }

  @Patch('preferences')
  updatePreferences(
    @Request() req,
    @Body() body: Partial<ThoughtPreferences>,
  ) {
    return this.thoughtsService.updatePreferences(req.user.userId, body);
  }

  @Post()
  create(
    @Request() req,
    @Body()
    body: {
      title?: string;
      content: string;
      mood?: string;
      colorTag?: string;
      tags?: string[];
      isPinned?: boolean;
    },
  ) {
    return this.thoughtsService.create(req.user.userId, body);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body()
    body: {
      title?: string | null;
      content?: string;
      mood?: string | null;
      colorTag?: string;
      tags?: string[];
      isPinned?: boolean;
      isArchived?: boolean;
    },
  ) {
    return this.thoughtsService.update(req.user.userId, id, body);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.thoughtsService.remove(req.user.userId, id);
  }
}
