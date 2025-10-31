import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const category = searchParams.get('category'); // Get the new category parameter

    if (!city) {
        return NextResponse.json({ error: 'City is required' }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: 'API key is not configured' }, { status: 500 });
    }

    // Determine the search query based on the client's category
    const textQuery = category === 'PREMIUM'
        ? `top rated hotels in ${city}`
        : `budget hotels in ${city}`;

    const url = 'https://places.googleapis.com/v1/places:searchText';
    const requestBody = {
        textQuery: textQuery, // Use the dynamic text query
        maxResultCount: 3
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
                'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.id,places.photos'
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        if (!data.places || data.places.length === 0) {
            console.error('Google Places API (New) Error or no results:', data);
            return NextResponse.json({ error: 'Failed to fetch hotel data or no hotels found' }, { status: 500 });
        }

        const hotels = data.places.map((place: any) => {
            let imageUrl = null;
            if (place.photos && place.photos.length > 0) {
                const photoResourceName = place.photos[0].name;
                imageUrl = `https://places.googleapis.com/v1/${photoResourceName}/media?maxHeightPx=400&key=${apiKey}`;
            }

            // --- Randomize amenities ---
            const amenities = {
                bathrooms: Math.floor(Math.random() * 2) + 1, // 1 or 2
                bedrooms: Math.floor(Math.random() * 2) + 1, // 1 or 2
                wifi: Math.random() < 0.9, // 90% chance of WiFi
                geyser: Math.floor(Math.random() * 2) + 1, // 1 or 2
            };

            return {
                name: place.displayName?.text || 'Unnamed Hotel',
                address: place.formattedAddress,
                rating: place.rating,
                imageUrl: imageUrl,
                amenities: amenities, // Use the new random object
                mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.displayName?.text)}&query_place_id=${place.id}`
            };
        });

        return NextResponse.json(hotels);

    } catch (error) {
        console.error('Server-side fetch error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}