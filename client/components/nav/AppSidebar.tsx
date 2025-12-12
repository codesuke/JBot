'use client';

import { useSession } from 'next-auth/react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MessageSquare,
  User,
  Settings,
  LogOut,
  HelpCircle,
  ChevronUp,
  MessageCircle,
  Plus,
  Trash2,
  MoreHorizontal,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useChatStore } from '@/store/useChatStore';
import { cn } from '@/lib/utils';

export function AppSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { 
    conversations, 
    activeConversationId, 
    setActiveConversation, 
    createConversation,
    deleteConversation 
  } = useChatStore();

  // Main navigation items
  const mainItems = [
    {
      title: 'Chat',
      url: '/chat',
      icon: MessageSquare,
      badge: null,
    },
    {
      title: 'Profile',
      url: '/profile',
      icon: User,
      badge: null,
    },
  ];

  // Tools menu items
  const toolsItems = [
    {
      title: 'Settings',
      url: '/settings',
      icon: Settings,
    },
    {
      title: 'Help & Support',
      url: '/help',
      icon: HelpCircle,
    },
  ];

  const isActive = (url: string) => pathname === url;

  const handleNewChat = () => {
    const newId = createConversation();
    setActiveConversation(newId);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const d = new Date(date);
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return d.toLocaleDateString();
  };

  return (
    <Sidebar collapsible="icon" variant="sidebar" className="border-r">
      {/* Sidebar Header */}
      <SidebarHeader className="flex flex-col gap-2">
        <div className="flex items-center gap-2 px-2 group-data-[collapsible=icon]:justify-center">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
            <MessageSquare className="size-4" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
            <span className="font-semibold">JBot</span>
            <span className="text-xs text-muted-foreground">AI Assistant</span>
          </div>
        </div>
        
        {/* New Chat Button in Sidebar */}
        <div className="px-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg border border-dashed border-border hover:bg-accent hover:border-primary/50 transition-colors group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
          >
            <Plus className="h-4 w-4" />
            <span className="text-sm group-data-[collapsible=icon]:hidden">New Chat</span>
          </button>
        </div>
      </SidebarHeader>

      {/* Main Content */}
      <SidebarContent className="scrollbar-hide">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.url)}
                      className="hover:bg-accent"
                    >
                      <Link href={item.url}>
                        <Icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Chat History */}
        <SidebarGroup className="flex-1 overflow-hidden">
          <SidebarGroupLabel>Chat History</SidebarGroupLabel>
          <SidebarGroupContent className="overflow-y-auto max-h-[300px]">
            <SidebarMenu>
              {conversations.length === 0 ? (
                <div className="px-3 py-4 text-xs text-muted-foreground text-center group-data-[collapsible=icon]:hidden">
                  No conversations yet
                </div>
              ) : (
                conversations.slice(0, 20).map((convo) => (
                  <SidebarMenuItem key={convo.id} className="group/item relative">
                    <SidebarMenuButton
                      isActive={activeConversationId === convo.id}
                      onClick={() => setActiveConversation(convo.id)}
                      className={cn(
                        "hover:bg-accent cursor-pointer w-full pr-8",
                        activeConversationId === convo.id && "bg-accent"
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <MessageCircle className="h-4 w-4 shrink-0" />
                        <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
                          <span className="text-sm truncate">{convo.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(convo.updatedAt)}
                          </span>
                        </div>
                      </div>
                    </SidebarMenuButton>
                    {/* Dropdown positioned outside the button */}
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover/item:opacity-100 transition-opacity group-data-[collapsible=icon]:hidden">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button 
                            className="p-1 hover:bg-accent rounded"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteConversation(convo.id);
                            }}
                            className="text-destructive focus:text-destructive cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Tools */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolsItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      className="hover:bg-accent"
                    >
                      <Link href={item.url}>
                        <Icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="hover:bg-accent data-[state=open]:bg-accent"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-semibold">
                    {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{session?.user?.name || 'User'}</span>
                    <span className="truncate text-xs text-muted-foreground">{session?.user?.email || 'user@example.com'}</span>
                  </div>
                  <ChevronUp className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
