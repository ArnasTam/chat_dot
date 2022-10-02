import { body, path, request, responsesAll, summary, tagsAll } from "koa-swagger-decorator";
import { Context } from "koa";
import { Equal, getManager, Not, Repository } from "typeorm";
import { validate, ValidationError } from "class-validator";
import ChannelMapper from "../mappers/channel_mapper";
import { Channel, channelSchema } from "../entity/channel";
import { Server } from "../entity/server";

@responsesAll({
  200: { description: 'success' },
  400: { description: 'bad request' },
  401: { description: 'unauthorized, missing/wrong jwt token' },
})
@tagsAll(['`Channel'])
export default class ChannelController {
  @request('get', '/channels')
  @summary('Get all channels')
  public static async getChannels(ctx: Context): Promise<void> {
    const channelRepository: Repository<Channel> = getManager().getRepository(Channel);

    const channels: Channel[] = await channelRepository.find();

    ctx.status = 200;
    ctx.body = channels.map((channel) => ChannelMapper.mapToChannelResponseDTO(channel));
  }

  @request('get', '/channels/{id}')
  @summary('Get channel by id')
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
      ctx.status = 400;
      ctx.body = "The channel you are trying to retrieve doesn't exist in the db";
    }
  }

  @request('post', '/channels')
  @summary('Create a channel')
  @body(channelSchema)
  public static async createChannel(ctx: Context): Promise<void> {
    const channelRepository: Repository<Channel> = getManager().getRepository(Channel);
    const serverRepository: Repository<Server> = getManager().getRepository(Server);

    const server = await serverRepository.findOne({ id: ctx.request.body.serverId });

    const channelToBeSaved: Channel = new Channel();
    channelToBeSaved.name = ctx.request.body.name;
    channelToBeSaved.server = server;

    const errors: ValidationError[] = await validate(channelToBeSaved);

    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = errors;
    } else if (!server) {
      ctx.status = 400;
      ctx.body = "Server with the specified id does not exist";
    } else if (await channelRepository.findOne({ name: channelToBeSaved.name })) {
      ctx.status = 400;
      ctx.body = "Channel with the specified name already exists";
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
      ctx.body = "Server with the specified id does not exist";
    } else if (!(await channelRepository.findOne(channelToBeUpdated.id))) {
      ctx.status = 400;
      ctx.body = "The channel you are trying to update doesn't exist in the db";
    } else if (
      await channelRepository.findOne({
        id: Not(Equal(channelToBeUpdated.id)),
        name: channelToBeUpdated.name,
      })
    ) {
      ctx.status = 400;
      ctx.body = "Channel with the specified name already exists";
    } else {
      const channel = await channelRepository.save(channelToBeUpdated);
      ctx.status = 201;
      ctx.body = ChannelMapper.mapToChannelResponseDTO(channel);
    }
  }

  @request('delete', '/channels/{id}')
  @summary('Delete channel by id')
  @path({
    id: { type: 'uuid', required: true },
  })
  public static async deleteChannel(ctx: Context): Promise<void> {
    const channelRepository = getManager().getRepository(Channel);

    const channelToRemove: Channel | undefined = await channelRepository.findOne(ctx.params.id);

    // TODO: check if channel is deleted by owner
    if (!channelToRemove) {
      ctx.status = 400;
      ctx.body = "The channel you are trying to delete doesn't exist in the db";
    } else {
      await channelRepository.remove(channelToRemove);
      ctx.status = 204;
    }
  }
}
