import React from "react";
import AboutHero from "./AboutHero";
import AboutStats from "./AboutStats";
import AboutStory from "./AboutStory";
import AboutFeatures from "./AboutFeatures";
import AboutCTA from "./AboutCTA";

const AboutPage = () => {
    return (
        <main className="min-h-screen bg-[#0a0f0d] text-gray-100 px-4 py-12 sm:px-6 lg:px-12">
            <div className="mx-auto max-w-7xl space-y-20">
                <AboutHero />
                <AboutStats />
                <AboutStory />
                <AboutFeatures />
                <AboutCTA />
            </div>
        </main>
    );
};

export default AboutPage;