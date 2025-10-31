import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Bike, MapPin, MessageSquare, Phone, Play, Smartphone, TruckIcon } from "lucide-react";

export default function ComingSoon() {
  return (
    <div className="bg-white/30">
    <section className="max-w-6xl mx-auto px-6 py-16 text-center ">
      {/* Logo */}
      <div className="m-auto w-14 h-14 w-none flex justify-center items-center rounded-xl mb-6 bg-primary">
      <Smartphone className="text-white w-8 h-8"/>
      </div>

      {/* Heading */}
      <div className="flex flex-col justify-center">

      <h2 className="text-4xl text-foreground font-bold mb-4">Mobile App <span className="text-primary font-bold">Coming Soon</span></h2>
      <p className="text-lg text-gray-600 mb-8 px-6 max-md:px-4">Get ready for the ultimate student experience on the go. Our mobile app will bring all of SayDone's features right to your fingertips.</p>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {/* Card 1 */}
        <Card className="rounded-2xl  border-primary/50 bg-white">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Bell className="w-8 h-8 text-primary  mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-foreground">Instant Notifications</h3>
            <p className="text-sm text-gray-600">
            Personalized notifications—delivered the moment new content arrives.
            </p>
          </CardContent>
        </Card>

        {/* Card 2 */}
        <Card className="rounded-2xl  border-primary/50 bg-white">
          <CardContent className="p-6 flex flex-col items-center text-center">
            
            <MapPin className="w-8 h-8 text-primary mb-4" />
         
            <h3 className="text-lg font-semibold mb-2 text-foreground">Location-Based</h3>
            <p className="text-sm text-gray-600">
            Quickly connect with services and opportunities around you.
            </p>
          </CardContent>
        </Card>

        {/* Card 3 */}
        <Card className="rounded-2xl  border-primary/50 bg-white">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <TruckIcon className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-foreground">Reliable Delivery</h3>
            <p className="text-sm text-gray-600">
            Seamlessly order your favorites—quick, simple, and delivered right to you.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Download Section */}
      <div className="flex flex-col items-center gap-4">
        <p className="text-lg font-medium">Download the app</p>
        <Button className="bg-primary text-white cursor-pointer border-none px-6 py-3 rounded-xl flex items-center gap-2">
          <Play className="w-6 h-6" />
          Get it on Google Play
        </Button>
      </div>
    </section>
    </div>
  );
}
