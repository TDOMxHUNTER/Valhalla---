import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { CustomConnectButton } from './web3-provider';

const navItems = [
  { name: "Home", path: "/" },
  { name: "Collection", path: "/collection" },
  { name: "Stake NFT", path: "/stake" },
  { name: "Faucet", path: "/faucet" },
  { name: "Roadmap & Tokenomics", path: "/roadmap" },
];

export default function Navigation() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-viking-dark/90 backdrop-blur-lg border-b border-nordic-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" data-testid="link-home">
            <div className="flex items-center space-x-3">
              <img
                src="/image-39.ico"
                alt="Valhalla NFT"
                className="h-10 w-auto"
              />
              <h1 className="font-cinzel font-bold text-2xl text-nordic-gold hover:text-yellow-500 transition-colors">
                ValhallaNFT
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`transition-colors ${
                  location === item.path
                    ? "text-nordic-gold"
                    : "text-white hover:text-nordic-gold"
                }`}
                data-testid={`link-${item.name.toLowerCase().replace(' ', '-')}`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Connect Wallet Button */}
          <div className="hidden md:block">
            <CustomConnectButton />
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                <Menu className="h-6 w-6 text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-viking-dark border-nordic-gold/20">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`text-lg transition-colors ${
                      location === item.path
                        ? "text-nordic-gold"
                        : "text-white hover:text-nordic-gold"
                    }`}
                    data-testid={`mobile-link-${item.name.toLowerCase().replace(' ', '-')}`}
                  >
                    {item.name}
                  </Link>
                ))}
                {/* Mobile Connect Button */}
                <div className="px-4 py-4 border-t border-nordic-gold/20">
                  <CustomConnectButton />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}