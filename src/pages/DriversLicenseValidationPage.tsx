import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function DriversLicenseValidationPage() {
  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-xl">Driver's License Scan & Validation</CardTitle>
          <CardDescription>
            Capture license data via scan or manual entry and validate it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 text-sm">
          <section className="space-y-2">
            <p className="font-semibold text-foreground">Capture Options</p>
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Integrate with a physical scanner device when available.</li>
              <li>Allow manual entry of license number, name, and state.</li>
            </ul>
          </section>
          <section className="space-y-2">
            <p className="font-semibold text-foreground">Validation Checks</p>
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Verify expiration date, class, and issuing state.</li>
              <li>Match license details against the reservation profile.</li>
              <li>Flag exceptions for supervisor review.</li>
            </ul>
          </section>
        </CardContent>
      </Card>
    </main>
  );
}
