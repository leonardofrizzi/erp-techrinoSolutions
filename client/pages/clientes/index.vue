<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-4xl font-bold text-gray-800">Clientes</h1>
        <p class="mt-2 text-gray-600">Gerencie, adicione e visualize os clientes da Techrino Solutions.</p>
      </div>
      <button @click="openModal('add')" class="bg-blue-900 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-800 transition-transform transform hover:scale-105 flex items-center gap-2 shadow-sm">
        <Icon name="heroicons:plus-solid" class="h-5 w-5" />
        <span>Adicionar Cliente</span>
      </button>
    </div>

    <div class="bg-white p-4 rounded-xl shadow-sm mb-6">
      <div class="relative">
        <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input v-model="searchQuery" type="search" placeholder="Buscar por nome, CNPJ ou email..." class="w-full pl-10 p-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-800/30 focus:border-blue-800" />
      </div>
    </div>

    <div v-if="pending" class="text-center p-8">
      <p class="text-gray-500">Carregando clientes...</p>
    </div>
    <div v-else-if="error" class="text-center p-8 bg-red-50 text-red-600 rounded-lg">
      <p>Ocorreu um erro ao buscar os clientes. Tente novamente.</p>
      <p class="text-xs mt-2">{{ error.message }}</p>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div v-for="client in filteredClients" :key="client.id" class="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-blue-800">
        <div>
          <div class="flex justify-between items-start mb-4">
            <div>
              <p class="font-bold text-xl text-gray-900">{{ client.name }}</p>
              <p class="text-sm text-gray-500">{{ client.cnpj }}</p>
            </div>
            <span class="px-2 py-1 text-xs font-semibold rounded-full" :class="client.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
              {{ client.status }}
            </span>
          </div>
          <div class="border-t border-gray-100 mt-4 pt-4">
            <h4 class="text-xs font-bold text-gray-500 uppercase mb-3">Contatos</h4>
            <div class="space-y-3">
              <div v-for="contact in client.contacts" :key="contact.id" class="flex items-center gap-3">
                <Icon name="heroicons:user-circle-solid" class="h-5 w-5 text-gray-400 flex-shrink-0" />
                <div>
                  <p class="text-sm font-semibold text-gray-800">{{ contact.name }}</p>
                  <p class="text-xs text-gray-600">{{ contact.email }}</p>
                </div>
              </div>
              <p v-if="!client.contacts || client.contacts.length === 0" class="text-xs text-gray-500 italic">Nenhum contato cadastrado.</p>
            </div>
          </div>
        </div>
        <div class="border-t border-gray-100 mt-6 pt-4 flex justify-end gap-2">
          <button @click="openModal('edit', client)" class="p-2 text-gray-400 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors" title="Editar Cliente">
            <Icon name="heroicons:pencil-solid" class="h-5 w-5" />
          </button>
        </div>
      </div>
       <div v-if="filteredClients && filteredClients.length === 0" class="md:col-span-2 xl:col-span-3 text-center py-12 bg-white rounded-xl shadow-sm">
        <p class="text-gray-500">Nenhum cliente encontrado.</p>
      </div>
    </div>

    <ClientFormModal 
      :is-open="isModalOpen" 
      :mode="modalMode"
      :client="currentClient"
      @close="closeModal"
      @save="handleSaveClient"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const { data: clients, pending, error, refresh } = await useFetch('http://localhost:3001/clients');

const searchQuery = ref('');

const filteredClients = computed(() => {
  if (!clients.value) return [];
  if (!searchQuery.value) {
    return clients.value;
  }
  const lowerCaseQuery = searchQuery.value.toLowerCase();
  return clients.value.filter(client =>
    client.name.toLowerCase().includes(lowerCaseQuery) ||
    (client.cnpj && client.cnpj.includes(lowerCaseQuery))
  );
});

const isModalOpen = ref(false);
const modalMode = ref('add');
const currentClient = ref(null);

function openModal(mode, client = null) {
  modalMode.value = mode;
  currentClient.value = client;
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  currentClient.value = null;
}

async function handleSaveClient(clientData) {
  try {
    if (modalMode.value === 'add') {
      await $fetch('http://localhost:3001/clients', {
        method: 'POST',
        body: clientData
      });
      alert('Cliente adicionado com sucesso!');
    } else {
      await $fetch(`http://localhost:3001/clients/${clientData.id}`, {
        method: 'PUT',
        body: clientData
      });
      alert('Cliente atualizado com sucesso!');
    }
    
    refresh();

  } catch (err) {
    console.error('Erro ao salvar cliente:', err);
    alert('Não foi possível salvar os dados do cliente.');
  }
}

definePageMeta({ layout: 'default' });
useHead({ title: 'Clientes - Techrino Solutions' });
</script>