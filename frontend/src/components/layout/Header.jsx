import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { ChevronDown, LogOut, Menu, Moon, Sun } from "lucide-react";

const Header = ({ onMenuClick }) => {
  const { user, logoutUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-primary)]/90 px-4 backdrop-blur lg:justify-end lg:px-8">
      {/* Mobile menu */}
      <button
        className="rounded-lg border border-[var(--color-border)] p-2 text-[var(--color-text-primary)] transition hover:bg-[var(--color-surface)] lg:hidden"
        onClick={onMenuClick}
      >
        <Menu size={18} />
      </button>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-primary)] transition hover:opacity-90"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          <span className="hidden sm:inline">
            {theme === "dark" ? "Light" : "Dark"}
          </span>
        </button>

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 transition hover:opacity-90 focus:outline-none"
          >
            {/* Avatar */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-indigo-500 text-sm font-semibold text-white">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>

            {/* Name */}
            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium text-[var(--color-text-primary)]">
                {user?.name}
              </p>
            </div>
            <ChevronDown
              size={16}
              className={`text-[var(--color-text-muted)] transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl">
              <div className="border-b border-[var(--color-border)] px-4 py-3">
                <p className="text-sm font-medium text-[var(--color-text-primary)]">
                  {user?.name}
                </p>
              </div>

              <button
                onClick={logoutUser}
                className="flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-left text-sm text-red-400 transition hover:bg-red-500/10"
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
