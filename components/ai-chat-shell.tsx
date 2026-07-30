"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { AuthSync } from "@/components/auth-sync";
import { Toaster } from "sonner";
import { ChatLanding } from "@/components/chat/chat-landing";

/**
 * Full Maverlang chat shell mounted inside ProgramBI /ai routes.
 * Keeps Maverlang chat UI + providers without rewriting chat functions.
 */
export function AiChatShell() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <TooltipProvider delayDuration={0}>
        <AuthSync />
        <SidebarProvider>
          <div className="flex h-svh w-full overflow-hidden bg-background text-foreground">
            <AppSidebar />
            <SidebarInset className="flex min-w-0 flex-1 flex-col overflow-hidden">
              <ChatLanding />
            </SidebarInset>
          </div>
        </SidebarProvider>
        <Toaster richColors position="top-center" />
      </TooltipProvider>
    </ThemeProvider>
  );
}
