import { useReducer, useState, useEffect } from 'react';

const initialState = {
  tasks: [],
  categories: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TASK':
      const newTasks = [...state.tasks, action.payload];
      localStorage.setItem('tasks', JSON.stringify(newTasks));
      return { ...state, tasks: newTasks };

    case 'REMOVE_TASK':
      const updatedTasks = state.tasks.filter(
        (task) => task.id !== action.payload
      );
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      return { ...state, tasks: updatedTasks };

    case 'UPDATE_TASK':
      const updatedTask = state.tasks.map((task) =>
        task.id === action.payload.id
          ? { ...task, ...action.payload.updatedTask }
          : task
      );
      localStorage.setItem('tasks', JSON.stringify(updatedTask));
      return { ...state, tasks: updatedTask };

    case 'ADD_CATEGORY':
      const newCategories = [...state.categories, action.payload];
      localStorage.setItem('categories', JSON.stringify(newCategories));
      return { ...state, categories: newCategories };

    case 'REMOVE_CATEGORY':
      const updatedCategories = state.categories.filter(
        (category) => category.id !== action.payload
      );
      localStorage.setItem('categories', JSON.stringify(updatedCategories));
      return { ...state, categories: updatedCategories };

    case 'UPDATE_CATEGORY':
      const updatedCategorie = state.categories.map((category) =>
        category.id === action.payload.id
          ? { ...category, ...action.payload.updatedCategory }
          : category
      );
      localStorage.setItem('categories', JSON.stringify(updatedCategorie));
      return { ...state, categories: updatedCategorie };

    default:
      return state;
  }
};

const TODO = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [newTask, setNewTask] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [updatedTaskInput, setUpdatedTaskInput] = useState('');

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const storedCategories =
      JSON.parse(localStorage.getItem('categories')) || [];

    dispatch({
      type: 'SET_INITIAL_STATE',
      payload: { tasks: storedTasks, categories: storedCategories },
    });
  }, []);

  const handleAddTask = () => {
    if (newTask.trim() === '') {
      alert('Task name cannot be empty');
      return;
    }

    const newTaskObj = {
      id: Date.now(),
      name: newTask,
      category: selectedCategory,
    };
    dispatch({ type: 'ADD_TASK', payload: newTaskObj });
    setNewTask('');
  };

  const handleRemoveTask = (taskId) => {
    dispatch({ type: 'REMOVE_TASK', payload: taskId });
  };

  const handleUpdateTask = (taskId, updatedTask) => {
    dispatch({ type: 'UPDATE_TASK', payload: { id: taskId, updatedTask } });
  };

  const handleAddCategory = () => {
    if (newCategory.trim() === '') {
      alert('Category name cannot be empty');
      return;
    }

    const newCategoryObj = { id: Date.now(), name: newCategory };
    dispatch({ type: 'ADD_CATEGORY', payload: newCategoryObj });
    setNewCategory('');
    setSelectedCategory(newCategory);
  };

  const handleRemoveCategory = (categoryId) => {
    dispatch({ type: 'REMOVE_CATEGORY', payload: categoryId });
  };

  return (
    <div>
      <div>
        <h2>Task List</h2>
        <div>
          <select onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value='All'>All</option>
            {state.categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        {state.tasks
          .filter(
            (task) =>
              selectedCategory === 'All' || task.category === selectedCategory
          )
          .map((task) => (
            <div key={task.id}>
              <span>{task.name}</span>
              <input
                type='text'
                placeholder='Update Task'
                value={updatedTaskInput}
                onChange={(e) => setUpdatedTaskInput(e.target.value)}
              />
              <button
                onClick={() =>
                  handleUpdateTask(task.id, { name: updatedTaskInput })
                }
              >
                Update Task
              </button>
              <button onClick={() => handleRemoveTask(task.id)}>Remove</button>
            </div>
          ))}
      </div>

      <div>
        <h2>Category Management</h2>
        {state.categories.map((category) => (
          <div key={category.id}>
            <span>{category.name}</span>
            <button onClick={() => handleRemoveCategory(category.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <div>
        <h2>Add Task</h2>
        <input
          type='text'
          placeholder='Task Name'
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>

      <div>
        <h2>Add Category</h2>
        <input
          type='text'
          placeholder='Category Name'
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button onClick={handleAddCategory}>Add Category</button>
      </div>
    </div>
  );
};

export default TODO;