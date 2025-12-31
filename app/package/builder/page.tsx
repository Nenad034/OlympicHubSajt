import PackageBuilder from "@/components/package-builder";
import { Suspense } from "react";

export const metadata = {
  title: "Build Your Package | OlympicHub",
  description: "Create your perfect travel package with flights, hotels, and transfers",
};

export default function PackageBuilderPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Build Your Perfect Package</h1>
        <Suspense fallback={<div>Loading package builder...</div>}>
          <PackageBuilder />
        </Suspense>
      </div>
    </main>
  );
}
