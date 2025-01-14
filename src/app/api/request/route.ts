import { ResponseType } from "@/lib/types/apiResponse";
import connectDB from "@/lib/connectDB";
import { NextRequest } from 'next/server';
import Request from "@/models/Request";
import { ServerResponseBuilder } from "@/lib/builders/serverResponseBuilder";
import { PAGINATION_PAGE_SIZE } from "@/lib/constants/config";

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
        const savedRequest = await newRequest.save();
        return new Response(JSON.stringify(savedRequest), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
    } catch (error) {
        console.log(error);
        return new ServerResponseBuilder(ResponseType.UNKNOWN_ERROR).build();
    }
}

export async function GET(request: NextRequest) {
    const client = await connectDB();

    const url = request.url;
    const { searchParams }  = new URL(url);

    const pageParam = parseInt(searchParams.get('page') || '1', 10);
    const status = searchParams.get('status');
    const page = pageParam < 1 ? 1 : pageParam;

    const validStatuses = ['pending', 'completed', 'approved', 'rejected'];

    if (status && !validStatuses.includes(status)) {
        return new ServerResponseBuilder(ResponseType.INVALID_INPUT).build();
    }

    try {
        const pageSize = PAGINATION_PAGE_SIZE;
        const skip = (page - 1) * pageSize;
        const filter = status ? { status } : {};
        const requests = await Request.find(filter)
            .sort({ createdAt: -1 }) 
            .skip(skip)
            .limit(pageSize)
            .lean();
        console.log(page);
        return new Response(JSON.stringify(requests), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.log(error);
        return new ServerResponseBuilder(ResponseType.UNKNOWN_ERROR).build();
    }
}

export async function PATCH(request: NextRequest) {
    const conn = await connectDB();

    const body = await request.json();
    const { id, status } = body;

    const validStatuses = ['pending', 'completed', 'approved', 'rejected'];

    if (status && !validStatuses.includes(status)) {
        return new ServerResponseBuilder(ResponseType.INVALID_INPUT).build();
    }

    try {
        const update = { status: status }
        const updatedRequest = await Request.findByIdAndUpdate(id, { status: status }, {new: true})
        return new Response(JSON.stringify(updatedRequest), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
    } catch (error) {
        console.log(error);
        return new ServerResponseBuilder(ResponseType.UNKNOWN_ERROR).build();
    }
}