import { promises as fs } from 'fs';
import { join } from 'path';
import { json } from '@sveltejs/kit';

const filePath = 'static/assets/word-lists/words/';
const allWords: string[][] = [];

async function loadAllWords(directoryPath: string) {
	try {
		const allFiles = await fs.readdir(directoryPath);
		for (const fileName of allFiles) {
			const filePath = join(directoryPath, fileName);
			const fileContent = await fs.readFile(filePath, 'utf8');
			const words = fileContent.split(/\r?\n|\r/).filter((word: string) => word.length > 4);
			allWords.push(words);
		}
	} catch (err) {
		console.error(err);
	}
}

loadAllWords(filePath);

export async function GET() {
	if (allWords.length === 0) {
		await loadAllWords(filePath);
	}
	const categoryIndex = Math.floor(Math.random() * allWords.length);
	const categoryArray = allWords[categoryIndex];
	if (categoryArray.length < 2) {
		throw new Error('Specified array does not contain enough words');
	}
	let wordIndex1 = Math.floor(Math.random() * categoryArray.length);
	let wordIndex2 = Math.floor(Math.random() * categoryArray.length);
	wordIndex1 = Math.min(wordIndex1, categoryArray.length - 1);
	wordIndex2 = Math.min(wordIndex2, categoryArray.length - 1);
	while (wordIndex1 === wordIndex2) {
		wordIndex1 = Math.floor(Math.random() * categoryArray.length);
	}
	const word1 = categoryArray[wordIndex1];
	const word2 = categoryArray[wordIndex2];
	return json({ word1, word2 });
}
