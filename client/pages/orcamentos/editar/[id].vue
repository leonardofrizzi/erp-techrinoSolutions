<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-4xl font-bold text-gray-800">Editar Orçamento #{{ quote.quoteNumber }}</h1>
        <p class="mt-2 text-gray-600">Altere os dados e salve o orçamento.</p>
      </div>
      <div class="flex gap-4">
        <NuxtLink to="/orcamentos" class="bg-white border border-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-100">Cancelar</NuxtLink>
        <button @click="saveQuote" class="bg-blue-900 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-800">Salvar Alterações</button>
      </div>
    </div>
    
    <div v-if="pendingClients || pendingQuote">Carregando dados...</div>
    <div v-else-if="errorClients || errorQuote">Erro ao carregar dados.</div>
    <div v-else class="space-y-6">
      <div class="bg-white p-6 rounded-xl shadow-sm">
        <h2 class="text-xl font-bold text-gray-700 mb-4">Dados do Cliente</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Cliente</label>
            <select v-model="quote.clientId" class="mt-1 w-full p-2 border border-gray-300 rounded-lg bg-white">
              <option :value="null" disabled>Selecione um cliente</option>
              <option v-for="client in clients" :key="client.id" :value="client.id">{{ client.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Contato</label>
            <select v-model="quote.contactId" :disabled="!quote.clientId" class="mt-1 w-full p-2 border border-gray-300 rounded-lg bg-white disabled:bg-gray-100">
              <option :value="null" disabled>Selecione um contato</option>
              <option v-for="contact in selectedClientContacts" :key="contact.id" :value="contact.id">{{ contact.name }}</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-xl shadow-sm">
        <h2 class="text-xl font-bold text-gray-700 mb-4">Itens do Orçamento</h2>
        <div class="hidden md:flex gap-4 mb-2 text-sm font-semibold text-gray-600">
          <p class="flex-1">Descrição</p>
          <p class="w-24 text-right">Quantidade</p>
          <p class="w-32 text-right">Valor Unitário</p>
          <p class="w-32 text-right">Subtotal</p>
          <div class="w-10"></div>
        </div>
        <div v-for="(item, index) in quote.items" :key="index" class="flex flex-col md:flex-row gap-4 items-center mb-4 bg-gray-50 p-3 rounded-lg border">
          <div class="w-full md:flex-1">
            <label class="md:hidden text-xs text-gray-500">Descrição</label>
            <input v-model="item.description" type="text" placeholder="Descrição do item ou serviço" class="w-full p-2 border border-gray-300 rounded-lg" />
          </div>
          <div class="w-full md:w-28">
            <label class="md:hidden text-xs text-gray-500">Quantidade</label>
            <input v-model.number="item.quantity" type="number" placeholder="Qtd." class="w-full p-2 border border-gray-300 rounded-lg text-right" />
          </div>
          <div class="w-full md:w-36">
            <label class="md:hidden text-xs text-gray-500">Valor Unitário</label>
            <input v-model.number="item.unitPrice" type="number" placeholder="Valor Unit." class="w-full p-2 border border-gray-300 rounded-lg text-right" />
          </div>
          <div class="w-full md:w-40 text-right">
            <label class="md:hidden text-xs text-gray-500">Subtotal</label>
            <p class="font-semibold text-gray-800 p-2 text-lg">{{ (item.quantity * item.unitPrice || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}</p>
          </div>
          <div class="w-full md:w-auto">
            <button @click="removeItem(index)" class="w-full md:w-auto p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"><Icon name="heroicons:trash-20-solid" class="h-5 w-5 mx-auto" /></button>
          </div>
        </div>
        <button @click="addItem" class="mt-4 text-sm font-medium text-blue-900 hover:text-blue-700">+ Adicionar novo item</button>
        <div class="border-t mt-6 pt-4 flex justify-end">
          <div class="text-right w-64">
            <div class="flex justify-between">
              <span class="text-gray-600">Subtotal</span>
              <span class="font-semibold text-gray-800">{{ totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}</span>
            </div>
            <div class="flex justify-between mt-2">
              <span class="text-xl font-bold text-gray-900">Valor Total</span>
              <span class="text-xl font-bold text-gray-900">{{ totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const route = useRoute();
const router = useRouter();
const quoteId = route.params.id;

const { data: clients, pending: pendingClients, error: errorClients } = await useFetch('http://localhost:3001/clients');
const { data: quote, pending: pendingQuote, error: errorQuote } = await useFetch(`http://localhost:3001/orcamentos/${quoteId}`);

const selectedClientContacts = ref([]);

watch(() => quote.value?.clientId, (newClientId) => {
  if (newClientId && clients.value) {
    const selectedClient = clients.value.find(c => c.id === newClientId);
    selectedClientContacts.value = selectedClient.contacts;
  } else {
    selectedClientContacts.value = [];
  }
}, { immediate: true });

const totalValue = computed(() => {
  if (!quote.value || !quote.value.items) return 0;
  return quote.value.items.reduce((total, item) => {
    return total + (item.quantity * item.unitPrice);
  }, 0);
});

function addItem() {
  if (!quote.value.items) quote.value.items = [];
  quote.value.items.push({ description: '', quantity: 1, unitPrice: 0 });
}

function removeItem(index) {
  quote.value.items.splice(index, 1);
}

async function saveQuote() {
  try {
    const dataToSend = {
      ...quote.value,
      totalValue: totalValue.value,
    };
    
    await $fetch(`http://localhost:3001/orcamentos/${quoteId}`, {
      method: 'PUT',
      body: dataToSend,
    });
    
    alert('Orçamento atualizado com sucesso!');
    router.push('/orcamentos');
  } catch (err) {
    console.error("Erro ao atualizar orçamento:", err);
    alert('Não foi possível atualizar o orçamento.');
  }
}

definePageMeta({ layout: 'default' });
useHead({ title: 'Editar Orçamento - Techrino Solutions' });
</script>