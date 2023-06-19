import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { AppController } from './services/user.service.js';
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
console.log('File name: ' + __filename)
const __dirname = path.dirname(__filename);
console.log('Dir name: ' + __dirname)

const app = express();
const router = express.Router();


const port = process.env.PORT || 7777;



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', express.static(path.join(__dirname, './build')));
app.use(cors())


// 4. instance of the AppController
const appController = new AppController();
// 5. accessing the init() method
appController.init().then(() => { 
console.log('database and container created Successfully'); }).catch(() => {
    console.log('database and container creation failed');
    process.exit(1);
});

router.get('/', 
(req,res,next)=>appController.getData(req,res).catch(next));

router.get('/:id', 
(req,res,next)=>appController.getUserById(req,res).catch(next));

router.post('/', 
(req,res,next)=>appController.addUser(req,res).catch(next));

router.put('/:id', 
(req,res,next)=>appController.updateLocations(req,res).catch(next));

/*router.get('/frontend', (req, res) => {
  res.sendFile(path.join(__dirname, './../Frontend/weather_display/build/index.html'));
});*/

app.use('/user', router)


//app.use('/frontend', express.static(path.join('./../Frontend/weather_display/build', 'public')));


/*app.get('/frontend', (req, res) => {
  res.sendFile(path.join(__dirname, './../Frontend/weather_display/build/index.html'));
});*/


app.listen(port, () => console.log(`listening on http://localhost:${port}`));





//404 error
app.use((err, req, res, next) => {
  next(err);
});
app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message)
})