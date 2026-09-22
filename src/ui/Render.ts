import type { Task } from '../models/Task';

export class Render {
  private container: HTMLElement;

  constructor(containerId: string) {
    const element = document.getElementById(containerId);
    if (!element) {
      throw new Error(`El contenedor con ID "${containerId}" no fue encontrado en el DOM.`);
    }
    this.container = element;
  }

  /**
   * Renderiza la lista de tareas recibida en el DOM.
   */
  public renderTaskList(
    tasks: Task[],
    onToggle: (id: string) => void,
    onEdit: (task: Task) => void,
    onDelete: (id: string) => void
  ): void {
    this.container.innerHTML = '';

    if (tasks.length === 0) {
      this.container.innerHTML = `
        <div class="empty-state">
          <p>📝 No se encontraron tareas.</p>
        </div>
      `;
      return;
    }

    tasks.forEach((task) => {
      const card = document.createElement('div');
      card.className = `task-card priority-${task.priority} ${task.completed ? 'completed' : ''}`;

      const dateFormatted = new Date(task.createdAt).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

      card.innerHTML = `
        <div class="task-info">
          <div class="task-header">
            <input type="checkbox" class="task-toggle" ${task.completed ? 'checked' : ''} />
            <span class="task-title">${this.escapeHTML(task.title)}</span>
            <span class="badge badge-category">${task.category}</span>
            <span class="badge badge-priority-${task.priority}">${task.priority}</span>
          </div>
          ${task.description ? `<p class="task-desc">${this.escapeHTML(task.description)}</p>` : ''}
          <span class="task-date">Creada: ${dateFormatted}</span>
        </div>
        <div class="task-card-actions">
          <button class="btn-icon btn-edit" title="Editar Tarea">✏️</button>
          <button class="btn-icon btn-delete" title="Eliminar Tarea">🗑️</button>
        </div>
      `;

      // Eventos individuales
      const checkbox = card.querySelector('.task-toggle') as HTMLInputElement;
      checkbox.addEventListener('change', () => onToggle(task.id));

      const editBtn = card.querySelector('.btn-edit') as HTMLButtonElement;
      editBtn.addEventListener('click', () => onEdit(task));

      const deleteBtn = card.querySelector('.btn-delete') as HTMLButtonElement;
      deleteBtn.addEventListener('click', () => {
        if (confirm(`¿Estás seguro de que deseas eliminar la tarea "${task.title}"?`)) {
          onDelete(task.id);
        }
      });

      this.container.appendChild(card);
    });
  }

  /**
   * Escapa caracteres especiales para evitar inyecciones XSS.
   */
  private escapeHTML(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}