import React, { useState, useEffect, useRef } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage, router } from "@inertiajs/react";
import {
    FiSearch,
    FiChevronDown,
    FiShoppingCart,
    FiX,
    FiCheckCircle,
    FiInfo,
} from "react-icons/fi"; //Tambahkan impor ikon untuk Toast
import { FaStar } from "react-icons/fa";
import { debounce } from "lodash";

//6DFzabFbsYsXJrA
//MySQL Host Name=
// Tambahkan Komponen Notifikasi Toast
const Toast = ({ message, show, onHide, type = "success" }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => onHide(), 4000);
            return () => clearTimeout(timer);
        }
    }, [show, onHide]);

    const isSuccess = type === "success";
    return (
        <div
            className={`fixed top-5 right-5 bg-white shadow-lg rounded-lg p-4 z-50 transition-all duration-300 ease-in-out max-w-sm w-full ${
                show
                    ? "translate-x-0 opacity-100"
                    : "translate-x-full opacity-0"
            }`}
        >
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    {isSuccess ? (
                        <FiCheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                        <FiInfo className="h-6 w-6 text-blue-500" />
                    )}
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-bold text-gray-900">
                        {isSuccess ? "Success" : "Information"}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">{message}</p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                    <button
                        onClick={onHide}
                        className="inline-flex text-gray-400 hover:text-gray-500"
                    >
                        <FiX size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};


// Komponen Dropdown Kustom
const CustomSelect = ({
    options,
    value,
    onChange,
    placeholder = "Select an option",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target))
                setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (optionValue) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    const selectedOption = options.find((opt) => opt.value === value) || {
        label: placeholder,
    };

    return (
        <div className="relative w-full" ref={selectRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full pl-3 pr-10 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 flex justify-between items-center"
            >
                <span className="block truncate">{selectedOption.label}</span>
                <FiChevronDown
                    className={`text-gray-400 transition-transform duration-200 ${
                        isOpen ? "transform rotate-180" : ""
                    }`}
                />
            </button>
            {isOpen && (
                <ul className="absolute z-30 mt-1 w-full bg-white shadow-lg border rounded-md max-h-60 overflow-y-auto">
                    {options.map((option) => (
                        <li
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            className="text-gray-900 cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white"
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

// Kartu Produk untuk Halaman Shop
const ShopProductCard = ({ product }) => {
    const discountPercent =
        product.original_price > 0
            ? Math.round(
                  ((product.original_price - product.price) /
                      product.original_price) *
                      100
              )
            : 0;

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden group relative">
            {discountPercent > 0 && (
                <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                    -{discountPercent}%
                </div>
            )}
            <div className="overflow-hidden">
                <img
                    className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-300"
                    src={product.image_url}
                    alt={product.name}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://placehold.co/600x400/EEE/31343C?text=No+Image`;
                    }}
                />
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3
                    className="text-base font-semibold text-gray-800 truncate"
                    title={product.name}
                >
                    {product.name}
                </h3>
                <div className="mt-2 flex justify-between items-center">
                    <div className="flex items-baseline space-x-2">
                        <p className="text-lg font-bold text-gray-900">
                            ${product.price}
                        </p>
                        {product.original_price > 0 && (
                            <p className="text-sm text-gray-400 line-through">
                                ${product.original_price}
                            </p>
                        )}
                    </div>
                    {product.rating && (
                        <div className="flex items-center text-sm">
                            <FaStar className="text-yellow-400 mr-1" />
                            <span className="text-gray-600">
                                {parseFloat(product.rating).toFixed(1)}
                            </span>
                        </div>
                    )}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                    {product.category} - {product.stock} in stock
                </div>
                <Link
                    href={route("cart.store")}
                    method="post"
                    data={{ product_id: product.id }}
                    as="button"
                    preserveScroll
                    className="mt-4 w-full flex items-center justify-center bg-gray-800 text-white py-2 rounded-md hover:bg-gray-900 transition-colors"
                >
                    <FiShoppingCart className="mr-2" />
                    Add to Cart
                </Link>
            </div>
        </div>
    );
};

// Komponen Pagination
const Pagination = ({ links }) => {
    if (!links || links.length <= 3) return null;

    return (
        <div className="mt-8 flex justify-center">
            <div className="flex rounded-md shadow-sm">
                {links.map((link, index) => {
                    const commonClasses = `px-4 py-2 border text-sm font-medium ${
                        index === 0 ? "rounded-l-md" : ""
                    } ${index === links.length - 1 ? "rounded-r-md" : ""}`;

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
                            className={`${commonClasses} ${
                                link.active
                                    ? "bg-indigo-500 text-white border-indigo-500"
                                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                })}
            </div>
        </div>
    );
};


// Komponen utama halaman Shop
export default function Index({
    auth,
    products,
    categories = [],
    filters = {},
}) {
    const { flash } = usePage().props;
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [selectedCategory, setSelectedCategory] = useState(
        filters.category || ""
    );
    const [toastMessage, setToastMessage] = useState("");
    const [showToast, setShowToast] = useState(false);

    // 1. Tambahkan ref untuk menandai initial mount
    const isInitialMount = useRef(true);

    const categoryOptions = [
        { value: "", label: "All Categories" },
        ...categories.map((cat) => ({ value: cat, label: cat })),
    ];

    useEffect(() => {
        if (flash?.message) {
            setToastMessage(flash.message);
            setShowToast(true);
        }
    }, [flash]);

    // 2. Modifikasi useEffect untuk filter dan pencarian
    useEffect(() => {
        // Jika ini adalah render pertama, jangan lakukan apa-apa.
        // Cukup ubah penanda menjadi false dan keluar dari effect.
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        // Debounce akan berjalan hanya untuk perubahan berikutnya (saat user mengetik/memfilter).
        const debouncedSearch = debounce(() => {
            const params = { search: searchTerm, category: selectedCategory };
            
            // Hapus parameter yang kosong
            Object.keys(params).forEach(
                (key) => (params[key] === "" || params[key] == null) && delete params[key]
            );

            router.get(route("shop.index"), params, {
                preserveState: true,
                preserveScroll: true, // Mencegah scroll ke atas saat memfilter
                replace: true,
            });
        }, 300);

        debouncedSearch();

        // Bersihkan debounce saat komponen unmount atau effect berjalan lagi
        return () => {
            debouncedSearch.cancel();
        };
    }, [searchTerm, selectedCategory]); // Effect ini hanya bergantung pada perubahan filter

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Shop" />
            
            <Toast
                message={toastMessage}
                show={showToast}
                onHide={() => setShowToast(false)}
            />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-5">
                        <h2 className="font-semibold text-2xl text-gray-800 leading-tight">
                            Shop
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Browse and purchase products
                        </p>
                    </div>

                    {/* Filter Bar */}
                    <div className="mb-6 flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-grow">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div className="w-full sm:w-52">
                            <CustomSelect
                                options={categoryOptions}
                                value={selectedCategory}
                                onChange={setSelectedCategory}
                                placeholder="All Categories"
                            />
                        </div>
                    </div>

                    {products && products.data && products.data.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {products.data.map((product) => (
                                <ShopProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-700">
                                No Products Found
                            </h3>
                            <p className="text-gray-500 mt-2">
                                Try adjusting your search or filter criteria.
                            </p>
                        </div>
                    )}

                    {products && products.links && (
                        <Pagination links={products.links} />
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}