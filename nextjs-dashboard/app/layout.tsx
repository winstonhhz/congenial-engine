// This file is known as "root layout"
import '@/app/ui/global.css'; // Add global style in this file, to utilize it
import { inter } from '@/app/ui/fonts'; // Import inter from fonts file
 
export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return ( // By adding Inter to the <body> element, font will be applied throughout application
    <html lang="en">
      <body className={`${inter.className} antialiased`}> 
          {children}
        <h1 className="text-blue-500">I'm blueeee!</h1>          
      </body>
    </html>
  );
}
