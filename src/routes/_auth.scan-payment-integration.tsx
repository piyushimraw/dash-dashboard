import { ScanPaymentIntegrationPage } from "@/pages/ScanPaymentIntegrationPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/scan-payment-integration")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ScanPaymentIntegrationPage />;
}
