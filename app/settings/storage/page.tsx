import { ChevronLeft, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Progress } from '@/components/ui/progress'
import Image from 'next/image'

const storageData = {
  total: 250,
  used: 145,
  categories: [
    { type: 'Photos', size: 75, files: 1200, color: 'bg-blue-500' },
    { type: 'Videos', size: 37, files: 50, color: 'bg-orange-500' },
    { type: 'Documents', size: 25, files: 17, color: 'bg-red-500' },
  ]
}

export default function StoragePage() {
  const usedPercentage = (storageData.used / storageData.total) * 100

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-900">
      <div className="flex items-center gap-4 p-4 border-b bg-white dark:bg-gray-800">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/settings">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-lg font-semibold">Storage</h1>
      </div>

      <div className="p-4 max-w-2xl mx-auto space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-4">
          <h2 className="font-medium">My Storage</h2>
          <div className="flex justify-between text-sm">
            <span>{storageData.used} GB of {storageData.total} GB</span>
            <span>{Math.round(usedPercentage)}% used</span>
          </div>
          <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
            {storageData.categories.map((category, index) => (
              <div
                key={category.type}
                className={`${category.color}`}
                style={{ width: `${(category.size / storageData.total) * 100}%` }}
              />
            ))}
          </div>
          <div className="flex gap-4">
            {storageData.categories.map((category) => (
              <div key={category.type} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${category.color}`} />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {category.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium">Looking to Expand Your Storage?</h2>
            <Button className="bg-[#5BA4A4] hover:bg-[#4A8F8F]">
              Upgrade
            </Button>
          </div>
          <div className="relative h-32">
            <Image
              src="/placeholder.svg?text=storage-illustration"
              alt="Storage illustration"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg divide-y dark:divide-gray-700">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-medium">Storage Category</h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
          </div>
          {storageData.categories.map((category) => (
            <div key={category.type} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg ${category.color} bg-opacity-10 flex items-center justify-center`}>
                  <div className={`w-5 h-5 rounded-sm ${category.color}`} />
                </div>
                <div>
                  <h3 className="font-medium">{category.type}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {category.files.toLocaleString()} files / {category.size} GB Used
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

