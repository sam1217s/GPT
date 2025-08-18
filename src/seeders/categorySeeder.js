// ===== src/seeders/categorySeeder.js =====
import Category from '../models/Category.js';
import User from '../models/User.js';
import Role from '../models/Role.js';
import { USER_ROLES } from '../config/constants.js';

const defaultCategories = [
  {
    name: 'Desarrollo Web',
    description: 'Proyectos relacionados con desarrollo de aplicaciones web frontend y backend'
  },
  {
    name: 'Desarrollo Mobile',
    description: 'Aplicaciones móviles nativas e híbridas para iOS y Android'
  },
  {
    name: 'DevOps',
    description: 'Proyectos de infraestructura, CI/CD, automatización y despliegue'
  },
  {
    name: 'UI/UX Design',
    description: 'Diseño de interfaces de usuario y experiencia de usuario'
  },
  {
    name: 'Data Science',
    description: 'Análisis de datos, machine learning e inteligencia artificial'
  },
  {
    name: 'Marketing Digital',
    description: 'Campañas de marketing, SEO, SEM y estrategias digitales'
  },
  {
    name: 'Consultoría',
    description: 'Proyectos de consultoría y asesoramiento técnico'
  },
  {
    name: 'Investigación',
    description: 'Proyectos de investigación y desarrollo de nuevas tecnologías'
  }
];

const seedCategories = async () => {
  try {
    console.log('🌱 Seeding categories...');
    
    // Buscar un usuario admin para asignar como creador
    const adminRole = await Role.findOne({ name: USER_ROLES.ADMIN });
    const adminUser = await User.findOne({ globalRole: adminRole._id });
    
    if (!adminUser) {
      console.log('⚠️ No se encontró usuario administrador. Saltando seeder de categorías.');
      return;
    }
    
    // Verificar si ya existen categorías
    const existingCategories = await Category.countDocuments();
    
    if (existingCategories === 0) {
      const categoriesToCreate = defaultCategories.map(category => ({
        ...category,
        createdBy: adminUser._id
      }));
      
      const categories = await Category.insertMany(categoriesToCreate);
      console.log(`✅ ${categories.length} categorías creadas exitosamente`);
      
      categories.forEach(category => {
        console.log(`   - ${category.name}: ${category.description}`);
      });
    } else {
      console.log('ℹ️ Las categorías ya existen en la base de datos');
      
      // Verificar si faltan categorías y agregarlas
      for (const categoryData of defaultCategories) {
        const existingCategory = await Category.findOne({ name: categoryData.name });
        if (!existingCategory) {
          const newCategory = await Category.create({
            ...categoryData,
            createdBy: adminUser._id
          });
          console.log(`✅ Categoría agregada: ${newCategory.name}`);
        }
      }
    }
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    throw error;
  }
};

export default seedCategories;