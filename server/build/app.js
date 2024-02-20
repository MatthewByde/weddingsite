import express from 'express';
export default function main(port) {
    const app = express();
    app.get('/', (_, res) => { res.send("hi"); });
    app.listen(port, () => { console.log(`Example app listening on port ${port}`); });
}
