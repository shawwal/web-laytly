'use client'

interface Album {
  id: string
  title: string
  coverImage: string
  photoCount: number
}

const albums: Album[] = [
  {
    id: '1',
    title: 'Recents',
    coverImage: '/placeholder.svg?height=400&width=400',
    photoCount: 12307,
  },
  {
    id: '2',
    title: 'Dessert',
    coverImage: '/placeholder.svg?height=400&width=400',
    photoCount: 5170,
  },
  {
    id: '3',
    title: 'Holiday in Singapore',
    coverImage: '/placeholder.svg?height=400&width=400',
    photoCount: 17307,
  },
  {
    id: '4',
    title: 'My friends',
    coverImage: '/placeholder.svg?height=400&width=400',
    photoCount: 25910,
  },
  {
    id: '5',
    title: 'Badminton',
    coverImage: '/placeholder.svg?height=400&width=400',
    photoCount: 12307,
  },
  {
    id: '6',
    title: 'Photoshoot',
    coverImage: '/placeholder.svg?height=400&width=400',
    photoCount: 15170,
  },
]

export function AlbumsView() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4 overflow-y-auto pb-20 md:pb-4 mb-16 md:mb-0">
      {albums.map((album) => (
        <div
          key={album.id}
          className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden"
        >
          <div className="relative aspect-square">
            <img
              src={album.coverImage}
              alt={album.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-3">
            <h3 className="font-medium text-sm">{album.title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {album.photoCount.toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

