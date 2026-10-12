import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { ClerkProvider } from '@clerk/clerk-react'
import 'katex/dist/katex.min.css'
import './index.css'
import { TRPCProvider } from "@/providers/trpc"
import App from './App.tsx'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

createRoot(document.getElementById('root')!).render(
  <ClerkProvider publishableKey={clerkPubKey} afterSignOutUrl="/">
    <BrowserRouter>
      <TRPCProvider>
        <App />
      </TRPCProvider>
    </BrowserRouter>
  </ClerkProvider>,
)
