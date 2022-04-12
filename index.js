const config = require('config')
const {connectDB} = require('./config/db')
const express = require('express');
const bodyParser = require('body-parser')
const userRoutes = require('./routes/userRoute')
const productRoutes = require('./routes/productRoute')
const cartRoutes = require('./routes/cartRoute')
const orderRoutes = require('./routes/orderRoute')

if(!config.get('jwtPrivateKey')){
  console.error('Fatal Error: jwtPrivateKey is not defined')
  process.exit(1)
}


connectDB();

const app = express();

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(express.json());


require('./config/passport')(app);
app.use('/api/users',userRoutes)
app.use('/api',orderRoutes)
app.use('/api/products',productRoutes)
app.use('/api',cartRoutes)

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));


