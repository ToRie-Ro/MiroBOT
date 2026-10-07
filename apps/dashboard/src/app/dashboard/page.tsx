'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Guild {
  id: string;
  name: string;
  icon: string | null;
  botPresent?: boolean;
}

export default function DashboardIndex() {
  const { data: session, status } = useSession();
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || '1234567890';

  useEffect(() => {
    async function loadGuilds() {
      try {
        const res = await fetch('/api/guilds');
        if (res.status === 401) {
          setError('unauthorized');
          setLoading(false);
          return;
        }
        if (!res.ok) {
          throw new Error('Failed to load servers');
        }
        const data = await res.json();
        setGuilds(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message || 'Error fetching servers');
      } finally {
        setLoading(false);
      }
    }

    if (status === 'authenticated') {
      loadGuilds();
    } else if (status === 'unauthenticated') {
      setLoading(false);
      setError('unauthorized');
    }
  }, [status]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f17] text-white p-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400">Loading your Discord servers...</p>
        </div>
      </div>
    );
  }

  if (error === 'unauthorized' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-[#0f0f17] text-white p-8 flex flex-col items-center justify-center">
        <Card className="max-w-md w-full bg-[#1a1a2e] border-gray-800 text-center p-6">
          <CardContent className="space-y-6 pt-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-3xl font-bold">
              &lt;/&gt;
            </div>
            <div>
              <h2 className="text-2xl font-bold">Authentication Required</h2>
              <p className="text-gray-400 text-sm mt-2">
                Please log in with Discord to access your servers and configuration.
              </p>
            </div>
            <Button
              onClick={() => signIn('discord')}
              className="w-full bg-[#5865F2] hover:bg-[#4752c4] text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2"
            >
              Log in with Discord
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f17] text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Your Servers</h1>
            <p className="text-gray-400 mt-2">Select a server to configure Chiro or add it to a new one.</p>
          </div>
          <div className="flex items-center gap-4">
            {session?.user && (
              <div className="flex items-center gap-3">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    className="w-10 h-10 rounded-full border border-gray-700"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold">
                    {session.user.name?.charAt(0) || 'U'}
                  </div>
                )}
                <Button
                  variant="ghost"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Log Out
                </Button>
              </div>
            )}
          </div>
        </div>

        {guilds.length === 0 ? (
          <Card className="bg-[#1a1a2e] border-gray-800 p-8 text-center">
            <CardContent className="space-y-4">
              <p className="text-gray-400">No servers found where you have Administrator or Manage Server permissions.</p>
              <a
                href={`https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=1099511627775&scope=bot%20applications.commands`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
              >
                Add Bot to a Server
              </a>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guilds.map((server) => {
              const iconUrl = server.icon
                ? `https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png?size=128`
                : null;
              const acronym = server.name
                .split(/\s+/)
                .map((w) => w[0])
                .join('')
                .slice(0, 3)
                .toUpperCase();

              const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=1099511627775&scope=bot%20applications.commands&guild_id=${server.id}`;

              return (
                <Card key={server.id} className="bg-[#1a1a2e] border-gray-800 hover:border-indigo-500/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        {iconUrl ? (
                          <img
                            src={iconUrl}
                            alt={server.name}
                            className="w-14 h-14 rounded-2xl object-cover bg-gray-800"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-2xl bg-gray-800 flex items-center justify-center text-xl font-bold text-indigo-400">
                            {acronym}
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-lg line-clamp-1">{server.name}</h3>
                          <span
                            className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${
                              server.botPresent
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                : 'bg-gray-700/50 text-gray-400'
                            }`}
                          >
                            {server.botPresent ? 'Bot Active' : 'Not Configured'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      {server.botPresent ? (
                        <Link href={`/dashboard/${server.id}`}>
                          <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Configure</Button>
                        </Link>
                      ) : (
                        <a
                          href={inviteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-center w-full py-2 px-4 rounded-lg bg-[#252542] hover:bg-[#2d2d52] text-indigo-300 font-medium text-sm transition-colors"
                        >
                          Add Bot
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
