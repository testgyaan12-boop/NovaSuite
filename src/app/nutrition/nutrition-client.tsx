
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { analyzeNutrition } from "@/ai/flows/analyze-nutrition-flow";
import type { AnalyzeNutritionOutput } from "@/ai/flows/analyze-nutrition-flow";
import { Camera, RefreshCcw, Zap, Loader2, Info } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

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
  const [isCameraStreaming, setIsCameraStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [foodName, setFoodName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<AnalyzeNutritionOutput | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const getCameraPermission = useCallback(async () => {
    setIsCameraStreaming(false);
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
        videoRef.current.onloadedmetadata = () => {
          setIsCameraStreaming(true);
        }
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setHasCameraPermission(false);
    }
  }, [toast]);
  
  useEffect(() => {
    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [getCameraPermission]);

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
    if (!capturedImage && !foodName) return;
    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const result = await analyzeNutrition({ imageDataUri: capturedImage || undefined, foodName: foodName || undefined });
      setAnalysisResult(result);
    } catch (error) {
      console.error(error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setFoodName("");
    getCameraPermission();
  };
  
   if (hasCameraPermission === null) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Requesting camera permission...</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Input</CardTitle>
          <CardDescription>Use your camera or type in a food name.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted flex items-center justify-center">
            {capturedImage ? (
              <img
                src={capturedImage}
                alt="Captured food"
                className="h-full w-full object-cover"
              />
            ) : (
              <>
                <video
                  ref={videoRef}
                  className={`h-full w-full object-cover ${isCameraStreaming ? 'block' : 'hidden'}`}
                  autoPlay
                  playsInline
                  muted
                />
                {!isCameraStreaming && hasCameraPermission && (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p>Starting camera...</p>
                  </div>
                )}
              </>
            )}
            {!capturedImage && hasCameraPermission === false && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 p-4 text-center">
                <Alert variant="destructive" className="max-w-sm">
                  <AlertTitle>Camera Access Denied</AlertTitle>
                  <AlertDescription>
                    Please enable camera permissions in your browser settings. You can still analyze by typing a food name below.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />
          <div className="flex justify-end gap-2">
            {capturedImage ? (
              <Button variant="outline" onClick={reset}>
                <RefreshCcw className="mr-2" />
                Retake
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={getCameraPermission} title="Refresh Camera">
                    <RefreshCcw />
                </Button>
                <Button onClick={handleCapture} disabled={!isCameraStreaming}>
                    <Camera className="mr-2" />
                    Capture
                </Button>
              </>
            )}
          </div>
          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-card px-2 text-sm text-muted-foreground">AND/OR</span>
          </div>
           <div className="space-y-2">
            <Label htmlFor="foodName">Food Name (Optional)</Label>
            <Input 
              id="foodName" 
              placeholder="e.g. 'a green apple'" 
              value={foodName} 
              onChange={(e) => setFoodName(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <Button onClick={handleAnalyze} disabled={(!capturedImage && !foodName) || isLoading} className="w-full">
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
            <CardContent className="flex flex-col items-center gap-2 text-center p-6">
                <Info className="h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground">
                    {capturedImage ? "Ready to analyze." : "Capture or type in a food to get started."}
                </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
