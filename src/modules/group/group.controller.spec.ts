import { Test, TestingModule } from '@nestjs/testing';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import {
  ValidationPipe,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

describe('GroupController', () => {
  let groupController: GroupController;
  let groupService: GroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupController],
      providers: [
        {
          provide: GroupService,
          useValue: {
            createGroup: jest.fn(() => Promise.resolve()),
            addUserToGroup: jest.fn(() => Promise.resolve()),
            addItemToGroup: jest.fn(() => Promise.resolve()),
          },
        },
      ],
    }).compile();

    groupController = module.get<GroupController>(GroupController);
    groupService = module.get<GroupService>(GroupService);
  });

  describe('createGroup', () => {
    it('should create a new group successfully', async () => {
      const createGroupDto: CreateGroupDto = { title: 'Group A' };
      const result = { id: 1, title: 'Group A' };

      jest.spyOn(groupService, 'createGroup').mockResolvedValue(result);

      expect(await groupController.createGroup(createGroupDto)).toBe(result);
      expect(groupService.createGroup).toHaveBeenCalledWith('Group A');
    });

    it('should throw a validation error if group title is empty', async () => {
      const createGroupDto: CreateGroupDto = { title: '' };

      const validationPipe = new ValidationPipe();

      await expect(
        validationPipe.transform(createGroupDto, {
          type: 'body',
          metatype: CreateGroupDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw a validation error if group title is missing', async () => {
      const createGroupDto = {}; // Missing title

      const validationPipe = new ValidationPipe();

      await expect(
        validationPipe.transform(createGroupDto, {
          type: 'body',
          metatype: CreateGroupDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should propagate an error from the service', async () => {
      const createGroupDto: CreateGroupDto = { title: 'Group A' };

      jest
        .spyOn(groupService, 'createGroup')
        .mockRejectedValue(new Error('Database error'));

      await expect(groupController.createGroup(createGroupDto)).rejects.toThrow(
        'Database error',
      );

      expect(groupService.createGroup).toHaveBeenCalledWith('Group A');
    });
  });

  describe('addUserToGroup', () => {
    it('should add a user to a group successfully', async () => {
      const groupId = 1;
      const userId = 1;
      const result = {
        id: 1,
        title: 'Group A',
        users: [{ id: 1, username: 'john' }],
      };

      jest.spyOn(groupService, 'addUserToGroup').mockResolvedValue(result);

      expect(await groupController.addUserToGroup(groupId, userId)).toBe(
        result,
      );
      expect(groupService.addUserToGroup).toHaveBeenCalledWith(groupId, userId);
    });

    it('should throw an error if the group does not exist', async () => {
      const groupId = 99;
      const userId = 1;

      jest
        .spyOn(groupService, 'addUserToGroup')
        .mockRejectedValue(new NotFoundException('Group not found'));

      await expect(
        groupController.addUserToGroup(groupId, userId),
      ).rejects.toThrow('Group not found');

      expect(groupService.addUserToGroup).toHaveBeenCalledWith(groupId, userId);
    });
  });

  describe('addItemToGroup', () => {
    it('should add an item to a group successfully', async () => {
      const groupId = 1;
      const itemId = 1;
      const result = {
        id: 1,
        title: 'Group A',
        items: [{ id: 1, title: 'Item1' }],
      };

      jest.spyOn(groupService, 'addItemToGroup').mockResolvedValue(result);

      expect(await groupController.addItemToGroup(groupId, itemId)).toBe(
        result,
      );
      expect(groupService.addItemToGroup).toHaveBeenCalledWith(groupId, itemId);
    });

    it('should throw an error if the group does not exist', async () => {
      const groupId = 99;
      const itemId = 1;

      jest
        .spyOn(groupService, 'addItemToGroup')
        .mockRejectedValue(new NotFoundException('Group not found'));

      await expect(
        groupController.addItemToGroup(groupId, itemId),
      ).rejects.toThrow('Group not found');

      expect(groupService.addItemToGroup).toHaveBeenCalledWith(groupId, itemId);
    });
  });
});
