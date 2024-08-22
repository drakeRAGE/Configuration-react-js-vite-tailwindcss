// src/components/MemberTodos.jsx
import React, { useState, useEffect } from 'react';

const MemberTodos = ({ member }) => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedText, setEditedText] = useState('');

  useEffect(() => {
    fetch(`http://localhost:5000/api/todos/member/${member._id}`)
      .then(response => response.json())
      .then(data => setTodos(data))
      .catch(err => console.error(`Failed to fetch todos for ${member.name}`, err));
  }, [member]);

  const addTodo = () => {
    if (newTodo.trim()) {
      fetch('http://localhost:5000/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTodo, memberId: member._id }),
      })
        .then(response => response.json())
        .then(todo => setTodos([...todos, todo]))
        .catch(err => console.error("Failed to add todo", err));
      setNewTodo('');
    }
  };

  const editTodo = (id) => {
    fetch(`http://localhost:5000/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: editedText }),
    })
      .then(response => response.json())
      .then(updatedTodo => {
        setTodos(todos.map(todo => (todo._id === id ? updatedTodo : todo)));
        setEditingTodo(null);
        setEditedText('');
      })
      .catch(err => console.error("Failed to edit todo", err));
  };

  const toggleCompletion = (id, currentStatus) => {
    fetch(`http://localhost:5000/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !currentStatus }),
    })
      .then(response => response.json())
      .then(updatedTodo => {
        setTodos(todos.map(todo => (todo._id === id ? updatedTodo : todo)));
      })
      .catch(err => console.error("Failed to update todo completion", err));
  };

  const deleteTodo = (id) => {
    fetch(`http://localhost:5000/api/todos/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setTodos(todos.filter(todo => todo._id !== id));
      })
      .catch(err => console.error("Failed to delete todo", err));
  };

  return (
    <section className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{member.name}'s Todos</h2>
      <ul className="space-y-4">
        {todos.map(todo => (
          <li key={todo._id} className={`flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm ${todo.completed ? 'opacity-50' : ''}`}>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleCompletion(todo._id, todo.completed)}
                className="form-checkbox h-5 w-5 text-blue-600 dark:text-blue-400 transition duration-150 ease-in-out"
              />
              <span className={`text-lg ${todo.completed ? 'line-through text-gray-500 dark:text-gray-600' : 'text-gray-800 dark:text-gray-200'}`}>{todo.text}</span>
            </div>
            <div className="flex space-x-2">
              {editingTodo === todo._id ? (
                <>
                  <input
                    type="text"
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-40"
                  />
                  <button onClick={() => editTodo(todo._id)} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Save</button>
                  <button onClick={() => setEditingTodo(null)} className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg">Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={() => { setEditingTodo(todo._id); setEditedText(todo.text); }} className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600">Edit</button>
                  <button onClick={() => deleteTodo(todo._id)} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">Delete</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex">
        <input
          type="text"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          placeholder="New Todo"
          className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full mr-4 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
        <button onClick={addTodo} className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition">Add Todo</button>
      </div>
    </section>
  );
};

export default MemberTodos;
