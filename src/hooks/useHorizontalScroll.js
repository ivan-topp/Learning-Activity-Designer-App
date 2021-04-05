import { useLayoutEffect, useState } from 'react';

export function useHorizontalScroll() {
    const [node, setRef] = useState(null)
    useLayoutEffect(() => {
        if (node) {
            const onWheel = e => {
                if (e.deltaY === 0) return;
                e.preventDefault();
                node.scrollTo({
                    left: node.scrollLeft + e.deltaY,
                    behavior: 'auto',
                });
            };
            node.addEventListener('wheel', onWheel);
            return () => node.removeEventListener('wheel', onWheel);
        }
    }, [node]);
    return setRef;
}