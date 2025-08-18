// ===== src/seeders/runAllSeeders.js =====
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import seedRoles from './roleSeeder.js';
import seedStates from './stateSeeder.js';
import seedAdmin from './adminSeeder.js';
import seedCategories from './categorySeeder.js';

// Cargar variables de entorno
dotenv.config();

const runAllSeeders = async () => {
  try {
    console.log('🚀 Iniciando seeders...\n');
    
    // Conectar a la base de datos
    await connectDB();
    
    // Ejecutar seeders en orden
    await seedRoles();
    console.log('');
    
    await seedStates();
    console.log('');
    
    await seedAdmin();
    console.log('');
    
    await seedCategories();
    console.log('');
    
    console.log('✅ Todos los seeders ejecutados exitosamente');
    console.log('\n📋 Resumen:');
    console.log('- Roles del sistema creados');
    console.log('- Estados de proyecto y tarea creados');
    console.log('- Usuario administrador creado');
    console.log('- Categorías predeterminadas creadas');
    console.log('\n🎉 Base de datos inicializada correctamente');
    
  } catch (error) {
    console.error('❌ Error ejecutando seeders:', error);
    process.exit(1);
  } finally {
    // Cerrar conexión si estamos ejecutando directamente
    if (process.argv[1].includes('runAllSeeders.js')) {
      mongoose.connection.close();
      process.exit(0);
    }
  }
};

// Ejecutar si es llamado directamente
if (process.argv[1].includes('runAllSeeders.js')) {
  runAllSeeders();
}

export default runAllSeeders;