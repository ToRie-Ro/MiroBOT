import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f0f17] text-white flex flex-col items-center justify-center p-8 bg-[url('/grid.svg')] bg-center relative overflow-hidden">
      <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none max-w-4xl mx-auto" />
      <div className="z-10 text-center space-y-8 max-w-3xl">
        <h1 className="text-6xl font-extrabold tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-500">&lt;/&gt; CHIRO</span>
        </h1>
        <p className="text-xl text-gray-400">The all-in-one Discord bot for modern servers. Moderation, Leveling, Tickets, AutoMod, and more.</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/login" className="px-8 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition font-medium text-white shadow-lg shadow-indigo-500/20">Add to Discord</Link>
          <Link href="/dashboard" className="px-8 py-3 rounded-lg bg-[#1a1a2e] border border-gray-800 hover:bg-gray-800 transition font-medium text-white">View Dashboard</Link>
        </div>
      </div>
      <div className="z-10 mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {[
          { label: 'Servers', value: '1,000+' },
          { label: 'Users', value: '500,000+' },
          { label: 'Uptime', value: '99.9%' }
        ].map((stat, i) => (
          <div key={i} className="p-6 rounded-xl border border-gray-800 bg-[#1a1a2e]/50 backdrop-blur text-center hover:border-gray-700 transition-colors">
            <div className="text-4xl font-bold text-indigo-400 mb-2">{stat.value}</div>
            <div className="text-gray-400 uppercase tracking-wider text-sm font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
