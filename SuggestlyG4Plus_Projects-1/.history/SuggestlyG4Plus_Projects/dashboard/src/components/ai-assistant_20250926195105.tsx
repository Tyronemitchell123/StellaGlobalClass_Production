'use client';

import { useState, useEffect, useRef } from 'react';
 // import { useWebSocket } from '../websocket-provider'; // Assuming context from websocket-provider

interface Detection {
  type: string;
  confidence: number;
  timestamp: string;
  position: { x: number; y: number };
}

export function AIAssistant() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [videoSrc, setVideoSrc] = useState(''); // Simulated or real stream URL
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sendMessage = (_message: any) => {}; // Mock
  const addEventListener = (_type: string, _listener: EventListenerOrEventListenerObject) => {}; // Mock
  const removeEventListener = (_type: string, _listener: EventListenerOrEventListenerObject) => {}; // Mock

  useEffect(() => {
    // Simulate camera stream (in production, use WebRTC or RTSP via backend)
    setVideoSrc('https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'); // Placeholder loop video

    // WebSocket listeners for camera events
    const handleCameraDetection = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === 'camera-detection') {
        setDetections(prev => [...prev, data.detection].slice(-10)); // Keep last 10
        // Add to chat as assistant message

    addEventListener('message', handleCameraDetection);
    return () => removeEventListener('message', handleCameraDetection);
  }, [addEventListener, removeEventListener]);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawDetections = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      detections.forEach(det => {
        ctx.strokeStyle = '#FFD700'; // Gold for premium feel
        ctx.lineWidth = 3;
        ctx.strokeRect(det.position.x - 20, det.position.y - 20, 40, 40); // Bounding box
        ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
        ctx.fillText(`${det.type} (${(det.confidence * 100).toFixed(0)}%)`, det.position.x - 20, det.position.y - 50);
      });
      requestAnimationFrame(drawDetections);
    };

    video.addEventListener('play', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      drawDetections();
    });

    return () => {
      video.removeEventListener('play', drawDetections);
    };
  }, [detections]);

  const sendMessageHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate AI response via WebSocket
    sendMessage({ type: 'ai-query', query: input });
    // For demo, add delayed response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: `AI Response to: "${input}". Ultra-premium analysis complete.` }]);
    }, 1000);
  };

  const toggleCamera = () => {
    setIsCameraActive(!isCameraActive);
    if (!isCameraActive) {
      sendMessage({ type: 'camera-start' });
    } else {
      sendMessage({ type: 'camera-stop' });
      setDetections([]);
    }
  };

  return (
    <div className="ai-assistant luxury-panel" role="main" aria-label="AI Assistant Dashboard">
      {/* Chat Interface */}
      <div className="chat-container" aria-label="AI Chat">
        <div className="messages" aria-live="polite">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>
              <span>{msg.role === 'user' ? 'You' : 'Veridian AI'}: {msg.content}</span>
            </div>
          ))}
        </div>
        <form onSubmit={sendMessageHandler} className="chat-input" aria-label="Send message">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Veridian AI anything..."
            aria-label="Message input"
          />
          <button type="submit" aria-label="Send">
            <i className="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>

      {/* Camera Bot */}
      <div className="camera-bot luxury-section" aria-label="Camera Bot">
        <h3>Ultra-Premium Camera Bot <i className="fas fa-video premium-icon"></i></h3>
        <button onClick={toggleCamera} className="toggle-btn luxury-btn">
          {isCameraActive ? 'Stop Camera' : 'Start Camera Bot'}
        </button>
        {isCameraActive && (
          <div className="camera-feed">
            <video ref={videoRef} src={videoSrc} autoPlay loop muted className="video-stream" aria-label="Live camera feed">
              Your browser does not support the video tag.
            </video>
            <canvas ref={canvasRef} className="detection-overlay" aria-hidden="true"></canvas>
            <div className="detections-list luxury-alerts">
              {detections.map((det, idx) => (
                <div key={idx} className="detection-item premium-badge">
                  <i className="fas fa-exclamation-triangle"></i> {det.type} detected at {new Date(det.timestamp).toLocaleTimeString()} (Confidence: {(det.confidence * 100).toFixed(1)}%)
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .luxury-panel { background: linear-gradient(135deg, #0a0a1a, #1a1a2e); border: 1px solid #FFD700; border-radius: 12px; padding: 20px; margin: 10px; box-shadow: 0 8px 32px rgba(255, 215, 0, 0.1); transition: all 0.3s ease; }
        .luxury-panel:hover { box-shadow: 0 12px 48px rgba(255, 215, 0, 0.2); transform: translateY(-2px); }
        .chat-container { margin-bottom: 20px; }
        .messages { height: 300px; overflow-y: auto; background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 10px; }
        .message { padding: 8px; margin: 5px 0; border-radius: 6px; }
        .message.user { background: rgba(255, 215, 0, 0.2); text-align: right; }
        .message.assistant { background: rgba(26, 26, 46, 0.8); }
        .chat-input { display: flex; gap: 10px; }
        .chat-input input { flex: 1; padding: 12px; border: 1px solid #FFD700; border-radius: 6px; background: rgba(255, 255, 255, 0.1); color: white; }
        .chat-input button { padding: 12px 16px; background: #FFD700; color: #0a0a1a; border: none; border-radius: 6px; cursor: pointer; transition: background 0.3s; }
        .chat-input button:hover { background: #FFA500; }
        .camera-bot { text-align: center; }
        .luxury-section h3 { color: #FFD700; margin-bottom: 15px; font-size: 1.5em; }
        .premium-icon { color: #FFD700; margin-left: 8px; animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .toggle-btn { padding: 12px 24px; background: linear-gradient(45deg, #FFD700, #FFA500); color: #0a0a1a; border: none; border-radius: 25px; font-weight: bold; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3); }
        .toggle-btn:hover { transform: scale(1.05); box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4); }
        .camera-feed { position: relative; margin: 20px auto; max-width: 640px; }
        .video-stream { width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5); }
        .detection-overlay { position: absolute; top: 0; left: 0; pointer-events: none; border-radius: 12px; }
        .detections-list { margin-top: 15px; max-height: 150px; overflow-y: auto; }
        .detection-item { background: rgba(255, 215, 0, 0.1); border: 1px solid #FFD700; border-radius: 6px; padding: 8px; margin: 5px 0; color: white; display: flex; align-items: center; gap: 8px; animation: slideIn 0.3s ease; }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        .premium-badge { box-shadow: 0 2px 10px rgba(255, 215, 0, 0.2); }
        .luxury-alerts::-webkit-scrollbar { width: 6px; }
        .luxury-alerts::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.1); border-radius: 3px; }
        .luxury-alerts::-webkit-scrollbar-thumb { background: #FFD700; border-radius: 3px; }
      `}</style>
    </div>
  );
}
