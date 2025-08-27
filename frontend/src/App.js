import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './Login.jsx';
import Register from './Register.jsx';
import RequireAuth from './RequireAuth.jsx';
import { useAuth } from './AuthContext';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState("all");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [error, setError] = useState("");
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setError("");
    axios.get("/api/todos")
      .then((res) => setTodos(res.data))
      .catch(err => {
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
          logout();
          navigate('/login');
        } else {
          setError("Failed to load todos.");
        }
      });
    // eslint-disable-next-line
  }, []);

  const addTodo = async () => {
    if (!text.trim()) return;
    setError("");
    try {
      const res = await axios.post("/api/todos", { text, dueDate });
      setTodos([res.data, ...todos]);
      setText("");
      setDueDate("");
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
        logout();
        navigate('/login');
      } else {
        setError("Failed to add todo.");
      }
    }
  };

  const toggleTodo = async (id) => {
    setError("");
    try {
      const res = await axios.put(`/api/todos/${id}`);
      setTodos(todos.map((todo) => (todo._id === id ? res.data : todo)));
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
        logout();
        navigate('/login');
      } else {
        setError("Failed to update todo.");
      }
    }
  };

  const startEdit = (todo) => {
    setEditId(todo._id);
    setEditText(todo.text);
    setEditDueDate(todo.dueDate ? todo.dueDate.slice(0, 10) : "");
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditText("");
    setEditDueDate("");
  };

  const saveEdit = async (id) => {
    setError("");
    try {
      const res = await axios.put(`/api/todos/${id}/edit`, { text: editText, dueDate: editDueDate });
      setTodos(todos.map((todo) => (todo._id === id ? res.data : todo)));
      cancelEdit();
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
        logout();
        navigate('/login');
      } else {
        setError("Failed to update todo.");
      }
    }
  };

  const deleteTodo = async (id) => {
    setError("");
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
        logout();
        navigate('/login');
      } else {
        setError("Failed to delete todo.");
      }
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #7f53ac 0%, #657ced 100%)", padding: 0, margin: 0 }}>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h1 style={{ textAlign: "center", color: "#fff", fontSize: 60, fontWeight: 700, marginBottom: 8, textShadow: "0 2px 8px #0002" }}>
            My Todo List
          </h1>
          <button onClick={logout} style={{ background: '#f43f5e', color: '#fff', border: 0, borderRadius: 6, padding: '8px 18px', fontWeight: 600, fontSize: 16, cursor: 'pointer', marginLeft: 16 }}>Logout</button>
        </div>
        <p style={{ textAlign: "center", color: "#e0e7ff", fontSize: 18, marginBottom: 24 }}>
          Stay organized and get things done
        </p>
        {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: 16 }}>{error}</div>}
        {/* Progress Bar */}
        <div style={{ background: "#fff3", borderRadius: 8, height: 10, marginBottom: 16, overflow: "hidden" }}>
          <div style={{
            height: "100%",
            background: "linear-gradient(90deg, #22d3ee, #fbbf24, #f472b6)",
            width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : 0,
            transition: "width 0.5s"
          }} />
        </div>
        <p style={{ color: "#bae6fd", textAlign: "center", marginBottom: 24 }}>
          {completedCount} of {totalCount} tasks completed
        </p>
        {/* Add Todo Form */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="What needs to be done?"
            style={{ flex: 1, padding: 10, borderRadius: 6, border: "1px solid #ddd", fontSize: 16 }}
            onKeyPress={e => e.key === "Enter" && addTodo()}
          />
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            style={{ padding: 10, borderRadius: 6, border: "1px solid #ddd", fontSize: 16 }}
          />
          <button
            onClick={addTodo}
            disabled={!text.trim()}
            style={{ padding: "0 18px", borderRadius: 6, background: "linear-gradient(90deg, #fbbf24, #f472b6)", color: "#fff", fontWeight: 600, border: 0, fontSize: 16, cursor: "pointer", boxShadow: "0 2px 8px #0001" }}
          >
            Add
          </button>
        </div>
        {/* Filter Tabs */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24 }}>
          {['all', 'active', 'completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "6px 18px",
                borderRadius: 6,
                border: 0,
                background: filter === f ? "#22d3ee" : "#fff2",
                color: filter === f ? "#fff" : "#bae6fd",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        {/* Todo List */}
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {filteredTodos.map(todo => (
            <li key={todo._id} style={{
              background: "#fff8",
              borderRadius: 8,
              marginBottom: 12,
              padding: 16,
              display: "flex",
              alignItems: "center",
              boxShadow: "0 2px 8px #0001"
            }}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo._id)}
                style={{ width: 20, height: 20, marginRight: 16 }}
              />
              <div style={{ flex: 1 }}>
                {editId === todo._id ? (
                  <>
                    <input
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      style={{ fontSize: 16, marginRight: 8, borderRadius: 4, border: '1px solid #ccc', padding: 4 }}
                    />
                    <input
                      type="date"
                      value={editDueDate}
                      onChange={e => setEditDueDate(e.target.value)}
                      style={{ fontSize: 16, borderRadius: 4, border: '1px solid #ccc', padding: 4 }}
                    />
                  </>
                ) : (
                  <>
                    <span style={{
                      textDecoration: todo.completed ? "line-through" : "none",
                      color: todo.completed ? "#3b3b3b" : "#334155",
                      fontSize: 18,
                      fontWeight: 500
                    }}>
                      {todo.text}
                    </span>
                    {todo.dueDate && (
                      <span style={{ color: isOverdue(todo.dueDate) ? "#ef4444" : "#64748b", marginLeft: 12, fontSize: 14 }}>
                        (Due: {new Date(todo.dueDate).toLocaleDateString()})
                        {isOverdue(todo.dueDate) && <span style={{ marginLeft: 4 }}>&#9888;</span>}
                      </span>
                    )}
                  </>
                )}
              </div>
              <button
                onClick={() => deleteTodo(todo._id)}
                style={{
                  marginLeft: 16,
                  background: "linear-gradient(90deg, #f43f5e, #fbbf24)",
                  border: 0,
                  color: "#fff",
                  fontSize: 15,
                  cursor: "pointer",
                  borderRadius: 6,
                  padding: "6px 14px",
                  fontWeight: 600,
                  marginRight: 8,
                  boxShadow: "0 2px 8px #0001"
                }}
              >
                Delete
              </button>
              {editId === todo._id ? (
                <>
                  <button
                    onClick={() => saveEdit(todo._id)}
                    style={{
                      background: "linear-gradient(90deg, #a78bfa, #22d3ee)",
                      border: 0,
                      color: "#fff",
                      fontSize: 15,
                      cursor: "pointer",
                      borderRadius: 6,
                      padding: "6px 14px",
                      fontWeight: 600,
                      marginRight: 8,
                      boxShadow: "0 2px 8px #0001"
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    style={{ background: "#64748b", border: 0, color: "#fff", fontSize: 15, cursor: "pointer", borderRadius: 6, padding: "6px 14px", fontWeight: 600 }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => startEdit(todo)}
                  style={{
                    background: "linear-gradient(90deg, #f472b6, #a78bfa)",
                    border: 0,
                    color: "#fff",
                    fontSize: 15,
                    cursor: "pointer",
                    borderRadius: 6,
                    padding: "6px 14px",
                    fontWeight: 600,
                    boxShadow: "0 2px 8px #0001"
                  }}
                >
                  Update
                </button>
              )}
            </li>
          ))}
        </ul>
        {filteredTodos.length === 0 && (
          <div style={{ textAlign: "center", color: "#fff", marginTop: 48, fontSize: 22 }}>
            {filter === "completed"
              ? "No completed tasks yet"
              : filter === "active"
                ? "No active tasks"
                : "No tasks yet. Add your first task!"}
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <RequireAuth>
            <TodoApp />
          </RequireAuth>
        } />
        <Route path="*" element={<div style={{textAlign:'center',marginTop:60,fontSize:24}}>404 Not Found</div>} />
      </Routes>
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <Link to="/login" style={{ margin: 8 }}>Login</Link>
        <Link to="/register" style={{ margin: 8 }}>Register</Link>
        <Link to="" style={{ margin: 8 }}>Home</Link>
      </div>
    </>
  );
}
