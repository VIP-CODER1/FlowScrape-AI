'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeftIcon, MessageSquareTextIcon } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

import { findMcpServerById, type McpServer } from '@/app/(dashboard)/mcp-servers/_lib/storage';

export default function McpServerChatPage() {
  const params = useParams<{ serverId: string }>();
  const [server, setServer] = useState<McpServer | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const id = String(params.serverId ?? '');
    if (!id) return;
    setServer(findMcpServerById(id) ?? null);
  }, [params.serverId]);

  if (!server) {
    return (
      <Alert>
        <AlertTitle>MCP server not found</AlertTitle>
        <AlertDescription>Create an MCP server first, then open chat testing.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <MessageSquareTextIcon size={24} className="text-primary" />
          {server.name} - Chat Testing
        </h1>

        <Button asChild variant="outline">
          <Link href={`/mcp-servers/${server.id}`}>
            <ArrowLeftIcon size={16} />
            Back to Server
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Chat</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This is a local test UI for your MCP server chat flow.
          </p>
          <Textarea
            placeholder="Type a test prompt for this MCP server..."
            className="min-h-[140px] resize-none"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <div className="rounded-md border p-4 text-sm text-muted-foreground">
            Output preview: {message ? `You sent -> ${message}` : 'No test message yet.'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
