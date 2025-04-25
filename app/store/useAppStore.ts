import { create } from 'zustand';

export type User = {
  fid?: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
  [key: string]: any; // allow extra fields from Farcaster/Neynar
};

export type Column = {
  id: string;
  type: 'demo' | 'feed' | 'profile' | 'notifications' | 'channels' | 'search' | 'directMessages' | 'trending' | 'bookmarks';
  title: string;
  data?: any; // Refine this type as your data model grows
};

export type AppState = {
  user: User | null;
  setUser: (user: User | null) => void;
  columns: Column[];
  addColumn: (column: Column) => void;
  removeColumn: (id: string) => void;
  moveColumn: (from: number, to: number) => void;
};

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  columns: [
    {
      id: 'demo-1',
      type: 'demo',
      title: 'Demo Column',
      data: { message: 'This is a placeholder column!' }
    }
  ],
  addColumn: (column) => set((state) => ({ columns: [...state.columns, column] })),
  removeColumn: (id) => set((state) => ({ columns: state.columns.filter(col => col.id !== id) })),
  moveColumn: (from, to) => set((state) => {
    const cols = [...state.columns];
    const [col] = cols.splice(from, 1);
    cols.splice(to, 0, col);
    return { columns: cols };
  }),
}));
