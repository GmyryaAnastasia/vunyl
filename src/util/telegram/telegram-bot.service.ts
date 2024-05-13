import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { OnEvent } from '@nestjs/event-emitter';
import * as process from 'process';

@Injectable()
export class TelegramBotService {
  private bot: Telegraf;

  constructor() {
    this.bot = new Telegraf(process.env.TG_TOKEN);
  }

  @OnEvent('addRecordToTelegram')
  async sendMessage(message: string): Promise<void> {
    const chatId = process.env.TG_CHAT_ID;
    await this.bot.telegram.sendMessage(chatId, message);
  }
}
