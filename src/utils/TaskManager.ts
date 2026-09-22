import type { Task, Priority, Category, TaskStatus } from '../models/Task';
import { StorageService } from '../services/StorageService';

export class TaskManager {
  private tasks: Task[];

  constructor() {
    this.tasks = StorageService.getTasks();
  }

  /**
   * Obtiene todas las tareas cargadas.
   */
  public getAllTasks(): Task[] {
    return [...this.tasks];
  }

  /**
   * Crea una nueva tarea y la guarda.
   */
  public addTask(
    title: string,
    description: string,
    category: Category,
    priority: Priority
  ): Task {
    const newTask: Task = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    this.tasks.unshift(newTask);
    this.save();
    return newTask;
  }

  /**
   * Edita una tarea existente por su ID.
   */
  public updateTask(
    id: string,
    updatedData: Partial<Omit<Task, 'id' | 'createdAt'>>
  ): boolean {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;

    this.tasks[index] = {
      ...this.tasks[index],
      ...updatedData,
    };

    this.save();
    return true;
  }

  /**
   * Elimina una tarea por su ID.
   */
  public deleteTask(id: string): boolean {
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter((t) => t.id !== id);

    if (this.tasks.length !== initialLength) {
      this.save();
      return true;
    }
    return false;
  }

  /**
   * Alterna el estado de completado de una tarea.
   */
  public toggleTaskStatus(id: string): boolean {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.save();
      return true;
    }
    return false;
  }

  /**
   * Aplica filtros por estado, prioridad y término de búsqueda.
   */
  public filterTasks(
    status: TaskStatus = 'todas',
    priority: Priority | 'todas' = 'todas',
    searchQuery: string = ''
  ): Task[] {
    return this.tasks.filter((task) => {
      // Filtro por estado
      const matchesStatus =
        status === 'todas'
          ? true
          : status === 'completadas'
          ? task.completed
          : !task.completed;

      // Filtro por prioridad
      const matchesPriority =
        priority === 'todas' ? true : task.priority === priority;

      // Filtro por búsqueda de título (sin importar mayúsculas)
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === '' || task.title.toLowerCase().includes(query);

      return matchesStatus && matchesPriority && matchesSearch;
    });
  }

  /**
   * Sincroniza las tareas actuales con localStorage.
   */
  private save(): void {
    StorageService.saveTasks(this.tasks);
  }
}