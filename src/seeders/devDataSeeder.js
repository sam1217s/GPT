// ===== src/seeders/devDataSeeder.js =====
import User from '../models/User.js';
import Role from '../models/Role.js';
import Category from '../models/Category.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import State from '../models/State.js';
import Comment from '../models/Comment.js';
import { USER_ROLES } from '../config/constants.js';

const seedDevData = async () => {
  try {
    console.log('🌱 Seeding development data...');
    
    // Solo ejecutar en desarrollo
    if (process.env.NODE_ENV !== 'development') {
      console.log('⚠️ Dev data seeder solo se ejecuta en entorno de desarrollo');
      return;
    }
    
    // Obtener roles y estados
    const [adminRole, pmRole, devRole, viewerRole] = await Promise.all([
      Role.findOne({ name: USER_ROLES.ADMIN }),
      Role.findOne({ name: USER_ROLES.PROJECT_MANAGER }),
      Role.findOne({ name: USER_ROLES.DEVELOPER }),
      Role.findOne({ name: USER_ROLES.VIEWER })
    ]);
    
    const [projectPlanningState, projectInProgressState, taskPendingState, taskInProgressState] = await Promise.all([
      State.findOne({ name: 'Planificación', type: 'Project' }),
      State.findOne({ name: 'En Progreso', type: 'Project' }),
      State.findOne({ name: 'Pendiente', type: 'Task' }),
      State.findOne({ name: 'En Progreso', type: 'Task' })
    ]);
    
    const category = await Category.findOne();
    
    // Crear usuarios de prueba
    const users = [];
    const usersData = [
      {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@company.com',
        password: 'Developer123!',
        globalRole: pmRole._id
      },
      {
        firstName: 'María',
        lastName: 'García',
        email: 'maria.garcia@company.com',
        password: 'Developer123!',
        globalRole: devRole._id
      },
      {
        firstName: 'Carlos',
        lastName: 'López',
        email: 'carlos.lopez@company.com',
        password: 'Developer123!',
        globalRole: devRole._id
      },
      {
        firstName: 'Ana',
        lastName: 'Martínez',
        email: 'ana.martinez@company.com',
        password: 'Developer123!',
        globalRole: viewerRole._id
      }
    ];
    
    for (const userData of usersData) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const user = await User.create({
          ...userData,
          isActive: true,
          isEmailVerified: true
        });
        users.push(user);
        console.log(`✅ Usuario creado: ${user.email}`);
      } else {
        users.push(existingUser);
      }
    }
    
    // Crear proyecto de ejemplo
    const existingProject = await Project.findOne({ name: 'Proyecto Demo API' });
    let project;
    
    if (!existingProject) {
      project = await Project.create({
        name: 'Proyecto Demo API',
        description: 'Proyecto de demostración para la API de gestión de proyectos y tareas',
        category: category._id,
        owner: users[0]._id, // Juan Pérez como owner
        status: projectInProgressState._id,
        priority: 'High',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
        estimatedHours: 120,
        actualHours: 45,
        budget: 10000,
        tags: ['demo', 'api', 'nodejs'],
        members: [
          {
            user: users[1]._id, // María García
            role: devRole._id,
            joinedAt: new Date()
          },
          {
            user: users[2]._id, // Carlos López
            role: devRole._id,
            joinedAt: new Date()
          },
          {
            user: users[3]._id, // Ana Martínez
            role: viewerRole._id,
            joinedAt: new Date()
          }
        ]
      });
      console.log(`✅ Proyecto creado: ${project.name}`);
    } else {
      project = existingProject;
      console.log('ℹ️ El proyecto demo ya existe');
    }
    
    // Crear tareas de ejemplo
    const tasksData = [
      {
        title: 'Configurar base de datos MongoDB',
        description: 'Configurar la conexión y esquemas de MongoDB para el proyecto',
        assignedTo: users[1]._id,
        priority: 'High',
        estimatedHours: 8,
        actualHours: 6,
        tags: ['backend', 'database']
      },
      {
        title: 'Implementar autenticación JWT',
        description: 'Desarrollar el sistema de autenticación con tokens JWT',
        assignedTo: users[2]._id,
        priority: 'Critical',
        estimatedHours: 12,
        actualHours: 0,
        tags: ['backend', 'security']
      },
      {
        title: 'Crear endpoints de proyectos',
        description: 'Implementar CRUD completo para la gestión de proyectos',
        assignedTo: users[1]._id,
        priority: 'Medium',
        estimatedHours: 16,
        actualHours: 8,
        tags: ['backend', 'api']
      },
      {
        title: 'Documentar API',
        description: 'Crear documentación completa de todos los endpoints',
        assignedTo: users[3]._id,
        priority: 'Low',
        estimatedHours: 8,
        actualHours: 0,
        tags: ['documentation']
      }
    ];
    
    for (const taskData of tasksData) {
      const existingTask = await Task.findOne({ 
        title: taskData.title,
        project: project._id 
      });
      
      if (!existingTask) {
        const task = await Task.create({
          ...taskData,
          project: project._id,
          createdBy: users[0]._id,
          status: taskData.actualHours > 0 ? taskInProgressState._id : taskPendingState._id,
          startDate: new Date(),
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
        });
        console.log(`✅ Tarea creada: ${task.title}`);
      }
    }
    
    // Crear comentarios de ejemplo
    const commentsData = [
      {
        content: 'Proyecto iniciado correctamente. Todos los miembros del equipo han sido notificados.',
        author: users[0]._id
      },
      {
        content: 'La configuración de la base de datos está completa. Procedemos con la autenticación.',
        author: users[1]._id
      },
      {
        content: 'Necesitamos revisar los requerimientos de seguridad antes de continuar.',
        author: users[2]._id
      }
    ];
    
    for (const commentData of commentsData) {
      const existingComment = await Comment.findOne({
        content: commentData.content,
        projectId: project._id
      });
      
      if (!existingComment) {
        await Comment.create({
          ...commentData,
          projectId: project._id
        });
        console.log(`✅ Comentario creado`);
      }
    }
    
    console.log('\n✅ Datos de desarrollo creados exitosamente');
    console.log('📧 Usuarios de prueba:');
    users.forEach(user => {
      console.log(`   - ${user.email} (${user.globalRole})`);
    });
    console.log('\n🔑 Contraseña para todos: Developer123!');
    
  } catch (error) {
    console.error('❌ Error seeding development data:', error);
    throw error;
  }
};

export default seedDevData;