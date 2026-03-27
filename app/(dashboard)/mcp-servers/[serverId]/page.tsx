'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeftIcon, CopyIcon, ListChecksIcon, ServerIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import AddChainDialog from '@/app/(dashboard)/mcp-servers/_components/add-chain-dialog';
import {
  findMcpServerById,
  upsertMcpServer,
  type McpServer,
  type McpServerChain,
} from '@/app/(dashboard)/mcp-servers/_lib/storage';

export default function McpServerDetailsPage() {
  const params = useParams<{ serverId: string }>();
  const serverId = useMemo(() => String(params.serverId ?? ''), [params.serverId]);

  const [server, setServer] = useState<McpServer | null>(null);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (!serverId) return;
    setServer(findMcpServerById(serverId) ?? null);
  }, [serverId]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  if (!server) {
    return (
      <Alert>
        <AlertTitle>MCP server not found</AlertTitle>
        <AlertDescription>
          This server does not exist in local storage. Go back and create it again.
        </AlertDescription>
      </Alert>
    );
  }

  const addChain = (chain: McpServerChain) => {
    const updatedServer: McpServer = {
      ...server,
      chains: [chain, ...server.chains],
    };

    setServer(updatedServer);
    upsertMcpServer(updatedServer);
  };

  const chatPath = `/mcp-servers/${server.id}/chat`;
  const chatUrl = origin ? `${origin}${chatPath}` : chatPath;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ServerIcon size={24} className="text-primary" />
            {server.name}
          </h1>
          <p className="text-muted-foreground mt-1">{server.description || 'No description provided.'}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/mcp-servers">
              <ArrowLeftIcon size={16} />
              Back
            </Link>
          </Button>
          <AddChainDialog onCreate={addChain} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Chat URL (Testing)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Use this URL to open the MCP server test chat page.
          </p>
          <div className="flex items-center gap-2">
            <Input readOnly value={chatUrl} />
            <Button
              variant="outline"
              onClick={async () => {
                await navigator.clipboard.writeText(chatUrl);
                toast.success('Chat URL copied');
              }}
            >
              <CopyIcon size={16} />
              Copy
            </Button>
            <Button asChild>
              <Link href={chatPath}>Open</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ListChecksIcon size={18} />
            Chains
          </CardTitle>
        </CardHeader>
        <CardContent>
          {server.chains.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No chains yet. Click <span className="font-medium">Add Chain</span> to open the chain builder UI.
            </p>
          ) : (
            <div className="grid gap-3">
              {server.chains.map((chain) => (
                <div key={chain.id} className="rounded-md border p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold">{chain.name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Steps: {chain.steps.length}</Badge>
                      <Badge variant="outline">Pre-checks: {chain.preChecks.length}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{chain.goals}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
