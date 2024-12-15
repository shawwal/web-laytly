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
      avatar: '/placeholder.svg?height=40&width=40',
      lastMessage: 'The weather should be perfect for hiking!',
      lastMessageTime: Date.now() - 1000 * 60 * 5,
      unreadCount: 2,
    },
    {
      id: '2',
      name: 'Bob Smith',
      avatar: '/placeholder.svg?height=40&width=40',
      lastMessage: 'Can you send me the project files?',
      lastMessageTime: Date.now() - 1000 * 60 * 30,
      unreadCount: 0,
    },
    {
      id: '3',
      name: 'Carol White',
      avatar: '/placeholder.svg?height=40&width=40',
      lastMessage: 'The project is looking great!',
      lastMessageTime: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
      unreadCount: 0,
    },
    {
      id: '4',
      name: 'David Brown',
      avatar: '/placeholder.svg?height=40&width=40',
      lastMessage: 'Can you send me the report?',
      lastMessageTime: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
      unreadCount: 1,
    },
  ]

  const messages: ChatDB['messages']['value'][] = [
    {
      id: '1',
      content: 'Hey, are you still up for the weekend trip to the mountains?',
      senderId: '1',
      receiverId: 'me',
      timestamp: Date.now() - 1000 * 60 * 30,
      status: 'seen', // No need for type assertion
    },
    {
      id: '2',
      content: 'Yes, definitely! I\'ve been looking forward to it.',
      senderId: 'me',
      receiverId: '1',
      timestamp: Date.now() - 1000 * 60 * 29,
      status: 'seen',
    },
    {
      id: '3',
      content: 'Great! I checked the weather forecast. It should be perfect for hiking.',
      senderId: '1',
      receiverId: 'me',
      timestamp: Date.now() - 1000 * 60 * 28,
      status: 'seen',
    },
    {
      id: '4',
      content: 'That\'s awesome! What time should we leave?',
      senderId: 'me',
      receiverId: '1',
      timestamp: Date.now() - 1000 * 60 * 27,
      status: 'seen',
    },
    {
      id: '5',
      content: 'How about 7 AM? We could avoid the traffic and have more time for hiking.',
      senderId: '1',
      receiverId: 'me',
      timestamp: Date.now() - 1000 * 60 * 10,
      status: 'seen',
    },
    {
      id: '6',
      content: 'Hi, do you have a minute to discuss the project?',
      senderId: '2',
      receiverId: 'me',
      timestamp: Date.now() - 1000 * 60 * 120,
      status: 'seen',
    },
    {
      id: '7',
      content: 'Sure, what\'s on your mind?',
      senderId: 'me',
      receiverId: '2',
      timestamp: Date.now() - 1000 * 60 * 119,
      status: 'seen',
    },
    {
      id: '8',
      content: 'Could you share the latest design files? I need to review them.',
      senderId: '2',
      receiverId: 'me',
      timestamp: Date.now() - 1000 * 60 * 118,
      status: 'seen',
    },
  ]

  await Promise.all([
    ...contacts.map(contact => contactsStore.put(contact)),
    ...messages.map(message => messagesStore.put(message))
  ])

  await tx.done
}

