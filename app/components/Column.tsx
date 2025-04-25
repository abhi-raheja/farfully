import { Column as ColumnType, useAppStore } from '../store/useAppStore';

interface Props {
  column: ColumnType;
  index: number;
}

export default function Column({ column, index }: Props) {
  const removeColumn = useAppStore((state) => state.removeColumn);
  return (
    <div className="bg-white dark:bg-gray-900 border rounded-lg shadow w-72 min-h-[300px] flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50 dark:bg-gray-800 rounded-t-lg">
        <span className="font-bold text-lg">{column.title}</span>
        <button
          onClick={() => removeColumn(column.id)}
          className="text-red-500 hover:text-red-700 text-xs px-2 py-1"
        >
          Remove
        </button>
      </div>
      <div className="flex-1 px-4 py-2">
        {/* Demo content */}
        <pre className="text-xs text-gray-500 whitespace-pre-wrap">{JSON.stringify(column.data, null, 2)}</pre>
      </div>
    </div>
  );
}
