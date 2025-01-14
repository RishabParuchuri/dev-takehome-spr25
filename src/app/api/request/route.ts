import { RESPONSES, ResponseType } from "@/lib/types/apiResponse";
import connectDB from "@/lib/connectDB";
import { NextRequest, NextResponse } from 'next/server';
import Request from "@/models/Request";
import { ServerResponseBuilder } from "@/lib/builders/serverResponseBuilder";

export async function PUT(request: NextRequest) {
    const conn = await connectDB();

    const body = await request.json();
    const { requestorName, itemRequested } = body;

    if (!requestorName || requestorName.length < 3 || requestorName.length > 30) {
        return new ServerResponseBuilder(ResponseType.INVALID_INPUT).build();
    }

    if (!itemRequested || itemRequested.length < 2 || itemRequested.length > 100) {
        return new ServerResponseBuilder(ResponseType.INVALID_INPUT).build();
    }

    try {
        const newRequest = new Request({ requestorName, itemRequested });
        await newRequest.save();
        return new ServerResponseBuilder(ResponseType.CREATED).build();
    } catch (error) {
        console.log(error);
        return new ServerResponseBuilder(ResponseType.UNKNOWN_ERROR).build();
    }
}