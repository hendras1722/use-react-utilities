# React Composable Utilities

A collection of custom React Hooks and utility Components designed to accelerate and simplify your React application development, inspired by the compositional ease of Vue 3.

## Key Features

- **Custom Hooks**: A set of reusable hooks for common stateful logic.
- **Utility Components**: Drop-in components for conditional rendering, loops, and more.
- **TypeScript Ready**: Fully written in TypeScript for strong type safety.

## Installation

Use npm or your favorite package manager to install.

```bash
npm install use-react-utilities
```

## Usage

Here is how to import and use the hooks and components from this library.

---

### `useColorName`

Fetches the name of a color from its hex value. This is useful for color tools, design systems, or any feature that needs to display a human-readable color name.

```tsx
import { colorFromName, ref } from 'use-react-utilities';

export default function ColorPicker() {
  const color = ref('#FFF')
  const colorName = colorFromName(color.value);

  return (
    <div>
      <input
        type="color"
        value={color.value}
        onChange={(e) => color.value = e.target.value}
      />
      <p>Color Name: {colorName || 'Loading...'}</p>
    </div>
  );
}
```

---

### `useComputed`

Creates a memoized value that only recalculates when its dependencies change. It's perfect for optimizing expensive calculations.

```tsx
import { useComputed, ref } from 'use-react-utilities';

export default function Counter() {
  const count = ref(0)

  // The `double` value is automatically updated when `count` changes
  const double = useComputed(() => count.value * 2);

  return (
    <div>
      <p>Count: {count.value}</p>
      <p>Double: {double.value}</p>
      <button onClick={() => count.value += 1}>Increment</button>
    </div>
  );
}
```

---

### `useDuplicate`

Creates and renders a specified number of component instances. This is useful for storyboarding, testing, or decorative UI elements.

```tsx
import React from 'react';
import { deleteDuplicate } from 'use-react-utilities';

const users: User[] = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 1, name: "Alice" }, // duplicate
  { id: 3, name: "Charlie" },
  { id: 2, name: "Bob" } // duplicate
]

const uniqueUsers = deleteDuplicate(users)
console.log(uniqueUsers)
```

---

### `useFormData`

Manages form state efficiently. It simplifies handling input changes and form submissions.

```tsx
import React from 'react';
import { useFormData, ref } from 'use-react-utilities';

function LoginForm() {
  const data = ref({
    email: '',
    password: ''
  })

  const submitLogin = () => {
    alert(`Logging in with: ${JSON.stringify(data)}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        name="email"
        value={data.value.email}
        onChange={(e) => data.value.email = e.target.value}
        placeholder="Email"
      />
      <input 
        type="password" 
        name="password"
        value={data.value.password}
        onChange={(e) => data.value.password = e.target.value}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

---

### `useLifeCycle`

Provides `onMounted` and `onUnmounted` lifecycle hooks, similar to Vue's `onMounted` and `onUnmounted`.

```tsx
import React from 'react';
import { onMounted, onUnmounted, onUpdated, onBeforeUpdate, onBeforeUnmount, onBeforeMount } from 'use-react-utilities';

function MyComponent() {
  onMounted() {
    console.log('Component has been mounted!');
  }
  onUnmounted(){
    console.log('Component will be unmounted!');
  }
  onUpdated(){
    console.log('Component will be updated')
  }
  onBeforeUpdate(){
    console.log('Component will be before updated')
  }
  onBeforeUnmount(){
    alert('Component will be before unmound')
  }
  onBeforeMount(){
    console.log('component wil be before mound')
  }

  return <p>My Component is here.</p>;
}
```

---

### `ref`

A custom `ref` hook that may include additional functionality for handling refs in a more declarative way.

```tsx
import React from 'react';
import { ref } from 'use-react-utilities';

function FocusInput() {
  const search = ref(0);

  return (
    <div>
      <input onChange={(e) => search.value = e.target.value} type="text" placeholder="Focus me"} />
    </div>
  );
}
```

---

### `useWatchEffect`

Runs an effect immediately and automatically re-runs it whenever any of its dependencies change. Unlike `useEffect`, you don't need to specify a dependency array.

```tsx
import { useWatch, ref } from 'use-react-utilities';

function Watcher() {
   const search = ref(0);

  useWatch(search.value, (newValue, oldValue) => {
    console.log(`The current count is: ${newValue, oldValue}`);
  });

  return (
    <div>
      <p>Check the console.</p>
      <button onClick={() => search.value += 1}>Increment: {count}</button>
    </div>
  );
}
```

