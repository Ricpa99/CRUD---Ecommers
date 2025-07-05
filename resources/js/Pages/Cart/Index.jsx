import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { FiTrash2, FiPlus, FiMinus, FiX, FiCheckCircle, FiInfo, FiAlertTriangle, FiShoppingCart } from 'react-icons/fi';
import { debounce } from 'lodash';

// Komponen Notifikasi Toast
const Toast = ({ message, show, onHide, type = 'success' }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onHide();
            }, 3000); 
            return () => clearTimeout(timer);
        }
    }, [show, onHide]);

    const isSuccess = type === 'success';

    return (
        <div className={`fixed top-5 right-5 bg-white shadow-lg rounded-lg p-4 z-50 transition-all duration-300 ease-in-out max-w-sm w-full ${show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    {isSuccess ? <FiCheckCircle className="h-6 w-6 text-green-500" /> : <FiInfo className="h-6 w-6 text-blue-500" />}
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-bold text-gray-900">{isSuccess ? 'Success' : 'Information'}</p>
                    <p className="mt-1 text-sm text-gray-600">{message}</p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                    <button onClick={onHide} className="inline-flex text-gray-400 hover:text-gray-500">
                        <FiX size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Komponen Modal Konfirmasi Baru
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <div className="flex items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <FiAlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">{children}</p>
                        </div>
                    </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={onConfirm}
                    >
                        Yes, Clear
                    </button>
                    <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};


// Komponen untuk setiap item di keranjang
const CartItem = ({ item }) => {
    const [quantity, setQuantity] = useState(item.quantity);

    const updateQuantity = debounce((newQuantity) => {
        router.patch(route('cart.update', item.id), { quantity: newQuantity }, { preserveScroll: true });
    }, 500);

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity < 1) return;
        setQuantity(newQuantity);
        updateQuantity(newQuantity);
    };

    return (
        <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center flex-grow">
                <img src={item.product.image_url} alt={item.product.name} className="w-20 h-20 object-cover rounded-md mr-4" />
                <div>
                    <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">${item.product.price}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-md">
                    <button onClick={() => handleQuantityChange(quantity - 1)} className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-md">-</button>
                    <span className="px-4 py-1 text-center w-12">{quantity}</span>
                    <button onClick={() => handleQuantityChange(quantity + 1)} className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-md">+</button>
                </div>
                <p className="font-semibold w-24 text-right">${(item.product.price * quantity).toFixed(2)}</p>
                <Link href={route('cart.destroy', item.id)} method="delete" as="button" className="text-red-500 hover:text-red-700" title="Remove item">
                    <FiTrash2 size={20} />
                </Link>
            </div>
        </div>
    );
};

// Komponen utama halaman Cart
export default function CartIndex({ auth, cartItems, orderSummary }) {
    const { flash } = usePage().props;
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false); // State untuk modal konfirmasi

    // Menampilkan toast ketika ada flash message
    useEffect(() => {
        if (flash?.message) {
            setToastMessage(flash.message);
            setShowToast(true);
        }
    }, [flash]);

    // Fungsi untuk menghapus semua isi keranjang
    const handleClearCart = () => {
        router.delete(route('cart.clear'), {
            onSuccess: () => setIsConfirmOpen(false),
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Shopping Cart" />
            
            <Toast message={toastMessage} show={showToast} onHide={() => setShowToast(false)} />

            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleClearCart}
                title="Clear Shopping Cart"
            >
                Are you sure you want to remove all items from your shopping cart? This action cannot be undone.
            </ConfirmationModal>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="font-semibold text-2xl text-gray-800 leading-tight">Shopping Cart</h2>
                            <p className="text-sm text-gray-500 mt-1">{cartItems.length} items in your cart</p>
                        </div>
                        {cartItems.length > 0 && (
                            <button 
                                onClick={() => setIsConfirmOpen(true)}
                                className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-md hover:bg-red-600 transition-colors flex items-center gap-2"
                            >
                                <FiTrash2 />
                                Clear Cart
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.length > 0 ? (
                                cartItems.map(item => <CartItem key={item.id} item={item} />)
                            ) : (
                                <div className="bg-white p-12 text-center rounded-lg shadow-sm border flex flex-col items-center justify-center min-h-[50vh]">
                                    <FiShoppingCart size={48} className="text-gray-300 mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-700">Your Cart is Empty</h3>
                                    <p className="text-gray-500 mt-2">Looks like you haven't added anything to your cart yet.</p>
                                    <Link href={route('shop.index')} className="mt-6 inline-block bg-indigo-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                                        Start Shopping
                                    </Link>
                                </div>
                            )}
                        </div>

                        {cartItems.length > 0 && (
                            <div className="lg:col-span-1">
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                    <h3 className="text-lg font-semibold border-b pb-4">Order Summary</h3>
                                    <div className="space-y-3 mt-4 text-sm text-gray-600">
                                        <div className="flex justify-between"><span>Subtotal</span><span>${orderSummary.subtotal}</span></div>
                                        <div className="flex justify-between"><span>Shipping</span><span className="text-green-500">Free</span></div>
                                        <div className="flex justify-between"><span>Tax (10%)</span><span>${orderSummary.tax}</span></div>
                                        <div className="flex justify-between font-bold text-base text-gray-800 border-t pt-3 mt-3"><span>Total</span><span>${orderSummary.total}</span></div>
                                    </div>
                                    <Link 
                                        href={route('checkout.index')}
                                        className="w-full block text-center bg-gray-800 text-white py-3 rounded-md mt-6 hover:bg-gray-900 transition-colors"
                                    >
                                        Proceed to Checkout
                                    </Link>
                                    <Link href={route('shop.index')} className="w-full text-center mt-3 inline-block text-sm text-indigo-600 hover:underline">
                                        or Continue Shopping
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
