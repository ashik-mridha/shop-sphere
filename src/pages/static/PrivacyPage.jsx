import LegalPage from "../../components/static/LegalPage";
import { SUPPORT_EMAIL } from "../../lib/config";

const sections = [
    {
        heading: "What we collect",
        list: [
            "Account details: your name, email address, profile picture (if you add one) and an encrypted password, or your Google account basics if you sign in with Google.",
            "Order details: the items you buy, order totals, shipping address and phone number so we can deliver and support your order.",
            "Saved data you choose to keep: addresses, wishlist items and product reviews.",
            "Messages you send us through the contact form, and your email address if you join the newsletter.",
        ],
    },
    {
        heading: "Payments",
        paragraphs: ["Payments are processed by Stripe on its own hosted checkout page. Your card number and security code are entered on Stripe and are never seen or stored by ShopSphere. We keep only a reference to the payment so we can confirm, track and refund your order."],
    },
    {
        heading: "How we use your information",
        list: ["To create and manage your account and sign you in securely.", "To process, deliver, track and refund your orders.", "To answer your questions and support requests.", "To send newsletter emails, only if you subscribed, and you can unsubscribe at any time.", "To keep the store secure and prevent fraud and abuse."],
    },
    {
        heading: "Cookies and local storage",
        paragraphs: ["We use a secure session cookie to keep you signed in. Your browser’s local storage remembers your cart and your light or dark theme choice on your device. We don’t use advertising cookies."],
    },
    {
        heading: "Sharing",
        paragraphs: ["We don’t sell your personal information. We share it only with service providers needed to run the store: Stripe for payments, our hosting and database providers, and delivery carriers (name, address and phone number) to deliver your order. We may disclose information if the law requires it."],
    },
    {
        heading: "Retention and security",
        paragraphs: ["We keep order records for as long as needed for accounting and legal obligations, and account data until you ask us to delete it. Connections to ShopSphere are encrypted, passwords are stored hashed, and access to administrative tools is restricted to authorised staff."],
    },
    {
        heading: "Your choices",
        paragraphs: [`You can update your name, picture, password and addresses from your dashboard, remove wishlist items at any time, and unsubscribe from the newsletter. To request a copy of your data or ask us to delete your account, email ${SUPPORT_EMAIL}.`],
    },
    {
        heading: "Children",
        paragraphs: ["ShopSphere is not intended for children under 16, and we do not knowingly collect their personal information."],
    },
    {
        heading: "Changes to this policy",
        paragraphs: ["If we change this policy in a meaningful way, we’ll update the date at the top of this page."],
    },
];

export default function PrivacyPage() {
    return <LegalPage title="Privacy policy" description="What personal information ShopSphere collects, why, and the choices you have." sections={sections} />;
}
