import express from "express";
import { config, corsConfig } from "./config/config";
import uploadRoutes from "./routes/upload";
import { getLimiter } from "./middlewares/rateLimit";
import morgan from "morgan";
import cors from "cors";

const app = express();

// Configuración de Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsConfig));
// Middleware de Morgan
app.use(morgan("common"));
// Servir archivos estáticos con rate limiting para GET
app.use("/uploads", getLimiter, express.static(config.uploadDir));

// Rutas
app.use("/upload", uploadRoutes);

// Manejador para rutas no mapeadas (404)
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada", status: 404 });
});

// Iniciar el servidor
app.listen(config.port, () => {
  console.log(`Servidor corriendo en puerto ${config.port}`);
});
