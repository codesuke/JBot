'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(10);
  const [flashbang, setFlashbang] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;

        if (newTime === 0) {
          // Cat is angry! Trigger flashbang
          setFlashbang(true);

          // Show flashbang effect for 1 second, then redirect
          setTimeout(() => {
            router.push('/');
          }, 2000);

          clearInterval(timer);
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  if (flashbang) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Flashbang white screen */}
        <div className="absolute inset-0 bg-white animate-pulse" />

        {/* Angry cat message */}
        <div className="relative z-10 text-center space-y-6">
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-2xl space-y-8">
        {/* Funny Image */}
        <div className="flex justify-center">
          <div className="w-96 h-96 overflow-hidden rounded-lg shadow-lg bg-muted">
            <img
              src="https://i.imgur.com/7Zpr3rn.jpeg"
              alt="404 - Page not found"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-5xl font-bold">Cat Is Lost!</h1>
          <p className="text-xl text-muted-foreground">
            Bro This Page Don&apos;t Exist Why You Roaming In My Hood
          </p>
        </div>

        {/* Timer Warning */}
        <div className="p-4 rounded-lg bg-destructive/10 border-2 border-destructive">
          <p className="text-lg font-semibold text-destructive">
             The cat gets angry in {timeLeft} seconds...
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Leave now before the cat loses it! :&gt;
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <Button
            asChild
            variant="default"
            size="lg"
            className="gap-2"
          >
            <Link href="/chat">
              <RotateCcw className="h-4 w-4" />
              Go Back (Save Yourself!)
            </Link>
          </Button>
        </div>

        {/* Fun Footer */}
        <div className="pt-6 border-t text-sm text-muted-foreground">
          <p>Now get yo ass outta here!</p>
        </div>
      </div>
    </div>
  );
}
