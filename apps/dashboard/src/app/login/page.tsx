'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || '';
  const botInviteUrl = clientId
    ? `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=1099511627775&scope=bot%20applications.commands`
    : `https://discord.com/oauth2/authorize?client_id=1234567890&permissions=1099511627775&scope=bot%20applications.commands`;

  return (
    <div className="min-h-screen bg-[#0f0f17] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none max-w-2xl mx-auto" />

      <Card className="w-full max-w-md bg-[#1a1a2e]/80 border-gray-800 backdrop-blur-xl z-10 p-2 shadow-2xl">
        <CardContent className="p-8 text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-3xl font-black shadow-lg shadow-indigo-500/30">
            &lt;/&gt;
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white">Welcome to CHIRO</h1>
            <p className="text-gray-400 text-sm mt-1">Connect your Discord account to manage your servers</p>
          </div>

          <div className="space-y-3 pt-2">
            <Button
              onClick={() => signIn('discord', { callbackUrl: '/dashboard' })}
              className="w-full bg-[#5865F2] hover:bg-[#4752c4] text-white font-medium py-3 rounded-lg flex items-center justify-center gap-3 transition-all shadow-lg shadow-[#5865F2]/20"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              Login with Discord
            </Button>

            <a
              href={botInviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 px-4 rounded-lg bg-[#252542] hover:bg-[#2d2d52] text-indigo-300 font-medium text-sm transition-colors border border-indigo-500/20"
            >
              Add Bot to Your Server
            </a>
          </div>

          <div className="pt-4 border-t border-gray-800 text-xs text-gray-500">
            <Link href="/" className="hover:text-gray-300 transition-colors">
              &larr; Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
