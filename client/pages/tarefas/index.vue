<template>
  <div>
    <h1 class="text-4xl font-bold text-gray-800">Quadro de Tarefas</h1>
    <p class="mt-2 text-gray-600">Adicione ou mova as tarefas para organizar o fluxo de trabalho.</p>

    <KanbanBoard />
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default',
});

useHead({
  title: 'Quadro de Tarefas - Techrino Solutions'
});
</script>