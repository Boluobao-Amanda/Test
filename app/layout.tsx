import './globals.css'
import { Inter, Cormorant } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const cormorant = Cormorant({ subsets: ['latin'], variable: '--font-cormorant' })

export const metadata = {
  title: 'PETS LOVE - Handcrafted Pet Memorial Jewelry',
  description: 'Timeless jewelry pieces crafted to celebrate the eternal bond with your beloved companion. Custom pet memorial pendants, rings, bracelets & brooches.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cormorant.variable} font-sans`}>
        {children}
        <script src="/efflora-bridge.js" defer></script>
      </body>
    </html>
  )
}

