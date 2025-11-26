import React from 'react';
import type { Tender } from '../types/tender';
import { getStatusMeta, formatDateTime } from '../utils/format';

interface TenderCardProps {
  tender: Tender;
  onClick?: () => void;
}

export default function TenderCard({ tender, onClick }: TenderCardProps) {
  const status = getStatusMeta(tender.status);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 cursor-pointer border border-gray-100 hover:border-red-200"
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : -1}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
        <div className="flex-1 mb-4 lg:mb-0">
          <h3 className="text-xl font-bold text-gray-800 mb-3 hover:text-red-600 transition-colors">
            {tender.name}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {tender.description}
          </p>
          {tender.terms ? (
            <p className="text-gray-500 leading-relaxed mt-2">
              <span className="font-medium text-gray-700">Условия: </span>
              {tender.terms}
            </p>
          ) : null}
          {tender.closeReason ? (
            <p className="text-gray-500 leading-relaxed mt-2">
              <span className="font-medium text-gray-700">Причина закрытия: </span>
              {tender.closeReason}
            </p>
          ) : null}
        </div>
        <div className="flex-shrink-0 lg:ml-6">
          <span
            className={`inline-flex items-center gap-x-2 rounded-xl px-4 py-2 text-sm font-semibold ${status.badgeClass}`}
          >
            <span className={`h-2 w-2 rounded-full ${status.dotClass}`} />
            {status.label}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-100 space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-4 text-sm">
          <span className="text-blue-600 font-medium">
            id тендера: {tender.id}
          </span>
          <span className="text-green-600 font-medium">
            Опубликовано: {formatDateTime(tender.createdAt)}
          </span>
          <span className="text-gray-500">
            Автор: {tender.createdBy?.firstName} {tender.createdBy?.lastName}
          </span>
        </div>
        <span className="text-red-600 font-semibold text-sm">
          Дата окончания: {formatDateTime(tender.endDate)}
        </span>
      </div>
    </div>
  );
}
