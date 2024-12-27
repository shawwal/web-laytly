import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ContactCard } from '@/components/settings/contact-card'
import { alphabet } from '@/utils/alphabet'

interface Contact {
  id: string
  name: string
  phone: string
  avatar: string
}
interface ContactListProps {
  contacts: Contact[]
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
}

export const ContactList = ({ contacts, search, setSearch }: ContactListProps) => {
  // Filter contacts based on search
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(search.toLowerCase()) ||
    contact.phone.includes(search)
  )

  // Group contacts by alphabet
  const groupedContacts = alphabet.reduce((acc, letter) => {
    const letterContacts = filteredContacts.filter(contact => 
      contact.name.toUpperCase().startsWith(letter)
    )
    if (letterContacts.length > 0) {
      acc[letter] = letterContacts
    }
    return acc
  }, {} as Record<string, Contact[]>)

  return (
    <div className="p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search name or number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white dark:bg-gray-800"
          />
        </div>

        {/* Grouped Contacts */}
        <div className="relative flex">
          {/* Alphabet Sidebar (Fixed position) */}
          <div className="fixed top-32 right-4 flex flex-col gap-1 text-xs font-medium text-gray-500">
            {alphabet.map(letter => (
              <button
                key={letter}
                className="py-0.5 px-1 hover:text-blue-500"
                onClick={() => {
                  document.getElementById(letter)?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                {letter}
              </button>
            ))}
          </div>

          {/* Contact List (Scrollable) */}
          <div className="flex-grow pr-6 space-y-4 pl-1 sm:pb-24 pb-8">
            {Object.entries(groupedContacts).map(([letter, contacts]) => (
              <div key={letter} id={letter}>
                <h2 className="text-sm font-medium text-gray-500 mb-2">{letter}</h2>
                <div className="bg-white dark:bg-gray-800 rounded-lg divide-y dark:divide-gray-700">
                  {contacts.map(contact => (
                    <ContactCard key={contact.id} contact={contact} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
