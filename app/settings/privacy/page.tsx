import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-900">
      <div className="flex items-center gap-4 p-4 border-b bg-white dark:bg-gray-800">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/settings">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-lg font-semibold">Privacy Policy</h1>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Last updated: December 16, 2024
        </p>

        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="collection" className="border rounded-lg bg-white dark:bg-gray-800">
            <AccordionTrigger className="px-4">Information We Collect</AccordionTrigger>
            <AccordionContent className="px-4 text-sm text-gray-600 dark:text-gray-400 space-y-4">
              <p>We collect information you provide directly to us, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Account information (name, email, phone number)</li>
                <li>Profile information (avatar, status)</li>
                <li>Communications (messages, voice notes)</li>
                <li>Content you share (photos, documents)</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="usage" className="border rounded-lg bg-white dark:bg-gray-800">
            <AccordionTrigger className="px-4">How We Use Your Information</AccordionTrigger>
            <AccordionContent className="px-4 text-sm text-gray-600 dark:text-gray-400 space-y-4">
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide and maintain our services</li>
                <li>Process and complete transactions</li>
                <li>Send you technical notices and support messages</li>
                <li>Communicate with you about products, services, and events</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="sharing" className="border rounded-lg bg-white dark:bg-gray-800">
            <AccordionTrigger className="px-4">Information Sharing</AccordionTrigger>
            <AccordionContent className="px-4 text-sm text-gray-600 dark:text-gray-400">
              <p>
                We do not sell, trade, or otherwise transfer your personally identifiable information to third parties. 
                This does not include trusted third parties who assist us in operating our website, conducting our business, 
                or servicing you, as long as those parties agree to keep this information confidential.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="security" className="border rounded-lg bg-white dark:bg-gray-800">
            <AccordionTrigger className="px-4">Data Security</AccordionTrigger>
            <AccordionContent className="px-4 text-sm text-gray-600 dark:text-gray-400">
              <p>
                We implement appropriate technical and organizational security measures to protect your personal information. 
                However, please note that no method of transmission over the internet or electronic storage is 100% secure.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="rights" className="border rounded-lg bg-white dark:bg-gray-800">
            <AccordionTrigger className="px-4">Your Rights</AccordionTrigger>
            <AccordionContent className="px-4 text-sm text-gray-600 dark:text-gray-400 space-y-4">
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Object to processing of your information</li>
                <li>Request restriction of processing</li>
                <li>Data portability</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}

