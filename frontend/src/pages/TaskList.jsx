import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getTasks, deleteTask } from "../api";
import Attachment from "../components/Attachment.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import { PriorityBadge, StatusBadge, Avatar } from "../components/Badges.jsx";

const isOverdue = (t) => t.status !== "Completed" && new Date(t.dueDate) < new Date(new Date().toDateString());

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [toDelete, setToDelete] = useState(null);

  useEffect(() => {
    getTasks()
      .then(({ data }) => setTasks(data))
      .catch(() => setError("Backend se connect nahi ho paya. Check karo ki server port 5000 par chal raha hai."))
      .finally(() => setLoading(false));
  }, []);

  const confirmDelete = async () => {
    await deleteTask(toDelete._id);
    setTasks((t) => t.filter((x) => x._id !== toDelete._id));
    setToDelete(null);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tasks.filter((t) => {
      const text = [t.taskName, t.assignedTo, t.category, t.priority, t.status].join(" ").toLowerCase();
      return (!q || text.includes(q)) && (!priority || t.priority === priority) && (!status || t.status === status);
    });
  }, [tasks, search, priority, status]);

  const count = (s) => tasks.filter((t) => t.status === s).length;
  const stats = [
    { label: "All tasks", value: tasks.length, icon: "bi-collection", cls: "s-all", filter: "" },
    { label: "Pending", value: count("Pending"), icon: "bi-hourglass-split", cls: "s-pending", filter: "Pending" },
    { label: "In progress", value: count("In Progress"), icon: "bi-lightning-charge", cls: "s-progress", filter: "In Progress" },
    { label: "Completed", value: count("Completed"), icon: "bi-check-circle", cls: "s-done", filter: "Completed" },
  ];

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="page-sub">Track who is doing what, and by when.</p>
        </div>
        <Link to="/add" className="btn btn-primary-solid"><i className="bi bi-plus-lg me-1"></i> Add task</Link>
      </div>

      <div className="row g-3 mb-4">
        {stats.map((s) => (
          <div className="col-6 col-lg-3" key={s.label}>
            <button className={`stat ${s.cls} ${status === s.filter ? "active" : ""}`} onClick={() => setStatus(s.filter)}>
              <span className="stat-icon"><i className={`bi ${s.icon}`}></i></span>
              <span className="text-start">
                <span className="stat-num">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </span>
            </button>
          </div>
        ))}
      </div>

      <div className="card-x">
        <div className="toolbar">
          <div className="search">
            <i className="bi bi-search"></i>
            <input placeholder="Search task, person, category…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="form-select select-sm" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="">All priorities</option>
            <option>Low</option><option>Medium</option><option>High</option>
          </select>
          <select className="form-select select-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            <option>Pending</option><option>In Progress</option><option>Completed</option>
          </select>
        </div>

        {error && <div className="alert alert-danger m-3">{error}</div>}

        <div className="table-responsive">
          <table className="table align-middle mb-0 tbl">
            <thead>
              <tr>
                <th></th><th>Task</th><th>Assigned to</th><th>Category</th>
                <th>Priority</th><th>Due date</th><th>Status</th><th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan="8" className="empty">Loading tasks…</td></tr>}
              {!loading && !error && filtered.length === 0 && (
                <tr><td colSpan="8" className="empty">
                  <i className="bi bi-inbox"></i>
                  <div>{tasks.length === 0 ? "No tasks yet. Add your first task to get started." : "No tasks match your search."}</div>
                </td></tr>
              )}
              {filtered.map((t) => {
                const late = isOverdue(t);
                return (
                  <tr key={t._id}>
                    <td style={{ width: 70 }}><Attachment file={t.attachment} type={t.attachmentType} /></td>
                    <td className="task-name">{t.taskName}</td>
                    <td><div className="d-flex align-items-center gap-2"><Avatar name={t.assignedTo} />{t.assignedTo}</div></td>
                    <td><span className="cat">{t.category}</span></td>
                    <td><PriorityBadge value={t.priority} /></td>
                    <td className={late ? "due late" : "due"}>
                      {new Date(t.dueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      {late && <small>Overdue</small>}
                    </td>
                    <td><StatusBadge value={t.status} /></td>
                    <td className="text-end text-nowrap">
                      <Link to={`/edit/${t._id}`} className="icon-btn" title="Edit"><i className="bi bi-pencil-square"></i></Link>
                      <button className="icon-btn danger" title="Delete" onClick={() => setToDelete(t)}><i className="bi bi-trash3"></i></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {toDelete && (
        <ConfirmModal
          title="Delete this task?"
          message={`"${toDelete.taskName}" and its attachment will be removed permanently.`}
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </>
  );
}
