const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const PORT = 3000;
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use("/boletimonline", require("./routers/boletim"))

app.get("/equipe", (req, res) => {

    res.render("team", {page: "Equipe", team: require("./database/team.json")})

})

app.get("/contato", (req, res) => {

    res.render("contact", { page: "Contato" })

})

app.get("/", (req, res) => {

    res.render("index", {page: "Grêmio Rômulo Almeida" })

})

app.use(function(req, res, next){
    res.status(404);

    res.render("404", { page: "Página não encontrada!" })

});
  
app.use(function(err, req, res, next){

    console.log(err)
    res.send('erro 500, algo deu errado!');

});
  

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})