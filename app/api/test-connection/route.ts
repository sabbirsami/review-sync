import { testConnection } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');

    const result = await testConnection();

    return NextResponse.json({
      success: result.success,
      message: result.success ? 'Connection successful' : 'Connection failed',
      details: result,
      env: {
        mongodbUri: process.env.MONGODB_URI ? 'Set' : 'Not set',
        nodeEnv: process.env.NODE_ENV,
      },
    });
  } catch (error) {
    console.error('Test connection error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Connection test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        env: {
          mongodbUri: process.env.MONGODB_URI ? 'Set' : 'Not set',
          nodeEnv: process.env.NODE_ENV,
        },
      },
      { status: 500 },
    );
  }
}
