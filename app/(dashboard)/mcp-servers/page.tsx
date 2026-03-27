'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { InboxIcon } from 'lucide-react';

import CreateMcpServerDialog from '@/app/(dashboard)/mcp-servers/_components/create-mcp-server-dialog';
import McpServerCard from '@/app/(dashboard)/mcp-servers/_components/mcp-server-card';
import { loadMcpServers, saveMcpServers, type McpServer } from '@/app/(dashboard)/mcp-servers/_lib/storage';

export default function McpServersPage() {
  const router = useRouter();
  const [servers, setServers] = useState<McpServer[]>([]);

  useEffect(() => {
    setServers(loadMcpServers());
  }, []);

  const sortedServers = useMemo(
    () => [...servers].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [servers]
  );

  const handleCreate = (server: McpServer) => {
    const nextServers = [server, ...servers];
    setServers(nextServers);
    saveMcpServers(nextServers);
    router.push(`/mcp-servers/${server.id}`);
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">MCP Servers</h1>
          <p className="text-muted-foreground">Manage your MCP servers</p>
        </div>
        <CreateMcpServerDialog triggerText="Create your MCP Server" onCreate={handleCreate} />
      </div>

      <div className="h-full py-6">
        {sortedServers.length === 0 ? (
          <div className="flex flex-col gap-4 h-full items-center justify-center">
            <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
              <InboxIcon size={40} className="stroke-primary" />
            </div>
            <div className="flex flex-col gap-1 text-center">
              <p className="font-bold">No MCP server created yet</p>
              <p className="text-sm text-muted-foreground">Click the button below to create your first MCP server</p>
            </div>
            <CreateMcpServerDialog triggerText="Create your MCP Server" onCreate={handleCreate} />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {sortedServers.map((server) => (
              <McpServerCard key={server.id} server={server} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
