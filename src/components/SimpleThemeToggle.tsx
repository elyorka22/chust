'use client';

interface SimpleThemeToggleProps {
  selectedTheme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}

export default function SimpleThemeToggle({ selectedTheme, onThemeChange }: SimpleThemeToggleProps) {
  return (
    <div className="absolute top-4 right-4 z-[1000]">
      <div className="bg-white rounded-lg shadow-lg p-2 flex items-center gap-2">
        <button
          onClick={() => onThemeChange('light')}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedTheme === 'light'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          ☀️ Yorug
        </button>
        <button
          onClick={() => onThemeChange('dark')}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedTheme === 'dark'
              ? 'bg-gray-800 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🌙 Qorong&apos;i
        </button>
      </div>
    </div>
  );
} 