import { create } from "zustand";
import { persist } from "zustand/middleware";

const useThemeStore = create(
    persist(
        (set) => ({
            theme: "dark",
            setTheme: (theme) => set({ theme }),
        }),
        {
            name: "theme-storage",
        }
    )
);

export default useThemeStore;