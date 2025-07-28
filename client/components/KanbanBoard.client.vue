<template>
  <div class="flex gap-6 mt-8 overflow-x-auto pb-4">
    <div 
      v-for="(column, columnIndex) in columns" 
      :key="column.id" 
      class="bg-gray-200 p-3 rounded-lg w-80 flex-shrink-0"
    >
      <h2 class="text-lg font-bold text-gray-700 mb-4 px-1">{{ column.title }} ({{ column.tasks.length }})</h2>
      <div :ref="el => columnRefs[columnIndex] = el" class="space-y-3 min-h-[400px]">
        <div v-for="task in column.tasks" :key="task.id" class="bg-white p-4 rounded-md shadow cursor-grab active:cursor-grabbing">
          <p class="font-semibold text-gray-800">{{ task.title }}</p>
          <p v-if="task.description" class="text-sm text-gray-600 mt-1">{{ task.description }}</p>
        </div>
      </div>
      <div class="mt-3">
        <div v-if="column.isAddingTask">
          <textarea v-model="column.newTaskTitle" class="w-full p-2 rounded-md border-gray-300 shadow-sm" placeholder="Digite o título..."></textarea>
          <div class="mt-2 flex items-center gap-2">
            <button @click="addTask(column)" class="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 text-sm font-semibold">Adicionar</button>
            <button @click="cancelAddTask(column)" class="p-2 text-gray-600 hover:text-gray-900"><Icon name="heroicons:x-mark-20-solid" /></button>
          </div>
        </div>
        <button
          v-else
          @click="showAddTaskForm(column)"
          class="w-full flex items-center gap-2 text-gray-600 hover:text-gray-900 p-2 rounded-md hover:bg-gray-300"
        >
          <Icon name="heroicons:plus-20-solid" />
          <span>Adicionar Tarefa</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSortable } from '@vueuse/core';

const columns = ref([
  { id: 1, title: 'A Fazer', tasks: [{ id: 101, title: 'Fazer orçamento Cliente A' }, { id: 102, title: 'Comprar rolamentos' }], isAddingTask: false, newTaskTitle: '' },
  { id: 2, title: 'Em Andamento', tasks: [{ id: 201, title: 'Manutenção motor elétrico' }], isAddingTask: false, newTaskTitle: '' },
  { id: 3, title: 'Concluído', tasks: [], isAddingTask: false, newTaskTitle: '' },
]);

const columnRefs = ref([]);

onMounted(() => {
  columnRefs.value.forEach((columnEl, index) => {
    if (columnEl) {
      useSortable(columnEl, columns.value[index].tasks, {
        group: 'tasks',
        animation: 150,
      });
    }
  });
});

function showAddTaskForm(column) { column.isAddingTask = true; }
function cancelAddTask(column) { column.isAddingTask = false; column.newTaskTitle = ''; }
function addTask(column) {
  const title = column.newTaskTitle.trim();
  if (!title) return;
  const newTask = { id: Date.now(), title, description: '' };
  column.tasks = [...column.tasks, newTask];
  cancelAddTask(column);
}
</script>