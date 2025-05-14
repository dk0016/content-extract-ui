import React, { useState, ChangeEvent } from "react";
import EXIF from "exif-js";

type Location = {
  latitude: number;
  longitude: number;
};

export default function GeoLocationTest() {
  const [file, setFile] = useState<File | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    extractGeoFromPhoto(selectedFile);
  };

  // Converts DMS (Degrees, Minutes, Seconds) to Decimal Degrees
  const convertDMSToDD = (dms: any[], ref: string): number => {
    const [deg, min, sec] = dms.map((val) => {
      if (
        typeof val === "object" &&
        val.numerator !== undefined &&
        val.denominator !== undefined
      ) {
        return val.numerator / val.denominator;
      }
      return parseFloat(val);
    });

    let dd = deg + min / 60 + sec / 3600;
    if (ref === "S" || ref === "W") dd = -dd;
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

          console.log("EXIF Tags", {
            gpsLatitude,
            gpsLatitudeRef,
            gpsLongitude,
            gpsLongitudeRef,
          });

          if (
            gpsLatitude &&
            gpsLatitudeRef &&
            gpsLongitude &&
            gpsLongitudeRef
          ) {
            const latitude = convertDMSToDD(gpsLatitude, gpsLatitudeRef);
            const longitude = convertDMSToDD(gpsLongitude, gpsLongitudeRef);

            setLocation({ latitude, longitude });
            setError(null);
          } else {
            setLocation(null);
            setError("No GPS data found in the photo.");
          }
        });
      };
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Upload Photo with Location</h2>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {file && (
        <p className="mt-2 text-sm text-gray-600">
          Selected file: <strong>{file.name}</strong>
        </p>
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

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
