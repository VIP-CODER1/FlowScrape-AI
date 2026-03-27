'use client';

import { useMemo, useState } from 'react';
import { ListRestartIcon, PlusIcon, Trash2Icon } from 'lucide-react';

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

import type { McpServerChain } from '@/app/(dashboard)/mcp-servers/_lib/storage';

type Props = {
  onCreate: (chain: McpServerChain) => void;
};

export default function AddChainDialog({ onCreate }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [goals, setGoals] = useState('');
  const [steps, setSteps] = useState<string[]>([]);
  const [preChecks, setPreChecks] = useState<string[]>([]);

  const canCreate = useMemo(() => name.trim().length > 1 && goals.trim().length > 1, [name, goals]);

  const addStep = () => setSteps((prev) => [...prev, '']);
  const addPreCheck = () => setPreChecks((prev) => [...prev, '']);

  const updateStep = (index: number, value: string) => {
    setSteps((prev) => prev.map((item, idx) => (idx === index ? value : item)));
  };

  const updatePreCheck = (index: number, value: string) => {
    setPreChecks((prev) => prev.map((item, idx) => (idx === index ? value : item)));
  };

  const removeStep = (index: number) => {
    setSteps((prev) => prev.filter((_, idx) => idx !== index));
  };

  const removePreCheck = (index: number) => {
    setPreChecks((prev) => prev.filter((_, idx) => idx !== index));
  };

  const reset = () => {
    setName('');
    setGoals('');
    setSteps([]);
    setPreChecks([]);
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
        <Button>Add Chain</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ListRestartIcon size={18} />
            Add Chain
          </DialogTitle>
          <DialogDescription>Configure name, goals, steps, and pre-check rules for this chain.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Name</Label>
            <p className="text-sm text-muted-foreground">Give this chain a name.</p>
            <Input placeholder="Create User" value={name} onChange={(event) => setName(event.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Goals</Label>
            <p className="text-sm text-muted-foreground">Describe the goals for this chain.</p>
            <Textarea
              className="min-h-[120px] resize-none"
              placeholder="Create a user in the database"
              value={goals}
              onChange={(event) => setGoals(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Steps</Label>
            <p className="text-sm text-muted-foreground">Describe the steps to be performed by this chain.</p>
            <Button type="button" variant="outline" onClick={addStep}>
              <PlusIcon size={16} />
              Add Steps
            </Button>

            {steps.map((step, index) => (
              <div key={`step-${index}`} className="space-y-2">
                <Label className="text-xs text-muted-foreground">Step {index + 1}</Label>
                <div className="flex items-start gap-2">
                  <Textarea
                    placeholder={`Describe step ${index + 1}`}
                    className="min-h-[120px] resize-y"
                    value={step}
                    onChange={(event) => updateStep(index, event.target.value)}
                  />
                  <Button type="button" variant="outline" size="icon" onClick={() => removeStep(index)}>
                    <Trash2Icon size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label>Pre-Check</Label>
            <p className="text-sm text-muted-foreground">
              Describe pre-check conditions that needs to be met for the tools to be executed.
            </p>
            <Button type="button" variant="outline" onClick={addPreCheck}>
              <PlusIcon size={16} />
              Add Pre-Check
            </Button>

            {preChecks.map((check, index) => (
              <div key={`check-${index}`} className="flex items-center gap-2">
                <Input
                  placeholder={`Pre-check ${index + 1}`}
                  value={check}
                  onChange={(event) => updatePreCheck(index, event.target.value)}
                />
                <Button type="button" variant="outline" size="icon" onClick={() => removePreCheck(index)}>
                  <Trash2Icon size={14} />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={!canCreate}
            onClick={() => {
              if (!canCreate) return;

              onCreate({
                id: crypto.randomUUID(),
                name: name.trim(),
                goals: goals.trim(),
                steps: steps.map((step) => step.trim()).filter(Boolean),
                preChecks: preChecks.map((check) => check.trim()).filter(Boolean),
                createdAt: new Date().toISOString(),
              });
              setOpen(false);
              reset();
            }}
          >
            Add Chain
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
