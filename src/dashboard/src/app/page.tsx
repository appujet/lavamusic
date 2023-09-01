"use client";

import React, { useState, useEffect } from 'react';
import style from '@/styles/home.module.scss';
import Loader from '@/components/Loader';
import { BsDiscord } from 'react-icons/bs';
import { IconContext } from 'react-icons';
import config from '@/config/config';
import SquigglyLines from '@/components/SquigglyLines';
import Header from '@/components/Header';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import { Button } from '@material-tailwind/react';
import { RiHeartAddFill } from 'react-icons/ri';


export default function Home() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, []);
    if (isLoading) {
        return <Loader />;
    }
    const handleInvite = () => {
        window.location.href = config.links.invite;
    }
    return (
        <div>
            <Header user={null} />
            <div className="container">
                <div className="home-page">
                    <div>
                        <div className={style.title}>
                            <h1 className='mx-auto max-w-4xl font-display text-5xl font-bold tracking-normal text-gray-300 sm:text-6xl'>
                                Create best music {" "}
                                <span className="relative whitespace-nowrap text-purple-500/60">
                                    <SquigglyLines />
                                    <span className="relative animate-pulse">experience</span>
                                </span>{" "}
                                with Lavamusic
                            </h1>
                        </div>
                        <div className={style.description}>
                            <p className="text-gray-400 text-lg max-w-4xl mx-auto"> Lavamusic is a Discord Music Bot with a lot of features like Spotify, YouTube, SoundCloud, Twitch, Listen.moe, Bandcamp, Vimeo, Direct Links, and more!</p>
                        </div>
                        <div className={style.buttonContainer}>
                            <Button color="blue" className={`${style.button} items-center rounded-md duration-100 p-2 hover:scale-110 hover:bg-blue-700 hover:mr-3`} onClick={() => router.push('/dashboard')}>
                                <IconContext.Provider value={{ className: style.icon }}>
                                    <BsDiscord />
                                </IconContext.Provider>
                                <span className="text-white-400 font-bold pr-1">Go to Dashboard</span>
                            </Button>
                            <Button color="green" className={`${style.button} items-center rounded-md duration-100 p-2 hover:scale-110 hover:bg-green-700 hover:ml-3`} onClick={handleInvite}>
                                <IconContext.Provider value={{ className: style.icon }}>
                                    <RiHeartAddFill />
                                </IconContext.Provider>
                                <span className="text-white-400 font-bold pr-1">Invite</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}