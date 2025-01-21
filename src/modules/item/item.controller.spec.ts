import { Test, TestingModule } from '@nestjs/testing';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { GetItemsByUserDto } from './dto/get-items-by-user.dto';

describe('ItemController', () => {
  let itemController: ItemController;
  let itemService: ItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemController],
      providers: [
        {
          provide: ItemService,
          useValue: {
            createItem: jest.fn(),
            getItemsByUser: jest.fn(),
          },
        },
      ],
    }).compile();

    itemController = module.get<ItemController>(ItemController);
    itemService = module.get<ItemService>(ItemService);
  });

  describe('createItem', () => {
    it('should create a new item successfully', async () => {
      const createItemDto: CreateItemDto = { title: 'Item1' };
      const result = { id: 1, title: 'Item1' };

      jest.spyOn(itemService, 'createItem').mockResolvedValue(result);

      expect(await itemController.createItem(createItemDto)).toBe(result);
      expect(itemService.createItem).toHaveBeenCalledWith('Item1');
    });

    it('should throw a validation error if title is empty', async () => {
      const createItemDto: CreateItemDto = { title: '' };

      const validationPipe = new ValidationPipe();

      await expect(
        validationPipe.transform(createItemDto, {
          type: 'body',
          metatype: CreateItemDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw a validation error if title is missing', async () => {
      const createItemDto = {}; // Missing title

      const validationPipe = new ValidationPipe();

      await expect(
        validationPipe.transform(createItemDto, {
          type: 'body',
          metatype: CreateItemDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should propagate an error from ItemService.createItem', async () => {
      const createItemDto: CreateItemDto = { title: 'Item1' };

      jest
        .spyOn(itemService, 'createItem')
        .mockRejectedValue(new Error('Database error'));

      await expect(itemController.createItem(createItemDto)).rejects.toThrow(
        'Database error',
      );
      expect(itemService.createItem).toHaveBeenCalledWith('Item1');
    });
  });

  describe('getItemsByUser', () => {
    it('should return a list of unique items for a user', async () => {
      const query: GetItemsByUserDto = { username: 'john' };
      const result = ['Item1', 'Item2', 'Item3'];

      jest.spyOn(itemService, 'getItemsByUser').mockResolvedValue(result);

      expect(await itemController.getItemsByUser(query)).toBe(result);
      expect(itemService.getItemsByUser).toHaveBeenCalledWith('john');
    });

    it('should throw a validation error if username is empty', async () => {
      const query: GetItemsByUserDto = { username: '' };

      const validationPipe = new ValidationPipe();

      await expect(
        validationPipe.transform(query, {
          type: 'query',
          metatype: GetItemsByUserDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw a validation error if username is missing', async () => {
      const query = {}; // Missing username

      const validationPipe = new ValidationPipe();

      await expect(
        validationPipe.transform(query, {
          type: 'query',
          metatype: GetItemsByUserDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should propagate an error from ItemService.getItemsByUser', async () => {
      const query: GetItemsByUserDto = { username: 'john' };

      jest
        .spyOn(itemService, 'getItemsByUser')
        .mockRejectedValue(new Error('User not found'));

      await expect(itemController.getItemsByUser(query)).rejects.toThrow(
        'User not found',
      );
      expect(itemService.getItemsByUser).toHaveBeenCalledWith('john');
    });
  });
});
