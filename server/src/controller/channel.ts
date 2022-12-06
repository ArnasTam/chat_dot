import {
  body,
  path,
  request,
  responsesAll,
  summary,
  tagsAll
} from 'koa-swagger-decorator';
import { Context } from 'koa';
import { Equal, getManager, Not, Repository } from 'typeorm';
import { validate, ValidationError } from 'class-validator';
import ChannelMapper from '../mappers/channel_mapper';
import { Channel, channelSchema, serverChannelSchema } from '../entity/channel';
import { Server } from '../entity/server';
import AuthController, { Token } from './auth'
import { User } from '../entity/user';
import { Role } from '../entity/role'

@responsesAll({
  200: { description: 'success' },
  400: { description: 'bad request' },
  401: { description: 'unauthorized, missing/wrong jwt token' },
})
@tagsAll(['`Channel'])
export default class ChannelController {
  @request('get', '/channels')
  public static async getChannels(ctx: Context): Promise<void> {
    const channelRepository: Repository<Channel> = getManager().getRepository(Channel);

    const channels: Channel[] = await channelRepository.find();

    ctx.status = 200;
    ctx.body = channels.map((channel) => ChannelMapper.mapToChannelResponseDTO(channel));
  }

  @request('get', '/servers/{serverId}/channels')
  @path({
    serverId: { type: 'uuid', required: true },
  })
  public static async getChannelsByServerName(ctx: Context): Promise<void> {
    const serverRepository: Repository<Server> = getManager().getRepository(Server);
    const channelRepository: Repository<Channel> = getManager().getRepository(Channel);

    const server: Server | undefined = await serverRepository.findOne({ id: ctx.params.serverId });
    const channels = await channelRepository.find({ server: server });

    if (!server) {
      ctx.status = 404;
      ctx.body = "The server you specified doesn't exist in the db";
      return;
    }

    if (channels) {
      ctx.status = 200;
      ctx.body = channels.map((channel) => ChannelMapper.mapToChannelResponseDTO(channel));
    } else {
      ctx.status = 404;
      ctx.body = "The server you specified doesn't exist in the db";
    }
  }

  @request('get', '/channels/{id}')
  @path({
    id: { type: 'uuid', required: true },
  })
  public static async getChannel(ctx: Context): Promise<void> {
    const channelRepository: Repository<Channel> = getManager().getRepository(Channel);

    const channel: Channel | undefined = await channelRepository.findOne(ctx.params.id);

    if (channel) {
      ctx.status = 200;
      ctx.body = ChannelMapper.mapToChannelResponseDTO(channel);
    } else {
      ctx.status = 404;
      ctx.body = "The channel you are trying to retrieve doesn't exist in the db";
    }
  }

  @request('get', '/servers/{serverId}/channels/{channelId}')
  @path({
    serverId: { type: 'uuid', required: true },
    channelId: { type: 'uuid', required: true },
  })
  public static async getServerChannelById(ctx: Context): Promise<void> {
    const serverRepository: Repository<Server> = getManager().getRepository(Server);
    const channelRepository: Repository<Channel> = getManager().getRepository(Channel);

    const server: Server | undefined = await serverRepository.findOne({ id: ctx.params.serverId });
    const channel: Channel | undefined = await channelRepository.findOne({
      server: server,
      id: ctx.params.channelId,
    });

    if (!server) {
      ctx.status = 404;
      ctx.body = "The server you specified doesn't exist in the db";
      return;
    }

    if (channel) {
      ctx.status = 200;
      ctx.body = ChannelMapper.mapToChannelResponseDTO(channel);
    } else {
      ctx.status = 404;
      ctx.body = "The channel you are trying to retrieve doesn't exist in the db";
    }
  }

