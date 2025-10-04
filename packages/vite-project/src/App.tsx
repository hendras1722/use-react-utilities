"use client"

import { useState } from "react"

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("hooks")

  const features = [
    {
      title: "Custom Hooks",
      description: "Reusable stateful logic for common React patterns",
      icon: "🎣",
    },
    {
      title: "Utility Components",
      description: "Drop-in components for conditional rendering and loops",
      icon: "🧩",
    },
    {
      title: "TypeScript Ready",
      description: "Fully typed for strong type safety and IntelliSense",
      icon: "📘",
    },
    {
      title: "Vue 3 Inspired",
      description: "Compositional ease inspired by Vue 3 Composition API",
      icon: "✨",
    },
  ]

  const hooks = [
    { name: "ref", desc: "Reactive state management" },
    { name: "useComputed", desc: "Memoized computed values" },
    { name: "useWatch", desc: "Automatic effect tracking" },
    { name: "useFormData", desc: "Simplified form handling" },
    { name: "useLifeCycle", desc: "Lifecycle hooks" },
    { name: "useHead", desc: "Document head management" },
  ]

  const components = [
    { name: "<If>", desc: "Conditional rendering" },
    { name: "<Each>", desc: "List iteration" },
    { name: "<KeepAlive>", desc: "Component state preservation" },
    { name: "<Teleport>", desc: "Portal rendering" },
    { name: "<Form>", desc: "Form validation" },
    { name: "<Template>", desc: "Slot-based composition" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-slate-900">
      {/* Header */}
      <header className="backdrop-blur-sm bg-white/70 border-b border-slate-200 sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">⚛</div>
              <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">use-react-utilities</span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm text-slate-600">
              <a href="#features" className="hover:text-blue-600 transition-colors font-medium">
                Features
              </a>
              <a href="#docs" className="hover:text-blue-600 transition-colors font-medium">
                Docs
              </a>
              <a href="#examples" className="hover:text-blue-600 transition-colors font-medium">
                Examples
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-sm text-slate-600 hover:text-blue-600 transition-colors font-medium">GitHub</button>
            <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 text-sm">
              Get Started
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12 py-16 md:py-24 lg:py-28">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-600 text-sm font-medium rounded-full mb-6 border border-blue-200/50 backdrop-blur-sm">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            Vue 3-inspired React utilities
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent leading-tight px-4">
            React Composable Utilities
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 mb-8 md:mb-10 leading-relaxed font-light px-4 max-w-3xl mx-auto">
            A collection of custom React Hooks and utility Components designed to accelerate and simplify your React
            application development
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-8 md:mb-10 px-4">
            <button className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 text-base md:text-lg hover:scale-105">
              Get Started →
            </button>
            <button className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-white/80 backdrop-blur-sm text-slate-700 rounded-xl font-semibold hover:bg-white transition-all duration-300 text-base md:text-lg border border-slate-200 hover:border-blue-300 hover:shadow-lg">
              View Documentation
            </button>
          </div>
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 md:px-6 py-3 md:py-3.5 rounded-xl border border-slate-200 shadow-lg mx-4 max-w-full overflow-x-auto">
            <span className="text-slate-500 text-xs md:text-sm font-medium flex-shrink-0">$</span>
            <code className="text-xs md:text-sm font-mono text-slate-700 whitespace-nowrap">npm install use-react-utilities</code>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4 md:px-6 py-20">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-4 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Key Features</h2>
        <p className="text-center text-slate-600 mb-16 text-lg">Everything you need to build modern React applications</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group p-8 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-2 hover:border-blue-300"
            >
              <div className="text-5xl mb-5 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">{feature.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* API Overview */}
      <section id="docs" className="max-w-7xl mx-auto px-4 md:px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Everything you need to build great products</h2>
          <p className="text-slate-600 text-lg">
            Comprehensive hooks and components for modern React development
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveTab("hooks")}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${activeTab === "hooks"
              ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50"
              : "bg-white/80 backdrop-blur-sm text-slate-700 border border-slate-200 hover:border-blue-300 hover:shadow-lg"
              }`}
          >
            Hooks
          </button>
          <button
            onClick={() => setActiveTab("components")}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${activeTab === "components"
              ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50"
              : "bg-white/80 backdrop-blur-sm text-slate-700 border border-slate-200 hover:border-blue-300 hover:shadow-lg"
              }`}
          >
            Components
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(activeTab === "hooks" ? hooks : components).map((item, idx) => (
            <div
              key={idx}
              className="group p-6 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:border-blue-300"
            >
              <code className="text-blue-600 font-bold text-base group-hover:text-cyan-600 transition-colors">{item.name}</code>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Code Example */}
      <section id="examples" className="max-w-7xl mx-auto px-4 md:px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Simple, intuitive API</h2>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              Write cleaner, more maintainable React code with Vue 3-inspired compositional patterns. Our utilities make
              complex state management and component composition feel natural.
            </p>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-bold mb-1.5 text-slate-900">Reactive State</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Use <code className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded font-mono text-xs">ref</code> for simple, reactive state management
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-bold mb-1.5 text-slate-900">Computed Values</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Automatic memoization with <code className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded font-mono text-xs">useComputed</code>
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-bold mb-1.5 text-slate-900">Declarative Components</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Clean JSX with <code className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded font-mono text-xs">&lt;If&gt;</code> and <code className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded font-mono text-xs">&lt;Each&gt;</code>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/10">
            <div className="bg-gradient-to-r from-slate-100 to-slate-50 px-5 py-3 border-b border-slate-200 flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-slate-600 text-sm font-mono ml-2">counter.tsx</span>
            </div>
            <pre className="p-6 text-sm overflow-x-auto">
              <code className="text-slate-800 font-mono">{`import { ref, useComputed } from 'use-react-utilities'

export default function Counter() {
  const count = ref(0)
  
  // Automatically updates when count changes
  const double = useComputed(() => count.value * 2)

  return (
    <div>
      <p>Count: {count.value}</p>
      <p>Double: {double.value}</p>
      <button onClick={() => count.value += 1}>
        Increment
      </button>
    </div>
  )
}`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Form Validation Example */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/10 order-2 lg:order-1">
            <div className="bg-gradient-to-r from-slate-100 to-slate-50 px-5 py-3 border-b border-slate-200 flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-slate-600 text-sm font-mono ml-2">login-form.tsx</span>
            </div>
            <pre className="p-6 text-sm overflow-x-auto">
              <code className="text-slate-800 font-mono">{`import { ref, Form, FormField } from 'use-react-utilities'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export default function LoginForm() {
  const formState = ref({
    email: '',
    password: ''
  })

  return (
    <Form 
      state={formState.value}
      schema={schema}
      onSubmit={(e) => console.log(e.data)}
    >
      <FormField label="Email" name="email">
        {({ onChange }) => (
          <input
            type="email"
            value={formState.value.email}
            onChange={(e) => {
              formState.value.email = e.target.value
              onChange()
            }}
          />
        )}
      </FormField>
      <button type="submit">Login</button>
    </Form>
  )
}`}</code>
            </pre>
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Built-in form validation</h2>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              Powerful form handling with Zod and Yup integration. Get type-safe validation with minimal boilerplate.
            </p>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-bold mb-1.5 text-slate-900">Schema Validation</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Support for Zod and Yup schemas</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-bold mb-1.5 text-slate-900">Field-level Validation</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Validate individual fields on change or blur</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-bold mb-1.5 text-slate-900">Type Safety</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Full TypeScript inference from your schemas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-24">
        <div className="relative bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 rounded-3xl p-12 md:p-16 text-center overflow-hidden shadow-2xl shadow-blue-500/50">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 text-white">Start building today</h2>
            <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Install use-react-utilities and experience the compositional ease of Vue 3 in your React applications
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:shadow-2xl transition-all duration-300 text-lg hover:scale-105">
                Get Started →
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-blue-700/50 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-blue-700 transition-all duration-300 text-lg border-2 border-white/30">
                View on GitHub
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">⚛</div>
                <span className="font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">use-react-utilities</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Vue 3-inspired compositional utilities for React
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-slate-900">Documentation</h3>
              <ul className="space-y-2.5 text-sm text-slate-600">
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Getting Started
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Examples
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-slate-900">Community</h3>
              <ul className="space-y-2.5 text-sm text-slate-600">
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Discord
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-slate-900">Resources</h3>
              <ul className="space-y-2.5 text-sm text-slate-600">
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Contributing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    License
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Changelog
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-8 text-center text-sm text-slate-600">
            <p>© 2025 use-react-utilities. Licensed under ISC.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}