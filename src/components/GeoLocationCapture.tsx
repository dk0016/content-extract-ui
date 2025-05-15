import React, { useRef, useState } from "react";

interface Location {
  latitude: number;
  longitude: number;
}

const GeoLocationCapture: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [message, setMessage] = useState<string>("");

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setMessage("🎥 Camera started.");
    } catch (err: any) {
      setMessage("Camera error: " + err.message);
    }
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setImageBlob(blob);
          setImagePreview(url);
          setMessage("📸 Image captured.");

          // ✅ Stop the camera after capture
          const stream = video.srcObject as MediaStream;
          stream.getTracks().forEach((track) => track.stop());
          video.srcObject = null;

          getLocation();
        }
      },
      "image/jpeg",
      0.95
    );
  };

  const getLocation = async () => {
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        })
      );
      setLocation({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
      setMessage("📍 Location fetched.");
    } catch (err: any) {
      setMessage("Location error: " + err.message);
    }
  };

  const downloadImage = () => {
    if (!imageBlob || !location) {
      setMessage("Please capture image and fetch location first.");
      return;
    }

    const a = document.createElement("a");
    const url = URL.createObjectURL(imageBlob);
    a.href = url;
    a.download = `photo_${location.latitude}_${location.longitude}.jpg`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage("✅ Image downloaded.");
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">📷 Capture Image with Location</h2>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="border w-full max-w-md"
      />

      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div className="space-x-2">
        <button
          onClick={startCamera}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          🎥 Start Camera
        </button>
        <button
          onClick={captureImage}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          📸 Capture
        </button>
        <button
          onClick={downloadImage}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          ⬇️ Download Image
        </button>
      </div>

      {imagePreview && (
        <div>
          <p className="text-sm text-gray-600">Preview:</p>
          <img
            src={imagePreview}
            alt="Captured"
            className="max-w-sm border mt-2"
          />
        </div>
      )}

      {location && (
        <div className="mt-4">
          <p>
            <strong>Latitude:</strong> {location.latitude}
          </p>
          <p>
            <strong>Longitude:</strong> {location.longitude}
          </p>
          <a
            href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View in Google Maps
          </a>
        </div>
      )}

      {message && <p className="text-red-600 mt-2">{message}</p>}
    </div>
  );
};

export default GeoLocationCapture;
