import { Button } from '@/components/ui/button';
import { ChevronLeft, PenSquare } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function ProfileBanner() {
  return (
    <div className="relative h-[250px] md:h-[350px]">
      <Image
        src="/placeholder.svg?height=350&width=1920&text=Banner"
        alt="Profile banner"
        fill
        className="object-cover"
        unoptimized={true}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
      
      <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full bg-white/20 backdrop-blur-lg text-white hover:bg-white/30">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <Button variant="ghost" size="icon" className="rounded-full bg-white/20 backdrop-blur-lg text-white hover:bg-white/30">
          <PenSquare className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
