import Loader from "@/components/Loader";
import { GetServerSidePropsContext } from "next/types";
import { Suspense, useEffect, useState } from "react";
import '@/styles/globals.scss';
import '@/styles/server.module.scss';
import { Guild } from "@/types/types";
import { getGuild } from "@/api/api";
import { ServerSlide } from "@/layouts/ServerSlide";


type Props = {
    guild: Guild;
}


export default function Server({ guild }: Props) {
    
    return (
        <div>
            <Suspense fallback={null}>
                <ServerSlide guild={guild} />
            </Suspense>
        </div>
    );
}


export async function getServerSideProps(context: GetServerSidePropsContext) {
    return await getGuild(context);
}
