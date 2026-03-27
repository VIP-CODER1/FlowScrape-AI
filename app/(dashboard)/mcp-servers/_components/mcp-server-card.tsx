'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ChevronRightIcon, ServerIcon } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import type { McpServer } from '@/app/(dashboard)/mcp-servers/_lib/storage';

export default function McpServerCard({ server }: { server: McpServer }) {
  return (
    <Card className="border border-separate shadow-sm rounded-lg overflow-hidden hover:shadow-md">
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-primary/20">
              <ServerIcon className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-base font-bold truncate">{server.name}</h3>
            <Badge variant="outline">MCP Server</Badge>
          </div>

          <p className="text-sm text-muted-foreground mt-2 truncate">
            {server.description || 'No description provided'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Created {formatDistanceToNow(new Date(server.createdAt), { addSuffix: true })}
          </p>
        </div>

        <Button asChild variant="outline" className="shrink-0">
          <Link href={`/mcp-servers/${server.id}`}>
            Open
            <ChevronRightIcon size={16} />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
