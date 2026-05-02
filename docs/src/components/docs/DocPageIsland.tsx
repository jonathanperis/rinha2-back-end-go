import { useState, useCallback } from 'react';
import { useScrollspy } from '@/hooks/useScrollspy';
import Sidebar, { type NavItem } from './Sidebar';

const NAV_ITEMS: NavItem[] = [
    { id: 'home', label: 'Home' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'challenge', label: 'Challenge' },
    { id: 'ci-cd-pipeline', label: 'CI/CD Pipeline' },
    { id: 'getting-started', label: 'Getting Started' },
    { id: 'performance', label: 'Performance' },
];

const SECTION_IDS = NAV_ITEMS.map((item) => item.id);

export default function DocPageIsland() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { activeSection } = useScrollspy(SECTION_IDS);
    const toggleMenu = useCallback(() => setMenuOpen((p) => !p), []);

    return (
        <>
            <div className="mobile-header">
                <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle Menu">
                    <span /><span /><span />
                </button>
                <div className="repo-title">rinha2-back-end-go</div>
            </div>
            <div
                className={`overlay${menuOpen ? ' open' : ''}`}
                onClick={toggleMenu}
            />
            <Sidebar
                menuOpen={menuOpen}
                toggleMenu={toggleMenu}
                items={NAV_ITEMS}
                activeSection={activeSection}
            />
        </>
    );
}
