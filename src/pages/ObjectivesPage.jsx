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
import RatingSystem from '../components/RatingSystem';
// import { groupByCategory, groupByDate } from '../utils/objectiveHelpers';

function ObjectivesPage() {
  const [objectives, setObjectives] = useState([]); // State to hold the list of objectives
  
  const [newCategory, setNewCategory] = useState('Work'); // Default to "Work"
  const [editCategory, setEditCategory] = useState(''); // State for editing category
  const [newTitle, setNewTitle] = useState(''); // State for creating a new objective
  const [newDescription, setNewDescription] = useState('');
  const [editingId, setEditingId] = useState(null); // Tracks the ID of the objective being edited
  const [editTitle, setEditTitle] = useState(''); // State for the title of the objective being edited
  const [editDescription, setEditDescription] = useState(''); // State for the description of the objective being edited
  const [newDeadline, setNewDeadline] = useState(''); // State for the new objective deadline
  const [editDeadline, setEditDeadline] = useState(''); // State for editing an objective's deadline
  const [groupBy, setGroupBy] = useState('category'); // Default to category grouping

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

  // group objectives by category
  const groupByCategory = (objectives) => {
    return objectives.reduce((groups, objective) => {
      const category = objective.category || 'Uncategorized';
      if (!groups[category]) groups[category] = [];
      groups[category].push(objective);
      return groups;
    }, {});
  };

  // group objectives by date
  const groupByDate = (objectives, dateField) => {
    // Filter out objectives without a valid date and sort by the specified date field
    const sortedObjectives = objectives
    .filter((obj) => obj[dateField]) // Ensure valid dates exist
    .sort((a, b) => new Date(a[dateField]) - new Date(b[dateField])); // Sort ascending

    return sortedObjectives.reduce((groups, objective) => {
      const date = objective[dateField]
        ? formatDate(objective[dateField]) // Format as "Month, Day, Year"
        : 'No Date';

      if (!groups[date]) groups[date] = [];
      groups[date].push(objective);

      return groups;
    }, {});
  };


  // Handle creating a new objective
  const handleCreateObjective = async (e) => {
    e.preventDefault(); // Prevent the page from refreshing
    // alert('Objective created successfully!'); // Alert the user
    
    if (!user) {
      setError(`You must be logged in to create an objective.`);
      return;
    }

    if (!newTitle.trim() || !newDescription.trim() || !newDeadline || !newCategory) {
      setError('All fields are required!');
      return;
    }

    try {
      // console.log('Creating objective:', { newTitle, newDescription, newDeadline, newCategory });
      
      // console.log({
      //   title: newTitle,
      //   description: newDescription,
      //   deadline: newDeadline,
      //   category: newCategory,
      // }); // Log the data being sent to the server

      const newObjective = await createObjective(
        newTitle.trim(),
        newDescription.trim(),
        newDeadline,
        newCategory,
      );
  
      console.log('Objective created:', newObjective, 'handleCreateObjective'); // Debug log
  
      // Update state
      setObjectives((prev) => [...prev, newObjective]);
  
      // Reset form fields
      setNewTitle('');
      setNewDescription('');
      setNewDeadline('');
      setNewCategory('Work');
      setSuccess(true);
    } catch (error) {
      console.error('Error creating objective:', error);
      setError('Failed to create objective. Please try again.');
    }
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
    setEditDeadline(objectiveToEdit.deadline || ''); // Set deadline for editing
    setEditCategory(objectiveToEdit.category || 'Work'); // Default to "Work"
  };

  // Handle saving the edited objective
  const handleSaveEdit = async () => {
    if (!editTitle.trim() || !editDescription.trim() || !editDeadline || !editCategory) {
      alert('All fields are required!');
      return;
    }
    try{
      const updatedObjective = await updateObjective(editingId, {
        title: editTitle,
        description: editDescription,
        deadline: editDeadline, // Include the deadline in the update
        category: editCategory, // Include the category in the update
      });

      setObjectives((prev) =>
        prev.map((obj) => (obj.id === editingId ? updatedObjective : obj))
      );
  
      // Reset editing state
      setEditingId(null); // Exit edit mode
      setEditTitle('');
      setEditDescription('');
      setEditDeadline(''); // Reset deadline
      setEditCategory('');
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
    const confirmDelete = window.confirm("Are you sure you want to delete this objective?");
    if (!confirmDelete) return; // exit if user cancels the action

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

  const groupedObjectives =
    groupBy === 'category'
      ? groupByCategory(objectives)
      : groupByDate(objectives, 'deadline');
  
  console.log('Grouped Objectives:', groupedObjectives); // Debug log

  return (
    <div className="objectives-page">
      {/* Left Column: Input Form and Objectives List */}
      <div className="left-column">
        {/* Objective Input Form */}
        <div className="objectives-list">
          <br/>
        {/* Objective Input Form */}  
        <div className="objective-input-form">
          {/* Header Section */}
          <h1>List Your Goals and Objectives</h1>
            <div>
              • Start by addressing the Title.<br/>
              • Then, fill out a short description of the task at hand.<br/>
              • Include a deadline and select a category: {' '}
              <em><strong>Work, Social,</strong> or <strong>Personal</strong></em>
            </div>
          <br/>
          <h2>Add a New Objective</h2>
          <form onSubmit={handleCreateObjective}>
            {/* Title Field */}
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                placeholder="Enter the title (e.g., Work Task)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className={newTitle.trim() ? '' : 'input-error'}
              />
              {!newTitle.trim() && <p className="error-message">Title is required.</p>}
            </div>

          {/* Description Field */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Describe the task..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              rows="4"
              required
            ></textarea>
          </div>

          {/* Deadline Field */}
          <div className="form-group">
            <label htmlFor="deadline">Deadline</label>
            <input
              type="date"
              id="deadline"
              value={newDeadline}
              onChange={(e) => setNewDeadline(e.target.value)}
              required
            />
          </div>

        {/* Category Field */}
          <div className="form-group">
            <label>Category</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="category"
                    value="Work"
                    checked={newCategory === 'Work'}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                  Work
                </label>
                <label>
                  <input
                    type="radio"
                    name="category"
                    value="Social"
                    checked={newCategory === 'Social'}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                  Social
                </label>
                <label>
                  <input
                    type="radio"
                    name="category"
                    value="Personal"
                    checked={newCategory === 'Personal'}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                  Personal
                </label>
              </div>
            </div>

              {/* Action Buttons */}
              <div className="form-actions">
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>Objective created successfully!</p>}
                <button type="submit" className="btn btn-primary">Save Objective</button>
                <button type="button" className="btn btn-warning" onClick={() => {
                    setNewTitle('');
                    setNewDescription('');
                    setNewDeadline('');
                    setNewCategory('Work');
                  }}>
                    Clear Form
                </button>

              </div>
            </form>
          </div>

      {/* List of All Editable Objectives */}
    <div className="objectives-list">
      {loading ? (
          <p>Loading objectives...</p> // Render while fetching data
        ) : (
        <div className="objectives-list">
          {objectives.length === 0 ? (
            <p>No objectives found. Create one to get started!</p>
          ) : (
          <div className="objectives-grid">
            {objectives.map((obj, index) => (
                <div key={obj?.id || index} className="objective-card">
                  {/* Editing Mode */}
                  {editingId === obj.id ? (
                    <>
                    <div>
                      <h3>Category</h3>
                      <label>
                        <input
                          type="radio"
                          name="edit-category"
                          value="Work"
                          checked={editCategory === 'Work'}
                          onChange={(e) => setEditCategory(e.target.value)}
                        />
                        Work
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="edit-category"
                          value="Social"
                          checked={editCategory === 'Social'}
                          onChange={(e) => setEditCategory(e.target.value)}
                        />
                        Social
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="edit-category"
                          value="Personal"
                          checked={editCategory === 'Personal'}
                          onChange={(e) => setEditCategory(e.target.value)}
                        />
                        Personal
                      </label>
                    </div>

                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                      />
                      <input
                        type="date"
                        value={editDeadline}
                        onChange={(e) => setEditDeadline(e.target.value)}
                      />
                      <br/>
                      <button className="btn btn-dark" onClick={() => handleSaveEdit(obj.id)}><strong>Save</strong></button>
                      <button className="btn btn-danger" onClick={() => handleCancelEdit(null)}><strong>Cancel</strong></button>
                      <br/><br/>
                    </>
                  ) : (
                    <>
                    {/* Display Mode */}
                      <div>
                        <table>
                          <th><strong>•</strong> {obj?.title || 'Untitled'}</th>
                          <tbody>
                          <tr><td><strong>•</strong> {obj?.description || 'No description entered'}</td></tr>
                          <tr><td><message><strong>Due By:</strong> {formatDate(obj?.deadline) || 'No date determined'}</message></td></tr>
                          <tr><td><strong>Category:</strong> {obj?.category || 'No category saved'}</td></tr>
                          <tr><td><message><strong>Date Created:</strong> {formatDate(obj?.created_at) || 'No date generated'}</message></td></tr>
                          </tbody>
                        </table>
                        <br/>
                        <button className="btn btn-info" onClick={() => handleEditClick(obj.id)}><i className="fas fa-edit"></i><strong> Edit</strong></button>
                        <button className="btn btn-danger" onClick={() => handleDeleteObjective(obj.id)}><i className="fas fa-trash"></i><strong> Delete</strong></button>
                        <br/>
                        <br/>
                      </div>
                    </>
                  )}
                </div>
              ))}
          </div>
        )} 
        </div>
      )}
    </div>  

      </div>
      </div>

      {/* Right Column: Group By */}
      <div className="right-column">
        <h3>Filters</h3>
        {/* GroupedBy Filter Dropdown */}
        <div className="filters">
          <label>Group By:</label>
          <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
            <option value="category">Category</option>
            <option value="deadline">Deadline</option>
          </select>
        </div>

        {/* Grouped Objectives */}
      <div className="grouped-objectives">
        <h1>Objectives</h1>
        {groupedObjectives && Object.entries(groupedObjectives).length > 0 ? (
          Object.entries(groupedObjectives).map(([group, groupObjectives]) => (
            <section key={group} className="objective-group">
              <h2>{group}</h2>
              <div className="objectives-grid">
              <ul>
                {groupObjectives.map((objective) => (
                  <li key={objective.id} className="objective-card">
                    <strong>Title:</strong> {objective.title || 'Untitled'}
                    <br />
                    <strong>Description:</strong> {objective.description || 'No description'}
                    <br />
                    <strong>Due By:</strong> {formatDate(objective.deadline) || 'No date provided'}
                    <br />
                    <strong>Category:</strong> {objective.category || 'Uncategorized'}
                    <br />
                  </li>
                ))}
              </ul>
            </div>
            </section>
          ))
        ) : (
          <p>No grouped objectives available.</p>
        )}

        
      </div>
        <div className="cta-section">
            <RatingSystem /><br/>
            <h4>Send us your feedback!</h4><br/>
            <p>© Bold Motive Group LLC. All rights reserved.</p>
        </div>
      
      </div>
    </div>
    
  );
}

export default ObjectivesPage;
