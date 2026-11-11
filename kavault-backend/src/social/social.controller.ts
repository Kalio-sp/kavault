import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SocialService } from './social.service';

@Controller('social')
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  // Общедоступный рейтинг Task-System (без требования авторизации)
  @Get('leaderboard')
  getPublicLeaderboard(
    @Query('search') search?: string,
    @Query('lang') lang?: string,
  ) {
    return this.socialService.getPublicLeaderboard(search, lang);
  }

  // Предпросмотр публичной ссылки на подборку (без требования авторизации)
  @Get('decks/public/:slug')
  getPublicDeck(@Param('slug') slug: string) {
    return this.socialService.getPublicSharedDeck(slug);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMySummary(@Request() req) {
    return this.socialService.getMySocialSummary(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('nickname')
  updateNickname(@Request() req, @Body('nickname') nickname: string) {
    return this.socialService.updateNickname(req.user.userId, nickname);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('complete-task')
  awardTaskCompletion(
    @Request() req,
    @Body() body: { kind: string; itemId?: string },
  ) {
    return this.socialService.awardTaskCompletion(req.user.userId, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('leaderboard/friends')
  getFriendsLeaderboard(@Request() req) {
    return this.socialService.getFriendsLeaderboard(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('users/search')
  searchUsers(@Request() req, @Query('q') q: string) {
    return this.socialService.searchUsersByNickname(req.user.userId, q);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('friends')
  getFriends(@Request() req) {
    return this.socialService.getFriendsOverview(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('friends/request')
  sendFriendRequest(@Request() req, @Body('nickname') nickname: string) {
    return this.socialService.sendFriendRequest(req.user.userId, nickname);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('friends/:id/respond')
  respondFriendRequest(
    @Request() req,
    @Param('id') id: string,
    @Body('accept') accept: boolean,
  ) {
    return this.socialService.respondFriendRequest(req.user.userId, id, Boolean(accept));
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('friends/:id')
  removeFriend(@Request() req, @Param('id') id: string) {
    return this.socialService.removeFriendship(req.user.userId, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('decks/share')
  createSharedDeck(
    @Request() req,
    @Body()
    body: {
      title: string;
      description?: string;
      language?: string;
      levelFilter?: string;
      includePassages?: boolean;
    },
  ) {
    return this.socialService.createSharedDeck(req.user.userId, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('decks/mine')
  listMyDecks(@Request() req) {
    return this.socialService.listMySharedDecks(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('decks/:id')
  deleteSharedDeck(@Request() req, @Param('id') id: string) {
    return this.socialService.deleteSharedDeck(req.user.userId, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('decks/public/:slug/import')
  importPublicDeck(@Request() req, @Param('slug') slug: string) {
    return this.socialService.importPublicSharedDeck(req.user.userId, slug);
  }
}
