export const USER_ROLES = {
  ADMIN: 'Admin',
  PROJECT_MANAGER: 'Project Manager',
  DEVELOPER: 'Developer',
  VIEWER: 'Viewer'
};

export const PROJECT_PRIORITIES = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical'
};

export const TASK_PRIORITIES = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical'
};

export const STATE_TYPES = {
  PROJECT: 'Project',
  TASK: 'Task'
};

export const DEFAULT_PROJECT_STATES = [
  { name: 'Planificación', type: 'Project', order: 1 },
  { name: 'En Progreso', type: 'Project', order: 2 },
  { name: 'En Revisión', type: 'Project', order: 3 },
  { name: 'Completado', type: 'Project', order: 4 },
  { name: 'Cancelado', type: 'Project', order: 5 }
];

export const DEFAULT_TASK_STATES = [
  { name: 'Pendiente', type: 'Task', order: 1 },
  { name: 'En Progreso', type: 'Task', order: 2 },
  { name: 'En Revisión', type: 'Task', order: 3 },
  { name: 'Completada', type: 'Task', order: 4 },
  { name: 'Cancelada', type: 'Task', order: 5 }
];

export const ALLOWED_FILE_TYPES = {
  IMAGES: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  DOCUMENTS: ['pdf', 'doc', 'docx', 'txt', 'rtf'],
  ARCHIVES: ['zip', 'rar', '7z']
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

export const JWT_TYPES = {
  ACCESS: 'access',
  REFRESH: 'refresh',
  RESET_PASSWORD: 'reset_password',
  EMAIL_VERIFICATION: 'email_verification'
};

export const EMAIL_TEMPLATES = {
  WELCOME: 'welcome',
  RESET_PASSWORD: 'resetPassword',
  PROJECT_INVITATION: 'projectInvitation',
  TASK_ASSIGNED: 'taskAssigned',
  PROJECT_UPDATE: 'projectUpdate',
  TASK_DUE: 'taskDue',
  PROJECT_DEADLINE: 'projectDeadline'
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500
};

export const DEEPSEEK_CONFIG = {
  MODEL: 'deepseek-chat',
  MAX_TOKENS: 1000,
  TEMPERATURE: 0.7,
  API_URL: 'https://api.deepseek.com/v1/chat/completions'
};