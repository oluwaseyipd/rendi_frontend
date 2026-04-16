import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";


export default function Navbar() {
    return(
        <nav className="border-b border-border/50 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <Image 
            src="/rendi-logo.png"
            alt="Rendi Logo"
            width={120}
            height={120}
          />
        </div>
        <div className="flex items-center gap-4">
          <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            FAQ
          </Link>
          <Link href="/auth/login">
            <Button variant="ghost" size="sm">Sign in</Button>
          </Link>
          <Link href="/auth/register">
            <Button size="sm">Get started</Button>
          </Link>
        </div>
      </nav>
    );
}