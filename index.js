const express = require('express')
const app = express();
const userRoutes = require('./src/user/routes')

const port = 3000;

app.use(express.json());

app.get('/', (req,res)=>
{
    res.send("This is home page")
})
app.use('/api',userRoutes)


app.listen(port, ()=>{console.log(`listening to the port ${port}`)})
