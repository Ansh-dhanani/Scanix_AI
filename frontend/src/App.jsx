import { useState, useRef } from "react";
import {
  Upload,
  Brain,
  Sparkles,
  Code,
  Zap,
  CheckCircle,
  Shield,
  Activity,
  Users,
  Mail,
  Github,
  AlertCircle,
  ArrowLeft,
  Send,
  User,
  MessageSquare,
} from "lucide-react";
import emailjs from 'emailjs-com';
import { emailjsConfig } from './config/emailjs';
import LightRays from "./blocks/Backgrounds/LightRays/LightRays";

// --- Glassmorphism Wrapper Component ---
const GlassWrapper = ({
  children,
  className = "",
  blur = "md",
  variant = "primary",
}) => {
  const blurClasses = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
    xl: "backdrop-blur-xl",
  };
  const variants = {
    primary: "rounded-2xl",
    secondary: "rounded-full",
  };
  return (
    <div
      className={`${blurClasses[blur]} bg-white/5 border border-white/10 shadow-2xl ${variants[variant]} ${className}`}
    >
      {children}
    </div>
  );
};

// --- Enhanced Button Component ---
const Button = ({
  children,
  className = "",
  disabled = false,
  variant = "primary",
  ...props
}) => {
  const variants = {
    primary: "bg-blue-100 hover:bg-blue-200 text-blue-800 border border-blue-300 shadow-md",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 shadow-md",
    danger: "bg-red-100 hover:bg-red-200 text-red-800 border border-red-300 shadow-md",
  };

  return (
    <button
      className={`px-6 py-3 rounded-full font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-102 ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// --- Enhanced Progress Component ---
const Progress = ({ value = 0, className = "", label }) => (
  <div className={`space-y-2 ${className}`}>
    <div className="flex justify-between text-sm text-gray-300">
      <span>{label}</span>
      <span>{value.toFixed(1)}%</span>
    </div>
    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
      <div
        className="h-2 rounded-full bg-white transition-all duration-700 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  </div>
);

// --- Enhanced Image Upload Component ---
function ImageUpload({
  onImageSelect,
  acceptedTypes = ["image/jpeg", "image/png"],
  maxSize = 5 * 1024 * 1024,
}) {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (!file) return;
    setError(null);

    if (!acceptedTypes.includes(file.type)) {
      setError("File type not supported. Please use JPEG or PNG.");
      return;
    }
    if (file.size > maxSize) {
      setError(`File too large. Max ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    if (onImageSelect) onImageSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files?.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const clearImage = () => {
    setPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
    if (onImageSelect) onImageSelect(null);
  };

  return (
    <GlassWrapper className="p-6 w-full max-w-md mx-auto">
      <div
        className={`border-2 border-dashed rounded-xl p-6 transition-all duration-300 ${
          isDragging ? "border-blue-400 bg-blue-500/10" : "border-white/20"
        }`}
      >
        {!preview ? (
          <div
            className="text-center cursor-pointer group"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept={acceptedTypes.join(",")}
              onChange={(e) => handleFileSelect(e.target.files?.[0])}
            />
            <div className="text-gray-300 group-hover:text-white transition-colors">
              <Upload className="mx-auto h-12 w-12 mb-4 text-blue-400 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium">
                Drag & drop a brain scan or click to browse
              </p>
              <p className="text-xs mt-2 text-gray-400">
                Supports JPEG, PNG • Max {maxSize / (1024 * 1024)}MB
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="relative">
              <img
                src={preview}
                alt="Brain scan preview"
                className="w-full max-h-64 object-cover rounded-lg border border-white/20"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
            </div>
            <Button variant="danger" onClick={clearImage} className="text-sm">
              Remove Image
            </Button>
          </div>
        )}
        {error && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}
      </div>
    </GlassWrapper>
  );
}

// --- Contact Page Component ---
const ContactPage = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send email using EmailJS with configuration
      await emailjs.send(emailjsConfig.serviceID, emailjsConfig.templateID, {
        to_email: emailjsConfig.toEmail,
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        reply_to: formData.email,
        name: formData.name, // For the template
        time: new Date().toLocaleString() // Current timestamp
      }, emailjsConfig.userID);

      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error('Email sending failed:', error);
      setIsSubmitting(false);
      // You might want to show an error message to the user
      alert('Failed to send message. Please try again later.');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <div className="flex items-center space-x-4">
        <Button
          variant="secondary"
          onClick={onBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Button>
      </div>

      {/* Header */}
      <GlassWrapper className="p-6 text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">
          Contact Us
        </h1>
        <p className="text-gray-300">
          Have questions or feedback? We'd love to hear from you.
        </p>
      </GlassWrapper>

      {/* Contact Form */}
      <GlassWrapper className="p-6">
        {submitted ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Message Sent!
            </h2>
            <p className="text-gray-300">
              Thank you for reaching out. We'll get back to you soon.
            </p>
            <Button
              variant="secondary"
              onClick={() => setSubmitted(false)}
              className="mt-4"
            >
              Send Another Message
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Form fields go here */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <User className="h-4 w-4 inline mr-2" />
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                placeholder="What's this about?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <MessageSquare className="h-4 w-4 inline mr-2" />
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors resize-none"
                placeholder="Tell us more about your inquiry..."
              />
            </div>

            <div className="flex justify-center pt-2">
              <Button
                type="submit"
                variant="secondary"
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                    <Send className="h-4 w-4" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Send Message</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </GlassWrapper>

      {/* Contact Info */}
      <GlassWrapper className="p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
          <Mail className="h-5 w-5" />
          <span>Other Ways to Reach Us</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-blue-400">Backend Development</h3>
            <div className="flex items-center space-x-2 text-gray-300">
              <Mail className="h-4 w-4" />
              <a href="mailto:manan@gmail.com" className="text-sm hover:text-blue-400 transition-colors">
                manan@gmail.com
              </a>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-purple-400">
              Frontend Development
            </h3>
            <div className="flex items-center space-x-2 text-gray-300">
              <Mail className="h-4 w-4" />
              <a href="mailto:dhananiansh01@gmail.com" className="text-sm hover:text-purple-400 transition-colors">
                dhananiansh01@gmail.com
              </a>
            </div>
          </div>
        </div>
      </GlassWrapper>
    </div>
  );
};

// --- About Page Component ---
const AboutPage = ({ onBack }) => (
  <div className="w-full max-w-4xl mx-auto space-y-6">
    {/* Back Button */}
    <div className="flex items-center space-x-4">
      <Button
        variant="secondary"
        onClick={onBack}
        className="flex items-center space-x-2"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Home</span>
      </Button>
    </div>

    {/* Header */}
    <GlassWrapper className="p-6 text-center">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">
        About Scanix AI
      </h1>
      <p className="text-gray-300">
        Built by developers, for medical professionals. Learn about our mission
        and technology.
      </p>
    </GlassWrapper>

    {/* Mission */}
    <GlassWrapper className="p-6">
      <h2 className="text-xl font-semibold text-white mb-3 flex items-center space-x-2">
        <Brain className="h-5 w-5" />
        <span>Our Mission</span>
      </h2>
      <p className="text-gray-300 leading-relaxed">
        Scanix AI democratizes medical imaging analysis through cutting-edge
        artificial intelligence, providing healthcare professionals with fast,
        accurate tools for brain tumor detection.
      </p>
    </GlassWrapper>

    {/* Technology */}
    <GlassWrapper className="p-6">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
        <Code className="h-5 w-5" />
        <span>Technology Stack</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-blue-400 mb-2">Frontend</h3>
          <ul className="space-y-1 text-gray-300 text-sm">
            <li>• React 19 with modern hooks</li>
            <li>• Tailwind CSS for styling</li>
            <li>• Responsive design</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-purple-400 mb-2">
            Backend
          </h3>
          <ul className="space-y-1 text-gray-300 text-sm">
            <li>• Flask API with Python</li>
            <li>• Scikit-learn for ML</li>
            <li>• RESTful architecture</li>
          </ul>
        </div>
      </div>
    </GlassWrapper>

    {/* Development Team */}
    <GlassWrapper className="p-6">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
        <Users className="h-5 w-5" />
        <span>Development Team</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Backend Developer */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="text-center">
            <div className="w-20 h-20 overflow-hidden bg-gradient-to-r rounded-full flex items-center justify-center mx-auto mb-3">
              <img className=" text-white" src="https://avatars.githubusercontent.com/u/187887332?v=4"/>
            </div>
            <h3 className="text-lg font-semibold text-white">Manan Panchal</h3>
            <p className="text-blue-400 font-medium mb-2">Backend Developer</p>
            <div className="flex items-center justify-center space-x-2 text-gray-400">
              <Github className="h-4 w-4" />
              <a href="https://github.com/mananjp" target="_blank"  className="text-sm">github.com/mananjp</a>
            </div>
          </div>
        </div>

        {/* Frontend Developer */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r overflow-hidden rounded-full flex items-center justify-center mx-auto mb-3">
              <img className=" text-white" src="https://avatars.githubusercontent.com/u/189432138?v=4"/>
            </div>
            <h3 className="text-lg font-semibold text-white">Ansh Dhanani</h3>
            <p className="text-purple-400 font-medium mb-2">
              Frontend Developer
            </p>
            <div className="flex items-center justify-center space-x-2 text-gray-400">
              <Github className="h-4 w-4" />
              <a href="https://github.com/ansh-dhanani" target="_blank"  className="text-sm">github.com/ansh-dhanani</a>
            </div>
          </div>
        </div>
      </div>
    </GlassWrapper>

    {/* Disclaimer */}
    <GlassWrapper className="p-4 border-amber-500/30">

          <p className="text-amber-200 text-sm">
            This tool is for educational purposes only. Always consult qualified
            healthcare professionals for medical decisions.
          </p>


    </GlassWrapper>
  </div>
);

// --- API Hook ---
function useTumorApi() {
  return {
    predictTumor: async (file) => {
      const formData = new FormData();
      formData.append("image", file);
      
      // Add metadata about the file
      formData.append("filename", file.name);
      formData.append("filetype", file.type);
      formData.append("filesize", file.size);
      formData.append("upload_time", new Date().toISOString());

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      try {
        console.log(`Making API request to: ${apiUrl}/predict`);
        console.log(`File info: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);

        const response = await fetch(`${apiUrl}/predict`, {
          method: "POST",
          body: formData,
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`API Error ${response.status}:`, errorText);
          
          let errorMessage = `Server error: ${response.status}`;
          if (response.status === 413) {
            errorMessage = "File too large. Please upload a smaller image.";
          } else if (response.status === 415) {
            errorMessage = "Unsupported file format. Please use JPEG or PNG.";
          } else if (response.status === 500) {
            errorMessage = "Internal server error. Please try again later.";
          } else if (response.status === 404) {
            errorMessage = "Prediction endpoint not found. Please check the API URL.";
          }
          
          throw new Error(errorMessage);
        }

        const result = await response.json();
        
        // Validate response structure
        if (!result || typeof result !== 'object') {
          throw new Error("Invalid response format from server");
        }
        
        // Add additional metadata to the result
        result.metadata = {
          processing_time: new Date().toISOString(),
          api_version: result.version || '1.0.0',
          request_id: result.request_id || Math.random().toString(36).substr(2, 9)
        };
        
        console.log("API response received:", result);
        return result;
      } catch (error) {
        console.error("API call failed:", error);
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          throw new Error("Failed to connect to the prediction service. Please check if the backend server is running and the API URL is correct.");
        }
        
        throw error;
      }
    },
  };
}

// --- Main App ---
function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const api = useTumorApi();

  const handlePredict = async () => {
    if (!selectedFile) {
      setPrediction({ error: "Please select an image first" });
      return;
    }

    setLoading(true);
    setPrediction(null);
    try {
      const result = await api.predictTumor(selectedFile);
      setPrediction(result);
    } catch (err) {
      setPrediction({ error: err.message || "Failed to analyze image." });
    } finally {
      setLoading(false);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case "about":
        return <AboutPage onBack={() => setCurrentPage("home")} />;
      case "contact":
        return <ContactPage onBack={() => setCurrentPage("home")} />;
      case "home":
      default:
        return (
          <>
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="p-6">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="relative">
                    <Brain className="h-14 w-14 text-blue-400" />
                    <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-purple-400 animate-spin" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  AI-Powered Brain Scanning
                </h1>
                <p className="text-gray-300 text-base">
                  Advanced neural networks for precise tumor detection
                </p>
              </div>
            </div>

            {/* Upload Section */}
            <ImageUpload
              onImageSelect={(f) => {
                setSelectedFile(f);
                setPrediction(null);
              }}
            />

            {/* Predict Button */}
            <div className="flex justify-center">
              <Button
                variant="secondary"
                className="text-lg py-4 px-8 min-w-64"
                onClick={handlePredict}
                disabled={!selectedFile || loading}
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-400 border-t-gray-800"></div>
                    Analyzing Brain Scan...
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Brain className="h-6 w-6" />
                    Analyze Brain Scan
                  </div>
                )}
              </Button>
            </div>

            {/* Results */}
            {prediction && (
              <GlassWrapper
                className={`p-6 ${
                  prediction.error ? "border-red-500/30" : "border-green-500/30"
                }`}
              >
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {prediction.error ? "Analysis Failed" : "Analysis Complete"}
                  </h3>
                </div>

                {prediction.error ? (
                  <div className="text-center p-4 bg-red-500/20 rounded-xl border border-red-500/30">
                    <p className="text-red-300">{prediction.error}</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center p-4 bg-blue-100/80 rounded-xl border border-blue-300/50">
                      <p className="text-2xl font-bold text-blue-900 mb-1">
                        {prediction.prediction}
                      </p>
                      <p className="text-blue-700 text-sm">
                        Confidence: {(prediction.confidence * 100).toFixed(1)}%
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-base font-semibold text-white mb-2">
                        Detailed Analysis:
                      </h4>
                      {Object.entries(prediction.probabilities).map(
                        ([label, prob]) => (
                          <Progress
                            key={label}
                            label={label}
                            value={prob * 100}
                          />
                        )
                      )}
                    </div>

                    <div className="flex justify-center pt-2">
                      <Button
                        variant="secondary"
                        onClick={() => setPrediction(null)}
                        className="text-sm"
                      >
                        Run Another Analysis
                      </Button>
                    </div>
                  </div>
                )}
              </GlassWrapper>
            )}

            {/* Disclaimer */}
            <div className="pt-4">
              <div className="text-center text-gray-400 text-sm">
                <p>
                  For research purposes only. Always consult medical
                  professionals for diagnosis.
                </p>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Light Ray Background */}
      <div className="absolute z-[0] w-full h-full">
        <LightRays
          raysOrigin="top-center"
          raysColor="#00ffff"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
          className="fixed inset-0 pointer-events-none z-0"
        />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6">
        {/* Navigation */}
        <GlassWrapper variant="secondary" className="p-3 px-9 mb-6">
          <nav className="flex items-center justify-between">
            <button
              onClick={() => setCurrentPage("home")}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <Brain className="h-6 w-6 text-blue-400" />
              <span className="text-lg text-white">Scanix AI</span>
            </button>
            <div className="flex items-center text-white gap-10 pr-4">
              <button
                onClick={() => setCurrentPage("about")}
                className="text-sm hover:text-blue-400 transition-colors cursor-pointer"
              >
                About
              </button>
              <button
                onClick={() => setCurrentPage("contact")}
                className="text-sm hover:text-blue-400 transition-colors cursor-pointer"
              >
                Contact
              </button>
            </div>
          </nav>
        </GlassWrapper>

        <div className="space-y-6">{renderPage()}</div>
      </div>
    </div>
  );
}

export default App;
