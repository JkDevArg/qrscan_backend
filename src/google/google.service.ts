import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AnswerChatBotDto } from './dto/answer-chatbot.dto';

@Injectable()
export class GoogleService {
  private webhookUrl = process.env.WEBHOOK_URL;

  constructor(private readonly httpService: HttpService) {}

  async answerChatBot(message: string) {
    // Analizar el mensaje para extraer los parámetros
    const regex = /^\/bot\s*"([^"]*)"\s*,\s*"([^"]*)"\s*,\s*"([^"]*)"\s*$/;
    const match = message.match(regex);

    if (!match) {
      throw new Error('Formato de mensaje inválido');
    }

    const [, prompt, version, temperatureStr] = match;
    const temperature = parseFloat(temperatureStr);

    // Validar que temperature es un número
    if (isNaN(temperature)) {
      throw new Error('El valor de temperature no es un número válido');
    }

    // Crear el DTO a partir de los parámetros extraídos
    const answerChatBotDto: AnswerChatBotDto = {
      prompt,
      version: version || 'gemini-pro',
      temperature,
    };

    // Llamar al API de Google Generative AI
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
