import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function RentalAgreementGenerationPage() {
  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-xl">Rental Agreement Generation</CardTitle>
          <CardDescription>
            Generate the rental agreement after payment and license validation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 text-sm">
          <section className="space-y-2">
            <p className="font-semibold text-foreground">Prerequisites</p>
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Payment is captured and confirmed via Stripe.</li>
              <li>Driver's license scan and validation are completed.</li>
            </ul>
          </section>
          <section className="space-y-2">
            <p className="font-semibold text-foreground">Agreement Output</p>
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Generate a printable agreement with pricing and terms.</li>
              <li>Capture signature and store a digital copy.</li>
              <li>Attach agreement ID to the reservation record.</li>
            </ul>
          </section>
        </CardContent>
      </Card>
    </main>
  );
}
