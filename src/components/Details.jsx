import React, { useState, useEffect } from 'react';

export default function Details() {
  const [istTime, setIstTime] = useState('');
  const [loading, setLoading] = useState(false);

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
          <div className="sm:flex gap-6 text-sm text-gray-600 w-full">
            {loading ? (
              <div className="flex gap-6 animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-24" />
                <div className="h-4 bg-gray-300 rounded w-20" />
                <div className="h-4 bg-gray-300 rounded w-36" />
              </div>
            ) : (
              <>
                <p>3D Printed</p>
                <p className="my-4 sm:my-0">
                  <span className="px-3 py-1 rounded border border-yellow-500">
                    Jun 20, 2025
                  </span>
                </p>
                <p>Blender, 3D printer, Figma</p>
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
              Here's title
            </h1>
            <p className="mt-4 mb-2 font-thin text-sm">Description</p>
            <p className="font-thin sm:text-2xl">
              Sunny Bonnell is Co-Founder and CEO of the branding agency
              Motto®, a bestselling author, brand expert, and keynote speaker
              trusted by the world’s most iconic brands.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
