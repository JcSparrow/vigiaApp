import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import CaseCard from './CaseCard';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';

interface Case {
  id: string;
  type: 'person' | 'vehicle' | 'item';
  title: string;
  description: string;
  image: string;
  date: string;
  location: string;
  commentsCount: number;
  supportCount: number;
  status: 'active' | 'resolved';
}

interface CaseCarouselProps {
  title: string;
  cases: Case[];
  viewAllLink: string;
  onSupport: (id: string) => void;
  onShare: (id: string) => void;
}

export default function CaseCarousel({ title, cases, viewAllLink, onSupport, onShare }: CaseCarouselProps) {
  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Link
          to={viewAllLink}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          Ver Todos
          <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      </div>

      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 }
        }}
        className="rounded-lg"
      >
        {cases.map((case_) => (
          <SwiperSlide key={case_.id}>
            <CaseCard
              {...case_}
              onSupport={() => onSupport(case_.id)}
              onShare={() => onShare(case_.id)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}