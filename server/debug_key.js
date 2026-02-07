const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const key = process.env.FIREBASE_PRIVATE_KEY;
if (!key) {
    console.log('KEY NOT FOUND');
} else {
    console.log('Key length:', key.length);
    console.log('First 50 chars:', key.substring(0, 50));
    console.log('Last 50 chars:', key.substring(key.length - 50));
    console.log('Contains literal \\n:', key.includes('\\n'));
}
