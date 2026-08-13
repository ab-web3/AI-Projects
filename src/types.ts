export type SessionStatus = 'live' | 'upcoming' | 'completed';

export interface FDPSession {
  id: string;
  dayNumber: number;
  date: string;
  time: string;
  title: string;
  subtitle: string;
  description: string;
  speakerId: string;
  speakerName: string;
  speakerRole: string;
  speakerAvatar: string;
  speakerInstitution: string;
  location: string;
  meetingUrl?: string;
  status: SessionStatus;
  tags: string[];
  attendanceCode: string;
  agendaItems: string[];
  keyTakeaways: string[];
  slidesUrl?: string;
}

export type ResourceCategory = 'AI & Tech' | 'Pedagogy' | 'Research & Grants' | 'OBE & Assessment';
export type ResourceFormat = 'PDF' | 'PPTX' | 'DOCX' | 'ZIP' | 'Video';

export interface ResourceItem {
  id: string;
  title: string;
  category: ResourceCategory;
  type: string;
  format: ResourceFormat;
  fileSize: string;
  downloadCount: number;
  description: string;
  tags: string[];
  previewText?: string;
  author: string;
  dateAdded: string;
  downloadUrl: string;
}

export interface Speaker {
  id: string;
  name: string;
  title: string;
  institution: string;
  bio: string;
  avatar: string;
  email: string;
  topics: string[];
  rating: number;
  sessionsCount: number;
  linkedinUrl?: string;
}

export interface Participant {
  id: string;
  name: string;
  department: string;
  institution: string;
  role: string;
  avatar: string;
  email: string;
  researchInterests: string[];
  attendedCount: number;
}

export interface LiveQuestion {
  id: string;
  sessionId: string;
  participantName: string;
  participantAvatar: string;
  question: string;
  timestamp: string;
  votes: number;
  isAnswered: boolean;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  sessionId: string;
  sessionTitle: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  isActive: boolean;
  userVotedOptionId?: string;
}

export interface SessionFeedback {
  id: string;
  sessionId: string;
  sessionTitle: string;
  participantName: string;
  overallRating: number;
  contentQuality: number;
  speakerEffectiveness: number;
  usefulness: number;
  comments: string;
  timestamp: string;
}

export interface LessonPlanTimelineItem {
  phase: string;
  duration: string;
  teacherAction: string;
  studentAction: string;
  toolOrMethod: string;
}

export interface RubricCriteria {
  criteria: string;
  exemplary: string;
  proficient: string;
  developing: string;
}

export interface LessonPlanResult {
  title: string;
  subject: string;
  targetAudience: string;
  duration: string;
  bloomLevel: string;
  learningObjectives: string[];
  prerequisites: string[];
  timeline: LessonPlanTimelineItem[];
  assessmentRubric: RubricCriteria[];
  pedagogicalTips: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface AttendanceRecord {
  sessionId: string;
  sessionTitle: string;
  dayNumber: number;
  date: string;
  checkedInAt: string;
  isVerified: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  institution: string;
  department: string;
  designation: string;
  registrationId: string;
}
