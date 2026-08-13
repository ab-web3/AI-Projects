import React, { useState } from 'react';
import {
  FDPSession,
  AttendanceRecord,
  Speaker
} from '../types';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  CheckCircle2,
  Lock,
  Download,
  FileText,
  User,
  Search,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Info,
  KeyRound,
  BookOpen
} from 'lucide-react';

interface ScheduleViewProps {
  sessions: FDPSession[];
  speakers: Speaker[];
  attendanceRecords: AttendanceRecord[];
  onCheckIn: (sessionId: string, code: string) => boolean;
  onOpenAiStudioForTopic: (topic: string) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  sessions,
  speakers,
  attendanceRecords,
  onCheckIn,
  onOpenAiStudioForTopic,
}) => {
  const [selectedDay, setSelectedDay] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSessionModal, setSelectedSessionModal] = useState<FDPSession | null>(null);
  
  // Attendance Code input state mapped by sessionId
  const [inputCodes, setInputCodes] = useState<Record<string, string>>({});
  const [checkInFeedback, setCheckInFeedback] = useState<Record<string, { success: boolean; message: string }>>({});

  const days = [1, 2, 3, 4, 5];

  const filteredSessions = sessions.filter((session) => {
    const matchesDay = selectedDay === 'all' || session.dayNumber === selectedDay;
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    const matchesSearch =
      searchQuery === '' ||
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.speakerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesDay && matchesStatus && matchesSearch;
  });

  const isAttended = (sessionId: string) => {
    return attendanceRecords.some((rec) => rec.sessionId === sessionId && rec.isVerified);
  };

  const handleCheckInSubmit = (sessionId: string, sessionCode: string) => {
    const enteredCode = inputCodes[sessionId] || '';
    if (!enteredCode.trim()) {
      setCheckInFeedback((prev) => ({
        ...prev,
        [sessionId]: { success: false, message: 'Please enter the session code.' },
      }));
      return;
    }

    const isCorrect = onCheckIn(sessionId, enteredCode.trim());
    if (isCorrect) {
      setCheckInFeedback((prev) => ({
        ...prev,
        [sessionId]: { success: true, message: 'Attendance Verified Successfully!' },
      }));
    } else {
      setCheckInFeedback((prev) => ({
        ...prev,
        [sessionId]: { success: false, message: `Invalid code. Hint: Try code '${sessionCode}'` },
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & FDP Summary Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white border border-indigo-900/50 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>National Faculty Development Program 2026</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              AI-Augmented Pedagogy, OBE Frameworks & High-Impact Research
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Explore 5 core modules led by senior academic leaders. Attend live lectures, check in your attendance codes, access session slide decks, and generate lesson plans using AI tools.
            </p>
          </div>

          <div className="bg-slate-800/80 backdrop-blur border border-slate-700/80 rounded-xl p-4 min-w-[240px] space-y-3 text-center md:text-right">
            <div>
              <p className="text-xs text-slate-400 font-medium">Verified Progress</p>
              <div className="flex items-center justify-center md:justify-end space-x-2 mt-0.5">
                <span className="text-2xl font-bold text-emerald-400">
                  {attendanceRecords.length} / {sessions.length}
                </span>
                <span className="text-xs text-slate-400">Sessions</span>
              </div>
            </div>

            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-full transition-all duration-500"
                style={{ width: `${(attendanceRecords.length / sessions.length) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              {attendanceRecords.length >= 4 ? '🎉 Eligible for Certificate!' : 'Check in 4+ sessions to unlock certificate.'}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Day Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setSelectedDay('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedDay === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Days (5)
            </button>
            {days.map((dayNum) => (
              <button
                key={dayNum}
                onClick={() => setSelectedDay(dayNum)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedDay === dayNum
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Day {dayNum}
              </button>
            ))}
          </div>

          {/* Status Filter & Search */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-slate-100 rounded-lg p-1 text-xs">
              {['all', 'live', 'upcoming', 'completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-2.5 py-1 rounded-md font-medium capitalize transition-all cursor-pointer ${
                    statusFilter === status
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {status === 'all' ? 'All Status' : status}
                </button>
              ))}
            </div>

            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search module, speaker, or topic..."
                className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Session Cards List */}
      <div className="space-y-4">
        {filteredSessions.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200 space-y-3">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-slate-700 font-bold text-sm">No FDP sessions match your filters</p>
            <p className="text-slate-500 text-xs">Try selecting 'All Days' or clearing your search term.</p>
          </div>
        ) : (
          filteredSessions.map((session) => {
            const attended = isAttended(session.id);
            const speaker = speakers.find((s) => s.id === session.speakerId);

            return (
              <div
                key={session.id}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md ${
                  session.status === 'live'
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="p-5 sm:p-6 space-y-4">
                  {/* Top Header info */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                        {session.date.split(' - ')[0]}
                      </span>
                      <div className="flex items-center text-xs text-slate-500 font-medium space-x-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{session.time}</span>
                      </div>
                      <div className="flex items-center text-xs text-slate-500 font-medium space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{session.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {session.status === 'live' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
                          LIVE SESSION
                        </span>
                      )}
                      {session.status === 'upcoming' && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          Upcoming
                        </span>
                      )}
                      {session.status === 'completed' && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                          Completed
                        </span>
                      )}

                      {attended ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                          Attended
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                          <Lock className="w-3 h-3 mr-1 text-amber-600" />
                          Pending Check-in
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Session Title & Subtitle */}
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                      {session.title}
                    </h3>
                    <p className="text-xs text-indigo-700 font-medium">{session.subtitle}</p>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-1">
                      {session.description}
                    </p>
                  </div>

                  {/* Speaker Info & Tags */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-100">
                    <div className="flex items-center space-x-3">
                      <img
                        src={session.speakerAvatar}
                        alt={session.speakerName}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-100"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900">{session.speakerName}</p>
                        <p className="text-[11px] text-slate-500">{session.speakerRole}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {session.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Bar (Join Link, Check-in Code Box, AI Plan Tool) */}
                  <div className="bg-slate-50 rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 border border-slate-200/80">
                    <div className="flex flex-wrap items-center gap-2">
                      {session.meetingUrl && (
                        <a
                          href={session.meetingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Join Session</span>
                          <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                        </a>
                      )}

                      <button
                        onClick={() => setSelectedSessionModal(session)}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Syllabus & Agenda</span>
                      </button>

                      <button
                        onClick={() => onOpenAiStudioForTopic(session.title)}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>AI Lesson Plan</span>
                      </button>
                    </div>

                    {/* Attendance Verification Box */}
                    <div className="flex items-center space-x-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200">
                      {attended ? (
                        <div className="text-emerald-700 font-bold text-xs flex items-center space-x-1 bg-emerald-100/80 px-3 py-1.5 rounded-lg border border-emerald-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Attendance Recorded</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-start md:items-end">
                          <div className="flex items-center space-x-1.5">
                            <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                            <input
                              type="text"
                              placeholder={`Code e.g. ${session.attendanceCode}`}
                              value={inputCodes[session.id] || ''}
                              onChange={(e) =>
                                setInputCodes({ ...inputCodes, [session.id]: e.target.value.toUpperCase() })
                              }
                              className="w-28 text-xs uppercase px-2.5 py-1 border border-slate-300 rounded-md font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                            />
                            <button
                              onClick={() => handleCheckInSubmit(session.id, session.attendanceCode)}
                              className="px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-md hover:bg-indigo-600 transition-colors cursor-pointer"
                            >
                              Check-In
                            </button>
                          </div>
                          {checkInFeedback[session.id] && (
                            <p
                              className={`text-[11px] font-semibold mt-1 ${
                                checkInFeedback[session.id].success ? 'text-emerald-600' : 'text-rose-600'
                              }`}
                            >
                              {checkInFeedback[session.id].message}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detailed Session Modal */}
      {selectedSessionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 space-y-6 p-6">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="px-2.5 py-1 rounded bg-indigo-100 text-indigo-800 text-xs font-bold">
                  {selectedSessionModal.date}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">{selectedSessionModal.title}</h3>
                <p className="text-xs text-indigo-600 font-semibold">{selectedSessionModal.subtitle}</p>
              </div>
              <button
                onClick={() => setSelectedSessionModal(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Session Abstract</h4>
                <p>{selectedSessionModal.description}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2">Module Timeline & Agenda</h4>
                <ul className="space-y-2 border-l-2 border-indigo-200 pl-4">
                  {selectedSessionModal.agendaItems.map((item, idx) => (
                    <li key={idx} className="relative">
                      <span className="font-bold text-indigo-600 mr-2">Topic {idx + 1}:</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2">Expected Learning Outcomes</h4>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5">
                  {selectedSessionModal.keyTakeaways.map((takeaway, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{takeaway}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedSessionModal.speakerAvatar}
                    alt={selectedSessionModal.speakerName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold text-slate-900">{selectedSessionModal.speakerName}</p>
                    <p className="text-[11px] text-slate-500">{selectedSessionModal.speakerRole}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      onOpenAiStudioForTopic(selectedSessionModal.title);
                      setSelectedSessionModal(null);
                    }}
                    className="px-3 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors cursor-pointer"
                  >
                    Generate AI Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
