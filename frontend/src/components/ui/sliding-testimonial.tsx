"use client"

import { useEffect, useState } from "react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string | null;
  company_logo: string | null;
}

const defaultTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Food Blogger",
    content: "Tasty Fingers has completely elevated my meal times. The quality of their jollof and soups is unmatched — I've never received so many compliments!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64&q=80",
    company_logo: null,
  },
  {
    id: 2,
    name: "Amaka Okafor",
    role: "Business Owner",
    content: "The customer service is exceptional. They helped me place a catering order for my anniversary and I couldn't be happier.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64&q=80",
    company_logo: null,
  },
  {
    id: 3,
    name: "Chioma Eze",
    role: "Event Planner",
    content: "I recommend Tasty Fingers to all my clients. The meals are premium quality and always arrive fresh. Worth every naira!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64&q=80",
    company_logo: null,
  },
  {
    id: 4,
    name: "Ngozi Adewale",
    role: "Influencer",
    content: "The variety is amazing. From jollof and soups to grills and sides, they have everything you need for any occasion.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64&q=80",
    company_logo: null,
  },
  {
    id: 5,
    name: "Tunde Bakare",
    role: "Photographer",
    content: "I've ordered from many restaurants, but Tasty Fingers stands out for their attention to flavour and consistently delicious meals.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64&q=80",
    company_logo: null,
  },
  {
    id: 6,
    name: "Folake Adeyemi",
    role: "Creative Director",
    content: "Their grilled specialties and soup selection are outstanding. My team loves every order. Tasty Fingers is my go-to restaurant.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64&q=80",
    company_logo: null,
  },
];

export default function SlidingTestimonial() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);

  useEffect(() => {
    // Fetch testimonials from Django API
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/v1/site/testimonials/');
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setTestimonials(data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
      // Keep using default testimonials if fetch fails
    }
  };

  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="w-full section-padding bg-brand-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-display font-semibold text-brand-black mb-4">
            What Our Clients Say
          </h2>
          <p className="text-base md:text-lg text-brand-accent/60 max-w-2xl mx-auto">
            Real stories from real customers who have experienced the Tasty Fingers difference
          </p>
        </div>

        <div
          style={{
            maskImage: 'linear-gradient(to left, transparent 0%, black 20%, black 80%, transparent 95%)',
          }}
          className="flex relative overflow-hidden shrink-0 max-w-full"
        >
          <div className="flex animate-x-slider gap-5 w-max">
            {duplicatedTestimonials.map((testimonial, indx) => (
              <div
                key={`${testimonial.id}-${indx}`}
                className="border border-brand-gray-200 flex flex-col bg-white rounded-luxury shrink-0 grow-0 w-[600px] h-full shadow-card"
              >
                <div className="px-6 py-6 flex-1">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <span key={i} className="text-brand-pink text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-lg md:text-xl text-brand-accent leading-relaxed">
                    &quot;{testimonial.content}&quot;
                  </p>
                </div>

                <div className="border-t border-brand-gray-200 w-full flex">
                  <div className="w-3/4 flex gap-3 items-center px-5 py-4">
                    {testimonial.image ? (
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-brand-pink/10 flex items-center justify-center">
                        <span className="text-brand-pink font-semibold">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="flex flex-col flex-1 gap-0 justify-start items-start">
                      <h5 className="text-base font-semibold text-brand-black">
                        {testimonial.name}
                      </h5>
                      <p className="text-sm text-brand-accent/60">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>

                  <div className="w-[1px] bg-brand-gray-200" />

                  {testimonial.company_logo && (
                    <div className="max-w-full self-center pl-4 pr-5">
                      <img
                        src={testimonial.company_logo}
                        alt="company logo"
                        className="h-8 w-auto max-w-28 object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
