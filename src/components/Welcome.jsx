import React, { useState, useEffect } from 'react';

const tabs = [
  { key: 'process', label: 'Process', icon: '🧠' },
  { key: 'project', label: 'Project', icon: '🧪' },
  { key: 'files', label: 'Files', icon: '📁' },
  { key: 'human', label: 'Human', icon: '👤' },
];

const tiles = {
  process: [
    { id: 1, title: 'Process Tile 1', date: '22/02/2025' },
    { id: 2, title: 'Process Tile 2', date: '22/02/2025' },
  ],
  project: [
    { id: 3, title: 'Project Tile 1', date: '23/02/2025' },
    { id: 4, title: 'Project Tile 2', date: '23/02/2025' },
  ],
  files: [
    { id: 5, title: 'Files Tile 1', date: '24/02/2025' },
    { id: 6, title: 'Files Tile 2', date: '24/02/2025' },
  ],
  human: [
    { id: 7, title: 'Human Tile 1', date: '25/02/2025' },
    { id: 8, title: 'Human Tile 2', date: '25/02/2025' },
  ],
};

export default function Welcome() {
  const [activeTab, setActiveTab] = useState('process');
  const [istTime, setIstTime] = useState('');
  const [mains, setMains] = useState({});
  const [footers, setFooters] = useState({});
  const [loading, setLoading] = useState(true);
  const year = new Date().getFullYear();

  useEffect(() => {
    async function fetchMains() {
      try {
        const res = await fetch('/api/mains');
        const data = await res.json();
        // Convert array to object keyed by section
        const mainsObj = data.reduce((acc, item) => {
          acc[item.section] = item.content;
          return acc;
        }, {});
        setMains(mainsObj);
      } catch (error) {
        console.error('Error fetching mains:', error);
      } finally {
        setLoading(false);
      }
    }

    async function fetchFooters() {
      try {
        const res = await fetch('/api/footers');
        const data = await res.json();
        const footersObj = data.reduce((acc, item) => {
          acc[item.section] = item.content;
          return acc;
        }, {});
        setFooters(footersObj);
      } catch (error) {
        console.error('Error fetching footers:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMains();
    fetchFooters();
  }, []);

  useEffect(() => {
    const updateISTTime = () => {
      const options = {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };
      const time = new Intl.DateTimeFormat('en-IN', options).format(new Date());
      setIstTime(`IST ${time}`);
    };

    updateISTTime();
    const interval = setInterval(updateISTTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-200 text-gray-900 selection:bg-yellow-300 sm:text-xl font-bold min-h-screen flex flex-col p-2 sm:p-8">
      {/* Header */}
      <header className="w-full p-4 sm:p-8 bg-stone-50 border-b border-yellow-100 rounded-xl shadow">
        <div className="flex flex-row items-center justify-between gap-4 mb-8 sm:mb-16">
          <p>Hello 👋</p>
          <div
            className="flex gap-2 md:gap-4 lg:gap-8 cursor-pointer"
            role="tablist"
          >
            {tabs.map((tab) => (
              <button
                key={tab.key}
                role="tab"
                tabIndex={activeTab === tab.key ? 0 : -1}
                aria-selected={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`group font-bold focus:outline-none flex items-center transition-colors ${
                  activeTab === tab.key
                    ? 'text-yellow-500'
                    : 'text-gray-700 hover:text-yellow-400'
                }`}
              >
                {/* Icon */}
                <span className="hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {tab.icon}
                </span>

                {/* Text that moves on hover */}
                <span className="transition-transform duration-200 group-hover:translate-x-2">
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row justify-between sm:items-end gap-2">
          <p className="sm:w-3/4">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-5/6" />
                <div className="h-3 bg-gray-300 rounded w-2/3" />
                <div className="h-2 bg-gray-300 rounded w-3/4" />
              </div>
            ) : (
              mains[activeTab]
            )}
          </p>
          <p className="sm:w-1/4 text-sm sm:text-right" aria-live="polite">
            {istTime}
          </p>
        </div>
      </header>

      {/* Tiles Section */}
      <main className="flex-1 py-6">
        {loading ? (
          <div role="status" className="flex justify-center m-12">
            <svg
              aria-hidden="true"
              className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-yellow-300"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="white"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiles[activeTab]?.map((tile) => (
              <div
                key={tile.id}
                className="bg-stone-50 p-6 rounded-xl shadow hover:shadow-lg transition duration-300"
              >
                <h3 className="text-xl font-bold mb-2">{tile.title}</h3>
                <p className="text-gray-400 text-sm my-4 font-thin">
                  {tile.date}
                </p>
                <p className="text-gray-400 text-xs flex justify-between font-thin">
                  <span className="text-gray-900">ID</span> {tile.id}
                </p>
                <div className="mt-4 flex justify-between">
                  <hr className="mt-4 w-12 h-0.75 bg-yellow-300 border-none" />
                  <span className="font-thin text-2xl">→</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full p-4 sm:p-8 bg-stone-50 border-t border-yellow-100  shadow rounded-xl">
        <p className="mb-8 sm:mb-16">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-1/2" />
              <div className="h-3 bg-gray-300 rounded w-2/3" />
              <div className="h-2 bg-gray-300 rounded w-1/3" />
            </div>
          ) : (
            footers[activeTab]
          )}
        </p>
        <hr className="my-4 h-0.5 bg-yellow-300 border-none" />
        <div className="sm:flex flex-row items-center justify-between gap-4 text-xs sm:text-sm font-thin">
          <p className="text-gray-400 mb-2 sm:mb-0 ">
            © {year} All rights reserved | <span>admin</span>
          </p>
          <div
            className="flex gap-2 md:gap-4 lg:gap-8 cursor-pointer"
            role="tablist"
            onKeyDown={(e) => {
              const currentIndex = tabs.indexOf(activeTab);
              if (e.key === 'ArrowRight') {
                setActiveTab(tabs[(currentIndex + 1) % tabs.length]);
              } else if (e.key === 'ArrowLeft') {
                setActiveTab(
                  tabs[(currentIndex - 1 + tabs.length) % tabs.length],
                );
              }
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.key}
                role="tab"
                tabIndex={activeTab === tab.key ? 0 : -1}
                aria-selected={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`font-bold focus:outline-none ${
                  activeTab === tab.key
                    ? 'text-yellow-500'
                    : 'text-gray-700 hover:text-yellow-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
