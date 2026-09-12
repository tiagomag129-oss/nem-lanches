import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppData } from '../types';
import { initialAppData } from '../defaultData';

interface AppContextType {
  data: AppData;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  isAuthenticated: boolean;
  authChecking: boolean;
  isHoursModalOpen: boolean;
  setHoursModalOpen: (open: boolean) => void;
  updateDataLocally: (updater: (prev: AppData) => AppData) => void;
  saveDataToServer: (newData?: AppData) => Promise<{ success: boolean; message?: string; error?: string }>;
  resetToDefaults: () => Promise<boolean>;
  login: (password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  changePassword: (oldP: string, newP: string) => Promise<{ success: boolean; error?: string }>;
  uploadImage: (file: File) => Promise<{ success: boolean; url?: string; error?: string }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const TOKEN_KEY = 'nem_lanches_admin_token';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(initialAppData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [isHoursModalOpen, setHoursModalOpen] = useState<boolean>(false);

  // Fetch initial public data
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/data');
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setData(json.data);
        }
      } else {
        // Fallback to local storage or defaults if offline
        const local = localStorage.getItem('nem_lanches_data_backup');
        if (local) {
          setData(JSON.parse(local));
        }
      }
    } catch (err: any) {
      console.warn('Could not fetch from server API, using client fallback:', err);
      const local = localStorage.getItem('nem_lanches_data_backup');
      if (local) {
        try {
          setData(JSON.parse(local));
        } catch {
          setData(initialAppData);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Verify token on mount
  useEffect(() => {
    async function checkToken() {
      if (!token) {
        setIsAuthenticated(false);
        setAuthChecking(false);
        return;
      }
      try {
        const res = await fetch('/api/auth/check', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.valid) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
        }
      } catch {
        setIsAuthenticated(false);
      } finally {
        setAuthChecking(false);
      }
    }
    checkToken();
    fetchData();
  }, [token, fetchData]);

  // Update data in state locally for instant UI feedback
  const updateDataLocally = (updater: (prev: AppData) => AppData) => {
    setData((prev) => {
      const updated = updater(prev);
      localStorage.setItem('nem_lanches_data_backup', JSON.stringify(updated));
      return updated;
    });
  };

  // Persist to server
  const saveDataToServer = async (newData?: AppData) => {
    const payload = newData || data;
    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || localStorage.getItem(TOKEN_KEY) || ''}`,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Falha ao salvar dados');
      }

      setData(payload);
      localStorage.setItem('nem_lanches_data_backup', JSON.stringify(payload));
      return { success: true, message: json.message || 'Alterações salvas com sucesso.' };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default
  const resetToDefaults = async () => {
    try {
      setIsSaving(true);
      const res = await fetch('/api/data/reset', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token || localStorage.getItem(TOKEN_KEY) || ''}`,
        },
      });
      const json = await res.json();
      if (res.ok && json.data) {
        setData(json.data);
        localStorage.setItem('nem_lanches_data_backup', JSON.stringify(json.data));
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      setData(initialAppData);
      return true;
    } finally {
      setIsSaving(false);
    }
  };

  // Admin Login
  const login = async (password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const json = await res.json();
      if (!res.ok) {
        return { success: false, error: json.error || 'Erro ao realizar login.' };
      }
      const newToken = json.token;
      setToken(newToken);
      localStorage.setItem(TOKEN_KEY, newToken);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: 'Erro de conexão com o servidor.' };
    }
  };

  // Admin Logout
  const logout = async () => {
    try {
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch {
      // ignore
    } finally {
      setToken(null);
      localStorage.removeItem(TOKEN_KEY);
      setIsAuthenticated(false);
    }
  };

  // Change Password
  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || localStorage.getItem(TOKEN_KEY) || ''}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const json = await res.json();
      if (!res.ok) {
        return { success: false, error: json.error || 'Erro ao alterar senha.' };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: 'Falha na comunicação com o servidor.' };
    }
  };

  // Upload image to server
  const uploadImage = async (file: File): Promise<{ success: boolean; url?: string; error?: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const imageBase64 = reader.result as string;
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token || localStorage.getItem(TOKEN_KEY) || ''}`,
            },
            body: JSON.stringify({
              imageBase64,
              filename: file.name,
            }),
          });
          const json = await res.json();
          if (res.ok && json.url) {
            resolve({ success: true, url: json.url });
          } else {
            // If upload endpoint fails, fallback to local dataURL
            resolve({ success: true, url: imageBase64 });
          }
        } catch (err: any) {
          // If server upload failed, fallback gracefully to dataURL
          resolve({ success: true, url: reader.result as string });
        }
      };
      reader.onerror = () => resolve({ success: false, error: 'Falha ao ler o arquivo de imagem.' });
      reader.readAsDataURL(file);
    });
  };

  return (
    <AppContext.Provider
      value={{
        data,
        isLoading,
        isSaving,
        error,
        isAuthenticated,
        authChecking,
        isHoursModalOpen,
        setHoursModalOpen,
        updateDataLocally,
        saveDataToServer,
        resetToDefaults,
        login,
        logout,
        changePassword,
        uploadImage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
