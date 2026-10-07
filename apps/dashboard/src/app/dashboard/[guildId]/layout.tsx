import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function GuildLayout({ children, params }: { children: React.ReactNode; params: { guildId: string } }) {
  return <DashboardLayout guildId={params.guildId}>{children}</DashboardLayout>;
}
