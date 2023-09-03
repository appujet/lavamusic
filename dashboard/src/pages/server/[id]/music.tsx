import config from "@/config/config";
import { GetServerSidePropsContext } from "next/types";
import { Suspense, useState } from "react";
import '@/styles/globals.scss';
import '@/styles/server.module.scss';
import { Guild } from "@/types/types";
import { getGuild } from "@/api/api";
import { ServerSlide } from "@/layouts/ServerSlide";
import { Input, Button } from "@material-tailwind/react";


type Props = {
    guild: Guild;
}

export default function Music({ guild }: Props) {
    const music = {
        title: "Sorry Sorry - Justin Bieber",
        artist: "Justin Bieber",
        duration: "3:41",
        thumbnail: "https://i.ytimg.com/vi/fRh_vgS2dFE/maxresdefault.jpg",
        url: "https://www.youtube.com/watch?v=fRh_vgS2dFE",
        isPlaying: true,
    }

    return (
        <div>
            <Suspense fallback={null}>
                <ServerSlide guild={guild} />
            </Suspense>
            <div className="flex flex-col items-center justify-center">
                <div className="w-1/1 mt-10">
                    {/*  music Player like spotify */}
                    <div className="bg-gray rounded-lg shadow-lg p-6">
                        <h1 className="text-2xl font-bold mb-4">Music Player</h1>
                        <div className="flex flex-col items-center justify-center">
                            <img src={music.thumbnail} className="rounded-lg w-96 h-96 mx-auto mb-2 transform hover:scale-110 duration-100 shadow-lg" />
                            <div className="text-white-400 font-bold pr-1 mb-2 text-center hover:shadow-lg">{music.title}</div>
                            <div className="text-white-400 font-bold pr-1 mb-2 text-center hover:shadow-lg">{music.artist}</div>
                            <div className="text-white-400 font-bold pr-1 mb-2 text-center hover:shadow-lg">{music.duration}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return await getGuild(context);
}
