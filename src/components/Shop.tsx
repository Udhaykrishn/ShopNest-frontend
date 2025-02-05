import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, ShoppingBag, ChevronLeft, ChevronRight, Star, Heart, Eye } from "lucide-react";
import { Select, SelectContent, SelectTrigger, SelectValue } from './ui/select';
import { SelectItem } from '@radix-ui/react-select';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

const categories = [
  "All",
  "Electronics",
  "Clothing",
  "Books",
  "Home & Kitchen",
  "Toys",
];

const carouselImages = [
  {
    url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&q=80",
    title: "Summer Collection",
    subtitle: "Explore our latest arrivals"
  },
  {
    url: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=600&q=80",
    title: "Tech Deals",
    subtitle: "Up to 40% off on electronics"
  },
  {
    url: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=600&q=80",
    title: "Home Essentials",
    subtitle: "Transform your living space"
  }
];

const featuredProducts: Product[] = [
  {
    id: 1,
    title: "Sony WH-1000XM4",
    description: "Premium wireless noise-cancelling headphones with exceptional sound quality and up to 30 hours battery life",
    price: 349.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&h=500&q=80"
  },
  {
    id: 2,
    title: "Nike Air Max",
    description: "Classic athletic shoes with modern comfort technology and stylish design",
    price: 129.99,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&q=80"
  },
  {
    id: 3,
    title: "Apple Watch Series 7",
    description: "Advanced smartwatch with health monitoring, fitness tracking, and seamless connectivity",
    price: 399.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&h=500&q=80"
  },
  {
    id: 4,
    title: "Levi's 501 Original",
    description: "Iconic straight fit jeans made with premium denim and classic styling",
    price: 79.99,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=500&h=500&q=80"
  },
  {
    id: 5,
    title: "Samsung QLED 4K TV",
    description: "65-inch Smart TV with quantum dot technology and immersive viewing experience",
    price: 1299.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500&h=500&q=80"
  },
  {
    id: 6,
    title: "MacBook Pro M1",
    description: "Powerful laptop with Apple M1 chip, stunning Retina display, and all-day battery life",
    price: 1299.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&h=500&q=80"
  }
];

export const ShopPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sortBy, setSortBy] = useState("default");

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const sortProducts = (products:any) => {
    switch (sortBy) {
      case "price-low":
        return [...products].sort((a, b) => a.price - b.price);
      case "price-high":
        return [...products].sort((a, b) => b.price - a.price);
      case "name-asc":
        return [...products].sort((a, b) => a.title.localeCompare(b.title));
      case "name-desc":
        return [...products].sort((a, b) => b.title.localeCompare(a.title));
      default:
        return products;
    }
  };

  const filteredProducts = sortProducts(
    featuredProducts.filter(product =>
      (selectedCategory === "All" || product.category === selectedCategory) &&
      (product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );

  return (
    <div className="min-h-screen bg-background overflow-x-hidden w-full">
      {/* Carousel Section */}
      <div className="relative h-[500px] mb-12 overflow-hidden">
        <div
          className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {carouselImages.map((slide, index) => (
            <div key={index} className="relative w-full flex-shrink-0">
              <img
                src={slide.url}
                alt={slide.title}
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/30 flex flex-col items-center justify-center text-white">
                <h2 className="text-5xl font-bold mb-4">{slide.title}</h2>
                <p className="text-2xl font-light">{slide.subtitle}</p>
                <Button className="mt-8 bg-primary hover:dark:bg-transparent hover:dark:border-primary hover:dark:border-2 dark:text-white hover:bg-primary/90 text-primary-foreground">
                  Shop Now
                </Button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={prevSlide}
          className="absolute  text-white  left-4 top-1/2 -translate-y-1/2 bg-primary dark:bg-primary p-3 rounded-full hover:bg-transparent hover:text-primary dark:hover:bg-background/60 transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute  bg-primary text-white  right-4 top-1/2 -translate-y-1/2 dark:bg-primary p-3 rounded-full hover:bg-transparent hover:text-primary  dark:hover:bg-background/60 transition-colors"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      <section className="container py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to{" "}
            <span className="text-primary">
              ShopNest
            </span>
          </h1>
          <p className="text-muted-foreground text-xl mb-8">
            Discover amazing products at great prices
          </p>
        </div>

        {/* Search, Sort and Categories */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] bg-primary text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className='bg-primary text-white border-none ' value="default">Default</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name-asc">Name: A to Z</SelectItem>
                  <SelectItem value="name-desc">Name: Z to A</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Products */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Featured Products</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product: Product) => (
              <Card key={product.id} className="group">
                <CardContent className="p-6">
                  <div className="relative mb-6">
                    <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button className="p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors">
                        <Heart className="h-4 w-4 text-primary" />
                      </button>
                      <button className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <CardHeader className="p-0 space-y-4">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl font-semibold">{product.title}</CardTitle>
                      <div className="flex items-center bg-primary/10 px-2 py-1 rounded">
                        <Star className="h-4 w-4 text-primary fill-primary" />
                        <span className="ml-1 text-sm font-medium">4.5</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-2">{product.description}</p>
                    <p className="font-bold text-2xl text-primary">${product.price}</p>
                  </CardHeader>
                  <Button className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
                    <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* View All Products Button */}
        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="hover:bg-primary hover:text-primary-foreground">
            View All Products
          </Button>
        </div>
      </section>
    </div>
  );
};
