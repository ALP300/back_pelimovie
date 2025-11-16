import { Router } from "express";
const router = Router();
import { ConsultarProductos, crearUsuario, buscarUsuarioPorEmail, eliminarProducto } from "../public/services/conexion.js";
import bcrypt from 'bcrypt';

router.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});
router.get("/cartelera", (req, res) => {
  res.render("cartelera", { title: "Cartelera" });
});
router.get("/catalogo", (req, res) => {
  res.render("catalogo", { title: "Catalogo" });
});
router.get("/iniciarSesion", (req, res) => {
  res.render("iniciar", { title: "Iniciar Sesión" });
});
router.get("/registro", (req, res) => {
  res.render("registrarse", { title: "Registrarse" });
});

router.post('/api/registro', async (req, res) => {
    const { username, email, password, 'confirm-password': confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Las contraseñas no coinciden.' });
    }

    try {
        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear usuario en la base de datos
        const nuevoUsuario = await crearUsuario(email, hashedPassword);
        res.status(201).json({ message: 'Usuario creado exitosamente', usuario: nuevoUsuario });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el usuario', details: error.message });
    }
});

router.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'El email y la contraseña son obligatorios.' });
    }

    try {
        // Buscar usuario por email
        const usuario = await buscarUsuarioPorEmail(email);
        if (!usuario) {
            return res.status(400).json({ error: 'Credenciales inválidas.' }); // Mensaje genérico por seguridad
        }

        // Comparar la contraseña enviada con la hasheada en la BD
        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) {
            return res.status(400).json({ error: 'Credenciales inválidas.' }); // Mensaje genérico por seguridad
        }

        res.status(200).json({ message: 'Inicio de sesión exitoso', usuario: { id: usuario.id, email: usuario.email } });
    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesión', details: error.message });
    }
});

router.get('/api/get-productos', async (req, res) => {
    console.log('Request received for /api/get-productos');
    try {
        const productos = await ConsultarProductos();
        console.log('Productos from DB:', productos); // Log raw result
        if (!productos || productos.length === 0) {
            console.log('No products found, returning empty array');
            return res.status(200).json([]); // Return empty array instead of 404
        }
        console.log('Sending products:', productos);
        res.status(200).json(productos);
    } catch (error) {
        console.error('Error in /api/get-productos:', error);
        res.status(500).json({ error: 'Error al consultar los productos', details: error.message });
    }
});

router.delete('/api/productos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const resultado = await eliminarProducto(id);

        if (resultado === 0) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }

        res.status(200).json({ message: 'Producto eliminado exitosamente.' });
    } catch (error) {
        // Devolver un error genérico para cualquier problema durante la transacción
        res.status(500).json({ error: 'Error al eliminar el producto', details: error.message });
    }
});


export default router;
