const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const rawKey = process.env.FIREBASE_PRIVATE_KEY;
console.log('Raw Key Starts With:', rawKey.substring(0, 30));
console.log('Raw Key Ends With:', rawKey.substring(rawKey.length - 30));

const formattedKey = rawKey.replace(/\\n/g, '\n');
console.log('Formatted Key (hex check):', Buffer.from(formattedKey.substring(0, 30)).toString('hex'));
console.log('Does it contain \\n after format?', formattedKey.includes('\\n'));
console.log('Does it contain real newline after format?', formattedKey.includes('\n'));

// Count real newlines
const newlineCount = (formattedKey.match(/\n/g) || []).length;
console.log('Newline count:', newlineCount);

if (newlineCount < 5) {
    console.error('ERROR: Too few newlines! PEM format requires actual newlines.');
}
