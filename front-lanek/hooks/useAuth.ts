import { useUserContext } from "../context/userContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useAuth = (requireAuth: boolean = false) => {
  const { user, loading } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        router.replace("/");
      }
      if (!requireAuth && user) {
        router.replace("/emissions");
      }
    }
  }, [user, loading, requireAuth, router]);

  return { user, loading };
};
