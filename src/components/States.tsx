import React from 'react';
import { AlertTriangle, Search as SearchIcon } from 'lucide-react';

export function ErrorState({
  message,
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-red-100 text-center">
      <div className="mx-auto w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
        <AlertTriangle className="text-red-600" size={24} />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">Ошибка загрузки</h3>
      <p className="mt-2 text-sm text-gray-600">
        {message || 'Не удалось загрузить список тендеров. Попробуйте еще раз.'}
      </p>
      {onRetry ? (
        <button
          onClick={onRetry}
          className="mt-6 inline-flex items-center rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          Повторить
        </button>
      ) : null}
    </div>
  );
}

export function EmptyState({
  title = 'Ничего не найдено',
  description = 'Измените параметры фильтрации или попробуйте другой запрос.',
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center">
      <div className="mx-auto w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
        <SearchIcon className="text-gray-500" size={24} />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </div>
  );
}
