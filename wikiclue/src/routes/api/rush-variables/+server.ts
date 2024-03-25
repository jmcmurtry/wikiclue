import { json } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';

const sessions = new Map<string, Session>();

class Session {
	streakCount: number;
	timeRemaining: number;
	skipsRemaining: number;
	wordsToFind: string[];
	timerInterval?: NodeJS.Timeout;
	token: string;

	constructor() {
		this.streakCount = 0;
		this.timeRemaining = 0;
		this.skipsRemaining = 0;
		this.wordsToFind = [];
		this.token = '';
	}

	startTimer() {
		if (!this.timerInterval) {
			this.timerInterval = setInterval(() => {
				if (this.timeRemaining > 0) {
					this.timeRemaining -= 1;
				} else {
					clearInterval(this.timerInterval);
					this.timerInterval = undefined;
					sessions.delete(this.token);
				}
			}, 1000);
		}
	}
}

function getSession(token: string): Session {
	let session = sessions.get(token);
	if (!session) {
		session = new Session();
		session.token = token;
		sessions.set(token, session);
	}
	return session;
}

export async function POST({ request }) {
	let token = request.headers.get('Authorization') || '';
	const results = await request.json();
	if (token === '') {
		token = uuidv4();
	}
	const session = getSession(token);
	session.streakCount = results.variables.streakCount;
	session.timeRemaining = results.variables.timeRemaining;
	session.skipsRemaining = results.variables.skipsRemaining;
	session.wordsToFind = results.variables.wordsToFind;
	session.startTimer();
	return json({ status: 201, token });
}

export async function GET({ request }) {
	const token = request.headers.get('Authorization') || '';
	const session = getSession(token);
	return json({
		streakCount: session.streakCount,
		timeRemaining: session.timeRemaining,
		skipsRemaining: session.skipsRemaining,
		wordsToFind: session.wordsToFind
	});
}
