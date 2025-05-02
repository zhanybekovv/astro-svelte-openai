<script lang="ts">
  import { onMount } from 'svelte';
  import { actions } from 'astro:actions';

  // ─── Types ────────────────────────────────────────────────────────────────
  interface Task {
    id: number;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    dueDate: Date;
    completed: boolean;
  }

  type FormValues = {
    title: string;
    description: string;
    priority: Task['priority'];
    dueDate: Date;
    completed: boolean;
  };

  let tasks = $state<Task[]>([]);
  let filterPriority: 'all' | 'low' | 'medium' | 'high' = $state('all');
  let filterCompleted: 'all' | 'completed' | 'active' = $state('all');
  let filteredTasks: Task[] = $derived(tasks.filter(task => 
      (filterPriority === 'all' || task.priority === filterPriority) &&
      (filterCompleted === 'all' || (filterCompleted === 'completed' ? task.completed : !task.completed))
  ))
  let editingId = $state<number | 'new' | null>(null);
  let addingNew = $state(false);
  let formValues = $state<FormValues>({
    title: '',
    description: '',
    priority: 'low',
    dueDate: new Date(),
    completed: false,
  });

  onMount(async () => {
    const { data } = await actions.getTasks();
    if (data) {
      tasks = data as Task[];
    }
  });

  function startEdit(task: Task) {
    editingId = task.id;
    formValues = {
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: new Date(task.dueDate).toISOString().split('T')[0] as unknown as Date,
      completed: task.completed,
    };
  }

  function startCreate() {
    addingNew = true;
    editingId = 'new';
    formValues = { title: '', description: '', priority: 'low', dueDate: new Date(), completed: false };
  }

  function toFormData(values: FormValues): FormData {
    const fd = new FormData();
    fd.append("title", values.title);
    fd.append("description", values.description);
    fd.append("priority", values.priority);
    if (values.dueDate) {
      fd.append("dueDate", new Date(values.dueDate).toISOString());
    }
    return fd;
  }

  async function confirmEdit(id: number | 'new') {
    if (id === 'new') {
      const { data, error } = await actions.createTask(toFormData(formValues));
      if (!error) {
        tasks.push(data as Task);
        addingNew = false;
        editingId = null;
      }
    } else {
      const payload = { id, ...formValues };
      const { data, error } = await actions.updateTask(payload);
      if (!error) {
        const idx = tasks.findIndex(t => t.id === id);
        tasks[idx] = data as Task;
        editingId = null;
      }
    }
  }

  async function deleteTask(id: number) {
    const { error } = await actions.deleteTask({ id });
    if (!error) {
      tasks = tasks.filter(task => task.id !== id);
    }
  }

  async function toggleComplete(task: Task) {
    const payload = { ...task, completed: !task.completed };
    const { data, error } = await actions.updateTask(payload);
    if (!error) {
      const idx = tasks.findIndex(t => t.id === task.id);
      tasks[idx] = data as Task;
    }
  }

  function cancelEdit() {
    addingNew = false;
    editingId = null;
  }
</script>

<div class="mb-4 flex items-center gap-4">
  <button onclick={startCreate} class="px-4 py-2 bg-green-600 text-white rounded">
    Create New Task
  </button>
  <label>
    Priority:
    <select bind:value={filterPriority} class="ml-2 border rounded px-2 py-1">
      <option value="all">All</option>
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
    </select>
  </label>
  <label>
    Status:
    <select bind:value={filterCompleted} class="ml-2 border rounded px-2 py-1">
      <option value="all">All</option>
      <option value="completed">Completed</option>
      <option value="active">Active</option>
    </select>
  </label>
</div>
<table class="min-w-full border">
  <thead>
    <tr class="bg-gray-100">
      <th class="px-4 py-2">Title</th>
      <th class="px-4 py-2">Description</th>
      <th class="px-4 py-2">Priority</th>
      <th class="px-4 py-2">Due Date</th>
      <th class="px-4 py-2">Is Completed</th>
      <th class="px-4 py-2">Actions</th>
    </tr>
  </thead>
  <tbody>
    {#if addingNew && editingId === 'new'}
      <tr class="border-t">
        <td class="px-4 py-2">
          <input
            bind:value={formValues.title}
            class="border rounded px-2 py-1 w-full"
            placeholder="Title"
          />
        </td>
        <td class="px-4 py-2">
          <input
            bind:value={formValues.description}
            class="border rounded px-2 py-1 w-full"
            placeholder="Description"
          />
        </td>
        <td class="px-4 py-2">
          <select bind:value={formValues.priority} class="border rounded px-2 py-1">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </td>
        <td class="px-4 py-2">
          <input
            type="date"
            bind:value={formValues.dueDate}
            class="border rounded px-2 py-1"
          />
        </td>
        <td class="px-4 py-2 text-center">
          <input
            type="checkbox"
            bind:checked={formValues.completed}
            class="h-4 w-4" />
        </td>
        <td class="px-4 py-2 space-x-2">
          <button
            onclick={() => confirmEdit('new')}
            class="px-3 py-1 bg-green-500 text-white rounded"
          >
            Confirm
          </button>
          <button
            onclick={cancelEdit}
            class="px-3 py-1 bg-gray-300 rounded"
          >
            Cancel
          </button>
        </td>
      </tr>
    {/if}

    {#each filteredTasks as task (task.id)}
      <tr class={
        `border-t ${task.completed ? 'line-through' : ''}`
      }>
        {#if editingId === task.id}
          <!-- Edit mode -->
          <td class="px-4 py-2">
            <input
              bind:value={formValues.title}
              class="border rounded px-2 py-1 w-full"
            />
          </td>
          <td class="px-4 py-2">
            <input
              bind:value={formValues.description}
              class="border rounded px-2 py-1 w-full"
            />
          </td>
          <td class="px-4 py-2">
            <select bind:value={formValues.priority} class="border rounded px-2 py-1">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </td>
          <td class="px-4 py-2">
            <input
              type="date"
              bind:value={formValues.dueDate}
              class="border rounded px-2 py-1"
            />
          </td>
          <td class="px-4 py-2 text-center">
            <input
              type="checkbox"
              bind:checked={formValues.completed}
              class="h-4 w-4" />
          </td>
          <td class="px-4 py-2 space-x-2">
            <button
              onclick={() => confirmEdit(task.id)}
              class="px-3 py-1 bg-green-500 text-white rounded"
            >
              Save
            </button>
            <button
              onclick={cancelEdit}
              class="px-3 py-1 bg-gray-300 rounded"
            >
              Cancel
            </button>
          </td>
        {:else}
          <!-- Display mode -->
          <td class="px-4 py-2">{task.title}</td>
          <td class="px-4 py-2">{task.description}</td>
          <td class="px-4 py-2">{task.priority}</td>
          <td class="px-4 py-2">{new Date(task.dueDate)}</td>
          <td class="px-4 py-2 text-center">
            <input
              type="checkbox"
              checked={task.completed}
              onchange={() => toggleComplete(task)}
              class="h-4 w-4 cursor-pointer"
            />
            <span>{task.completed ? 'Completed' : 'Not Completed'}</span>
          </td>
          <td class="px-4 py-2">
            <button
              onclick={() => startEdit(task)}
              class={`px-3 py-1 bg-blue-500 text-white rounded ${task.completed ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
              disabled={task.completed}
            >
              Edit
            </button>
            <button
              onclick={() => deleteTask(task.id)}
              class="px-3 py-1 bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </td>
        {/if}
      </tr>
    {/each}
  </tbody>
</table>
