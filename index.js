const express = require('express');
const bodyParser = require('body-parser')
const connection = require('./database/database');
const Ask = require('./database/Ask');
const Response = require('./database/Response');

const app = express();

//Database
connection.authenticate()
.then(() =>{
    console.log('conexão feita com o banco de dados');
})
.catch((err) =>{
    console.log(err);
});

app.set('view engine','ejs');
app.use(express.static('public'));

// body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// routes
app.get("/", async ( req, res )=> {
   await Ask.findAll({raw : true, order:[
       ['id','DESC']
   ] }).then(function(asks){

    res.render('index',{
        asks,
        })
    });
});
app.get("/ask", ( req, res )=> {
    res.render('ask');
});
app.get("/askPage/:id", ( req, res )=> {
    const id = req.params.id;
    Ask.findOne({
        where: {id:id}
    }).then(ask =>{
        if(ask != undefined){
           
            Response.findAll({
               where:{askId:ask.id},
               order:[['id','DESC']]
           }).then( responses =>{
                res.render("askPage", {
                    ask,
                    responses,
                });
           });
           
           
            
        }else{
            res.redirect("/");
        }
    });

});
app.post("/save", ( req, res )=> {
    const title = req.body.title;
    const description = req.body.description;
    Ask.create({
        title,
        description,
    }).then(()=>{
        res.redirect('/');
    });
});
app.post("/response", ( req, res )=> {
    const corpo = req.body.res;
    const id = req.body.id;
    console.log(corpo, id);
    Response.create({
        body:corpo,
        askId:id,
    }).then(() =>{
        res.redirect(`/askPage/${id}`)
    });
});

app.listen(8080, () =>{
    console.log("app rodando na porta 8080");
});