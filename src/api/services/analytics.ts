import { 
  AnalyticsDashboardData, 
  AnalyticsOverview, 
  AnalyticsSessionMetrics, 
  AnalyticsEventMetrics, 
  FeatureUsageMetrics, 
  FunnelAnalytics, 
  ABTestResults,
  AnalyticsFilters,
  DailyMetric,
  PageMetric,
  UserTypeMetric,
  SessionDurationMetric,
  GeographicMetric,
  DeviceMetric,
  EventMetric,
  CategoryMetric,
  ConversionMetric,
  FeatureMetric,
  FeatureAdoptionMetric,
  FunnelStep,
  DropOffMetric,
  ABTestVariant
} from '../types';
import { executeQuery, getFirstRow } from '../utils/db';

export class AnalyticsService {
  constructor(private db: any) {}

  async getAnalyticsDashboard(filters?: AnalyticsFilters): Promise<AnalyticsDashboardData> {
    const [overview, sessions, events, features, funnels, abTests] = await Promise.all([
      this.getAnalyticsOverview(filters),
      this.getSessionMetrics(filters),
      this.getEventMetrics(filters),
      this.getFeatureUsage(filters),
      this.getFunnelAnalytics(filters),
      this.getABTestResults(filters)
    ]);

    return {
      overview,
      sessions,
      events,
      features,
      funnels,
      abTests
    };
  }

  async getAnalyticsOverview(filters?: AnalyticsFilters): Promise<AnalyticsOverview> {
    const whereClause = this.buildWhereClause(filters);
    
    // Get basic overview metrics
    const overviewQuery = `
      SELECT 
        COUNT(DISTINCT s.session_id) as total_sessions,
        COUNT(DISTINCT e.id) as total_events,
        AVG(s.duration) as avg_session_duration,
        AVG(CASE WHEN s.converted = 1 THEN 1.0 ELSE 0.0 END) * 100 as conversion_rate,
        AVG(CASE WHEN s.demo_mode = 1 THEN 1.0 ELSE 0.0 END) * 100 as demo_mode_usage
      FROM trk_sessions s
      LEFT JOIN trk_events e ON s.session_id = e.session_id
      ${whereClause}
    `;
    
    const overview = await getFirstRow(this.db, overviewQuery);

    // Get top landing pages
    const landingPagesQuery = `
      SELECT 
        landing_page as page,
        COUNT(*) as views,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM trk_sessions ${whereClause}), 2) as percentage
      FROM trk_sessions s
      ${whereClause ? whereClause + ' AND' : 'WHERE'} landing_page IS NOT NULL
      GROUP BY landing_page
      ORDER BY views DESC
      LIMIT 10
    `;
    
    const landingPages = await executeQuery(this.db, landingPagesQuery);

    // Get top exit pages
    const exitPagesQuery = `
      SELECT 
        exit_page as page,
        COUNT(*) as views,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM trk_sessions ${whereClause}), 2) as percentage
      FROM trk_sessions s
      ${whereClause ? whereClause + ' AND' : 'WHERE'} exit_page IS NOT NULL
      GROUP BY exit_page
      ORDER BY views DESC
      LIMIT 10
    `;
    
    const exitPages = await executeQuery(this.db, exitPagesQuery);

    // Get user type breakdown
    const userTypeQuery = `
      SELECT 
        user_type,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM trk_sessions ${whereClause}), 2) as percentage,
        AVG(CASE WHEN converted = 1 THEN 1.0 ELSE 0.0 END) * 100 as conversion_rate
      FROM trk_sessions s
      ${whereClause}
      GROUP BY user_type
      ORDER BY count DESC
    `;
    
    const userTypes = await executeQuery(this.db, userTypeQuery);

    return {
      totalSessions: Number(overview?.total_sessions || 0),
      totalEvents: Number(overview?.total_events || 0),
      averageSessionDuration: Number(overview?.avg_session_duration || 0),
      conversionRate: Number(overview?.conversion_rate || 0),
      demoModeUsage: Number(overview?.demo_mode_usage || 0),
      topLandingPages: landingPages.results.map(this.mapToPageMetric),
      topExitPages: exitPages.results.map(this.mapToPageMetric),
      userTypeBreakdown: userTypes.results.map(this.mapToUserTypeMetric)
    };
  }

