export interface TestimonialItem {
  name: string;
  business: string;
  quote: string;
  rating: number;
}

export const testimonials: TestimonialItem[] = [
  {
    name: 'Mike Johnson',
    business: 'Johnson Landscaping',
    quote: 'Finally, software that actually makes sense! No confusing menus, just simple job tracking.',
    rating: 5
  },
  {
    name: 'Sarah Martinez',
    business: 'Fix-It Handyman Services', 
    quote: 'I went from paper chaos to organized in one afternoon. The QR codes save me so much time on job sites.',
    rating: 5
  },
  {
    name: 'Tom Wilson', 
    business: 'Wilson Contracting',
    quote: 'Been using this for 6 months. Simple, fast, and it just works. No more lost paperwork!',
    rating: 5
  }
];
