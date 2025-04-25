import { useAppStore } from '../store/useAppStore';
import Column from './Column';

export default function Board() {
  const columns = useAppStore((state) => state.columns);
  return (
    <div className="flex gap-4 p-4 overflow-x-auto min-h-[400px]">
      {columns.map((col, idx) => (
        <Column key={col.id} column={col} index={idx} />
      ))}
    </div>
  );
}
