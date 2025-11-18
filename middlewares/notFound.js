import { logger } from "./middlewares.js";

export const notFound = (req, res, next) => {
  logger(req.url); // registra la ruta solicitada
  res.status(404).type("text/plain").send("Ruta no encontrada");
};

export default notFound;
