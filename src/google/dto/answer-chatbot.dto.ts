import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class AnswerChatBotDto {
  @IsString()
  prompt: string;

  @IsOptional()
  @IsString()
  version?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  temperature?: number;
}
