"use client";
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmbedPreview } from '@/components/discord/embed-preview';
import { toast } from 'sonner';

export default function WelcomeConfig() {
  const [enabled, setEnabled] = useState(true);
  const [title, setTitle] = useState("Welcome to the server!");
  const [description, setDescription] = useState("Hey {user}, welcome to {server}! You are member #{membercount}.");
  const [color, setColor] = useState("#6366f1");

  const handleSave = () => {
    toast.success("Welcome settings saved successfully!");
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome Messages</h1>
          <p className="text-gray-400 mt-2">Greet new members when they join with a custom embed.</p>
        </div>
        <button onClick={handleSave} className="bg-indigo-600 px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/20">
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-[#0f0f17] rounded-lg border border-gray-800">
                <span className="font-medium">Enable Welcome System</span>
                <input type="checkbox" checked={enabled} onChange={e => setEnabled(e.target.checked)} className="w-5 h-5 accent-indigo-500" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Embed Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-[#0f0f17] border border-gray-800 rounded-lg p-3 text-white focus:border-indigo-500 outline-none transition" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Embed Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={5} className="w-full bg-[#0f0f17] border border-gray-800 rounded-lg p-3 text-white focus:border-indigo-500 outline-none transition resize-none" />
                <div className="flex flex-wrap gap-2 text-xs pt-1">
                  <span className="bg-gray-800 px-2 py-1 rounded text-gray-300 font-mono cursor-pointer hover:bg-gray-700">{"{user}"}</span>
                  <span className="bg-gray-800 px-2 py-1 rounded text-gray-300 font-mono cursor-pointer hover:bg-gray-700">{"{server}"}</span>
                  <span className="bg-gray-800 px-2 py-1 rounded text-gray-300 font-mono cursor-pointer hover:bg-gray-700">{"{membercount}"}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Embed Color</label>
                <div className="flex gap-3">
                  <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-12 h-12 rounded-lg cursor-pointer bg-transparent border-0 p-0" />
                  <input value={color} onChange={e => setColor(e.target.value)} className="flex-1 bg-[#0f0f17] border border-gray-800 rounded-lg p-3 text-white focus:border-indigo-500 outline-none uppercase font-mono" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6 lg:sticky lg:top-24 h-fit">
          <Card>
            <CardHeader><CardTitle>Live Preview</CardTitle></CardHeader>
            <CardContent>
              <EmbedPreview title={title} description={description} color={color} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
