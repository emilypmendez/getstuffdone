import { useEffect, useState } from 'react';
import {
  fetchObjectives,
  createObjective,
  updateObjective,
  deleteObjective,
} from '../services/supabaseClient';
import { supabase } from '../supabase';
import '../styles/ObjectivesPage.css';
import { Link } from 'react-router-dom';

function ObjectivesPage() {
  const [objectives, setObjectives] = useState([]); // State to hold the list of objectives
  const [newTitle, setNewTitle] = useState(''); // State for creating a new objective
  const [newDescription, setNewDescription] = useState('');
  const [editingId, setEditingId] = useState(null); // Tracks the ID of the objective being edited
  const [editTitle, setEditTitle] = useState(''); // State for the title of the objective being edited
  const [editDescription, setEditDescription] = useState(''); // State for the description of the objective being edited

  const [error, setError] = useState(''); // State for error messages
  const [success, setSuccess] = useState(false);  // State for success messages
  const [user, setUser] = useState(null); // State for the current user
  const [loading, setLoading] = useState(true); // State for loading status

  // Fetch objectives on page load
  useEffect(() => {
    const loadObjectives = async () => {
      try {
        const data = await fetchObjectives();
        console.log('Fetched objectives:', data); // Debugging log
        setObjectives(data || []); // Ensure empty array if no data is fetched
      } catch (err) {
        console.error('Error fetching objectives:', err.message); // Log fetch errors
      } finally {
        setLoading(false); // Stop loading
      }
    };
  
    loadObjectives();
  }, []);  

  // Fetch the user on component mount
  useEffect(() => {
    const fetchUser = async () => {
      const { data: user, error } = await supabase.auth.getUser();
      console.log('Fetched user:', user); // Add this to debug
      if (error) {
        console.error('Error fetching user:', error);
      }
      setUser(user); // Ensure this sets the correct user
    };
  
    fetchUser();
  }, []);  

  // Automatically hide the success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false); // Hide the success message
      }, 5000); // 5 seconds

      return () => clearTimeout(timer); // Cleanup the timer when component unmounts
    }
  }, [success]);

  // Handle creating a new objective
  const handleCreateObjective = async () => {
    if (!user) {
      setError(`You must be logged in to create an objective.`);
      return;
    }

    console.log('Form values:', { newTitle, newDescription }); // Debug log
    if (!newTitle || !newDescription) {
      alert('Both title and description are required!');
      return;
    }

    const newObjective = await createObjective(newTitle, newDescription);
    setObjectives((prev) => [...prev, newObjective]);
    setNewTitle('');
    setNewDescription('');
  };

  // Handle objective EDIT
  const handleEditClick = (id, currentTitle, currentDescription) => {
    setEditingId(id);
    setEditTitle(currentTitle);
    setEditDescription(currentDescription);
  };

  // Handle saving the edited objective
  const handleSaveEdit = async () => {
    if (!editTitle || !editDescription) {
      alert('Both title and description are required!');
      return;
    }
    const updatedObjective = await updateObjective(editingId, {
      title: editTitle,
      description: editDescription,
    });
    setObjectives((prev) =>
      prev.map((obj) => (obj.id === editingId ? updatedObjective : obj))
    );
    setEditingId(null); // Exit edit mode
    setEditTitle('');
    setEditDescription('');
  };

  // Handle canceling edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  };

  // Handle objective DELETION
  const handleDeleteObjective = async (id) => {
    try {
      console.log('Attempting to delete objective with ID:', id); // Debug log
      await deleteObjective(id);
      setObjectives((prev) => prev.filter((obj) => obj.id !== id)); // Remove from state
    } catch (err) {
      console.error('Error deleting objective:', err.message);
      setError('Failed to delete objective.');
    }
  };  

  if (loading) {
    return <div>Loading objectives...</div>;
  }

  if (!user) {
    return (
      <div>
        <h1>Access Denied</h1>
        <p>
          You must be <Link to="/login">logged in</Link> to create an objective.
        </p>
      </div>
    );
  } else if (user === null) {
    return <div>Loading...</div>; // Show a loading message while checking authentication
  } else {
    try {
      console.log('User:', user); // Debugging log
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }

  return (
    <div>
      <h1>List All of Your Objectives for the Week</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Objective created successfully!</p>}

      {/* Create New Objective */}
      <div>
        <input
          type="text"
          placeholder="Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <button onClick={handleCreateObjective}>Add Objective</button>
      </div>

      {/* List Objectives */}
      <div>
      {loading ? (
          <p>Loading objectives...</p> // Render while fetching data
        ) : (
          <ul>
        {objectives.length === 0 ? (
          <p>No objectives found. Create one to get started!</p>
        ) : (
          <ul>
        {objectives
          .filter((obj) => obj) // Remove undefined entries
          .map((obj, index) => {
          console.log(`Rendering objective at index ${index}:`, obj); // Debugging log
          return (
            <li key={obj?.id || index}>
              {/* Edit Objective Section */}
              {editingId === obj.id ? (
                <>
                  <input
                    type="text"
                    defaultValue={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <textarea
                    defaultValue={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                  <br/>
                  <button onClick={() => handleSaveEdit(obj.id)}>Save</button>
                  <button onClick={() => handleCancelEdit(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <div>
                    <strong>{obj?.title || 'Untitled'}</strong>: {obj?.description || 'No description'}
                    <button className="editButton" onClick={() => handleEditClick(obj.id)}>Edit</button>
                    <button className="deleteButton" onClick={() => handleDeleteObjective(obj.id)}>Delete</button>
                  </div>
                </>
              )}
            </li>
          );
        })}
      </ul>

        )} 
        </ul>
      )}
      </div>      
    </div>
  );
}

export default ObjectivesPage;
