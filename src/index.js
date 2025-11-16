import express from 'express';
import {dirname, join} from 'path';
import { fileURLToPath } from 'url';
import { Router } from 'express';
import router from './routes/index.js';
import {getConexion} from './public/services/conexion.js';
import { get } from 'http';
import { ConsultarProductos } from './public/services/conexion.js';
import cors from 'cors';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Configure CORS
app.use(cors());

// Additional headers to ensure CORS works
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
console.log(__dirname);
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(router);
getConexion();
ConsultarProductos();
app.listen(3000, ()=> {
    console.log('Server started on http://localhost:3000');
});