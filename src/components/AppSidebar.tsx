'use client';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Trophy,
  History,
  BookUser,
  UserCircle,
} from 'lucide-react';
import { CoinIcon } from './icons';
import { useAppContext } from '@/hooks/useAppContext';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/profile', label: 'My Profile', icon: UserCircle },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/history', label: 'Session History', icon: History },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useAppContext();
  const userImage = user ? PlaceHolderImages.find(p => p.id === user.image) : undefined;

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <BookUser className="w-8 h-8 text-primary" />
          <h1 className="text-xl font-bold">SkillLink</h1>
        </div>
      </SidebarHeader>
      <SidebarMenu>
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href}>
              <SidebarMenuButton
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <item.icon />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <SidebarFooter className="mt-auto">
        {user && (
          <div className="flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent">
            <Avatar>
               <AvatarImage src={userImage?.imageUrl} alt={user.name} data-ai-hint={userImage?.imageHint}/>
               <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold text-sm">{user.name}</p>
              <div className="flex items-center gap-1">
                <CoinIcon className="w-4 h-4 text-yellow-500" />
                <p className="text-xs font-medium">{user.coins} SkillCoins</p>
              </div>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
