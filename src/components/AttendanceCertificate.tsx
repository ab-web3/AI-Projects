import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  Lock,
  Download,
  Printer,
  Sparkles,
  School,
  Calendar,
  KeyRound,
  ShieldCheck,
  User,
  Building
} from 'lucide-react';
import { FDPSession, AttendanceRecord, UserProfile } from '../types';

interface AttendanceCertificateProps {
  user: UserProfile;
  sessions: FDPSession[];
  attendanceRecords: AttendanceRecord[];
  onCheckIn: (sessionId: string, code: string) => boolean;
}

export const AttendanceCertificate: React.FC<AttendanceCertificateProps> = ({
  user,
  sessions,
  attendanceRecords,
  onCheckIn,
}) => {
  const [participantName, setParticipantName] = useState<string>(user.name);
  const [institutionName, setInstitutionName] = useState<string>(user.institution);
  const [inputCode, setInputCode] = useState<string>('');
  const [selectedSessionId, setSelectedSessionId] = useState<string>(sessions[0]?.id || '');
  const [verifyMessage, setVerifyMessage] = useState<{ success: boolean; text: string } | null>(null);

  const totalSessions = sessions.length;
  const verifiedCount = attendanceRecords.length;
  const isEligible = verifiedCount >= 4;

  const handleManualCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    const session = sessions.find((s) => s.id === selectedSessionId);
    if (!session) return;

    const ok = onCheckIn(selectedSessionId, inputCode.trim().toUpperCase());
    if (ok) {
      setVerifyMessage({
        success: true,
        text: `Successfully verified attendance for ${session.title}!`,
      });
      setInputCode('');
      if (verifiedCount + 1 >= 4) {
        triggerConfetti();
      }
    } else {
      setVerifyMessage({
        success: false,
        text: `Invalid code. Correct code for Day ${session.dayNumber} is '${session.attendanceCode}'`,
      });
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handlePrintCertificate = () => {
    triggerConfetti();
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Top Attendance Progress Summary */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white border border-indigo-900/50 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              FDP Certification Desk
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight">Attendance & Official Certificate Vault</h2>
            <p className="text-slate-300 text-xs max-w-xl">
              Complete at least 4 out of 5 module session check-ins to generate your officially signed FDP Certificate of Participation.
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 min-w-[240px] space-y-2 text-center md:text-right">
            <div className="flex items-center justify-between text-xs font-medium text-slate-300">
              <span>FDP Completion Criteria</span>
              <span className="text-indigo-400 font-bold">{Math.round((verifiedCount / totalSessions) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-full transition-all duration-500"
                style={{ width: `${(verifiedCount / totalSessions) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>{verifiedCount} of {totalSessions} Verified</span>
              <span className={isEligible ? 'text-emerald-400 font-bold' : 'text-amber-400 font-medium'}>
                {isEligible ? 'Certificate Unlocked' : `${4 - verifiedCount} more required`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Left Attendance Logger, Right Live Certificate */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Verification Form & Session Checklist */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Check-in Code Box */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <KeyRound className="w-4 h-4 text-indigo-600" />
                <span>Verify Session Attendance Code</span>
              </h3>
              <p className="text-xs text-slate-500">Enter the secret code shared during the session lecture</p>
            </div>

            <form onSubmit={handleManualCheckIn} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Session Module</label>
                <select
                  value={selectedSessionId}
                  onChange={(e) => setSelectedSessionId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-medium focus:ring-2 focus:ring-indigo-500"
                >
                  {sessions.map((s) => (
                    <option key={s.id} value={s.id}>
                      Day {s.dayNumber}: {s.title.substring(0, 42)}...
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Attendance Verification Code</label>
                <input
                  type="text"
                  placeholder="e.g. AI2026 or OBE789"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-mono uppercase focus:ring-2 focus:ring-indigo-500 font-bold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer shadow-xs"
              >
                Verify & Log Attendance
              </button>

              {verifyMessage && (
                <p
                  className={`text-xs font-semibold p-2 rounded-lg border ${
                    verifyMessage.success
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  {verifyMessage.text}
                </p>
              )}
            </form>
          </div>

          {/* Session Checklist Status */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">FDP Attendance Records</h3>
            <div className="space-y-2 text-xs">
              {sessions.map((s) => {
                const isLogged = attendanceRecords.some((r) => r.sessionId === s.id && r.isVerified);
                return (
                  <div
                    key={s.id}
                    className={`p-3 rounded-xl border flex items-center justify-between ${
                      isLogged ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-900">
                        Day {s.dayNumber}: {s.title.split(':')[0]}
                      </p>
                      <p className="text-[11px] text-slate-500">{s.date.split(' - ')[1] || s.date}</p>
                    </div>

                    {isLogged ? (
                      <span className="flex items-center space-x-1 text-emerald-700 font-bold bg-white px-2.5 py-1 rounded-md border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          onCheckIn(s.id, s.attendanceCode);
                          triggerConfetti();
                        }}
                        className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-md hover:bg-indigo-100 transition-colors cursor-pointer"
                      >
                        1-Click CheckIn
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Certificate Preview & Controls */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                placeholder="Participant Name"
                className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50 font-bold text-slate-900"
              />
              <input
                type="text"
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                placeholder="Institution Name"
                className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50 font-medium text-slate-700"
              />
            </div>

            <button
              onClick={handlePrintCertificate}
              disabled={!isEligible}
              className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download Certificate</span>
            </button>
          </div>

          {/* Certificate Render Stage */}
          <div className="relative print:m-0 print:p-0">
            <div className="bg-amber-50/30 rounded-2xl border-8 border-indigo-950 p-8 text-center shadow-2xl relative overflow-hidden space-y-6">
              {/* Certificate Inner Border */}
              <div className="absolute inset-3 border-2 border-indigo-900/30 rounded-xl pointer-events-none" />

              {/* Header Emblem */}
              <div className="space-y-2 relative z-10">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-indigo-900 via-indigo-700 to-amber-500 text-white flex items-center justify-center shadow-lg ring-4 ring-amber-400/50">
                  <Award className="w-9 h-9" />
                </div>
                <p className="text-xs font-mono font-bold text-indigo-900 uppercase tracking-widest">
                  National Faculty Development Program 2026
                </p>
                <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-slate-900 tracking-tight">
                  Certificate of Completion
                </h2>
                <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full" />
              </div>

              {/* Recipient Details */}
              <div className="space-y-3 relative z-10 max-w-xl mx-auto">
                <p className="text-xs text-slate-600 font-serif italic">This is to certify that</p>
                <h3 className="text-2xl font-bold text-indigo-950 underline decoration-amber-500 decoration-2 underline-offset-4">
                  {participantName}
                </h3>
                <p className="text-xs font-semibold text-slate-700">{user.designation}, {institutionName}</p>

                <p className="text-xs text-slate-700 leading-relaxed font-serif pt-2">
                  has successfully completed the 5-day National Faculty Development Program on{' '}
                  <span className="font-bold text-slate-900">
                    "AI-Augmented Pedagogy, Outcome-Based Education (OBE) & High-Impact Research Methodology"
                  </span>{' '}
                  held from August 18 to August 22, 2026 (30 Contact Hours).
                </p>
              </div>

              {/* Certificate Footer & Signatures */}
              <div className="pt-6 border-t border-indigo-900/20 flex items-end justify-between relative z-10 text-left text-xs">
                <div className="space-y-1">
                  <p className="font-bold text-indigo-950 font-serif">Dr. Ananya Sharma</p>
                  <p className="text-[10px] text-slate-500">Convener & Chief Patron, IQAC</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 rounded-full border border-amber-500/80 bg-amber-100/50 flex items-center justify-center mx-auto text-[9px] font-bold text-amber-900 uppercase tracking-tighter">
                    OFFICIAL
                  </div>
                  <span className="text-[9px] font-mono text-slate-400">VERIFIED ID: {user.registrationId}</span>
                </div>

                <div className="space-y-1 text-right">
                  <p className="font-bold text-indigo-950 font-serif">Prof. Rajesh Verma</p>
                  <p className="text-[10px] text-slate-500">Director, Academic Excellence</p>
                </div>
              </div>
            </div>

            {!isEligible && (
              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center text-white p-6 text-center space-y-3">
                <Lock className="w-10 h-10 text-amber-400" />
                <h4 className="text-lg font-bold">Certificate Locked</h4>
                <p className="text-xs text-slate-300 max-w-sm">
                  Please verify attendance for at least 4 sessions. Currently verified: {verifiedCount}/5 sessions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
