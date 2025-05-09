import * as fs from 'fs';
import * as readline from 'readline';

interface AnagramPair {
    word1: string;
    word2: string;
}

function createCharMap(word: string): Record<string, number> {
    const charMap: Record<string, number> = {};
    const normalizedWord = word.toLowerCase();
    
    for (const char of normalizedWord) {
        charMap[char] = (charMap[char] || 0) + 1;
    }
    
    return charMap;
}

function areAnagrams(word1: string, word2: string): boolean {
    const map1 = createCharMap(word1);
    const map2 = createCharMap(word2);
    
    // Compare the keys (characters) and their counts
    const keys1 = Object.keys(map1);
    const keys2 = Object.keys(map2);
    
    if (keys1.length !== keys2.length) {
        return false;
    }
    
    return keys1.every(key => map1[key] === map2[key]);
}

async function processFile(filePath: string): Promise<AnagramPair[]> {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const anagramPairs: AnagramPair[] = [];

    for await (const line of rl) {
        const [word1, word2] = line.split(':').map(word => word.trim());
        if (word1 && word2) {
            if (areAnagrams(word1, word2)) {
                anagramPairs.push({ word1, word2 });
            }
        }
    }

    return anagramPairs;
}

async function main() {
    if (process.argv.length < 3) {
        console.error('Please provide a file path as an argument');
        process.exit(1);
    }



    const filePath = process.argv[2];

    if(!fs.existsSync(filePath)) {
        console.error('File does not exist');
        process.exit(1);
    }

    try {
        const anagramPairs = await processFile(filePath);
        
        console.log(`\nTotal anagram pairs found: ${anagramPairs.length}`);
    } catch (error) {
        console.error('Error processing file:', error);
        process.exit(1);
    }
}

main(); 