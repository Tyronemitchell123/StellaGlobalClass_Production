import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        status: 'operational',
        services: {
            'Luxury Transportation': 'available',
            'Premium Courier': 'available',
            'Web Design': 'available',
            'Healthcare Management': 'available',
            'Travel & Hospitality': 'available',
            'Real Estate': 'available',
            'Education Platform': 'available',
            'E-commerce Solutions': 'available'
        },
        uptime: '99.9%',
        lastUpdated: new Date().toISOString()
    });
}
