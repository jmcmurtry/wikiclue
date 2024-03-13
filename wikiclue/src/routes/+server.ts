import file from 'fs';
import { json } from '@sveltejs/kit';

const filePath = 'static/assets/words.txt';
let allWords: string[];

async function loadAllWords(filePath: string) {
	try {
		const data = await file.promises.readFile(filePath, 'utf8');
		allWords = data.split('\r\n').filter((word: string) => word.length > 4);
	} catch (err) {
		console.error(err);
	}
}

loadAllWords(filePath);

export async function GET() {
	if (!allWords) {
		await loadAllWords(filePath);
	}
	const randomIndex1 = Math.floor(Math.random() * allWords.length);
	const randomIndex2 = Math.floor(Math.random() * allWords.length);
	return json({ word1: allWords[randomIndex1], word2: allWords[randomIndex2] });
}
