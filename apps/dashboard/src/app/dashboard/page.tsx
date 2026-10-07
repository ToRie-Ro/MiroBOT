import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DashboardIndex() {
  const servers = [
    { id: '1', name: 'Chiro Support', acronym: 'CS', members: '1,234', inServer: true },
    { id: '2', name: 'Gaming Lounge', acronym: 'GL', members: '842', inServer: true },
    { id: '3', name: 'Developer Hangout', acronym: 'DH', members: '5,021', inServer: false },
    { id: '4', name: 'Anime Club', acronym: 'AC', members: '240', inServer: false },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f17] text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Your Servers</h1>
            <p className="text-gray-400 mt-2">Select a server to configure Chiro or add it to a new one.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold">U</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servers.map((server) => (
            <Card key={server.id} className="hover:border-indigo-500/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gray-800 flex items-center justify-center text-xl font-bold">
                      {server.acronym}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{server.name}</h3>
                      <p className="text-sm text-gray-400">{server.members} members</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  {server.inServer ? (
                    <Link href={`/dashboard/${server.id}`}>
                      <Button className="w-full">Configure</Button>
                    </Link>
                  ) : (
                    <Button variant="secondary" className="w-full bg-[#252542] hover:bg-[#2d2d52] text-indigo-400">
                      Add Bot
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
