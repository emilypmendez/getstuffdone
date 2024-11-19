import { useEffect, useState } from 'react';
import {
  fetchObjectives,
  createObjective,
  updateObjective,
  deleteObjective,
} from '../services/supabaseClient';
import '../styles/ObjectivesPage.css';

function ObjectivesPage() {
  const [objectives, setObjectives] = useState([]);
  const [newObjective, setNewObjective] = useState({ title: '', description: '' });

  // Fetch objectives on component mount
  useEffect(() => {
    const loadObjectives = async () => {
      try {
        const data = await fetchObjectives();
        setObjectives(data);
      } catch (error) {
        console.error('Error fetching objectives:', error.message);
      }
    };
    loadObjectives();
  }, []);

  // Handle new objective creation
  const handleCreate = async () => {
    try {
      const data = await createObjective(newObjective.title, newObjective.description);
      setObjectives([...objectives, ...data]);
      setNewObjective({ title: '', description: '' });
    } catch (error) {
      console.error('Error creating objective:', error.message);
    }
  };

  // Handle objective update
  const handleUpdate = async (id, updates) => {
    try {
      const data = await updateObjective(id, updates);
      setObjectives(objectives.map(obj => (obj.id === id ? { ...obj, ...data[0] } : obj)));
    } catch (error) {
      console.error('Error updating objective:', error.message);
    }
  };

  // Handle objective deletion
  const handleDelete = async (id) => {
    try {
      await deleteObjective(id);
      setObjectives(objectives.filter(obj => obj.id !== id));
    } catch (error) {
      console.error('Error deleting objective:', error.message);
    }
  };

  return (
    <div>
      <h1>Objectives</h1>

      {/* Create New Objective */}
      <div>
        <input
          type="text"
          placeholder="Title"
          value={newObjective.title}
          onChange={(e) => setNewObjective({ ...newObjective, title: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={newObjective.description}
          onChange={(e) => setNewObjective({ ...newObjective, description: e.target.value })}
        />
        <button onClick={handleCreate}>Add Objective</button>
      </div>

      {/* List Objectives */}
      <ul>
        {objectives.map((objective) => (
          <li key={objective.id}>
            <h3>{objective.title}</h3>
            <p>{objective.description}</p>
            <button onClick={() => handleUpdate(objective.id, { title: 'Updated Title' })}>
              Edit
            </button>
            <button onClick={() => handleDelete(objective.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ObjectivesPage;
