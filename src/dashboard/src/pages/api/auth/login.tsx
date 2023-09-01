import config from '@/config/config';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.redirect(`${config.api.base}/auth/login`);
}