import morgan from 'morgan';
import express from 'express';
import route from './routes/index.js';
import connect from './config/db/connectdb.js';
import dotenv from 'dotenv'

dotenv.config();
const app = express();
const port = 3000;

app.use(morgan('combined'));

// static files
app.use(express.static('./src/public'));

// // template engine
// app.engine(
//     'hbs',
//     engine({
//         extname: '.hbs',
//     }),
// );
// app.set('view engine', 'hbs');
// app.set('views', './src/resources/views'); 


// connect db
connect();

route(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
