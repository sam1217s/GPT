// Groq AI Service (Free & Fast)
let isAIAvailable = false;
let aiConfig = {};

// Configuración de proveedores de IA
const AI_PROVIDERS = {
  groq: {
    url: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'llama3-70b-8192', // Muy rápido y capaz
    key: process.env.GROQ_API_KEY,
    name: 'Groq'
  },
  deepseek: {
    url: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat',
    key: process.env.DEEPSEEK_API_KEY,
    name: 'DeepSeek'
  }
};

// Detectar proveedor disponible
const provider = process.env.AI_PROVIDER || 'groq';
if (AI_PROVIDERS[provider]?.key) {
  isAIAvailable = true;
  aiConfig = AI_PROVIDERS[provider];
  console.log(`✅ ${aiConfig.name} AI configurado`);
} else if (AI_PROVIDERS.groq.key) {
  isAIAvailable = true;
  aiConfig = AI_PROVIDERS.groq;
  console.log(`✅ ${aiConfig.name} AI configurado (fallback)`);
} else if (AI_PROVIDERS.deepseek.key) {
  isAIAvailable = true;
  aiConfig = AI_PROVIDERS.deepseek;
  console.log(`✅ ${aiConfig.name} AI configurado (fallback)`);
} else {
  console.log('⚠️ No hay API keys de IA configuradas. Funciones de IA deshabilitadas.');
}

export const aiService = {
  async generateTasks(projectDescription, projectName) {
    if (!isAIAvailable) {
      throw new Error('IA no está configurada. Configura GROQ_API_KEY en .env');
    }

    try {
      const prompt = `
        Basándote en la siguiente descripción de proyecto, genera una lista de tareas específicas y accionables:
        
        Proyecto: ${projectName}
        Descripción: ${projectDescription}
        
        Genera entre 5-10 tareas en formato JSON con la siguiente estructura:
        [
          {
            "title": "Título de la tarea",
            "description": "Descripción detallada",
            "estimatedHours": número_de_horas,
            "priority": "Low|Medium|High|Critical"
          }
        ]
        
        Responde SOLO con el JSON válido, sin texto adicional.
      `;

      const response = await fetch(aiConfig.url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${aiConfig.key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: aiConfig.model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${aiConfig.name} API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Limpiar la respuesta de markdown si existe
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      return JSON.parse(cleanContent);
    } catch (error) {
      console.error('Error generando tareas:', error);
      throw new Error(`Error generando tareas con ${aiConfig.name} IA`);
    }
  },

  async analyzeProject(projectData, tasks) {
    if (!isAIAvailable) {
      throw new Error('IA no está configurada');
    }

    try {
      const prompt = `
        Analiza el siguiente proyecto y sus tareas para generar sugerencias de mejora:
        
        Proyecto: ${JSON.stringify(projectData, null, 2)}
        Tareas: ${JSON.stringify(tasks, null, 2)}
        
        Proporciona análisis y sugerencias en formato JSON:
        {
          "analysis": "Análisis general del proyecto",
          "suggestions": ["sugerencia 1", "sugerencia 2"],
          "riskFactors": ["riesgo 1", "riesgo 2"],
          "recommendations": ["recomendación 1", "recomendación 2"]
        }
        
        Responde SOLO con el JSON válido.
      `;

      const response = await fetch(aiConfig.url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${aiConfig.key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: aiConfig.model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${aiConfig.name} API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      return JSON.parse(cleanContent);
    } catch (error) {
      console.error('Error analizando proyecto:', error);
      throw new Error(`Error analizando proyecto con ${aiConfig.name} IA`);
    }
  },

  async estimateTaskTime(taskDescription, taskType = 'general') {
    if (!isAIAvailable) {
      throw new Error('IA no está configurada');
    }

    try {
      const prompt = `
        Estima el tiempo necesario para completar la siguiente tarea:
        
        Tarea: ${taskDescription}
        Tipo: ${taskType}
        
        Considera factores como complejidad, testing, documentación, etc.
        
        Responde en formato JSON:
        {
          "estimatedHours": número_de_horas,
          "confidence": "Low|Medium|High",
          "factors": ["factor 1", "factor 2"],
          "breakdown": {
            "development": horas,
            "testing": horas,
            "documentation": horas
          }
        }
        
        Responde SOLO con el JSON válido.
      `;

      const response = await fetch(aiConfig.url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${aiConfig.key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: aiConfig.model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 800,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${aiConfig.name} API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      return JSON.parse(cleanContent);
    } catch (error) {
      console.error('Error estimando tiempo:', error);
      throw new Error(`Error estimando tiempo con ${aiConfig.name} IA`);
    }
  },

  async generateProjectSummary(project, tasks, comments) {
    if (!isAIAvailable) {
      throw new Error('IA no está configurada');
    }

    try {
      const prompt = `
        Genera un resumen ejecutivo del siguiente proyecto:
        
        Proyecto: ${JSON.stringify(project, null, 2)}
        Tareas completadas: ${tasks.filter(t => t.completedAt).length}
        Total tareas: ${tasks.length}
        Comentarios recientes: ${comments.slice(0, 5).length}
        
        Genera un resumen en formato JSON:
        {
          "summary": "Resumen ejecutivo del progreso",
          "progress": porcentaje_completado,
          "status": "On Track|At Risk|Delayed",
          "nextSteps": ["paso 1", "paso 2"],
          "achievements": ["logro 1", "logro 2"],
          "concerns": ["preocupación 1", "preocupación 2"]
        }
        
        Responde SOLO con el JSON válido.
      `;

      const response = await fetch(aiConfig.url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${aiConfig.key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: aiConfig.model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${aiConfig.name} API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      return JSON.parse(cleanContent);
    } catch (error) {
      console.error('Error generando resumen:', error);
      throw new Error(`Error generando resumen con ${aiConfig.name} IA`);
    }
  },

  async testConnection() {
    if (!isAIAvailable) {
      return { 
        success: false, 
        message: 'No hay API keys de IA configuradas' 
      };
    }

    try {
      const response = await fetch(aiConfig.url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${aiConfig.key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: aiConfig.model,
          messages: [{ role: 'user', content: 'Test connection - respond with "OK"' }],
          max_tokens: 10
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        return { 
          success: false, 
          message: `${aiConfig.name} API error: ${response.status} - ${errorText}`,
          statusCode: response.status
        };
      }

      const data = await response.json();
      return { 
        success: true, 
        message: `${aiConfig.name} API conectada correctamente`,
        statusCode: response.status,
        model: aiConfig.model,
        usage: data.usage
      };
    } catch (error) {
      return { 
        success: false, 
        message: `Error de conexión con ${aiConfig.name}: ${error.message}` 
      };
    }
  }
};