  @request('post', '/channels')
  public static async createChannel(ctx: Context): Promise<void> {
    const channelRepository: Repository<Channel> = getManager().getRepository(Channel);
    const serverRepository: Repository<Server> = getManager().getRepository(Server);
    const userRepository: Repository<User> = getManager().getRepository(User);
    const token = AuthController.getToken(ctx);

    const server = await serverRepository.findOne({ id: ctx.request.body.serverId });
    const creator = await userRepository.findOne({ id: token.userId });

    const channelToBeSaved: Channel = new Channel();
    channelToBeSaved.name = ctx.request.body.name;
    channelToBeSaved.server = server;
    channelToBeSaved.creator = creator;

    const errors: ValidationError[] = await validate(channelToBeSaved);

    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = errors;
    } else if (!server) {
      ctx.status = 400;
      ctx.body = 'Server with the specified id does not exist';
    } else if (
      await channelRepository.findOne({
        name: channelToBeSaved.name,
        server: server,
      })
    ) {
      ctx.status = 400;
      ctx.body = 'Channel with the specified name already exists';
    } else {
      const channel = await channelRepository.save(channelToBeSaved);
      ctx.status = 201;
      ctx.body = ChannelMapper.mapToChannelResponseDTO(channel);
    }
  }

  @request('post', '/servers/{serverId}/channels')
  @path({
    serverId: { type: 'uuid', required: true },
  })
  @body(serverChannelSchema)
  public static async createServerChannel(ctx: Context): Promise<void> {
    const channelRepository: Repository<Channel> = getManager().getRepository(Channel);
    const serverRepository: Repository<Server> = getManager().getRepository(Server);
    const userRepository: Repository<User> = getManager().getRepository(User);
    const token = AuthController.getToken(ctx);

    const server = await serverRepository.findOne({ id: ctx.params.serverId });
    const creator = await userRepository.findOne({ id: token.userId });

    if (server && !ChannelController.hasServerPermission(token, server)) {
      ctx.status = 403;
      ctx.body = 'No permission to perform this action';
      return;
    }

    const channelToBeSaved: Channel = new Channel();
    channelToBeSaved.name = ctx.request.body.name;
    channelToBeSaved.server = server;
    channelToBeSaved.creator = creator;

    const errors: ValidationError[] = await validate(channelToBeSaved);

    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = errors;
    } else if (!server) {
      ctx.status = 400;
      ctx.body = 'Server with the specified id does not exist';
    } else if (
      await channelRepository.findOne({
        name: channelToBeSaved.name,
        server: server,
      })
    ) {
      ctx.status = 400;
      ctx.body = 'Channel with the specified name already exists';
    } else {
      const channel = await channelRepository.save(channelToBeSaved);
      ctx.status = 201;
      ctx.body = ChannelMapper.mapToChannelResponseDTO(channel);
    }
  }

  @request('put', '/channels/{id}')
  @summary('Update a channel')
  @path({
    id: { type: 'uuid', required: true },
  })
  @body(channelSchema)
  public static async updateChannel(ctx: Context): Promise<void> {
    const channelRepository: Repository<Channel> = getManager().getRepository(Channel);
    const serverRepository: Repository<Server> = getManager().getRepository(Server);

    const server = await serverRepository.findOne({ id: ctx.request.body.serverId });

    const channelToBeUpdated: Channel = new Channel();
    channelToBeUpdated.id = ctx.params.id;
    channelToBeUpdated.name = ctx.request.body.name;
    channelToBeUpdated.server = server;

    const errors: ValidationError[] = await validate(channelToBeUpdated);

    // TODO: check if user has permissions
    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = errors;
    } else if (!server) {
      ctx.status = 400;
      ctx.body = 'Server with the specified id does not exist';
    } else if (!(await channelRepository.findOne(channelToBeUpdated.id))) {
      ctx.status = 404;
      ctx.body = "The channel you are trying to update doesn't exist in the db";
    } else if (
      await channelRepository.findOne({
        id: Not(Equal(channelToBeUpdated.id)),
        name: channelToBeUpdated.name,
      })
    ) {
      ctx.status = 400;
      ctx.body = 'Channel with the specified name already exists';
    } else {
      const channel = await channelRepository.save(channelToBeUpdated);
      ctx.status = 201;
      ctx.body = ChannelMapper.mapToChannelResponseDTO(channel);
    }
  }

  @request('put', '/servers/{serverId}/channels/{channelId}')
  @path({
    serverId: { type: 'uuid', required: true },
    channelId: { type: 'uuid', required: true },
  })
  @body(serverChannelSchema)
  public static async updateServerChannel(ctx: Context): Promise<void> {
    const channelRepository: Repository<Channel> = getManager().getRepository(Channel);
    const serverRepository: Repository<Server> = getManager().getRepository(Server);
    const token = AuthController.getToken(ctx);

    const server = await serverRepository.findOne({ id: ctx.params.serverId });

    if (server && !ChannelController.hasServerPermission(token, server)) {
      ctx.status = 403;
      ctx.body = 'No permission to perform this action';
      return;
    }

    const channelToBeUpdated: Channel = new Channel();
    channelToBeUpdated.id = ctx.params.channelId;
    channelToBeUpdated.name = ctx.request.body.name;
    channelToBeUpdated.server = server;

    const errors: ValidationError[] = await validate(channelToBeUpdated);

    // TODO: check if user has permissions
    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = errors;
    } else if (!server) {
      ctx.status = 400;
      ctx.body = 'Server with the specified id does not exist';
    } else if (
      !(await channelRepository.findOne({
        id: channelToBeUpdated.id,
        server: server,
      }))
    ) {
      ctx.status = 404;
      ctx.body = "The channel you are trying to update doesn't exist in the db";
    } else if (
      await channelRepository.findOne({
        id: Not(Equal(channelToBeUpdated.id)),
        name: channelToBeUpdated.name,
        server: server,
      })
    ) {
      ctx.status = 400;
      ctx.body = 'Channel with the specified name already exists';
    } else {
      const channel = await channelRepository.save(channelToBeUpdated);
      ctx.status = 201;
      ctx.body = ChannelMapper.mapToChannelResponseDTO(channel);
    }
  }

  @request('delete', '/channels/{id}')
  @path({
    id: { type: 'uuid', required: true },
  })
  public static async deleteChannel(ctx: Context): Promise<void> {
    const channelRepository = getManager().getRepository(Channel);

    const channelToRemove: Channel | undefined = await channelRepository.findOne(ctx.params.id);

    // TODO: check if channel is deleted by owner
    if (!channelToRemove) {
      ctx.status = 404;
      ctx.body = "The channel you are trying to delete doesn't exist in the db";
    } else {
      await channelRepository.remove(channelToRemove);
      ctx.status = 204;
    }
  }

  @request('delete', '/servers/{serverId}/channels/{channelId}')
  @path({
    serverId: { type: 'uuid', required: true },
    channelId: { type: 'uuid', required: true },
  })
  public static async deleteServerChannel(ctx: Context): Promise<void> {
    const serverRepository: Repository<Server> = getManager().getRepository(Server);
    const channelRepository: Repository<Channel> = getManager().getRepository(Channel);
    const token = AuthController.getToken(ctx);

    const server: Server | undefined = await serverRepository.findOne({ id: ctx.params.serverId });
    const channel: Channel | undefined = await channelRepository.findOne({
      server: server,
      id: ctx.params.channelId,
    });

    if (server && !ChannelController.hasServerPermission(token, server)) {
      ctx.status = 403;
      ctx.body = 'No permission to perform this action';
      return;
    }

    if (!server) {
      ctx.status = 404;
      ctx.body = "The server you specified doesn't exist in the db";
      return;
    }

    // TODO: check if channel is deleted by owner
    if (!channel) {
      ctx.status = 404;
      ctx.body = "The channel you are trying to delete doesn't exist in the db";
    } else {
      await channelRepository.remove(channel);
      ctx.status = 204;
    }
  }

  public static hasServerPermission(token: Token, server: Server): boolean {
    if (token.role == Role.SuperAdmin) return true;
    if (token.role == Role.ServerAdmin) {
      if (server.admin.id == token.userId) return true;
    }

    return false;
  }
}