  async getSessionMetrics(filters?: AnalyticsFilters): Promise<AnalyticsSessionMetrics> {
    const whereClause = this.buildWhereClause(filters);
    
    // Daily sessions
    const dailySessionsQuery = `
      SELECT 
        DATE(started_at) as date,
        COUNT(*) as count
      FROM trk_sessions s
      ${whereClause}
      GROUP BY DATE(started_at)
      ORDER BY date DESC
      LIMIT 30
    `;
    
    const dailySessions = await executeQuery(this.db, dailySessionsQuery);

    // Session duration distribution
    const durationQuery = `
      SELECT 
        CASE 
          WHEN duration < 30 THEN '0-30s'
          WHEN duration < 60 THEN '30s-1m'
          WHEN duration < 300 THEN '1m-5m'
          WHEN duration < 900 THEN '5m-15m'
          WHEN duration < 1800 THEN '15m-30m'
          ELSE '30m+'
        END as range,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM trk_sessions ${whereClause ? whereClause + ' AND' : 'WHERE'} duration IS NOT NULL), 2) as percentage
      FROM trk_sessions s
      ${whereClause ? whereClause + ' AND' : 'WHERE'} duration IS NOT NULL
      GROUP BY range
      ORDER BY 
        CASE range
          WHEN '0-30s' THEN 1
          WHEN '30s-1m' THEN 2
          WHEN '1m-5m' THEN 3
          WHEN '5m-15m' THEN 4
          WHEN '15m-30m' THEN 5
          ELSE 6
        END
    `;
    
    const sessionDuration = await executeQuery(this.db, durationQuery);

    // Bounce rate (sessions with only 1 page view)
    const bounceRateQuery = `
      SELECT 
        AVG(CASE WHEN page_views <= 1 THEN 1.0 ELSE 0.0 END) * 100 as bounce_rate
      FROM trk_sessions s
      ${whereClause}
    `;
    
    const bounceRate = await getFirstRow(this.db, bounceRateQuery);

    // Geographic data
    const geoQuery = `
      SELECT 
        country,
        COUNT(*) as sessions,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM trk_sessions ${whereClause}), 2) as percentage
      FROM trk_sessions s
      ${whereClause ? whereClause + ' AND' : 'WHERE'} country IS NOT NULL
      GROUP BY country
      ORDER BY sessions DESC
      LIMIT 10
    `;
    
    const geographic = await executeQuery(this.db, geoQuery);

    // Device data (extracted from user_agent)
    const deviceQuery = `
      SELECT 
        CASE 
          WHEN user_agent LIKE '%Mobile%' OR user_agent LIKE '%Android%' THEN 'Mobile'
          WHEN user_agent LIKE '%iPad%' OR user_agent LIKE '%Tablet%' THEN 'Tablet'
          ELSE 'Desktop'
        END as device,
        COUNT(*) as sessions,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM trk_sessions ${whereClause}), 2) as percentage
      FROM trk_sessions s
      ${whereClause ? whereClause + ' AND' : 'WHERE'} user_agent IS NOT NULL
      GROUP BY device
      ORDER BY sessions DESC
    `;
    
    const device = await executeQuery(this.db, deviceQuery);

    return {
      dailySessions: dailySessions.results.map(this.mapToDailyMetric),
      sessionDuration: sessionDuration.results.map(this.mapToSessionDurationMetric),
      bounceRate: Number(bounceRate?.bounce_rate || 0),
      returnVisitorRate: 0, // Would need additional tracking to implement
      geographicData: geographic.results.map(this.mapToGeographicMetric),
      deviceData: device.results.map(this.mapToDeviceMetric)
    };
  }

