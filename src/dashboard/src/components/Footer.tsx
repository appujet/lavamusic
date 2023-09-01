"use client";

import { Typography } from "@material-tailwind/react";

export default function Footer() {
    return (
        <footer className="w-full bg-gray py-8 p-4 mt-60">
            <div className="flex flex-row flex-wrap items-center justify-center gap-y-6 gap-x-10 bg-gray text-center md:justify-between">
                <img src="/logo.png" alt="logo-ct" className="w-10" />
                <ul className="flex flex-wrap items-center gap-y-2 gap-x-8">
                    <li>
                        <Typography
                            as="a"
                            href="#"
                            color="white"
                            className="font-normal transition-colors hover:text-purple-500 focus:text-purple-500"
                        >
                            About Us
                        </Typography>
                    </li>
                    <li>
                        <Typography
                            as="a"
                            href="https://github.com/brblacky/lavamusic/main/README.md"
                            color="white"
                            className="font-normal transition-colors hover:text-purple-500 focus:text-purple-500"
                        >
                            License
                        </Typography>
                    </li>
                    <li>
                        <Typography
                            as="a"
                            href="https://github.com/brblacky/lavamusic"
                            color="white"
                            className="font-normal transition-colors hover:text-purple-500 focus:text-purple-500"
                        >
                            Contribute
                        </Typography>
                    </li>
                    <li>
                        <Typography
                            as="a"
                            href="#"
                            color="white"
                            className="font-normal transition-colors hover:text-purple-500 focus:text-purple-500"
                        >
                            Contact Us
                        </Typography>
                    </li>
                </ul>
            </div>
            <hr className="my-8 border-blue-gray-50" />
            <Typography color="white" className="text-center">
                &copy; 2023 by Lavamusic. All rights reserved.
            </Typography>
        </footer>
    );
}