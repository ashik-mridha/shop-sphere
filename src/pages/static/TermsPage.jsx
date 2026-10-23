import { Link } from "react-router-dom";
import LegalPage from "../../components/static/LegalPage";

const sections = [
    {
        heading: "Using ShopSphere",
        paragraphs: ["By creating an account or placing an order you agree to these terms. You must be at least 16 years old and provide accurate information. You are responsible for keeping your password confidential and for activity on your account."],
    },
    {
        heading: "Products and prices",
        paragraphs: ["We work to describe and photograph products accurately, but small differences in colour or packaging may occur. Prices are shown in US dollars. The price you pay is always calculated by our servers at checkout from the current catalogue price, and we may correct pricing errors, in which case we’ll offer you the choice to proceed at the correct price or cancel with a full refund."],
    },
    {
        heading: "Orders and payment",
        list: ["An order is confirmed once Stripe confirms your payment. Until then it shows as awaiting payment.", "Payments are processed by Stripe; its terms apply to the payment itself.", "We may cancel and fully refund an order if an item is out of stock or we suspect fraud.", "Estimated tax and shipping are shown before you pay."],
    },
    {
        heading: "Shipping and returns",
        paragraphs: ["Delivery times, shipping costs and the 30-day return policy are described on our Shipping & returns page and form part of these terms."],
    },
    {
        heading: "Coupons",
        paragraphs: ["Coupon codes have their own conditions (such as a minimum spend, an expiry date or a usage limit) shown when you apply them. One coupon can be used per order and coupons have no cash value."],
    },
    {
        heading: "Reviews",
        paragraphs: ["Only customers who have bought a product can review it. Reviews must be honest and respectful. We may hide reviews that contain abuse, spam or personal information."],
    },
    {
        heading: "Acceptable use",
        list: ["Don’t attempt to disrupt the site, scrape it at scale or bypass its security.", "Don’t use the store to commit fraud or place orders using payment methods you aren’t entitled to use.", "We may suspend accounts that break these rules."],
    },
    {
        heading: "Liability",
        paragraphs: ["Nothing in these terms limits your statutory consumer rights. Subject to those rights, ShopSphere isn’t liable for indirect or consequential losses, and our total liability for any order is limited to the amount you paid for it."],
    },
    {
        heading: "Changes and contact",
        paragraphs: ["We may update these terms from time to time; the date above shows the latest version. Your use of the store after a change means you accept the updated terms."],
    },
];

export default function TermsPage() {
    return (
        <>
            <LegalPage title="Terms of service" description="The rules for using ShopSphere and placing orders." sections={sections} />
            <p className="mx-auto mt-4 max-w-3xl text-sm text-muted">See also our <Link to="/privacy" className="font-semibold text-primary hover:underline">privacy policy</Link>.</p>
        </>
    );
}
