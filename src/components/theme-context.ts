import { createContext } from "react";

type Theme = "dark" | "light" | "system";

// ✅ Export the type so it can be imported elsewhere
export type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

// ✅ Export the context itself
export const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: "system",
  setTheme: () => null,
});
