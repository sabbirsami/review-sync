import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test basic network connectivity
    const tests = [];

    // Test DNS resolution
    try {
      const dnsTest = await fetch('https://8.8.8.8', {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000),
      });
      tests.push({ name: 'DNS Resolution', success: true, details: 'Can reach external DNS' });
    } catch (error) {
      tests.push({
        name: 'DNS Resolution',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    // Test MongoDB Atlas connectivity
    try {
      const mongoTest = await fetch('https://cluster0.ajk334b.mongodb.net', {
        method: 'HEAD',
        signal: AbortSignal.timeout(10000),
      });
      tests.push({
        name: 'MongoDB Atlas Reachability',
        success: true,
        details: 'Can reach MongoDB Atlas',
      });
    } catch (error) {
      tests.push({
        name: 'MongoDB Atlas Reachability',
        success: false,
        error: error instanceof Error ? error.message : 'Cannot reach MongoDB Atlas host',
      });
    }

    // Test general internet connectivity
    try {
      const internetTest = await fetch('https://www.google.com', {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000),
      });
      tests.push({
        name: 'Internet Connectivity',
        success: true,
        details: 'Internet connection working',
      });
    } catch (error) {
      tests.push({
        name: 'Internet Connectivity',
        success: false,
        error: error instanceof Error ? error.message : 'No internet connection',
      });
    }

    const allPassed = tests.every((test) => test.success);

    return NextResponse.json({
      success: allPassed,
      message: allPassed ? 'All network tests passed' : 'Some network tests failed',
      tests,
      recommendations: allPassed
        ? ['Network connectivity is good. The issue might be with MongoDB Atlas configuration.']
        : [
            'Check your internet connection',
            'Verify firewall settings',
            'Try connecting from a different network',
            'Contact your network administrator if on corporate network',
          ],
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Network test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