---

### `<If>` Component

Use the `<If>` component for clean, declarative conditional rendering instead of ternary operators.

```tsx
import React from 'react';
import { ConditionalGroup, If, ElseIf, Else } from 'use-react-utilities/components';

const UserGreeting = ({ user }) => {
  return (
  <ConditionalGroup>
    <If condition={count % 2 === 0}>Hello</If>
    <ElseIf condition={count % 2 === 1}>World</ElseIf>
    <Else>No Something</Else>
  </ConditionalGroup>
  );
};
```

---

### `<Each>` Component

Use the `<Each>` component to iterate over an array without using `.map()` inside your tsx, making your component cleaner.

```tsx
import React from 'react';
import { Each } from 'use-react-utilities/components';

const PostList = ({ posts }) => {
  return (
    <ul>
      <Each
        of={posts}
        render={(post, index) => (
          <li key={post.id}>
            {index + 1}. {post.title}
          </li>
        )}
      />
    </ul>
  );
};
```

---

### `<Slot>` and `<Component>`

Use `<Component>` to create dynamic, polymorphic components and `<Slot>` to create flexible component layouts that can be filled by parent components.

```tsx
import type { ReactNode } from 'react'
import { Template, useSlots } from 'use-react-utilities'

interface Product {
  id: number
  name: string
  price: number
  stock: number
}

interface ProductCardProps {
  product: Product
  children: ReactNode
}

interface SlotProps {
  product: Product;
  AddToCart: () => void

}
function ProductCard({ product, children }: Readonly<ProductCardProps>) {
  const { slots, scopedSlots } = useSlots<Product>(children)

  function AddToCart() {
    alert('test add to cart')
  }

  const slotProps = {
    AddToCart
  } as SlotProps;

  const combinedProps: Product & SlotProps = {
    ...product,
    ...slotProps,
  };

  return (
    <div className="border rounded-lg shadow-md overflow-hidden bg-white">
      {slots.header && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
          {slots.header}
        </div>
      )}

      <div className="p-4">
        {scopedSlots.body ? scopedSlots.body(product) : (
          <div>
            <h3 className="font-bold text-lg">{product.name}</h3>
            <p className="text-gray-600">Rp {product.price.toLocaleString('id-ID')}</p>
          </div>
        )}
      </div>

      <div className="bg-gray-50 p-4 border-t">
        {scopedSlots.footer ? scopedSlots.footer(combinedProps) : slots.footer}
      </div>
    </div>
  )
}

export default function App() {
  const product: Product = {
    id: 1,
    name: "Laptop Gaming",
    price: 15000000,
    stock: 5
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <ProductCard product={product}>
          <Template name="header">
            🔥 New Product
          </Template>
          <Template name="body">
            {(prod: Product) => (
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-800">{prod.name}</h3>
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-blue-600">
                    Rp {prod.price.toLocaleString('id-ID')}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm ${prod.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {prod.stock > 0 ? `Stok: ${prod.stock}` : 'Habis'}
                  </span>
                </div>
                <p className="text-gray-600">
                  Computer gaming
                </p>
              </div>
            )}
          </Template>
          <Template name="footer">
            {
              (props: SlotProps) => (
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                  onClick={props.AddToCart}
                >
                  Add to Cart
                </button>
              )
            }
          </Template>
        </ProductCard>
      </div>
    </div>
  )
}
```

---

### `IsComponents`

Creates dynamic components 
```tsx
import { useState, useEffect } from "react"; 
import { useComputed, ref } from 'use-react-utilities';

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

export default function Counter() {
  return (
    <IsComponent is={Counter} name="This Name Props Name" />

    <IsComponent is="a" href="https://google.com" target="_blank">
       Open Google
    </IsComponent>

    <IsComponent is="h1" className="text-2xl font-bold">
      Title
    </IsComponent>

    <IsComponent is="div" style={{ padding: '20px', background: '#f0f0f0' }}>
      Content div
    </IsComponent>
  );
}
```


---

### `KeepAlive`

Creating active components and not removing values
```tsx
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
```

## Contributing

If you would like to contribute, please feel free to open an issue or a pull request.

## License

[ISC](https://opensource.org/licenses/ISC)
