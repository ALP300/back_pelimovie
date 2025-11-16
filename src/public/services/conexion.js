import pg from 'pg';
const { Client } = pg;

const config={
    user: 'db_movie_z5vn_user',
    password: 'vR3rfnY86D6fkceyDzBOQoL5jNZbIznE',
    host: 'dpg-d440shje5dus73adosqg-a.oregon-postgres.render.com',
    database: 'db_movie_z5vn',
    port: 5432,
    ssl: { rejectUnauthorized: false }
};

export async function getConexion(){
    const client=new Client(config);
    try{
        await client.connect();
        console.log('DB connected');
        return client;
    }catch(error){
        console.log(error);
        return null;
    }
}

export async function ConsultarProductos() {
    const cliente = new Client(config);
    try {
        await cliente.connect();
        console.log('Executing query: SELECT * FROM products');
        const resultado = await cliente.query('SELECT * FROM products');
        console.log('Productos consultados:', resultado.rows);
        return resultado.rows;
    } catch (error) {
        console.error('Error al consultar productos:', error);
        throw error; 
    } finally {
        await cliente.end();
    }
}

export async function crearUsuario(correo, contrasena) {
    const cliente = new Client(config);
    try {
        await cliente.connect();
        const query = 'INSERT INTO usuarios(correo, contrasena) VALUES($1, $2) RETURNING id, correo, fecha_creacion';
        const values = [correo, contrasena];
        const resultado = await cliente.query(query, values);
        console.log('Usuario creado:', resultado.rows[0]);
        return resultado.rows[0];
    } catch (error) {
        console.error('Error al crear usuario:', error);
        throw error;
    } finally {
        await cliente.end();
    }
}