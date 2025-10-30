import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, 'README.md'));
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});