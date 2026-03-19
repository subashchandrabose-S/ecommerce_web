const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const rawKey = process.env.FIREBASE_PRIVATE_KEY;

if (!rawKey) {
    console.error('ERROR: FIREBASE_PRIVATE_KEY is missing/empty');
    process.exit(1);
}

console.log('--- Key Debug Info ---');
console.log('Length:', rawKey.length);
console.log('Starts with (decoded):', JSON.stringify(rawKey.substring(0, 30)));
console.log('Ends with (decoded):', JSON.stringify(rawKey.substring(rawKey.length - 30)));
console.log('Includes literal \\n:', rawKey.includes('\\n'));
console.log('Includes actual newline:', rawKey.includes('\n'));
console.log('First 5 chars hex:', Buffer.from(rawKey.substring(0, 5)).toString('hex'));

const processedKey = rawKey.includes('\n') ? rawKey : rawKey.replace(/\\n/g, '\n');
console.log('--- Processed Key Info ---');
console.log('Length:', processedKey.length);
console.log('Valid PEM header?', processedKey.trim().startsWith('-----BEGIN PRIVATE KEY-----'));
console.log('Valid PEM footer?', processedKey.trim().endsWith('-----END PRIVATE KEY-----'));
