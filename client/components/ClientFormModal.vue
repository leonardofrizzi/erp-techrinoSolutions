<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-10">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
            <DialogPanel class="w-full max-w-lg transform overflow-hidden rounded-2xl bg-gray-50 p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-xl font-bold leading-6 text-gray-900">
                {{ mode === 'add' ? 'Adicionar Novo Cliente' : 'Editar Cliente' }}
              </DialogTitle>
              
              <div class="mt-4">
                <div class="space-y-6">
                  <div class="bg-white p-4 rounded-lg shadow-sm border">
                    <h4 class="font-bold text-gray-700 mb-3">Dados da Empresa</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Nome do Cliente</label>
                        <input type="text" v-model="form.name" required class="mt-1 w-full p-2 border border-gray-300 rounded-lg" />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700">CNPJ</label>
                        <input type="text" v-model="form.cnpj" v-imask="{ mask: '00.000.000/0000-00' }" class="mt-1 w-full p-2 border border-gray-300 rounded-lg" />
                      </div>
                      <div v-if="mode === 'edit'">
                        <label class="block text-sm font-medium text-gray-700">Status</label>
                        <select v-model="form.status" class="mt-1 w-full p-2 border border-gray-300 rounded-lg bg-white">
                          <option>Ativo</option>
                          <option>Inativo</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div class="bg-white p-4 rounded-lg shadow-sm border">
                    <h4 class="font-bold text-gray-700 mb-3">Contatos da Empresa</h4>
                    <div class="space-y-2 mb-4 max-h-40 overflow-y-auto pr-2">
                      <div v-for="(contact, index) in form.contacts" :key="index" class="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                        <div @click="editContact(index)" class="flex-grow cursor-pointer">
                          <p class="font-semibold text-sm">{{ contact.name }}</p>
                          <p class="text-xs text-gray-600">{{ contact.email }}</p>
                        </div>
                        <button @click="removeContact(index)" type="button" class="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full ml-2">
                          <Icon name="heroicons:trash-20-solid" class="h-5 w-5" />
                        </button>
                      </div>
                      <p v-if="!form.contacts || form.contacts.length === 0" class="text-sm text-gray-500 text-center py-4">Nenhum contato adicionado.</p>
                    </div>
                    <div class="space-y-2 border-t pt-3">
                      <p class="text-sm font-medium text-gray-700">{{ editingContactIndex === null ? 'Adicionar novo contato:' : 'Editando contato:' }}</p>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <input type="text" v-model="contactForm.name" placeholder="Nome do contato" class="w-full p-2 border border-gray-300 rounded-lg" />
                         <input type="email" v-model="contactForm.email" placeholder="Email do contato" class="w-full p-2 border border-gray-300 rounded-lg" />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Telefone (Opcional)</label>
                        <input type="text" v-model="contactForm.phone" :v-imask="phoneMask" placeholder="(12) 99999-9999" class="w-full p-2 border border-gray-300 rounded-lg" />
                      </div>
                      <button @click="saveContact" type="button" class="w-full mt-2 text-sm font-medium text-white rounded-md py-2 transition-colors" :class="editingContactIndex === null ? 'bg-gray-700 hover:bg-gray-600' : 'bg-green-600 hover:bg-green-500'">
                        {{ editingContactIndex === null ? '+ Adicionar Contato à Lista' : '✔ Atualizar Contato' }}
                      </button>
                    </div>
                  </div>
                </div>

                <div class="mt-6 flex justify-end gap-4">
                  <button @click="closeModal" type="button" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                    Cancelar
                  </button>
                  <button @click="submitForm" type="button" class="px-4 py-2 text-sm font-medium text-white bg-blue-900 rounded-md hover:bg-blue-800">
                    Salvar Cliente
                  </button>
                </div>
              </div>
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
  client: Object,
  mode: { type: String, default: 'add' },
});

const emit = defineEmits(['close', 'save']);

const form = ref({ name: '', cnpj: '', status: 'Ativo', contacts: [] });
const contactForm = ref({ name: '', email: '', phone: '' });
const editingContactIndex = ref(null);

const phoneMask = {
  mask: [ { mask: '(00) 0000-0000' }, { mask: '(00) 00000-0000' } ]
};

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (props.mode === 'edit' && props.client) {
      form.value = JSON.parse(JSON.stringify(props.client));
    } else {
      form.value = { name: '', cnpj: '', status: 'Ativo', contacts: [] };
    }
  }
  cancelEditContact();
});

function saveContact() {
  if (!contactForm.value.name || !contactForm.value.email) {
    alert('Por favor, preencha o nome e o email do contato.');
    return;
  }
  if (editingContactIndex.value !== null) {
    form.value.contacts[editingContactIndex.value] = { ...contactForm.value };
  } else {
    if (!form.value.contacts) {
      form.value.contacts = [];
    }
    form.value.contacts.push({ ...contactForm.value });
  }
  cancelEditContact();
}

function editContact(index) {
  editingContactIndex.value = index;
  contactForm.value = { ...form.value.contacts[index] };
}

function cancelEditContact() {
  editingContactIndex.value = null;
  contactForm.value = { name: '', email: '', phone: '' };
}

function removeContact(index) {
  form.value.contacts.splice(index, 1);
}

function closeModal() {
  emit('close');
}

function submitForm() {
  emit('save', form.value);
  closeModal();
}
</script>