import React from "react";
import FooterNewsletter from "./FooterNewsletter";
import FooterLinks from "./FooterLinks";

const Footer = () => {
    return (
        <footer className="w-full bg-[#121614] text-gray-100 border-t border-[#1f2924]">
            {/* Newsletter Section */}
            <FooterNewsletter />

            {/* Links & Features Section */}
            <FooterLinks />
        </footer>
    );
};

export default Footer;