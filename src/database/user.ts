import { PrismaClient, User } from '@prisma/client';

export default class UserData {
    static prisma = new PrismaClient();
    static async get(discordId: string): Promise<User> {
        let data = await this.prisma.user.findFirst({
            where: {
                userId: discordId,
            },
        });
        if (!data) {
            data = await this.prisma.user.create({
                data: {
                    userId: discordId,
                },
            });
        }
        return data;
    }

    static async update(discordId: string, data: any): Promise<User> {
        let user = await this.get(discordId);
        user = await this.prisma.user.update({
            where: {
                userId: discordId,
            },
            data: data,
        });
        return user;
    }
}
