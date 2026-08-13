import React, { useState } from 'react';
import {
  LiveQuestion,
  Poll,
  SessionFeedback,
  FDPSession,
  UserProfile
} from '../types';
import {
  MessageSquare,
  ThumbsUp,
  BarChart2,
  Star,
  Send,
  CheckCircle2,
  HelpCircle,
  MessageCircle,
  Filter,
  User
} from 'lucide-react';

interface QnAAndFeedbackProps {
  user: UserProfile;
  sessions: FDPSession[];
  questions: LiveQuestion[];
  polls: Poll[];
  feedbackList: SessionFeedback[];
  onAddQuestion: (questionText: string, sessionId: string) => void;
  onVoteQuestion: (questionId: string) => void;
  onVotePoll: (pollId: string, optionId: string) => void;
  onSubmitFeedback: (feedback: Omit<SessionFeedback, 'id' | 'timestamp'>) => void;
}

export const QnAAndFeedback: React.FC<QnAAndFeedbackProps> = ({
  user,
  sessions,
  questions,
  polls,
  feedbackList,
  onAddQuestion,
  onVoteQuestion,
  onVotePoll,
  onSubmitFeedback,
}) => {
  const [activeTab, setActiveTab] = useState<'qna' | 'polls' | 'feedback'>('qna');

  // Question Submission State
  const [selectedSessionId, setSelectedSessionId] = useState<string>(sessions[0]?.id || '');
  const [questionText, setQuestionText] = useState<string>('');

  // Feedback Form State
  const [feedbackSessionId, setFeedbackSessionId] = useState<string>(sessions[0]?.id || '');
  const [overallRating, setOverallRating] = useState<number>(5);
  const [contentScore, setContentScore] = useState<number>(5);
  const [speakerScore, setSpeakerScore] = useState<number>(5);
  const [feedbackComment, setFeedbackComment] = useState<string>('');
  const [feedbackSuccess, setFeedbackSuccess] = useState<boolean>(false);

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    onAddQuestion(questionText.trim(), selectedSessionId);
    setQuestionText('');
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const session = sessions.find((s) => s.id === feedbackSessionId);
    onSubmitFeedback({
      sessionId: feedbackSessionId,
      sessionTitle: session ? session.title : 'FDP Session',
      participantName: user.name,
      overallRating,
      contentQuality: contentScore,
      speakerEffectiveness: speakerScore,
      usefulness: overallRating,
      comments: feedbackComment,
    });
    setFeedbackComment('');
    setFeedbackSuccess(true);
    setTimeout(() => setFeedbackSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white border border-indigo-900/50 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Interactive Engagement
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight">Live Session Q&A, Polls & Feedback</h2>
          <p className="text-slate-300 text-xs max-w-xl">
            Ask questions directly to expert speakers, vote on live audience polls, and provide continuous session feedback.
          </p>
        </div>

        <div className="flex items-center space-x-1.5 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700">
          <button
            onClick={() => setActiveTab('qna')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'qna' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            Live Q&A Board
          </button>
          <button
            onClick={() => setActiveTab('polls')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'polls' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            Live Polls
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'feedback' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            Session Evaluation
          </button>
        </div>
      </div>

      {/* TAB 1: LIVE Q&A BOARD */}
      {activeTab === 'qna' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Submit Question Box */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-indigo-600" />
                <span>Ask Expert Speaker</span>
              </h3>
              <p className="text-xs text-slate-500">Post a question for live lecture Q&A discussion</p>
            </div>

            <form onSubmit={handleQuestionSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target FDP Session</label>
                <select
                  value={selectedSessionId}
                  onChange={(e) => setSelectedSessionId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-medium focus:ring-2 focus:ring-indigo-500"
                >
                  {sessions.map((s) => (
                    <option key={s.id} value={s.id}>
                      Day {s.dayNumber}: {s.title.split(':')[0]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Question</label>
                <textarea
                  rows={4}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="e.g. How can we formulate Course Outcomes for laboratory courses that align with NAAC expectations?"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={!questionText.trim()}
                className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors cursor-pointer shadow-xs disabled:opacity-50 flex items-center justify-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Question to Live Queue</span>
              </button>
            </form>
          </div>

          {/* Questions Feed */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Audience Question Stream ({questions.length})</h3>

            <div className="space-y-3">
              {questions.map((q) => (
                <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-2.5">
                      <img src={q.participantAvatar} alt={q.participantName} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{q.participantName}</p>
                        <p className="text-[10px] text-slate-400">{q.timestamp}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => onVoteQuestion(q.id)}
                      className="px-3 py-1 bg-white text-slate-700 font-bold text-xs rounded-lg border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{q.votes} Upvotes</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-800 font-medium leading-relaxed">{q.question}</p>

                  {q.isAnswered && (
                    <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                      ✓ Answered by Speaker
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE POLLS */}
      {activeTab === 'polls' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {polls.map((poll) => (
            <div key={poll.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                  {poll.sessionTitle}
                </span>
                <h3 className="font-bold text-slate-900 text-base">{poll.question}</h3>
              </div>

              <div className="space-y-2 text-xs">
                {poll.options.map((opt) => {
                  const percentage = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
                  const isUserVoted = poll.userVotedOptionId === opt.id;

                  return (
                    <button
                      key={opt.id}
                      onClick={() => onVotePoll(poll.id, opt.id)}
                      className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                        isUserVoted ? 'border-indigo-600 bg-indigo-50/50 font-bold' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <div
                        className="absolute left-0 top-0 bottom-0 bg-indigo-200/50 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                      <div className="relative z-10 flex items-center justify-between">
                        <span className="text-slate-800">{opt.text}</span>
                        <span className="font-bold text-indigo-900">{percentage}% ({opt.votes})</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <p className="text-[11px] text-slate-400 text-right">Total Audience Votes: {poll.totalVotes}</p>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: SESSION EVALUATION */}
      {activeTab === 'feedback' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Submit Session Evaluation</h3>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Session</label>
                <select
                  value={feedbackSessionId}
                  onChange={(e) => setFeedbackSessionId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-medium"
                >
                  {sessions.map((s) => (
                    <option key={s.id} value={s.id}>
                      Day {s.dayNumber}: {s.title.split(':')[0]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Overall Session Rating (1-5)</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setOverallRating(star)}
                      className="p-1.5 cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= overallRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Constructive Feedback / Comments</label>
                <textarea
                  rows={3}
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="Share key takeaways or suggestions for improvement..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors cursor-pointer shadow-xs"
              >
                Submit Feedback
              </button>

              {feedbackSuccess && (
                <p className="text-xs font-bold text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200 text-center">
                  Thank you! Your feedback has been recorded.
                </p>
              )}
            </form>
          </div>

          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Recent Participant Evaluations</h3>

            <div className="space-y-3">
              {feedbackList.map((fb) => (
                <div key={fb.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{fb.participantName}</p>
                      <p className="text-[10px] text-slate-500">{fb.sessionTitle}</p>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(fb.overallRating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 italic">"{fb.comments}"</p>
                  <p className="text-[10px] text-slate-400">{fb.timestamp}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
