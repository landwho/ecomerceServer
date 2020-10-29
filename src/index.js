const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
var bodyParser = require('body-parser')

const router = require('../routes/routes.js');

/**configuracions */

app.set('port', 2020);

app.use(morgan('dev'));
app.use(express.json());
// parse application/json
app.use(bodyParser.json())
app.use(express.urlencoded({extended:true}));
app.use(cors());

app.use(router);

app.listen(app.get('port'),()=>{
    console.log("server status 200 on port 2020");
});