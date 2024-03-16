import express from 'express';
import { sendContactFormEmail } from './emails.js';

export type SendEmailRequestBody = {
	name: string;
	email: string;
	message: string;
	subject: string;
};

export default function main() {
	const port = 8080;
	const app = express();
	app.use(express.static('../static'));
	app.listen(port, () => {
		console.log(
			`matthewandadelewedding.co.uk server listening on port ${port}`
		);
	});
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.post('/api/sendemail', async (req, res) => {
		const body = req.body as SendEmailRequestBody;
		try {
			const result = await sendContactFormEmail(
				body.message,
				body.subject,
				body.name,
				body.email
			);
			res.status(200).json(result);
		} catch (e) {
			console.log(e);
			res.status(500).json(JSON.stringify(e));
		}
	});
}

main();
