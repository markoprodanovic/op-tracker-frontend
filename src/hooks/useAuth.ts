import { useSession } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    isAdmin: session?.user?.isAdmin || false,
    isLoading: status === "loading",
    isAuthenticated: !!session,
  };
}
