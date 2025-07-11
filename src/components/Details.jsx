import React, { useState, useEffect } from 'react';

export default function Details({ id }) {
  const [istTime, setIstTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [sections, setSections] = useState([]);
  const [originalSections, setOriginalSections] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) setIsLoggedIn(true);
    }
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

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/details');
        const json = await res.json();
        const item = json.find((entry) => entry.id === Number(id));
        setData(item || {});
        setSections(item?.sections || []);
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

  return (
    <div className="bg-gray-200 text-gray-900 selection:bg-yellow-300 sm:text-xl min-h-screen flex flex-col p-2 sm:p-8">
      <div className="w-full p-4 sm:p-8 bg-stone-50 border-t border-yellow-100 shadow rounded-xl">
        <div className="flex justify-between items-center">
          <button
            onClick={() => (window.location.href = '/')}
            className="bg-yellow-400 px-2 py-2 rounded-full hover:bg-yellow-500 transition"
          >
            ✖️
          </button>
          {isLoggedIn && (
            <a
              className="ml-4 px-3 py-1 text-sm rounded transition bg-slate-200"
              href="/admin"
            >
              🙍🏻‍♂️ Admin
            </a>
          )}
          {isLoggedIn && (
            <button
              onClick={() => {
                if (isEditing) {
                  setData(originalData);
                  setSections(originalSections);
                  setIsEditing(false);
                } else {
                  setOriginalData(data);
                  setOriginalSections(JSON.parse(JSON.stringify(sections)));
                  setIsEditing(true);
                }
              }}
              className={`ml-4 px-3 py-1 text-sm rounded transition whitespace-nowrap ${
                isEditing
                  ? 'bg-red-400 hover:bg-red-500'
                  : 'bg-yellow-400 hover:bg-yellow-500'
              }`}
            >
              {isEditing ? '❌ Cancel' : '✏️ Edit'}
            </button>
          )}
        </div>

        <div className="flex sm:justify-center mt-4 sm:mt-8">
          <div className="sm:flex gap-6 text-sm text-gray-600 w-full sm:justify-center flex-col sm:flex-row">
            {loading ? (
              <div className="flex gap-6 animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-24" />
                <div className="h-4 bg-gray-300 rounded w-20" />
                <div className="h-4 bg-gray-300 rounded w-36" />
              </div>
            ) : (
              <>
                {/* Category */}
                {isEditing ? (
                  <input
                    type="text"
                    value={
                      Array.isArray(data.category)
                        ? data.category.join(', ')
                        : data.category || ''
                    }
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        category: e.target.value
                          .split(',')
                          .map((c) => c.trim()),
                      }))
                    }
                    className="border px-2 py-1 rounded"
                    placeholder="Category"
                  />
                ) : (
                  <p>
                    {(Array.isArray(data.category)
                      ? data.category
                      : [data.category]
                    )
                      .filter(Boolean)
                      .map((c, i, arr) => (
                        <span key={i}>
                          <a
                            href={`/projects?category=${encodeURIComponent(c)}`}
                          >
                            {c}
                          </a>
                          {i < arr.length - 1 && ', '}
                        </span>
                      ))}
                  </p>
                )}
                {/* Date */}
                {isEditing ? (
                  <input
                    type="text"
                    value={data.date}
                    onChange={(e) =>
                      setData((prev) => ({ ...prev, date: e.target.value }))
                    }
                    className="border px-2 py-1 rounded"
                  />
                ) : (
                  <p className="my-4 sm:my-0">
                    <span className="px-3 py-1 rounded border border-yellow-500">
                      {data.date}
                    </span>
                  </p>
                )}

                {/* Tags */}
                {isEditing ? (
                  <input
                    type="text"
                    value={
                      Array.isArray(data.tags)
                        ? data.tags.join(', ')
                        : data.tags || ''
                    }
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        tags: e.target.value.split(',').map((t) => t.trim()),
                      }))
                    }
                    className="border px-2 py-1 rounded"
                    placeholder="Tags"
                  />
                ) : (
                  <p>
                    {(Array.isArray(data.tags) ? data.tags : [data.tags])
                      .filter(Boolean)
                      .map((tag, i, arr) => (
                        <span key={i}>
                          <a href={`/projects?tag=${encodeURIComponent(tag)}`}>
                            {tag}
                          </a>
                          {i < arr.length - 1 && ', '}{' '}
                        </span>
                      ))}{' '}
                  </p>
                )}
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
            <div className="flex justify-center items-center mt-4">
              {isEditing ? (
                <input
                  type="text"
                  value={data.title}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="text-5xl sm:text-8xl font-bold w-full text-center"
                />
              ) : (
                <h1 className="text-5xl sm:text-8xl font-black uppercase sm:text-center">
                  {data.title}
                </h1>
              )}
            </div>

            <div
              className={`relative bg-slate-100 p-4 rounded-md my-4 lg:flex ${isEditing ? 'justify-between' : 'justify-center'} flex-col sm:flex-row gap-4`}
            >
              {/* Editable file URL */}
              {data.group === 'Files' &&
                data.isfile &&
                data.files &&
                (isEditing ? (
                  <div className="absolute top-2 right-2 flex items-center gap-2">
                    {/* Show current file name if it exists */}
                    {data.files && (
                      <a
                        href={data.files}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-xs truncate max-w-full"
                      >
                        📄 {data.files.split('/').pop()}
                      </a>
                    )}

                    {/* Upload button */}
                    <label className="bg-yellow-400 hover:bg-yellow-500 text-sm px-3 py-1 rounded shadow cursor-pointer text-center">
                      Upload New File
                      <input
                        type="file"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          const formData = new FormData();
                          formData.append('file', file);

                          try {
                            const res = await fetch('/api/upload', {
                              method: 'POST',
                              body: formData,
                            });
                            const result = await res.json();

                            if (res.ok) {
                              setData((prev) => ({
                                ...prev,
                                files: result.imageUrl,
                              }));
                            } else {
                              alert(result.error || 'Upload failed');
                            }
                          } catch (err) {
                            console.error('File upload error:', err);
                            alert('Error uploading file');
                          }
                        }}
                      />
                    </label>
                  </div>
                ) : (
                  <a
                    href={data.files}
                    download
                    className="absolute top-2 right-2 bg-yellow-400 hover:bg-yellow-500 px-2 py-1 rounded shadow transition font-light"
                  >
                    ⬇ Download File
                  </a>
                ))}

              <img
                src={data.image}
                alt={data.title}
                className="object-contain max-w-full h-auto rounded w-fit"
              />
              {isEditing && (
                <div className="mt-6 space-y-2 flex flex-col items-center">
                  {data.image && (
                    <img
                      src={data.image}
                      alt="preview"
                      className="max-w-xs rounded shadow"
                    />
                  )}

                  <div className="flex flex-col gap-1 w-fit">
                    {data.image && (
                      <span className="text-blue-600 text-xs truncate max-w-xs">
                        📸 {data.image.split('/').pop()}
                      </span>
                    )}

                    {/* Upload button */}
                    <label className="cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium text-sm px-4 py-1.5 rounded shadow text-center">
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;

                          const formData = new FormData();
                          formData.append('file', file);

                          try {
                            const res = await fetch('/api/upload', {
                              method: 'POST',
                              body: formData,
                            });

                            const json = await res.json();
                            if (json.imageUrl) {
                              setData((prev) => ({
                                ...prev,
                                image: json.imageUrl,
                              }));
                            } else {
                              alert(json.error || 'Upload failed');
                            }
                          } catch (err) {
                            console.error('Upload error:', err);
                            alert('Upload error');
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            <p className="mt-4 mb-2 font-thin text-sm">Description</p>
            {isEditing ? (
              <textarea
                value={data.description}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full border rounded p-2 text-base sm:text-xl"
                rows={6}
              />
            ) : (
              <p className="font-thin sm:text-2xl text-justify sm:text-left">
                {data.description}
              </p>
            )}
          </>
        )}
        {isEditing && (
          <div className="flex gap-2 mt-4">
            {['text', 'image', 'code'].map((type) => (
              <button
                key={type}
                onClick={() =>
                  setSections((prev) => [...prev, { type, content: '' }])
                }
                className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded text-sm"
              >
                ➕ {type}
              </button>
            ))}
          </div>
        )}

        {sections.map((section, index) => (
          <div
            key={index}
            className="my-6 relative group rounded-lg p-4 bg-white border border-yellow-100 shadow-md"
          >
            {/* DELETE Button */}
            {isEditing && (
              <button
                onClick={() => {
                  const updated = [...sections];
                  updated.splice(index, 1);
                  setSections(updated);
                }}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white border border-red-200 rounded px-2 py-1 text-xs hidden group-hover:block"
              >
                ❌
              </button>
            )}

            {/* Section Content */}
            {isEditing ? (
              <>
                {section.type === 'text' && (
                  <>
                    <p className="text-sm text-gray-500 mb-1">📝 Text</p>
                    <textarea
                      value={section.content}
                      onChange={(e) => {
                        const updated = [...sections];
                        updated[index].content = e.target.value;
                        setSections(updated);
                      }}
                      className="w-full border border-yellow-300 rounded p-3 text-base focus:outline-none focus:ring focus:ring-yellow-200"
                      rows={5}
                      placeholder="Write your paragraph..."
                    />
                  </>
                )}
                {section.type === 'image' && (
                  <>
                    <p className="text-sm text-gray-500 mb-1">🖼️ Image</p>
                    <div className="space-y-2">
                      {section.content && (
                        <img
                          src={section.content}
                          alt={`preview-${index}`}
                          className="max-w-xs rounded shadow"
                        />
                      )}

                      <div className="flex flex-col gap-1 w-fit">
                        {section.content && (
                          <span className="text-blue-600 text-xs underline truncate max-w-xs">
                            🖼️ {section.content.split('/').pop()}
                          </span>
                        )}
                        <label className="cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium text-sm px-4 py-1.5 rounded shadow w-fit">
                          Upload Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (!file) return;

                              const formData = new FormData();
                              formData.append('file', file);

                              try {
                                const res = await fetch('/api/upload', {
                                  method: 'POST',
                                  body: formData,
                                });
                                const json = await res.json();

                                if (json.imageUrl) {
                                  const updated = [...sections];
                                  updated[index].content = json.imageUrl;
                                  setSections(updated);
                                } else {
                                  alert(json.error || 'Upload failed');
                                }
                              } catch (err) {
                                console.error('Upload error:', err);
                                alert('Upload error');
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </>
                )}
                {section.type === 'code' && (
                  <>
                    <p className="text-sm text-gray-500 mb-1">💻 Code</p>
                    <textarea
                      value={section.content}
                      onChange={(e) => {
                        const updated = [...sections];
                        updated[index].content = e.target.value;
                        setSections(updated);
                      }}
                      className="w-full font-mono border border-yellow-300 rounded p-3 bg-gray-900 text-green-300"
                      rows={7}
                      placeholder="Enter code here..."
                    />
                  </>
                )}
              </>
            ) : (
              <>
                {section.type === 'text' && (
                  <p className="prose sm:prose-xl max-w-none text-gray-800 leading-relaxed">
                    {section.content}
                  </p>
                )}

                {section.type === 'image' && (
                  <div className="my-4">
                    <img
                      src={section.content}
                      alt={`section-${index}`}
                      className="rounded-lg shadow max-w-full mx-auto"
                    />
                  </div>
                )}

                {section.type === 'code' && (
                  <pre className="bg-gray-900 text-green-300 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap text-sm leading-relaxed">
                    <code>{section.content}</code>
                  </pre>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="flex justify-end mt-4">
          <button
            onClick={async () => {
              try {
                const res = await fetch(`/api/admin/details/${data.id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ ...data, sections }),
                });

                if (res.ok) {
                  alert('Update successful');
                  setIsEditing(false);
                } else {
                  alert('Failed to update');
                }
              } catch (err) {
                console.error(err);
                alert('Error updating content');
              }
            }}
            className="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded"
          >
            ✅ Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
