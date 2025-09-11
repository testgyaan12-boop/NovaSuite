
import { NextResponse } from 'next/server';

/**
 * API route to handle syncing workout data from the client.
 * @param {Request} request - The incoming request object.
 * @returns {NextResponse} - The response from the API.
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // TODO: Add logic to save the workout data to a database.
    console.log("Received workout data on server:", data);

    return NextResponse.json({ message: "Sync successful" }, { status: 200 });
  } catch (error) {
    console.error("Error syncing workout data:", error);
    let errorMessage = "An unknown error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ message: "Sync failed", error: errorMessage }, { status: 500 });
  }
}
