import { Context } from 'koa';
import jwt from 'jsonwebtoken';
import { path, request, tagsAll } from 'koa-swagger-decorator';
import { getManager, Repository } from 'typeorm';
import { User } from '../entity/user';
import { config } from '../config';

const bcrypt = require('bcrypt');

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
    let key = config.jwtSecret;
    let data = {
      userId: user.id,
      role: user.role,
      time: Date(),
    };

    return jwt.sign(data, key);
  }
}

