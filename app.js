//const inicioDebug = require('debug')('app:inicio');
//const dbDebug = require('debug')('app:database');
const debug = require('debug')('app:inicio');
const express =  require('express');
const config = require('config');
const logger = require('./logger');
const joi = require('joi');
const morgan = require('morgan');
const app = express();

//Middlewares
app.use(express.json()); //el req body
app.use(express.urlencoded({extends:true})); // por url nombre=luis 
app.use(express.static('public'));

//Configuración de entornos
console.log('Aplicación' + config.get('nombre'));
console.log('BD server' + config.get('configDB.host'));

//Middlewares de terceros - Morgan
if(app.get('env')==='development'){
    
    app.use(morgan('tiny'));

    //console.log('Morgan Habilitado');
    debug('Morgan esta habilitado');
    debug('Conectando con la BD');
}

//Trabajos con la base de datos



//app.use(logger); 

// app.use(function(req, res, next){
//     console.log('Autenticando..........');
//     next();
// }); 

const usuarios = [
    {id:1, nombre:'grover'},
    {id:2, nombre:'pablo'},
    {id:3, nombre:'ana'}
]

app.get('/', (req, res) => {
    res.send('Hola mundo desde Express.');
});

//Consultando los usuarios
app.get('/api/usuarios', (req, res) =>{
    // res.send(['pepito', 'Luis', 'Roberto']);
     res.send(usuarios);
});

//Consultando un usuario 
app.get('/api/usuarios/:id', (req, res) => {
    //res.send(req.params); // muestra el http://localhost:5000/api/usuarios/1990/2 muestra un objeto
    //res.send(req.params.id); // muestra el id del req
    //res.send(req.query) // Cuando se le envía la URL por query http://localhost:5000/api/usuarios/1990/2?sexo=M
    //let usuario = usuarios.find(u => u.id === parseInt(req.params.id));
    let usuario = existeUsuario(req.params.id);
    if(!usuario) res.status(404).send('El usuario no fue encontrado');
    res.send(usuario);
});

//Agraegando
app.post('/api/usuarios', (req, res)=>{

    const {error, value} = validarUsuario(req.body.nombre);
    if(!error){
        const usuario = {
                id: usuarios.length + 1,
                nombre: value.nombre
            };
        
        usuarios.push(usuario);
        res.send(usuario);
    }else {
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
    }

    // if(!req.body.nombre || req.body.nombre.length <= 2 ){
    //     res.status(400).send('Nombre invalido');
    //     return;
    // }
    // const usuario = {
    //     id: usuarios.length + 1,
    //     nombre: req.body.nombre
    // };

    // usuarios.push(usuario);
    // res.send(usuario);


});

//Actualizar información

app.put('/api/usuarios/:id', (req, res)=>{
    //Encontrar si existe el objeto usuario a modificar
    //let usuario = usuarios.find(u => u.id === parseInt(req.params.id));
    let usuario = existeUsuario(req.params.id);
    if(!usuario){
        res.status(404).send('El usuario no fue encontrado');
        return;
    } 
    
    const {error, value} = validarUsuario(req.body.nombre);
    if(error){
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
        return;
    }

    usuario.nombre = value.nombre;
    res.send(usuario);

});

//funciones de validación
function existeUsuario(id){
    return (usuarios.find(u => u.id === parseInt(id)));
}

function validarUsuario(nom){
    const schema = joi.object({
        nombre: joi.string().min(3).required(),
    });
    return (schema.validate({ nombre: nom}));
}

//Eliminar

app.delete('/api/usuarios/:id', (req, res)=>{
    let usuario = existeUsuario(req.params.id);
    if(!usuario){
        res.status(404).send('El usuario no fue encontrado');
        return;
    }
    
    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1);

    res.send(usuarios);

});

//Creando una variable de entorno para el puerto.
//set PORT=5000
const port = process.env.PORT || 3000 ;
app.listen(port, () => {
    console.log(`Escuando al servidor en el puerto ${port}..........`);
});





