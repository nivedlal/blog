import React, { useEffect, useState } from 'react';

export default function Projects({ tag, category }) {
  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const search = params.get('q');
    if (search) {
      setQuery(search.toLowerCase().trim());
    }
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/admin/details');
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error('[❌] Error fetching projects:', err);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (!projects.length) return;

    const normalize = (val) =>
      Array.isArray(val)
        ? val.map((v) => v.toLowerCase().trim())
        : [val?.toLowerCase().trim()];

    let results = [...projects];

    if (tag) {
      const lowerTag = tag.toLowerCase();
      results = results.filter((p) => normalize(p.tags).includes(lowerTag));
    }

    if (category) {
      const lowerCat = category.toLowerCase();
      results = results.filter((p) => normalize(p.category).includes(lowerCat));
    }

    if (query) {
      results = results.filter((p) => {
        const match = (val) =>
          Array.isArray(val)
            ? val.some((v) => v?.toLowerCase().includes(query))
            : val?.toLowerCase().includes(query);

        return match(p.title) || match(p.tags) || match(p.category);
      });
    }

    setFiltered(results);
  }, [projects, tag, category, query]);

  return (
    <div className="bg-gray-200 text-gray-900 min-h-screen selection:bg-yellow-300 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold">Filtered Projects</h1>
          <a
            href="/"
            className="bg-yellow-400 hover:bg-yellow-500 text-sm px-3 py-1 rounded shadow transition"
          >
            ⬅ Home
          </a>
        </div>

        {filtered.length === 0 && (
          <p className="italic text-gray-600">No projects found.</p>
        )}

        <ul className="space-y-3">
          {filtered.map((p) => (
            <li key={p.id}>
              <a
                href={`/details/${p.id}`}
                className="block bg-white p-4 rounded shadow hover:shadow-lg border border-yellow-200 hover:border-yellow-400 transition"
              >
                <h2 className="text-lg sm:text-xl font-semibold">{p.title}</h2>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
