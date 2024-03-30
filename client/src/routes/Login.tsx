import { Link } from 'react-router-dom';
import { AdminKeyContext } from '../App';
import React from 'react';
import { PKRequestResponse } from '../constants';
import { b642uint8array } from '../lib/Utils';

export default function Login() {
	const [text, setText] = React.useState<string>('Loading...');
	const { setKeys } = React.useContext(AdminKeyContext);
	React.useEffect(() => {
		const sk = sessionStorage.getItem('sk');
		if (sk) {
			fetch('/api/pk', {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
			})
				.then((resp) => resp.json())
				.then((json: PKRequestResponse) => {
					if ('errorMessage' in json) {
						console.error(json.errorMessage);
					}
					if (!('pk' in json)) {
						setText('Error - no pk in response. Credentials not changed.');
						return;
					}
					setKeys({
						adminKey: b642uint8array(sk),
						publicKey: b642uint8array(json.pk),
					});
					setText('Credentials set successfully.');
				})
				.catch((e) => {
					console.error(e);
					setText(
						`Error, credentials not changed. ${JSON.stringify(
							e,
							Object.getOwnPropertyNames(e)
						)}`
					);
				});
		} else {
			setKeys(null);
			setText('Credentials set to null');
		}
	}, [setKeys]);

	return (
		<div>
			<span>{text}</span>
			<br></br>
			<Link to='/'>Click to return to homepage</Link>
		</div>
	);
}
