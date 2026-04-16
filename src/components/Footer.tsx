import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image 
              src="/rendi-logo.png"
              alt="Rendi Logo"
              width={140}
              height={140}
            />  
          </div>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Rendi. All rights reserverd</p>
        </div>
      </footer>
    );
}