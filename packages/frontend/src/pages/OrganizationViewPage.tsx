import { OrganizationView } from "@daveyplate/better-auth-ui";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useEffect } from "react";

import { resolveOrganizationView } from "@/lib/viewPaths";

export function OrganizationViewPage() {
  const { slug: rawSlug, view: rawView } = useParams({
    from: "/organization/$slug/$view",
  });
  const navigate = useNavigate({ from: "/organization/$slug/$view" });
  const { key: resolvedView, path } = resolveOrganizationView(rawView);

  useEffect(() => {
    if (rawView !== path || rawSlug !== rawSlug?.trim()) {
      navigate({
        to: "/organization/$slug/$view",
        params: { slug: rawSlug?.trim() ?? "", view: path },
        replace: true,
        search: (current) => current,
      }).catch(() => {
        /* noop */
      });
    }
  }, [navigate, path, rawSlug, rawView]);

  return (
    <div className="mx-auto w-full max-w-5xl py-12">
      <OrganizationView slug={rawSlug?.trim()} view={resolvedView} />
    </div>
  );
}

export default OrganizationViewPage;
