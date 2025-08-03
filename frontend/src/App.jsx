import { useState } from 'react'
import { Brain, Upload, Activity, AlertCircle, CheckCircle, Info, Github, Mail, Code, Zap, Shield, Users } from 'lucide-react'

function App() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState('home')

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsDataURL(file)
      setResult(null)
    }
  }

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  const checkAPI = async () => {
    try {
      const response = await fetch(`${API_URL}/health`)
      return response.ok
    } catch {
      return false
    }
  }

  const handlePredict = async () => {
    if (!selectedFile) return

    const apiRunning = await checkAPI()
    if (!apiRunning) {
      setResult({ 
        error: import.meta.env.PROD 
          ? 'API service is currently unavailable. Please try again later.' 
          : 'API not running. Start Flask server: py api.py' 
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: preview })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ 
        error: import.meta.env.PROD 
          ? 'Analysis failed. Please check your image and try again.' 
          : `Failed to connect to API: ${error.message}` 
      })
    }
    setLoading(false)
  }

  const HomePage = () => (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Scanix AI
          </h1>
        </div>
        <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto px-4">
          AI-powered brain tumor detection with 98% accuracy using machine learning
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 shadow-2xl">
        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-center text-white flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2">
            <Upload className="h-6 w-6" />
            <span>Upload Medical Scan</span>
          </h2>
          
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-2xl hover:border-white/40 transition-all cursor-pointer group"
            >
              <Upload className="h-8 w-8 text-gray-400 group-hover:text-white mb-2" />
              <span className="text-gray-400 group-hover:text-white text-center px-2">
                Click to upload or drag and drop
              </span>
              <span className="text-sm text-gray-500 mt-1 text-center">
                PNG, JPG, JPEG up to 10MB
              </span>
            </label>
          </div>

          {preview && (
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-2xl border border-white/20">
                <img
                  src={preview}
                  alt="Medical scan preview"
                  className="w-full h-80 object-contain bg-black/20"
                />
              </div>
              
              <button
                onClick={handlePredict}
                disabled={loading}
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl font-semibold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Activity className="h-5 w-5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Brain className="h-5 w-5" />
                    <span>Analyze Scan</span>
                  </>
                )}
              </button>
            </div>
          )}

          {result && (
            <div className="mt-6">
              <div
                className={`p-6 rounded-2xl border ${
                  result.error
                    ? 'bg-red-500/10 border-red-500/30 text-red-300'
                    : result.has_tumor
                    ? 'bg-red-500/10 border-red-500/30 text-red-300'
                    : 'bg-green-500/10 border-green-500/30 text-green-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {result.error ? (
                    <AlertCircle className="h-6 w-6 flex-shrink-0" />
                  ) : result.has_tumor ? (
                    <AlertCircle className="h-6 w-6 flex-shrink-0" />
                  ) : (
                    <CheckCircle className="h-6 w-6 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    {result.error ? (
                      <p className="font-medium">{result.error}</p>
                    ) : (
                      <div>
                        <h3 className="text-xl font-bold mb-1">{result.prediction}</h3>
                        <p className="text-sm opacity-90">
                          Confidence: {(result.confidence * 100).toFixed(1)}%
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Test Images */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 shadow-2xl">
        <h3 className="text-xl font-semibold text-white mb-4 text-center">Try Sample Images</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="text-center">
            <img 
              src="/test_file1.png" 
              alt="Test Brain Scan 1" 
              className="w-full h-32 object-cover rounded-lg border border-white/20 cursor-pointer hover:border-white/40 transition-all"
              onClick={() => {
                fetch('/test_file1.png')
                  .then(res => res.blob())
                  .then(blob => {
                    const file = new File([blob], 'test_file1.png', { type: 'image/png' })
                    setSelectedFile(file)
                    const reader = new FileReader()
                    reader.onload = (e) => setPreview(e.target.result)
                    reader.readAsDataURL(file)
                    setResult(null)
                  })
              }}
            />
            <p className="text-gray-400 text-sm mt-2">Sample Scan 1</p>
          </div>
          <div className="text-center">
            <img 
              src="/test_file2.png" 
              alt="Test Brain Scan 2" 
              className="w-full h-32 object-cover rounded-lg border border-white/20 cursor-pointer hover:border-white/40 transition-all"
              onClick={() => {
                fetch('/test_file2.png')
                  .then(res => res.blob())
                  .then(blob => {
                    const file = new File([blob], 'test_file2.png', { type: 'image/png' })
                    setSelectedFile(file)
                    const reader = new FileReader()
                    reader.onload = (e) => setPreview(e.target.result)
                    reader.readAsDataURL(file)
                    setResult(null)
                  })
              }}
            />
            <p className="text-gray-400 text-sm mt-2">Sample Scan 2</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Zap className="h-6 w-6 text-blue-400" />
          </div>
          <h3 className="font-semibold text-white mb-2">Fast Analysis</h3>
          <p className="text-gray-400 text-sm">Get results in seconds with our optimized AI model</p>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Shield className="h-6 w-6 text-purple-400" />
          </div>
          <h3 className="font-semibold text-white mb-2">Secure & Private</h3>
          <p className="text-gray-400 text-sm">Secure cloud processing with no data storage</p>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Brain className="h-6 w-6 text-green-400" />
          </div>
          <h3 className="font-semibold text-white mb-2">AI-Powered</h3>
          <p className="text-gray-400 text-sm">Machine learning with 98% accuracy</p>
        </div>
      </div>
    </div>
  )

  const AboutPage = () => (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 px-4">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          About Scanix AI
        </h1>
        <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
          Built by developers, for medical professionals. Learn about our mission and the technology behind our AI-powered brain tumor detection system.
        </p>
      </div>

      {/* Mission */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 shadow-2xl">
        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center space-x-2">
          <Brain className="h-6 w-6" />
          <span>Our Mission</span>
        </h2>
        <p className="text-gray-300 leading-relaxed">
          Scanix AI is dedicated to democratizing medical imaging analysis through cutting-edge artificial intelligence. 
          Our goal is to provide healthcare professionals with fast, accurate, and accessible tools for brain tumor detection, 
          ultimately improving patient outcomes and reducing diagnosis time.
        </p>
      </div>

      {/* Technology */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 shadow-2xl">
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center space-x-2">
          <Code className="h-6 w-6" />
          <span>Technology Stack</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-blue-400 mb-3">Frontend</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• React 19 with modern hooks</li>
              <li>• Tailwind CSS for styling</li>
              <li>• Lucide React for icons</li>
              <li>• Responsive design principles</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-purple-400 mb-3">Backend</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Flask API with Python</li>
              <li>• Scikit-learn for ML</li>
              <li>• Pillow for image processing</li>
              <li>• RESTful API architecture</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 shadow-2xl">
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center space-x-2">
          <Zap className="h-6 w-6" />
          <span>Key Features</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Brain className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">AI-Powered Detection</h3>
                <p className="text-gray-400 text-sm">Machine learning model trained on thousands of medical images</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCircle className="h-4 w-4 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">High Accuracy</h3>
                <p className="text-gray-400 text-sm">Confidence scores and detailed analysis results</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Shield className="h-4 w-4 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Privacy First</h3>
                <p className="text-gray-400 text-sm">Secure cloud processing with no data storage</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Zap className="h-4 w-4 text-yellow-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Fast Processing</h3>
                <p className="text-gray-400 text-sm">Get results in seconds with optimized algorithms</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Upload className="h-4 w-4 text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Easy Upload</h3>
                <p className="text-gray-400 text-sm">Drag and drop interface for medical images</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Activity className="h-4 w-4 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Real-time Analysis</h3>
                <p className="text-gray-400 text-sm">Live processing with progress indicators</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Info */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 shadow-2xl">
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center space-x-2">
          <Users className="h-6 w-6" />
          <span>Development Team</span>
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Backend Developer */}
          <div className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10">
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
              <img 
                src="https://avatars.githubusercontent.com/u/187887332?v=4" 
                alt="Manan Panchal"
                className="w-16 h-16 rounded-full border-2 border-white/20 mx-auto sm:mx-0"
              />
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg sm:text-xl font-semibold text-white">Manan Panchal</h3>
                <p className="text-blue-400 font-medium mb-2">Backend Developer</p>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  Experienced backend developer specializing in Python Flask and machine learning model development. Led multiple AI-driven projects focused on medical imaging and data analysis.
                </p>
                <div className="flex flex-col space-y-2 text-sm">
                  <div className="flex items-center justify-center sm:justify-start space-x-2 text-gray-400">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span className="break-all">mananpanchal@gmail.com</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start space-x-2 text-gray-400">
                    <Github className="h-4 w-4 flex-shrink-0" />
                    <a href="https://github.com/mananjp" className="hover:text-white transition-colors break-all">
                      github.com/mananjp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Frontend Developer */}
          <div className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10">
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
              <img 
                src="https://avatars.githubusercontent.com/u/189432138?v=4" 
                alt="Ansh Dhanani"
                className="w-16 h-16 rounded-full border-2 border-white/20 mx-auto sm:mx-0"
              />
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg sm:text-xl font-semibold text-white">Ansh Dhanani</h3>
                <p className="text-purple-400 font-medium mb-2">Frontend Developer</p>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  Frontend developer with expertise in React.js, Tailwind CSS, and UI/UX design. Passionate about creating intuitive and responsive web applications with modern JavaScript frameworks.
                </p>
                <div className="flex flex-col space-y-2 text-sm">
                  <div className="flex items-center justify-center sm:justify-start space-x-2 text-gray-400">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span className="break-all">dhananiansh01@gmail.com</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start space-x-2 text-gray-400">
                    <Github className="h-4 w-4 flex-shrink-0" />
                    <a href="https://github.com/Ansh-dhanani" className="hover:text-white transition-colors break-all">
                      github.com/Ansh-dhanani
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 shadow-2xl">
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center space-x-2">
          <Mail className="h-6 w-6" />
          <span>Get in Touch</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-white mb-3">For Developers</h3>
            <p className="text-gray-300 mb-4">
              Interested in contributing or learning more about our technology? We welcome collaboration and feedback from the developer community.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-blue-400">
                <Github className="h-5 w-5" />
                <a href="https://github.com/mananjp" className="hover:text-white transition-colors">
                  Backend - github.com/mananjp
                </a>
              </div>
              <div className="flex items-center space-x-2 text-purple-400">
                <Github className="h-5 w-5" />
                <a href="https://github.com/Ansh-dhanani" className="hover:text-white transition-colors">
                  Frontend - github.com/Ansh-dhanani
                </a>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-3">For Healthcare Professionals</h3>
            <p className="text-gray-300 mb-4">
              Looking to integrate our technology into your practice? Contact us to discuss implementation and training opportunities.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-blue-400">
                <Mail className="h-5 w-5" />
                <a href="mailto:mananpanchal@gmail.com" className="hover:text-white transition-colors">
                  mananpanchal@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-2 text-purple-400">
                <Mail className="h-5 w-5" />
                <a href="mailto:dhananiansh01@gmail.com" className="hover:text-white transition-colors">
                  dhananiansh01@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-6 w-6 text-amber-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-amber-400 mb-2">Medical Disclaimer</h3>
            <p className="text-amber-200 text-sm">
              This tool is for educational and research purposes only. It should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals for medical decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Scanix AI</span>
          </div>
          <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-2xl p-1">
            <button
              onClick={() => setCurrentPage('home')}
              className={`px-4 sm:px-6 py-2 rounded-xl font-medium transition-all ${
                currentPage === 'home'
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentPage('about')}
              className={`px-4 sm:px-6 py-2 rounded-xl font-medium transition-all flex items-center space-x-2 ${
                currentPage === 'about'
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Info className="h-4 w-4" />
              <span>About</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 px-6 pb-12">
        {currentPage === 'home' ? <HomePage /> : <AboutPage />}
      </main>
    </div>
  )
}

export default App