import { useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

export default function WorkspaceSettings({ workspace, onSave, canSave }) {
  const [form, setForm] = useState(workspace);
  const { toast } = useToast();
  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const save = (event) => {
    event.preventDefault();
    onSave(form);
    toast(canSave ? 'Workspace details saved to your account' : 'Workspace details saved for this session', canSave ? 'success' : 'info');
  };

  return (
    <form onSubmit={save} className="mt-6">
      <Card>
        <CardHeader><h2 className="font-display text-xl text-forest">Workspace details</h2></CardHeader>
        <CardBody className="space-y-3">
          <Input label="Workspace name" value={form.name} onChange={set('name')} />
          <Input label="Event name" value={form.eventName} onChange={set('eventName')} />
          <Input label="Event date" type="date" value={form.eventDate} onChange={set('eventDate')} />
          <Input label="Venue" value={form.venue} onChange={set('venue')} />
          <Button type="submit">Save workspace</Button>
        </CardBody>
      </Card>
    </form>
  );
}
