import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { SoloTravelerSection } from "@/components/landing/solo-traveler-section"
import { EmotionAwareSection } from "@/components/landing/emotion-aware-section"
import { CtaSection } from "@/components/landing/cta-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <SoloTravelerSection />
      <EmotionAwareSection />
      <CtaSection />
      <Footer />
    </main>
  )
}
