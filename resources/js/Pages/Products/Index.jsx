import React, { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router, useForm } from '@inertiajs/react';
import { FiSearch, FiEdit, FiTrash2, FiX, FiChevronDown, FiAlertTriangle, FiCheckCircle, FiInfo } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { debounce } from 'lodash';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

// Komponen Notifikasi Toast
const Toast = ({ message, show, onHide, type = 'success' }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => onHide(), 4000);
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
                    <button onClick={onHide} className="inline-flex text-gray-400 hover:text-gray-500"><FiX size={20} /></button>
                </div>
            </div>
        </div>
    );
};

// Komponen Modal Konfirmasi
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
                        <div className="mt-2"><p className="text-sm text-gray-500">{children}</p></div>
                    </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm" onClick={onConfirm}>Delete</button>
                    <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

// Komponen Dropdown Kustom yang Scrollable
const CustomSelect = ({ options, value, onChange, placeholder = "Select an option" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState('down');
    const selectRef = useRef(null);

    const toggleDropdown = () => {
        if (!isOpen) {
            const rect = selectRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            if (spaceBelow < 250) {
                setPosition('up');
            } else {
                setPosition('down');
            }
        }
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (optionValue) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    const selectedLabel = value || placeholder;

    return (
        <div className="relative w-full" ref={selectRef}>
            <button type="button" onClick={toggleDropdown} className="w-full pl-3 pr-10 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 flex justify-between items-center">
                <span className="block truncate">{selectedLabel}</span>
                <FiChevronDown className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <ul className={`absolute z-30 w-full bg-white shadow-lg border rounded-md max-h-60 overflow-y-auto ${position === 'up' ? 'bottom-full mb-1' : 'mt-1'}`}>
                    {placeholder && (
                        <li onClick={() => handleSelect('')} className="text-gray-900 cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white">
                            {placeholder}
                        </li>
                    )}
                    {options.map(option => (
                        <li key={option} onClick={() => handleSelect(option)} className="text-gray-900 cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white">
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

// Komponen Modal Umum
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><FiX size={24} /></button>
                </div>
                {children}
            </div>
        </div>
    );
};

// Komponen Form Tambah Produk
const AddProductForm = ({ categories, onClose }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', description: '', price: '', stock: '', category: '', rating: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('products.store'), {
            onSuccess: () => { reset(); onClose(); },
        });
    };

    return (
        <form onSubmit={submit}>
            <div>
                <InputLabel htmlFor="name" value="Title" />
                <TextInput id="name" value={data.name} onChange={e => setData('name', e.target.value)} className="mt-1 block w-full" required />
                <InputError message={errors.name} className="mt-2" />
            </div>
            <div className="mt-4">
                <InputLabel htmlFor="description" value="Description" />
                <textarea id="description" value={data.description} onChange={e => setData('description', e.target.value)} className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm h-24" />
                <InputError message={errors.description} className="mt-2" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                    <InputLabel htmlFor="price" value="Price" />
                    <TextInput id="price" type="number" value={data.price} onChange={e => setData('price', e.target.value)} className="mt-1 block w-full" required />
                    <InputError message={errors.price} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="stock" value="Stock" />
                    <TextInput id="stock" type="number" value={data.stock} onChange={e => setData('stock', e.target.value)} className="mt-1 block w-full" required />
                    <InputError message={errors.stock} className="mt-2" />
                </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                    <InputLabel htmlFor="category" value="Category" />
                    <CustomSelect options={categories} value={data.category} onChange={(category) => setData('category', category)} placeholder="Select category" />
                    <InputError message={errors.category} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="rating" value="Rating (0-5)" />
                    <TextInput id="rating" type="number" step="0.1" value={data.rating} onChange={e => setData('rating', e.target.value)} className="mt-1 block w-full" />
                    <InputError message={errors.rating} className="mt-2" />
                </div>
            </div>
            <div className="mt-6 flex justify-end">
                <PrimaryButton disabled={processing}>Add Product</PrimaryButton>
            </div>
        </form>
    );
};

// Komponen Form Edit Produk
const EditProductForm = ({ product, categories, onClose }) => {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: product.name || '', description: product.description || '', price: product.price || '', stock: product.stock || '', category: product.category || '', rating: product.rating || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('products.update', product.id), {
            onSuccess: () => { reset(); onClose(); },
        });
    };

    return (
        <form onSubmit={submit}>
            <div>
                <InputLabel htmlFor="edit-name" value="Title" />
                <TextInput isFocused id="edit-name" value={data.name} onChange={e => setData('name', e.target.value)} className="mt-1 block w-full" required />
                <InputError message={errors.name} className="mt-2" />
            </div>
            <div className="mt-4">
                <InputLabel htmlFor="edit-description" value="Description" />
                <textarea id="edit-description" value={data.description} onChange={e => setData('description', e.target.value)} className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm h-24" />
                <InputError message={errors.description} className="mt-2" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                    <InputLabel htmlFor="edit-price" value="Price" />
                    <TextInput id="edit-price" type="number" value={data.price} onChange={e => setData('price', e.target.value)} className="mt-1 block w-full" required />
                    <InputError message={errors.price} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="edit-stock" value="Stock" />
                    <TextInput id="edit-stock" type="number" value={data.stock} onChange={e => setData('stock', e.target.value)} className="mt-1 block w-full" required />
                    <InputError message={errors.stock} className="mt-2" />
                </div>
            </div>
             <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                    <InputLabel htmlFor="edit-category" value="Category" />
                    <CustomSelect options={categories} value={data.category} onChange={(category) => setData('category', category)} placeholder="Select category" />
                    <InputError message={errors.category} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="edit-rating" value="Rating (0-5)" />
                    <TextInput id="edit-rating" type="number" step="0.1" value={data.rating} onChange={e => setData('rating', e.target.value)} className="mt-1 block w-full" />
                    <InputError message={errors.rating} className="mt-2" />
                </div>
            </div>
            <div className="mt-6 flex justify-end">
                <PrimaryButton disabled={processing}>Update Product</PrimaryButton>
            </div>
        </form>
    );
};


