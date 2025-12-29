import { inngest } from '@/lib/Inngest/client';
import { sendSignUpEmail } from '@/lib/Inngest/function';
import {serve} from 'inngest/next';


export const {GET,POST,PUT} = serve({
    client: inngest,
    functions:[sendSignUpEmail],
})