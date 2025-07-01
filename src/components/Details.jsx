import React, { useState, useEffect } from 'react';

export default function Details({ id }) {
  const [istTime, setIstTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

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

    // Fetch data from API
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/details');
        const json = await res.json();
        const item = json.find((entry) => entry.id === Number(id));
        setData(item || null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => clearInterval(interval);
  }, [id]);

  if (!data.title && !loading) {
    return (
      <div className="bg-gray-200 text-gray-900 selection:bg-yellow-300 sm:text-xl font-bold min-h-screen flex justify-center items-center p-2 sm:p-8">
        <div className="text-center space-y-4">
          <p>Item not found.</p>
          <a
            href="/"
            className="px-3 py-1 rounded border border-yellow-500 hover:border-2 transition"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-200 text-gray-900 selection:bg-yellow-300 sm:text-xl font-bold min-h-screen flex flex-col p-2 sm:p-8">
      <div className="w-full p-4 sm:p-8 bg-stone-50 border-t border-yellow-100 shadow rounded-xl">
        <div className="flex justify-between items-center">
          <button
            onClick={() => (window.location.href = '/')}
            className="bg-yellow-400 px-2 py-2 rounded-full hover:bg-yellow-500 transition"
          >
            ✖️
          </button>
          <p className="text-sm sm:text-right" aria-live="polite">
            {istTime}
          </p>
        </div>
        <div className="flex sm:justify-center mt-8">
          <div className="sm:flex gap-6 text-sm text-gray-600 w-full sm:justify-center">
            {loading ? (
              <div className="flex gap-6 animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-24" />
                <div className="h-4 bg-gray-300 rounded w-20" />
                <div className="h-4 bg-gray-300 rounded w-36" />
              </div>
            ) : (
              <>
                <p>{data.category}</p>
                <p className="my-4 sm:my-0">
                  <span className="px-3 py-1 rounded border border-yellow-500">
                    {data.date}
                  </span>
                </p>
                <p>{data.tags?.[0]}</p>
              </>
            )}
          </div>
        </div>
        {loading ? (
          <div className="animate-pulse space-y-4 mt-4 sm:mt-8">
            <div className="h-10 sm:h-20 bg-gray-300 rounded w-2/3 sm:w-1/2 mx-auto" />
            <div className="h-4 bg-gray-300 rounded w-1/4 sm:w-1/6 mx-auto" />
            <div className="h-6 bg-gray-300 rounded w-5/6 sm:w-3/4 mx-auto" />
          </div>
        ) : (
          <>
            <h1 className="text-5xl sm:text-8xl font-black mt-4 sm:mt-8 uppercase sm:text-center">
              {data.title}
            </h1>
            <div className="relative bg-slate-100 p-4 rounded-md my-4 flex justify-center">
              {data.group === 'Files' && data.isfile && data.files && (
                <a
                  href={data.files}
                  download
                  className="absolute top-2 right-2 bg-yellow-400 hover:bg-yellow-500 px-2 py-1 rounded shadow transition font-light"
                >
                  ⬇ Download File
                </a>
              )}
              <img
                src={data.image}
                alt={data.title}
                className="object-contain max-w-full h-auto rounded"
              />
            </div>
            <p className="mt-4 mb-2 font-thin text-sm">Description</p>
            <p className="font-thin sm:text-2xl">{data.description}</p>
          </>
        )}
      </div>
    </div>
  );
}
