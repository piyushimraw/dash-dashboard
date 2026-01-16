import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function CarAvailabilityAssignmentPage() {
  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-xl">Car Availability and Assignment</CardTitle>
          <CardDescription>
            View available inventory and assign vehicles to reservations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 text-sm">
          <section className="space-y-2">
            <p className="font-semibold text-foreground">Availability View</p>
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Show available cars by class, location, and status.</li>
              <li>Filter by fuel level, mileage, and service readiness.</li>
            </ul>
          </section>
          <section className="space-y-2">
            <p className="font-semibold text-foreground">Assignment</p>
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Assign a vehicle to a reservation with a single action.</li>
              <li>Record assignment time and the responsible agent.</li>
            </ul>
          </section>
        </CardContent>
      </Card>
    </main>
  );
}
