import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

// Komponen untuk Order Summary Item
const OrderSummaryItem = ({ item }) => (
    <div className="flex justify-between items-center text-sm">
        <div className="flex items-center">
            <img src={item.product.image_url} alt={item.product.name} className="w-12 h-12 object-cover rounded-md mr-3" />
            <div>
                <p className="font-semibold text-gray-800">{item.product.name}</p>
                <p className="text-gray-500">Qty: {item.quantity}</p>
            </div>
        </div>
        <p className="font-medium text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</p>
    </div>
);

// Komponen utama halaman Checkout
export default function CheckoutIndex({ auth, cartItems, orderSummary }) {
    const { data, setData, post, processing, errors } = useForm({
        first_name: auth.user.name.split(' ')[0] || '',
        last_name: auth.user.name.split(' ').slice(1).join(' ') || '',
        email: auth.user.email || '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        card_holder: '',
        card_number: '',
        expiry_date: '',
        cvv: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('checkout.store'));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Checkout" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <h2 className="font-semibold text-2xl text-gray-800 leading-tight mb-1">Checkout</h2>
                    <p className="text-sm text-gray-500 mb-6">Complete your purchase</p>

                    <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            {/* Shipping Information */}
                            <div className="bg-white p-6 rounded-lg shadow-sm border">
                                <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="first_name" value="First Name" />
                                        <TextInput maxLength="20" id="first_name" value={data.first_name} onChange={e => setData('first_name', e.target.value)} className="mt-1 block w-full" required />
                                        <InputError message={errors.first_name} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="last_name" value="Last Name" />
                                        <TextInput maxLength="20" id="last_name" value={data.last_name} onChange={e => setData('last_name', e.target.value)} className="mt-1 block w-full" required />
                                        <InputError message={errors.last_name} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="email" value="Email" />
                                        <TextInput maxLength="20" id="email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="mt-1 block w-full" required />
                                        <InputError message={errors.email} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="phone" value="Phone" />
                                        <TextInput id="phone" value={data.phone} onChange={e => setData('phone', e.target.value)} className="mt-1 block w-full" required />
                                        <InputError message={errors.phone} className="mt-2" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <InputLabel htmlFor="address" value="Address" />
                                        <TextInput maxLength="20" id="address" value={data.address} onChange={e => setData('address', e.target.value)} className="mt-1 block w-full" required />
                                        <InputError message={errors.address} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="city" value="City" />
                                        <TextInput maxLength="20" id="city" value={data.city} onChange={e => setData('city', e.target.value)} className="mt-1 block w-full" required />
                                        <InputError message={errors.city} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="state" value="State" />
                                        <TextInput maxLength="20" id="state" value={data.state} onChange={e => setData('state', e.target.value)} className="mt-1 block w-full" required />
                                        <InputError message={errors.state} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="zip_code" value="ZIP Code" />
                                        <TextInput maxLength="20" id="zip_code" value={data.zip_code} onChange={e => setData('zip_code', e.target.value)} className="mt-1 block w-full" required />
                                        <InputError message={errors.zip_code} className="mt-2" />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Information */}
                            <div className="bg-white p-6 rounded-lg shadow-sm border">
                                <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <InputLabel htmlFor="card_holder" value="Cardholder Name" />
                                        <TextInput maxLength="20" id="card_holder" value={data.card_holder} onChange={e => setData('card_holder', e.target.value)} className="mt-1 block w-full" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="card_number" value="Card Number" />
                                        <TextInput maxLength="20" id="card_number" placeholder="9638 9473 2750 9318" value={data.card_number} onChange={e => setData('card_number', e.target.value)} className="mt-1 block w-full" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <InputLabel htmlFor="expiry_date" value="Expiry Date" />
                                            <TextInput maxLength="20" id="expiry_date" placeholder="MM/YY" value={data.expiry_date} onChange={e => setData('expiry_date', e.target.value)} className="mt-1 block w-full" />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="cvv" value="CVV" />
                                            <TextInput maxLength="20" id="cvv" placeholder="1234" value={data.cvv} onChange={e => setData('cvv', e.target.value)} className="mt-1 block w-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Kolom Kanan: Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-24">
                                <h3 className="text-lg font-semibold border-b pb-4 mb-4">Order Summary</h3>
                                <div className="space-y-4 mb-4">
                                    {cartItems.map(item => <OrderSummaryItem key={item.id} item={item} />)}
                                </div>
                                <div className="border-t pt-4 space-y-3 text-sm text-gray-600">
                                    <div className="flex justify-between"><span>Subtotal</span><span>${orderSummary.subtotal}</span></div>
                                    <div className="flex justify-between"><span>Shipping</span><span className="text-green-500">Free</span></div>
                                    <div className="flex justify-between"><span>Tax (10%)</span><span>${orderSummary.tax}</span></div>
                                    <div className="flex justify-between font-bold text-base text-gray-800 border-t pt-3 mt-3"><span>Total</span><span>${orderSummary.total}</span></div>
                                </div>
                                <PrimaryButton className="w-full mt-6 justify-center" disabled={processing}>
                                    Complete Order
                                </PrimaryButton>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
