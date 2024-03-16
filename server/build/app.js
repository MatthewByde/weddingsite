import express from 'express';
import { sendContactFormEmail } from './emails.js';
export default function main() {
    const port = 8080;
    const app = express();
    app.use(express.static('../static'));
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
    app.use(express.json());
    app.post('/api/sendemail', async (req, res) => {
        const body = req.body;
        console.log(body);
        try {
            const result = await sendContactFormEmail(body.message, body.subject, body.name, body.email);
            res.status(200).json(result);
        }
        catch (e) {
            console.log(e);
            res.status(500).json(JSON.stringify(e));
        }
    });
}
main();
