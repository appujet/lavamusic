import { Module } from '@nestjs/common';
import { SERVICES } from '../utils/constants';
import { UserService } from './services/user.service';

@Module({
    providers: [
        {
            provide: SERVICES.USER,
            useClass: UserService,
        },
    ],
    exports: [
        {
            provide: SERVICES.USER,
            useClass: UserService,
        },
    ],
})
export class UserModule { }