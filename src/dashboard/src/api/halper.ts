import { GetServerSidePropsContext } from "next";


export const validateCookie = async (context: GetServerSidePropsContext): Promise<{ Cookie: string } | false> => {
    const sessionId = context.req.cookies['connect.sid'];
    return sessionId ? 
        {
            Cookie: `connect.sid=${sessionId}`
        } : false;
}