"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react"; // Changed import
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme"; // Ensure this path is correct
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle theme">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme === "dark" ? "moon" : "sun"}
          initial={{ y: -20, opacity: 0, rotate: 90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 20, opacity: 0, rotate: -90 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center"
        >
          {theme === "dark" ? (
            <Moon className="h-[1.2rem] w-[1.2rem]" /> // Changed to Lucide Moon
          ) : (
            <Sun className="h-[1.2rem] w-[1.2rem]" /> // Changed to Lucide Sun
          )}
        </motion.div>
      </AnimatePresence>
    </Button>
  );
}

// Ensure useTheme hook is correctly implemented and ThemeProvider is wrapping the app
// Example useTheme (if not already defined elsewhere like src/hooks/use-theme.tsx):
//
// interface ThemeContextType {
//   theme: string;
//   setTheme: (theme: string) => void;
// }
//
// const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);
//
// export const useTheme = () => {
//   const context = React.useContext(ThemeContext);
//   if (!context) {
//     throw new Error("useTheme must be used within a ThemeProvider");
//   }
//   return context;
// };
//
// // And ensure your layout or main app component has ThemeProvider
// // import { ThemeProvider } from 'next-themes'; // or your custom provider
// // <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
// //   {children}
// // </ThemeProvider>
