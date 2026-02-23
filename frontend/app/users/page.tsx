'use client';

import React, { useState } from 'react';
import { useUsers, useUpdateUserRole } from '../hooks/useUsers';
import { Avatar } from '../../components/ui/Avatar';

export default function UsersPage() {
  const { data: users = [], isLoading } = useUsers();
  const updateRole = useUpdateUserRole();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  if (isLoading) return <div>Loading...</div>;

  const filteredUsers = users.filter((u: any) =>
    (u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())) &&
    (roleFilter ? u.role === roleFilter : true)
  );

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Users Management</h1>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border p-2"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="staff">Staff</option>
        </select>
      </div>

      <table className="w-full border">
        <thead>
          <tr>
            <th>Avatar + Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user: any) => (
            <tr key={user.id}>
              <td className="flex items-center gap-2">
                <Avatar
                  firstName={user.firstName}
                  lastName={user.lastName}
                  isCurrentUser={user.isCurrentUser}
                />
                {user.name}{' '}
                {user.isCurrentUser && (
                  <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded">
                    You
                  </span>
                )}
              </td>
              <td>{user.email}</td>
              <td>
                <select
                  value={user.role}
                  disabled={user.isCurrentUser}
                  onChange={(e) =>
                    updateRole.mutate({ id: user.id, role: e.target.value })
                  }
                  className="border p-1"
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="staff">Staff</option>
                </select>
              </td>
              <td>{new Date(user.joinedAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        <h2 className="font-semibold">Role Legend</h2>
        <ul>
          <li>
            <span className="text-red-600">Admin</span> — full access
          </li>
          <li>
            <span className="text-blue-600">Manager</span> — manage teams
          </li>
          <li>
            <span className="text-green-600">Staff</span> — standard user
          </li>
        </ul>
      </div>
    </div>
  );
}
