import api from './client';

export async function getUsers() {
  const res = await api.get('/api/users');
  return res.data;
}

export async function updateUserRole(id: string, role: string) {
  const res = await api.patch(`/api/users/${id}/role`, { role });
  return res.data;
}
