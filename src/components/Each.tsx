import React, { Children } from 'react'

interface ArrayMapProps<T> {
  of: T[]
  render: (item: T, index: number) => React.ReactNode
}

export default function Each<T>({ of, render }: ArrayMapProps<T>) {
  return Children.toArray(of.map((item, index) => render(item, index)))
}
