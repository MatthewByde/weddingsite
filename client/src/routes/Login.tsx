import { Link } from 'react-router-dom';
import { AdminKeyContext } from '../App';
import React from 'react';

export default function Login() {
	const { setKey } = React.useContext(AdminKeyContext);
	const sk = sessionStorage.getItem('sk');
	if (sk) {
		setKey(sk);
		return (
			<div>
				<span>Credentials added to context</span>
				<Link to='/'>Click to return to homepage</Link>
			</div>
		);
	} else {
		setKey(null);
		return (
			<div>
				<span>Credentials set to null</span>
				<Link to='/'>Click to return to homepage</Link>
			</div>
		);
	}
}
