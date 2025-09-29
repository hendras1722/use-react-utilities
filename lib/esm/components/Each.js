import { Children } from 'react';
export default function Each({ of, render }) {
    return Children.toArray(of.map((item, index) => render(item, index)));
}
