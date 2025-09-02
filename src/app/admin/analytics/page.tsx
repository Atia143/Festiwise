'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface AnalyticsData {
  total: number;
  lastHour: number;
  uniqueVisitors: number;
  topPages: [string, number][];
  topReferrers: [string, number][];
  lastUpdated: string;
}

export default function AdminAnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setError('No access token provided');
      setLoading(false);
      return;
    }
    
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/analytics/stats?token=${token}`);
        
        if (!response.ok) {
          if (response.status === 401) {
            setError('Unauthorized access. Invalid token.');
            setAuthorized(false);
          } else {
            setError(`Failed to fetch analytics: ${response.statusText}`);
          }
          setLoading(false);
          return;
        }
        
        const result = await response.json();
        setData(result);
        setAuthorized(true);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch analytics data');
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Set up polling to refresh data every 30 seconds
    const intervalId = setInterval(fetchData, 30000);
    
    return () => clearInterval(intervalId);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error || !authorized) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-lg w-full">
          <p className="text-red-700">{error || 'Unauthorized access'}</p>
        </div>
      </div>
    );
  }
  
  if (!data) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">FestiWise Analytics Dashboard</h1>
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600">Total Visitors</p>
            <p className="text-3xl font-bold">{data.total}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600">Visitors (Last Hour)</p>
            <p className="text-3xl font-bold">{data.lastHour}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600">Unique Visitors</p>
            <p className="text-3xl font-bold">{data.uniqueVisitors}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Top Pages</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Page</th>
                  <th className="text-right py-2">Views</th>
                </tr>
              </thead>
              <tbody>
                {data.topPages.map(([page, views], index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 text-sm">{page}</td>
                    <td className="py-2 text-right">{views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Top Referrers</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Source</th>
                  <th className="text-right py-2">Visits</th>
                </tr>
              </thead>
              <tbody>
                {data.topReferrers.map(([referrer, visits], index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 text-sm">{referrer || 'Direct'}</td>
                    <td className="py-2 text-right">{visits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-sm text-gray-500 text-right">
        Last updated: {new Date(data.lastUpdated).toLocaleString()}
      </div>
    </div>
  );
}
