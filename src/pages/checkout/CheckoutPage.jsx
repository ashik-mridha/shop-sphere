import { useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, RotateCcw, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import usePageMeta from "../../hooks/usePageMeta";
import useCart from "../../hooks/useCart";
import useAuth from "../../hooks/useAuth";
import useFetch from "../../hooks/useFetch";
import { api, errorMessage } from "../../lib/api";
import { COUNTRIES, formatMoney } from "../../lib/format";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Checkbox, Input, Select } from "../../components/ui/Input";
import LazyImage from "../../components/ui/LazyImage";
import OrderSummary from "../../components/cart/OrderSummary";
import useQuote from "../../components/cart/useQuote";

const schema = z.object({
    fullName: z.string().trim().min(2, "Enter the recipient’s full name").max(100),
    phone: z.string().trim().min(7, "Enter a phone number with at least 7 digits").max(20, "Phone number is too long"),
    line1: z.string().trim().min(3, "Enter a street address").max(150),
    line2: z.string().trim().max(150).optional(),
    city: z.string().trim().min(2, "Enter a city").max(80),
    state: z.string().trim().min(1, "Enter a state or region").max(80),
    postalCode: z.string().trim().min(3, "Enter a valid postal code").max(12, "Postal code is too long"),
    country: z.string().length(2, "Select a country"),
});

const emptyAddress = { fullName: "", phone: "", line1: "", line2: "", city: "", state: "", postalCode: "", country: "US" };

