import express from 'express';
import { sendContactFormEmail } from './emails.js';
export default function main() {
    const port = 8080;
    const app = express();
    app.use(express.static('../static'));
    app.listen(port, () => {
        console.log(`matthewandadelewedding.co.uk server listening on port ${port}`);
    });
    app.use(express.json());
    sendemailSetupHandler(app);
}
async function sendemailSetupHandler(app) {
    const DUPE_TIMEOUT_SUCCESS = 300000; //ms
    const DUPE_TIMEOUT_FAIL = 5000;
    const contactFormRequests = {};
    app.post('/api/sendemail', async (req, res) => {
        const time = new Date().getTime();
        const body = req.body;
        if (contactFormRequests[JSON.stringify(body)] &&
            time - contactFormRequests[JSON.stringify(body)] < DUPE_TIMEOUT_SUCCESS) {
            res.status(400).json({ message: 'duplicate request, try again later.' });
            return;
        }
        contactFormRequests[JSON.stringify(body)] = time;
        try {
            const result = await sendContactFormEmail(body.message, body.subject, body.name, body.email);
            res.status(200).json(result);
        }
        catch (e) {
            contactFormRequests[JSON.stringify(body)] =
                time - DUPE_TIMEOUT_SUCCESS + DUPE_TIMEOUT_FAIL;
            console.log(e);
            res.status(500).json(JSON.stringify(e));
        }
    });
}
main();
