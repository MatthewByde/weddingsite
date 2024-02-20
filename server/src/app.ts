import express from 'express';

export default function main() {
    const port = 8080;
    const app = express();
    app.use(express.static('static'));
    app.listen(port, () => { console.log(`Example app listening on port ${port}`) });
    
    
}