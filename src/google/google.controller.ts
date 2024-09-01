import { Body, Controller, Post } from '@nestjs/common';
import { GoogleService } from './google.service';

@Controller('google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Post()
  async create(@Body('message') message: string) {
    return this.googleService.answerChatBot(message);
  }
}
