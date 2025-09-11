import { getTokenFromStorage } from 'shared/security/utils';

export const getHeaders = (extraStuff = {}) => {
  const headers = {
    Accept: 'application/json; charset=utf-8',
    'Content-Type': 'application/json; charset=utf-8',
    Authorization: `Bearer ${getTokenFromStorage()}`,
  };

  return Object.assign({}, headers, extraStuff);
};
