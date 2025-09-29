import React, { ElementType } from 'react';
interface ComponentProps {
    is: ElementType;
    [key: string]: any;
}
declare const Component: React.ForwardRefExoticComponent<Omit<ComponentProps, "ref"> & React.RefAttributes<any>>;
export default Component;
