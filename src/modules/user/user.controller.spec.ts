import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ValidationPipe, BadRequestException } from '@nestjs/common';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn(),
            findUserByUsername: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const createUserDto: CreateUserDto = { username: 'john' };
      const result = { id: 1, username: 'john' };

      jest.spyOn(userService, 'findUserByUsername').mockResolvedValue(null); // No existing user
      jest.spyOn(userService, 'createUser').mockResolvedValue(result);

      expect(await userController.createUser(createUserDto)).toBe(result);
      expect(userService.findUserByUsername).toHaveBeenCalledWith('john');
      expect(userService.createUser).toHaveBeenCalledWith('john');
    });

    it('should throw a validation error if username is empty', async () => {
      const createUserDto: CreateUserDto = { username: '' };

      const validationPipe = new ValidationPipe();

      await expect(
        validationPipe.transform(createUserDto, {
          type: 'body',
          metatype: CreateUserDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw a validation error if username is missing', async () => {
      const createUserDto = {}; // Missing username

      const validationPipe = new ValidationPipe();

      await expect(
        validationPipe.transform(createUserDto, {
          type: 'body',
          metatype: CreateUserDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if username is already taken', async () => {
      const createUserDto: CreateUserDto = { username: 'john' };

      jest.spyOn(userService, 'findUserByUsername').mockResolvedValue({
        id: 1,
        username: 'john',
      }); // Mock an existing user

      await expect(userController.createUser(createUserDto)).rejects.toThrow(
        'Username is already taken',
      );

      expect(userService.findUserByUsername).toHaveBeenCalledWith('john');
      expect(userService.createUser).not.toHaveBeenCalled();
    });

    it('should propagate an error from the service', async () => {
      const createUserDto: CreateUserDto = { username: 'john' };

      jest.spyOn(userService, 'findUserByUsername').mockResolvedValue(null); // No existing user
      jest
        .spyOn(userService, 'createUser')
        .mockRejectedValue(new Error('Database error'));

      await expect(userController.createUser(createUserDto)).rejects.toThrow(
        'Database error',
      );

      expect(userService.findUserByUsername).toHaveBeenCalledWith('john');
      expect(userService.createUser).toHaveBeenCalledWith('john');
    });
  });
});
