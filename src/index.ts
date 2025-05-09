import * as fs from 'fs';
import * as readline from 'readline';


function areAnagrams(s1: string, s2: string): boolean {
    if (s1.length !== s2.length) return false;
  
    const count: Record<string, number> = {};
   
    for (const char of s1) {
      count[char] = (count[char] ?? 0) + 1;
    }
   
    for (const char of s2) {
      if (count[char] === undefined) return false;
      count[char]--;
    }
  
    return Object.values(count).every(value => value === 0);
  }

async function processFile(filePath: string): Promise<number> {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let anagramPairs = 0;

    for await (const line of rl) {
        const [word1, word2] = line.split(':').map(word => word.trim().toLowerCase());
        
        if(areAnagrams(word1, word2)) {
            anagramPairs++;
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
        
        console.log(`\nTotal anagram pairs found: ${anagramPairs}`);
    } catch (error) {
        console.error('Error processing file:', error);
        process.exit(1);
    }
}

main(); 