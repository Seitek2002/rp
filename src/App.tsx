import { useEffect, useMemo, useRef, useState } from 'react';
import { fetchTenders } from './services/tenders';
import type { Tender } from './types/tender';
import TenderCard from './components/TenderCard';
import { LoaderList } from './components/Loader';
import { EmptyState, ErrorState } from './components/States';
import { sameCalendarDay } from './utils/format';
import {
  Search,
  Calendar,
  Settings,
  Users,
  FileText,
  Menu,
  X,
} from 'lucide-react';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const redirectUrl = 'https://redtender.operator.kg/admin/login/?next=/admin/';

  const handleRedirect = () => {
    window.location.href = redirectUrl;
  };

  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const triedOnceRef = useRef(false);
  const retryTimeoutRef = useRef<number | null>(null);

  const fetchList = async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTenders({ signal });
      setTenders(data);
      triedOnceRef.current = true;
    } catch (e) {
      // Ignore aborted request (React StrictMode mounts effects twice in dev)
      if (e instanceof Error && e.message === 'Запрос был отменен') {
        return;
      }
      const message = e instanceof Error ? e.message : 'Ошибка загрузки';
      setError(message);
      // Single automatic retry on first failure (e.g., proxy/handshake warm-up)
      if (!triedOnceRef.current) {
        triedOnceRef.current = true;
        retryTimeoutRef.current = window.setTimeout(() => {
          fetchList();
        }, 700);
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial load with abort support
  useEffect(() => {
    const controller = new AbortController();
    fetchList(controller.signal);
    return () => {
      controller.abort();
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  // Client-side filtering
  const filteredTenders = useMemo(() => {
    let result = tenders;

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (t) =>
          (t.name || '').toLowerCase().includes(q) ||
          (t.description || '').toLowerCase().includes(q)
      );
    }

    if (selectedStatus) {
      result = result.filter((t) => t.status === selectedStatus);
    }

    if (selectedDate) {
      const selected = new Date(selectedDate);
      result = result.filter((t) =>
        sameCalendarDay(new Date(t.createdAt), selected)
      );
    }

    return result;
  }, [tenders, searchQuery, selectedStatus, selectedDate]);

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      <header className='bg-gradient-to-r from-red-600 to-red-700 shadow-lg sticky top-0 z-40'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-4'>
            <div className='flex items-center space-x-4'>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className='lg:hidden text-white hover:bg-red-500 p-2 rounded-lg transition-all'
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div
                className='flex items-center space-x-3 cursor-pointer'
                onClick={handleRedirect}
              >
                <div className='bg-white p-2 rounded-lg shadow-md'>
                  <span className='text-red-600 font-bold text-xl'>RP</span>
                </div>
                <h1 className='text-white text-xl sm:text-2xl font-bold'>
                  RED PETROLEUM
                </h1>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <button
                onClick={handleRedirect}
                className='hidden sm:block text-white hover:bg-red-500 px-4 py-2 rounded-lg transition-all font-medium'
              >
                Мои заявки
              </button>
              <button
                onClick={handleRedirect}
                className='text-white hover:bg-red-500 px-4 py-2 rounded-lg transition-all font-medium'
              >
                Войти
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className='flex max-w-7xl mx-auto'>
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:sticky top-16 lg:top-20 left-0 h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)] w-64 bg-white shadow-xl transition-transform duration-300 ease-in-out z-30 overflow-y-auto`}
        >
          <nav className='p-4 space-y-2'>
            <button
              onClick={handleRedirect}
              className='w-full flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all'
            >
              <FileText size={24} />
              <span className='font-semibold'>Тендеры</span>
            </button>
            <button
              onClick={handleRedirect}
              className='w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-red-50 rounded-xl transition-all'
            >
              <FileText size={24} />
              <span className='font-semibold'>Мои заявки</span>
            </button>
            <button
              onClick={handleRedirect}
              className='w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-red-50 rounded-xl transition-all'
            >
              <Users size={24} />
              <span className='font-semibold'>Пользователи</span>
            </button>
            <button
              onClick={handleRedirect}
              className='w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-red-50 rounded-xl transition-all'
            >
              <Settings size={24} />
              <span className='font-semibold'>Настройки</span>
            </button>
          </nav>
        </aside>

        <main className='flex-1 p-4 sm:p-6 lg:p-8'>
          <div className='bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-6'>
            <h2 className='text-2xl sm:text-3xl font-bold text-gray-800 mb-6'>
              Тендеры компании Red Petroleum
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
              <div className='relative'>
                <Search
                  className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                  size={20}
                />
                <input
                  type='text'
                  placeholder='Поиск'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all'
                />
              </div>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer'
              >
                <option value=''>Выберите статус</option>
                <option value='bidding'>Прием заявок</option>
                <option value='new'>Новый</option>
                <option value='evaluated'>Оценка</option>
                <option value='finished'>Завершен</option>
                <option value='cancelled'>Отменен</option>
              </select>

              <div className='relative'>
                <Calendar
                  className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                  size={20}
                />
                <input
                  type='date'
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  placeholder='Укажите дату публикования'
                  className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all'
                />
              </div>
            </div>
          </div>

          <div className='space-y-4'>
            {loading ? (
              <LoaderList />
            ) : error ? (
              <ErrorState message={error} onRetry={() => fetchList()} />
            ) : filteredTenders.length === 0 ? (
              <EmptyState />
            ) : (
              filteredTenders.map((tender) => (
                <TenderCard key={tender.id} tender={tender} onClick={handleRedirect} />
              ))
            )}
          </div>
        </main>
      </div>

      {sidebarOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
