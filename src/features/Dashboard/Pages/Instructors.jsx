import React from 'react';
import InstructorCard from '../components/InstructorCard'; // Path sahi check kar lijiye ga

const Instructors = () => {
  // Dummy data array for 4 cards
  const instructorsData = [
    {
      id: 1,
      name: "Johnny Ahmad",
      rating: "5.0",
      reviews: "1k",
      tags: ["Design", "Tech", "Research"],
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400"
    },
    {
      id: 2,
      name: "Sarah Jenkins",
      rating: "4.9",
      reviews: "850",
      tags: ["UI/UX", "Art"],
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
    },
    {
      id: 3,
      name: "Michael Chen",
      rating: "4.8",
      reviews: "1.2k",
      tags: ["Development", "Python"],
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
    },
    {
      id: 4,
      name: "Emma Wilson",
      rating: "5.0",
      reviews: "500",
      tags: ["Marketing", "SEO"],
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400"
    }
  ];

  return (
   <div>
      {/* Grid Container: Mobile pe 1, Tablet pe 2, Desktop pe 4 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        {instructorsData.map((instructor) => (
          <InstructorCard 
            key={instructor.id}
            name={instructor.name}
            rating={instructor.rating}
            reviews={instructor.reviews}
            tags={instructor.tags}
            image={instructor.image}
          />
        ))}
      </div>
   </div>
    

    
  
  );
};

export default Instructors;