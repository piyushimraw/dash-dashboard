import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ScanPaymentIntegrationPage() {
  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-xl">Scan & Payment Integration</CardTitle>
          <CardDescription>
            Capture scans and process card payments with Stripe.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 text-sm">
          <section className="space-y-2">
            <p className="font-semibold text-foreground">Stripe Payments</p>
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Integrate Stripe for card-present and card-not-present flows.</li>
              <li>Collect authorization, capture, and receipts in one flow.</li>
              <li>Log payment status with reservation and rental IDs.</li>
            </ul>
          </section>
          <section className="space-y-2">
            <p className="font-semibold text-foreground">Scan Workflow</p>
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Attach scan records to the active reservation.</li>
              <li>Store scan timestamps and device identifiers.</li>
            </ul>
          </section>
        </CardContent>
      </Card>
    </main>
  );
}
