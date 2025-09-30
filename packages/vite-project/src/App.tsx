import { useState, useEffect } from "react";
import { KeepAlive, } from 'use-react-utilities'

// Demo Components
const Counter: React.FC<{ name: string }> = ({ name }) => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    console.log(`${name} mounted`);
    return () => console.log(`${name} unmounted`);
  }, [name]);

  return (
    <div className="p-6 bg-blue-50 rounded-lg">
      <h2 className="text-xl font-bold mb-4">{name}</h2>
      <p className="text-3xl font-bold mb-4">{count}</p>
      <button
        onClick={() => setCount(count + 1)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Increment
      </button>
    </div>
  );
};

const InputField: React.FC<{ name: string }> = ({ name }) => {
  const [text, setText] = useState<string>('');

  useEffect(() => {
    console.log(`${name} mounted`);
    return () => console.log(`${name} unmounted`);
  }, [name]);

  return (
    <div className="p-6 bg-green-50 rounded-lg">
      <h2 className="text-xl font-bold mb-4">{name}</h2>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type something..."
        className="w-full px-4 py-2 border rounded"
      />
      <p className="mt-2 text-gray-600">Value: {text}</p>
    </div>
  );
};

interface Todo {
  id: number;
  text: string;
}

const Todo: React.FC<{ name: string }> = ({ name }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState<string>('');

  useEffect(() => {
    console.log(`${name} mounted`);
    return () => console.log(`${name} unmounted`);
  }, [name]);

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input }]);
      setInput('');
    }
  };

  return (
    <div className="p-6 bg-purple-50 rounded-lg">
      <h2 className="text-xl font-bold mb-4">{name}</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add todo..."
          className="flex-1 px-4 py-2 border rounded"
        />
        <button
          onClick={addTodo}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Add
        </button>
      </div>
      <div className="space-y-2">
        {todos.map((todo) => (
          <div key={todo.id} className="p-2 bg-white rounded">
            {todo.text}
          </div>
        ))}
      </div>
    </div>
  );
};

// Demo App
export default function App() {
  const [currentView, setCurrentView] = useState('counter');

  const getComponent = () => {
    switch (currentView) {
      case 'counter':
        return <Counter name="Counter Component" />;
      case 'input':
        return <InputField name="Input Component" />;
      case 'todo':
        return <Todo name="Todo Component" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          React KeepAlive Demo
        </h1>

        <div className="flex gap-4 mb-8 justify-center">
          <button
            onClick={() => setCurrentView('counter')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${currentView === 'counter'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
          >
            Counter
          </button>
          <button
            onClick={() => setCurrentView('input')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${currentView === 'input'
              ? 'bg-green-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
          >
            Input
          </button>
          <button
            onClick={() => setCurrentView('todo')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${currentView === 'todo'
              ? 'bg-purple-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
          >
            Todo
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <KeepAlive name={currentView} max={5}>
            {getComponent()}
          </KeepAlive>
        </div>
      </div>
    </div>
  );
}