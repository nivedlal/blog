import React, { useState, useEffect } from 'react';

const tabs = [
  { key: 'process', label: 'Process', icon: '🧠' },
  { key: 'project', label: 'Project', icon: '🧪' },
  { key: 'files', label: 'Files', icon: '📁' },
  { key: 'human', label: 'Human', icon: '👤' },
];

export default function Welcome() {
  const [activeTab, setActiveTab] = useState('process');
  const [istTime, setIstTime] = useState('');
  const [mains, setMains] = useState({});
  const [footers, setFooters] = useState({});
  const [loading, setLoading] = useState(true);
  const [tiles, setTiles] = useState({});
  const [editingMain, setEditingMain] = useState(false);
  const [editingFooter, setEditingFooter] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [humanText, setHumanText] = useState('');
  const [humanImage, setHumanImage] = useState('');
  const [editingHuman, setEditingHuman] = useState(false);
  const [originalMain, setOriginalMain] = useState('');
  const [originalFooter, setOriginalFooter] = useState('');
  const [originalHumanText, setOriginalHumanText] = useState('');
  const [originalHumanImage, setOriginalHumanImage] = useState('');
  const year = new Date().getFullYear();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const [mainsRes, footersRes, detailsRes, humanRes] = await Promise.all([
          fetch('/api/mains'),
          fetch('/api/footers'),
          fetch('/api/admin/details'),
          fetch('/api/human'),
        ]);
        const [mainsData, footersData, detailsData, humanData] =
          await Promise.all([
            mainsRes.json(),
            footersRes.json(),
            detailsRes.json(),
            humanRes.json(),
          ]);
        const mainsObj = mainsData.reduce((acc, item) => {
          acc[item.section] = item.content;
          return acc;
        }, {});
        const footersObj = footersData.reduce((acc, item) => {
          acc[item.section] = item.content;
          return acc;
        }, {});
        const groupedDetails = detailsData.reduce((acc, item) => {
          const groupKey = item.group?.toLowerCase() || 'process';
          if (!acc[groupKey]) acc[groupKey] = [];
          acc[groupKey].push(item);
          return acc;
        }, {});
        setMains(mainsObj);
        setFooters(footersObj);
        setTiles(groupedDetails);
        setHumanText(humanData[0]?.content || '');
        setHumanImage(humanData[0]?.image || '');
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTab = localStorage.getItem('activeTab');
      if (savedTab) setActiveTab(savedTab);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeTab', activeTab);
    }
  }, [activeTab]);

  const handleMainSave = async () => {
    await fetch('/api/mains', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section: activeTab, content: mains[activeTab] }),
    });
    setEditingMain(false);
  };

  const handleFooterSave = async () => {
    await fetch('/api/footers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section: activeTab, content: footers[activeTab] }),
    });
    setEditingFooter(false);
  };

  const handleHumanSave = async () => {
    await fetch('/api/human', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: humanText, image: humanImage }),
    });
    setEditingHuman(false);
  };

  return (
    <div className="bg-gray-200 text-gray-900 selection:bg-yellow-300 sm:text-xl min-h-screen flex flex-col p-2 sm:p-8">
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
                onClick={() => {
                  setActiveTab(tab.key);
                  setEditingMain(false);
                  setEditingFooter(false);
                }}
                className={`group focus:outline-none flex items-center transition-colors ${
                  activeTab === tab.key
                    ? 'text-yellow-500'
                    : 'text-gray-700 hover:text-yellow-400'
                }`}
              >
                <span className="hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {tab.icon}
                </span>
                <span className="transition-transform duration-200 group-hover:translate-x-2">
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row justify-between sm:items-end gap-2">
          <div className="sm:w-3/4">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-5/6" />
                <div className="h-3 bg-gray-300 rounded w-2/3" />
                <div className="h-2 bg-gray-300 rounded w-3/4" />
              </div>
            ) : editingMain && isLoggedIn ? (
              <div>
                <textarea
                  value={mains[activeTab] || ''}
                  onChange={(e) =>
                    setMains((prev) => ({
                      ...prev,
                      [activeTab]: e.target.value,
                    }))
                  }
                  className="w-full p-2 border border-yellow-300 rounded"
                />
                <button
                  onClick={handleMainSave}
                  className="mt-2 px-4 py-1 rounded bg-yellow-400 hover:bg-yellow-500"
                >
                  💾 Save
                </button>
                <button
                  onClick={() => {
                    setMains((prev) => ({
                      ...prev,
                      [activeTab]: originalMain,
                    }));
                    setEditingMain(false);
                  }}
                  className="px-4 py-1 rounded bg-red-400 hover:bg-red-500 ms-2"
                >
                  ❌ Cancel
                </button>
              </div>
            ) : (
              <div>
                <div dangerouslySetInnerHTML={{ __html: mains[activeTab] }} />
                {isLoggedIn && (
                  <button
                    onClick={() => {
                      setOriginalMain(mains[activeTab] || '');
                      setEditingMain(true);
                    }}
                    className="mt-2 text-yellow-500"
                  >
                    ✏️ Edit
                  </button>
                )}
              </div>
            )}
          </div>
          <p className="sm:w-1/4 text-sm sm:text-right" aria-live="polite">
            {istTime}
          </p>
        </div>
      </header>
      <main className="flex-1 py-6">
        {loading ? (
          <p>Loading...</p>
        ) : activeTab === 'human' ? (
          <div className="p-6 w-full p-4 sm:p-8 bg-stone-50 border-t border-yellow-100 shadow rounded-xl">
            {editingHuman && isLoggedIn ? (
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm text-gray-700">Text</span>
                  <textarea
                    value={humanText}
                    onChange={(e) => setHumanText(e.target.value)}
                    placeholder="Enter human content"
                    className="w-full p-2 border border-yellow-300 rounded"
                  />
                </label>
                <div>
                  <label className="flex items-center justify-between px-4 py-2 border border-yellow-300 rounded cursor-pointer hover:bg-yellow-400 transition w-fit">
                    <span className="text-sm text-gray-700">
                      📁 Choose an image
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const formData = new FormData();
                        formData.append('image', file);
                        const res = await fetch('/api/upload', {
                          method: 'POST',
                          body: formData,
                        });
                        const data = await res.json();
                        if (data.imageUrl) {
                          const filename = data.imageUrl.split('/').pop();
                          setHumanImage(filename);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  {humanImage && (
                    <div className="mt-2">
                      <span className="text-sm text-gray-500 block mb-1">
                        Preview:
                      </span>
                      <img
                        src={`/uploads/${humanImage}`}
                        alt="Selected preview"
                        className="w-48 h-auto rounded border border-yellow-200 shadow"
                      />
                    </div>
                  )}
                </div>
                <button
                  onClick={handleHumanSave}
                  className="px-4 py-1 rounded bg-yellow-400 hover:bg-yellow-500 transition"
                >
                  💾 Save
                </button>
                <button
                  onClick={() => {
                    setHumanText(originalHumanText);
                    setHumanImage(originalHumanImage);
                    setEditingHuman(false);
                  }}
                  className="px-4 py-1 rounded bg-red-400 hover:bg-red-500 ms-2"
                >
                  ❌ Cancel
                </button>
              </div>
            ) : (
              <div>
                <div className="whitespace-pre-wrap flex gap-4 lg:gap-8 items-start">
                  {humanImage && (
                    <img
                      src={`/uploads/${humanImage}`}
                      alt="Human visual"
                      className="w-1/2 lg:w-1/3 h-auto rounded border border-yellow-300 shadow"
                    />
                  )}
                  <p>{humanText}</p>
                </div>
                {isLoggedIn && (
                  <button
                    onClick={() => {
                      setOriginalHumanText(humanText);
                      setOriginalHumanImage(humanImage);
                      setEditingHuman(true);
                    }}
                    className="mt-2 text-yellow-500"
                  >
                    ✏️ Edit
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiles[activeTab]?.map((item) => (
              <a
                href={`/details/${item.id}`}
                key={item.id}
                className="bg-stone-50 p-6 rounded-xl shadow hover:shadow-lg hover:bg-white transition duration-300"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-60 sm:h-80 object-cover rounded-md mb-4"
                  />
                )}
                <h3 className="text-xl mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm my-4 font-thin">
                  {item.date}
                </p>
                <p className="text-gray-400 flex justify-between font-thin">
                  <span className="text-gray-900">ID</span> {item.id}
                </p>
                <div className="mt-4 flex justify-between">
                  <hr className="mt-4 w-12 h-0.75 bg-yellow-300 border-none" />
                  <span className="font-thin text-2xl">→</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </main>

      <footer className="w-full p-4 sm:p-8 bg-stone-50 border-t border-yellow-100 shadow rounded-xl">
        <div className="mb-8 sm:mb-16">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-1/2" />
              <div className="h-3 bg-gray-300 rounded w-2/3" />
              <div className="h-2 bg-gray-300 rounded w-1/3" />
            </div>
          ) : editingFooter && isLoggedIn ? (
            <div>
              <textarea
                value={footers[activeTab] || ''}
                onChange={(e) =>
                  setFooters((prev) => ({
                    ...prev,
                    [activeTab]: e.target.value,
                  }))
                }
                className="w-full p-2 border border-yellow-300 rounded"
              />
              <button
                onClick={handleFooterSave}
                className="mt-2 px-4 py-1 rounded bg-yellow-400 hover:bg-yellow-500"
              >
                💾 Save
              </button>
              <button
                onClick={() => {
                  setFooters((prev) => ({
                    ...prev,
                    [activeTab]: originalFooter,
                  }));
                  setEditingFooter(false);
                }}
                className="px-4 py-1 rounded bg-red-400 hover:bg-red-500 ms-2"
              >
                ❌ Cancel
              </button>
            </div>
          ) : (
            <div>
              <div dangerouslySetInnerHTML={{ __html: footers[activeTab] }} />
              {isLoggedIn && (
                <button
                  onClick={() => {
                    setOriginalFooter(footers[activeTab] || '');
                    setEditingFooter(true);
                  }}
                  className="mt-2 text-yellow-500"
                >
                  ✏️ Edit
                </button>
              )}
            </div>
          )}
        </div>
        <hr className="my-4 h-0.5 bg-yellow-300 border-none" />
        <div className="sm:flex flex-row items-center justify-between gap-4 sm:text-sm font-thin">
          <p className="text-gray-400 mb-2 sm:mb-0 ">
            © {year} All rights reserved | <a href="admin">admin</a>
          </p>
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
                className={`focus:outline-none ${
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
