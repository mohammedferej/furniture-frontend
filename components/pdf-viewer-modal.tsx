// components/pdf-viewer-modal.tsx
'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FileText, Download, Printer, Share2 } from 'lucide-react'

interface PdfViewerModalProps {
  pdfUrl: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PdfViewerModal({ pdfUrl, open, onOpenChange }: PdfViewerModalProps) {
  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = `order-${new Date().toISOString()}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePrint = () => {
    const printWindow = window.open(pdfUrl, '_blank')
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print()
      }
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Order PDF',
          text: 'Check out this order document',
          url: pdfUrl,
        })
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(pdfUrl)
        alert('Link copied to clipboard!')
      }
    } catch (err) {
      console.error('Error sharing:', err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Order Document</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          <iframe 
            src={pdfUrl} 
            className="w-full h-full border rounded-md"
            title="PDF Viewer"
          />
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}