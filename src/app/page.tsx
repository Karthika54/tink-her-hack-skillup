import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookUser, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <div className="flex justify-center items-center gap-4">
            <BookUser className="w-16 h-16 text-primary" />
            <h1 className="text-6xl font-bold text-foreground">
              SKILL-LINK
            </h1>
        </div>
        <p className="text-2xl text-muted-foreground italic">
          "teach what you know, learn what you love"
        </p>
        <div className="pt-4">
            <Button asChild size="lg">
            <Link href="/dashboard">
                Get Started <ArrowRight className="ml-2" />
            </Link>
            </Button>
        </div>
      </div>
    </div>
  );
}
