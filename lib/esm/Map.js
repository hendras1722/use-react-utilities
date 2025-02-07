import { Children } from 'react';
export default function ArrayMap({ of, render }) {
    return Children.toArray(of.map((item, index) => render(item, index)));
}
