<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-4xl font-bold text-gray-800">Financeiro</h1>
        <p class="mt-2 text-gray-600">Acompanhe as entradas e saídas da empresa.</p>
      </div>
      <button @click="openModal" class="bg-blue-900 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-2 shadow-sm">
        <Icon name="heroicons:plus-solid" class="h-5 w-5" />
        <span>Adicionar Transação</span>
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="p-4 text-left font-semibold text-gray-600">Data</th>
            <th class="p-4 text-left font-semibold text-gray-600">Descrição</th>
            <th class="p-4 text-left font-semibold text-gray-600">Tipo</th>
            <th class="p-4 text-left font-semibold text-gray-600">Valor</th>
            <th class="p-4 text-left font-semibold text-gray-600">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="pending">
            <td colspan="5" class="text-center text-gray-500 py-12">Carregando transações...</td>
          </tr>
          <tr v-else-if="error">
             <td colspan="5" class="text-center text-red-500 py-12">Ocorreu um erro ao buscar os dados.</td>
          </tr>
          <tr v-else-if="!transactions || transactions.length === 0">
            <td colspan="5" class="text-center text-gray-500 py-12">Nenhuma transação registrada.</td>
          </tr>
          <tr v-else v-for="transaction in transactions" :key="transaction.id" class="border-b last:border-b-0 border-gray-100 hover:bg-gray-50 transition-colors">
            <td class="p-4 text-gray-700">{{ new Date(transaction.transactionDate).toLocaleDateString('pt-BR') }}</td>
            <td class="p-4"><p class="font-semibold text-gray-900">{{ transaction.description }}</p></td>
            <td class="p-4">
              <span class="px-2 py-1 text-xs font-semibold rounded-full capitalize" :class="transaction.type === 'INCOME' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                {{ transaction.type === 'INCOME' ? 'Entrada' : 'Saída' }}
              </span>
            </td>
            <td class="p-4 font-semibold" :class="transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'">
              {{ transaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
            </td>
            <td class="p-4">
              <div class="flex gap-2">
                <button class="p-2 text-gray-400 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors" title="Editar Transação">
                  <Icon name="heroicons:pencil-solid" class="h-5 w-5" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <TransactionFormModal 
      :is-open="isModalOpen"
      @close="closeModal"
      @save="handleSaveTransaction"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const { data: transactions, pending, error, refresh } = await useFetch('http://localhost:3001/api/financeiro');

const isModalOpen = ref(false);

function openModal() {
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
}

async function handleSaveTransaction(transactionData) {
  try {
    await $fetch('http://localhost:3001/api/financeiro', {
      method: 'POST',
      body: transactionData
    });
    alert('Transação salva com sucesso!');
    refresh(); 
  } catch (err) {
    console.error('Erro ao salvar transação:', err);
    alert('Não foi possível salvar a transação.');
  }
}

definePageMeta({
  layout: 'default',
});

useHead({
  title: 'Financeiro - Techrino Solutions'
});
</script>