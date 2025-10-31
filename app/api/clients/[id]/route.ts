import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest, context: { params: any }) {
    try {
        // context.params may be a Promise in newer Next.js typings — await if needed
        const params = await (context.params && typeof context.params.then === "function"
            ? context.params
            : Promise.resolve(context.params));

        const { id } = params || {};
        console.log('API: Fetching client with ID:', id);

        if (!id) {
            return NextResponse.json({ error: "Missing client id" }, { status: 400 });
        }

        const client = await prisma.client.findUnique({
            where: { id },
            select: {
                id: true,
                images: true,
                earnings: true,
                serviceType: true,
                category: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!client) {
            console.log('API: Client not found for ID:', id);
            return NextResponse.json(
                { error: "Client not found" },
                { status: 404 }
            );
        }

        console.log('API: Successfully found client:', client);
        return NextResponse.json(client);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}