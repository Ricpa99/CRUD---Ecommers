import { useState, useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { FiGrid, FiBox, FiShoppingBag, FiShoppingCart, FiFileText, FiUser, FiLogOut, FiSidebar } from 'react-icons/fi';

// Komponen untuk link navigasi di sidebar
const NavLink = ({ href, active, children, icon, isCollapsed, count }) => {
    return (
        <Link
            href={href}
            className={`flex items-center p-3 text-base font-normal rounded-lg transition-all duration-200 group relative ${
                active ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'
            } ${isCollapsed ? 'justify-center' : ''}`}
        >
            {icon}
            <span className={`ml-3 flex-1 transition-all duration-200 whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                {children}
            </span>
            {count > 0 && (
                 <span className={`bg-indigo-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full transition-all duration-200 ${isCollapsed ? 'absolute -top-1 -right-1' : ''}`}>
                    {count}
                </span>
            )}
        </Link>
    );
};

// Komponen utama layout
export default function Authenticated({ user, header, children }) {
    const { cart_count } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setUserMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);

    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Sidebar */}
            <aside className={`bg-white border-r border-gray-200 flex flex-col fixed h-full z-20 transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64' : 'w-20'}`}>
                {/* Logo */}
                <div className="h-16 flex items-center justify-center border-b border-gray-200 px-4">
                    <Link href="/" className={`flex items-center gap-2 text-xl font-bold text-gray-800 transition-opacity duration-200 whitespace-nowrap ${!sidebarOpen && 'opacity-0 w-0 hidden'}`}>
                        <FiShoppingBag className="text-indigo-600" />
                        <span> Belanja Store</span>
                    </Link>
                    <Link href="/" className={`text-2xl font-bold text-gray-800 transition-opacity duration-200 ${sidebarOpen && 'hidden'}`}>
                         <FiShoppingBag className="text-indigo-600" />
                    </Link>
                </div>

                {/* Navigation Links */}
                <nav className="flex-grow p-4 space-y-2">
                    <p className={`px-3 text-xs font-semibold text-gray-400 uppercase transition-opacity duration-200 ${!sidebarOpen && 'opacity-0 hidden'}`}>Navigation</p>
                    <NavLink href={route('dashboard')} active={route().current('dashboard')} icon={<FiGrid size={20} />} isCollapsed={!sidebarOpen}>
                        Dashboard
                    </NavLink>
                    <NavLink href={route('products.index')} active={route().current('products.index')} icon={<FiBox size={20} />} isCollapsed={!sidebarOpen}>
                        Products
                    </NavLink>
                    <NavLink href={route('shop.index')} active={route().current('shop.index')} icon={<FiShoppingBag size={20} />} isCollapsed={!sidebarOpen}>
                        Shop
                    </NavLink>
                    <NavLink href={route('cart.index')} active={route().current('cart.index')} icon={<FiShoppingCart size={20} />} isCollapsed={!sidebarOpen} count={cart_count}>
                        Cart
                    </NavLink>
                    <NavLink href={route('orders.index')} active={route().current('orders.index')} icon={<FiFileText size={20} />} isCollapsed={!sidebarOpen}>
                        Orders
                    </NavLink>
                </nav>

                {user && (
                    <div className="p-4 border-t border-gray-200 relative" ref={menuRef}>
                        {userMenuOpen && (
                             <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-md shadow-lg border border-gray-200 py-2">
                                <div className="px-4 pb-2 mb-2 border-b">
                                    <p className="font-bold text-gray-800">My Account</p>
                                </div>
                                 <Link href={route('profile.edit')} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                                    <FiUser className="mr-3 text-gray-500" /> Profile
                                 </Link>
                                 <Link href={route('logout')} method="post" as="button" className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                                     <FiLogOut className="mr-3 text-gray-500" /> Sign out
                                 </Link>
                             </div>
                        )}
                        <button onClick={() => setUserMenuOpen(!userMenuOpen)} className={`flex items-center w-full text-left p-2 rounded-lg hover:bg-gray-100 
                            ${!sidebarOpen && 'justify-center'}`}>
                            <img className="h-8 w-8 rounded-full object-cover" src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} alt={user.name} />
                            <div className={`ml-3 transition-opacity duration-200 whitespace-nowrap ${!sidebarOpen && 'opacity-0 w-0 hidden'}`}>
                                <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                        </button>
                    </div>
                 )} *
            </aside>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
                <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-gray-800 hover:bg-gray-100 p-2 rounded-md mr-4">
                            <FiSidebar size={22} />
                        </button>
                        {header}
                    </div>
                </header>
                <main className="flex-grow">{children}</main>
            </div>
        </div>
    );
}
