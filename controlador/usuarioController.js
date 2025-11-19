import UsuariosSchema from "../models/Usuario.js";
import bcrypt from "bcryptjs";

/**
 * Controlador para usuarios 
 * Métodos HTTP: POST, GET, PUT, DELETE
 * y login con metodo post
 */


/**
 * POST /api/login
 * inikcio de sesion de usuario
 */
import User from "../models/Usuario.js";
import jwt from "jsonwebtoken";

export const loginUsuario = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "email y password son obligatorios" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      res.status(401).json({ message: "Credenciales inválidas" });
    };

    const token = jwt.sign(
      { sub: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const { password: _, ...safeUser } = user.toObject();

    // mensaje en el terminal
    console.log(`✅ Usuario ${safeUser.email} inició sesión correctamente a las ${new Date().toLocaleString()}`);

    res.json({
      message: "✅ Login exitoso",
      user: safeUser,
      token
    });
  } catch (err) {
    next(err);
  }
};





/**
 * POST /api/usuarios
 * Crear un nuevo usuario
 */
export const crearUsuario = async (req, res) => {
    console.log('crearUsuario - req.body:', req.body);
    try {
        const { nombre, apellido, email, password } = req.body;

        // Validación básica
        if (!nombre || !apellido || !email || !password) {
            res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Verificar si el email ya existe
        const existe = await UsuariosSchema.findOne({ email });
        if (existe) {
            res.status(409).json({ message: 'El email ya está registrado' });
        }

        // Hashear la contraseña
        const passwordHash = await bcrypt.hash(password, 10);

        // Crear nuevo usuario
        const nuevoUsuario = new UsuariosSchema({ nombre, apellido, email, password: passwordHash });
        await nuevoUsuario.save();

        res.status(201).json({ message: 'Usuario creado', usuario: nuevoUsuario });
    } catch (error) {
        console.error('Error al crear usuario:', error.message);
        res.status(500).json({ message: 'Error al crear un usuario' });
    }
};

/**
 * GET /api/usuarios
 * Mostrar todos los usuarios
 */
export const mostrarUsuarios = async (req, res) => {
    console.log('mostrarUsuarios - request:', req.method);
    try {
        const usuarios = await UsuariosSchema.find().select('-password');
        res.status(200).json({ message: 'Lista de usuarios', usuarios });
    } catch (error) {
        console.error('Error al obtener usuarios:', error.message);
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
};

/**
 * GET /api/usuarios/:email
 * Mostrar usuario por email
 */
export const mostrarUsuarioPorEmail = async (req, res) => {
    console.log('mostrarUsuarioPorEmail - params:', req.params);
    try {
        const { email } = req.params;
        const usuario = await UsuariosSchema.findOne({ email }).select('-password');

        if (!usuario) {
            res.status(404).json({ message: 'Usuario no existe' });
        }

        res.status(200).json({ message: 'Usuario encontrado', usuario });
    } catch (error) {
        console.error('Error al obtener usuario por email:', error.message);
        res.status(500).json({ message: 'Error al obtener el usuario' });
    }
};

/**
 * PUT /api/usuarios/:id
 * Actualizar datos de un usuario
 */
export const actualizarUsuario = async (req, res) => {
    console.log('actualizarUsuario - params:', req.params, 'body:', req.body);
    try {
        const { id } = req.params;
        const datosActualizados = { ...req.body };

        // Si se actualiza la contraseña, hashearla
        if (datosActualizados.password) {
            datosActualizados.password = await bcrypt.hash(datosActualizados.password, 10);
        }

        const usuario = await UsuariosSchema.findByIdAndUpdate(id, datosActualizados, {
            new: true,
            runValidators: true
        }).select('-password');

        if (!usuario) {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario actualizado', usuario });
    } catch (error) {
        console.error('Error al actualizar usuario:', error.message);
        res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
};

/**
 * DELETE /api/usuarios/:id
 * Eliminar un usuario
 */
export const eliminarUsuario = async (req, res) => {
    console.log('eliminarUsuario - params:', req.params);
    try {
        const { id } = req.params;
        const usuarioEliminado = await UsuariosSchema.findByIdAndDelete(id).select('-password');

        if (!usuarioEliminado) {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario eliminado', usuario: usuarioEliminado });
    } catch (error) {
        console.error('Error al eliminar usuario:', error.message);
        res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
};
