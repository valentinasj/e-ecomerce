const app = require("../config/server");
require("colors");

app.get('/', (req, res)=>{
    res.render("../views/index")
})

app.get('/fav', (req, res)=>{
    res.render("../views/favorites")
})

app.get('/cart', (req, res)=>{
    res.render("../views/cart")
})

app.get('/admin', (req, res)=>{
    res.render("../views/administrator")
})

app.get('/createUpdateProducts', (req, res)=>{
    res.render("../views/createUpdateProducts")
})