export interface NavItem {
    id: string;
    label: string;
}

interface SidebarProps {
    menuOpen: boolean;
    toggleMenu: () => void;
    items: NavItem[];
    activeSection: string;
}

export default function Sidebar({
    menuOpen,
    toggleMenu,
    items,
    activeSection,
}: SidebarProps) {
    const base = (import.meta.env?.BASE_URL ?? '').replace(/\/$/, '');
    return (
        <aside className={`sidebar${menuOpen ? ' open' : ''}`}>
            <div className="sidebar-header">
                <h1 className="repo-title">rinha2-back-end-go</h1>
                <p className="repo-description">
                    Go 1.25 implementation of Rinha de Backend 2024/Q1 — minimal, flat, lightning-fast
                    fictional bank API built for performance under constraints
                </p>
                <input
                    type="text"
                    id="searchInput"
                    className="search-box"
                    placeholder="Search documentation..."
                    aria-label="Search documentation"
                />
            </div>
            <div className="sidebar-nav-container">
                <ul>
                    {items.map((item) => (
                        <li key={item.id}>
                            <a
                                href={`${base}/docs/#${item.id}`}
                                className={`nav-item${activeSection === item.id ? ' active' : ''}`}
                                onClick={() => {
                                    if (window.innerWidth <= 768) toggleMenu();
                                }}
                            >
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="sidebar-footer">
                <a href={`${base}/`} className="back-home">← Back to home</a>
                <a
                    href="https://github.com/jonathanperis/rinha2-back-end-go"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    View on GitHub
                </a>
                <div>Built by Jonathan Peris</div>
            </div>
        </aside>
    );
}
