import { ReturnsPage } from "@/pages/ReturnsPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/returns")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ReturnsPage />;
}
