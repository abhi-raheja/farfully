import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { ColumnConfig } from '../types/farcaster';

interface ColumnsState {
  columns: ColumnConfig[];
  addColumn: (config: Omit<ColumnConfig, 'id' | 'position'>) => void;
  removeColumn: (id: string) => void;
  reorderColumns: (startIndex: number, endIndex: number) => void;
  updateColumnSettings: (id: string, settings: Partial<ColumnConfig['settings']>) => void;
}

export const useColumnsStore = create<ColumnsState>()(
  persist(
    (set) => ({
      columns: [],
      
      addColumn: (config) => set((state) => ({
        columns: [...state.columns, {
          ...config,
          id: nanoid(),
          position: state.columns.length,
        }],
      })),
      
      removeColumn: (id) => set((state) => ({
        columns: state.columns.filter(col => col.id !== id),
      })),
      
      reorderColumns: (startIndex, endIndex) => set((state) => {
        const result = Array.from(state.columns);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        
        // Update positions
        return {
          columns: result.map((col, idx) => ({
            ...col,
            position: idx,
          })),
        };
      }),
      
      updateColumnSettings: (id, settings) => set((state) => ({
        columns: state.columns.map(col => 
          col.id === id 
            ? { ...col, settings: { ...col.settings, ...settings } } 
            : col
        ),
      })),
    }),
    {
      name: 'farfully-columns', // unique name for local storage
    }
  )
); 