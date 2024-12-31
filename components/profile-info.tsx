import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfileInfoProps {
  name: string;
  avatarUrl: string;
}

export function ProfileInfo({ name, avatarUrl }: ProfileInfoProps) {
  return (
    <div className="relative px-4 pb-4 -mt-20 max-w-4xl mx-auto">
      <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-900 mx-auto">
        <AvatarImage src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/` + avatarUrl} className="object-cover rounded-full w-full h-full" />
        <AvatarFallback>{name[0]}</AvatarFallback>
      </Avatar>

      <div className="mt-4 text-center">
        <h1 className="text-2xl font-bold">{name}</h1>
        {/* <p className="text-sm text-gray-500 dark:text-gray-400">online</p> */}
      </div>
    </div>
  );
}
