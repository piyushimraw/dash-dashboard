import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ReservationLookupPage() {
  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-xl">Reservation Lookup</CardTitle>
          <CardDescription>
            Search by customer details and review reservation information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 text-sm">
          <section className="space-y-2">
            <p className="font-semibold text-foreground">Search Criteria</p>
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Search by name, email, or phone number.</li>
              <li>Support partial matches with recent reservations surfaced first.</li>
            </ul>
          </section>
          <section className="space-y-2">
            <p className="font-semibold text-foreground">Reservation Details</p>
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Display pickup and return locations, dates, and times.</li>
              <li>Show vehicle class, rate plan, and pricing breakdown.</li>
              <li>Surface customer profile notes and loyalty status.</li>
            </ul>
          </section>
        </CardContent>
      </Card>
    </main>
  );
}
