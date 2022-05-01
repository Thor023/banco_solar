const { Pool } = require('pg')

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "vicentevale",
    database: "bancosolar",
    port: 5432
})

//ingresar usuarios/OK/
const guardarUsuario = async(usuario) =>{
    const values = Object.values(usuario)
    const consulta ={
        text: "INSERT INTO usuarios (nombre, balance) values ( $1, $2)",
        values
    }
    const result = await pool.query(consulta)
    return result
}
//OK
const getUsuarios = async () =>{
    const {rows} = await pool.query("SELECT * FROM usuarios")
    return rows 
}
//EDICION DE USUARIOS --Funciona!!!!OK
const editUsuario = async (usuario) =>{
    const values = Object.values(usuario)
    const consulta ={
        text: 'UPDATE usuarios SET nombre = $1, balance = $2 WHERE id = $3 RETURNING *',
        values
    }
    console.log(values)
    // console.log(id)
    const {rows} = await pool.query(consulta)
    return rows
}
//OK
const eliminarUsuario = async(id) =>{
    const {rows} = await pool.query(`DELETE FROM usuarios WHERE id = ${id}`)
    return rows
}
//Transferencias//
// const argumentos = process.argv.slice(2);
// const funcion = argumentos[0];
// const emisor = argumentos[1];
// const receptor = argumentos[2];
// const fecha = argumentos[3];
// const monto = argumentos[4];
// console.log (argumentos)

const nuevaTransferencia = async (transferencias)=>{
    console.log(transferencias)
    const values = Object.values(transferencias)
    console.log(values)
    const emisor= values[0]
    const receptor= values[1]
    const monto = Number(values[2])

    const actualizarCuentaEmisor ={
        text: 'UPDATE usuarios SET balance = balance - $2 Where id = $1 RETURNING *',
        values: [emisor, monto]
    }
    const actualizarCuentaReceptor ={
        text: 'UPDATE usuarios SET balance = balance + $2 Where id = $1 RETURNING *',
        values: [receptor, monto]
    }
    const nuevaTransferencia ={
        text: "INSERT INTO transferencias (emisor, receptor, monto, fecha) values ($1, $2, $3, NOW()) RETURNING *",   
        values: [emisor, receptor, monto]
    }
    try{
        await pool.query('BEGIN');
        const resultado = await pool.query(nuevaTransferencia);
        await pool.query(actualizarCuentaEmisor);
        await pool.query(actualizarCuentaReceptor);
        await pool.query('COMMIT');
        console.log ('Transferencia realizada con exito');
        console.log('Ultima transferencia registrada:', resultado.rows[0]);
    }catch (error){
        await pool.query("ROLLBACK");
        console.log("Error codigo: " + error.code);
        console.log("Error detail: " + error.detail);
        console.log("Tabla de error: " + error.table);
        console.log("Restriccion violada en el campo: " + error.constraint);
    }finally{
        pool.end();
    }
};

const getTransferencias = async () =>{
    const {rows} = await pool.query("SELECT * FROM transferencias")
    return rows 

}


module.exports = {guardarUsuario, getUsuarios, editUsuario, eliminarUsuario, nuevaTransferencia, getTransferencias}