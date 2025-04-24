"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function MainHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { title: "خانه", href: "/", icon: "fa-house" },
    { title: "سفارش غذا", href: "#", icon: "fa-utensils" },
    { title: "سوپرمارکت", href: "#", icon: "fa-cart-shopping" },
    { title: "پیک موتوری", href: "#", icon: "fa-motorcycle" },
  ];

  return (
    <header className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Image src="/logo.svg" alt="logo" width={90} height={32} priority />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 space-x-reverse">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                {item.title}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <i
              className={`fa-solid ${
                isMenuOpen ? "fa-xmark" : "fa-bars"
              } text-2xl`}
            ></i>
          </button>
        </div>

        {/* Mobile Side Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              />

              {/* Side Menu */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 20 }}
                className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 md:hidden"
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-6">
                    <Image src="/logo.svg" alt="logo" width={90} height={32} />
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="p-2 rounded-full hover:bg-gray-100"
                    >
                      <i className="fa-solid fa-xmark text-xl"></i>
                    </button>
                  </div>

                  <nav className="space-y-2">
                    {menuItems.map((item) => (
                      <motion.a
                        key={item.href}
                        href={item.href}
                        whileHover={{ x: -5 }}
                        className="flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <i
                          className={`fa-solid ${item.icon} text-lg text-primary-600`}
                        ></i>
                        <span className="text-gray-700">{item.title}</span>
                      </motion.a>
                    ))}
                  </nav>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

export default MainHeader;
