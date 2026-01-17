"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import WalletConnect from "./WalletConnect";
import { Home, PlusCircle, Users, User, Award, LogIn } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/create", label: "Create", icon: PlusCircle },
  { href: "/join", label: "Join", icon: LogIn },
  { href: "/meetings", label: "Meetings", icon: Users },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/reputation", label: "Reputation", icon: Award },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-sky-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 relative">
              <Image 
                src="/icon.svg" 
                alt="ChainMeet" 
                width={36} 
                height={36}
                className="group-hover:scale-105 transition-transform"
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-sky-600 bg-clip-text text-transparent">
              ChainMeet
            </span>
          </Link>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "text-sky-600 bg-sky-50"
                      : "text-slate-600 hover:text-sky-600 hover:bg-sky-50/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Wallet Connect */}
          <div className="flex items-center">
            <WalletConnect />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-sky-100 bg-white">
        <div className="flex justify-around py-2">
          {navLinks.slice(0, 5).map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "text-sky-600"
                    : "text-slate-500 hover:text-sky-600"
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
