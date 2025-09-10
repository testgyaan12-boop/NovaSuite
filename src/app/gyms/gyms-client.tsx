
"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { DUMMY_GYMS, PROMOTIONS } from "@/lib/placeholder-data";
import { Phone, Search } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

function PromotionCard({ promotion }: { promotion: (typeof PROMOTIONS)[0] }) {
    return (
        <Card className="overflow-hidden relative text-white">
            <Image 
                src={promotion.image.src}
                alt={promotion.image.alt}
                width={promotion.image.width}
                height={promotion.image.height}
                className="object-cover w-full h-full"
                data-ai-hint={promotion.image['data-ai-hint']}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"/>
            <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-2xl font-bold">{promotion.title}</h3>
                <p className="text-lg">{promotion.description}</p>
                 <Button className="mt-4">Learn More</Button>
            </div>
        </Card>
    )
}

function GymCard({ gym }: { gym: (typeof DUMMY_GYMS)[0] }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <Carousel className="w-full mb-4">
          <CarouselContent>
            {gym.images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="aspect-video relative">
                  <Image 
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      className="rounded-md object-cover w-full h-full"
                      data-ai-hint={image['data-ai-hint']}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <CardTitle>{gym.name}</CardTitle>
        <CardDescription>{gym.address}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <h4 className="font-semibold mb-2">Membership Plans</h4>
        <ul className="space-y-1 text-sm text-muted-foreground">
          {gym.plans.map((plan) => (
            <li key={plan.name} className="flex justify-between">
              <span>{plan.name}</span>
              <span className="font-medium">{plan.price}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
          <Button variant="outline" className="w-full">
            <Phone className="mr-2 h-4 w-4" />
            {gym.phone}
          </Button>
      </CardFooter>
    </Card>
  );
}

export function GymsClient() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGyms = DUMMY_GYMS.filter(gym => 
      gym.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      gym.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold mb-4">Promotions</h3>
        <div className="grid gap-4">
            {PROMOTIONS.map(promo => <PromotionCard key={promo.id} promotion={promo} />)}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-bold">Nearby Gyms</h3>
         <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search by name or address..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {filteredGyms.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredGyms.map((gym) => (
              <GymCard key={gym.id} gym={gym} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            <p>No gyms found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
