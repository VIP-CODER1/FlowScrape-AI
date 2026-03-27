'use client';

import { useMemo, useState } from 'react';
import { Loader2, ServerIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { createMcpServer, type McpServer } from '@/app/(dashboard)/mcp-servers/_lib/storage';

type Props = {
  triggerText?: string;
  onCreate: (server: McpServer) => void;
};

export default function CreateMcpServerDialog({ triggerText, onCreate }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const isValid = useMemo(() => name.trim().length > 1, [name]);

  const reset = () => {
    setName('');
    setDescription('');
    setIsCreating(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button>{triggerText ?? 'Create your MCP Server'}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ServerIcon size={18} />
            Create your MCP Server
          </DialogTitle>
          <DialogDescription>Add server name and description to create a new MCP server card.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mcp-name">Name</Label>
            <Input
              id="mcp-name"
              placeholder="Customer data helper"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mcp-description">Description</Label>
            <Textarea
              id="mcp-description"
              placeholder="What this MCP server is used for"
              className="resize-none"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            disabled={!isValid || isCreating}
            onClick={() => {
              if (!isValid) return;

              setIsCreating(true);
              const newServer = createMcpServer({ name, description });
              onCreate(newServer);
              setOpen(false);
              reset();
            }}
          >
            {isCreating ? <Loader2 className="animate-spin" /> : 'Create MCP Server'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
