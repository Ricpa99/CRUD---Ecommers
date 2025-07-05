import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { FiEye, FiX } from 'react-icons/fi';
import { format } from 'date-fns';

// Komponen Modal untuk menampilkan detail pesanan
const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;

    const getStatusClass = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Order #{order.id} Details</h3>
                        <p className="text-sm text-gray-500">Placed on {format(new Date(order.created_at), 'P')}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><FiX size={24} /></button>
                </div>
                
                <div className="p-6 overflow-y-auto">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Order Status</p>
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusClass(order.status)}`}>{order.status}</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1 text-right">Total Amount</p>
                            <p className="text-2xl font-bold text-gray-900 text-right">${order.total_price}</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h4 className="font-semibold text-gray-700 mb-3">Items Ordered</h4>
                        <div className="space-y-3">
                            {order.items.map(item => (
                                <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                                    <div className="flex items-center">
                                        <img src={item.product.image_url} alt={item.product.name} className="w-14 h-14 object-cover rounded-md mr-4" />
                                        <div>
                                            <p className="font-semibold text-gray-800">{item.product.name}</p>
                                            <p className="text-sm text-gray-500">Quantity: {item.quantity} × ${item.price}</p>
                                        </div>
                                    </div>
                                    <p className="font-medium text-gray-900">${(item.quantity * item.price).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-700 mb-3">Shipping Information</h4>
                        <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-600">
                            <p className="font-semibold text-gray-800">{order.shipping_address.first_name} {order.shipping_address.last_name}</p>
                            <p>{order.shipping_address.address}</p>
                            <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip_code}</p>
                            <p className="mt-2">Email: {order.shipping_address.email}</p>
                            <p>Phone: {order.shipping_address.phone}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Komponen untuk setiap kartu pesanan di daftar
const OrderCard = ({ order, onViewDetails }) => {
    const getStatusClass = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-semibold text-gray-800">Order #{order.id}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                        <span>{format(new Date(order.created_at), 'P')}</span>
                        <span>${order.total_price}</span>
                        <span>{order.items.length} items</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusClass(order.status)}`}>
                        {order.status}
                    </span>
                    <button onClick={() => onViewDetails(order)} className="flex items-center gap-2 text-sm text-indigo-600 font-semibold hover:underline">
                        <FiEye /> View Details
                    </button>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex -space-x-4">
                    {order.items.slice(0, 5).map(item => (
                        <img key={item.id} className="w-12 h-12 object-cover rounded-full border-2 border-white" src={item.product.image_url} alt={item.product.name} />
                    ))}
                </div>
            </div>
        </div>
    );
};

// Komponen Pagination
const Pagination = ({ links }) => {
    if (links.length <= 3) return null;
    return (
        <div className="mt-8 flex justify-center">
            <div className="flex rounded-md shadow-sm">
                {links.map((link, index) => (
                    <Link key={index} href={link.url} className={`px-4 py-2 border text-sm font-medium ${link.active ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'} ${index === 0 ? 'rounded-l-md' : ''} ${index === links.length - 1 ? 'rounded-r-md' : ''} ${!link.url ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                ))}
            </div>
        </div>
    );
};

// Komponen utama halaman Orders
export default function OrdersIndex({ auth, orders }) {
    const [viewingOrder, setViewingOrder] = useState(null);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Order History" />
            
            <OrderDetailsModal order={viewingOrder} onClose={() => setViewingOrder(null)} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h2 className="font-semibold text-2xl text-gray-800 leading-tight">Order History</h2>
                        <p className="text-sm text-gray-500 mt-1">Track and manage your orders</p>
                    </div>

                    <div className="space-y-4">
                        {orders.data.length > 0 ? (
                            orders.data.map(order => (
                                <OrderCard key={order.id} order={order} onViewDetails={setViewingOrder} />
                            ))
                        ) : (
                            <div className="bg-white text-center p-12 rounded-lg shadow-sm border">
                                <h3 className="text-xl font-semibold text-gray-700">No Orders Yet</h3>
                                <p className="text-gray-500 mt-2">You haven't placed any orders with us. Let's change that!</p>
                                <Link href={route('shop.index')} className="mt-6 inline-block bg-indigo-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                                    Start Shopping
                                </Link>
                            </div>
                        )}
                    </div>

                    <Pagination links={orders.links} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
