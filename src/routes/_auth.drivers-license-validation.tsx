import { DriversLicenseValidationPage } from "@/pages/DriversLicenseValidationPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/drivers-license-validation")({
  component: RouteComponent,
});

function RouteComponent() {
  return <DriversLicenseValidationPage />;
}
