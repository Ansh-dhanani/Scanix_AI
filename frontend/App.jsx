import { useState, useRef } from "react";
import { Upload, Brain } from "lucide-react";

// --- Simple Components ---
const Button = ({ children, className = "", disabled = false, ...props }) => (
  <button
    className={`px-4 py-2 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
);

const Progress = ({ value = 0, className = "" }) => (
  <div className={`w-full bg-gray-200 rounded-full h-3 ${className}`}>
    <div
      className="h-3 rounded-full bg-blue-600 transition-all"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
);

// --- Image Upload Component ---
function ImageUpload({ onImageSelect, acceptedTypes = ["image/jpeg", "image/png"], maxSize = 5 * 1024 * 1024 }) {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
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
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
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
    <div className="w-full max-w-md mx-auto">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        {!preview ? (
          <div
            className="text-center cursor-pointer"
            onDragOver={handleDragOver}
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
            <div className="text-gray-500">
              <Upload className="mx-auto h-12 w-12 mb-4 text-gray-400" />
              <p className="text-sm">Drag & drop an image or click to browse</p>
              <p className="text-xs mt-1">Max size: {maxSize / (1024 * 1024)}MB</p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-64 object-cover rounded mb-4"
            />
            <button
              onClick={clearImage}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        )}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
}

// --- API Hook ---
function useTumorApi() {
  return {
    predictTumor: async (file) => {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to fetch prediction");
      return await response.json();
    },
  };
}

// --- Main App ---
function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
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

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto space-y-8 px-4">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <Brain className="h-10 w-10 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Scanix AI</h1>
          </div>
          <p className="text-gray-600">AI-powered brain tumor detection</p>
        </div>

        {/* Upload */}
        <ImageUpload
          onImageSelect={(f) => {
            setSelectedFile(f);
            setPrediction(null);
          }}
        />

        {/* Predict Button */}
        <Button
          className="w-full text-lg py-4 bg-blue-600 text-white hover:bg-blue-700"
          onClick={handlePredict}
          disabled={!selectedFile || loading}
        >
          {loading ? "Analyzing..." : "🔍 Analyze Brain Scan"}
        </Button>

        {/* Results */}
        {prediction && (
          <div className={`p-6 rounded-lg ${prediction.error ? "bg-red-50 border border-red-200" : "bg-green-50 border border-green-200"}`}>
            <h3 className="text-lg font-semibold mb-4">
              {prediction.error ? "❌ Analysis Failed" : "✅ Analysis Complete"}
            </h3>
            
            {prediction.error ? (
              <p className="text-red-700">{prediction.error}</p>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-xl font-semibold text-gray-900">{prediction.prediction}</p>
                  <p className="text-sm text-gray-600">
                    Confidence: {(prediction.confidence * 100).toFixed(1)}%
                  </p>
                </div>
                
                <div className="space-y-3">
                  {Object.entries(prediction.probabilities).map(([label, prob]) => (
                    <div key={label}>
                      <div className="flex justify-between text-sm text-gray-700 mb-1">
                        <span>{label}</span>
                        <span>{(prob * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={prob * 100} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;