import mongoose from "mongoose";

export const conectarABaseDeDatos = async ()=> {
    try {
       await mongoose.connect(process.env.MONGO_URI)
       console.log('Conexion a MongoDB exitosa');
    } catch (error) {
        console.error('Error de conexion a MongoDB:', error.message);
    }
}

export default conectarABaseDeDatos;