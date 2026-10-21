import React, { useState, useEffect } from "react";
import { ArrowRight, Sparkles, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";

const HeroBanner = () => {
    
    const slides = [
        {
            id: 1,
            badge: "Next-Gen Audio & Lifestyle",
            titleFirst: "Better Products",
            titleSecond: "For A Brighter Future",
            description: "Discover meticulously engineered premium quality products at unmatched prices. Shop smart, live better, and elevate your everyday lifestyle with ShopSphere.",
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80", // Headphone
            alt: "Modern wireless headphones"
        },
        {
            id: 2,
            badge: "Smart Tech & Wearables",
            titleFirst: "Experience Innovation",
            titleSecond: "Beyond Your Limits",
            description: "Upgrade your daily routine with cutting-edge smart devices and minimalist accessories designed for ultimate performance and sleek aesthetics.",
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80", // Watch
            alt: "Minimalist smart watch"
        },
        {
            id: 3,
            badge: "Exclusive Collection",
            titleFirst: "Timeless Design",
            titleSecond: "Uncompromising Quality",
            description: "Handcrafted minimalist essentials built with Matte Black & Deep Forest Green elegance. Discover pieces that define your unique style.",
            image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1000&q=80", // Camera
            alt: "Vintage camera"
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    // অটো-প্লে স্লাইডার (প্রতি ৪ সেকেন্ড পরপর বদলাবে)
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
    };

    const currentSlide = slides[currentIndex];

    return (
        <section className="relative overflow-hidden bg-[#121614] py-8 sm:py-12 px-5 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-[1440px]">

                {/* Banner Card Container */}
                <div className="relative overflow-hidden rounded-3xl border border-[#1f2924] bg-gradient-to-r from-[#0d1411] via-[#15241d]/40 to-[#0d1411] p-6 sm:p-10 lg:p-16 shadow-2xl transition-all duration-500">

                    {/* Background Decorative Glow */}
                    <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#10B981]/10 blur-3xl pointer-events-none" />
                    <div className="absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-[#10B981]/5 blur-3xl pointer-events-none" />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10 min-h-[380px]">

                        {/* Left Content Column */}
                        <div className="lg:col-span-7 flex flex-col items-start text-left transition-opacity duration-500">

                            {/* Professional Badge */}
                            <div className="inline-flex items-center gap-2 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 px-4 py-1.5 mb-6 text-xs font-semibold uppercase tracking-widest text-[#10B981]">
                                <Sparkles size={14} />
                                <span>{currentSlide.badge}</span>
                            </div>

                            {/* Main Title */}
                            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
                                {currentSlide.titleFirst} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] via-[#34d399] to-emerald-200">
                                    {currentSlide.titleSecond}
                                </span>
                            </h1>

                            {/* Description */}
                            <p className="mt-4 text-base sm:text-lg text-gray-300 max-w-xl leading-relaxed">
                                {currentSlide.description}
                            </p>

                            {/* CTA Button & Trust Indicator */}
                            <div className="mt-8 flex flex-wrap items-center gap-4">
                                <a
                                    href="/shop"
                                    className="group inline-flex items-center gap-3 rounded-2xl bg-[#10B981] px-8 py-4 text-sm font-bold text-[#121614] shadow-lg shadow-[#10B981]/25 transition-all duration-300 hover:bg-[#0ea5e9] hover:text-white hover:scale-[1.02] active:scale-95"
                                >
                                    <span>Shop Now</span>
                                    <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                                </a>

                                <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400 pl-2 border-l border-[#1f2924]">
                                    <ShieldCheck size={18} className="text-[#10B981]" />
                                    <span>100% Secure Checkout & Free Returns</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Image Column */}
                        <div className="lg:col-span-5 flex justify-center items-center">
                            <div className="relative group w-full max-w-md lg:max-w-none">
                                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#10B981]/20 to-transparent blur-xl opacity-50 group-hover:opacity-100 transition duration-500" />

                                <div className="relative overflow-hidden rounded-2xl border border-[#22332a] bg-[#090e0c] shadow-2xl flex items-center justify-center p-4">
                                    <img
                                        src={currentSlide.image}
                                        alt={currentSlide.alt}
                                        className="h-[260px] sm:h-[320px] w-full object-cover rounded-xl transition-transform duration-700 hover:scale-105"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Slider Navigation Controls (Arrows & Dots) */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#1f2924]">
                        {/* Pagination Dots */}
                        <div className="flex items-center gap-2">
                            {slides.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    aria-label={`Go to slide ${idx + 1}`}
                                    className={`h-2.5 rounded-full transition-all duration-300 ${currentIndex === idx ? "w-8 bg-[#10B981]" : "w-2.5 bg-[#22332a] hover:bg-gray-600"
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Left/Right Buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={prevSlide}
                                aria-label="Previous slide"
                                className="rounded-full border border-[#22332a] bg-[#0d1411] p-2.5 text-gray-300 transition-colors hover:border-[#10B981] hover:text-[#10B981]"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                onClick={nextSlide}
                                aria-label="Next slide"
                                className="rounded-full border border-[#22332a] bg-[#0d1411] p-2.5 text-gray-300 transition-colors hover:border-[#10B981] hover:text-[#10B981]"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default HeroBanner;