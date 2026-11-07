
import { Film, Heart, Home, Search } from "lucide-react";
import { NavLink } from "react-router-dom";

function Header() {
  const links = [
    { to: "/", label: "Home", Icon: Home },
    { to: "/search", label: "Search", Icon: Search },
    { to: "/favorites", label: "Favourites", Icon: Heart },
  ];

  return (
    <header className="sticky top-0 z-30 w-full border-b border-white/10 bg-[#111]/95 backdrop-blur-md">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-5 sm:py-4">

        <NavLink
          to="/"
          className="flex min-w-0 shrink items-center gap-2 text-base font-black text-red-500 sm:text-xl"
        >
          <Film size={23} className="shrink-0 sm:h-7 sm:w-7" />
          <span className="truncate">Movie Explorer</span>
        </NavLink>

        <div className="flex shrink-0 items-center gap-1 sm:gap-3">
          {links.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              aria-label={label}
              className={({ isActive }) =>
                `flex items-center justify-center gap-1.5 rounded-full px-2.5 py-2 text-sm transition-colors sm:gap-2 sm:px-4 ${
                  isActive
                    ? "bg-red-600 text-white"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              <span className="hidden sm:inline">{label}</span>
            </NavLink>
          ))}
        </div>

      </nav>
    </header>
  );
}

export default Header;
