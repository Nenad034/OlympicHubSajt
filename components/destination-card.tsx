'use client';

/**
 * DestinationCard Component - Reusable card for displaying destinations
 * 
 * Features:
 * - next/image optimization
 * - Framer Motion hover animations
 * - Gradient overlay for text readability
 * - Price badge
 * - Responsive design
 */

import { motion } from 'framer-motion';
import Image from 'next/image';

interface DestinationCardProps {
  name: string;
  imageUrl: string;
  price: string;
  description?: string;
  onClick?: () => void;
}

export default function DestinationCard({
  name,
  imageUrl,
  price,
  description,
  onClick,
}: DestinationCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -8 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-lg cursor-pointer group"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          priority={false}
          loading="lazy"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-2xl font-bold mb-1">{name}</h3>
          {description && (
            <p className="text-sm text-gray-200 mb-2">{description}</p>
          )}
          <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="font-semibold">{price}</span>
          </div>
        </div>
      </div>
      
      {/* Hover Shadow Effect */}
      <div className="absolute inset-0 ring-2 ring-transparent group-hover:ring-primary/50 rounded-lg transition-all duration-300" />
    </motion.div>
  );
}
