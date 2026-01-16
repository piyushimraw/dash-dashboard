import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ReturnsPage() {
  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-xl">Returns</CardTitle>
          <CardDescription>
            Process limited returns and capture key closeout details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 text-sm">
          <section className="space-y-2">
            <p className="font-semibold text-foreground">Return Processing</p>
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Allow limited returns processing for eligible rentals.</li>
              <li>Capture mileage, fuel level, and condition notes.</li>
            </ul>
          </section>
          <section className="space-y-2">
            <p className="font-semibold text-foreground">Closeout</p>
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Calculate additional charges and update the final receipt.</li>
              <li>Mark the vehicle as ready for inspection or turnaround.</li>
            </ul>
          </section>
        </CardContent>
      </Card>
    </main>
  );
}
