import { AccountView } from "@daveyplate/better-auth-ui";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useEffect } from "react";

import { resolveAccountView } from "@/lib/viewPaths";

export function AccountViewPage() {
  const { view: rawView } = useParams({ from: "/account/$view" });
  const navigate = useNavigate({ from: "/account/$view" });
  const { key: resolvedView, path } = resolveAccountView(rawView);

  useEffect(() => {
    if (rawView !== path) {
      navigate({
        to: "/account/$view",
        params: { view: path },
        replace: true,
        search: (current) => current,
      }).catch(() => {
        /* noop */
      });
    }
  }, [navigate, path, rawView]);

  return (
    <div className="mx-auto w-full max-w-5xl py-12">
      <AccountView view={resolvedView} />
    </div>
  );
}

export default AccountViewPage;
