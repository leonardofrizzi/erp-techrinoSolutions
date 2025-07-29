import { ref, computed } from 'vue';

interface User {
  id: string;
  email: string;
  name: string;
}

export const useAuth = () => {
  const user = useState<User | null>('user', () => null);

  const isLoggedIn = computed(() => !!user.value);

  const setUser = (userData: User | null) => {
    user.value = userData;
  };

  const clearUser = () => {
    user.value = null;
  };

  return {
    user,
    isLoggedIn,
    setUser,
    clearUser,
  };
};