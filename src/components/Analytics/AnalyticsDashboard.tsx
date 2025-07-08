import React, { useState, useEffect } from 'react';

// Simple Card components for the analytics dashboard
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="px-6 py-4 border-b border-gray-200">
    {children}
  </div>
);

const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h3 className={`text-lg font-medium text-gray-900 ${className}`}>
    {children}
  </h3>
);

const CardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="px-6 py-4">
    {children}
  </div>
);

interface AnalyticsData {
  conversionRates: Array<{
    conversion_source: string;
    total_sessions: number;
    conversions: number;
    conversion_rate: number;
  }>;
  popularFeatures: Array<{
    feature_name: string;
    feature_category: string;
    usage_count: number;
    unique_sessions: number;
  }>;
  demoEngagement: Array<{
    date: string;
    sessions: number;
    avg_duration: number;
    avg_page_views: number;
    conversions: number;
    conversion_rate: number;
  }>;
}

interface AnalyticsDashboardProps {
  timeframe?: '1d' | '7d' | '30d' | '90d';
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ 
  timeframe = '7d' 
}) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedTimeframe]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const [conversionRates, popularFeatures, demoEngagement] = await Promise.all([
        fetch(`/api/analytics/query?query=conversion_rates&timeframe=${selectedTimeframe}`).then(r => r.json()),
        fetch(`/api/analytics/query?query=popular_features&timeframe=${selectedTimeframe}`).then(r => r.json()),
        fetch(`/api/analytics/query?query=demo_engagement&timeframe=${selectedTimeframe}`).then(r => r.json()),
      ]);

      setData({
        conversionRates,
        popularFeatures,
        demoEngagement,
      });
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">User Engagement Analytics</h1>
        <select
          value={selectedTimeframe}
          onChange={(e) => setSelectedTimeframe(e.target.value as typeof selectedTimeframe)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="1d">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Demo Engagement Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data?.demoEngagement?.[0] && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">Total Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {data.demoEngagement.reduce((sum, day) => sum + day.sessions, 0)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">Total Conversions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {data.demoEngagement.reduce((sum, day) => sum + day.conversions, 0)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">Avg Session Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(data.demoEngagement.reduce((sum, day) => sum + day.avg_duration, 0) / data.demoEngagement.length)}s
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">Overall Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {(data.demoEngagement.reduce((sum, day) => sum + day.conversion_rate, 0) / data.demoEngagement.length).toFixed(1)}%
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Rates by Source */}
        <Card>
          <CardHeader>
            <CardTitle>Conversion Rates by Feature</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.conversionRates?.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {item.conversion_source || 'Unknown Source'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {item.conversions} of {item.total_sessions} sessions
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">
                      {item.conversion_rate.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
              {(!data?.conversionRates || data.conversionRates.length === 0) && (
                <div className="text-gray-500 text-center py-4">
                  No conversion data available for this timeframe
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Popular Features */}
        <Card>
          <CardHeader>
            <CardTitle>Most Used Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.popularFeatures?.slice(0, 10).map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {item.feature_name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {item.feature_category}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">
                      {item.usage_count} times
                    </div>
                    <div className="text-sm text-gray-600">
                      {item.unique_sessions} users
                    </div>
                  </div>
                </div>
              ))}
              {(!data?.popularFeatures || data.popularFeatures.length === 0) && (
                <div className="text-gray-500 text-center py-4">
                  No feature usage data available for this timeframe
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Engagement Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Demo Engagement Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sessions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Page Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conversions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conversion Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.demoEngagement?.map((day, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {new Date(day.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {day.sessions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {Math.round(day.avg_duration)}s
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {day.avg_page_views.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {day.conversions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        day.conversion_rate > 15 ? 'bg-green-100 text-green-800' :
                        day.conversion_rate > 5 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {day.conversion_rate.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!data?.demoEngagement || data.demoEngagement.length === 0) && (
              <div className="text-gray-500 text-center py-8">
                No engagement data available for this timeframe
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
