import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@packages/ui';
import { RotateCcw } from 'lucide-react';

import { ReturnVehicleForm } from './forms/ReturnVehicleForm';

export function ReturnPage() {
  return (
    <div className="w-full flex items-center justify-center px-4 py-6">
      <Card className="w-full max-w-lg shadow-lg rounded-2xl">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <RotateCcw className="h-6 w-6 text-primary" />
          </div>

          <CardTitle className="text-2xl font-semibold">Return Vehicle</CardTitle>

          <CardDescription>Complete the return process for a rented vehicle</CardDescription>
        </CardHeader>

        <CardContent>
          <ReturnVehicleForm />
        </CardContent>
      </Card>
    </div>
  );
}
