<template>
  <div class="min-h-screen w-full bg-gradient-to-br from-white via-gray-50 to-gray-200 p-4 flex items-center justify-center">
    
    <div class="max-w-md w-full">
      <div class="flex justify-center mb-8">
        <NuxtImg src="/techrino.webp" alt="Logo Techrino Solutions" class="h-24" densities="x1 x2" />
      </div>

      <div class="bg-white/40 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
        
        <form @submit.prevent="handleLogin">
          <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
            <span class="block sm:inline">{{ errorMessage }}</span>
          </div>

          <div class="space-y-6">
            <div>
              <label for="email" class="text-gray-800 font-medium text-sm mb-1 block">Email</label>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                placeholder="Digite seu email"
                class="w-full bg-white text-gray-900 rounded-lg p-3 border border-gray-300 placeholder:text-gray-500 focus:border-[#1A2D4F] focus:ring-2 focus:ring-[#1A2D4F]/30 transition duration-200"
              />
            </div>

            <div>
              <label for="password" class="text-gray-800 font-medium text-sm mb-1 block">Senha</label>
              <input
                id="password"
                v-model="password"
                type="password"
                required
                placeholder="••••••••"
                class="w-full bg-white text-gray-900 rounded-lg p-3 border border-gray-300 placeholder:text-gray-500 focus:border-[#1A2D4F] focus:ring-2 focus:ring-[#1A2D4F]/30 transition duration-200"
              />
            </div>
            
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full flex items-center justify-center gap-2 bg-[#1A2D4F] hover:bg-[#D9363E] text-white font-bold text-lg p-3 rounded-lg transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!isLoading">Entrar</span>
              <span v-else>Entrando...</span>
              <Icon v-if="!isLoading" name="heroicons:arrow-right-on-rectangle-20-solid" class="h-6 w-6" />
            </button>
          </div>
        </form>
      </div>
      
      <p class="text-center text-gray-500 text-xs mt-8">
        © {{ new Date().getFullYear() }} Techrino Solutions. Todos os direitos reservados.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

async function handleLogin() {
  errorMessage.value = '';
  isLoading.value = true;

  try {
    const { data, error } = await useFetch('http://localhost:3001/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
      },
    });

    if (error.value) {
      errorMessage.value = error.value.data.message || 'Não foi possível fazer login.';
    } else {
      console.log('Login OK!', data.value);
      
      alert('Login realizado com sucesso! Redirecionando...');
    }

  } catch (e) {
    console.error('Erro inesperado:', e);
    errorMessage.value = 'Ocorreu um erro de conexão. Tente novamente.';
  } finally {
    isLoading.value = false;
  }
}

useHead({
  title: 'Login - Techrino Solutions'
});
</script>
