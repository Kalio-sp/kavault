import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service';
import { AdminGuard } from './admin.guard';

@UseGuards(AuthGuard('jwt'), AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getStats() {
    return this.adminService.getGlobalStats();
  }

  @Get('users')
  getUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('users/:id')
  getUserDetails(@Param('id') id: string) {
    return this.adminService.getUserDetails(id);
  }

  @Post('users')
  createUser(
    @Body()
    body: {
      email: string;
      password: string;
      studyLanguage?: string;
      showProgramming?: boolean;
      onboardingCompleted?: boolean;
    },
  ) {
    return this.adminService.createUser(body);
  }

  @Patch('users/:id')
  updateUser(
    @Param('id') id: string,
    @Body()
    body: {
      studyLanguage?: string;
      showProgramming?: boolean;
      onboardingCompleted?: boolean;
      newPassword?: string;
    },
  ) {
    return this.adminService.updateUser(id, body);
  }

  @Get('users/:id/export')
  exportSingleUser(@Param('id') id: string) {
    return this.adminService.exportSingleUser(id);
  }

  @Delete('users/:id/data')
  purgeUserData(@Param('id') id: string) {
    return this.adminService.purgeUserData(id);
  }

  @Delete('users/:id')
  deleteUser(@Request() req, @Param('id') id: string) {
    return this.adminService.deleteUser(id, req.user.userId);
  }

  @Post('users/bulk-delete')
  bulkDeleteUsers(@Request() req, @Body('ids') ids: string[]) {
    return this.adminService.bulkDeleteUsers(ids, req.user.userId);
  }

  @Post('clear-tts-cache')
  clearTtsCache() {
    return this.adminService.clearTtsCache();
  }

  @Post('seed-demo')
  seedDemo(@Request() req) {
    return this.adminService.seedDemoContent(req.user.userId);
  }

  @Get('export-all')
  exportAll() {
    return this.adminService.exportEntireDatabase();
  }
}
