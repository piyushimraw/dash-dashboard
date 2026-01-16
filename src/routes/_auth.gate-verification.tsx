import { GateVerificationPage } from "@/pages/GateVerificationPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/gate-verification")({
  component: RouteComponent,
});

function RouteComponent() {
  return <GateVerificationPage />;
}