  async getEventMetrics(filters?: AnalyticsFilters): Promise<AnalyticsEventMetrics> {
    const whereClause = this.buildWhereClause(filters, 'e', 'timestamp');
    
    // Top events
    const topEventsQuery = `
      SELECT 
        event_name,
        COUNT(*) as count,
        COUNT(DISTINCT session_id) as unique_sessions,
        AVG(CASE WHEN converted = 1 THEN 1.0 ELSE 0.0 END) * 100 as conversion_rate
      FROM trk_events e
      ${whereClause}
      GROUP BY event_name
      ORDER BY count DESC
      LIMIT 20
    `;
    
    const topEvents = await executeQuery(this.db, topEventsQuery);

    // Event categories
    const categoriesQuery = `
      SELECT 
        event_category as category,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM trk_events ${whereClause}), 2) as percentage
      FROM trk_events e
      ${whereClause ? whereClause + ' AND' : 'WHERE'} event_category IS NOT NULL
      GROUP BY event_category
      ORDER BY count DESC
    `;
    
    const categories = await executeQuery(this.db, categoriesQuery);

    // Conversion events
    const conversionQuery = `
      SELECT 
        conversion_source as source,
        COUNT(*) as conversions,
        AVG(CASE WHEN converted = 1 THEN 1.0 ELSE 0.0 END) * 100 as rate
      FROM trk_events e
      ${whereClause ? whereClause + ' AND' : 'WHERE'} conversion_source IS NOT NULL
      GROUP BY conversion_source
      ORDER BY conversions DESC
    `;
    
    const conversions = await executeQuery(this.db, conversionQuery);

    // Daily events
    const dailyEventsQuery = `
      SELECT 
        DATE(timestamp) as date,
        COUNT(*) as count
      FROM trk_events e
      ${whereClause}
      GROUP BY DATE(timestamp)
      ORDER BY date DESC
      LIMIT 30
    `;
    
    const dailyEvents = await executeQuery(this.db, dailyEventsQuery);

    return {
      topEvents: topEvents.results.map(this.mapToEventMetric),
      eventCategories: categories.results.map(this.mapToCategoryMetric),
      conversionEvents: conversions.results.map(this.mapToConversionMetric),
      dailyEvents: dailyEvents.results.map(this.mapToDailyMetric)
    };
  }

  async getFeatureUsage(filters?: AnalyticsFilters): Promise<FeatureUsageMetrics> {
    const whereClause = this.buildWhereClause(filters, 'f', 'timestamp');
    
    // Top features
    const topFeaturesQuery = `
      SELECT 
        feature_name,
        COUNT(*) as usage,
        COUNT(DISTINCT session_id) as unique_users,
        ROUND(COUNT(DISTINCT session_id) * 100.0 / (
          SELECT COUNT(DISTINCT session_id) FROM trk_feature_usage ${whereClause}
        ), 2) as adoption_rate
      FROM trk_feature_usage f
      ${whereClause}
      GROUP BY feature_name
      ORDER BY usage DESC
      LIMIT 20
    `;
    
    const topFeatures = await executeQuery(this.db, topFeaturesQuery);

    // Feature adoption over time
    const adoptionQuery = `
      SELECT 
        feature_name as feature,
        DATE(timestamp) as date,
        COUNT(*) as count
      FROM trk_feature_usage f
      ${whereClause}
      GROUP BY feature_name, DATE(timestamp)
      ORDER BY feature_name, date
    `;
    
    const adoption = await executeQuery(this.db, adoptionQuery);

    // Demo mode features
    const demoFeaturesQuery = `
      SELECT 
        feature_name,
        COUNT(*) as usage,
        COUNT(DISTINCT session_id) as unique_users,
        ROUND(COUNT(DISTINCT session_id) * 100.0 / (
          SELECT COUNT(DISTINCT session_id) FROM trk_feature_usage 
          WHERE demo_mode = 1 ${filters ? 'AND ' + this.buildDateFilter(filters, 'f') : ''}
        ), 2) as adoption_rate
      FROM trk_feature_usage f
      WHERE demo_mode = 1 ${filters ? 'AND ' + this.buildDateFilter(filters, 'f') : ''}
      GROUP BY feature_name
      ORDER BY usage DESC
      LIMIT 20
    `;
    
    const demoFeatures = await executeQuery(this.db, demoFeaturesQuery);

    // Group adoption data by feature
    const featureAdoption = this.groupFeatureAdoption(adoption.results);

    return {
      topFeatures: topFeatures.results.map(this.mapToFeatureMetric),
      featureAdoption,
      demoModeFeatures: demoFeatures.results.map(this.mapToFeatureMetric)
    };
  }

