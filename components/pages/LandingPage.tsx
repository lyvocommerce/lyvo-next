"use client";

import Link from "next/link";
import Button from "@/components/design/Button";

export default function LandingPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-tg-bg text-tg-text p-5">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8 text-tg-text">
          Welcome to Lyvoshop!
        </h1>
        <Link href="/user">
          <Button variant="primary" fullWidth>
            Go to User Info
          </Button>
        </Link>
      </div>
    </main>
  );
}
