<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-10">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-xl font-bold leading-6 text-gray-900">
                Adicionar Nova Transação
              </DialogTitle>
              
              <form @submit.prevent="submitForm" class="mt-4 space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Tipo de Transação</label>
                  <div class="mt-2 flex gap-4">
                    <button 
                      type="button" 
                      @click="form.type = 'INCOME'"
                      class="w-full p-3 rounded-lg font-semibold transition-all duration-200 bg-green-100 text-green-800 hover:bg-green-200"
                      :class="{ 'ring-2 ring-offset-2 ring-green-500 shadow-md': form.type === 'INCOME' }"
                    >
                      Entrada
                    </button>
                    <button 
                      type="button" 
                      @click="form.type = 'EXPENSE'" 
                      class="w-full p-3 rounded-lg font-semibold transition-all duration-200 bg-red-100 text-red-800 hover:bg-red-200"
                      :class="{ 'ring-2 ring-offset-2 ring-red-500 shadow-md': form.type === 'EXPENSE' }"
                    >
                      Saída
                    </button>
                  </div>
                </div>
                <div>
                  <label for="description" class="block text-sm font-medium text-gray-700">Descrição</label>
                  <input type="text" v-model="form.description" id="description" required class="mt-1 w-full p-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label for="amount" class="block text-sm font-medium text-gray-700">Valor (R$)</label>
                  <input type="number" step="0.01" v-model="form.amount" id="amount" required class="mt-1 w-full p-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label for="paymentMethod" class="block text-sm font-medium text-gray-700">Método de Pagamento (Opcional)</label>
                  <input type="text" v-model="form.paymentMethod" id="paymentMethod" class="mt-1 w-full p-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label for="transactionDate" class="block text-sm font-medium text-gray-700">Data da Transação</label>
                  <input type="date" v-model="form.transactionDate" id="transactionDate" required class="mt-1 w-full p-2 border border-gray-300 rounded-lg" />
                </div>
                
                <div class="mt-6 flex justify-end gap-4">
                  <button type="button" @click="closeModal" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                    Cancelar
                  </button>
                  <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-blue-900 rounded-md hover:bg-blue-800">
                    Salvar Transação
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, watch } from 'vue';
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(['close', 'save']);

const form = ref({});

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    form.value = {
      description: '',
      amount: 0,
      type: 'EXPENSE',
      paymentMethod: '',
      transactionDate: getTodayDate(),
    };
  }
});

function closeModal() {
  emit('close');
}

function submitForm() {
  const dataToSend = {
    ...form.value,
    amount: form.value.type === 'EXPENSE' ? -Math.abs(form.value.amount) : Math.abs(form.value.amount),
  };
  emit('save', dataToSend);
  closeModal();
}
</script>