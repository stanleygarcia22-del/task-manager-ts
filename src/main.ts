console.log("🚀 El archivo main.ts ha cargado correctamente");

import { TaskManager } from './utils/TaskManager.ts';
import { Render } from './ui/Render';
import type { Priority, Category, TaskStatus, Task } from './models/Task';

// Instancias principales
const taskManager = new TaskManager();
const renderer = new Render('task-list');

// Elementos del Formulario
const taskForm = document.getElementById('task-form') as HTMLFormElement;
const taskIdInput = document.getElementById('task-id') as HTMLInputElement;
const titleInput = document.getElementById('task-title') as HTMLInputElement;
const descInput = document.getElementById('task-description') as HTMLTextAreaElement;
const categorySelect = document.getElementById('task-category') as HTMLSelectElement;
const prioritySelect = document.getElementById('task-priority') as HTMLSelectElement;
const formTitle = document.getElementById('form-title') as HTMLElement;
const btnSave = document.getElementById('btn-save') as HTMLButtonElement;
const btnCancel = document.getElementById('btn-cancel') as HTMLButtonElement;

// Elementos de Filtros y Búsqueda
const searchInput = document.getElementById('search-input') as HTMLInputElement;
const filterStatusSelect = document.getElementById('filter-status') as HTMLSelectElement;
const filterPrioritySelect = document.getElementById('filter-priority') as HTMLSelectElement;

/**
 * Actualiza la vista filtrando las tareas.
 */
function updateView(): void {
  const currentStatus = (filterStatusSelect?.value as TaskStatus) || 'todas';
  const currentPriority = (filterPrioritySelect?.value as Priority | 'todas') || 'todas';
  const searchQuery = searchInput?.value || '';

  const filteredTasks = taskManager.filterTasks(currentStatus, currentPriority, searchQuery);

  renderer.renderTaskList(
    filteredTasks,
    (id) => {
      taskManager.toggleTaskStatus(id);
      updateView();
    },
    (task) => prepareEditForm(task),
    (id) => {
      taskManager.deleteTask(id);
      updateView();
    }
  );
}

/**
 * Prepara el formulario para editar una tarea.
 */
function prepareEditForm(task: Task): void {
  if (!taskIdInput || !titleInput || !descInput || !categorySelect || !prioritySelect) return;

  taskIdInput.value = task.id;
  titleInput.value = task.title;
  descInput.value = task.description;
  categorySelect.value = task.category;
  prioritySelect.value = task.priority;

  if (formTitle) formTitle.textContent = 'Editar Tarea';
  if (btnSave) btnSave.textContent = 'Actualizar Tarea';
  if (btnCancel) btnCancel.classList.remove('hidden');
  titleInput.focus();
}

/**
 * Resetea el formulario a su estado original.
 */
function resetForm(): void {
  if (taskForm) taskForm.reset();
  if (taskIdInput) taskIdInput.value = '';
  if (formTitle) formTitle.textContent = 'Nueva Tarea';
  if (btnSave) btnSave.textContent = 'Guardar Tarea';
  if (btnCancel) btnCancel.classList.add('hidden');
}

// Evento Submit del Formulario
if (taskForm) {
  taskForm.addEventListener('submit', (e: Event) => {
    e.preventDefault();

    const id = taskIdInput ? taskIdInput.value : '';
    const title = titleInput ? titleInput.value : '';
    const description = descInput ? descInput.value : '';
    const category = (categorySelect ? categorySelect.value : 'estudio') as Category;
    const priority = (prioritySelect ? prioritySelect.value : 'media') as Priority;

    if (!title.trim()) return;

    if (id) {
      taskManager.updateTask(id, { title, description, category, priority });
    } else {
      taskManager.addTask(title, description, category, priority);
    }

    resetForm();
    updateView();
  });
}

// Evento Cancelar Edición
if (btnCancel) {
  btnCancel.addEventListener('click', resetForm);
}

// Eventos de Filtros y Búsqueda en tiempo real
if (searchInput) searchInput.addEventListener('input', updateView);
if (filterStatusSelect) filterStatusSelect.addEventListener('change', updateView);
if (filterPrioritySelect) filterPrioritySelect.addEventListener('change', updateView);

// Renderizado inicial al abrir la app
updateView();