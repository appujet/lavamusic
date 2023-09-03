import { Metadata } from "next";
import { Inter } from 'next/font/google'
import '@/styles/globals.scss';
const inter = Inter({ subsets: ['latin'] })
import { AppProps } from "next/app";


let title = "Lavamusic - Discord Music Bot";
let description = "Lavamusic is a Discord Music Bot with a lot of features like Spotify, YouTube, SoundCloud, Twitch, Listen.moe, Bandcamp, Vimeo, Direct Links, and more!";
let sitename = "Lavamusic";
let ogimage = "https://media.discordapp.net/attachments/876035356460462090/887728792926290091/20210820_124325.png"

export const metadata: Metadata = {
    title,
    description,
    icons: {
        icon: "/favicon.ico",
    },
    openGraph: {
        images: [ogimage],
        title,
        description,
        url: "https://lavamusic.app",
        siteName: sitename,
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        images: [ogimage],
        title,
        description,
    },
};


export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    );
}