import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axiosInstance';

export default function TaskFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'pending',
    priority: 'medium',
    attachmentUrl: ''
  });
  const [file, setFile] = useState(null);
  const [err, setErr] = useState('');

  const fetchTask = async () => {
    try {
      const res = await api.get(`/tasks/${id}`);
      const t = res.data;
      setForm({
        title: t.title,
        description: t.description || '',
        dueDate: t.dueDate ? t.dueDate.slice(0, 10) : '',
        status: t.status,
        priority: t.priority,
        attachmentUrl: t.attachmentUrl || ''
      });
    } catch (error) {
      console.error(error);
      navigate('/');
    }
  };

  useEffect(() => {
    if (isEdit) fetchTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');

    try {
      let attachmentUrl = form.attachmentUrl;

      if (file) {
        const fd = new FormData();
        fd.append('file', file);
        const uploadRes = await api.post('/upload', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        attachmentUrl = uploadRes.data.url;
      }

      const payload = { ...form, attachmentUrl };

      if (isEdit) {
        await api.put(`/tasks/${id}`, payload);
      } else {
        await api.post('/tasks', payload);
      }

      navigate('/');
    } catch (error) {
      console.error(error);
      setErr(error.response?.data?.message || 'Failed to save task');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="card-title">
            {isEdit ? 'Edit Task' : 'Create New Task'}
          </h2>
          <p className="text-sm text-base-content/70 mb-2">
            Set your task details and deadline.
          </p>

          {err && (
            <div className="alert alert-error py-2 mb-3 text-sm">
              <span>{err}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3 md:col-span-2">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  name="title"
                  className="input input-bordered w-full"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  name="description"
                  className="textarea textarea-bordered w-full"
                  value={form.description}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Due Date</span>
                </label>
                <input
                  type="date"
                  name="dueDate"
                  className="input input-bordered w-full"
                  value={form.dueDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Status</span>
                </label>
                <select
                  name="status"
                  className="select select-bordered w-full"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Priority</span>
                </label>
                <select
                  name="priority"
                  className="select select-bordered w-full"
                  value={form.priority}
                  onChange={handleChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Attachment (optional)</span>
                </label>
                <input
                  type="file"
                  className="file-input file-input-bordered w-full"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                {form.attachmentUrl && (
                  <a
                    href={`http://localhost:5000${form.attachmentUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="link link-primary text-xs mt-1"
                  >
                    Current attachment
                  </a>
                )}
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end gap-2 mt-2">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {isEdit ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
