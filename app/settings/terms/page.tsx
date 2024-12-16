import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function TermsPage() {
  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-900">
      <div className="flex items-center gap-4 p-4 border-b bg-white dark:bg-gray-800">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/settings">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-lg font-semibold">Terms of Service (EULA)</h1>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          This End User License Agreement is a binding contract between you and the Company for using the Layth app. By using the App, you agree to these terms.
        </p>

        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="license" className="border rounded-lg bg-white dark:bg-gray-800">
            <AccordionTrigger className="px-4">License Grant</AccordionTrigger>
            <AccordionContent className="px-4 text-sm text-gray-600 dark:text-gray-400">
              Subject to these Terms, the Company grants you a limited, non-exclusive, non-transferable license to use the App for your personal, non-commercial purposes.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="responsibilities" className="border rounded-lg bg-white dark:bg-gray-800">
            <AccordionTrigger className="px-4">User's Responsibilities</AccordionTrigger>
            <AccordionContent className="px-4 space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <div>
                <h4 className="font-medium mb-2">Compliance with Laws and Regulations</h4>
                <p>The User agrees to comply with all applicable local, state, national and international laws and regulations while using the App. This includes adhering to any relevant rules, guidelines or terms required by third-party services used in conjunction with the App.</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Registration and Account Information</h4>
                <p>In order to access certain features of the App, the User may be required to register an account. By registering, the User agrees to provide accurate, current, and complete information during the registration process. The User also agrees to keep their account credentials secure and confidential and is solely responsible for any activities that occur under their account.</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Contact Access and Usage</h4>
                <p>The App may request access to the User's device contacts to enhance the user experience, allowing the User to locate friends or invite them to use the App. This access, if granted by the User, is strictly limited to these purposes. The Company does not upload the User's contact information to its servers nor does it share contact information with third parties. The User's contacts remain on the device and are not accessed for any other purpose.</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="content" className="border rounded-lg bg-white dark:bg-gray-800">
            <AccordionTrigger className="px-4">No Tolerance for Objectionable Content</AccordionTrigger>
            <AccordionContent className="px-4 text-sm text-gray-600 dark:text-gray-400">
              Users are prohibited from posting, sharing, or transmitting any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}

