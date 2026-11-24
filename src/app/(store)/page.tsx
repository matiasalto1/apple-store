import { Benefits } from '@/sections/home/Benefits'
import { BrandStory } from '@/sections/home/BrandStory'
import { CampaignBanner } from '@/sections/home/CampaignBanner'
import { Categories } from '@/sections/home/Categories'
import { FeaturedProducts } from '@/sections/home/FeaturedProducts'
import { Hero } from '@/sections/home/Hero'
import { Newsletter } from '@/sections/home/Newsletter'
import { SmartPacks } from '@/sections/home/SmartPacks'
import { Social } from '@/sections/home/Social'
import { Testimonials } from '@/sections/home/Testimonials'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <CampaignBanner />
      <SmartPacks />
      <BrandStory />
      <Benefits />
      <Testimonials />
      <Social />
      <Newsletter />
    </>
  )
}
