import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Checkbox, Input, Select } from "../ui/Input";
import { COUNTRIES } from "../../lib/format";

const addressFormSchema = z.object({
    label: z.string().trim().max(30).optional(),
    fullName: z.string().trim().min(2, "Enter the recipient’s full name").max(100),
    phone: z.string().trim().min(7, "Enter a valid phone number").max(20),
    line1: z.string().trim().min(3, "Enter the street address").max(150),
    line2: z.string().trim().max(150).optional(),
    city: z.string().trim().min(2, "Enter the city").max(80),
    state: z.string().trim().min(1, "Enter the state or region").max(80),
    postalCode: z.string().trim().min(3, "Enter the postal code").max(12),
    country: z.string().length(2, "Select a country"),
    isDefault: z.boolean().optional(),
});

const empty = { label: "Home", fullName: "", phone: "", line1: "", line2: "", city: "", state: "", postalCode: "", country: "US", isDefault: false };

/** Submit it from outside with <button form={formId} type="submit">. */
export default function AddressForm({ formId, address, onSubmit }) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(addressFormSchema),
        defaultValues: address ? { ...empty, ...address } : empty,
    });

    return (
        <form id={formId} onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4 sm:grid-cols-2">
            <Input label="Label" placeholder="Home, Office…" error={errors.label?.message} {...register("label")} />
            <Input label="Full name" autoComplete="name" required error={errors.fullName?.message} {...register("fullName")} />
            <Input label="Phone" type="tel" autoComplete="tel" required wrapperClassName="sm:col-span-2" error={errors.phone?.message} {...register("phone")} />
            <Input label="Address line 1" autoComplete="address-line1" required wrapperClassName="sm:col-span-2" error={errors.line1?.message} {...register("line1")} />
            <Input label="Address line 2" autoComplete="address-line2" wrapperClassName="sm:col-span-2" error={errors.line2?.message} {...register("line2")} />
            <Input label="City" autoComplete="address-level2" required error={errors.city?.message} {...register("city")} />
            <Input label="State / region" autoComplete="address-level1" required error={errors.state?.message} {...register("state")} />
            <Input label="Postal code" autoComplete="postal-code" required error={errors.postalCode?.message} {...register("postalCode")} />
            <Select label="Country" required error={errors.country?.message} {...register("country")}>
                {COUNTRIES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
            </Select>
            <Checkbox className="sm:col-span-2" label="Use as my default shipping address" {...register("isDefault")} />
        </form>
    );
}
