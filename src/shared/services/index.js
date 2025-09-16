import axios from 'axios';

import appDataService from '../appData/service';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

// Agregar interceptor para debug
axios.interceptors.request.use((config) => {
  return config;
});

export { appDataService };
