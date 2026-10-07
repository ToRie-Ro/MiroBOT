"use client";
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EmbedPreview } from '@/components/discord/embed-preview';

export default function EmbedBuilderPage() {
  const [title, setTitle] = useState("Information");
  const [description, setDescription] = useState("Welcome to the server! Please read the rules below.");
  const [color, setColor] = useState("#6366f1");

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-3xl font-bold">Embed Builder</h1>
        <p className="text-gray-400 mt-2">Create custom rich embeds to send to your channels.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Embed Editor</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Title</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Embed Title" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Description</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  rows={6} 
                  className="w-full bg-[#0f0f17] border border-gray-800 rounded-md p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                  placeholder="Enter embed description..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Color</label>
                <div className="flex gap-3 items-center">
                  <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0" />
                  <Input value={color} onChange={(e) => setColor(e.target.value)} className="uppercase font-mono" />
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-800">
                <Button className="w-full">Send to Channel</Button>
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
