
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SocialPost, PostStatus } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

const CalendarPage: React.FC = () => {
  const { posts } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getPostDate = (post: SocialPost) => {
    if (post.status === PostStatus.SCHEDULED && post.scheduledTime) {
      return new Date(post.scheduledTime);
    }
    return new Date(post.timestamp);
  };

  const getPostsForDay = (day: number) => {
    return posts.filter(post => {
      // Only show Scheduled and Published
      if (post.status !== PostStatus.SCHEDULED && post.status !== PostStatus.PUBLISHED) return false;
      
      const date = getPostDate(post);
      return date.getDate() === day &&
             date.getMonth() === currentDate.getMonth() &&
             date.getFullYear() === currentDate.getFullYear();
    }).sort((a, b) => getPostDate(a).getTime() - getPostDate(b).getTime());
  };

  const renderPlatformIcon = (platform: string) => {
      switch(platform) {
          case 'Instagram': return <div className="w-2 h-2 rounded-full bg-pink-500 shrink-0" title="Instagram" />;
          case 'LinkedIn': return <div className="w-2 h-2 rounded-full bg-blue-700 shrink-0" title="LinkedIn" />;
          case 'X': return <div className="w-2 h-2 rounded-full bg-sky-500 shrink-0" title="X" />;
          case 'Facebook': return <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0" title="Facebook" />;
          case 'YouTube': return <div className="w-2 h-2 rounded-full bg-red-600 shrink-0" title="YouTube" />;
          case 'TikTok': return <div className="w-2 h-2 rounded-full bg-teal-400 shrink-0" title="TikTok" />;
          case 'Pinterest': return <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" title="Pinterest" />;
          case 'Google Business': return <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" title="Google Business" />;
          case 'Snapchat': return <div className="w-2 h-2 rounded-full bg-yellow-400 shrink-0" title="Snapchat" />;
          case 'Reddit': return <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0" title="Reddit" />;
          case 'Threads': return <div className="w-2 h-2 rounded-full bg-slate-200 shrink-0" title="Threads" />;
          default: return <div className="w-2 h-2 rounded-full bg-slate-500 shrink-0" />;
      }
  }

  const renderCells = () => {
    const totalDays = daysInMonth(currentDate);
    const startDay = firstDayOfMonth(currentDate);
    const cells = [];

    // Empty cells for previous month
    for (let i = 0; i < startDay; i++) {
      cells.push(<div key={`empty-${i}`} className="min-h-[120px] bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/50"></div>);
    }

    // Days
    for (let day = 1; day <= totalDays; day++) {
      const dayPosts = getPostsForDay(day);
      const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

      cells.push(
        <div key={day} className={`min-h-[120px] bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-2 relative group hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors ${isToday ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}>
          <div className={`text-sm font-medium mb-2 ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>
            {day} {isToday && <span className="ml-1 text-[10px] uppercase bg-blue-600 text-white px-1.5 py-0.5 rounded">Today</span>}
          </div>
          <div className="space-y-1">
            {dayPosts.map(post => (
              <div 
                key={post.id} 
                className={`p-1.5 rounded border text-xs cursor-pointer transition-colors
                  ${post.status === PostStatus.SCHEDULED 
                    ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-900/50 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30' 
                    : 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'}
                `}
                title={`${post.platform}: ${post.content}`}
              >
                <div className="flex items-center gap-1.5">
                    {renderPlatformIcon(post.platform)}
                    <span className="truncate">{post.content}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return cells;
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
           <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Calendar</h2>
           <p className="text-slate-500 dark:text-slate-400">View your scheduled and published content.</p>
        </div>
        <div className="flex items-center gap-4 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-lg p-1 shadow-sm dark:shadow-none">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg font-bold text-slate-900 dark:text-white min-w-[140px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl overflow-hidden shadow-sm flex-1 flex flex-col">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 min-w-[800px]">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-3 text-center text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Grid - Mobile Scrollable */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-7 min-w-[800px] h-full auto-rows-fr">
            {renderCells()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
