import React from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Shirt, 
  Smartphone, 
  Laptop, 
  Headphones,
  LucideIcon
} from 'lucide-react';

interface CategoryCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

interface Category {
  icon: LucideIcon;
  title: string;
  description: string;
  position: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  className 
}) => (
  <Card className={`group hover:-translate-y-2 transition-all duration-300 ease-out ${className}`}>
    <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
      <div className="mt-1 bg-primary/20 p-3 rounded-2xl group-hover:bg-primary/30 transition-colors duration-300">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="text-md mt-2">
          {description}
        </CardDescription>
      </div>
    </CardHeader>
    <CardContent>
      <div className="w-full h-1 bg-primary/10 rounded-full overflow-hidden">
        <div className="w-0 group-hover:w-full h-full bg-primary/30 transition-all duration-500 ease-out" />
      </div>
    </CardContent>
  </Card>
);

export const HeroCards: React.FC = () => {
  const categories: Category[] = [
    {
      icon: Shirt,
      title: "Fashion & Apparel",
      description: "Discover the latest trends in clothing and accessories",
      position: "absolute w-[340px] -top-[15px] left-[20px]"
    },
    {
      icon: Smartphone,
      title: "Mobile & Electronics",
      description: "Latest smartphones and gadgets from top brands",
      position: "absolute w-[300px] right-[20px] top-4"
    },
    {
      icon: Laptop,
      title: "Computers & Tech",
      description: "Premium laptops and tech essentials",
      position: "absolute w-[320px] top-[180px] left-[50px]"
    },
    {
      icon: Headphones,
      title: "Audio Devices",
      description: "High-quality headphones and speakers",
      position: "absolute w-[350px] -right-[10px] bottom-[35px]"
    }
  ];

  return (
    <div className="hidden lg:flex relative w-[700px] h-[500px]">
      {categories.map((category, index) => (
        <CategoryCard
          key={index}
          icon={category.icon}
          title={category.title}
          description={category.description}
          className={`drop-shadow-xl shadow-black/10 dark:shadow-white/10 ${category.position}`}
        />
      ))}
    </div>
  );
};

export default HeroCards;