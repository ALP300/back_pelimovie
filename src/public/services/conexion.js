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
