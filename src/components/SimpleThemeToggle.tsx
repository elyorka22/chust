'use client';

interface SimpleThemeToggleProps {
  selectedTheme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}

export default function SimpleThemeToggle({ selectedTheme, onThemeChange }: SimpleThemeToggleProps) {
  const toggleTheme = () => {
    onThemeChange(selectedTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="absolute top-4 right-4 z-[1000]">
      <button
        onClick={toggleTheme}
        className="bg-white rounded-full shadow-lg p-3 hover:bg-gray-50 transition-colors"
        title={selectedTheme === 'light' ? 'Qorong&apos;i rejimga o&apos;tish' : 'Yorug rejimga o&apos;tish'}
      >
        {selectedTheme === 'light' ? '🌙' : '☀️'}
      </button>
    </div>
  );
} 