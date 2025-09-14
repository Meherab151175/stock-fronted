import { Outlet } from "react-router-dom";
// import { ModeToggle } from "./mode-toggle";
import NavBar from "./comp-582";

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      {/* <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">My App</h1>
          <nav className="flex gap-4">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <Link to="/about" className="hover:underline">
              About
            </Link>
          </nav>
        </div>
        <ModeToggle />
      </header> */}
      <NavBar />

      {/* Main content rendered by routes */}
      <main className="flex-1 p-4">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="p-4 border-t text-center text-sm">
        © 2025 Meherab
      </footer>
    </div>
  );
}
