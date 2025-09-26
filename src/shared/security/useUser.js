import { useState, useEffect } from "react";
import {
  getAuthFromStorage,
  removeAuthFromStorage,
} from "shared/security/utils";

const useUser = () => {
  const [user, setUser] = useState(getAuthFromStorage());

  // Escuchar cambios en localStorage
  useEffect(() => {
    const handleStorageChange = () => setUser(getAuthFromStorage());

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Función para actualizar manualmente el usuario
  const updateUser = () => setUser(getAuthFromStorage());

  // Función para cerrar sesión
  const logout = () => {
    removeAuthFromStorage();
    updateUser();
  };

  return { ...user, updateUser, logout };
};

export default useUser;
