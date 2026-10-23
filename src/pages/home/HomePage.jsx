import usePageMeta from "../../hooks/usePageMeta";
import Hero from "../../components/home/Hero";
import TrustBadges from "../../components/home/TrustBadges";
import CategoryGrid from "../../components/home/CategoryGrid";
import ProductSection from "../../components/home/ProductSection";
import DealsBanner from "../../components/home/DealsBanner";
import Testimonials from "../../components/home/Testimonials";
import { Brands, StatsStrip } from "../../components/home/BrandsStats";
import { NewsletterSection, FaqPreview } from "../../components/home/NewsletterFaq";

export default function HomePage() {
    usePageMeta(
        null,
        "Shop laptops, audio, smart-home gear and everyday essentials. Secure Stripe checkout, free shipping over $75 and 30-day returns."
    );

    return (
        <div className="space-y-12 sm:space-y-16">
            <Hero />
            <TrustBadges />
            <CategoryGrid />
            <ProductSection eyebrow="Popular" title="Trending right now" description="What other customers are buying most." params={{ sort: "popular" }} to="/shop?sort=popular" />
            <ProductSection eyebrow="Just in" title="New arrivals" params={{ isNew: "true", sort: "newest" }} to="/shop?sort=newest" limit={4} />
            <DealsBanner />
            <ProductSection eyebrow="Save" title="Deals and offers" description="Marked down from their regular price." params={{ onSale: "true", sort: "discount" }} to="/shop?onSale=true&sort=discount" limit={4} />
            <Testimonials />
            <StatsStrip />
            <Brands />
            <NewsletterSection />
            <FaqPreview />
        </div>
    );
}
