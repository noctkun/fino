'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Download, Smartphone, Apple, Smartphone as Android, Shield, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function DownloadPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)

  // No need for useEffect since we're using Framer Motion

  const handleDownload = () => {
    // Create a temporary link element to trigger download
    const link = document.createElement('a')
    link.href = '/fino-release.apk'
    link.download = 'fino-release.apk'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const features = [
    'Track expenses with beautiful charts',
    'Add custom categories',
    'Complete spending history',
    'Yearly analysis and insights',
    '100% local data storage',
    'No internet required',
    'Beautiful animations',
    'Privacy-first design'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">Fino</span>
            </Link>
            
            <Link
              href="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="space-y-8"
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900">
              Download
              <span className="bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
                {' '}Fino
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started with Fino and take control of your finances. 
              Available for Android now, with iOS coming soon.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Platform Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Android Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto">
                    <Android className="w-10 h-10 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Android</h3>
                    <p className="text-gray-600 mb-6">Download the APK file and install on your Android device</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Android 6.0+</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>70MB APK</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>No Google Play required</span>
                        </div>
                  </div>

                  <button
                    onClick={handleDownload}
                    className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white py-4 px-6 rounded-2xl font-semibold text-lg hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download APK</span>
                  </button>

                  <p className="text-xs text-gray-500">
                    Version 1.0.0 • Last updated: Today
                  </p>
                </div>
              </div>
            </motion.div>

            {/* iOS Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100"></div>
                <div className="relative z-10 text-center space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto">
                    <Apple className="w-10 h-10 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">iOS</h3>
                    <p className="text-gray-600 mb-6">Coming soon to the App Store</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                      <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                      <span>iOS 14.0+</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                      <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                      <span>App Store</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                      <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                      <span>Coming Q2 2024</span>
                    </div>
                  </div>

                  <div className="bg-gray-100 text-gray-600 py-4 px-6 rounded-2xl font-semibold text-lg flex items-center justify-center space-x-2">
                    <span>🚀</span>
                    <span>Coming Soon</span>
                  </div>

                  <p className="text-xs text-gray-500">
                    Subscribe to get notified when available
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              What's Included
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to manage your finances effectively
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-gray-700 font-medium">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Installation Instructions */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-red-400 to-pink-500">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              How to Install
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Download APK</h3>
                <p className="text-red-100">Click the download button above to get the APK file</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Enable Installation</h3>
                <p className="text-red-100">Allow installation from unknown sources in your Android settings</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Install & Enjoy</h3>
                <p className="text-red-100">Tap the APK file and follow the installation prompts</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-2xl font-bold text-black">Fino</span>
            </div>
            <p className="text-black text-center md:text-right">
              © 2025 Fino. All rights reserved. Made with ❤️ for better financial management.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
