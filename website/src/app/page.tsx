'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Download, Smartphone, BarChart3, Shield, Zap, Heart } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  // No need for useEffect since we're using Framer Motion

  const features = [
    {
      icon: BarChart3,
      title: 'Smart Dashboard',
      description: 'Track your spending with beautiful charts and real-time insights',
      color: 'from-red-400 to-pink-500'
    },
    {
      icon: Zap,
      title: 'Easy Expense Tracking',
      description: 'Add expenses quickly with categories, descriptions, and custom categories',
      color: 'from-teal-400 to-cyan-500'
    },
    {
      icon: Smartphone,
      title: 'Complete History',
      description: 'View all your expenses with search, filter, and detailed information',
      color: 'from-blue-400 to-indigo-500'
    },
    {
      icon: BarChart3,
      title: 'Detailed Analysis',
      description: 'Analyze spending patterns by year with category breakdowns and trends',
      color: 'from-orange-400 to-red-500'
    },
    {
      icon: Shield,
      title: '100% Private',
      description: 'Your data stays on your device - no cloud, no accounts, no tracking',
      color: 'from-green-400 to-emerald-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">Fino</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <Link
                href="/download"
                className="px-6 py-2 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-full font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Download
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  Master Your
                  <span className="bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
                    {' '}Money
                  </span>
                </h1>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <p className="text-xl text-gray-600 leading-relaxed">
                  Track, analyze, and take control of your finances with Fino. 
                  Beautiful expense tracking with complete privacy - your data stays on your device.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  href="/download"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-red-400 to-pink-500 text-white text-lg font-semibold rounded-full hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download for Android
                </Link>
                <div className="inline-flex items-center justify-center px-8 py-4 bg-gray-100 text-gray-600 text-lg font-semibold rounded-full">
                  <span className="flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-red-400" />
                    iOS Coming Soon
                  </span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <div className="w-80 h-96 mx-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-2 shadow-2xl">
                  <div className="w-full h-full bg-white rounded-2xl overflow-hidden">
                    <div className="h-8 bg-gray-200 rounded-t-2xl flex items-center justify-center">
                      <div className="w-16 h-1 bg-gray-400 rounded-full"></div>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-pink-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">F</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">Fino</span>
                      </div>
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-32 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg flex items-center justify-center">
                          <BarChart3 className="w-12 h-12 text-red-400" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="h-8 bg-red-100 rounded"></div>
                          <div className="h-8 bg-teal-100 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full animate-bounce-gentle"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-1/2 -left-8 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-bounce-gentle" style={{ animationDelay: '2s' }}></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need to
              <span className="bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
                {' '}Manage Money
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fino provides all the tools you need to take control of your finances, 
              with beautiful design and complete privacy.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-red-400 to-pink-500">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              Ready to Take Control?
            </h2>
            <p className="text-xl text-red-100 max-w-2xl mx-auto">
              Join thousands of users who are already mastering their finances with Fino. 
              Download now and start your journey to financial freedom.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/download"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-red-500 text-lg font-semibold rounded-full hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Download className="w-5 h-5 mr-2" />
                Download APK
              </Link>
              <div className="inline-flex items-center justify-center px-8 py-4 bg-red-500/20 text-white text-lg font-semibold rounded-full border border-red-300">
                <Heart className="w-5 h-5 mr-2" />
                iOS Coming Soon
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