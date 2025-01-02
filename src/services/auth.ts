import { LoginFormData, User } from '@/types/auth';
import Cookies from 'js-cookie';

const STORAGE_KEY = 'auth_user';
const COOKIE_KEY = 'auth_user';

export const authService = {
  login: async (formData: LoginFormData): Promise<User | null> => {
    if (formData.username === 'admin' && formData.password === 'admin') {
      const user: User = {
        username: 'admin',
        isAdmin: true
      };
      
      if (formData.rememberMe) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      }
      
      // Cookie'yi ayarla (middleware için)
      Cookies.set(COOKIE_KEY, JSON.stringify(user));
      
      return user;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    Cookies.remove(COOKIE_KEY);
  },

  getCurrentUser: (): User | null => {
    const storedUser = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  }
}; 