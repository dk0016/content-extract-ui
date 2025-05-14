import React, { useState, useEffect, ChangeEvent } from "react";
import EXIF from "exif-js";

type Location = {
  latitude: number;
  longitude: number;
};

export default function GeoLocationTest() {
  const [file, setFile] = useState<File | null>(null);
  const [locationFromPhoto, setLocationFromPhoto] = useState<Location | null>(
    null
  );
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Ask for browser location permission on load
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationPermission(true);
          setError(null);
        },
        (err) => {
          setLocationPermission(false);
          setError("Please enable location access in your browser to proceed.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setLocationFromPhoto(null);
    setError(null);
    extractGeoFromPhoto(selectedFile);
  };

  const convertDMSToDD = (dms: any[], ref: string) => {
    const [degrees, minutes, seconds] = dms.map((val) =>
      typeof val === "object" && val.numerator && val.denominator
        ? val.numerator / val.denominator
        : val
    );

    let dd = degrees + minutes / 60 + seconds / 3600;
    if (ref === "S" || ref === "W") {
      dd = -dd;
    }
    return dd;
  };

  const extractGeoFromPhoto = (file: File) => {
    const reader = new FileReader();

    reader.onload = function (event: ProgressEvent<FileReader>) {
      const result = event.target?.result;
      if (!result || typeof result !== "string") return;

      const image: any = new Image();
      image.src = result;

      image.onload = function () {
        EXIF.getData(image, function (this: any) {
          const gpsLatitude = EXIF.getTag(this, "GPSLatitude");
          const gpsLatitudeRef = EXIF.getTag(this, "GPSLatitudeRef");
          const gpsLongitude = EXIF.getTag(this, "GPSLongitude");
          const gpsLongitudeRef = EXIF.getTag(this, "GPSLongitudeRef");

          if (
            gpsLatitude &&
            gpsLatitudeRef &&
            gpsLongitude &&
            gpsLongitudeRef
          ) {
            const latitude = convertDMSToDD(gpsLatitude, gpsLatitudeRef);
            const longitude = convertDMSToDD(gpsLongitude, gpsLongitudeRef);

            setLocationFromPhoto({ latitude, longitude });
            setError(null);
          } else {
            setError(
              "No GPS data found in the photo. Make sure your camera has location access enabled."
            );
          }
        });
      };
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-4">Upload Photo with Location</h2>

      {!locationPermission && (
        <p className="text-red-500 mb-4">
          🚫 Location access is required. Please enable location in your browser
          settings.
        </p>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={!locationPermission}
        className={`mb-2 ${
          !locationPermission ? "opacity-50 cursor-not-allowed" : ""
        }`}
      />

      {file && (
        <p className="text-sm text-gray-600">
          Selected file: <strong>{file.name}</strong>
        </p>
      )}

      {locationFromPhoto && (
        <div className="mt-4">
          <p>
            <strong>Latitude:</strong> {locationFromPhoto.latitude}
          </p>
          <p>
            <strong>Longitude:</strong> {locationFromPhoto.longitude}
          </p>
          <a
            href={`https://www.google.com/maps?q=${locationFromPhoto.latitude},${locationFromPhoto.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View in Google Maps
          </a>
        </div>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
