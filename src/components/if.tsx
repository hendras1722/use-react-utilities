"use client"
import React, { type ReactNode, createContext, useContext, useMemo, Children, isValidElement, cloneElement } from "react";

// Context untuk melacak state conditional chain
interface ConditionalContextType {
  matchedIndex: number
}

const ConditionalContext = createContext<ConditionalContextType | null>(null)

// Types untuk conditional rendering
interface IfProps {
  condition: boolean
  children: ReactNode
}

interface ElseIfProps {
  condition: boolean
  children: ReactNode
}

interface ElseProps {
  children: ReactNode
}

export function ConditionalGroup({ children }: { children: ReactNode }) {
  // Hitung index mana yang harus dirender berdasarkan kondisi
  const matchedIndex = useMemo(() => {
    const childArray = Children.toArray(children)

    for (let i = 0; i < childArray.length; i++) {
      const child = childArray[i]
      if (isValidElement(child)) {
        // Check If component
        if (((child.type as any)?.name === 'If' || child.type === If) && typeof (child.props as Record<string, unknown>) === 'object' && (child.props as Record<string, unknown>) !== null) {
          if ((child.props as any).condition === true) {
            return i
          }
        }
        // Check ElseIf component
        else if (((child.type as { name: string })?.name === 'ElseIf' || child.type === ElseIf) && typeof (child.props as Record<string, unknown>) === 'object' && (child.props as Record<string, unknown>) !== null) {
          if ((child.props as { condition: boolean }).condition === true) {
            return i
          }
        }
        // Check Else component - selalu match jika belum ada yang match
        else if ((child.type as { name: string })?.name === 'Else' || child.type === Else) {
          return i
        }
      }
    }
    return -1 // Tidak ada yang match
  }, [children])

  return (
    <ConditionalContext.Provider value={{ matchedIndex }}>
      {Children.map(children, (child, index) => {
        if (isValidElement(child)) {
          return cloneElement(child as React.ReactElement<any>, { ...(child.props || {}), _index: index });
        }
        return child
      })}
    </ConditionalContext.Provider>
  )
}

export function If({ condition, children, _index }: IfProps & { _index?: number }) {
  const context = useContext(ConditionalContext)

  if (!context) {
    // Fallback jika digunakan tanpa ConditionalGroup
    return condition ? <>{children}</> : null
  }

  // Render hanya jika ini adalah komponen pertama yang match
  return context.matchedIndex === _index ? <>{children}</> : null
}

export function ElseIf({ condition, children, _index }: ElseIfProps & { _index?: number }) {
  const context = useContext(ConditionalContext)

  if (!context) {
    // Fallback jika digunakan tanpa ConditionalGroup
    return condition ? <>{children}</> : null
  }

  // Render hanya jika ini adalah komponen pertama yang match
  return context.matchedIndex === _index ? <>{children}</> : null
}

export function Else({ children, _index }: ElseProps & { _index?: number }) {
  const context = useContext(ConditionalContext)

  if (!context) {
    // Fallback jika digunakan tanpa ConditionalGroup
    return <>{children}</>
  }

  // Render hanya jika ini adalah komponen pertama yang match
  return context.matchedIndex === _index ? <>{children}</> : null
}

// Show component tetap sama - untuk conditional rendering sederhana
export function Show({ when, children }: { when: boolean; children: ReactNode }) {
  return when ? <>{children}</> : null
}

// Export sebagai object untuk kemudahan import
export const Cond = {
  If,
  ElseIf,
  Else,
  Show,
  ConditionalGroup,
}
