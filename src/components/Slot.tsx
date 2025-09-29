"use client"
import React, { type ReactNode } from "react"


interface SlotContentProps<T> {
  name?: string
  children: ReactNode | ((props: T) => ReactNode)
}

export function Template<T>(_props: SlotContentProps<T>) {
  return null
}

// Helper function untuk extract slots dari children
export function useSlots<T>(children: ReactNode) {
  const slots: Record<string, ReactNode> = {}
  const scopedSlots: Record<string, (props: T) => ReactNode> = {}

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === Template) {
      const { name = "default", children: slotChildren } = child.props as SlotContentProps<T>

      if (typeof slotChildren === "function") {
        scopedSlots[name] = slotChildren as (props: T) => ReactNode
      } else {
        slots[name] = slotChildren as ReactNode
      }
    }
  })

  return { slots, scopedSlots }
}
