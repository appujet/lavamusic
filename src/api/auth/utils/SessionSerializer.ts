import { Inject } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { IUserService } from '../../user/interfaces/user';
import { SERVICES } from '../../utils/constants';
import { User } from '@prisma/client'
import { Done } from '../../utils/types';

export class SessionSerializer extends PassportSerializer {
    constructor(
        @Inject(SERVICES.USER) private readonly userService: IUserService,
    ) {
        super();
    }
    serializeUser(user: User, done: Done) {
        done(null, user);
    }

    async deserializeUser(user: User, done: Done) {
        try {
            const userDB = await this.userService.findUser(user.userId);
            return userDB ? done(null, userDB) : done(null, null);
        } catch (err) {
            done(err, null);
        }
    }
}