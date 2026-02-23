import React from 'react';

export function Avatar({
  firstName,
  lastName,
  isCurrentUser,
}: {
  firstName: string;
  lastName: string;
  isCurrentUser?: boolean;
}) {
  const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();
  const bgColor = isCurrentUser ? 'bg-gray-800' : 'bg-gray-400';

  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${bgColor}`}
    >
      {initials}
    </div>
  );
}
