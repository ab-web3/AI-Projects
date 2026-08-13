import React, { useState } from 'react';
import { Header } from './components/Header';
import { ScheduleView } from './components/ScheduleView';
import { ResourceVault } from './components/ResourceVault';
import { AiStudioTool } from './components/AiStudioTool';
import { AttendanceCertificate } from './components/AttendanceCertificate';
import { QnAAndFeedback } from './components/QnAAndFeedback';
import { SpeakersAndParticipants } from './components/SpeakersAndParticipants';

import {
  INITIAL_USER,
  INITIAL_SESSIONS,
  INITIAL_RESOURCES,
  INITIAL_SPEAKERS,
  INITIAL_PARTICIPANTS,
  INITIAL_QUESTIONS,
  INITIAL_POLLS,
  INITIAL_FEEDBACK,
  FDP_INFO
} from './data/fdpData';
import { AttendanceRecord, LiveQuestion, Poll, SessionFeedback } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('schedule');
  const [user, setUser] = useState(INITIAL_USER);
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const [resources, setResources] = useState(INITIAL_RESOURCES);
  const [speakers, setSpeakers] = useState(INITIAL_SPEAKERS);
  const [participants, setParticipants] = useState(INITIAL_PARTICIPANTS);
  const [questions, setQuestions] = useState<LiveQuestion[]>(INITIAL_QUESTIONS);
  const [polls, setPolls] = useState<Poll[]>(INITIAL_POLLS);
  const [feedbackList, setFeedbackList] = useState<SessionFeedback[]>(INITIAL_FEEDBACK);
  
  // Default 1 session already checked in for demo
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([
    {
      sessionId: "session-1",
      sessionTitle: INITIAL_SESSIONS[0].title,
      dayNumber: 1,
      date: INITIAL_SESSIONS[0].date,
      checkedInAt: "Aug 18, 2026, 10:15 AM",
      isVerified: true
    }
  ]);

  const [aiInitialTopic, setAiInitialTopic] = useState<string>('');

  const liveSessionCount = sessions.filter((s) => s.status === 'live').length;

  const handleCheckIn = (sessionId: string, code: string): boolean => {
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) return false;

    if (code.trim().toUpperCase() === session.attendanceCode.toUpperCase()) {
      const alreadyChecked = attendanceRecords.some((r) => r.sessionId === sessionId);
      if (!alreadyChecked) {
        const newRecord: AttendanceRecord = {
          sessionId,
          sessionTitle: session.title,
          dayNumber: session.dayNumber,
          date: session.date,
          checkedInAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isVerified: true
        };
        setAttendanceRecords((prev) => [...prev, newRecord]);
      }
      return true;
    }
    return false;
  };

  const handleOpenAiStudioForTopic = (topicTitle: string) => {
    setAiInitialTopic(topicTitle);
    setActiveTab('ai-studio');
  };

  const handleAddQuestion = (questionText: string, sessionId: string) => {
    const newQ: LiveQuestion = {
      id: `q-${Date.now()}`,
      sessionId,
      participantName: user.name,
      participantAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
      question: questionText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      votes: 1,
      isAnswered: false
    };
    setQuestions((prev) => [newQ, ...prev]);
  };

  const handleVoteQuestion = (questionId: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, votes: q.votes + 1 } : q))
    );
  };

  const handleVotePoll = (pollId: string, optionId: string) => {
    setPolls((prev) =>
      prev.map((poll) => {
        if (poll.id !== pollId) return poll;
        const updatedOptions = poll.options.map((opt) =>
          opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
        );
        return {
          ...poll,
          options: updatedOptions,
          totalVotes: poll.totalVotes + 1,
          userVotedOptionId: optionId
        };
      })
    );
  };

  const handleSubmitFeedback = (feedbackData: Omit<SessionFeedback, 'id' | 'timestamp'>) => {
    const newFb: SessionFeedback = {
      ...feedbackData,
      id: `fb-${Date.now()}`,
      timestamp: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
    };
    setFeedbackList((prev) => [newFb, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 antialiased selection:bg-indigo-500 selection:text-white pb-16">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        liveSessionCount={liveSessionCount}
        attendedCount={attendanceRecords.length}
        totalSessions={sessions.length}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'schedule' && (
          <ScheduleView
            sessions={sessions}
            speakers={speakers}
            attendanceRecords={attendanceRecords}
            onCheckIn={handleCheckIn}
            onOpenAiStudioForTopic={handleOpenAiStudioForTopic}
          />
        )}

        {activeTab === 'resources' && <ResourceVault resources={resources} />}

        {activeTab === 'ai-studio' && <AiStudioTool initialTopic={aiInitialTopic} />}

        {activeTab === 'certificate' && (
          <AttendanceCertificate
            user={user}
            sessions={sessions}
            attendanceRecords={attendanceRecords}
            onCheckIn={handleCheckIn}
          />
        )}

        {activeTab === 'qna' && (
          <QnAAndFeedback
            user={user}
            sessions={sessions}
            questions={questions}
            polls={polls}
            feedbackList={feedbackList}
            onAddQuestion={handleAddQuestion}
            onVoteQuestion={handleVoteQuestion}
            onVotePoll={handleVotePoll}
            onSubmitFeedback={handleSubmitFeedback}
          />
        )}

        {activeTab === 'network' && (
          <SpeakersAndParticipants speakers={speakers} participants={participants} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 space-y-1">
        <p className="font-semibold text-slate-700">{FDP_INFO.title} • {FDP_INFO.organizer}</p>
        <p>{FDP_INFO.accreditationNote} | Registration ID: {user.registrationId}</p>
      </footer>
    </div>
  );
}
