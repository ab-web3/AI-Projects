import React, { useState } from 'react';
import { Speaker, Participant } from '../types';
import {
  Users,
  Award,
  Star,
  Mail,
  Linkedin,
  Building,
  Search,
  MessageSquare,
  CheckCircle2,
  BookOpen
} from 'lucide-react';

interface SpeakersAndParticipantsProps {
  speakers: Speaker[];
  participants: Participant[];
}

export const SpeakersAndParticipants: React.FC<SpeakersAndParticipantsProps> = ({
  speakers,
  participants,
}) => {
  const [activeTab, setActiveTab] = useState<'speakers' | 'directory'>('speakers');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
  const [messageParticipant, setMessageParticipant] = useState<Participant | null>(null);
  const [messageText, setMessageText] = useState<string>('');
  const [messageSent, setMessageSent] = useState<boolean>(false);

  const filteredParticipants = participants.filter((p) => {
    return (
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.researchInterests.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setMessageParticipant(null);
      setMessageText('');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white border border-indigo-900/50 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            FDP Academic Network
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight">Resource Persons & Peer Directory</h2>
          <p className="text-slate-300 text-xs max-w-xl">
            Meet chief resource experts, view speaker bios, and connect with fellow academic faculty across institutions.
          </p>
        </div>

        <div className="flex items-center space-x-1.5 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700">
          <button
            onClick={() => setActiveTab('speakers')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'speakers' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            Resource Experts ({speakers.length})
          </button>
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'directory' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            Faculty Directory ({participants.length})
          </button>
        </div>
      </div>

      {/* TAB 1: SPEAKERS GRID */}
      {activeTab === 'speakers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {speakers.map((spk) => (
            <div
              key={spk.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start space-x-4">
                  <img
                    src={spk.avatar}
                    alt={spk.name}
                    className="w-16 h-16 rounded-full object-cover ring-4 ring-indigo-50 border border-indigo-200"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{spk.name}</h3>
                    <p className="text-xs text-indigo-700 font-semibold">{spk.title}</p>
                    <p className="text-[11px] text-slate-500 font-medium">{spk.institution}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{spk.bio}</p>

                <div className="flex flex-wrap gap-1">
                  {spk.topics.map((t) => (
                    <span key={t} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-1 text-xs font-bold text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{spk.rating}</span>
                  <span className="text-slate-400 font-normal">({spk.sessionsCount} modules)</span>
                </div>

                <button
                  onClick={() => setSelectedSpeaker(spk)}
                  className="px-3 py-1.5 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer"
                >
                  Full Bio
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: FACULTY DIRECTORY */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by participant name, department, or research interest..."
                className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50"
              />
            </div>
            <span className="text-xs text-slate-500 font-medium">Showing {filteredParticipants.length} Participants</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredParticipants.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{p.name}</h4>
                      <p className="text-[11px] text-indigo-600 font-semibold">{p.role}</p>
                      <p className="text-[10px] text-slate-500">{p.department} • {p.institution}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {p.researchInterests.map((r) => (
                      <span key={r} className="text-[9px] bg-indigo-50 text-indigo-800 px-2 py-0.5 rounded font-medium">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    {p.attendedCount} Session Attended
                  </span>
                  <button
                    onClick={() => setMessageParticipant(p)}
                    className="px-2.5 py-1 bg-slate-900 text-white font-bold text-[11px] rounded-lg hover:bg-indigo-600 transition-colors cursor-pointer flex items-center space-x-1"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>Connect</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Speaker Full Bio Modal */}
      {selectedSpeaker && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-3">
                <img src={selectedSpeaker.avatar} alt={selectedSpeaker.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{selectedSpeaker.name}</h3>
                  <p className="text-xs text-indigo-600 font-bold">{selectedSpeaker.title}</p>
                </div>
              </div>
              <button onClick={() => setSelectedSpeaker(null)} className="text-slate-400 font-bold p-1">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
              <p>{selectedSpeaker.bio}</p>
              <div>
                <p className="font-bold text-slate-900 mb-1">Key Focus Areas:</p>
                <div className="flex flex-wrap gap-1">
                  {selectedSpeaker.topics.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 font-medium text-[11px]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedSpeaker(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Connect Modal */}
      {messageParticipant && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Connect with {messageParticipant.name}</h3>
                <p className="text-xs text-slate-500">{messageParticipant.institution}</p>
              </div>
              <button onClick={() => setMessageParticipant(null)} className="text-slate-400 font-bold p-1">
                ✕
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Introduction Message</label>
                <textarea
                  rows={4}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={`Hi ${messageParticipant.name}, I would love to collaborate on research regarding ${messageParticipant.researchInterests[0]}...`}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                Send Message
              </button>

              {messageSent && (
                <p className="text-xs font-bold text-emerald-700 bg-emerald-50 p-2 rounded-lg text-center border border-emerald-200">
                  Message sent to {messageParticipant.name}!
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
