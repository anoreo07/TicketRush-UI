'use client';

import React from 'react';
import { AdminHeader } from './components/AdminHeader';
import { FeaturedEventBanner } from './components/FeaturedEventBanner';
import { KPIStats } from './components/KPIStats';
import { DashboardCharts } from './components/DashboardCharts';
import { RecentActivity } from './components/RecentActivity';

export default function AdminDashboard() {
  return (
    <div className="flex flex-col flex-1">
      <AdminHeader title="Tổng quan hệ thống" />
      
      <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Banner */}
        <FeaturedEventBanner />

        {/* KPIs */}
        <KPIStats />

        {/* Charts Section */}
        <DashboardCharts />

        {/* Recent Transactions */}
        <RecentActivity />
      </div>
    </div>
  );
}
