// src/App.jsx
import React, { useState, useEffect } from 'react';
import MemberTodos from './components/MemberTodos';
import ThemeToggle from './components/ThemeToggle';

const App = () => {
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState('');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  useEffect(() => {
    fetch('http://localhost:5000/api/members')
      .then(response => response.json())
      .then(data => setMembers(data))
      .catch(err => console.error("Failed to fetch members", err));
  }, []);

  const addMember = () => {
    if (newMember.trim()) {
      fetch('http://localhost:5000/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newMember }),
      })
        .then(response => response.json())
        .then(member => setMembers([...members, member]))
        .catch(err => console.error("Failed to add member", err));
      setNewMember('');
    }
  };

  return (
    <div className="min-h-screen p-8 transition-colors duration-300">
      <header className="flex justify-between items-center mb-12">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-200">Team Todo List</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">Manage your team's tasks efficiently</p>
        </div>
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </header>
      <main>
        {members.length ? (
          members.map(member => (
            <MemberTodos key={member._id} member={member} />
          ))
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400">No members found. Add some members to get started!</p>
        )}
        <div className="mt-12 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Add New Member</h2>
          <div className="flex">
            <input
              type="text"
              value={newMember}
              onChange={(e) => setNewMember(e.target.value)}
              placeholder="Enter member's name"
              className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full mr-4 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            <button onClick={addMember} className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition">Add Member</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
