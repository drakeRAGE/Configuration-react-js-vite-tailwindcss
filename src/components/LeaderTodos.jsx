import React, { useEffect, useState } from 'react';

const LeaderTodos = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/todos/leader')
      .then(response => response.json())
      .then(data => setTodos(data))
      .catch(err => console.error("Failed to fetch leader's todos", err));
  }, []);

  return (
    <section>
      <h2 className="text-2xl font-bold">Leader's Todos</h2>
      <ul>
        {todos.map(todo => (
          <li key={todo._id}>{todo.text}</li>
        ))}
      </ul>
    </section>
  );
};

export default LeaderTodos;
