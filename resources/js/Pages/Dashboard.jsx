import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FiBox, FiUsers, FiShoppingCart, FiDollarSign } from 'react-icons/fi';

const StatCard = ({ icon, title, value, description }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-start justify-between">
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{description}</p>
        </div>
        <div className="bg-gray-100 p-3 rounded-full">{icon}</div>
    </div>
);

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                <p className="font-semibold text-gray-700">{label}</p>
                <p className="text-sm text-indigo-600">{`Jumlah: ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

export default function Dashboard({ auth, stats, productsByCategory, categoryDistribution }) {
    const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28', '#AF19FF'];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <h2 className="font-semibold text-2xl text-gray-800 leading-tight">Dashboard</h2>
                    <p className="text-sm text-gray-500 mt-1">Overview of your e-commerce metrics</p>
                </div>
            }
        >
            <Head title="Dashboard" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard icon={<FiBox size={22} />} title="Total Products" value={stats.totalProducts} description="Available in store" />
                        <StatCard icon={<FiUsers size={22} />} title="Total Users" value={stats.totalUsers} description="Registered customers" />
                        <StatCard icon={<FiShoppingCart size={22} />} title="Active Carts" value={stats.activeCarts} description="Items in carts" />
                        <StatCard icon={<FiDollarSign size={22} />} title="Total Revenue" value={`$${stats.totalRevenue}`} description="From all carts" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="font-semibold text-gray-700">Products by Category</h3>
                            <p className="text-sm text-gray-400 mb-4">Distribution of products across categories</p>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={productsByCategory} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(239, 246, 255, 0.5)' }} />
                                    <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                             <h3 className="font-semibold text-gray-700">Category Distribution</h3>
                             <p className="text-sm text-gray-400 mb-4">Pie chart view of product categories</p>
                             <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={categoryDistribution} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                        {categoryDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip formatter={(value, name) => [`${value} produk`, name]} />
                                </PieChart>
                             </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}