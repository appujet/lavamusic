import { User } from "@prisma/client";
import { UserDetails } from '../../utils/types';

export interface IAuthService {
    validateUser(details: UserDetails): Promise<User>;
}