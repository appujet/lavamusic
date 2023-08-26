import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ROUTES } from '../../utils/constants';
import { AuthUser } from '../../utils/decorators';
import { User } from "@prisma/client";
import { AuthenticatedGuard, DiscordAuthGuard } from '../utils/Guards';


@Controller(ROUTES.AUTH)
export class AuthController {
    @Get('login')
    @UseGuards(DiscordAuthGuard)
    login() { 
        return { message: 'Redirecting to Discord...' };
    }

    @Get('redirect')
    @UseGuards(DiscordAuthGuard)
    redirect(@AuthUser() user: User) {
        return user;
    }
    
    @Get('check')
    @UseGuards(AuthenticatedGuard)
    check(@AuthUser() user: User) {
        return user;
    }
    
    @Post('logout')
    logout() {
        return { message: 'Logged out' };
    }
}