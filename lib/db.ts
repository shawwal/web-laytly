'use client'

import { openDB, DBSchema, IDBPDatabase } from 'idb'

interface ChatDB extends DBSchema {
  messages: {
    key: string
    value: {
      id: string
      content: string
      senderId: string
      receiverId: string
      timestamp: number
      status: 'sending' | 'sent' | 'seen'
      images?: string[]
    }
    indexes: { 'by-receiver': string }
  }
  contacts: {
    key: string
    value: {
      id: string
      name: string
      avatar: string
      lastMessage: string
      lastMessageTime: number
      unreadCount: number
    }
  }
}

let dbPromise: Promise<IDBPDatabase<ChatDB>>

export async function initDB() {
  dbPromise = openDB<ChatDB>('chat-app', 1, {
    upgrade(db) {
      const messagesStore = db.createObjectStore('messages', { keyPath: 'id' })
      messagesStore.createIndex('by-receiver', 'receiverId')
      db.createObjectStore('contacts', { keyPath: 'id' })
    },
  })

  const db = await dbPromise
  const contactsCount = await db.count('contacts')

  if (contactsCount === 0) {
    await populateWithMockData()
  }

  return dbPromise
}

export async function getMessages(contactId: string) {
  const db = await dbPromise
  return db.getAllFromIndex('messages', 'by-receiver', contactId)
}

export async function addMessage(message: ChatDB['messages']['value']) {
  const db = await dbPromise
  return db.add('messages', message)
}

export async function getContacts() {
  const db = await dbPromise
  return db.getAll('contacts')
}

async function populateWithMockData() {
  const db = await dbPromise
  const tx = db.transaction(['contacts', 'messages'], 'readwrite')
  const contactsStore = tx.objectStore('contacts')
  const messagesStore = tx.objectStore('messages')

  const contacts = [
    {
      id: '1',
      name: 'Alice Johnson',
      avatar: 'https://i.pravatar.cc/150?u=alice',
      lastMessage: 'The weather should be perfect for hiking!',
      lastMessageTime: Date.now() - 1000 * 60 * 5,
      unreadCount: 2,
    },
    {
      id: '2',
      name: 'Bob Smith',
      avatar: 'https://i.pravatar.cc/150?u=bob',
      lastMessage: 'Can you send me the project files?',
      lastMessageTime: Date.now() - 1000 * 60 * 30,
      unreadCount: 0,
    },
    {
      id: '3',
      name: 'Carol White',
      avatar: 'https://i.pravatar.cc/150?u=carol',
      lastMessage: 'The project is looking great!',
      lastMessageTime: Date.now() - 1000 * 60 * 60 * 2,
      unreadCount: 0,
    },
    {
      id: '4',
      name: 'David Brown',
      avatar: 'https://i.pravatar.cc/150?u=david',
      lastMessage: 'Can you send me the report?',
      lastMessageTime: Date.now() - 1000 * 60 * 60 * 24,
      unreadCount: 1,
    },
  ]

  const messages = [
    {
      id: '1',
      content: 'Hey, are you still up for the weekend trip to the mountains?',
      senderId: '1',
      receiverId: 'me',
      timestamp: Date.now() - 1000 * 60 * 30,
      status: 'seen' as const, // Explicitly typing as const
    },
    {
      id: '2',
      content: 'Yes, definitely! I\'ve been looking forward to it.',
      senderId: 'me',
      receiverId: '1',
      timestamp: Date.now() - 1000 * 60 * 29,
      status: 'seen' as const, // Explicitly typing as const
    },
    {
      id: '3',
      content: 'Great! I checked the weather forecast. It should be perfect for hiking.',
      senderId: '1',
      receiverId: 'me',
      timestamp: Date.now() - 1000 * 60 * 28,
      status: 'seen' as const, // Explicitly typing as const
    },
    {
      id: '4',
      content: 'That\'s awesome! What time should we leave?',
      senderId: 'me',
      receiverId: '1',
      timestamp: Date.now() - 1000 * 60 * 27,
      status: 'seen' as const, // Explicitly typing as const
    },
    {
      id: '5',
      content: 'How about 7 AM? We could avoid the traffic and have more time for hiking.',
      senderId: '1',
      receiverId: 'me',
      timestamp: Date.now() - 1000 * 60 * 10,
      status: 'seen' as const, // Explicitly typing as const
    },
    {
      id: '6',
      content: 'Sounds perfect! Here are some photos from our last trip.',
      senderId: 'me',
      receiverId: '1',
      timestamp: Date.now() - 1000 * 60 * 5,
      status: 'sent' as const, // Explicitly typing as 'sent'
      images: [
        'https://picsum.photos/seed/trip1/400/400',
        'https://picsum.photos/seed/trip2/400/400',
        'https://picsum.photos/seed/trip3/400/400',
        'https://picsum.photos/seed/trip4/400/400',
        'https://picsum.photos/seed/trip5/400/400',
      ],
    },
    {
      id: '7',
      content: 'Wow, these look amazing! Can\'t wait for our next adventure.',
      senderId: '1',
      receiverId: 'me',
      timestamp: Date.now() - 1000 * 60 * 2,
      status: 'seen' as const, // Explicitly typing as const
    },
  ]

  await Promise.all([
    ...contacts.map(contact => contactsStore.put(contact)),
    ...messages.map(message => messagesStore.put(message))
  ])

  await tx.done
}

