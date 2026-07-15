import { useState, useRef, useEffect } from "react";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import { Link, NavLink } from "react-router-dom";
import { useProductStore } from "@/stores/useProductStore";
import SearchDropdown from "./SearchDropdown";
import AvatarModal from "./AvatarModal";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout, updateAvatar } = useUserStore();
  const { searchProducts, fetchSearchProducts, searchLoading } =
    useProductStore();
  const isAdmin = user?.role === "admin";
  const { cart } = useCartStore();
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }

      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim()) {
        fetchSearchProducts(search);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, fetchSearchProducts]);

  const handleAvatarUpload = async (formData) => {
    try {
      await updateAvatar(formData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <header className="fixed left-0 top-0 z-[999] w-full bg-white text-black">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative  flex h-20 items-center justify-between border-b border-gray-200">
            {showSearch ? (
              <div ref={searchRef} className="relative w-full">
                <div className="flex items-center gap-3">
                  <Search size={20} className="text-gray-500" />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    autoFocus
                    placeholder="Search..."
                    className="flex-1 border-none bg-transparent text-sm text-black outline-none placeholder:text-gray-400"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setShowSearch(false);
                      setSearch("");
                    }}
                    className="text-sm font-medium text-gray-600"
                  >
                    Cancel
                  </button>
                </div>

                {search && !searchLoading && searchProducts.length > 0 && (
                  <SearchDropdown
                    products={searchProducts}
                    onSelect={() => {
                      setShowSearch(false);
                      setSearch("");
                    }}
                  />
                )}

                {search && !searchLoading && searchProducts.length === 0 && (
                  <div className="absolute left-0 top-full mt-3 w-full rounded-md border bg-white p-4 text-center text-sm text-gray-500">
                    No products found.
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/">
                  <img
                    src="/images/logo.png"
                    alt="Forever"
                    className="h-10 w-auto"
                  />
                </Link>

                <nav className="hidden items-center gap-10 text-xs font-medium uppercase tracking-wide md:flex">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `pb-1 ${
                        isActive
                          ? "border-b border-gray-700"
                          : "border-b border-transparent"
                      }`
                    }
                  >
                    Home
                  </NavLink>

                  <NavLink
                    to="/products"
                    className={({ isActive }) =>
                      `pb-1 ${
                        isActive
                          ? "border-b border-gray-700"
                          : "border-b border-transparent"
                      }`
                    }
                  >
                    Collection
                  </NavLink>

                  <NavLink
                    to="/about"
                    className={({ isActive }) =>
                      `pb-1 ${
                        isActive
                          ? "border-b border-gray-700"
                          : "border-b border-transparent"
                      }`
                    }
                  >
                    About
                  </NavLink>

                  <NavLink
                    to="/contact"
                    className={({ isActive }) =>
                      `pb-1 ${
                        isActive
                          ? "border-b border-gray-700"
                          : "border-b border-transparent"
                      }`
                    }
                  >
                    Contact
                  </NavLink>
                </nav>

                <div className="flex items-center gap-4 text-gray-700">
                  <button
                    type="button"
                    onClick={() => setShowSearch(!showSearch)}
                    aria-label="Toggle search"
                  >
                    <Search size={25} />
                  </button>
                  <div ref={userMenuRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      aria-label="User menu"
                    >
                      <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                        {user?.avatar?.url ? (
                          <img
                            src={user.avatar.url}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User size={20} className="text-gray-500" />
                        )}
                      </div>
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 top-9 z-50 w-36 border border-gray-200 bg-white py-2 text-sm text-gray-700 shadow-sm">
                        {user ? (
                          <>
                            {isAdmin && (
                              <Link
                                to="/admin"
                                onClick={() => setShowUserMenu(false)}
                                className="block px-4 py-2 hover:bg-gray-100"
                              >
                                Dashboard
                              </Link>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                setShowAvatarModal(true);
                                setShowUserMenu(false);
                              }}
                              className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                            >
                              Update Avatar
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                logout();
                                setShowUserMenu(false);
                              }}
                              className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                            >
                              Sign out
                            </button>
                          </>
                        ) : (
                          <>
                            <Link
                              to="/login"
                              onClick={() => setShowUserMenu(false)}
                              className="block px-4 py-2 hover:bg-gray-100"
                            >
                              Login
                            </Link>

                            <Link
                              to="/signup"
                              onClick={() => setShowUserMenu(false)}
                              className="block px-4 py-2 hover:bg-gray-100"
                            >
                              Sign up
                            </Link>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <Link to="/cart">
                    <div className="relative">
                      <ShoppingBag size={20} />
                      <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] text-white">
                        {cartCount}
                      </span>
                    </div>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="md:hidden"
                    aria-label="Toggle menu"
                  >
                    {open ? <X size={22} /> : <Menu size={22} />}
                  </button>
                </div>
                {open && (
                  <nav
                    ref={mobileMenuRef}
                    className="absolute left-0 top-20 z-50 w-full border border-gray-200 bg-white shadow-sm md:hidden"
                  >
                    <div className="flex flex-col text-sm font-medium uppercase tracking-wide">
                      <Link
                        to="/"
                        onClick={() => setOpen(false)}
                        className="border-b border-gray-200 px-6 py-4 hover:bg-gray-50"
                      >
                        Home
                      </Link>

                      <Link
                        to="/collection"
                        onClick={() => setOpen(false)}
                        className="border-b border-gray-200 px-6 py-4 hover:bg-gray-50"
                      >
                        Collection
                      </Link>

                      <Link
                        to="/about"
                        onClick={() => setOpen(false)}
                        className="border-b border-gray-200 px-6 py-4 hover:bg-gray-50"
                      >
                        About
                      </Link>

                      <Link
                        to="/contact"
                        onClick={() => setOpen(false)}
                        className="px-6 py-4 hover:bg-gray-50"
                      >
                        Contact
                      </Link>
                    </div>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      <AvatarModal
        open={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        onUpload={handleAvatarUpload}
      />
    </>
  );
}
