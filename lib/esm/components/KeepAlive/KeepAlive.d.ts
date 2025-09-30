import { ReactNode } from 'react';
interface KeepAliveProps {
    name: string;
    active: boolean;
    children: ReactNode;
}
declare function KeepAlive({ name, active, children }: KeepAliveProps): null;
export default KeepAlive;
