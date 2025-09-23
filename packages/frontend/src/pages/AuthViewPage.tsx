import { AuthView } from "@daveyplate/better-auth-ui";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useEffect } from "react";

import { resolveAuthView } from "@/lib/viewPaths";

export function AuthViewPage() {
  const { view: rawView } = useParams({ from: "/auth/$view" });
  const navigate = useNavigate({ from: "/auth/$view" });
  const { key: resolvedView, path } = resolveAuthView(rawView);

  useEffect(() => {
    if (rawView !== path) {
      navigate({
        to: "/auth/$view",
        params: { view: path },
        replace: true,
        search: (current) => current,
      }).catch(() => {
        /* noop */
      });
    }
  }, [navigate, path, rawView]);

  return (
    <div className="mx-auto w-full max-w-md py-12">
      <AuthView view={resolvedView} />
    </div>
  );
}

export default AuthViewPage;
