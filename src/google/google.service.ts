import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AnswerChatBotDto } from './dto/answer-chatbot.dto';

@Injectable()
export class GoogleService {
  private webhookUrl = "https://chat.googleapis.com/v1/spaces/AAAAYKP6mW0/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=gF6_pQwRzij7rTOtek6RtkEHgFh_z4aQMn9N21p47us";

  constructor(private readonly httpService: HttpService) {}

  async answerChatBot(message: string) {
    if (!message) throw new BadRequestException('El mensaje es requerido');


    const temperatureStr = "0.7";
    const prompt = message;
    const version = 'gemini-pro';

    const temperature = parseFloat(temperatureStr);

    if (isNaN(temperature)) {
      throw new BadRequestException('El valor de temperature no es un número válido');
    }

    const answerChatBotDto: AnswerChatBotDto = {
      prompt,
      version: version || 'gemini-pro',
      temperature,
    };

    const genAI = new GoogleGenerativeAI(process.env.CHAT_GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: answerChatBotDto.version });
    const result = await model.generateContent(answerChatBotDto.prompt);

    const responseMessage = {
      text: result.response.text(),
    };

    await this.sendToWebhook(responseMessage);

    return result.response.text();
  }

  private async sendToWebhook(message: any) {
    try {
      const response = await lastValueFrom(this.httpService.post(this.webhookUrl, message));
      console.log('Mensaje enviado al webhook:', response.data);
    } catch (error) {
      console.error('Error al enviar el mensaje al webhook:', error.response?.data || error.message);
    }
  }
}
