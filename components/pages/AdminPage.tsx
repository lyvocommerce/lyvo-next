"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/design";

export default function AdminPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFetchAndNormalize = async () => {
    setIsLoading(true);
    setMessage("Fetching and normalizing data...");
    
    try {
      // TODO: Implement actual API call to fetch and normalize data
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      setMessage("Data fetched and normalized successfully!");
    } catch (error) {
      setMessage("Error: Failed to fetch and normalize data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToStore = () => {
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-tg-bg text-tg-text px-6 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Admin Panel</h1>
        
        <div className="space-y-4">
          <Button
            variant="primary"
            fullWidth
            onClick={handleFetchAndNormalize}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Fetch & Normalize API Data"}
          </Button>

          <Button
            variant="secondary"
            fullWidth
            onClick={handleGoToStore}
          >
            Go to Store
          </Button>
        </div>

        {message && (
          <div className="mt-6 p-4 rounded-lg bg-tg-secondary text-tg-text text-center">
            {message}
          </div>
        )}
      </div>
    </main>
  );
}
