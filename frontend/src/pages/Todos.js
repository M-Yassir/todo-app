import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { todosAPI } from '../services/api';

const Todos = ({ setIsAuthenticated }) => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Todos useEffect - Token exists:', !!token);
    
    if (!token) {
      console.log('No token, redirecting to login');
      navigate('/login');
      return;
    }
    
    fetchTodos();
  }, []); // ← Empty dependency array to prevent infinite loops

  const fetchTodos = async () => {
    try {
      console.log('Fetching todos...');
      const response = await todosAPI.getAll();
      console.log('Todos fetched:', response.data);
      setTodos(response.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch todos:', err);
      setError('Failed to load todos');
      
      if (err.response?.status === 401) {
        console.log('Unauthorized, redirecting to login');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      setLoading(true);
      setError('');
      console.log('Adding todo:', newTodo);
      await todosAPI.create({ text: newTodo });
      setNewTodo('');
      fetchTodos(); // Refresh the list
    } catch (err) {
      console.error('Failed to add todo:', err);
      setError('Failed to add todo');
      
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTodo = async (id, completed) => {
    try {
      setError('');
      console.log('Toggling todo:', id, 'to', !completed);
      await todosAPI.update(id, { completed: !completed });
      fetchTodos();
    } catch (err) {
      console.error('Failed to update todo:', err);
      setError('Failed to update todo');
      
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      setError('');
      console.log('Deleting todo:', id);
      await todosAPI.delete(id);
      fetchTodos();
    } catch (err) {
      console.error('Failed to delete todo:', err);
      setError('Failed to delete todo');
      
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const handleLogout = () => {
    console.log('Logging out');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Update authentication state
    if (setIsAuthenticated) {
      setIsAuthenticated(false);
    }
    
    // Trigger custom event for App component
    window.dispatchEvent(new Event('authChange'));
    
    navigate('/login');
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="todos-container">
      <div className="todos-header">
        <h2>Welcome, {user.username}!</h2>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleAddTodo} className="add-todo-form">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo..."
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add'}
        </button>
      </form>

      <div className="todos-list">
        {todos.length === 0 ? (
          <p>No todos yet. Add one above!</p>
        ) : (
          todos.map((todo) => (
            <div key={todo.id} className="todo-item">
              <input
                type="checkbox"
                checked={todo.completed || false}
                onChange={() => handleToggleTodo(todo.id, todo.completed)}
              />
              <span className={todo.completed ? 'completed' : ''}>
                {todo.text}
              </span>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Todos;