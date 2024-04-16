import { Link } from 'react-router-dom';
import PageWrapper from '../PageWrapper';

type QuestionType = {
	question: string;
	answer: React.ReactNode;
};

const questions: QuestionType[] = [
	{
		question: 'Is there a dress code?',
		answer:
			"There is not a specific dress code, please just wear clothes suitable for the formal occasion that is a wedding - and don't wear a white dress!",
	},
	{
		question: 'Is there car parking available?',
		answer:
			'Yes, there is free parking available at both Monyhull Church and Westmead Hotel.',
	},
	{
		question: 'How can I see or change my RSVP response?',
		answer: (
			<span>
				{`For security reasons, you cannot view or edit even your own response online, sorry! If you provided your email address, you will have been sent a receipt with your responses - otherwise, to view or change your response, please `}
				<Link
					to='/contact'
					className='underline text-darkAccentColor'>
					contact us
				</Link>
				.
			</span>
		),
	},
	{
		question: 'Can I bring a +1?',
		answer: (
			<span>
				{`Unfortunately, due to cost and capacity constraints, most people are not allowed to bring a +1. If you are permitted to, you will be asked to provide their details when you `}
				<Link
					to='/rsvp'
					className='underline text-darkAccentColor'>
					RSVP
				</Link>
				.
			</span>
		),
	},
	{
		question: 'Can I bring my children?',
		answer: (
			<span>
				{`Unfortunately, due to cost and capacity constraints, we have decided only to invite children of specific very close family members. If they are invited, you will be asked to provide their details when you `}
				<Link
					to='/rsvp'
					className='underline text-darkAccentColor'>
					RSVP
				</Link>
				.
			</span>
		),
	},
	{
		question: "I can't make it, will it be livestreamed?",
		answer:
			'Yes! The wedding ceremony at Monyhull Church will be livestreamed, and will be made available to watch online afterwards. Details on how to access the livestream/recording will be added to the website closer to the time.',
	},
	{
		question: 'Can I take photos?',
		answer:
			'Yes! Please do, and share them with us afterwards! A photography page and upload link will be added to the website closer to the time.',
	},
	{
		question: 'Can you recommend anywhere to stay in the local area?',
		answer: (
			<span>
				{`Westmead Hotel, our reception venue, is offering discounted rooms to our guests. Please see the `}
				<Link
					to='/travel'
					className='underline text-darkAccentColor'>
					travel page
				</Link>
				{` for more information. Otherwise, Birmingham is home to a very large number of hotels - `}
				<a
					className='underline text-darkAccentColor'
					href={`https://www.google.co.uk/travel/search?q=hotels%20near%20b48%207al&ved=0CAAQ5JsGahgKEwiIsaOc4qOFAxUAAAAAHQAAAAAQ0gE&ts=CAEaOAoaEhYKCy9nLzF2aGx4bW00OgdCNDggN2FsGgASGhIUCgcI6A8QCxgIEgcI6A8QCxgKGAIyAggBKgkKBToDR0JQGgA&qs=CAEgACgAOA1IAA&ap=KigKEgkPO0ektyRKQBHDcvbOOrkAwBISCXlhs5inO0pAEYbl7J3dLfy_MAE`}>
					click here for a selection (link to external site)
				</a>
				.
			</span>
		),
	},
	{
		question: 'How do you use and store my personal information?',
		answer: (
			<span>
				{`Please see our `}
				<Link
					to='/privacy'
					className='underline text-darkAccentColor'>
					privacy policy
				</Link>
			</span>
		),
	},
];

export default function FAQ() {
	return (
		<PageWrapper>
			<div className='flex flex-col gap-2 items-start py-8 px-8 w-full max-w-3xl text-textColor'>
				<h1
					className='text-darkAccentColor'
					style={{
						fontFamily: 'argue',
						fontSize: 'min(max(3.75vw, 2rem), 3.75rem)',
					}}>
					FAQ
				</h1>
				{questions.map(Question)}
			</div>
		</PageWrapper>
	);
}

function Question({ question, answer }: QuestionType) {
	return (
		<section className='flex flex-col pb-8'>
			<h2 className='text-3xl'>{question}</h2>
			<p>{answer}</p>
		</section>
	);
}
