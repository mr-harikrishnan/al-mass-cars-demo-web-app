import React from 'react';

export const SkeletonPage = () => {
  return (
    <div className="min-h-screen bg-charcoal-base flex items-center justify-center flex-col gap-4">
      <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gold font-heading text-lg tracking-wider animate-pulse">AL-MAS Cars Loading...</p>
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="glass-card p-5 animate-pulse flex flex-col gap-4 border border-white/5">
      <div className="w-full h-44 bg-white/5 rounded-xl"></div>
      <div className="h-6 bg-white/10 rounded w-2/3"></div>
      <div className="flex justify-between">
        <div className="h-4 bg-white/5 rounded w-1/4"></div>
        <div className="h-4 bg-white/5 rounded w-1/4"></div>
      </div>
      <div className="h-10 bg-gold/10 border border-gold/10 rounded-xl mt-2"></div>
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="glass-card p-6 overflow-hidden animate-pulse border border-white/5">
      <div className="flex justify-between mb-6">
        <div className="h-8 bg-white/10 rounded w-1/4"></div>
        <div className="h-8 bg-white/5 rounded w-1/6"></div>
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4 border-b border-white/5 py-4">
            {Array.from({ length: cols }).map((_, j) => (
              <div key={j} className="h-4 bg-white/5 rounded flex-1"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const DashboardSkeleton = () => {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card p-5 border border-white/5 flex flex-col gap-3">
            <div className="h-4 bg-white/5 rounded w-1/3"></div>
            <div className="h-8 bg-white/10 rounded w-1/2"></div>
          </div>
        ))}
      </div>
      <div className="glass-card p-6 border border-white/5 h-80 bg-white/5 rounded-2xl"></div>
    </div>
  );
};
