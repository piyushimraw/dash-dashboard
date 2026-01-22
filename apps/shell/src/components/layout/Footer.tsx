import { Card, CardContent } from "@/components/ui/card";

export function Footer() {
  return (
    <footer className="flex-shrink-0">
      <Card className="w-full bg-tan/30 border-tan-dark/30 rounded-xs">
        <CardContent className="p-4 text-center">
          <p className="text-xs sm:text-sm font-medium text-foreground">
            Copyright (c) 2003 The Hertz Corporation - All Rights Reserved
          </p>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl mx-auto">
            The information contained herein is confidential and proprietary.
            Unauthorized use, duplication or disclosure is prohibited by law.
          </p>
        </CardContent>
      </Card>
    </footer>
  );
}
