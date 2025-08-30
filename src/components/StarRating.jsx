import React from "react";
import { Star, StarHalf } from "lucide-react";

export default function StarRating({ rating, setRating, maxRating = 5, interactive = false }) {
  const roundedRating = Math.round(rating * 2) / 2;

  return (
    <div className="flex">
      {Array.from({ length: maxRating }, (_, idx) => {
        const starNumber = idx + 1;

        const handleClick = () => {
          if (interactive && setRating) {
            setRating(starNumber);
          }
        };

        if (starNumber <= roundedRating) {
          // Bintang penuh
          return (
            <Star
              key={idx}
              onClick={handleClick}
              className={`w-5 h-5 cursor-${interactive ? "pointer" : "default"} text-yellow-400`}
              fill="currentColor"
            />
          );
        } else if (starNumber - 0.5 === roundedRating) {
          // Bintang setengah
          return (
            <StarHalf
              key={idx}
              onClick={handleClick}
              className={`w-5 h-5 cursor-${interactive ? "pointer" : "default"} text-yellow-400`}
            />
          );
        } else {
          // Bintang kosong
          return (
            <Star
              key={idx}
              onClick={handleClick}
              className={`w-5 h-5 cursor-${interactive ? "pointer" : "default"} text-gray-300`}
            />
          );
        }
      })}
    </div>
  );
}
