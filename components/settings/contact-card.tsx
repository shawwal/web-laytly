import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Contact {
  id: string
  name: string
  phone: string
  avatar: string
}

interface ContactCardProps {
  contact: Contact
}

export const ContactCard = ({ contact }: ContactCardProps) => {
  return (
    <div className="flex items-center gap-4 p-4">
      <Avatar className="h-12 w-12">
        <AvatarImage src={contact.avatar} />
        <AvatarFallback>{contact.name[0]}</AvatarFallback>
      </Avatar>
      <div>
        <h3 className="font-medium">{contact.name}</h3>
        <p className="text-sm text-gray-500">{contact.phone}</p>
      </div>
    </div>
  )
}
