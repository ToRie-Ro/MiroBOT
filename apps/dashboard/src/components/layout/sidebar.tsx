"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, UserPlus, UserMinus, Shield, Settings, Terminal, Gift, BellRing } from 'lucide-react';
import { cn } from '@/components/ui/card';

const routes = [
  { name: 'Overview', path: '', icon: LayoutDashboard },
  { name: 'Welcome', path: '/welcome', icon: UserPlus },
  { name: 'Goodbye', path: '/goodbye', icon: UserMinus },
  { name: 'Moderation', path: '/moderation', icon: Shield },
  { name: 'Custom Commands', path: '/custom-commands', icon: Terminal },
  { name: 'Announcements', path: '/announcements', icon: BellRing },
  { name: 'Giveaways', path: '/giveaways', icon: Gift },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function Sidebar({ guildId }: { guildId: string }) {
  const pathname = usePathname();
  const basePath = `/dashboard/${guildId}`;

  return (
    <div className="w-64 h-screen bg-[#12122a] border-r border-gray-800 flex flex-col fixed left-0 top-0">
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <Link href="/dashboard" className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-500 hover:opacity-80 transition">
          &lt;/&gt; CHIRO
        </Link>
      </div>
      
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center font-bold text-gray-400">S</div>
          <div>
            <div className="text-sm font-semibold text-white">Chiro Server</div>
            <div className="text-xs text-gray-500">{guildId}</div>
          </div>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-1">
        {routes.map((route) => {
          const fullPath = route.path ? `${basePath}${route.path}` : basePath;
          const active = pathname === fullPath;
          const Icon = route.icon;
          return (
            <Link key={route.path} href={fullPath}
              className={cn("flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium",
                active ? "bg-indigo-500/10 text-indigo-400" : "text-gray-400 hover:text-white hover:bg-[#1a1a2e]"
              )}>
              <Icon className="w-5 h-5" />
              {route.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
