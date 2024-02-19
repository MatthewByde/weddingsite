import express from 'express';

export default function main(port: number) {
    const app = express();
    app.get('/', (req, res) => { res.send("hi") });
    app.listen(port, () => { console.log(`Example app listening on port ${port}`) });
    
    
}
