import HeroSearch from "@/components/hero-search";
import DestinationCard from "@/components/destination-card";
import ProductJsonLd from "@/components/product-json-ld";

export default function Home() {
  return (
    <>
      <ProductJsonLd />
      <main className="min-h-screen">
        <HeroSearch />
        
        {/* Featured Destinations Section */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8">Popular Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DestinationCard
              name="Grčka"
              imageUrl="https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800"
              price="Od 399€"
              description="Ostrva i antička istorija"
            />
            <DestinationCard
              name="Turska"
              imageUrl="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800"
              price="Od 349€"
              description="Egzotika i kultura"
            />
            <DestinationCard
              name="Hrvatska"
              imageUrl="https://images.unsplash.com/photo-1555990538-9f59c4715007?w=800"
              price="Od 299€"
              description="Jadransko more i priroda"
            />
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  1
                </div>
                <h3 className="font-semibold mb-2">Search</h3>
                <p className="text-muted-foreground">
                  Tell us what you&apos;re looking for using natural language
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  2
                </div>
                <h3 className="font-semibold mb-2">Customize</h3>
                <p className="text-muted-foreground">
                  Build your perfect package with flights, hotels, and transfers
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  3
                </div>
                <h3 className="font-semibold mb-2">Book</h3>
                <p className="text-muted-foreground">
                  Secure your trip with instant confirmation
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
