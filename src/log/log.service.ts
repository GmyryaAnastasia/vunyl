import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Log } from '../entity/log.entity';
import { Repository } from 'typeorm';
import { Action } from '../enums/action.enum';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(Log) private userLogRepository: Repository<Log>,
  ) {}

  async getLog() {
    return this.userLogRepository.find();
  }

  @OnEvent('createUserAction')
  async handleUserAction(payload: {
    action: Action;
    modifiedBy: string;
    entityID: string;
    details?: string;
  }) {
    await this.userLogRepository.save(payload);
  }
}
