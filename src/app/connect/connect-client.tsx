
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Watch } from "lucide-react";
import Image from "next/image";

export function ConnectClient() {
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  const handleConnect = () => {
    setIsConnected(true);
    toast({
      title: "Samsung Health Connected",
      description: "Your data will now be synced.",
    });
  };
  
  const handleDisconnect = () => {
    setIsConnected(false);
    toast({
      title: "Samsung Health Disconnected",
      variant: "destructive",
    });
  };

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <div className="flex items-start gap-4">
             <Image 
                src="https://picsum.photos/seed/samsung/64/64" 
                alt="Samsung Health Logo"
                width={56}
                height={56}
                className="rounded-lg"
                data-ai-hint="smartwatch fitness app"
            />
            <div>
                <CardTitle className="text-2xl">Samsung Health</CardTitle>
                <CardDescription>Sync your daily activity, sleep, and body composition data automatically.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        {isConnected ? (
            <div className="space-y-4">
                <div className="flex items-center gap-2 p-4 rounded-md bg-green-500/10 text-green-400 border border-green-500/20">
                    <CheckCircle className="h-5 w-5" />
                    <p className="font-medium">Connected</p>
                </div>
                 <Button onClick={handleDisconnect} variant="destructive" className="w-full">
                    Disconnect
                </Button>
            </div>
        ) : (
          <Button onClick={handleConnect} className="w-full">
            <Watch className="mr-2" />
            Connect
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
