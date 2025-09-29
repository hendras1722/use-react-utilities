import React, { ElementType } from 'react';

// TypeScript interface for Component props
interface ComponentProps {
  // `is` is a common prop name for polymorphic components
  is: ElementType;
  // Allows other props to be passed
  [key: string]: any;
}

// Enhanced Dynamic Component with proper ref forwarding
const Component = React.forwardRef<any, ComponentProps>(({ is: isProp, ...props }, ref) => {
  // Renaming 'is' to 'isProp' to avoid conflict with the component
  const ComponentToRender = isProp;

  // Use React.createElement to dynamically render the component
  // This correctly passes the 'ref' and other 'props'
  return React.createElement(ComponentToRender, { ...props, ref });
});

export default Component;
