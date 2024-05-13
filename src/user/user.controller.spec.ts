import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { UserController } from 'user/user.controller';
import { UserService } from 'user/user.service';
import { PictureService } from 'util/picture/picture.service';
import { User } from 'entity/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtModuleWrapper } from 'jwt/jwt.module';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let pictureService: PictureService;
  let usersRepository: Repository<User>;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [JwtModuleWrapper],
      controllers: [UserController],
      providers: [
        UserService,
        PictureService,
        {
          provide: EventEmitter2,
          useValue: new EventEmitter2(),
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            update: jest.fn(),
            delete: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    const app = moduleFixture.createNestApplication();

    await app.init();

    userService = moduleFixture.get<UserService>(UserService);
    eventEmitter = moduleFixture.get<EventEmitter2>(EventEmitter2);
    userController = moduleFixture.get<UserController>(UserController);
    pictureService = moduleFixture.get<PictureService>(PictureService);
    usersRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );
  });

  describe('updateProfile', () => {
    it('should update the user profile with the provided data and emit the createUserAction event', async () => {
      const userID = 'exampleUserID';
      const req = { userID } as Request;
      const res = {
        end: jest.fn(),
      } as unknown as Response;

      const dto = {
        firstName: 'John',
        lastName: 'Doe',
        birthDate: new Date('2023-01-01'),
        picture: Buffer.from('...', 'utf-8'),
      };

      const file: Express.Multer.File = {
        fieldname: 'picture',
        originalname: 'fipng.png',
        encoding: '7bit',
        mimetype: 'image/png',
        buffer: Buffer.from([137]),
        size: 4936,
        stream: null,
        destination: '',
        filename: '',
        path: '',
      };

      jest.spyOn(usersRepository, 'update').mockResolvedValue(undefined);
      const emitSpy = jest.spyOn(eventEmitter, 'emit');

      await userController.updateProfile(req, dto, file, res);

      expect(usersRepository.update).toHaveBeenCalledWith(userID, {
        ...dto,
        picture: file.buffer,
      });
      expect(emitSpy).toHaveBeenCalledWith('createUserAction', {
        action: 'update',
        entity: 'user',
        entityID: userID,
        details: `Update:${dto.firstName ? 'firstName' : ''}${dto.lastName ? 'lastName' : ''}${dto.birthDate ? 'birthDate' : ''}${dto.picture ? 'picture' : ''}`,
      });
    });
  });

  describe('deleteProfile', () => {
    it('should delete the user profile', async () => {
      const userID = 'exampleUserID';
      const req = {
        userID,
      } as unknown as Request;
      const res = {
        clearCookie: jest.fn(),
        end: jest.fn(),
      } as unknown as Response;

      jest.spyOn(usersRepository, 'delete').mockResolvedValue(undefined);

      await userController.deleteProfile(req, res);
      expect(usersRepository.delete).toHaveBeenCalledWith({ id: userID });
    });

    it('should emit "createUserAction" event', async () => {
      const userID = 'exampleUserID';
      const req = {
        userID,
      } as unknown as Request;

      const res = {
        clearCookie: jest.fn(),
        end: jest.fn(),
      } as unknown as Response;

      jest.spyOn(usersRepository, 'delete').mockResolvedValue(undefined);
      const emitSpy = jest.spyOn(eventEmitter, 'emit');

      await userController.deleteProfile(req, res);
      expect(emitSpy).toHaveBeenCalledWith('createUserAction', {
        action: 'delete',
        entity: 'user',
        entityID: userID,
        details: 'Delete profile',
      });
    });
  });
});
