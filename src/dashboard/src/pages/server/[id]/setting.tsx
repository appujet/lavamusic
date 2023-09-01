import config from "@/config/config";
import { GetServerSidePropsContext } from "next/types";
import { Suspense, useState } from "react";
import '@/styles/globals.scss';
import '@/styles/server.module.scss';
import { Guild } from "@/types/types";
import { getGuild } from "@/api/api";
import { ServerSlide } from "@/layouts/ServerSlide";
import { Input, Button } from "@material-tailwind/react";
import { NotificationDialog } from "@/components/NotificationDialog";
import axios from "axios";

type Props = {
    guild: Guild;
}

export default function Setting({ guild }: Props) {
    const [newPrefix, setNewPrefix] = useState("");
    const [notificationMessage, setNotificationMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const handlePrefixChange = async () => {
        const isEmpty = /^\s*$/.test(newPrefix);
        const isTooLong = newPrefix.length > 5;
        const containsInvalidChars = /[\s@#]/.test(newPrefix);
        if (isEmpty) {
            setNotificationMessage('Prefix cannot be empty');
            setIsSuccess(false);
        } else if (isTooLong) {
            setNotificationMessage('Prefix cannot be longer than 5 characters');
            setIsSuccess(false);
        } else if (containsInvalidChars) {
            setNotificationMessage('Prefix cannot contain spaces, @, or #');
            setIsSuccess(false);
        } else {
            try {
                await axios.put(`${config.api.base}/guild/${guild.id}/prefix`, { prefix: newPrefix }, { withCredentials: true });
                setNotificationMessage('Prefix changed successfully');
                setIsSuccess(true);
            } catch (err) {
                console.error(err);
            }
        }
    }

    return (
        <div>
            <Suspense fallback={null}>
                <ServerSlide guild={guild} />
            </Suspense>
            <div className="flex flex-col items-center justify-center">
                <div className="w-1/1 mt-10">
                    <div className="bg-gray rounded-lg shadow-lg p-6">
                        <h1 className="text-2xl font-bold mb-4">Change Prefix</h1>
                        <NotificationDialog customMessage={notificationMessage} isSuccess={isSuccess} />
                        <Input
                            type="text"
                            placeholder="Prefix"
                            className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                            labelProps={{
                                className: "hidden",
                            }}
                            containerProps={{ className: "min-w-[100px]" }}
                            onChange={(e) => setNewPrefix(e.target.value)}
                            crossOrigin={undefined}
                        />
                        <Button
                            color="blue"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg cursor-pointer mt-4 justify-center"
                            onClick={handlePrefixChange}
                        >
                            Change
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return await getGuild(context);
}