  async getFunnelAnalytics(filters?: AnalyticsFilters): Promise<FunnelAnalytics> {
    const whereClause = this.buildWhereClause(filters, 'f', 'timestamp');
    
    try {
      // Funnel steps
      const funnelQuery = `
        SELECT 
          funnel_step as step,
          COUNT(DISTINCT session_id) as users,
          step_order
        FROM trk_funnels f
        ${whereClause}
        GROUP BY funnel_step, step_order
        ORDER BY step_order
      `;
      
      const funnelData = await executeQuery(this.db, funnelQuery);
      const conversionFunnel = this.calculateFunnelConversions(funnelData.results || []);

      // Drop-off points
      const dropOffQuery = `
        SELECT 
          funnel_step as step,
          COUNT(*) as drop_offs,
          ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM trk_funnels ${whereClause || 'WHERE 1=1'}), 2) as percentage
        FROM trk_funnels f
        ${whereClause}
        GROUP BY funnel_step
        ORDER BY drop_offs DESC
      `;
      
      const dropOffs = await executeQuery(this.db, dropOffQuery);

      // Skip the complex conversion time query if there's no funnel data
      let averageTimeToConvert = 0;
      if (funnelData.results && funnelData.results.length > 0) {
        // Average time to convert
        const conversionTimeQuery = `
          SELECT AVG(
            (SELECT MAX(timestamp) FROM trk_funnels f2 WHERE f2.session_id = f1.session_id) -
            (SELECT MIN(timestamp) FROM trk_funnels f3 WHERE f3.session_id = f1.session_id)
          ) as avg_time_to_convert
          FROM trk_funnels f1
          ${whereClause ? whereClause + ' AND' : 'WHERE'} f1.session_id IN (
            SELECT session_id FROM trk_sessions WHERE converted = 1
          )
        `;
        
        const conversionTime = await getFirstRow(this.db, conversionTimeQuery);
        averageTimeToConvert = Number(conversionTime?.avg_time_to_convert || 0);
      }

      return {
        conversionFunnel,
        dropOffPoints: (dropOffs.results || []).map(this.mapToDropOffMetric),
        averageTimeToConvert
      };
    } catch (error) {
      console.error('Error in getFunnelAnalytics:', error);
      // Return empty data structure on error
      return {
        conversionFunnel: [],
        dropOffPoints: [],
        averageTimeToConvert: 0
      };
    }
  }

  async getABTestResults(filters?: AnalyticsFilters): Promise<ABTestResults[]> {
    const whereClause = this.buildWhereClause(filters, 'a', 'assigned_at');
    
    const abTestQuery = `
      SELECT 
        test_name,
        variant_name,
        COUNT(*) as users,
        SUM(CASE WHEN s.converted = 1 THEN 1 ELSE 0 END) as conversions,
        AVG(CASE WHEN s.converted = 1 THEN 1.0 ELSE 0.0 END) * 100 as conversion_rate
      FROM trk_ab_tests a
      JOIN trk_sessions s ON a.session_id = s.session_id
      ${whereClause}
      GROUP BY test_name, variant_name
      ORDER BY test_name, variant_name
    `;
    
    const abTestData = await executeQuery(this.db, abTestQuery);
    
    return this.groupABTestResults(abTestData.results);
  }

