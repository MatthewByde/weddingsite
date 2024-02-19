import express from 'express';
const app = express();
const port = 8080;
app.get('/', (req, res) => { res.send('Hello Adele ;) sleep well! <3'); });
app.listen(port, () => { console.log(`Example app listening on port ${port}`); });
