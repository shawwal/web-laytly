import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose } from '@radix-ui/react-dialog'; // For Modal
import { cn } from '@/lib/utils'; // Tailwind CSS utility
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'; // Ensure it's installed via Radix or create a custom utility if necessary

interface ProfileInfoProps {
  name: string;
  avatarUrl: string;
}

export function ProfileInfo({ name, avatarUrl }: ProfileInfoProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Function to open the modal
  const openModal = () => setIsOpen(true);

  // Function to close the modal
  const closeModal = () => setIsOpen(false);

  return (
    <div className="relative px-4 pb-4 -mt-20 max-w-4xl mx-auto">
      {/* Avatar */}
      <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-900 mx-auto cursor-pointer" onClick={openModal}>
        <AvatarImage 
          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/` + avatarUrl} 
          className="object-cover rounded-full w-full h-full" 
        />
        <AvatarFallback>{name[0]}</AvatarFallback>
      </Avatar>

      {/* Name */}
      <div className="mt-4 text-center">
        <h1 className="text-2xl font-bold">{name}</h1>
        {/* <p className="text-sm text-gray-500 dark:text-gray-400">online</p> */}
      </div>

      {/* Modal Trigger */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div />
        </DialogTrigger>

        <DialogContent 
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50",
            "backdrop-blur-sm dark:backdrop-blur-md", // Blurry background effect
            "dark:bg-opacity-70"
          )}
          onClick={closeModal} // Close the modal when clicking outside
        >
          <div 
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl p-6 w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()} // Prevent modal from closing on inner content click
          >

            {/* Visually Hidden Dialog Title for Accessibility */}
            <DialogTitle>
              <VisuallyHidden>Profile for {name}</VisuallyHidden>
            </DialogTitle>

            {/* Avatar in Modal */}
            <Avatar className="w-72 h-72 border-4 border-white dark:border-gray-900 mx-auto mb-4">
              <AvatarImage 
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/` + avatarUrl} 
                className="object-cover rounded-full w-full h-full" 
              />
              <AvatarFallback>{name[0]}</AvatarFallback>
            </Avatar>

            <div className="mt-4 text-center">
              <h1 className="text-2xl font-bold">{name}</h1>
              {/* Add additional info or actions here */}
            </div>

            {/* Close Button */}
            <DialogClose asChild>
              <button className="mt-4 w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Close</button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
