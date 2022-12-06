import { Context } from 'koa';
import jwt from 'jsonwebtoken';
import { path, request, tagsAll } from 'koa-swagger-decorator';
import { getManager, Repository } from 'typeorm';
import { User } from '../entity/user';
import { config } from '../config';

import bcrypt from 'bcryptjs';
import { Role } from '../entity/role';

@tagsAll(['Auth'])
export default class AuthController {
  @request('post', '/auth/login')
  @path({
    userName: { type: 'string', required: true },
    password: { type: 'string', required: true },
  })
  public static async login(ctx: Context): Promise<void> {
    const userRepository: Repository<User> = getManager().getRepository(User);

    const user: User | undefined = await userRepository.findOne({
      userName: ctx.request.body.userName,
    });

    const passwordCompare = await bcrypt.compare(ctx.request.body.password, user.password);

    if (!passwordCompare || !user) {
      ctx.status = 401;
      ctx.body = 'Failed to login';
    } else {
      ctx.status = 200;
      ctx.body = AuthController.getJwt(user);
    }
  }

  private static getJwt(user: User) {
    const key = config.jwtSecret;
    const data = {
      userId: user.id,
      role: user.role,
      userName: user.userName,
      time: Date().toLocaleLowerCase(),
    };

    return jwt.sign(data, key);
  }

  // TODO: Move to separare util
  public static getToken(ctx: Context): Token {
    return jwt.decode(ctx.headers.authorization.split(' ')[1]) as Token;
  }
}


export class Token {
  userId: string;
  userName: string;
  role: Role;
  time: string;
}