export default function CheckoutPage() {
    usePageMeta("Checkout", "Enter your shipping address and pay securely with Stripe.");
    const { user } = useAuth();
    const cart = useCart();
    const { quote, loading: quoting, error: quoteError } = useQuote(cart.items, cart.couponCode);
    const { data: addressData } = useFetch("/addresses");
    const addresses = addressData?.data || [];
    const [paying, setPaying] = useState(false);
    const [serverError, setServerError] = useState("");
    const [saveAddress, setSaveAddress] = useState(false);
    const [picked, setPicked] = useState(null); // null = user has not touched the selector
    const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];
    const selected = picked ?? defaultAddress?._id ?? "";
    const prefilled = useRef(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { ...emptyAddress, fullName: user?.name || "" },
    });

    // Preselect the default saved address once, as soon as the list arrives.
    useEffect(() => {
        if (prefilled.current || !addressData) return;
        prefilled.current = true;
        const def = addressData.data.find((a) => a.isDefault) || addressData.data[0];
        if (def) reset({ ...emptyAddress, ...def });
    }, [addressData, reset]);

    if (cart.items.length === 0 && !paying) return <Navigate to="/cart" replace />;

    function chooseAddress(e) {
        const id = e.target.value;
        setPicked(id);
        const found = addresses.find((a) => a._id === id);
        reset(found ? { ...emptyAddress, ...found } : { ...emptyAddress, fullName: user?.name || "" });
    }

    const blocked = !quote || quote.lines.some((l) => l.unavailable || !l.available);

    async function onSubmit(values) {
        if (blocked) {
            toast.error("Some items in your cart are unavailable. Please review your cart.");
            return;
        }
        setPaying(true);
        setServerError("");
        const shippingAddress = { ...values, line2: values.line2 || "" };
        try {
            if (saveAddress && !selected) {
                await api.post("/addresses", { ...shippingAddress, label: "Home" }).catch(() => {
                    toast.error("We couldn’t save this address, but your order can continue.");
                });
            }
            const res = await api.post("/payments/create-checkout-session", {
                items: cart.items.map((i) => ({
                    productId: i.productId,
                    quantity: i.quantity,
                    ...(i.variant && (i.variant.size || i.variant.color) && { variant: i.variant }),
                })),
                couponCode: cart.couponCode || "",
                shippingAddress,
            });
            window.location.assign(res.url);
        } catch (error) {
            let message = errorMessage(error);
            if (error.status === 503) message = "Online payments are temporarily unavailable. Please try again later.";
            setServerError(message);
            toast.error(message);
            setPaying(false);
        }
    }

    return (
        <>
            <PageHeader title="Checkout" description="Step 1 of 2 · Shipping details. You’ll pay on Stripe’s secure page next." />

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-6 lg:grid-cols-[1fr_400px]">
                <div className="space-y-6">
                    <Card>
                        <h2 className="mb-4 text-lg font-bold">Shipping address</h2>

                        {addresses.length > 0 && (
                            <Select label="Saved addresses" value={selected} onChange={chooseAddress} wrapperClassName="mb-4">
                                <option value="">Enter a new address</option>
                                {addresses.map((a) => (
                                    <option key={a._id} value={a._id}>{a.label} · {a.line1}, {a.city}{a.isDefault ? " (default)" : ""}</option>
                                ))}
                            </Select>
                        )}

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Input label="Full name" required autoComplete="name" error={errors.fullName?.message} wrapperClassName="sm:col-span-2" {...register("fullName")} />
                            <Input label="Phone" type="tel" required autoComplete="tel" error={errors.phone?.message} wrapperClassName="sm:col-span-2" {...register("phone")} />
                            <Input label="Street address" required autoComplete="address-line1" error={errors.line1?.message} wrapperClassName="sm:col-span-2" {...register("line1")} />
                            <Input label="Apartment, suite, etc. (optional)" autoComplete="address-line2" error={errors.line2?.message} wrapperClassName="sm:col-span-2" {...register("line2")} />
                            <Input label="City" required autoComplete="address-level2" error={errors.city?.message} {...register("city")} />
                            <Input label="State / region" required autoComplete="address-level1" error={errors.state?.message} {...register("state")} />
                            <Input label="Postal code" required autoComplete="postal-code" error={errors.postalCode?.message} {...register("postalCode")} />
                            <Select label="Country" required autoComplete="country" error={errors.country?.message} {...register("country")}>
                                {COUNTRIES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
                            </Select>
                        </div>

                        {!selected && <Checkbox label="Save this address for next time" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} className="mt-4" />}
                    </Card>

                    <Card>
                        <h2 className="mb-3 text-lg font-bold">Payment</h2>
                        <p className="flex items-start gap-3 text-sm text-muted">
                            <ShieldCheck size={20} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                            You’ll be redirected to Stripe’s hosted checkout to enter your card details. Your card information goes straight to Stripe and is never stored on ShopSphere.
                        </p>
                    </Card>
                </div>

                <aside aria-label="Order summary" className="lg:sticky lg:top-24 lg:self-start">
                    <Card>
                        <h2 className="mb-4 text-lg font-bold">Order summary</h2>
                        <ul className="mb-5 max-h-64 space-y-3 overflow-y-auto pr-1">
                            {cart.items.map((i) => (
                                <li key={cart.lineKey(i)} className="flex items-center gap-3">
                                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-surface-2">
                                        <LazyImage src={i.image} alt="" className="h-full w-full object-cover" />
                                        <span className="absolute -right-0 -top-0 flex h-5 min-w-5 items-center justify-center rounded-bl-lg bg-fg px-1 text-[11px] font-bold text-bg">{i.quantity}</span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="line-clamp-2 text-sm font-medium">{i.title}</p>
                                        {(i.variant?.color || i.variant?.size) && <p className="text-xs text-muted">{[i.variant.color, i.variant.size].filter(Boolean).join(" / ")}</p>}
                                    </div>
                                    <p className="text-sm font-semibold">{formatMoney(i.price * i.quantity)}</p>
                                </li>
                            ))}
                        </ul>

                        <OrderSummary quote={quote} loading={quoting} />
                        {quoteError && !quote && <p role="alert" className="mt-3 text-sm text-danger">{quoteError.message}</p>}
                        {quote && blocked && (
                            <p role="alert" className="mt-3 text-sm text-danger">
                                Some items are unavailable. <Link to="/cart" className="font-semibold underline">Review your cart</Link>.
                            </p>
                        )}
                        {serverError && <p role="alert" className="mt-3 rounded-lg bg-danger-soft px-3 py-2 text-sm font-medium text-danger">{serverError}</p>}

                        <Button type="submit" size="lg" className="mt-6 w-full" loading={paying} disabled={!quote || blocked}>
                            <Lock size={16} aria-hidden="true" />
                            {paying ? "Redirecting to Stripe…" : `Pay ${quote ? formatMoney(quote.total) : ""} with Stripe`}
                        </Button>
                        <p className="mt-3 text-center text-xs text-muted">Secure checkout · Powered by Stripe</p>

                        <div className="mt-5 flex items-start gap-2.5 border-t border-line pt-4 text-xs text-muted">
                            <RotateCcw size={15} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                            <p>30-day returns on unused items in original packaging, refunded to your original payment method. <Link to="/shipping-returns" className="font-semibold text-primary hover:underline">Read the policy</Link></p>
                        </div>
                    </Card>
                </aside>
            </form>
        </>
    );
}
