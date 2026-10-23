import LegalPage from "../../components/static/LegalPage";

const sections = [
    {
        heading: "Shipping rates",
        paragraphs: ["Shipping is a flat $5.99 per order. Orders with a subtotal of $75 or more (after any coupon discount) ship free. The exact shipping cost is shown in your cart and again at checkout before you pay."],
    },
    {
        heading: "Delivery times",
        paragraphs: ["We start preparing your order as soon as Stripe confirms your payment. Most orders arrive within 3 to 7 business days of payment. Your estimated delivery window is shown on your order confirmation and on the Track Order page."],
        list: ["Business days are Monday to Friday, excluding public holidays.", "Delivery estimates can be affected by carrier delays or severe weather.", "Each order ships to the address you enter at checkout, so please double-check it before paying."],
    },
    {
        heading: "Tracking your order",
        paragraphs: ["Sign in and open My Orders, or use Track Order with your order number (it looks like SS-1A2B3C4D). Each order shows its current status (processing, shipped or delivered) and a full history."],
    },
    {
        heading: "30-day returns",
        paragraphs: ["If you’re not happy with a purchase, you can return it within 30 days of delivery for a full refund of the item price."],
        list: ["Items must be unused and in their original packaging with all accessories.", "Items that arrive damaged or faulty can always be returned, please contact us with your order number and a photo.", "Gift cards and items marked as final sale are not returnable.", "Return shipping is free if the item was faulty or sent in error; otherwise the cost of sending it back is paid by the customer."],
    },
    {
        heading: "How to start a return",
        list: ["Contact us with your order number and the items you’d like to return.", "We’ll reply with a return address and instructions.", "Send the items back and keep your tracking number.", "Once we receive and inspect the items, we issue your refund."],
    },
    {
        heading: "Refunds",
        paragraphs: ["Refunds are issued to your original payment method through Stripe. After we issue a refund, your bank or card issuer usually shows it within 5 to 10 business days. Shipping fees are refunded only when the return is due to our error."],
    },
    {
        heading: "Cancelling an order",
        paragraphs: ["You can cancel an unpaid order at any time from My Orders. If your order has already been paid and is being prepared, contact us as soon as possible and we’ll do our best to stop it before it ships."],
    },
];

export default function ShippingReturnsPage() {
    return <LegalPage title="Shipping & returns" description="Shipping rates, delivery times and our 30-day return policy." sections={sections} />;
}
