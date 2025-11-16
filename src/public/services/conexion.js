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

export async function buscarUsuarioPorEmail(correo) {
    const cliente = new Client(config);
    try {
        await cliente.connect();
        // Renombramos la columna 'contrasena' a 'password' para que coincida con lo que espera el endpoint de login.
        const query = 'SELECT id, correo, contrasena as password FROM usuarios WHERE correo = $1';
        const values = [correo];
        const resultado = await cliente.query(query, values);
        console.log('Usuario encontrado:', resultado.rows[0]);
       return resultado.rows[0]; // Devuelve el primer usuario encontrado o undefined si no existe
    } catch (error) {
        console.error('Error al buscar usuario por email:', error);
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

export async function eliminarProducto(id) {
    const cliente = new Client(config);
    try {
        await cliente.connect();
        // Iniciar una transacción
        await cliente.query('BEGIN');

        // 1. Eliminar primero las referencias en la tabla order_items
        const deleteOrderItemsQuery = 'DELETE FROM order_items WHERE product_id = $1';
        const values = [id];
        await cliente.query(deleteOrderItemsQuery, values);

        // 2. Ahora eliminar el producto de la tabla products
        const deleteProductQuery = 'DELETE FROM products WHERE product_id = $1';
        const resultado = await cliente.query(deleteProductQuery, values);

        // Confirmar la transacción si todo fue exitoso
        await cliente.query('COMMIT');

        return resultado.rowCount; // Devuelve el número de filas eliminadas (0 si no se encontró, 1 si se eliminó)
    } catch (error) {
        await cliente.query('ROLLBACK'); // Revertir la transacción en caso de error
        console.error('Error al eliminar el producto:', error);
        throw error;
    } finally {
        await cliente.end();
    }
}