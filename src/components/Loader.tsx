import React from 'react';

export function Spinner({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`animate-spin h-6 w-6 text-red-600 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      role="status"
      aria-label="Загрузка"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="animate-pulse">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 gap-4">
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded w-2/3 mb-3" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>
          <div className="flex-shrink-0">
            <div className="h-9 w-32 bg-gray-200 rounded-xl" />
          </div>
        </div>
        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-4">
            <div className="h-4 w-40 bg-gray-200 rounded" />
            <div className="h-4 w-48 bg-gray-200 rounded" />
          </div>
          <div className="h-4 w-48 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export function LoaderList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-gray-600 mb-2">
        <Spinner />
        <span className="font-medium">Загружаем тендеры...</span>
      </div>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
