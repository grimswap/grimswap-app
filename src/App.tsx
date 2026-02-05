import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Providers } from './providers'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/home'
import { SwapPage } from './pages/swap'
import { PoolsPage } from './pages/pools'
import { WalletPage } from './pages/wallet'
import { ToastContainer } from './components/ui/toast'
import { useToast } from './hooks/use-toast'

function AppContent() {
  const { toasts, removeToast } = useToast()

  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/swap" element={<SwapPage />} />
          <Route path="/pools" element={<PoolsPage />} />
          <Route path="/wallet" element={<WalletPage />} />
        </Routes>
      </Layout>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  )
}

export function App() {
  return (
    <Providers>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Providers>
  )
}
