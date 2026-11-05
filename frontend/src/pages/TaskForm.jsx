import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { addTask, getTask, updateTask } from "../api";
import Attachment from "../components/Attachment.jsx";

const empty = { taskName: "", assignedTo: "", category: "", priority: "Medium", dueDate: "", status: "Pending" };

export default function TaskForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(empty);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [existing, setExisting] = useState({ name: "", type: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    getTask(id)
      .then(({ data }) => {
        setForm({
          taskName: data.taskName, assignedTo: data.assignedTo, category: data.category,
          priority: data.priority, status: data.status,
          dueDate: data.dueDate ? data.dueDate.slice(0, 10) : "",
        });
        setExisting({ name: data.attachment, type: data.attachmentType });
      })
      .catch(() => setError("Task load nahi ho paya."));
  }, [id, isEdit]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const pickFile = (f) => {
    setFile(f || null);
    setPreview(f && f.type.startsWith("image/") ? URL.createObjectURL(f) : "");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append("attachment", file); // file na do to purani attachment same rahegi
    try {
      isEdit ? await updateTask(id, fd) : await addTask(fd);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Save nahi ho paya.");
      setSaving(false);
    }
  };

  return (
    <>
      <Link to="/" className="back"><i className="bi bi-arrow-left"></i> Back to tasks</Link>
      <h1 className="page-title mt-2">{isEdit ? "Edit task" : "Add task"}</h1>
      <p className="page-sub mb-4">
        {isEdit ? "Update the details. Leave the file as is to keep the current attachment." : "Fill in the details and attach a file if needed."}
      </p>

      <form onSubmit={onSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card-x p-4">
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">Task name</label>
                  <input className="form-control" name="taskName" value={form.taskName} onChange={onChange} placeholder="e.g. Design login page" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Assigned to</label>
                  <input className="form-control" name="assignedTo" value={form.assignedTo} onChange={onChange} placeholder="Person's name" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Category</label>
                  <input className="form-control" name="category" value={form.category} onChange={onChange} placeholder="e.g. Design" required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Priority</label>
                  <select className="form-select" name="priority" value={form.priority} onChange={onChange}>
                    <option>Low</option><option>Medium</option><option>High</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Due date</label>
                  <input type="date" className="form-control" name="dueDate" value={form.dueDate} onChange={onChange} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Status</label>
                  <select className="form-select" name="status" value={form.status} onChange={onChange}>
                    <option>Pending</option><option>In Progress</option><option>Completed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card-x p-4">
              <label className="form-label">Task attachment</label>
              <label className="dropzone">
                <input type="file" hidden onChange={(e) => pickFile(e.target.files[0])} />
                {preview ? (
                  <img src={preview} alt="preview" className="drop-preview" />
                ) : isEdit && existing.name && !file ? (
                  <Attachment file={existing.name} type={existing.type} size={96} />
                ) : (
                  <i className="bi bi-cloud-arrow-up drop-icon"></i>
                )}
                <span className="drop-title">
                  {file ? file.name : isEdit && existing.name ? "Current file. Click to replace" : "Click to upload"}
                </span>
                <small>Image or document, up to 5 MB</small>
              </label>
              {file && (
                <button type="button" className="btn btn-link btn-sm text-danger p-0 mt-2" onClick={() => pickFile(null)}>
                  Remove selected file
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="d-flex gap-2 mt-4">
          <button className="btn btn-primary-solid" disabled={saving}>
            {saving ? "Saving…" : isEdit ? "Save changes" : "Add task"}
          </button>
          <Link to="/" className="btn btn-soft">Cancel</Link>
        </div>
      </form>
    </>
  );
}
