import { useState, useEffect, useRef } from 'react';

export function useScrollspy(ids: string[]) {
    const [activeSection, setActiveSection] = useState(ids[0] ?? '');
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(
            (entries) => {
                const visible = entries.filter((e) => e.isIntersecting);
                if (visible.length > 0) {
                    visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                    setActiveSection(visible[0].target.id);
                }
            },
            { rootMargin: '-10% 0px -70% 0px', threshold: 0 }
        );

        ids.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observerRef.current!.observe(el);
        });

        return () => observerRef.current?.disconnect();
    }, [ids.join(',')]);

    return { activeSection };
}
