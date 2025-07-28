<template>
  <div>
    <h1 class="text-4xl font-bold text-gray-800">Painel de Controle</h1>
    <p class="mt-2 text-gray-600">Aqui está um resumo da atividade da Techrino Solutions.</p>

    <div class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      
      <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 rounded-full">
            <Icon name="heroicons:document-text" class="h-6 w-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Orçamentos Abertos</p>
            <p class="text-2xl font-bold text-gray-900">{{ pending ? '...' : stats.openQuotesCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
        <div class="flex items-center">
          <div class="p-3 bg-indigo-100 rounded-full">
            <Icon name="heroicons:users" class="h-6 w-6 text-indigo-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Clientes Ativos</p>
            <p class="text-2xl font-bold text-gray-900">{{ pending ? '...' : stats.activeClientsCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
        <div class="flex items-center">
          <div class="p-3 bg-green-100 rounded-full">
            <Icon name="heroicons:chart-bar" class="h-6 w-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Faturamento (Mês)</p>
            <p class="text-2xl font-bold text-gray-900">{{ pending ? '...' : formatCurrency(stats.monthlyRevenue) }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
        <div class="flex items-center">
          <div class="p-3 bg-red-100 rounded-full">
            <Icon name="heroicons:banknotes" class="h-6 w-6 text-red-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Despesas (Mês)</p>
            <p class="text-2xl font-bold text-gray-900">R$ 3.450</p>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
const { data: stats, pending } = await useFetch('http://localhost:3001/dashboard/stats', {
  default: () => ({
    openQuotesCount: 0,
    activeClientsCount: 0,
    monthlyRevenue: 0,
  })
});

function formatCurrency(value) {
  if (typeof value !== 'number') {
    return 'R$ 0,00';
  }
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

definePageMeta({
  layout: 'default',
});

useHead({
  title: 'Dashboard - Techrino Solutions'
});
</script>