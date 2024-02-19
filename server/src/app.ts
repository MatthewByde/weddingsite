import express from 'express';
import ReactDOM from 'react-dom';

export default function main(port: number) {
    const app = express();
    app.get('/', (req, res) => { res.send("hi") });
    app.listen(port, () => { console.log(`Example app listening on port ${port}`) });
    
    
}