// Komponen untuk kartu produk
const ProductCard = ({ product, onEditClick, onDeleteClick }) => (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col">
        <img className="w-full h-48 object-cover" src={product.image_url} alt={product.name} onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/600x400/EEE/31343C?text=No+Image`; }} />
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-lg font-semibold text-gray-800 truncate" title={product.name}>{product.name}</h3>
            <p className="text-sm text-gray-500 mt-1 h-10 overflow-hidden flex-grow">{product.description}</p>
            <div className="mt-4 flex justify-between items-center">
                <p className="text-xl font-bold text-gray-900">${product.price}</p>
                {product.rating && <div className="flex items-center"><FaStar className="text-yellow-400 mr-1" /><span className="text-sm text-gray-600 font-medium">{parseFloat(product.rating).toFixed(1)}</span></div>}
            </div>
            <div className="mt-3 flex justify-between items-center text-sm text-gray-600">
                <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{product.category}</span>
                <span>Stock: {product.stock}</span>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-end space-x-3">
                <button onClick={() => onEditClick(product)} className="text-gray-500 hover:text-indigo-600" title="Edit"><FiEdit size={18} /></button>
                <button onClick={() => onDeleteClick(product)} className="text-gray-500 hover:text-red-600" title="Delete"><FiTrash2 size={18} /></button>
            </div>
        </div>
    </div>
);


const Pagination = ({ links }) => {
    if (!links || links.length <= 3) return null;

    return (
        <div className="mt-8 flex justify-center">
            <div className="flex rounded-md shadow-sm">
                {links.map((link, index) => {
                    const commonClasses = `px-4 py-2 border text-sm font-medium ${index === 0 ? 'rounded-l-md' : ''} ${index === links.length - 1 ? 'rounded-r-md' : ''}`;
                    
                    if (!link.url) {
                        return (
                            <span
                                key={index}
                                className={`${commonClasses} bg-gray-100 text-gray-400 cursor-not-allowed`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        );
                    }

                    return (
                        <Link
                            key={index}
                            href={link.url}
                            className={`${commonClasses} ${link.active ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                })}
            </div>
        </div>
    );
};


// Komponen utama halaman Index
export default function Index({ auth, products, categories = [], filters = {} }) {
    const { flash } = usePage().props;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [deletingProduct, setDeletingProduct] = useState(null);
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (flash?.message) {
            setToastMessage(flash.message);
            setShowToast(true);
        }
    }, [flash]);

    const handleDeleteConfirm = () => {
        if (deletingProduct) {
            router.delete(route('products.destroy', deletingProduct.id), {
                onSuccess: () => setDeletingProduct(null),
            });
        }
    };

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
        <AuthenticatedLayout user={auth.user}>
            <Head title="Products" />
            
            <Toast message={toastMessage} show={showToast} onHide={() => setShowToast(false)} />

            <ConfirmationModal
                isOpen={!!deletingProduct}
                onClose={() => setDeletingProduct(null)}
                onConfirm={handleDeleteConfirm}
                title="Delete Product"
            >
                Are you sure you want to delete this product? This action cannot be undone.
            </ConfirmationModal>

            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Product">
                <p className="text-sm text-gray-500 mb-4">Create a new product for your store.</p>
                <AddProductForm categories={categories} onClose={() => setIsAddModalOpen(false)} />
            </Modal>

            <Modal isOpen={!!editingProduct} onClose={() => setEditingProduct(null)} title="Edit Product">
                {editingProduct && <EditProductForm product={editingProduct} categories={categories} onClose={() => setEditingProduct(null)} />}
            </Modal>

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex flex-grow justify-between items-center mb-5">
                        <div>
                            <h2 className="font-semibold text-2xl text-gray-800 leading-tight">Products</h2>
                            <p className="text-sm text-gray-500 mt-1">Manage your product inventory</p>
                        </div>
                        <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors whitespace-nowrap">+ Add Product</button>
                    </div>
                    <div className="mb-6 flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-grow">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"/>
                        </div>
                        <div className="w-full sm:w-52">
                            <CustomSelect options={categories} value={selectedCategory} onChange={setSelectedCategory} placeholder="All Categories" />
                        </div>
                    </div>
                    {products && products.data && products.data.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {products.data.map((product) => (
                                <ProductCard 
                                    key={product.id} 
                                    product={product} 
                                    onEditClick={setEditingProduct} 
                                    onDeleteClick={setDeletingProduct} 
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-700">No Products Found</h3>
                            <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria.</p>
                        </div>
                    )}
                    {products && products.links && <Pagination links={products.links} />}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
