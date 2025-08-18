
// ===== src/seeders/adminSeeder.js =====
import User from '../models/User.js';
import Role from '../models/Role.js';
import { USER_ROLES } from '../config/constants.js';

const seedAdmin = async () => {
  try {
    console.log('🌱 Seeding admin user...');
    
    // Buscar rol de administrador
    const adminRole = await Role.findOne({ name: USER_ROLES.ADMIN });
    
    if (!adminRole) {
      console.log('❌ No se encontró el rol de administrador. Ejecuta primero el seeder de roles.');
      return;
    }
    
    // Verificar si ya existe un administrador
    const existingAdmin = await User.findOne({ 
      globalRole: adminRole._id,
      email: process.env.ADMIN_EMAIL || 'admin@company.com'
    });
    
    if (!existingAdmin) {
      const adminData = {
        firstName: 'Super',
        lastName: 'Admin',
        email: process.env.ADMIN_EMAIL || 'admin@company.com',
        password: process.env.ADMIN_PASSWORD || 'Admin123456!',
        globalRole: adminRole._id,
        isActive: true,
        isEmailVerified: true
      };
      
      const admin = await User.create(adminData);
      console.log(`✅ Usuario administrador creado: ${admin.email}`);
      console.log(`   - Nombre: ${admin.firstName} ${admin.lastName}`);
      console.log(`   - Email: ${admin.email}`);
      console.log(`   - Contraseña: ${process.env.ADMIN_PASSWORD || 'Admin123456!'}`);
      console.log('⚠️ IMPORTANTE: Cambia la contraseña después del primer inicio de sesión');
    } else {
      console.log('ℹ️ El usuario administrador ya existe');
      console.log(`   - Email: ${existingAdmin.email}`);
    }
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    throw error;
  }
};

export default seedAdmin;
