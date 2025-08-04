// components/footer.tsx
'use client'

import { Github, Twitter, Linkedin } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-200 dark:bg-gray-900">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            {/* <Button variant="ghost" size="icon" asChild>
              <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </Button> */}
          </div>

          <div className="text-sm text-blue-500 dark:text-gray-400">
            © {new Date().getFullYear()} Copyright.
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400 mt-4 md:mt-0">
            <a href="/privacy" className="hover:underline mr-4"></a>
            <a href="/terms" className="hover:underline"></a>
          </div>
        </div>
      </div>
    </footer>
  )
}