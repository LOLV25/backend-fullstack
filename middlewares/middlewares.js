export const logger = (req) => {
  const fecha = new Date();
  console.log(
    `[${fecha}] Usuario accedió a ${req.method} ${req.url} con la solicitud`
  );
};


export const loggerError = (parametro) => {
  const fecha = new Date();
  console.log(
    `[${fecha}] Usuario recibió un error al acceder a ${parametro.url} con la solicitud`
  );
};



/// Middleware para verificar token JWT
import jwt from "jsonwebtoken";

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token requerido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // info del usuario autenticado
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};
