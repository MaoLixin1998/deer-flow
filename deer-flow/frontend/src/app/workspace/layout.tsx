import { redirect } from "next/navigation";

import { GatewayOfflineFallback } from "@/components/workspace/gateway-offline-fallback";
import { AuthProvider } from "@/core/auth/AuthProvider";
import { getServerSideUser } from "@/core/auth/server";
import { assertNever } from "@/core/auth/types";

import { WorkspaceContent } from "./workspace-content";

export const dynamic = "force-dynamic";

export default async function WorkspaceLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // 前端工作区的总入口，类似 Java Web 里的登录拦截器。
  // 这里在服务端渲染阶段先问 gateway 当前用户状态，再决定进入 workspace、
  // 跳转 /setup、跳转 /login，或展示 gateway 离线兜底页。
  const result = await getServerSideUser();

  switch (result.tag) {
    case "authenticated":
      return (
        <AuthProvider initialUser={result.user}>
          <WorkspaceContent>{children}</WorkspaceContent>
        </AuthProvider>
      );
    case "needs_setup":
      redirect("/setup");
    case "system_setup_required":
      redirect("/setup");
    case "unauthenticated":
      redirect("/login");
    case "gateway_unavailable":
      // GatewayOfflineFallback supplies the AuthProvider; WorkspaceContent
      // already mounts the banner inside its sidebar layout, so renderBanner
      // stays false here to avoid double-mounting.
      return (
        <GatewayOfflineFallback>
          <WorkspaceContent gatewayUnavailable>{children}</WorkspaceContent>
        </GatewayOfflineFallback>
      );
    case "config_error":
      throw new Error(result.message);
    default:
      assertNever(result);
  }
}
