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
    setNewTitle(''); // Clear the form
    setNewDescription(''); // Clear the form
  };

  // Handle objective EDIT
  const handleEditClick = (id) => {
    const objectiveToEdit = objectives.find((obj) => obj.id === id);

    if (!objectiveToEdit) {
      console.error('Objective not found:', id);
      setError('Failed to find objective to edit.');
      return;
    }
    
    console.log('Editing objective:', objectiveToEdit); // Debug log
    setEditingId(id);
    setEditTitle(objectiveToEdit.title || '');
    setEditDescription(objectiveToEdit.description || '');
  };

  // Handle saving the edited objective
  const handleSaveEdit = async () => {
    if (!editTitle.trim() || !editDescription.trim()) {
      alert('Both title and description are required!');
      return;
    }
    try{
      const updatedObjective = await updateObjective(editingId, {
        title: editTitle,
        description: editDescription,
      });

      setObjectives((prev) =>
        prev.map((obj) => (obj.id === editingId ? updatedObjective : obj))
      );
  
      // Reset editing state
      setEditingId(null); // Exit edit mode
      setEditTitle('');
      setEditDescription('');
    } catch (err) {
      console.error('Error updating objective:', err.message);
      setError('Failed to update objective.');
    }
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

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'No date provided';
  
    const date = new Date(dateString);
  
    const options = { year: 'numeric', month: 'long', day: '2-digit' }; // 'long' for full month name
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
  
    return formattedDate; // Example: "November 24, 2024"
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
      <br/>
      <h1>List All of Your Objectives for the Week</h1>
      <p>Start by addressing the Title as <strong>Home, Work,</strong> or <strong>Personal.</strong> <br/>
      Then, fill out a short description of the task at hand.</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Objective created successfully!</p>}

      {/* Create New Objective */}
      <div>
        <input
          type="text"
          placeholder="Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value).toUpperCase()}
        />
        <textarea
          placeholder="Description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleCreateObjective}><strong>Add Objective</strong></button>
        <br/><br/>
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
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                  <br/>
                  <button className="btn btn-dark" onClick={() => handleSaveEdit(obj.id)}><strong>Save</strong></button>
                  <button className="btn btn-danger" onClick={() => handleCancelEdit(null)}><strong>Cancel</strong></button>
                  <br/><br/>
                </>
              ) : (
                <>
                  <div>
                    <table>
                      <th><strong>{obj?.title || 'Untitled'} :</strong></th>
                      <tr><td><strong>{obj?.description || 'No description'}</strong></td></tr>
                      <tr><td><message>Due By: {formatDate(obj?.deadline) || 'No date determined'}</message></td></tr>
                      <tr><td><message>Date Created: {formatDate(obj?.created_at) || 'No date generated'}</message></td></tr>
                    </table>
                    <br/>
                    <button className="btn btn-info" onClick={() => handleEditClick(obj.id)}><strong>Edit</strong></button>
                    <button className="btn btn-danger" onClick={() => handleDeleteObjective(obj.id)}><strong>Delete</strong></button>
                    <br/><br/>
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
