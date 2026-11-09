import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Patch,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  create(
    @Request() req,
    @Body()
    body: {
      title: string;
      url: string;
      type: any;
      status?: any;
      tags?: string[];
    },
  ) {
    return this.resourcesService.create(req.user.userId, body);
  }

  @Get()
  findAll(@Request() req) {
    return this.resourcesService.findAll(req.user.userId);
  }

  @Get('stats')
  getStats(@Request() req) {
    return this.resourcesService.getStats(req.user.userId);
  }

  @Patch(':id/note')
  updateNote(@Param('id') id: string, @Body('note') note: string) {
    return this.resourcesService.updateNote(id, note);
  }

  @Patch(':id/status')
  updateStatus(
    @Request() req,
    @Param('id') id: string,
    @Body('status') status: any,
  ) {
    return this.resourcesService.updateStatus(id, req.user.userId, status);
  }

  @Delete('clear/all')
  clearAll(@Request() req, @Query('type') type?: string) {
    return this.resourcesService.removeAll(req.user.userId, type);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.resourcesService.remove(id, req.user.userId);
  }
}
