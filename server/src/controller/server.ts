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
import { Server, serverSchema } from '../entity/server';
import { User } from '../entity/user';
import ServerMapper from '../mappers/server_mapper';

@responsesAll({
  200: { description: 'success' },
  400: { description: 'bad request' },
  401: { description: 'unauthorized, missing/wrong jwt token' },
})
@tagsAll(['Server'])
export default class ServerController {
  @request('get', '/servers')
  @summary('Get all server')
  public static async getServers(ctx: Context): Promise<void> {
    const serverRepository: Repository<Server> = getManager().getRepository(Server);

    const servers: Server[] = await serverRepository.find();

    ctx.status = 200;
    ctx.body = servers.map((server) => ServerMapper.mapToServerResponseDTO(server));
  }

  @request('get', '/servers/{id}')
  @summary('Get server by id')
  @path({
    id: { type: 'uuid', required: true },
  })
  public static async getServer(ctx: Context): Promise<void> {
    const serverRepository: Repository<Server> = getManager().getRepository(Server);

    const server: Server | undefined = await serverRepository.findOne(ctx.params.id);

    if (server) {
      ctx.status = 200;
      ctx.body = ServerMapper.mapToServerResponseDTO(server);
    } else {
      ctx.status = 400;
      ctx.body = "The server you are trying to retrieve doesn't exist in the db";
    }
  }

  @request('post', '/servers')
  @summary('Create a server')
  @body(serverSchema)
  public static async createServer(ctx: Context): Promise<void> {
    const serverRepository: Repository<Server> = getManager().getRepository(Server);
    const userRepository: Repository<User> = getManager().getRepository(User);

    const admin = await userRepository.findOne({ id: ctx.request.body.adminId });

    const serverToBeSaved: Server = new Server();
    serverToBeSaved.name = ctx.request.body.name;
    serverToBeSaved.description = ctx.request.body.description;
    serverToBeSaved.admin = admin;

    const errors: ValidationError[] = await validate(serverToBeSaved);

    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = errors;
    } else if (!admin) {
      ctx.status = 400;
      ctx.body = 'Admin with the specified id does not exist';
    } else if (await serverRepository.findOne({ name: serverToBeSaved.name })) {
      ctx.status = 400;
      ctx.body = 'Server with the specified name already exists';
    } else {
      const server = await serverRepository.save(serverToBeSaved);
      ctx.status = 201;
      ctx.body = ServerMapper.mapToServerResponseDTO(server);
    }
  }

  @request('put', '/servers/{id}')
  @summary('Update a server')
  @path({
    id: { type: 'uuid', required: true },
  })
  @body(serverSchema)
  public static async updateServer(ctx: Context): Promise<void> {
    const serverRepository: Repository<Server> = getManager().getRepository(Server);
    const userRepository: Repository<User> = getManager().getRepository(User);

    const admin = await userRepository.findOne({ id: ctx.request.body.adminId });

    const serverToBeUpdated: Server = new Server();
    serverToBeUpdated.id = ctx.params.id
    serverToBeUpdated.name = ctx.request.body.name;
    serverToBeUpdated.description = ctx.request.body.description;
    serverToBeUpdated.admin = admin;

    const errors: ValidationError[] = await validate(serverToBeUpdated);

    // TODO: check if user has permissions
    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = errors;
    } else if (!admin) {
      ctx.status = 400;
      ctx.body = 'Admin with the specified id does not exist';
    } else if (!(await serverRepository.findOne(serverToBeUpdated.id))) {
      ctx.status = 400;
      ctx.body = "The server you are trying to update doesn't exist in the db";
    } else if (
      await serverRepository.findOne({
        id: Not(Equal(serverToBeUpdated.id)),
        name: serverToBeUpdated.name,
      })
    ) {
      ctx.status = 400;
      ctx.body = 'Server with the specified name already exists';
    } else {
      const server = await serverRepository.save(serverToBeUpdated);
      ctx.status = 201;
      ctx.body = ServerMapper.mapToServerResponseDTO(server);
    }
  }

  @request('delete', '/servers/{id}')
  @summary('Delete server by id')
  @path({
    id: { type: 'uuid', required: true },
  })
  public static async deleteServer(ctx: Context): Promise<void> {
    const serverRepository = getManager().getRepository(Server);

    const serverToRemove: Server | undefined = await serverRepository.findOne(ctx.params.id);

    // TODO: check if server is deleted by owner
    if (!serverToRemove) {
      ctx.status = 400;
      ctx.body = "The server you are trying to delete doesn't exist in the db";
    } else {
      await serverRepository.remove(serverToRemove);
      ctx.status = 204;
    }
  }
}
