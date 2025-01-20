# @msa_cli/react-composable

A powerful and easy-to-use package providing composable utilities for React projects. This library is designed to simplify and enhance your React development workflow, and it is fully compatible with the latest versions of React and Next.js.

---

## Installation

To install the package, use the following command:

```bash
npm install @msa_cli/react-composable
```

Or, if you prefer Yarn:

```bash
yarn add @msa_cli/react-composable
```

---

## Overview

The `@msa_cli/react-composable` package offers a set of **helpful functions** designed to streamline your project needs. These functions follow composable patterns, enabling flexibility and reusability throughout your application. Whether you're working on a standard React project or leveraging the latest version of Next.js, this library is built to integrate seamlessly.

### Key Features

- **Composable Utilities**: Ready-to-use functions that follow React’s compositional paradigm.
- **Project Agnostic**: Works well in both React and Next.js environments.
- **Simple API**: Easy-to-understand and implement functions.
- **Documentation**: Comprehensive documentation available at [React Composable Documentation](https://react-composable.vercel.app/).

---

## Usage

Import the functions you need and use them directly in your components:

### Example:

```tsx
'use client'

import { Input } from '@/components/ui/input'
import { useDebounce } from '@msa_cli/react-composable'

export default function Debounce() {
  const [value, debouncedValue, setValue] = useDebounce('', 1000)

  return (
    <div className="flex flex-col gap-4">
      <Input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="border p-2 rounded"
        placeholder="Type something..."
      />
      <div className="flex flex-col gap-2">
        <div>Current value: {value}</div>
        <div>Debounced value: {debouncedValue}</div>
      </div>
      <div className="mt-5">How to use:</div>
    </div>
  )
}
```

Refer to the [documentation](https://react-composable.vercel.app/) for detailed examples and API references.

---

## Compatibility

This package supports:

- **React 17+**
- **Next.js 13+** (including the latest app router features)

It’s tested to ensure optimal performance and compatibility with modern React features such as hooks and server components.

---

## Documentation

Visit the [official documentation](https://react-composable.vercel.app/) for a complete guide to all available composables, detailed usage examples, and troubleshooting tips.

---

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests to improve the package. Check the [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
