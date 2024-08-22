import React, { useState } from 'react';

const AddMemberButton = ({ onAddMember }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const addMember = () => {
    setError('');  // Clear previous error

    fetch('http://localhost:5000/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(errorData => {
            throw new Error(errorData.error);
          });
        }
        return response.json();
      })
      .then(member => {
        onAddMember(member);
        setName('');
      })
      .catch(err => {
        setError(err.message);
      });
  };

  return (
    <section>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Member Name"
        className="border p-2"
      />
      <button onClick={addMember} className="ml-2 bg-green-500 text-white p-2">
        Add Member
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </section>
  );
};

export default AddMemberButton;
