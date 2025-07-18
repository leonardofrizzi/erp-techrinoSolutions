<template>
    <div>
        <div class="flex justify-between items-center mb-8">
            <div>
                <h1 class="text-4xl font-bold text-gray-800">Orçamentos</h1>
                <p class="mt-2 text-gray-600">Crie e gerencie os orçamentos para seus clientes.</p>
            </div>
            <NuxtLink to="/orcamentos/novo"
                class="bg-blue-900 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-2 shadow-sm">
                <Icon name="heroicons:plus-solid" class="h-5 w-5" />
                <span>Criar Orçamento</span>
            </NuxtLink>
        </div>

        <div class="bg-white p-4 rounded-xl shadow-sm mb-6">
            <div class="relative">
                <Icon name="heroicons:magnifying-glass"
                    class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input type="search" placeholder="Buscar por número do orçamento ou nome do cliente..."
                    class="w-full pl-10 p-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-800/30 focus:border-blue-800" />
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="p-4 text-left font-semibold text-gray-600">Nº</th>
                        <th class="p-4 text-left font-semibold text-gray-600">Cliente</th>
                        <th class="p-4 text-left font-semibold text-gray-600">Status</th>
                        <th class="p-4 text-left font-semibold text-gray-600">Data</th>
                        <th class="p-4 text-left font-semibold text-gray-600">Valor Total</th>
                        <th class="p-4 text-left font-semibold text-gray-600">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="pending">
                        <td colspan="6" class="text-center text-gray-500 py-12">
                            Carregando orçamentos...
                        </td>
                    </tr>
                    <tr v-else-if="error">
                        <td colspan="6" class="text-center text-red-500 py-12">
                            Ocorreu um erro ao buscar os dados.
                        </td>
                    </tr>
                    <tr v-else-if="quotes.length === 0">
                        <td colspan="6" class="text-center text-gray-500 py-12">
                            Nenhum orçamento encontrado.
                        </td>
                    </tr>
                    <tr v-else v-for="quote in quotes" :key="quote.id"
                        class="border-b last:border-b-0 border-gray-100 hover:bg-gray-50 transition-colors">
                        <td class="p-4">
                            <p class="font-semibold text-gray-800">#{{ quote.quoteNumber }}</p>
                        </td>
                        <td class="p-4">
                            <p class="font-semibold text-gray-900">{{ quote.client.name }}</p>
                            <p class="text-xs text-gray-500">{{ quote.contact.name }}</p>
                        </td>
                        <td class="p-4">
                            <span class="px-2 py-1 text-xs font-semibold rounded-full"
                                :class="getStatusClass(quote.status)">
                                {{ quote.status }}
                            </span>
                        </td>
                        <td class="p-4 text-gray-700">
                            {{ new Date(quote.createdAt).toLocaleDateString('pt-BR') }}
                        </td>
                        <td class="p-4 font-semibold text-gray-800">
                            {{ quote.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
                        </td>
                        <td class="p-4">
                            <div class="flex gap-2">
                                <NuxtLink :to="`/orcamentos/editar/${quote.id}`"
                                    class="p-2 text-gray-400 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
                                    title="Editar Orçamento">
                                    <Icon name="heroicons:pencil-solid" class="h-5 w-5" />
                                </NuxtLink>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
// Buscando os dados reais da API
const { data: quotes, pending, error, refresh } = await useFetch('http://localhost:3001/orcamentos');

function getStatusClass(status) {
    switch (status) {
        case 'Aprovado':
            return 'bg-green-100 text-green-800';
        case 'Recusado':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-yellow-100 text-yellow-800';
    }
}

definePageMeta({
    layout: 'default',
});

useHead({
    title: 'Orçamentos - Techrino Solutions'
});
</script>