/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { Suspense, useEffect, useState } from 'react';
import { fetchMutualGuilds } from '@/api/api';
import { Guilds } from '@/types/types';
import style from '@/styles/dashboard.module.scss';
import Loader from '@/components/Loader';
import type { GetServerSidePropsContext } from 'next';
import Header from '@/components/Header';
import '@/styles/globals.scss';
import { useRouter } from 'next/router';
import React from 'react';
import Footer from '@/components/Footer';


type Props = {
    guilds: Guilds[];
}

function GuildList({ guilds }: { guilds: Guilds[] }) {
    const router = useRouter();

    const renderGuildCard = (g: Guilds) => (
        <div key={g.id} className='flex flex-col items-center justify-center'>
            <img src={`https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`} className="rounded-md w-40 h-40 mx-auto mb-2 transform hover:scale-110 duration-100 shadow-lg" />
            <div className="text-white-400 font-bold pr-1 mb-2 text-center hover:shadow-lg">{g.name}</div>
            <button onClick={() => router.push(`/server/${g.id}`)}>
                <a className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Go to Control Panel
                    <svg className="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                    </svg>
                </a>
            </button>
        </div>
    );

    return (
        <div className='grid grid-cols-4 gap-4 mt-4 mb-4 mx-auto max-w-4xl w-full'>
            {guilds.map((g, index) => (
                <React.Fragment key={g.id}>
                    {index > 0 && index % 5 === 0 && (
                        <div className="col-span-4" />
                    )}
                    {renderGuildCard(g)}
                </React.Fragment>
            ))}
        </div>
    );
}

export default function Dashboard({ guilds }: Props) {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, []);
    if (isLoading) {
        return <Loader />;
    }
    return (
        <div>
            <Header />
            <div className="container">
                <div className={style.dashboard}>
                    <div className={style.mainContent}>
                        <div className="text-white-400 font-bold pr-1 mb-10 text-4xl mt-20 text-center">Select a server to manage</div>
                        <Suspense fallback={<Loader />}>
                            <GuildList guilds={guilds} />
                        </Suspense>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}


export async function getServerSideProps(context: GetServerSidePropsContext) {
    return await fetchMutualGuilds(context);
}