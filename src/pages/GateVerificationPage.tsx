import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function GateVerificationPage() {
  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-xl">Gate Verification</CardTitle>
          <CardDescription>
            Confirm clearance so gate agents can allow customer exits.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 text-sm">
          <section className="space-y-2">
            <p className="font-semibold text-foreground">Verification Checks</p>
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Validate rental agreement status and payment completion.</li>
              <li>Confirm assigned vehicle and license verification.</li>
            </ul>
          </section>
          <section className="space-y-2">
            <p className="font-semibold text-foreground">Gate Agent Actions</p>
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Provide a clear "ready to exit" status for each customer.</li>
              <li>Log agent approval and exit timestamp.</li>
            </ul>
          </section>
        </CardContent>
      </Card>
    </main>
  );
}
