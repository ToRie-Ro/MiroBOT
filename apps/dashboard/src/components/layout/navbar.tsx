import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0f0f17]/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-500">
            &lt;/&gt; CHIRO
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
            <Link href="/#features" className="hover:text-white transition">Features</Link>
            <Link href="/docs" className="hover:text-white transition">Documentation</Link>
            <Link href="/status" className="hover:text-white transition">Status</Link>
            <Link href="/premium" className="hover:text-white transition text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-semibold">Premium</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="px-5 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 transition font-medium text-sm text-white shadow-lg shadow-indigo-500/20">
            Login with Discord
          </Link>
        </div>
      </div>
    </nav>
  );
}
