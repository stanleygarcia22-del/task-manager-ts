// Tipos de datos para prioridades y categorías
export type Priority = 'baja' | 'media' | 'alta';
export type Category = 'trabajo' | 'estudio' | 'personal' | 'otro';
export type TaskStatus = 'todas' | 'pendientes' | 'completadas';

// Interfaz que define la estructura estricta de una Tarea
export interface Task {
  id: string;
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  completed: boolean;
  createdAt: string;
}