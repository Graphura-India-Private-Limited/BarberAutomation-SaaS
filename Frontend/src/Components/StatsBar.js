
import React from 'react';
import { StatCard } from './Atoms';

export default function StatsBar({ customers }) {
  const totalPts    = customers.reduce((a, c) => a + c.points, 0);
  const paidMembers = customers.filter((c) => c.plan !== 'Basic').length;
  const totalVisits = customers.reduce((a, c) => a + c.visits, 0);
  const goldMembers = customers.filter((c) => c.plan === 'Gold').length;

  return (
    <div className="grid grid-cols-4 gap-2 mb-4">
      <StatCard value={totalPts.toLocaleString()} label="Total Points"  color="text-[#5C3D2E]"  />
      <StatCard value={paidMembers}               label="Paid Members"  color="text-[#7A4F3A]"  />
      <StatCard value={totalVisits}               label="Total Visits"  color="text-[#A0785A]"  />
      <StatCard value={goldMembers}               label="Gold Members"  color="text-[#C8896A]"  />
    </div>
  );
}