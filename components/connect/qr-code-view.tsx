'use client'

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Copy, Share2, Download, QrCode, ScanLine } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useToast } from '@/components/ui/use-toast';
import useSession from '@/hooks/useSessions'; // Assuming this is the correct import for your useSession hook
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton component

export function QRCodeView() {
  const { toast } = useToast();
  const { session } = useSession(); // Get session data using your custom hook
  const qrValue = session?.user?.email || ''; // This would be dynamic in a real app
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      setLoading(false); // Stop loading once session data is available
    }
  }, [session]); // Re-run effect when session changes

  // Handle clipboard copy
  const handleCopy = async () => {
    try {
      if (!qrValue) return; // Return if there's no value to copy
      await navigator.clipboard.writeText(qrValue);
      toast({
        description: "QR code link copied to clipboard",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to copy link",
      });
    }
  };

  // Handle sharing the QR code
  const handleShare = async () => {
    if (navigator.share && qrValue) {
      try {
        await navigator.share({
          title: 'Add me on Chat App',
          text: 'Scan my QR code to add me',
          url: qrValue,
        });
      } catch (error) {
        toast({
          variant: "destructive",
          description: "Failed to share",
        });
      }
    } else {
      toast({
        variant: "destructive",
        description: "Sharing not supported or QR code missing",
      });
    }
  };

  // Handle saving the QR code image
  const handleSave = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'my-qr-code.png';
      link.href = canvas.toDataURL();
      link.click();
    } else {
      toast({
        variant: "destructive",
        description: "Failed to find the QR code canvas",
      });
    }
  };

  // Handle case where there's no session
  if (loading || !session) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Skeleton className="w-32 h-32 rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-gray-50 dark:bg-gray-900">
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b dark:border-gray-800">
        <div className="flex items-center justify-between p-4 max-w-2xl mx-auto">
          <h1 className="text-xl font-semibold">My QR Code</h1>
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 p-4">
        <div className="max-w-md mx-auto space-y-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 space-y-6">
              {/* Profile Section */}
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  {loading ? (
                    <Skeleton className="w-full h-full rounded-full" />
                  ) : (
                    <AvatarImage
                      src={session?.user?.user_metadata?.avatar_url || '/placeholder.svg'}
                      alt="User Avatar"
                    />
                  )}
                  <AvatarFallback />
                </Avatar>

                <div>
                  {/* User Name */}
                  <h2 className="font-semibold">
                    {loading ? (
                      <Skeleton className="w-32 h-6" />
                    ) : (
                      session?.user?.user_metadata?.name || 'Username'
                    )}
                  </h2>
                  {/* User Status */}
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {loading ? <Skeleton className="w-32 h-4" /> : session?.user?.email}
                  </span>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex justify-center p-4">
                <QRCodeSVG
                  value={qrValue}
                  size={200}
                  level="H"
                  className="dark:bg-white p-2 rounded-lg"
                  alt="QR code to add the user"
                />
              </div>

              <span className="text-center text-sm text-gray-500 dark:text-gray-400">
                Share this QR code with your friends so they can add you
              </span>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="flex flex-col items-center gap-1 h-auto py-3"
                  onClick={handleCopy}
                >
                  <Copy className="h-5 w-5" />
                  <span className="text-xs">Copy</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center gap-1 h-auto py-3"
                  onClick={handleShare}
                >
                  <Share2 className="h-5 w-5" />
                  <span className="text-xs">Share</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center gap-1 h-auto py-3"
                  onClick={handleSave}
                >
                  <Download className="h-5 w-5" />
                  <span className="text-xs">Save</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="default"
              size="lg"
              className="w-full bg-[#5BA4A4] hover:bg-[#4A8F8F]"
            >
              <QrCode className="mr-2 h-5 w-5" />
              My QR Code
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
            >
              <ScanLine className="mr-2 h-5 w-5" />
              Scan QR Code
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
