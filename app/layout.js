import './globals.css'

export const metadata = {
  title: 'New Domain - Premium Services',
  description: 'Experience premium services with cutting-edge technology and exceptional quality.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
