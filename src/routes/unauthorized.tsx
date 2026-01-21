import Unauthorized from "@/pages/UnAuthorized";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/unauthorized")({
  component: Unauthorized,
});
