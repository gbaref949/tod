import { useReducer, useState, useEffect } from 'react';

const initialState = {
  ADD_TODO: 'add_todo',
  EDIT_TODO: 'edit_todo',
  DELETE_TODO: 'delete_todo',
  ADD_CATEGORY: 'add_category',
  EDIT_CATEGORY: 'edit_category',
  DELETE_CATEGORY: 'delete_category',
  SET_PRIORITY: 'set_priority',
  SET_DUE_DATE: 'set_due_date',
};

function reducer(state, action) {
  switch (action.type) {
    case initialState.ADD_TODO:
      return [...state, newTodo(action.payload)];

    case initialState.EDIT_TODO:
      return state.map((todo) =>
        todo.id === action.payload.id
          ? {
              ...todo,
              name: action.payload.name,
              description: action.payload.description,
              category: action.payload.category,
              priority: action.payload.priority,
              dueDate: action.payload.dueDate,
            }
          : todo
      );

    case initialState.DELETE_TODO:
      return state.filter((todo) => todo.id !== action.payload.id);

    case initialState.ADD_CATEGORY:
      return [...state, newCategory(action.payload)];

    case initialState.EDIT_CATEGORY:
      return state.map((category) =>
        category.id === action.payload.id
          ? { ...category, name: action.payload.name }
          : category
      );

    case initialState.DELETE_CATEGORY:
      return state.filter((category) => category.id !== action.payload.id);

    case initialState.SET_PRIORITY:
      return state.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, priority: action.payload.priority }
          : todo
      );

    case initialState.SET_DUE_DATE:
      return state.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, dueDate: action.payload.dueDate }
          : todo
      );

    case 'SET_FILTERED_TODOS':
      return action.payload;

    default:
      return state;
  }
}

function newTodo({ name, description, category, priority, dueDate }) {
  return {
    id: Date.now(),
    name,
    description,
    category,
    complete: false,
    priority,
    dueDate,
  };
}

function newCategory({ name }) {
  return { id: Date.now(), name };
}

function Todo({ todo, dispatch }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(todo.name);
  const [editedCategory, setEditedCategory] = useState(todo.category);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    dispatch({
      type: initialState.EDIT_TODO,
      payload: {
        id: todo.id,
        name: editedName,
        description: todo.description,
        category: editedCategory,
        priority: todo.priority,
        dueDate: todo.dueDate,
      },
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <div className='todo'>
      <div
        style={{ color: todo.complete ? '#00008B' : '#fff' }}
        className='todo__title'
      >
        {isEditing ? (
          <input
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
          />
        ) : (
          todo.name
        )}
      </div>
      <div className='todo__details'>
        <div>{`Description: ${todo.description}`}</div>
        <div>{`Category: ${
          isEditing ? (
            <input
              value={editedCategory}
              onChange={(e) => setEditedCategory(e.target.value)}
            />
          ) : (
            todo.category
          )
        }`}</div>
        <div>{`Priority: ${todo.priority || 'Not set'}`}</div>
        <div>{`Due Date: ${todo.dueDate || 'Not set'}`}</div>
      </div>
      <div className='todo__buttons'>
        {isEditing ? (
          <>
            <button className='todo__save' onClick={handleSaveEdit}>
              Save
            </button>
            <button className='todo__cancel' onClick={handleCancelEdit}>
              Cancel
            </button>
          </>
        ) : (
          <button className='todo__edit' onClick={handleEdit}>
            Edit
          </button>
        )}
        <button
          className='todo__delete'
          onClick={() =>
            dispatch({
              type: initialState.DELETE_TODO,
              payload: { id: todo.id },
            })
          }
        >
          Delete
        </button>
      </div>
    </div>
  );
}

const TODO = () => {
  const [todos, dispatch] = useReducer(reducer, [], () => {
    const storedTodos = localStorage.getItem('todos');
    return storedTodos ? JSON.parse(storedTodos) : [];
  });
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !category) {
      alert('Name and Category are required.');
      return;
    }

    dispatch({
      type: initialState.ADD_TODO,
      payload: { name, description, category, priority, dueDate },
    });

    setName('');
    setDescription('');
    setCategory('');
    setPriority('');
    setDueDate('');
  };

  const handleCategoryFilter = (selectedCategory) => {
    setSelectedCategory(selectedCategory);
  };

  const filteredTodos =
    selectedCategory === 'All'
      ? todos
      : todos.filter((todo) => todo.category === selectedCategory);

  // Sort tasks by due date
  const sortedTodos = filteredTodos.sort((a, b) => {
    if (!a.dueDate) return 1; // Tasks without due date are considered last
    if (!b.dueDate) return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  return (
    <div className='todos'>
      <div className='todos__content'>
        <h2>Todo Checklist</h2>
        <div className='todos__forms'>
          <form className='todos__form' onSubmit={handleSubmit}>
            <input
              className='todos__input'
              value={name}
              id='name'
              placeholder='Add todo'
              onChange={(e) => setName(e.target.value)}
              autoComplete='off'
            />
            <input
              className='todos__input'
              value={description}
              id='description'
              placeholder='Add description'
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              className='todos__input'
              value={category}
              id='category'
              placeholder='Add category'
              onChange={(e) => setCategory(e.target.value)}
            />
            <input
              className='todos__input'
              type='number'
              value={priority}
              id='priority'
              min='1'
              max='20'
              placeholder='Priority'
              onChange={(e) => setPriority(e.target.value)}
            />
            <input
              className='todos__input'
              type='date'
              value={dueDate}
              placeholder='Add due date'
              onChange={(e) => setDueDate(e.target.value)}
            />
            <button className='todos__add__btn' onClick={handleSubmit}>
              Create Task
            </button>
          </form>
        </div>
        <div className='todos__category-filter'>
          <span>Filter by Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryFilter(e.target.value)}
          >
            <option value='All'>All</option>
            {/* Add options for each unique category in your todos */}
            {Array.from(new Set(todos.map((todo) => todo.category))).map(
              (category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              )
            )}
          </select>
        </div>
        <div className='todos__todo'>
          {sortedTodos.map((todo) => {
            return <Todo key={todo.id} todo={todo} dispatch={dispatch} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default TODO;
