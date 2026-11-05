import { Routes, Route, NavLink, Link } from "react-router-dom";
import TaskList from "./pages/TaskList.jsx";
import TaskForm from "./pages/TaskForm.jsx";

export default function App() {
  return (
    <>
      <header className="topbar">
        <div className="container d-flex align-items-center justify-content-between">
          <Link to="/" className="brand">
            <span className="brand-mark"><i className="bi bi-check2-all"></i></span>
            <span>TaskManager</span>
          </Link>
          <nav className="d-flex align-items-center gap-1">
            <NavLink to="/" end className="top-link">Tasks</NavLink>
            <NavLink to="/add" className="top-link">Add task</NavLink>
          </nav>
        </div>
      </header>
      <main className="container page">
        <Routes>
          <Route path="/" element={<TaskList />} />
          <Route path="/add" element={<TaskForm />} />
          <Route path="/edit/:id" element={<TaskForm />} />
        </Routes>
      </main>
    </>
  );
}
