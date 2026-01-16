import { RentalAgreementGenerationPage } from "@/pages/RentalAgreementGenerationPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/rental-agreement-generation")({
  component: RouteComponent,
});

function RouteComponent() {
  return <RentalAgreementGenerationPage />;
}
