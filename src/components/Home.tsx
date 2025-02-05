import { Button } from "@/components/ui/button";
import { HeroCards } from "@/components/HeroCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Heart, ShoppingBag, Star, TrendingUp, Timer, Tag, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const products = [
  {
    id: 1,
    title: "Sony WH-1000XM5 Headphones",
    description: "Industry-leading noise cancellation with exceptional sound quality",
    price: 399.99,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&q=80",
    category: "Electronics",
    stock: 15,
    rating: 4.8,
    variants: ["Black", "Silver", "Midnight Blue"]
  },
  {
    id: 2,
    title: "Apple MacBook Air M2",
    description: "Supercharged by M2 chip for exceptional performance and battery life",
    price: 1199.99,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&q=80",
    category: "Electronics",
    stock: 10,
    rating: 4.9,
    variants: ["Space Gray", "Silver", "Midnight"]
  },
  {
    id: 3,
    title: "Samsung Galaxy S24 Ultra",
    description: "Next-generation smartphone with advanced AI capabilities",
    price: 1299.99,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&q=80",
    category: "Electronics",
    stock: 20,
    rating: 4.7,
    variants: ["Titanium Black", "Titanium Gray", "Titanium Violet"]
  },
  {
    id: 4,
    title: "iPad Air",
    description: "Powerful. Colorful. Wonderful. The most versatile iPad Air yet",
    price: 599.99,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&q=80",
    category: "Electronics",
    stock: 25,
    rating: 4.8,
    variants: ["Space Gray", "Blue", "Pink", "Purple", "Starlight"]
  }
];

export  function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
        <div className="text-center lg:text-start space-y-6">
          <main className="text-5xl md:text-6xl font-bold">
            <h1 className="inline">
              <span className="inline text-primary">ShopNest</span>{" "}
            </h1>
            <h2 className="inline">
              Your Ultimate{" "}
              <span className="inline text-primary">Shopping</span>{" "}
              Destination
            </h2>
          </main>

          <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
            Discover an amazing collection of products with great deals and 
            lightning-fast delivery. Your perfect shopping experience starts here.
          </p>

          <div className="space-y-4 md:space-y-0 md:space-x-4">
            <Button className="w-full md:w-1/3">
              Go To Shop
              <ShoppingBag className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="z-10">
          <HeroCards />
        </div>
      </section>

      {/* Products Section */}
      <section className="container py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2 text-primary">Featured Products</h2>
            <p className="text-muted-foreground">Discover our selection of premium products</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <TrendingUp className="mr-2 h-4 w-4" />
              Trending
            </Button>
            <Button variant="outline" size="sm">
              <Timer className="mr-2 h-4 w-4" />
              New Arrivals
            </Button>
            <Button variant="outline" size="sm">
              <Tag className="mr-2 h-4 w-4" />
              Best Deals
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="group">
              <CardContent className="p-6">
                <div className="relative mb-6">
                  <div className="aspect-square overflow-hidden rounded-lg">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {product.stock < 5 && (
                      <Badge className="absolute top-2 left-2">
                        Low Stock: {product.stock} left
                      </Badge>
                    )}
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
                    <div>
                      <CardTitle className="text-xl font-semibold">{product.title}</CardTitle>
                      <Badge variant="secondary" className="mt-2">
                        {product.category}
                      </Badge>
                    </div>
                    <div className="flex items-center bg-primary/10 px-2 py-1 rounded">
                      <Star className="h-4 w-4 text-primary" />
                      <span className="ml-1 text-sm font-medium">{product.rating}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm line-clamp-2">{product.description}</p>
                  <div className="space-y-2">
                    <p className="font-bold text-2xl text-primary">${product.price}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Package className="h-4 w-4 mr-1" />
                      {product.stock} in stock
                    </div>
                  </div>
                 
                </CardHeader>
                <Button className="w-full mt-6">
                  <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}