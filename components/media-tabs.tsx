import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';

const mediaItems = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  type: 'image',
  url: `/placeholder.svg?height=400&width=400&text=Photo+${i + 1}`,
}));

export function MediaTabs() {
  return (
    <Tabs defaultValue="media" className="mt-8">
      <TabsList className="w-full grid grid-cols-5 bg-transparent gap-4 p-0 h-auto">
        {['Media', 'Files', 'Music', 'Links', 'Voice'].map((tab) => (
          <TabsTrigger
            key={tab}
            value={tab.toLowerCase()}
            className="flex-1 px-0 py-2 text-sm data-[state=active]:bg-transparent border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none font-medium"
          >
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="media" className="mt-6">
        <div className="grid grid-cols-3 gap-1 md:gap-2">
          {mediaItems.map((item) => (
            <div key={item.id} className="aspect-square relative rounded-lg overflow-hidden">
              <Image
                src={item.url}
                alt=""
                fill
                className="object-cover hover:opacity-90 transition-opacity"
                unoptimized={true}
              />
            </div>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="files" className="mt-6">
        <div className="text-center text-gray-500 py-8">No files available</div>
      </TabsContent>
      <TabsContent value="music" className="mt-6">
        <div className="text-center text-gray-500 py-8">No music available</div>
      </TabsContent>
      <TabsContent value="links" className="mt-6">
        <div className="text-center text-gray-500 py-8">No links available</div>
      </TabsContent>
      <TabsContent value="voice" className="mt-6">
        <div className="text-center text-gray-500 py-8">No voice messages available</div>
      </TabsContent>
    </Tabs>
  );
}
