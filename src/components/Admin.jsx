import React, { useState, useEffect } from 'react';

export default function Admin() {
  const [username, setUsername] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    date: '',
    tags: '',
    category: '',
    description: '',
    image: '',
    group: '',
    files: '',
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const [newProject, setNewProject] = useState({
    title: '',
    date: '',
    tags: '',
    category: '',
    description: '',
    image: '',
    group: '',
    files: '',
  });

  const handleNewChange = (field, value) => {
    setNewProject((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddProject = async (e) => {
    e.preventDefault();

    const payload = {
      title: newProject.title,
      date: newProject.date,
      tags: newProject.tags.split(',').map((t) => t.trim()),
      category: newProject.category.split(',').map((c) => c.trim()),
      description: newProject.description,
      image: newProject.image,
      group: newProject.group,
      files: newProject.files,
    };

    try {
      const res = await fetch('/api/admin/details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        alert('Failed to add project');
        return;
      }

      const newEntry = await res.json();
      await fetchProjects(); // refresh the project list
      setShowAddForm(false);
      setNewProject({
        title: '',
        date: '',
        tags: '',
        category: '',
        description: '',
        image: '',
        group: '',
        files: '',
      });
    } catch (err) {
      alert('Error adding project');
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) setUsername(storedUser);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/details');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      } else {
        alert('Failed to fetch projects');
      }
    } catch (error) {
      alert('Error fetching projects');
    }
    setLoading(false);
  };

  function handleLogout() {
    fetch('/api/logout', { method: 'POST' }).then(() => {
      localStorage.removeItem('user');
      window.location.href = '/login';
    });
  }

  // Start editing a project: fill form with project data
  const startEdit = (project) => {
    setEditingId(project.id);
    setEditForm({
      title: project.title,
      date: project.date,
      tags: Array.isArray(project.tags)
        ? project.tags.join(', ')
        : project.tags,
      category: Array.isArray(project.category)
        ? project.category.join(', ')
        : project.category,
      description: project.description,
      image: project.image,
      group: project.group || 'Process',
      files: project.files || '',
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
  };

  // Handle changes in edit form inputs
  const handleChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  // Save edited project — PUT request to update
  const saveEdit = async (id) => {
    const updatedProject = {
      title: editForm.title,
      date: editForm.date,
      tags: editForm.tags.split(',').map((t) => t.trim()),
      category: editForm.category.split(',').map((c) => c.trim()),
      description: editForm.description,
      image: editForm.image,
      group: editForm.group,
      files: editForm.file,
    };

    try {
      const res = await fetch(`/api/admin/details/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProject),
      });

      if (!res.ok) {
        alert('Failed to update project');
        return;
      }

      // Update local state after success
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { id, ...updatedProject } : p)),
      );
      setEditingId(null);
    } catch (error) {
      alert('Error updating project');
    }
  };

  // Delete project — DELETE request to API
  const deleteProject = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const res = await fetch(`/api/admin/details/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        alert('Failed to delete project');
        return;
      }

      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (editingId === id) setEditingId(null);
    } catch (error) {
      alert('Error deleting project');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        alert('Image upload failed');
        return;
      }

      const data = await res.json();
      setNewProject((prev) => ({ ...prev, image: data.imageUrl })); // imageUrl should be returned from your backend
    } catch (error) {
      alert('Error uploading image');
    }
  };
  const handleEditImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      setEditForm((prev) => ({
        ...prev,
        image: data.imageUrl,
      }));
    } catch (err) {
      alert('Image upload failed');
    }
  };
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        alert('File upload failed');
        return;
      }

      const data = await res.json();
      setNewProject((prev) => ({
        ...prev,
        files: data.imageUrl,
      }));

      alert('File uploaded and DB updated successfully!');
    } catch (error) {
      alert('Error uploading file');
    }
  };

  const handleEditFileUpload = async (e, projectId) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      // 1) Update state locally
      setEditForm((prev) => ({
        ...prev,
        files: data.imageUrl, // URL returned from upload API
      }));

      // 2) Send PUT request to update the DB with new file URL
      const updateRes = await fetch(`/api/admin/details/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editForm,
          files: data.imageUrl,
        }),
      });

      if (!updateRes.ok) throw new Error('Failed to update DB with file URL');

      alert('File uploaded and DB updated successfully!');
    } catch (err) {
      alert('Image upload failed');
    }
  };

  return (
    <div className="p-2 sm:p-8">
      <div className="flex items-center justify-between w-full mb-8">
        <h1 className="text-3xl">
          Welcome, <span className="capitalize">{username}</span>
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
      <section className="overflow-x-auto">
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
          <table className="min-w-full border border-slate-500 border border-slate-500-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-slate-500 px-4 py-2 text-left">
                  ID
                </th>
                <th className="border border-slate-500 px-4 py-2 text-left">
                  Title
                </th>
                <th className="border border-slate-500 px-4 py-2 text-left">
                  Date
                </th>
                <th className="border border-slate-500 px-4 py-2 text-left">
                  Tags
                </th>
                <th className="border border-slate-500 px-4 py-2 text-left">
                  Category
                </th>
                <th className="border border-slate-500 px-4 py-2 text-left">
                  Description
                </th>
                <th className="border border-slate-500 px-4 py-2 text-left">
                  Image
                </th>
                <th className="border border-slate-500 px-4 py-2 text-left">
                  Group
                </th>
                <th className="border border-slate-500 px-4 py-2 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="border border-slate-500 px-4 py-2 text-center text-gray-500"
                  >
                    No projects found.
                  </td>
                </tr>
              ) : (
                projects.map((p) =>
                  editingId === p.id ? (
                    <tr key={p.id} className="bg-yellow-100">
                      <td className="border border-slate-500 px-4 py-2">
                        {p.id}
                      </td>
                      <td className="border border-slate-500 px-4 py-2">
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) =>
                            handleChange('title', e.target.value)
                          }
                          className="w-full border border-slate-500 rounded px-1 py-0.5"
                        />
                      </td>
                      <td className="border border-slate-500 px-4 py-2">
                        <input
                          type="text"
                          value={editForm.date}
                          onChange={(e) => handleChange('date', e.target.value)}
                          className="w-full border border-slate-500 rounded px-1 py-0.5"
                        />
                      </td>
                      <td className="border border-slate-500 px-4 py-2">
                        <input
                          type="text"
                          value={editForm.tags}
                          onChange={(e) => handleChange('tags', e.target.value)}
                          className="w-full border border-slate-500 rounded px-1 py-0.5"
                          placeholder="Comma separated"
                        />
                      </td>
                      <td className="border border-slate-500 px-4 py-2">
                        <input
                          type="text"
                          value={editForm.category}
                          onChange={(e) =>
                            handleChange('category', e.target.value)
                          }
                          className="w-full border border-slate-500 rounded px-1 py-0.5"
                          placeholder="Comma separated"
                        />
                      </td>
                      <td className="border border-slate-500 px-4 py-2 max-w-md">
                        <textarea
                          value={editForm.description}
                          onChange={(e) =>
                            handleChange('description', e.target.value)
                          }
                          className="w-full border border-slate-500 rounded px-2 py-1 resize-y overflow-auto min-h-[80px] max-h-[300px]"
                          placeholder="Enter description..."
                        />
                      </td>
                      <td className="border border-slate-500 px-4 py-2">
                        <div className="flex flex-col gap-2">
                          {editForm.image && (
                            <img
                              src={editForm.image}
                              alt="Preview"
                              className="w-32 h-32 object-cover rounded border border-slate-500"
                            />
                          )}
                          <label className="cursor-pointer inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded shadow-sm w-fit">
                            Upload Image
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleEditImageUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </td>
                      <td className="border border-slate-500 px-4 py-2">
                        <select
                          id="group-select-edit"
                          value={editForm.group}
                          onChange={(e) =>
                            handleChange('group', e.target.value)
                          }
                          className="p-2 border border-slate-500 border border-slate-500-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer w-40 max-w-full"
                        >
                          <option value="Process">Process</option>
                          <option value="Project">Project</option>
                          <option value="Files">Files</option>
                        </select>
                        <div className="flex flex-col gap-2">
                          {editForm.group === 'Files' && (
                            <label className="cursor-pointer inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded shadow-sm w-fit mt-2">
                              Upload File
                              <input
                                type="file"
                                onChange={(e) =>
                                  handleEditFileUpload(e, editingId)
                                }
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>
                      </td>
                      <td className="border border-slate-500 border border-slate-500-black px-4 py-2 space-x-4 text-neutral-400">
                        <button
                          onClick={() => saveEdit(p.id)}
                          className="hover:text-yellow-400"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-save-icon lucide-save"
                          >
                            <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
                            <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
                            <path d="M7 3v4a1 1 0 0 0 1 1h7" />
                          </svg>
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="hover:text-yellow-400"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-ban-icon lucide-ban"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="m4.9 4.9 14.2 14.2" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="border border-slate-500 px-4 py-2">
                        {p.id}
                      </td>
                      <td className="border border-slate-500 px-4 py-2 text-blue-700 hover:underline">
                        <a href={`/details/${p.id}`}>{p.title}</a>
                      </td>
                      <td className="border border-slate-500 px-4 py-2">
                        {p.date}
                      </td>
                      <td className="border border-slate-500 px-4 py-2">
                        {Array.isArray(p.tags) ? p.tags.join(', ') : p.tags}
                      </td>
                      <td className="border border-slate-500 px-4 py-2">
                        {Array.isArray(p.category)
                          ? p.category.join(', ')
                          : p.category}
                      </td>
                      <td className="border border-slate-500 px-4 py-2">
                        {p.description}
                      </td>
                      <td className="border border-slate-500 px-4 py-2">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          'No image'
                        )}
                      </td>
                      <td className="border border-slate-500 px-4 py-2">
                        {p.group}
                      </td>
                      <td className="border border-slate-500 border border-slate-500-black px-4 py-2 space-x-4 text-neutral-400">
                        <button
                          onClick={() => startEdit(p)}
                          className="hover:text-yellow-400"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-pencil-icon lucide-pencil"
                          >
                            <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                            <path d="m15 5 4 4" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteProject(p.id)}
                          className="hover:text-yellow-400"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-trash-icon lucide-trash"
                          >
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ),
                )
              )}
            </tbody>
          </table>
        )}
      </section>
      {/* Add New Project Section */}
      <div className="mt-10">
        <div className="flex justify-between">
          <button
            onClick={() => setShowAddForm((prev) => !prev)}
            className={`px-4 py-2 rounded text-white ${
              showAddForm
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {showAddForm ? 'Cancel' : 'Add New Project'}
          </button>
          <a
            href="/"
            className="text-center bg-yellow-400 hover:bg-yellow-500 text-slate-950 transition px-4 py-2 rounded w-full sm:w-fit"
          >
            🏠 Go to Home
          </a>
        </div>

        {showAddForm && (
          <form
            onSubmit={handleAddProject}
            className="mt-6 space-y-4 bg-gray-50 p-4 rounded border border-slate-500"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Title"
                value={newProject.title}
                onChange={(e) => handleNewChange('title', e.target.value)}
                className="border border-slate-500 p-2 rounded w-full"
                required
              />
              <input
                type="text"
                placeholder="Date"
                value={newProject.date}
                onChange={(e) => handleNewChange('date', e.target.value)}
                className="border border-slate-500 p-2 rounded w-full"
                required
              />
              <input
                type="text"
                placeholder="Tags (comma separated)"
                value={newProject.tags}
                onChange={(e) => handleNewChange('tags', e.target.value)}
                className="border border-slate-500 p-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="Category (comma separated)"
                value={newProject.category}
                onChange={(e) => handleNewChange('category', e.target.value)}
                className="border border-slate-500 p-2 rounded w-full"
              />
              <div className="flex flex-col gap-2">
                {newProject.image && (
                  <img
                    src={newProject.image}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded border border-slate-500"
                  />
                )}
                <label className="cursor-pointer inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded shadow-sm w-fit">
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="flex gap-2 items-center">
                <label
                  htmlFor="group-select"
                  className="mb-1 font-semibold text-sm"
                >
                  Group:
                </label>
                <select
                  id="group-select"
                  value={newProject.group}
                  onChange={(e) => handleNewChange('group', e.target.value)}
                  className="p-2 border border-slate-500 border border-slate-500-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer w-40 max-w-full"
                >
                  <option value="Process">Process</option>
                  <option value="Project">Project</option>
                  <option value="Files">Files</option>
                </select>
                {newProject.group === 'Files' && (
                  <div className="flex gap-2 items-center">
                    <label
                      htmlFor="group-select"
                      className="font-semibold text-sm"
                    >
                      Upload:
                    </label>
                    <label className="cursor-pointer inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded shadow-sm w-fit">
                      Upload File
                      <input
                        type="file"
                        onChange={(e) => handleFileUpload(e, editingId)}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
              <textarea
                placeholder="Description"
                value={newProject.description}
                onChange={(e) => handleNewChange('description', e.target.value)}
                className="border border-slate-500 p-2 rounded w-full col-span-1 sm:col-span-2"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Save Project
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
