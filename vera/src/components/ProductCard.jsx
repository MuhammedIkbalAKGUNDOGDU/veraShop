import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductCard({
  id,
  image1,
  image2,
  category,
  title,
  price,
}) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/product/${id}`)}
      className="relative w-full max-w-sm h-full flex flex-col cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image Container */}
      <div className="relative w-full aspect-square overflow-hidden rounded shadow-lg">
        {/* Image 1 */}
        <img
          src={image1}
          alt={title}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ease-in-out ${
            hovered ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Image 2 */}
        <img
          src={image2}
          alt={title}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity  duration-[1200ms] ease-in-out ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Quick View Overlay */}
        <div
          className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-500 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="text-white text-sm font-semibold tracking-wide">
            HIZLI GÖRÜNÜM
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="mt-3 text-center flex flex-col justify-between flex-grow">
        <p className="text-xs text-gray-500 tracking-wide uppercase">
          {category}
        </p>
        <h3 className="text-base text-gray-500 font-medium mt-1">{title}</h3>
        <p className="text-md font-bold mt-1">₺{price}</p>
      </div>
    </div>
  );
}
