import { Link } from "wouter";
import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-viking-dark border-t border-nordic-gold/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/image-39.ico" 
                alt="Valhalla NFT" 
                className="h-8 w-8"
              />
              <span className="font-cinzel font-bold text-xl text-nordic-gold">VALHALLA</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Enter the realm of legendary Viking warriors in the most epic NFT collection ever created.
            </p>
          </div>

          {/* Collection Links */}
          <div>
            <h4 className="font-cinzel font-bold text-white mb-4">Collection</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link 
                  href="/collection" 
                  className="hover:text-nordic-gold transition-colors"
                  data-testid="footer-link-browse-warriors"
                >
                  Browse Warriors
                </Link>
              </li>
              <li>
                <Link 
                  href="/stake" 
                  className="hover:text-nordic-gold transition-colors"
                  data-testid="footer-link-stake-nfts"
                >
                  Stake NFTs
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-nordic-gold transition-colors">
                  Rarity Guide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-nordic-gold transition-colors">
                  Trading Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h4 className="font-cinzel font-bold text-white mb-4">Community</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a 
                  href="https://discord.gg/valhalla" 
                  className="hover:text-nordic-gold transition-colors"
                  data-testid="footer-link-discord"
                >
                  Discord
                </a>
              </li>
              <li>
                <a 
                  href="https://twitter.com/valhalla_nft" 
                  className="hover:text-nordic-gold transition-colors"
                  data-testid="footer-link-twitter"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a 
                  href="https://instagram.com/valhalla_nft" 
                  className="hover:text-nordic-gold transition-colors"
                  data-testid="footer-link-instagram"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a 
                  href="https://medium.com/@valhalla" 
                  className="hover:text-nordic-gold transition-colors"
                  data-testid="footer-link-medium"
                >
                  Medium
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-cinzel font-bold text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link 
                  href="/roadmap" 
                  className="hover:text-nordic-gold transition-colors"
                  data-testid="footer-link-roadmap"
                >
                  Roadmap
                </Link>
              </li>
              <li>
                <Link 
                  href="/faucet" 
                  className="hover:text-nordic-gold transition-colors"
                  data-testid="footer-link-token-faucet"
                >
                  Token Faucet
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-nordic-gold transition-colors">
                  Whitepaper
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-nordic-gold transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-nordic-gold/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Valhalla NFT Collection. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a 
              href="https://discord.gg/valhalla" 
              className="text-gray-400 hover:text-nordic-gold transition-colors"
              data-testid="footer-social-discord"
            >
              <i className="fab fa-discord text-xl"></i>
            </a>
            <a 
              href="https://twitter.com/valhalla_nft" 
              className="text-gray-400 hover:text-nordic-gold transition-colors"
              data-testid="footer-social-twitter"
            >
              <i className="fab fa-twitter text-xl"></i>
            </a>
            <a 
              href="https://instagram.com/valhalla_nft" 
              className="text-gray-400 hover:text-nordic-gold transition-colors"
              data-testid="footer-social-instagram"
            >
              <i className="fab fa-instagram text-xl"></i>
            </a>
            <a 
              href="https://medium.com/@valhalla" 
              className="text-gray-400 hover:text-nordic-gold transition-colors"
              data-testid="footer-social-medium"
            >
              <i className="fab fa-medium text-xl"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
