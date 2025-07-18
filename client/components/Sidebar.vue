<template>
  <aside class="bg-gray-800 text-white flex flex-col transition-all duration-300 ease-in-out"
    :class="isExpanded ? 'w-64' : 'w-20'" @mouseover="isExpanded = true" @mouseleave="isExpanded = false">
    <div class="flex items-center justify-center py-6 px-4 border-b border-gray-700 flex-shrink-0">
      <NuxtImg src="/techrinobranco.webp" class="transition-all duration-300"
        :class="isExpanded ? 'opacity-100 h-20' : 'opacity-0 h-0'" />
    </div>

    <nav class="mt-4 flex-grow">
      <NuxtLink v-for="link in navigationLinks" :key="link.to" :to="link.to"
        class="flex items-center h-12 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors cursor-pointer aria-[current=page]:bg-gray-900 aria-[current=page]:text-white"
        :class="isExpanded ? 'px-6 gap-4' : 'justify-center'">
        <Icon :name="link.icon" class="h-6 w-6 flex-shrink-0" />

        <span class="overflow-hidden transition-all duration-200"
          :class="isExpanded ? 'w-full opacity-100' : 'w-0 opacity-0'">
          {{ link.name }}
        </span>
      </NuxtLink>
    </nav>

    <div class="p-4 border-t border-gray-700 flex-shrink-0">
      <button @click="handleLogout"
        class="w-full h-12 flex items-center text-white bg-red-600/80 hover:bg-red-700 transition-colors rounded-lg cursor-pointer"
        :class="isExpanded ? 'px-6 gap-4' : 'justify-center'">
        <Icon name="heroicons:arrow-left-on-rectangle-20-solid" class="h-6 w-6 flex-shrink-0" />
        <span class="overflow-hidden transition-all duration-200"
          :class="isExpanded ? 'w-full opacity-100' : 'w-0 opacity-0'">
          Sair
        </span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue';

const isExpanded = ref(false);

const navigationLinks = [
  { to: '/dashboard', icon: 'heroicons:home-solid', name: 'Início' },
  { to: '/tarefas', icon: 'heroicons:view-columns-solid', name: 'Tarefas' },
  { to: '/orcamentos', icon: 'heroicons:document-text-solid', name: 'Orçamentos' },
  { to: '/clientes', icon: 'heroicons:users-solid', name: 'Clientes' },
  { to: '/financeiro', icon: 'heroicons:scale-solid', name: 'Financeiro' },
];

async function handleLogout() {
  await navigateTo('/');
}
</script>