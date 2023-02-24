import morgan from 'morgan';
import express from 'express';
import { engine } from 'express-handlebars';
import route from './routes/index.js';
import dbconnect from './config/db/connectdb.js';

const app = express();
const port = 3000;

app.use(morgan('combined'));

// static files
app.use(express.static('./src/public'));

// template engine
app.engine(
    'hbs',
    engine({
        extname: '.hbs',
    }),
);
app.set('view engine', 'hbs');
app.set('views', './src/resources/views'); 


// connect db
dbconnect();

route(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
