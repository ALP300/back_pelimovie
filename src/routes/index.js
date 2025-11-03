import { Router } from "express";
const router = Router();


router.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});
router.get("/cartelera", (req, res) => {
    res.render("cartelera", { title: "Cartelera" });
});
router.get("/catalogo", (req, res) => {
    res.render("catalogo", { title: "Catalogo" });
});
export default router;