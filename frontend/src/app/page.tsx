import Head from 'next/head';

export default function ThreatHawk() {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="AI-generated website" />
        <meta name="theme-color" content="#ffffff" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="robots" content="index, follow" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <script src="https://cdn.tailwindcss.com"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                theme: {
                  extend: {
                    colors: {
                      primary: {
                        50: '#f8f8f8',
                        100: '#e8e8e8',
                        200: '#d3d3d3',
                        300: '#a3a3a3',
                        400: '#737373',
                        500: '#525252',
                        600: '#404040',
                        700: '#262626',
                        800: '#171717',
                        900: '#0a0a0a',
                        950: '#030303',
                      },
                      secondary: {
                        50: '#f8f8f8',
                        100: '#e8e8e8',
                        200: '#d3d3d3',
                        300: '#a3a3a3',
                        400: '#737373',
                        500: '#525252',
                        600: '#404040',
                        700: '#262626',
                        800: '#171717',
                        900: '#0a0a0a',
                        950: '#030303',
                      },
                      accent: {
                        50: '#f8f8f8',
                        100: '#e8e8e8',
                        200: '#d3d3d3',
                        300: '#a3a3a3',
                        400: '#737373',
                        500: '#525252',
                        600: '#404040',
                        700: '#262626',
                        800: '#171717',
                        900: '#0a0a0a',
                        950: '#030303',
                      },
                    },
                    fontFamily: {
                      sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
                      heading: ['Montserrat', 'Inter', 'system-ui', 'sans-serif'],
                    },
                    spacing: {
                      '18': '4.5rem',
                      '22': '5.5rem',
                      '30': '7.5rem',
                    },
                    maxWidth: {
                      '8xl': '88rem',
                      '9xl': '96rem',
                    },
                  },
                },
                variants: {
                  extend: {
                    opacity: ['disabled'],
                    cursor: ['disabled'],
                    backgroundColor: ['active', 'disabled'],
                    textColor: ['active', 'disabled'],
                  },
                },
              }
            `,
          }}
        />
        <style>{`
          * {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          *::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
          }
          ::-webkit-scrollbar {
            width: 0px;
          }
          ::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #666;
          }
          * {
            -webkit-tap-highlight-color: transparent;
          }
          body {
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          :focus-visible {
            outline: 2px solid currentColor;
            outline-offset: 2px;
          }
          @media print {
            .no-print {
              display: none !important;
            }
            a[href]:after {
              content: " (" attr(href) ")";
            }
          }
        `}</style>
      </Head>
      <div className="antialiased text-gray-800 min-h-screen flex flex-col scroll-smooth">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-white focus:text-black"
        >
          Skip to main content
        </a>

        <header className="relative z-50 bg-white dark:bg-gray-900">
          <nav id="navbar" className="fixed w-full z-50 bg-neutral-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <a href="" className="text-xl font-bold">
                      ThreatHawk
                    </a>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">

                    <a
                      href="#scanner"
                      className="hover:bg-neutral-700 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Scanner
                    </a>
                    <a
                      href="#benefits"
                      className="hover:bg-neutral-700 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Dashboard
                    </a>
                    <a
                      href="#howitworks"
                      className="hover:bg-neutral-700 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      How It Works
                    </a>


                    <a
                      href="https://github.com"
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
                    >
                      GitHub
                    </a>
                  </div>
                </div>
                <div className="md:hidden">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-neutral-700 focus:outline-none"
                    aria-controls="mobile-menu"
                    aria-expanded="false"
                  >
                    <span className="sr-only">Open main menu</span>
                    <svg
                      className="block h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="hidden md:hidden" id="mobile-menu">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-neutral-900">
                <a
                  href="#features"
                  className="block hover:bg-neutral-700 px-3 py-2 rounded-md text-base font-medium"
                >
                  Features
                </a>
                <a
                  href="#scanner"
                  className="block hover:bg-neutral-700 px-3 py-2 rounded-md text-base font-medium"
                >
                  Scanner
                </a>
                <a
                  href="#benefits"
                  className="block hover:bg-neutral-700 px-3 py-2 rounded-md text-base font-medium"
                >
                  Benefits
                </a>
                <a
                  href="#howitworks"
                  className="block hover:bg-neutral-700 px-3 py-2 rounded-md text-base font-medium"
                >
                  How It Works
                </a>
                <a
                  href="#testimonials"
                  className="block hover:bg-neutral-700 px-3 py-2 rounded-md text-base font-medium"
                >
                  Testimonials
                </a>
                <a
                  href="#documentation"
                  className="block hover:bg-neutral-700 px-3 py-2 rounded-md text-base font-medium"
                >
                  Docs
                </a>
                <a
                  href="https://github.com"
                  className="block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-base font-medium"
                >
                  GitHub
                </a>
              </div>
            </div>
          </nav>
        </header>

        <main id="main-content" className="flex-1 relative">
          <section id="hero" className="bg-neutral-900 text-white min-h-[70vh] pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between py-12">
              <div className="lg:w-1/2 space-y-8">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Secure Your Web Apps with <span className="text-blue-500">ThreatHawk</span>
                </h1>
                <p className="text-xl text-gray-300">
                  Open-source vulnerability scanner that detects OWASP Top 10 security issues in your web applications with just one click.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <form className="flex-1 flex gap-4">
                    <input
                      type="url"
                      placeholder="Enter your website URL"
                      className="flex-1 px-6 py-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:outline-none focus:border-blue-500 text-white"
                      required
                    />
                    <button
                      type="submit"
                      className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                    >
                      Scan Now
                    </button>
                  </form>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Free & Open Source
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    OWASP Top 10 Detection
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 mt-12 lg:mt-0">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-30"></div>
                  <div className="relative bg-neutral-800 p-6 rounded-lg border border-neutral-700">
                    <pre className="text-sm text-gray-300 font-mono">
                      <span className="text-blue-400">$</span> threathawk scan --url example.com
                      <span className="text-green-400">✓</span> Initializing security scan...
                      <span className="text-green-400">✓</span> Checking for SQL Injection...
                      <span className="text-green-400">✓</span> Analyzing XSS vulnerabilities...
                      <span className="text-green-400">✓</span> Detecting CSRF issues...
                      <span className="text-yellow-400">!</span> Scan complete. View detailed report...
                    </pre>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-900 to-transparent"></div>
          </section>

          <section id="features" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-neutral-900 mb-4">Comprehensive Security Features</h2>
                <p className="text-xl text-neutral-600">Powerful vulnerability detection powered by industry-standard tools</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-neutral-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">OWASP Top 10 Detection</h3>
                  <p className="text-neutral-600">Automatically scans for the most critical web application security risks defined by OWASP.</p>
                </div>
                <div className="bg-neutral-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">One-Click Scanning</h3>
                  <p className="text-neutral-600">Simple interface for quick vulnerability assessment. Just enter your URL and get started.</p>
                </div>
                <div className="bg-neutral-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Detailed Reports</h3>
                  <p className="text-neutral-600">Comprehensive vulnerability reports with actionable remediation steps.</p>
                </div>
                <div className="bg-neutral-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Advanced Configuration</h3>
                  <p className="text-neutral-600">Customize scan parameters and security checks based on your needs.</p>
                </div>
                <div className="bg-neutral-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Real-Time Scanning</h3>
                  <p className="text-neutral-600">Get instant feedback as vulnerabilities are discovered during the scan process.</p>
                </div>
                <div className="bg-neutral-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">API Integration</h3>
                  <p className="text-neutral-600">Easily integrate security scanning into your development workflow with our API.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="scanner" className="py-20 bg-neutral-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Try Our Scanner Now</h2>
                <p className="text-xl text-gray-300">Scan your website for vulnerabilities in seconds</p>
              </div>
              <div className="max-w-3xl mx-auto">
                <div className="bg-neutral-800 rounded-xl p-8 shadow-2xl">
                  <form id="scan-form" className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="url" className="block text-sm font-medium text-gray-300">
                        Website URL
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          id="url"
                          name="url"
                          className="block w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                          placeholder="https://your-website.com"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            className="form-checkbox rounded bg-neutral-700 border-neutral-600 text-blue-500 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-300">SQL Injection</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            className="form-checkbox rounded bg-neutral-700 border-neutral-600 text-blue-500 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-300">XSS Vulnerabilities</span>
                        </label>
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            className="form-checkbox rounded bg-neutral-700 border-neutral-600 text-blue-500 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-300">CSRF Detection</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            className="form-checkbox rounded bg-neutral-700 border-neutral-600 text-blue-500 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-300">Security Misconfigurations</span>
                        </label>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                    >
                      Start Scanning
                    </button>
                  </form>
                  <div id="scan-results" className="mt-8">
                    <div className="bg-neutral-700 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <div className="rounded-full h-4 w-4 border-b-2 border-blue-500 animate-spin"></div>
                        <span className="text-sm text-gray-300">Scanning in progress...</span>
                      </div>
                      <div className="mt-4 font-mono text-sm text-gray-300" id="scan-log">
                        <div className="py-1">[12:00:01] Initializing security scan...</div>
                        <div className="py-1">[12:00:02] Checking for SQL Injection vulnerabilities...</div>
                        <div className="py-1">[12:00:03] Scanning for XSS attacks...</div>
                        <div className="py-1">[12:00:04] Analyzing security configurations...</div>
                        <div className="py-1">[12:00:05] Generating report...</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="benefits" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-neutral-900 mb-4">Why Choose ThreatHawk?</h2>
                <p className="text-xl text-neutral-600">Enterprise-grade security scanning accessible to everyone</p>
              </div>
              <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-neutral-900 mb-2">Free & Open Source</h3>
                      <p className="text-neutral-600">No hidden costs or premium features. Everything is open source and freely available to the community.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-neutral-900 mb-2">Lightning Fast Results</h3>
                      <p className="text-neutral-600">Get comprehensive security analysis in minutes, not hours. Quick and efficient scanning process.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-neutral-900 mb-2">Enterprise-Grade Security</h3>
                      <p className="text-neutral-600">Powered by industry-standard tools like OWASP ZAP, ensuring professional-level security scanning.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-neutral-900 mb-2">Customizable Scans</h3>
                      <p className="text-neutral-600">Tailor security checks to your needs with flexible configuration options.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-neutral-50 rounded-2xl p-8 shadow-lg">
                  <div className="space-y-8">
                    <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                      <div className="text-4xl font-bold text-blue-600 mb-2">100+</div>
                      <div className="text-neutral-600">Security Checks</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                        <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
                        <div className="text-neutral-600">Availability</div>
                      </div>
                      <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                        <div className="text-3xl font-bold text-purple-600 mb-2">5000+</div>
                        <div className="text-neutral-600">Daily Scans</div>
                      </div>
                    </div>
                    <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                      <div className="text-4xl font-bold text-red-600 mb-2">10K+</div>
                      <div className="text-neutral-600">Active Users</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="howitworks" className="py-20 bg-neutral-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">How ThreatHawk Works</h2>
                <p className="text-xl text-gray-300">Simple, powerful, and efficient security scanning in 4 easy steps</p>
              </div>
              <div className="relative">
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-600"></div>
                <div className="space-y-16">
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 md:pr-16 text-right">
                      <div className="bg-neutral-800 p-6 rounded-xl shadow-lg">
                        <h3 className="text-2xl font-semibold mb-3 text-blue-500">1. Enter Your URL</h3>
                        <p className="text-gray-300">Simply paste your website URL into the scanner. That's all we need to get started.</p>
                      </div>
                    </div>
                    <div className="hidden md:block w-12 h-12 bg-blue-600 rounded-full flex-shrink-0 transform translate-y-4"></div>
                    <div className="md:w-1/2 md:pl-16 mt-4 md:mt-0"></div>
                  </div>
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 md:pr-16"></div>
                    <div className="hidden md:block w-12 h-12 bg-blue-600 rounded-full flex-shrink-0 transform translate-y-4"></div>
                    <div className="md:w-1/2 md:pl-16 mt-4 md:mt-0">
                      <div className="bg-neutral-800 p-6 rounded-xl shadow-lg">
                        <h3 className="text-2xl font-semibold mb-3 text-blue-500">2. Automated Scanning</h3>
                        <p className="text-gray-300">Our advanced algorithms powered by OWASP ZAP analyze your website for security vulnerabilities.</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 md:pr-16 text-right">
                      <div className="bg-neutral-800 p-6 rounded-xl shadow-lg">
                        <h3 className="text-2xl font-semibold mb-3 text-blue-500">3. Vulnerability Detection</h3>
                        <p className="text-gray-300">ThreatHawk identifies potential security risks including SQL injection, XSS, and other OWASP Top 10 vulnerabilities.</p>
                      </div>
                    </div>
                    <div className="hidden md:block w-12 h-12 bg-blue-600 rounded-full flex-shrink-0 transform translate-y-4"></div>
                    <div className="md:w-1/2 md:pl-16 mt-4 md:mt-0"></div>
                  </div>
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 md:pr-16"></div>
                    <div className="hidden md:block w-12 h-12 bg-blue-600 rounded-full flex-shrink-0 transform translate-y-4"></div>
                    <div className="md:w-1/2 md:pl-16 mt-4 md:mt-0">
                      <div className="bg-neutral-800 p-6 rounded-xl shadow-lg">
                        <h3 className="text-2xl font-semibold mb-3 text-blue-500">4. Detailed Reporting</h3>
                        <p className="text-gray-300">Receive a comprehensive security report with actionable recommendations for fixing identified vulnerabilities.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-20 text-center">
                  <div className="inline-block bg-neutral-800 p-8 rounded-xl shadow-xl">
                    <h3 className="text-2xl font-bold mb-4">Ready to Secure Your Website?</h3>
                    <p className="text-gray-300 mb-6">Start your first security scan today - it's free and takes only minutes.</p>
                    <a
                      href="#scanner"
                      className="inline-block bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-medium transition-colors"
                    >
                      Start Scanning Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="testimonials" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-neutral-900 mb-4">Trusted by Security Professionals</h2>
                <p className="text-xl text-neutral-600">See what our users have to say about ThreatHawk</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-neutral-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-white">JD</span>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold">John Doe</h4>
                      <p className="text-sm text-neutral-600">Security Engineer at TechCorp</p>
                    </div>
                  </div>
                  <div className="mb-4">★★★★★</div>
                  <p className="text-neutral-600">ThreatHawk has become an essential part of our security testing pipeline. The detailed reports have helped us identify and fix critical vulnerabilities before deployment.</p>
                </div>
                <div className="bg-neutral-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-white">AS</span>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold">Alice Smith</h4>
                      <p className="text-sm text-neutral-600">DevOps Lead at StartupX</p>
                    </div>
                  </div>
                  <div className="mb-4">★★★★★</div>
                  <p className="text-neutral-600">As a startup, we needed a cost-effective security solution. ThreatHawk's open-source model and enterprise-grade capabilities were exactly what we needed.</p>
                </div>
                <div className="bg-neutral-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-white">RJ</span>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold">Robert Johnson</h4>
                      <p className="text-sm text-neutral-600">Independent Security Consultant</p>
                    </div>
                  </div>
                  <div className="mb-4">★★★★★</div>
                  <p className="text-neutral-600">The simplicity of ThreatHawk is its biggest strength. One-click scanning with comprehensive results makes it perfect for quick security assessments.</p>
                </div>
              </div>
              <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">10k+</div>
                  <p className="text-neutral-600">Active Users</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">1M+</div>
                  <p className="text-neutral-600">Scans Completed</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">99.9%</div>
                  <p className="text-neutral-600">Uptime</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
                  <p className="text-neutral-600">Support</p>
                </div>
              </div>
            </div>
          </section>

          <section id="documentation" className="py-20 bg-neutral-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">Documentation & Resources</h2>
                <p className="text-xl text-gray-300">Everything you need to get started with ThreatHawk</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-neutral-800 rounded-xl p-6 hover:bg-neutral-700 transition-colors">
                  <div className="h-12 w-12 bg-blue-600 rounded-lg mb-4 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Quick Start Guide</h3>
                  <p className="text-gray-300 mb-4">Get up and running with ThreatHawk in less than 5 minutes.</p>
                  <a href="#" className="text-blue-400 hover:text-blue-300 flex items-center">
                    Read Guide
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
                <div className="bg-neutral-800 rounded-xl p-6 hover:bg-neutral-700 transition-colors">
                  <div className="h-12 w-12 bg-green-600 rounded-lg mb-4 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">API Documentation</h3>
                  <p className="text-gray-300 mb-4">Comprehensive API reference for integration and automation.</p>
                  <a href="#" className="text-blue-400 hover:text-blue-300 flex items-center">
                    View Docs
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
                <div className="bg-neutral-800 rounded-xl p-6 hover:bg-neutral-700 transition-colors">
                  <div className="h-12 w-12 bg-purple-600 rounded-lg mb-4 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">GitHub Repository</h3>
                  <p className="text-gray-300 mb-4">Access the source code, contribute, and report issues.</p>
                  <a href="#" className="text-blue-400 hover:text-blue-300 flex items-center">
                    View Repository
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>




        



            </div>
          </section>
          <div className="mt-20  bg-white my-12 ">
  <h3 className="text-3xl font-bold mb-10 text-center text-gray-800">Frequently Asked Questions</h3>
  <div className="max-w-3xl mx-auto space-y-6" id="faq-container">
    
    <div className="border border-gray-200 rounded-xl shadow-md transition hover:shadow-lg">
      <button className="w-full text-left px-6 py-5 focus:outline-none">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-800">How does ThreatHawk ensure accurate scanning?</span>
          <svg className="w-6 h-6 text-gray-600 transform transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      <div className="px-6 pb-5 text-gray-600">
        <p>ThreatHawk uses industry-standard tools like OWASP ZAP and maintains up-to-date vulnerability databases to ensure accurate and reliable scanning results.</p>
      </div>
    </div>

    <div className="border border-gray-200 rounded-xl shadow-md transition hover:shadow-lg">
      <button className="w-full text-left px-6 py-5 focus:outline-none">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-800">Is my website data secure during scanning?</span>
          <svg className="w-6 h-6 text-gray-600 transform transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      <div className="px-6 pb-5 text-gray-600">
        <p>Yes, ThreatHawk operates with strict security protocols and does not store any sensitive data from your scans. All scanning is performed securely and ethically.</p>
      </div>
    </div>

  </div>
</div>


          <footer id="footer" className="bg-neutral-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold mb-4">ThreatHawk</h3>
                  <p className="text-gray-400">Open-source vulnerability detection system for modern web applications.</p>
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-400 hover:text-white">
                      <span className="sr-only">GitHub</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white">
                      <span className="sr-only">Twitter</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="#features" className="text-gray-400 hover:text-white">
                        Features
                      </a>
                    </li>
                    <li>
                      <a href="#scanner" className="text-gray-400 hover:text-white">
                        Scanner
                      </a>
                    </li>
                    <li>
                      <a href="#documentation" className="text-gray-400 hover:text-white">
                        Documentation
                      </a>
                    </li>
                    <li>
                      <a href="#testimonials" className="text-gray-400 hover:text-white">
                        Testimonials
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Resources</h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="#" className="text-gray-400 hover:text-white">
                        Blog
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-400 hover:text-white">
                        API Documentation
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-400 hover:text-white">
                        Community
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-400 hover:text-white">
                        GitHub Repository
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
                  <p className="text-gray-400 mb-4">Subscribe to our newsletter for security updates and news.</p>
                  <form className="space-y-2">
                    <div className="flex">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="px-4 py-2 bg-neutral-800 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-r-lg transition-colors"
                      >
                        Subscribe
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              <div className="border-t border-neutral-800 mt-12 pt-8">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                  <div className="text-gray-400 text-sm">© 2024 ThreatHawk. All rights reserved.</div>
                  <div className="flex space-x-6">
                    <a href="#" className="text-gray-400 hover:text-white text-sm">
                      Privacy Policy
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white text-sm">
                      Terms of Service
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white text-sm">
                      Contact Us
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}