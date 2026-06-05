import Link from "next/link";
import { Container } from "@/components/ui/container";
import { footerNav, siteConfig } from "@/lib/site";
import { Zap, Youtube, Facebook, Instagram, Send, Phone, MapPin, Mail, Globe, Play } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-white/5 bg-[#020512] py-12 md:py-16 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/15 to-transparent"></div>
      
      {/* Decorative ambient background glows */}
      <div className="absolute bottom-0 right-0 -z-10 h-72 w-72 rounded-full bg-cyan-500/5 blur-[80px]"></div>
      <div className="absolute bottom-0 left-0 -z-10 h-72 w-72 rounded-full bg-indigo-500/5 blur-[80px]"></div>

      <Container className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr] md:items-start relative z-10 max-w-7xl mx-auto px-4">
        {/* About & Address Block */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 p-[1px]">
              <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-[#0b0f1e] text-indigo-400">
                <Zap className="h-3.5 w-3.5 fill-indigo-400/20" />
              </div>
            </div>
            <span className="font-display text-base font-bold tracking-tight text-white">
              {siteConfig.name}
            </span>
          </Link>
          <p className="max-w-md text-sm leading-6 text-slate-400">
            {siteConfig.description}
          </p>
          <div className="space-y-2 text-sm text-slate-400 pt-2">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-indigo-400 mt-1 flex-shrink-0" />
              <span>📍 NH 106, Bhagwanpur, Supaul, Bihar — 854338</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-indigo-400 flex-shrink-0" />
              <a href="tel:+919110113671" className="hover:text-white transition">📞 +91 91101 13671</a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-indigo-400 flex-shrink-0" />
              <a href="mailto:noreply@sagarcoachingcentre.com" className="hover:text-white transition">✉️ noreply@sagarcoachingcentre.com</a>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-indigo-400 flex-shrink-0" />
              <a href="https://sagarcoachingcentre.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">🌐 sagarcoachingcentre.com</a>
            </div>
          </div>
        </div>

        {/* YouTube Channels & Socials */}
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">YouTube Channels</p>
          <ul className="space-y-2.5 text-sm">
            {siteConfig.socials.youtubeChannels.map((ch, idx) => (
              <li key={idx}>
                <a
                  href={ch.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col text-slate-400 hover:text-white transition"
                >
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Youtube className="h-4 w-4 text-red-500" /> {ch.name}
                  </span>
                  <span className="text-xs text-slate-500 pl-5">{ch.focus}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex gap-4 pt-3">
            <a href={siteConfig.socials.facebookPage} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition duration-300" aria-label="Facebook Page">
              <Facebook className="h-5 w-5" />
            </a>
            <a href={siteConfig.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition duration-300" aria-label="Instagram">
              <Instagram className="h-5 w-5" />
            </a>
            <a href={siteConfig.socials.telegram} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition duration-300" aria-label="Telegram">
              <Send className="h-5 w-5" />
            </a>
            <a href={siteConfig.socials.app} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition duration-300 flex items-center gap-1 text-xs font-semibold" aria-label="Google Play Store App">
              <Play className="h-4 w-4 text-green-400 fill-green-400/20" /> App
            </a>
          </div>
        </div>

        {/* Links Navigation */}
        <div className="space-y-4 md:text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">Navigation</p>
          <nav className="flex flex-col gap-2 md:items-end">
            {footerNav.map((item) => (
              <Link 
                key={item.href} 
                href={item.href} 
                className="text-sm font-medium text-slate-400 hover:text-white transition duration-300"
              >
                {item.label}
              </Link>
            ))}
            <a href="https://wa.me/919110113671" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-slate-400 hover:text-white transition duration-300">
              WhatsApp Contact
            </a>
          </nav>
        </div>
      </Container>

      <div className="relative z-10 mt-12 border-t border-white/5 pt-8">
        <Container className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 max-w-7xl mx-auto px-4">
          <p>
            © 2025 Sagar Coaching Centre Bhagwanpur. All rights reserved. <br className="sm:hidden" />
            Founder: Shrvan Kumar Sagar | जिला सुपौल, बिहार
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300 transition">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition">Terms of Service</a>
          </div>
        </Container>
      </div>
    </footer>
  );
}