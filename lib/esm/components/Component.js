import React from 'react';
// Enhanced Dynamic Component with proper ref forwarding
const Component = React.forwardRef(({ is: isProp, ...props }, ref) => {
    // Renaming 'is' to 'isProp' to avoid conflict with the component
    const ComponentToRender = isProp;
    // Use React.createElement to dynamically render the component
    // This correctly passes the 'ref' and other 'props'
    return React.createElement(ComponentToRender, { ...props, ref });
});
export default Component;
