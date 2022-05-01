//Levantar Servidor en puerto 3000 con Express
const express = require('express');
const app = express();
const port = 3000;
app.listen(port,  ()=>{
    console.log(`El servidor esta en el puerto ${port}`);
});
//middleware
app.use(express.json());
//exportacion de funciones
const {guardarUsuario, getUsuarios, editUsuario, eliminarUsuario,nuevaTransferencia, getTransferencias} = require('./consultas')

//ruta base al html 
app.get("/", (req,res)=>{
    res.sendFile(__dirname + "/index.html")
});
//ruta guardar usuario
// app.use(express.json());
app.post("/usuario", async (req, res ) => {
    console.log(req.body)
    try {
        const usuario = req.body
        const result = await guardarUsuario(usuario);
        res.status(201).json(result)
    } catch (error) {
        res.status(500).send(error)
        console.log(error.code)
        console.log(error)
    }
});
//ruta get
app.get("/usuarios", async (req, res) => {
    try {
        const usuarios = await getUsuarios();
        res.json(usuarios)
    } catch (error) {
        res.status(500).send(error)
    }
});
//ruta edicion
app.put("/usuario?:id", async(req, res) => {
    try {
        const usuario = req.body
        const id = req.query
        // console.log(id) 
        const result = await editUsuario(usuario,id)
        // console.log(result)
        res.json(result)
    } catch (error) {
        res.status(500).send(error)
    } 
});
//ruta eliminar
app.delete("/usuario", async (req,res)=>{
    try {
        const {id} = req.query
        await eliminarUsuario(id)
        res.send("Usuario eliminado con éxito")
    } catch (error) {
        res.status(500).send(error)
    }
});
app.use(express.json());

app.post("/transferencia", async (req, res ) => {
    console.log(req.body)
    try {
        const transferencia = req.body
        const result = await nuevaTransferencia(transferencia);
        // console.log(transferencia)
        res.status(201).json(result)
    } catch (error) {
        res.status(500).send(error)
        console.log(error.code)
        console.log(error)
    }
});

app.get("/transferencias", async (req,res)=>{
    try {
        const transferencias = await getTransferencias();
        res.json(transferencias)

    } catch (error) {
        res.status(500).send(error)
    }
});