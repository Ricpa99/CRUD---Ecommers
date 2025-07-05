import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { FiSearch, FiEdit, FiTrash2 } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { debounce } from 'lodash';

// Komponen untuk kartu produk
const ProductCard = ({ product }) => (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col">
        <img 
            className="w-full h-48 object-cover" 
            src={product.image_url} 
            alt={`Gambar ${product.name}`} 
            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/600x400/EEE/31343C?text=No+Image`; }}
        />
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
            <p className="text-sm text-gray-500 mt-1 h-10 overflow-hidden flex-grow">{product.description}</p>
            
            <div className="mt-4 flex justify-between items-center">
                <p className="text-xl font-bold text-gray-900">${product.price}</p>
                {product.rating && (
                    <div className="flex items-center">
                        <FaStar className="text-yellow-400 mr-1" />
                        <span className="text-sm text-gray-600 font-medium">{parseFloat(product.rating).toFixed(1)}</span>
                    </div>
                )}
            </div>
            
            <div className="mt-3 flex justify-between items-center text-sm text-gray-600">
                <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{product.category}</span>
                <span>Stock: {product.stock}</span>
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-end space-x-3">
                <Link href={route('products.edit', product.id)} className="text-gray-500 hover:text-indigo-600" title="Edit">
                    <FiEdit size={18} />
                </Link>
                <Link
                    href={route('products.destroy', product.id)}
                    method="delete"
                    as="button"
                    type="button"
                    onBefore={() => confirm('Apakah Anda yakin ingin menghapus produk ini?')}
                    className="text-gray-500 hover:text-red-600"
                    title="Delete"
                >
                    <FiTrash2 size={18} />
                </Link>
            </div>
        </div>
    </div>
);

// Komponen untuk pagination
const Pagination = ({ links }) => {
    if (links.length <= 3) return null;
    return (
        <div className="mt-8 flex justify-center">
            <div className="flex rounded-md shadow-sm">
                {links.map((link, index) => (
                    <Link
                        key={index}
                        href={link.url}
                        className={`px-4 py-2 border text-sm font-medium ${link.active ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'} ${index === 0 ? 'rounded-l-md' : ''} ${index === links.length - 1 ? 'rounded-r-md' : ''} ${!link.url ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>
        </div>
    );
};

// Komponen utama halaman Index
export default function Index({ auth, products, categories, filters }) {
    const { flash } = usePage().props;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');

    useEffect(() => {
        const debouncedSearch = debounce(() => {
            const params = { search: searchTerm, category: selectedCategory };
            Object.keys(params).forEach(key => (params[key] === '' || params[key] === null) && delete params[key]);
            router.get(route('products.index'), params, { preserveState: true, replace: true });
        }, 300);
        debouncedSearch();
        return () => debouncedSearch.cancel();
    }, [searchTerm, selectedCategory]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-semibold text-2xl text-gray-800 leading-tight">Products</h2>
                        <p className="text-sm text-gray-500 mt-1">Manage your product inventory</p>
                    </div>
                    <Link href={route('products.create')} className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors">+ Add Product</Link>
                </div>
            }
        >
            <Head title="Products" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flash.message && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert"><p>{flash.message}</p></div>}
                    <div className="mb-6 flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-grow">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"/>
                        </div>
                        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="">All Categories</option>
                            {categories.map(category => <option key={category} value={category}>{category}</option>)}
                        </select>
                    </div>
                    {products.data.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {products.data.map((product) => <ProductCard key={product.id} product={product} />)}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-700">No Products Found</h3>
                            <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria.</p>
                        </div>
                    )}
                    <Pagination links={products.links} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}