"use client";
import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
// Was `react-icons/fa`. Those components are typed as returning `ReactNode`,
// which under this project's @types/react is not assignable to `Element | null`
// — so TS rejected them as JSX components and `next build` failed outright
// (webpack compiled fine; it died in the type-check phase). lucide-react is
// already a dependency, is what every other icon on the site comes from, and
// types correctly. react-icons is now unused by any component.
import { ArrowLeft as LeftArrow, ArrowRight as RightArrow } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Testimonial {
  quote: string;
  name: string;
  designation: string;
  src: string;
}
interface Colors {
  name?: string;
  designation?: string;
  testimony?: string;
  arrowBackground?: string;
  arrowForeground?: string;
  arrowHoverBackground?: string;
}
interface FontSizes {
  name?: string;
  designation?: string;
  quote?: string;
}
interface CircularTestimonialsProps {
  testimonials: Testimonial[];
  autoplay?: boolean;
  colors?: Colors;
  fontSizes?: FontSizes;
}

function calculateGap(width: number) {
  const minWidth = 1024;
  const maxWidth = 1456;
  const minGap = 60;
  const maxGap = 86;
  if (width <= minWidth) return minGap;
  if (width >= maxWidth)
    return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth));
  return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
}

export const CircularTestimonials = ({
  testimonials,
  autoplay = true,
  colors = {},
  fontSizes = {},
}: CircularTestimonialsProps) => {
  // Color & font config - using CSS variables for motion design tokens
  const colorName = colors.name ?? "var(--foreground)";
  const colorDesignation = colors.designation ?? "var(--muted-foreground)";
  const colorTestimony = colors.testimony ?? "var(--muted-foreground)";
  const fontSizeName = fontSizes.name ?? "1.5rem";
  const fontSizeDesignation = fontSizes.designation ?? "0.925rem";
  const fontSizeQuote = fontSizes.quote ?? "1.125rem";

  // State
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(1200);

  const imageContainerRef = useRef<HTMLDivElement>(null);
  const autoplayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const testimonialsLength = useMemo(() => testimonials.length, [testimonials]);

  // Responsive gap calculation
  useEffect(() => {
    function handleResize() {
      if (imageContainerRef.current) {
        setContainerWidth(imageContainerRef.current.offsetWidth);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Navigation handlers
  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonialsLength);
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  }, [testimonialsLength]);
  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + testimonialsLength) % testimonialsLength);
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  }, [testimonialsLength]);

  // Autoplay
  useEffect(() => {
    if (autoplay) {
      autoplayIntervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % testimonialsLength);
      }, 5000);
    }
    return () => {
      if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
    };
  }, [autoplay, testimonialsLength]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, testimonialsLength, handlePrev, handleNext]);

  // Compute transforms for each image (always show 3: left, center, right)
  function getImageStyle(index: number): React.CSSProperties {
    const gap = calculateGap(containerWidth);
    const maxStickUp = gap * 0.8;
    const offset = (index - activeIndex + testimonialsLength) % testimonialsLength;
    let zIndex = 1;
    let opacity = 0;
    let pointerEvents: "auto" | "none" = "none";
    let transform = "";
    if (offset === 0) {
      // center
      zIndex = 3;
      opacity = 1;
      pointerEvents = "auto";
      transform = `translateX(0px) translateY(0px) scale(1) rotateY(0deg)`;
    } else if (offset === 1) {
      // right
      zIndex = 2;
      opacity = 1;
      pointerEvents = "auto";
      transform = `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-15deg)`;
    } else if (offset === testimonialsLength - 1) {
      // left (because -1 mod length = length-1)
      zIndex = 2;
      opacity = 1;
      pointerEvents = "auto";
      transform = `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(15deg)`;
    }
    return {
      zIndex,
      opacity,
      pointerEvents,
      transform,
      transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
    };
  }

  return (
    <div className="relative w-full">
      <div className="relative h-[400px] w-full overflow-hidden">
        <AnimatePresence>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.src}
              style={getImageStyle(index)}
              data-index={index}
            >
              <Image
                src={testimonial.src}
                alt={testimonial.name}
                width={400}
                height={400}
                className="rounded-full object-cover"
                priority
              />
            </motion.div>
          ))}
        </AnimatePresence>
        {/* Arrows */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-primary/90 text-primary-foreground rounded w-8 h-8 flex items-center justify-center hover:bg-primary/80 transition-colors duration-200"
            aria-label="Previous testimonial"
          >
            <LeftArrow className="h-4 w-4" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary/90 text-primary-foreground rounded w-8 h-8 flex items-center justify-center hover:bg-primary/80 transition-colors duration-200"
            aria-label="Next testimonial"
          >
            <RightArrow className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Testimonial content */}
      <div className="mt-10 text-center">
        <blockquote className="mb-6">
          <p
            className="text-base leading-relaxed"
            style={{ color: colorTestimony, fontSize: fontSizeQuote }}
          >
            “{testimonials[activeIndex].quote}”
          </p>
        </blockquote>
        <div className="space-y-2">
          <p
            className="text-lg font-semibold"
            style={{ color: colorName, fontSize: fontSizeName }}
          >
            {testimonials[activeIndex].name}
          </p>
          <p
            className="text-sm"
            style={{ color: colorDesignation, fontSize: fontSizeDesignation }}
          >
            {testimonials[activeIndex].designation}
          </p>
        </div>
      </div>
    </div>
  );
};