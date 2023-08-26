import { Injectable } from '@nestjs/common';
import { User } from "@prisma/client";
import { UpdateUserDetails, UserDetails } from '../../utils/types';
import { IUserService } from '../interfaces/user';
import UserData from '../../../database/user';

@Injectable()
export class UserService implements IUserService {
    constructor() { }
    async createUser(details: UserDetails) {
        return UserData.update(details.userId, details);
    }
    async findUser(userId: string) {
        return await UserData.get(userId);
    }

    async updateUser(user: User, details: UpdateUserDetails) {
        return await UserData.update(user.userId, details);
    }
}