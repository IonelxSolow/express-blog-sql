//import express
const express = require("express");
const app = express();
const port = 3000;

const postsRouter = require('./routers/posts');
const routeError = require('./middleware/routeError');
const middError = require('./middleware/middError');

app.use(express.json());

app.use('/posts', postsRouter)


// first route 
app.get('/', (req, res) =>{
    res.send('Hello World')
});
//midleware serve static files from the "public" folder
app.use(express.static('public'));

app.use(routeError);

app.use(middError);


// app listening on port: 3000
app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`)
});