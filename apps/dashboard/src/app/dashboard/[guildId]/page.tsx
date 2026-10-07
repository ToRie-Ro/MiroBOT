import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function GuildOverview({ params }: { params: { guildId: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Overview</h1>
        <p className="text-gray-400 mt-2">Manage settings for server ID {params.guildId}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-sm text-gray-400">Total Members</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">12,345</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm text-gray-400">Active Tickets</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-indigo-400">4</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm text-gray-400">Custom Commands</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">18</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm text-gray-400">Giveaways</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-violet-400">2</div></CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 space-y-3 border-2 border-dashed border-gray-800 rounded-lg">
            <p>No recent activity to show.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
