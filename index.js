const express = require('express')
const app = express();
const userRoutes = require('./src/user/userRoutes')
const orderRoutes = require('./src/orders/orderRoutes')
const productRoutes = require('./src/products/productRoutes')

const port = 3000;

app.use(express.json());

app.get('/', (req,res)=>
{
    res.send("This is home page")
})
app.use('/api/user',userRoutes)
app.use('/api/product',productRoutes)
app.use('/api/order',orderRoutes)



app.listen(port, ()=>{console.log(`listening to the port ${port}`)})
