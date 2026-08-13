import React from 'react';
import {
  GraduationCap,
  Calendar,
  BookOpen,
  Sparkles,
  Award,
  MessageSquare,
  Users,
  Radio,
  CheckCircle2,
  Search,
  School
} from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile;
  liveSessionCount: number;
  attendedCount: number;
  totalSessions: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  user,
  liveSessionCount,
  attendedCount,
  totalSessions,
}) => {
  const navItems = [
    { id: 'schedule', label: 'Schedule & Modules', icon: Calendar },
    { id: 'resources', label: 'Resource Vault', icon: BookOpen },
    { id: 'ai-studio', label: 'AI Pedagogy Studio', icon: Sparkles, badge: 'AI Powered' },
    { id: 'certificate', label: 'Attendance & Certificate', icon: Award, progress: `${attendedCount}/${totalSessions}` },
    { id: 'qna', label: 'Live Q&A & Polls', icon: MessageSquare },
    { id: 'network', label: 'Speakers & Directory', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-xl">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 px-4 py-1.5 text-xs font-medium text-indigo-100 flex flex-wrap items-center justify-between border-b border-indigo-700/50">
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
            FDP 2026
          </span>
          <span className="hidden sm:inline text-indigo-200/80">
            Center for Pedagogical Excellence & IQAC Accreditation
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-indigo-300 font-semibold">30 Contact Hours | NBA/NAAC Aligned</span>
        </div>

        <div className="flex items-center space-x-4">
          {liveSessionCount > 0 && (
            <button
              onClick={() => setActiveTab('schedule')}
              className="flex items-center space-x-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full text-xs font-bold animate-pulse hover:bg-emerald-500/30 transition-all cursor-pointer"
            >
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              <span>{liveSessionCount} Session Live Now</span>
            </button>
          )}

          <div className="flex items-center space-x-1.5 text-slate-300">
            <School className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline font-mono text-[11px] text-slate-300">{user.registrationId}</span>
          </div>
        </div>
      </div>

      {/* Main Branding Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('schedule')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-400/30">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-bold text-lg text-white leading-none tracking-tight">FDP Class Portal</h1>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono">
                  v2.6
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Faculty Development Program on AI & OBE Pedagogy</p>
            </div>
          </div>

          {/* User Profile Quick Chip */}
          <div className="hidden lg:flex items-center space-x-3 bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 py-1.5">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs ring-2 ring-indigo-400/40">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="text-left leading-tight">
              <p className="text-xs font-semibold text-slate-100">{user.name}</p>
              <p className="text-[10px] text-slate-400">{user.department}</p>
            </div>
            <div className="pl-2 border-l border-slate-700 flex items-center space-x-1 text-emerald-400 font-semibold text-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{attendedCount}/{totalSessions}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 overflow-x-auto pb-2 pt-1 no-scrollbar border-t border-slate-800/80">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>

                {item.badge && (
                  <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
                    {item.badge}
                  </span>
                )}

                {item.progress && (
                  <span className={`ml-1.5 px-1.5 py-0.2 rounded text-[10px] font-mono ${
                    attendedCount === totalSessions ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {item.progress}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
