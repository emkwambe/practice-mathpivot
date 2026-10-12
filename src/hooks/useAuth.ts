import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-react";
import { useMemo } from "react";

export function useAuth() {
  const { isSignedIn, isLoaded, signOut } = useClerkAuth();
  const { user } = useUser();

  return useMemo(
    () => ({
      user: user
        ? {
            id: user.id,
            name: user.fullName || user.username || "User",
            email: user.primaryEmailAddress?.emailAddress,
            avatar: user.imageUrl,
          }
        : null,
      isAuthenticated: !!isSignedIn,
      isLoading: !isLoaded,
      error: null,
      logout: signOut,
      refresh: () => {},
    }),
    [user, isSignedIn, isLoaded, signOut],
  );
}
