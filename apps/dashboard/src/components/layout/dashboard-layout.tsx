import { Sidebar } from './sidebar';

export function DashboardLayout({ children, guildId }: { children: React.ReactNode; guildId: string }) {
  return (
    <div className="min-h-screen bg-[#0f0f17]">
      <Sidebar guildId={guildId} />
      <div className="pl-64 flex flex-col min-h-screen">
        <header className="h-16 border-b border-gray-800 bg-[#0f0f17]/80 backdrop-blur px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-sm font-medium text-gray-400">Server Configuration</h2>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold shadow-md cursor-pointer hover:bg-indigo-700 transition">U</div>
          </div>
        </header>
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
