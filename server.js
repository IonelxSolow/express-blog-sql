//import express
const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

//Abilita CORS (middleware per il CORS)
app.use(cors({
    origin: 'http://localhost:5173'
}));

const postsRouter = require('./routers/posts');
const routeError = require('./middleware/routeError');
const middError = require('./middleware/middError');

app.use(express.json());

app.use('/posts', postsRouter)


// first route 
app.get('/', (req, res) => {
    res.send('Hello World')
});

//simulazione di un errore per errorHandler (TypeError: app.daje is not a function)
/* app.get('/',(req,res)=>{ */
//app.daje();
/* throw new Error('Server Error'); */ // restituisce Server Error
/* res.send('WelcomeTo our Server') */ // quello che cè dopo throw new Error non viene eseguito.
/* }) */

//midleware serve static files from the "public" folder
app.use(express.static('public'));

app.use(routeError);

app.use(middError);


// app listening on port: 3000
app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`)
});