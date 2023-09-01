import { GetServerSidePropsContext } from "next";
import { validateCookie } from "./halper";
import config from "@/config/config";
import { Guilds, Guild } from '@/types/types';
import axios from "axios";


export const fetchMutualGuilds = async (context: GetServerSidePropsContext) => {
    const headers = await validateCookie(context) as any;
    if (!headers) return { redirect: { destination: '/', permanent: false } };
    try {
        const { data } = await axios.get(`${config.api.base}/guilds`, {
            headers: headers
        });
        const guilds: Guilds[] = data.data;
        return { props: { guilds } };
    } catch (error) {
        console.error(error);
        return { redirect: { destination: '/api/auth/login', permanent: false } };
    }
}

export const isLogin = async (context: GetServerSidePropsContext) => {
    const headers = await validateCookie(context) as any;
    if (!headers) return { redirect: { destination: '/api/auth/login', permanent: false } };
    try {
        const { data } = await axios.get(`${config.api.base}/me`, {
            headers: headers
        });
        const user = data;
        return { props: { user } };
    } catch (error) {
        console.error(error);
        return { redirect: { destination: '/api/auth/login', permanent: false } };
    }
}

export const getGuild = async (context: GetServerSidePropsContext) => {
    const headers = await validateCookie(context) as any;
    if (!headers) return { redirect: { destination: '/api/auth/login', permanent: false } };
    try {
        const { data } = await axios.get(`${config.api.base}/guild/${context.query.id}`, {
            headers: headers
        });
        const guild: Guild = data;
        return { props: { guild } };
    } catch (error) {
        console.error(error);
        return { redirect: { destination: '/api/auth/login', permanent: false } };
    }
}