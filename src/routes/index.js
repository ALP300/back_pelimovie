import { Router } from "express";
const router = Router();
import { ConsultarProductos } from "../public/services/conexion.js";

router.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});
router.get("/cartelera", (req, res) => {
  res.render("cartelera", { title: "Cartelera" });
});
router.get("/catalogo", (req, res) => {
  res.render("catalogo", { title: "Catalogo" });
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

export default router;
