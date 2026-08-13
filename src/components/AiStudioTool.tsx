import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  FileText,
  HelpCircle,
  Copy,
  Check,
  Download,
  Send,
  Loader2,
  ListOrdered,
  Award,
  Layers,
  Brain,
  RefreshCw,
  Clock,
  UserCheck
} from 'lucide-react';
import { LessonPlanResult, QuizQuestion } from '../types';

interface AiStudioToolProps {
  initialTopic?: string;
}

export const AiStudioTool: React.FC<AiStudioToolProps> = ({ initialTopic = '' }) => {
  const [activeSubTab, setActiveSubTab] = useState<'lesson' | 'quiz' | 'advisor'>('lesson');

  // Lesson Plan Form State
  const [subject, setSubject] = useState<string>('Computer Science & Engineering');
  const [topic, setTopic] = useState<string>(initialTopic || 'Outcome-Based Course Design & Active Learning');
  const [audience, setAudience] = useState<string>('Undergraduate (B.Tech / B.Sc)');
  const [duration, setDuration] = useState<string>('60 minutes');
  const [bloomLevel, setBloomLevel] = useState<string>('Apply & Analyze');
  const [notes, setNotes] = useState<string>('Incorporate low-stakes digital polling and Think-Pair-Share active learning.');

  const [lessonLoading, setLessonLoading] = useState<boolean>(false);
  const [lessonPlanResult, setLessonPlanResult] = useState<LessonPlanResult | null>(null);
  const [copiedLesson, setCopiedLesson] = useState<boolean>(false);

  // Quiz Generator State
  const [quizTopic, setQuizTopic] = useState<string>(initialTopic || 'AI in Pedagogy & Outcome-Based Education');
  const [quizLoading, setQuizLoading] = useState<boolean>(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  // Advisor Chat State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; timestamp: string }>>([
    {
      sender: 'ai',
      text: 'Hello Professor! I am your AI FDP Pedagogical Advisor. How can I assist you today? Ask me about NBA/NAAC CO-PO attainment, writing grant proposals, structuring flipped classrooms, or drafting syllabus rubrics.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [chatLoading, setChatLoading] = useState<boolean>(false);

  useEffect(() => {
    if (initialTopic) {
      setTopic(initialTopic);
      setQuizTopic(initialTopic);
    }
  }, [initialTopic]);

  // Generate Lesson Plan Handler
  const handleGenerateLessonPlan = async () => {
    setLessonLoading(true);
    try {
      const response = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'lesson-plan',
          extraData: {
            subject,
            topic,
            targetAudience: audience,
            durationMinutes: duration,
            bloomLevel,
            additionalNotes: notes
          }
        })
      });

      const data = await response.json();
      if (data.result) {
        setLessonPlanResult(data.result);
      }
    } catch (err) {
      console.error('Error generating lesson plan:', err);
    } finally {
      setLessonLoading(false);
    }
  };

  // Generate Quiz Handler
  const handleGenerateQuiz = async () => {
    setQuizLoading(true);
    setShowResults(false);
    setSelectedAnswers({});
    try {
      const response = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'quiz-maker',
          extraData: {
            topic: quizTopic,
            questionCount: 5
          }
        })
      });

      const data = await response.json();
      if (data.questions && data.questions.length > 0) {
        setQuizQuestions(data.questions);
      }
    } catch (err) {
      console.error('Error generating quiz:', err);
    } finally {
      setQuizLoading(false);
    }
  };

  // Send Chat Message Handler
  const handleSendChatMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userText = chatInput.trim();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText, timestamp: time }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'qa-bot',
          prompt: userText
        })
      });

      const data = await response.json();
      const aiAnswer = data.answer || 'I am sorry, I could not generate an answer. Please try asking again.';
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: aiAnswer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error('Error sending chat message:', err);
    } finally {
      setChatLoading(false);
    }
  };

  const handleCopyLesson = () => {
    if (!lessonPlanResult) return;
    const text = `LESSON PLAN: ${lessonPlanResult.title}\nSubject: ${lessonPlanResult.subject}\nAudience: ${lessonPlanResult.targetAudience}\nDuration: ${lessonPlanResult.duration}\nBloom's Level: ${lessonPlanResult.bloomLevel}\n\nLEARNING OBJECTIVES:\n${lessonPlanResult.learningObjectives.map(o => '• ' + o).join('\n')}\n\nTIMELINE:\n${lessonPlanResult.timeline.map(t => `${t.phase} (${t.duration})\nTeacher: ${t.teacherAction}\nStudent: ${t.studentAction}\nTool: ${t.toolOrMethod}`).join('\n\n')}`;
    navigator.clipboard.writeText(text);
    setCopiedLesson(true);
    setTimeout(() => setCopiedLesson(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Studio Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white border border-indigo-700/50 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Gemini 3.6 Flash Pedagogical Assistant</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">AI Pedagogy & Course Engineering Studio</h2>
            <p className="text-slate-300 text-xs leading-relaxed">
              Generate Bloom's taxonomy lesson plans, interactive quiz MCQs, and rubric matrices in seconds. Designed specifically for university educators and FDP participants.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveSubTab('lesson')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeSubTab === 'lesson' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Lesson Plan & Rubric
            </button>
            <button
              onClick={() => setActiveSubTab('quiz')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeSubTab === 'quiz' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Quiz & MCQ Maker
            </button>
            <button
              onClick={() => setActiveSubTab('advisor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeSubTab === 'advisor' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              FDP AI Tutor
            </button>
          </div>
        </div>
      </div>

      {/* SUB TAB 1: LESSON PLAN & RUBRIC GENERATOR */}
      {activeSubTab === 'lesson' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Controls Form */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <span>Course & Topic Parameters</span>
              </h3>
              <p className="text-xs text-slate-500">Customize the teaching context for AI plan generation</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject / Discipline</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Module / Lecture Topic</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Prompt Engineering or CO-PO Attainment"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Audience</label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-medium"
                  >
                    <option>Undergraduate (B.Tech / B.Sc)</option>
                    <option>Postgraduate (M.Tech / M.Sc)</option>
                    <option>Doctoral / Research Scholars</option>
                    <option>Faculty / FDP Participants</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Session Duration</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-medium"
                  >
                    <option>45 minutes</option>
                    <option>60 minutes</option>
                    <option>90 minutes</option>
                    <option>2 Hours (Workshop)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Bloom's Level</label>
                <select
                  value={bloomLevel}
                  onChange={(e) => setBloomLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-medium"
                >
                  <option>Remember & Understand (Foundational)</option>
                  <option>Apply & Analyze (Core Pedagogical)</option>
                  <option>Evaluate & Create (High-Order Synthesis)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Additional Guidance / Constraints</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-medium"
                />
              </div>

              <button
                onClick={handleGenerateLessonPlan}
                disabled={lessonLoading}
                className="w-full py-2.5 px-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-md shadow-indigo-600/20 disabled:opacity-50"
              >
                {lessonLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Architecting Bloom Plan...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Generate Lesson Plan & Rubric</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Result Viewer */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            {!lessonPlanResult && !lessonLoading && (
              <div className="py-16 text-center space-y-3">
                <Brain className="w-12 h-12 text-indigo-300 mx-auto" />
                <h4 className="font-bold text-slate-800 text-base">Ready to Generate Your Lesson Plan</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click 'Generate Lesson Plan & Rubric' to construct a structured higher-education teaching module with objectives, step-by-step timeline, and grading rubric.
                </p>
              </div>
            )}

            {lessonLoading && (
              <div className="py-20 text-center space-y-4">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto" />
                <p className="text-sm font-bold text-slate-800">Synthesizing Course Outcome Mapping with Gemini 3.6...</p>
                <p className="text-xs text-slate-500">Creating time breakdowns, teacher/student actions, and analytic rubrics.</p>
              </div>
            )}

            {lessonPlanResult && !lessonLoading && (
              <div className="space-y-6 text-xs text-slate-700">
                {/* Result Top Action Bar */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold text-[11px]">
                      {lessonPlanResult.bloomLevel}
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900 mt-1">{lessonPlanResult.title}</h3>
                    <p className="text-xs text-slate-500">
                      Subject: {lessonPlanResult.subject} • {lessonPlanResult.duration} • {lessonPlanResult.targetAudience}
                    </p>
                  </div>

                  <button
                    onClick={handleCopyLesson}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors flex items-center space-x-1.5 cursor-pointer text-xs"
                  >
                    {copiedLesson ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLesson ? 'Copied!' : 'Copy Plan'}</span>
                  </button>
                </div>

                {/* Course Learning Objectives */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-1.5 text-indigo-700">
                    <Award className="w-4 h-4" />
                    <span>Learning Outcomes (CO Alignment)</span>
                  </h4>
                  <ul className="space-y-1.5 bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-100">
                    {lessonPlanResult.learningObjectives.map((obj, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="font-bold text-indigo-600">•</span>
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Activity Timeline Table */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-1.5 text-indigo-700">
                    <Clock className="w-4 h-4" />
                    <span>Step-by-Step Activity Timeline</span>
                  </h4>
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-900 text-white text-[11px] font-bold">
                          <th className="p-2.5">Phase & Duration</th>
                          <th className="p-2.5">Teacher Action</th>
                          <th className="p-2.5">Student Action</th>
                          <th className="p-2.5">Tool / Method</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-[11px]">
                        {lessonPlanResult.timeline.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/80">
                            <td className="p-2.5 font-bold text-slate-900 bg-slate-50/50">
                              {row.phase}
                              <div className="text-[10px] text-indigo-600 font-normal">{row.duration}</div>
                            </td>
                            <td className="p-2.5 leading-snug">{row.teacherAction}</td>
                            <td className="p-2.5 leading-snug">{row.studentAction}</td>
                            <td className="p-2.5 font-semibold text-slate-700">{row.toolOrMethod}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Analytic Rubric Matrix */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-1.5 text-indigo-700">
                    <Layers className="w-4 h-4" />
                    <span>4-Tier Analytic Evaluation Rubric</span>
                  </h4>
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-800 text-[11px] font-bold border-b border-slate-200">
                          <th className="p-2.5">Criteria</th>
                          <th className="p-2.5 text-emerald-700">Exemplary (4 pts)</th>
                          <th className="p-2.5 text-blue-700">Proficient (3 pts)</th>
                          <th className="p-2.5 text-amber-700">Developing (1-2 pts)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-[11px]">
                        {lessonPlanResult.assessmentRubric.map((rubric, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/80">
                            <td className="p-2.5 font-bold text-slate-900 bg-slate-50/50">{rubric.criteria}</td>
                            <td className="p-2.5 leading-snug">{rubric.exemplary}</td>
                            <td className="p-2.5 leading-snug">{rubric.proficient}</td>
                            <td className="p-2.5 leading-snug">{rubric.developing}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB TAB 2: QUIZ & MCQ MAKER */}
      {activeSubTab === 'quiz' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">FDP Automated Quiz & MCQ Generator</h3>
              <p className="text-xs text-slate-500">Generate 5 conceptual questions with instant feedback explanations</p>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={quizTopic}
                onChange={(e) => setQuizTopic(e.target.value)}
                placeholder="Topic e.g. Outcome-Based Education"
                className="text-xs px-3 py-2 border border-slate-200 rounded-lg w-64 bg-slate-50 focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleGenerateQuiz}
                disabled={quizLoading}
                className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {quizLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Generate Quiz</span>
              </button>
            </div>
          </div>

          {quizLoading && (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-700">Generating 5 conceptual MCQs on "{quizTopic}"...</p>
            </div>
          )}

          {quizQuestions.length > 0 && !quizLoading && (
            <div className="space-y-6">
              {quizQuestions.map((q, qIdx) => {
                const userChoice = selectedAnswers[qIdx];
                return (
                  <div key={qIdx} className="p-4 rounded-xl border border-slate-200 space-y-3 bg-slate-50/50">
                    <p className="font-bold text-slate-900 text-sm">
                      <span className="text-indigo-600 mr-2">Q{qIdx + 1}.</span> {q.question}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = userChoice === optIdx;
                        const isCorrect = optIdx === q.correctAnswerIndex;

                        let btnStyle = 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100';
                        if (showResults) {
                          if (isCorrect) btnStyle = 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold';
                          else if (isSelected && !isCorrect) btnStyle = 'bg-rose-100 text-rose-900 border-rose-400 font-bold';
                        } else if (isSelected) {
                          btnStyle = 'bg-indigo-600 text-white border-indigo-600 font-bold';
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => setSelectedAnswers({ ...selectedAnswers, [qIdx]: optIdx })}
                            className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${btnStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {showResults && (
                      <div className="p-3 bg-indigo-50/80 rounded-lg border border-indigo-100 text-xs text-indigo-950 space-y-1">
                        <p className="font-bold text-indigo-900">Explanation:</p>
                        <p>{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={() => setShowResults(true)}
                  className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-indigo-600 transition-colors cursor-pointer"
                >
                  Submit & Check Score
                </button>

                {showResults && (
                  <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    Score:{' '}
                    {
                      Object.entries(selectedAnswers).filter(
                        ([qIdx, ansIdx]) => quizQuestions[Number(qIdx)]?.correctAnswerIndex === ansIdx
                      ).length
                    }{' '}
                    / {quizQuestions.length} Correct
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB TAB 3: ADVISOR CHATBOT */}
      {activeSubTab === 'advisor' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[580px]">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h3 className="font-bold text-sm">FDP Academic Advisor Chatbot</h3>
                <p className="text-[10px] text-slate-300">Ask about NAAC/NBA criteria, teaching tools, or research grants</p>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
              Online
            </span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {chatLoading && (
              <div className="flex items-center space-x-2 text-xs text-slate-500 p-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span>Advisor is composing response...</span>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSendChatMessage} className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask advice on OBE attainment, lesson plans, or research grants..."
              className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
            />
            <button
              type="submit"
              disabled={chatLoading || !chatInput.trim()}
              className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
