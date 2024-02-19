import express from 'express';
export default function main(port) {
    const app = express();
    app.get('/', (req, res) => { res.send('Hello Adele ;) sleep well! <3'); });
    app.listen(port, () => { console.log(`Example app listening on port ${port}`); });
}
