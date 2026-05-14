import api from './axios';

export const sendEmailCode = (email) =>
  api.post('/api/auth/email/send', { email });

export const verifyEmailCode = (email, code) =>
  api.post('/api/auth/email/verify', { email, code });

export const signup = (email, password, nickname) =>
  api.post('/api/auth/signup', { email, password, nickname });
