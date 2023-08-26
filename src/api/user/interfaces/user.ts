import { User } from "@prisma/client";
import { UpdateUserDetails, UserDetails } from '../../utils/types';

export interface IUserService {
    createUser(details: UserDetails): Promise<User>;
    findUser(discordId: string): Promise<User | undefined>;
    updateUser(user: User, details: UpdateUserDetails): Promise<User>;
}