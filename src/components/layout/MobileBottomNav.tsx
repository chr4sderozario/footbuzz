/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Mobile Bottom Navigation strictly adhering to Thumb-Zone specs
 */

import React from 'react';
import { Home, Calendar, Search, History, User } from 'lucide-react';
import { NavTab, useApp } from '../../context/AppContext';

export const MobileBottomNav: React.FC = () => {
  const { currentTab, navigateTo, setAuthModalOpen, user } = useApp();

  const tabs: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'matches', label: 'Matches', icon: Calendar },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'history', label: 'History', icon: History },
    { id: 'account', label: 'Profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 px-2 py-1 shadow-lg">
      <div className="grid grid-cols-5 items-center h-14 max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive =
            currentTab === tab.id ||
            (tab.id === 'matches' && currentTab === 'match-centre') ||
            (tab.id === 'history' && currentTab === 'concept-detail');

          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'account' && !user) {
                  setAuthModalOpen(true);
                } else {
                  navigateTo(tab.id);
                }
              }}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
                isActive ? 'text-[#009270]' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? 'font-black' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
