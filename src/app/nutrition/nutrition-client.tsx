"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { analyzeNutrition } from "@/ai/flows/analyze-nutrition-flow";
import type { AnalyzeNutritionOutput } from "@/ai/flows/analyze-nutrition-flow";
import { Camera, RefreshCcw, Zap, Loader2 } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

function NutritionResult({
  result,
}: {
  result: AnalyzeNutritionOutput;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{result.foodName}</CardTitle>
        <CardDescription>Estimated Nutritional Information</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="flex flex-col space-y-1">
          <span className="text-sm text-muted-foreground">Calories</span>
          <span className="text-xl font-bold">{result.calories} kcal</span>
        </div>
        <div className="flex flex-col space-y-1">
          <span className="text-sm text-muted-foreground">Protein</span>
          <span className="text-xl font-bold">{result.protein} g</span>
        </div>
        <div className="flex flex-col space-y-1">
          <span className="text-sm text-muted-foreground">Carbs</span>
          <span className="text-xl font-bold">{result.carbohydrates} g</span>
        </div>
        <div className="flex flex-col space-y-1">
          <span className="text-sm text-muted-foreground">Fat</span>
          <span className="text-xl font-bold">{result.fat} g</span>
        </div>
        <div className="flex flex-col space-y-1">
          <span className="text-sm text-muted-foreground">Fiber</span>
          <span className="text-xl font-bold">{result.fiber} g</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function NutritionClient() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<AnalyzeNutritionOutput | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        toast({
          variant: "destructive",
          title: "Camera Not Supported",
          description: "Your browser does not support camera access.",
        });
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        setHasCameraPermission(false);
        toast({
          variant: "destructive",
          title: "Camera Access Denied",
          description:
            "Please enable camera permissions in your browser settings to use this feature.",
        });
      }
    };

    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [toast]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const imageDataUri = canvas.toDataURL("image/jpeg");
        setCapturedImage(imageDataUri);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!capturedImage) return;
    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const result = await analyzeNutrition({ imageDataUri: capturedImage });
      setAnalysisResult(result);
    } catch (error) {
      console.error(error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
  };
  
   if (hasCameraPermission === null) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Camera</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
            {capturedImage ? (
              <img
                src={capturedImage}
                alt="Captured food"
                className="h-full w-full object-cover"
              />
            ) : (
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />
            )}
            {!capturedImage && hasCameraPermission === false && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <p className="text-white">Camera access denied.</p>
              </div>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {capturedImage ? (
            <Button variant="outline" onClick={reset}>
              <RefreshCcw className="mr-2" />
              Retake
            </Button>
          ) : (
            <Button onClick={handleCapture} disabled={!hasCameraPermission}>
              <Camera className="mr-2" />
              Capture
            </Button>
          )}
        </CardFooter>
      </Card>
      
      <div className="space-y-4">
        <Button onClick={handleAnalyze} disabled={!capturedImage || isLoading} className="w-full">
          {isLoading ? (<><Loader2 className="mr-2 animate-spin" /> Analyzing...</>) : (<><Zap className="mr-2" /> Analyze Nutrition</>)}
        </Button>
        
        {isLoading && (
            <Card>
                 <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-6 w-24" />
                    </div>
                     <div className="space-y-1">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-6 w-24" />
                    </div>
                     <div className="space-y-1">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-6 w-24" />
                    </div>
                     <div className="space-y-1">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-6 w-24" />
                    </div>
                </CardContent>
            </Card>
        )}

        {analysisResult ? (
          <NutritionResult result={analysisResult} />
        ) : (
          !isLoading && <Card className="flex h-64 items-center justify-center">
            <CardContent>
              <p className="text-center text-muted-foreground">
                {capturedImage ? "Ready to analyze." : "Capture a photo to get started."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
