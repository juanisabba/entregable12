const express = require("express")
const session = require('express-session')
const MongoStore = require('connect-mongo')
const { Router } = express;
const { db, msgsModel} = require("./dbsConfig.js")
const contenedorMongo = require("./contenedorMongoDB.js")
const { Server: IOServer } = require("socket.io")
const { Server: HttpServer } = require("http")
const cors = require("cors")
const {randomData} = require("./fakerRP.js")
const { readFile, writeFile } = require("fs/promises")
const app = express()
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const router = Router();

const PORT = process.env.PORT || 8080;

const server = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
 })
server.on("error", error => console.log(`Error en servidor ${error}`));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", express.static("./public"));
app.set("view engine", "ejs"); 
app.set("views", "./views") 
app.use(cors());

app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB
    }),
    secret: 'qwerty',
    resave: true,
    saveUninitialized: true
}))


const myChat = new contenedorMongo(db, msgsModel);

io.on("connection", async socket => { 
    console.log("Un nuevo cliente se ha conectado");
 
    socket.emit("Mensajes", await myChat.getElems());

    const data = await myChat.getElems();

    socket.on("new-message", async data => { 
        data.time = new Date().toLocaleString();
        io.sockets.emit("MensajeIndividual", data)
    })
})

router.get('/productos-test', async (req, res) => {
    return res.json(randomData(5));
 })

//RUTAS MENSAJES CHAT
router.get('/mensajes', async (req, res) => {
    return res.json(await myChat.getElems(req, res))
 })

router.post('/mensajes', async (req, res) => {
    return await myChat.postElem(req, res)
 })

router.get("/", (req, res) => {
    if(!req.session.name){
        return res.redirect('/login')
    }
    return res.render("pages/index");
});

app.get('/login', (req, res)=>{
    if(!req.session.name){
        return res.render('views/login')
    }
    return res.redirect('/')
})

app.post('/login', (req, res)=>{
    req.session.name = req.body.name
    res.redirect('/')
})

router.post('/logout', (req, res)=>{
    return req.session.destroy(err=>{
        if(!err){
            return res.redirect('/login')
        }
        return res.send('error')
    })
})

app.use('/api', router);
app.use((req, res, next) => {
    res.status(404).send({error: -2, descripcion: `ruta ${req.originalUrl} método ${req.method} no implementada`});
  });