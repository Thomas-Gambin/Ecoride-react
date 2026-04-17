import BenefitsSection from "./components/BenefitsSection"
import ConceptSection from "./components/ConceptSection"
import HeroSection from "./components/HeroSection"
import SiteFooter from "./components/SiteFooter"

const image1Src = "/image1.png"
const image2Src = "/image2.png"

export default function HomePage() {
  return (
    <main className="relative">
      <HeroSection
        imageSrc={image1Src}
        onSearchSubmit={() => {
          // noop: wiring futur
        }}
      />
      <ConceptSection imageSrc={image2Src} />
      <BenefitsSection />
      <SiteFooter />
    </main>
  )
}

