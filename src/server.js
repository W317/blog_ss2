import morgan from 'morgan';
import express from 'express';
import { engine } from 'express-handlebars';


const app = express()
const port = 3000

app.use(morgan('combined'))

// static files
app.use(express.static('./src/public'))

// template engine
app.engine('hbs', engine({
  extname : '.hbs'
}))
app.set('view engine', 'hbs');
app.set('views', './src/resources/views')

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/doc', (req, res) => {
  res.render('doc');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})