// ===== src/seeders/stateSeeder.js =====
import State from '../models/State.js';
import { DEFAULT_PROJECT_STATES, DEFAULT_TASK_STATES } from '../config/constants.js';

const seedStates = async () => {
  try {
    console.log('🌱 Seeding states...');
    
    // Verificar estados de proyecto
    const existingProjectStates = await State.countDocuments({ type: 'Project' });
    
    if (existingProjectStates === 0) {
      const projectStates = await State.insertMany(DEFAULT_PROJECT_STATES);
      console.log(`✅ ${projectStates.length} estados de proyecto creados`);
      
      projectStates.forEach(state => {
        console.log(`   - ${state.name} (orden: ${state.order})`);
      });
    } else {
      console.log('ℹ️ Los estados de proyecto ya existen');
      
      // Verificar si faltan estados y agregarlos
      for (const stateData of DEFAULT_PROJECT_STATES) {
        const existingState = await State.findOne({ 
          name: stateData.name, 
          type: stateData.type 
        });
        if (!existingState) {
          const newState = await State.create(stateData);
          console.log(`✅ Estado de proyecto agregado: ${newState.name}`);
        }
      }
    }
    
    // Verificar estados de tarea
    const existingTaskStates = await State.countDocuments({ type: 'Task' });
    
    if (existingTaskStates === 0) {
      const taskStates = await State.insertMany(DEFAULT_TASK_STATES);
      console.log(`✅ ${taskStates.length} estados de tarea creados`);
      
      taskStates.forEach(state => {
        console.log(`   - ${state.name} (orden: ${state.order})`);
      });
    } else {
      console.log('ℹ️ Los estados de tarea ya existen');
      
      // Verificar si faltan estados y agregarlos
      for (const stateData of DEFAULT_TASK_STATES) {
        const existingState = await State.findOne({ 
          name: stateData.name, 
          type: stateData.type 
        });
        if (!existingState) {
          const newState = await State.create(stateData);
          console.log(`✅ Estado de tarea agregado: ${newState.name}`);
        }
      }
    }
  } catch (error) {
    console.error('❌ Error seeding states:', error);
    throw error;
  }
};

export default seedStates;
