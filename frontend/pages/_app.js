import '../styles/globals.css'
import Navbar from '../components/Navbar'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { isAuthenticated } from '../utils/auth'

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const noAuthRoutes = ['/login']

  useEffect(() => {
    const isAuthPage = noAuthRoutes.includes(router.pathname)

    if (!isAuthenticated() && !isAuthPage) {
      router.push('/login')
    }

    if (isAuthenticated() && router.pathname === '/login') {
      router.push('/dashboard')
    }
  }, [router.pathname])

  const showNavbar = !noAuthRoutes.includes(router.pathname)

  return (
    <>
      {showNavbar && <Navbar />}
      <AnimatePresence mode="wait">
        <motion.div
          key={router.route}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="p-4"
        >
          <Component {...pageProps} />
        </motion.div>
      </AnimatePresence>
    </>
  )
}

export default MyApp
