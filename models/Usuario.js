import mongoose from 'mongoose';

/** Esquema de usuarios donde tenemos 
 * name @type {String}
 * email  @type {String}
 * password @type {String}
 * role @type {String} - 'user' | 'admin'
 * timestamps @type {Date} - creado y actualizado
 */


const userSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["user", "admin"], default: "user" }
  },
  { timestamps: true }
);

export default mongoose.model("Usuario", userSchema);
  