  // Helper methods
  private buildWhereClause(filters?: AnalyticsFilters, alias = 's', dateField = 'started_at'): string {
    if (!filters) return '';
    
    const conditions: string[] = [];
    
    if (filters.dateRange) {
      // Convert end date to include the full day (23:59:59.999)
      const endDate = new Date(filters.dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      const endDateString = endDate.toISOString();
      
      conditions.push(`${alias}.${dateField} >= '${filters.dateRange.start}'`);
      conditions.push(`${alias}.${dateField} <= '${endDateString}'`);
    }
    
    if (filters.userType && filters.userType.length > 0) {
      const userTypes = filters.userType.map(t => `'${t}'`).join(',');
      conditions.push(`${alias}.user_type IN (${userTypes})`);
    }
    
    if (filters.demoMode !== undefined) {
      conditions.push(`${alias}.demo_mode = ${filters.demoMode ? 1 : 0}`);
    }
    
    if (filters.country && filters.country.length > 0) {
      const countries = filters.country.map(c => `'${c}'`).join(',');
      conditions.push(`${alias}.country IN (${countries})`);
    }
    
    return conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  }

  private buildDateFilter(filters: AnalyticsFilters, alias = ''): string {
    const prefix = alias ? `${alias}.` : '';
    const conditions: string[] = [];
    
    if (filters.dateRange) {
      // Convert end date to include the full day (23:59:59.999)
      const endDate = new Date(filters.dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      const endDateString = endDate.toISOString();
      
      conditions.push(`${prefix}timestamp >= '${filters.dateRange.start}'`);
      conditions.push(`${prefix}timestamp <= '${endDateString}'`);
    }
    
    return conditions.join(' AND ');
  }

  // Mapping functions
  private mapToPageMetric = (row: any): PageMetric => ({
    page: row.page,
    views: Number(row.views),
    percentage: Number(row.percentage)
  });

  private mapToUserTypeMetric = (row: any): UserTypeMetric => ({
    userType: row.user_type,
    count: Number(row.count),
    percentage: Number(row.percentage),
    conversionRate: Number(row.conversion_rate)
  });

  private mapToDailyMetric = (row: any): DailyMetric => ({
    date: row.date,
    count: Number(row.count),
    value: row.value ? Number(row.value) : undefined
  });

  private mapToSessionDurationMetric = (row: any): SessionDurationMetric => ({
    range: row.range,
    count: Number(row.count),
    percentage: Number(row.percentage)
  });

  private mapToGeographicMetric = (row: any): GeographicMetric => ({
    country: row.country,
    sessions: Number(row.sessions),
    percentage: Number(row.percentage)
  });

  private mapToDeviceMetric = (row: any): DeviceMetric => ({
    device: row.device,
    sessions: Number(row.sessions),
    percentage: Number(row.percentage)
  });

  private mapToEventMetric = (row: any): EventMetric => ({
    eventName: row.event_name,
    count: Number(row.count),
    uniqueSessions: Number(row.unique_sessions),
    conversionRate: row.conversion_rate ? Number(row.conversion_rate) : undefined
  });

  private mapToCategoryMetric = (row: any): CategoryMetric => ({
    category: row.category,
    count: Number(row.count),
    percentage: Number(row.percentage)
  });

  private mapToConversionMetric = (row: any): ConversionMetric => ({
    source: row.source,
    conversions: Number(row.conversions),
    rate: Number(row.rate)
  });

  private mapToFeatureMetric = (row: any): FeatureMetric => ({
    featureName: row.feature_name,
    usage: Number(row.usage),
    uniqueUsers: Number(row.unique_users),
    adoptionRate: Number(row.adoption_rate)
  });

  private mapToDropOffMetric = (row: any): DropOffMetric => ({
    step: row.step,
    dropOffs: Number(row.drop_offs),
    percentage: Number(row.percentage)
  });

  private calculateFunnelConversions(funnelData: any[]): FunnelStep[] {
    if (funnelData.length === 0) return [];
    
    const steps = funnelData.sort((a, b) => a.step_order - b.step_order);
    const totalUsers = steps[0]?.users || 0;
    
    return steps.map((step, index) => {
      const users = Number(step.users);
      const previousUsers = index > 0 ? Number(steps[index - 1].users) : totalUsers;
      
      return {
        step: step.step,
        users,
        conversionRate: totalUsers > 0 ? (users / totalUsers) * 100 : 0,
        dropOffRate: previousUsers > 0 ? ((previousUsers - users) / previousUsers) * 100 : 0
      };
    });
  }

  private groupFeatureAdoption(adoptionData: any[]): FeatureAdoptionMetric[] {
    const grouped: Record<string, DailyMetric[]> = adoptionData.reduce((acc, row) => {
      if (!acc[row.feature]) {
        acc[row.feature] = [];
      }
      acc[row.feature].push({
        date: row.date,
        count: Number(row.count)
      });
      return acc;
    }, {} as Record<string, DailyMetric[]>);

    return Object.entries(grouped).map(([feature, weeklyUsage]) => ({
      feature,
      weeklyUsage: weeklyUsage.sort((a: DailyMetric, b: DailyMetric) => a.date.localeCompare(b.date)),
      trend: this.calculateTrend(weeklyUsage)
    }));
  }

  private calculateTrend(data: DailyMetric[]): 'up' | 'down' | 'stable' {
    if (data.length < 2) return 'stable';
    
    const recent = data.slice(-7).reduce((sum, d) => sum + d.count, 0);
    const previous = data.slice(-14, -7).reduce((sum, d) => sum + d.count, 0);
    
    if (recent > previous * 1.1) return 'up';
    if (recent < previous * 0.9) return 'down';
    return 'stable';
  }

  private groupABTestResults(abTestData: any[]): ABTestResults[] {
    const grouped: Record<string, ABTestResults> = abTestData.reduce((acc, row) => {
      if (!acc[row.test_name]) {
        acc[row.test_name] = {
          testName: row.test_name,
          variants: [],
          conversionRates: {},
          significance: 0,
          winner: undefined
        };
      }
      
      const variant: ABTestVariant = {
        name: row.variant_name,
        users: Number(row.users),
        conversions: Number(row.conversions),
        conversionRate: Number(row.conversion_rate)
      };
      
      acc[row.test_name].variants.push(variant);
      acc[row.test_name].conversionRates[row.variant_name] = variant.conversionRate;
      
      return acc;
    }, {} as Record<string, ABTestResults>);

    // Calculate winner and significance for each test
    return Object.values(grouped).map((test) => {
      const winner = test.variants.reduce((best: ABTestVariant, current: ABTestVariant) => 
        current.conversionRate > best.conversionRate ? current : best
      );
      
      return {
        testName: test.testName,
        variants: test.variants,
        conversionRates: test.conversionRates,
        winner: winner.name,
        significance: this.calculateSignificance(test.variants)
      };
    });
  }

  private calculateSignificance(variants: ABTestVariant[]): number {
    // Simplified significance calculation
    // In a real implementation, you'd use proper statistical methods
    if (variants.length < 2) return 0;
    
    const [control, treatment] = variants;
    const diff = Math.abs(treatment.conversionRate - control.conversionRate);
    const avgRate = (treatment.conversionRate + control.conversionRate) / 2;
    
    return avgRate > 0 ? (diff / avgRate) * 100 : 0;
  }
}
