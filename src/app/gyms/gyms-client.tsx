
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { DUMMY_GYMS, PROMOTIONS } from "@/lib/placeholder-data";
import { Phone } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

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
        <div className="aspect-video relative mb-4">
             <Image 
                src={gym.image.src}
                alt={gym.image.alt}
                width={gym.image.width}
                height={gym.image.height}
                className="rounded-md object-cover"
                data-ai-hint={gym.image['data-ai-hint']}
            />
        </div>
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
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold mb-4">Promotions</h3>
        <div className="grid gap-4">
            {PROMOTIONS.map(promo => <PromotionCard key={promo.id} promotion={promo} />)}
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-4">Nearby Gyms</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {DUMMY_GYMS.map((gym) => (
            <GymCard key={gym.id} gym={gym} />
          ))}
        </div>
      </div>
    </div>
  );
}
