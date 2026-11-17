import SettingsForm from '@/components/workspace/SettingsForm';
import WorkspaceSettings from '@/components/workspace/WorkspaceSettings';
import { useApp } from '@/context/AppContext';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';

export function Settings() {
  const { profile, setProfile, locale, setLocale, workspace, updateWorkspace, canSaveData } = useApp();

  const saveProfile = (form) => {
    setProfile({ ...profile, ...form, preferredLanguage: form.language });
    setLocale(form.language);
  };

  return (
    <div className="p-6 md:p-10 animate-fade-in max-w-xl mx-auto">
      <h1 className="font-display text-4xl md:text-[2.75rem] text-forest tracking-tight leading-none mb-2">Settings</h1>
      <p className="text-sm text-charcoal/60 mb-8">Your profile and planning data are saved with your Vedika account when Supabase is connected.</p>
      <SettingsForm profile={{ ...profile, language: locale }} onSave={saveProfile} />
      <WorkspaceSettings workspace={workspace} onSave={updateWorkspace} canSave={canSaveData} />
      <Card className="mt-6">
        <CardHeader><h2 className="font-display text-xl text-forest">Account data</h2></CardHeader>
        <CardBody>
          <p className="text-sm text-charcoal/60">
            {canSaveData ? 'Your saved data is stored in your Supabase account and loads when you sign in.' : 'Connect Supabase and sign in to save your profile, workspace, designs, and bookings across sessions.'}
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
