import { ReturnPage } from "@dash/mfe-returns";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/return")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ReturnPage />;
}
