import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Record } from '../entity/record.entity';
import { ILike, Repository } from 'typeorm';
import { CreateRecordDto } from '../record/dto/create-record.dto';
import { UpdateRecordDto } from '../record/dto/update-record.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Action } from '../enums/action.enum';
import { PictureService } from '../util/picture/picture.service';

@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(Record) private recordRepository: Repository<Record>,
    private eventEmitter: EventEmitter2,
    private pictureService: PictureService,
  ) {}

  async getVinylList(filters: {
    page: number;
    size: number;
    searchTerm?: string;
    sortBy: string;
    direction: 'ASC' | 'DESC';
  }) {
    const queryBuilder = this.recordRepository.createQueryBuilder('record');

    if (filters.searchTerm) {
      queryBuilder.where([
        { name: ILike(`%${filters.searchTerm}%`) },
        { author_name: ILike(`%${filters.searchTerm}%`) },
      ]);
    }

    const records = await queryBuilder
      .leftJoinAndSelect('record.review', 'review')
      .orderBy(`record.${filters.sortBy}`, filters.direction)
      .addOrderBy('review.createdAt', 'ASC')
      .take(filters.size)
      .skip((filters.page - 1) * filters.page)
      .getMany();

    return records.map((record) => ({
      ...record,
      image: this.pictureService.convertBufferToDataURL(record.image),
      review: record.review.slice(0, 1),
    }));
  }

  async createRecord(dto: CreateRecordDto, file: Express.Multer.File) {
    const newRecord = await this.recordRepository.save({
      ...dto,
      image: file?.buffer,
    });

    this.eventEmitter.emit('createUserAction', {
      action: Action.CREATE,
      entity: 'record',
      entityID: newRecord.recordID,
      details: 'create record',
    });
    this.eventEmitter.emit(
      'addRecordToTelegram',
      `Name:${newRecord.name},\nRecord:${newRecord.author_name},\nPrice:${newRecord.price}EUR`,
    );

    return newRecord;
  }

  async updateRecord(
    recordID: string,
    dto: UpdateRecordDto,
    file: Express.Multer.File,
  ) {
    await this.recordRepository.update(recordID, {
      ...dto,
      image: file?.buffer,
    });
    this.eventEmitter.emit('createUserAction', {
      action: Action.UPDATE,
      entity: 'record',
      entityID: recordID,
      details:
        'Update:' +
        `${dto.name ? 'name' : ''}` +
        `${dto.description ? 'description' : ''}` +
        `${dto.author_name ? 'author_name' : ''} ` +
        `${dto.price ? 'price' : ''} `,
    });
  }

  async deleteRecord(recordID: string) {
    this.eventEmitter.emit('createUserAction', {
      action: Action.DELETE,
      entity: 'record',
      entityID: recordID,
      details: 'Delete record',
    });

    await this.recordRepository.delete(recordID);
  }

  @OnEvent('newScore')
  async setNewRecordScore(payload: { recordID: string; result: number }) {
    await this.recordRepository.update(
      { recordID: payload.recordID },
      { score: payload.result },
    );
  }
}
