import type { Task } from '../models/Task';

const STORAGE_KEY = 'task_manager_tasks_v1';

export class StorageService {
  /**
   * Obtiene todas las tareas guardadas en localStorage.
   */
  public static getTasks(): Task[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error al leer de localStorage:', error);
      return [];
    }
  }

  /**
   * Guarda el arreglo completo de tareas en localStorage.
   */
  public static saveTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
    }
  }

  /**
   * Limpia todas las tareas guardadas en localStorage.
   */
  public static clearTasks(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}