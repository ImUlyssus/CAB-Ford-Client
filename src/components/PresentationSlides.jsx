import { useState } from "react";

const slides = [
  {
    title: "Slide 1",
    content: "This is the first slide with a custom UI.",
    buttonText: "Learn More",
  },
  {
    title: "Slide 2",
    content: "Here’s another slide with different content.",
    buttonText: "Explore",
  },
  {
    title: "Slide 3",
    content: "You can customize each slide as needed!",
    buttonText: "Get Started",
  },
];

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="relative w-250 mx-auto">
  {/* Carousel Wrapper with 16:9 Aspect Ratio */}
  <div className="relative w-full h-0 pb-[56.25%] overflow-hidden bg-gray-100 rounded-lg shadow-lg">
    {slides.map((slide, index) => (
      <div
        key={index}
        className={`absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white p-6 transition-opacity duration-700 ease-in-out ${
          index === currentIndex ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Slide UI */}
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-gray-800">{slide.title}</h2>
          <p className="mt-2 text-lg text-gray-600">{slide.content}</p>
          <button className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
            {slide.buttonText}
          </button>
        </div>
      </div>
    ))}
  </div>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-4 h-4 rounded-full bg-gray-400 transition-all ${
              currentIndex === index ? "bg-blue-600 scale-110" : "opacity-50"
            }`}
          />
        ))}
      </div>

      {/* Controls */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/30 p-3 rounded-full text-white hover:bg-black/50 transition"
      >
        ❮
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/30 p-3 rounded-full text-white hover:bg-black/50 transition"
      >
        ❯
      </button>
    </div>
  );
}
