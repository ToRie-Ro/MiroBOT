export function EmbedPreview({ title, description, color }: { title: string; description: string; color: string }) {
  const parsedDesc = description
    .replace(/{user}/g, "<@1234567890>")
    .replace(/{server}/g, "Awesome Server")
    .replace(/{membercount}/g, "12,345");

  return (
    <div className="bg-[#313338] p-4 rounded-md font-sans w-full shadow-sm">
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-full bg-indigo-500 flex-shrink-0 mt-0.5 overflow-hidden">
          <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Chiro" alt="Bot Avatar" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-white hover:underline cursor-pointer">Chiro Bot</span>
            <span className="text-[10px] bg-[#5865F2] text-white px-1.5 py-0.5 rounded flex items-center uppercase font-bold tracking-wide">Bot</span>
            <span className="text-xs text-[#949BA4]">Today at 12:00 PM</span>
          </div>
          
          <div className="mt-2 bg-[#2B2D31] rounded flex overflow-hidden max-w-[432px]">
            <div className="w-1.5 flex-shrink-0" style={{ backgroundColor: color }}></div>
            <div className="p-4 flex-1 break-words">
              {title && <div className="font-bold text-white mb-2 text-[15px]">{title}</div>}
              {parsedDesc && (
                <div className="text-[#DBDEE1] text-[14px] whitespace-pre-wrap leading-tight space-y-2">
                  {parsedDesc.split('\n').map((line, i) => {
                    const parts = line.split(/(<@[0-9]+>)/g);
                    return (
                      <div key={i}>
                        {parts.map((part, j) => 
                          part.match(/<@[0-9]+>/) 
                            ? <span key={j} className="bg-[#3b3d44] text-[#c9cdfb] px-1 rounded hover:bg-[#5865F2] hover:text-white cursor-pointer transition-colors">@ChiroUser</span> 
                            : part
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
