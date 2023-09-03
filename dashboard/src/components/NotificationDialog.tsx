import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Typography,
    Button,
} from "@material-tailwind/react";

export function NotificationDialog({ customMessage, isSuccess }: Props) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (customMessage) {
            setOpen(true);
        }
    }, [customMessage]);

    const handleClose = () => {
        setOpen(false);
    };

    const dialogStyle = isSuccess
        ? {
            backgroundColor: "#4CAF50", 
        }
        : {
            backgroundColor: "#F44336",
        };
    const successIcon = isSuccess ? (
        <svg
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
            className={`h-16 w-16 text-green-500`}
        >
            <path
                fill="currentColor"
                d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm-55.808 536.384-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.272 38.272 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336L456.192 600.384z"
            />
        </svg>
    ) : (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`h-16 w-16 text-red-500`}
        >
            <path
                fillRule="evenodd"
                d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
                clipRule="evenodd"
            />
        </svg>
    );
    
    return (
        <Dialog open={open} handler={handleClose}>
            <DialogHeader style={dialogStyle}>
                <Typography variant="h5" color="white">
                    {isSuccess ? "Success!" : "Your Attention is Required!"}
                </Typography>
            </DialogHeader>
            <DialogBody divider className="grid place-items-center gap-4">
                {successIcon}
                <Typography
                    color={isSuccess ? "white" : "red"}
                    variant="h4"
                    className="font-semibold"
                >
                    {isSuccess ? "Success!" : "You should read this!"}
                </Typography>
                <Typography className="text-center font-normal">
                    {customMessage || "This is a notification message"}
                </Typography>
            </DialogBody>
            <DialogFooter className="space-x-2">
                <Button
                    variant="text"
                    color={isSuccess ? "white" : "blue-gray"}
                    onClick={handleClose}
                >
                    Close
                </Button>
                <Button
                    color={isSuccess ? "white" : "blue"}
                    variant="filled"
                    onClick={handleClose}
                >
                    Ok, Got it
                </Button>
            </DialogFooter>
        </Dialog>
    );
}

type Props = {
    customMessage?: string;
    isSuccess?: boolean;
};
