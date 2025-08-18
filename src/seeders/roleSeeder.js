// ===== src/seeders/roleSeeder.js =====
import Role from '../models/Role.js';
import { USER_ROLES } from '../config/constants.js';

const defaultRoles = [
  {
    name: USER_ROLES.ADMIN,
    description: 'Administrador del sistema con acceso completo a todas las funcionalidades'
  },
  {
    name: USER_ROLES.PROJECT_MANAGER,
    description: 'Gestor de proyectos con capacidad de crear y administrar proyectos y equipos'
  },
  {
    name: USER_ROLES.DEVELOPER,
    description: 'Desarrollador con acceso a tareas asignadas y colaboración en proyectos'
  },
  {
    name: USER_ROLES.VIEWER,
    description: 'Usuario con acceso de solo lectura a proyectos donde participa'
  }
];

const seedRoles = async () => {
  try {
    console.log('🌱 Seeding roles...');
    
    // Verificar si ya existen roles
    const existingRoles = await Role.countDocuments();
    
    if (existingRoles === 0) {
      const roles = await Role.insertMany(defaultRoles);
      console.log(`✅ ${roles.length} roles creados exitosamente`);
      
      roles.forEach(role => {
        console.log(`   - ${role.name}: ${role.description}`);
      });
    } else {
      console.log('ℹ️ Los roles ya existen en la base de datos');
      
      // Verificar si faltan roles y agregarlos
      for (const roleData of defaultRoles) {
        const existingRole = await Role.findOne({ name: roleData.name });
        if (!existingRole) {
          const newRole = await Role.create(roleData);
          console.log(`✅ Rol agregado: ${newRole.name}`);
        }
      }
    }
  } catch (error) {
    console.error('❌ Error seeding roles:', error);
    throw error;
  }
};

export default seedRoles;
