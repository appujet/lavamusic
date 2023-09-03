
"use client";

import style from '@/styles/server.module.scss';
import React from "react";
import {
    Card,
    Typography,
    List,
    ListItem,
    ListItemPrefix,
    ListItemSuffix,
    Chip,
    Accordion,
    AccordionHeader,
    AccordionBody,
    Alert,
    Button,
    CardBody,
    CardFooter,
    CardHeader,
} from "@material-tailwind/react";
import { MdSpaceDashboard } from "react-icons/md";
import { Guild } from "@/types/types";
import { RiSettings4Fill } from "react-icons/ri";
import { SiApplemusic } from "react-icons/si";
import { useRouter } from 'next/router';


export function ServerSlide({ guild }: { guild: Guild }) {
    const router = useRouter();
    return (
        <div>
        <Card className={style.serverSlide}>
            <CardHeader className="bg-transparent">
                <div className="flex flex-col items-center justify-center">
                    <img
                        src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                        className={`rounded-full w-15 h-15 mx-auto mb-2 transform hover:scale-110 duration-100 shadow-lg`}
                    />
                </div>
                <div className="text-white pr-1 text-center hover:shadow-lg">
                    {guild.name}
                </div>
            </CardHeader>
            <CardBody>
                <List className="text-white">
                        <ListItem className='hover:shadow-lg' onClick={() => router.push('/dashboard')}>
                        <ListItemPrefix>
                            < MdSpaceDashboard className="h-5 w-5" />
                        </ListItemPrefix>
                        Dashboard
                        </ListItem>
                        <ListItem className='hover:shadow-lg' onClick={() => router.push(`/server/${guild.id}/setting`)}>
                            <ListItemPrefix>
                                < RiSettings4Fill className="h-5 w-5" />
                            </ListItemPrefix>
                            Settings
                        </ListItem>
                        <ListItem className='hover:shadow-lg' onClick={() => router.push(`/server/${guild.id}/music`)}>
                            <ListItemPrefix>
                                < SiApplemusic className="h-5 w-5" />
                            </ListItemPrefix>
                            Music
                        </ListItem>
                </List>
            </CardBody>
            </Card>
        </div>
    );
}
