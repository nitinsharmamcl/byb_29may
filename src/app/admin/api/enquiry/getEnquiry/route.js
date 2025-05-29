import {db} from '@/lib/db';
import { NextResponse } from 'next/server';


export async function GET(response) {
try
{
    const [data]= await db.query('SELECT * FROM enquiry');
    return NextResponse.json({ data });
    
}
catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
}}


// getEnquiry, 