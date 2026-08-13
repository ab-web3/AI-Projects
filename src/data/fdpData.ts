import {
  FDPSession,
  ResourceItem,
  Speaker,
  Participant,
  Poll,
  LiveQuestion,
  SessionFeedback,
  UserProfile
} from '../types';

export const FDP_INFO = {
  title: "National Faculty Development Program (FDP 2026)",
  theme: "AI-Augmented Pedagogy, Outcome-Based Education (OBE) & High-Impact Research Methodology",
  dates: "August 18 – August 22, 2026",
  organizer: "Internal Quality Assurance Cell (IQAC) & Center for Pedagogical Excellence",
  accreditationNote: "Aligned with NBA & NAAC Accreditation Guidelines | 30 Contact Hours",
  code: "FDP-2026-ADV-PED",
  totalSessions: 5,
};

export const INITIAL_USER: UserProfile = {
  name: "Dr. Aakanksha Bedia",
  email: "bediaakanksha@gmail.com",
  institution: "Institute of Technology & Engineering",
  department: "Computer Science & Engineering",
  designation: "Associate Professor",
  registrationId: "FDP2026-REG-8472",
};

export const INITIAL_SPEAKERS: Speaker[] = [
  {
    id: "spk-1",
    name: "Dr. Ananya Sharma",
    title: "Professor & Chair of Educational Technology",
    institution: "IIT Delhi",
    bio: "Pioneer in Generative AI in STEM education. Published 40+ high-impact papers on digital learning environments and adaptive assessments.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250",
    email: "ananya.sharma@edu.org",
    topics: ["Generative AI in Education", "Prompt Engineering for Educators", "Automated Assessment"],
    rating: 4.9,
    sessionsCount: 3,
    linkedinUrl: "https://linkedin.com",
  },
  {
    id: "spk-2",
    name: "Prof. Rajesh Verma",
    title: "Dean of Academic Affairs & OBE Consultant",
    institution: "BITS Pilani",
    bio: "Senior NBA/NAAC Assessor with 22 years of experience mapping Course Outcomes (CO) to Program Outcomes (PO) and direct/indirect attainment.",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250",
    email: "r.verma@academic.in",
    topics: ["Outcome-Based Education", "CO-PO Attainment", "Curriculum Design"],
    rating: 4.85,
    sessionsCount: 2,
    linkedinUrl: "https://linkedin.com",
  },
  {
    id: "spk-3",
    name: "Dr. Sarah Jenkins",
    title: "Senior Research Director & Grant Strategist",
    institution: "National Science Foundation Fellow",
    bio: "Helped academic institutions secure over $12M in federal and industrial research grants. Specialist in Scopus/WoS Q1 journal publishing.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250",
    email: "s.jenkins@nsf-research.org",
    topics: ["Grant Writing", "Scopus/WoS Publishing", "Literature Review Tools"],
    rating: 4.95,
    sessionsCount: 2,
    linkedinUrl: "https://linkedin.com",
  },
  {
    id: "spk-4",
    name: "Dr. Vikram Patel",
    title: "Head of Active Learning Lab",
    institution: "IISc Bangalore",
    bio: "Specializes in gamified classrooms, flipped classroom architectures, and peer-instruction models for large lecture halls.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    email: "vikram.patel@iisc.ac.in",
    topics: ["Flipped Classrooms", "Peer Instruction", "Interactive Tools"],
    rating: 4.88,
    sessionsCount: 2,
    linkedinUrl: "https://linkedin.com",
  },
  {
    id: "spk-5",
    name: "Prof. Meera Nair",
    title: "Director of Assessment & Rubric Engineering",
    institution: "JNU New Delhi",
    bio: "Author of 'Modern Rubrics in Higher Ed'. Expert in authentic assessment techniques, open-book evaluation, and plagiarism safeguards.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250",
    email: "meera.nair@jnu.ac.in",
    topics: ["Assessment Rubrics", "Academic Integrity", "Case-Based Evaluation"],
    rating: 4.92,
    sessionsCount: 2,
    linkedinUrl: "https://linkedin.com",
  },
];

export const INITIAL_SESSIONS: FDPSession[] = [
  {
    id: "session-1",
    dayNumber: 1,
    date: "Day 1 - Monday, Aug 18, 2026",
    time: "10:00 AM - 12:30 PM IST",
    title: "Module 1: Generative AI & Prompt Engineering for Modern Educators",
    subtitle: "Leveraging LLMs for Lesson Planning, Quiz Generation, and Custom Teaching Aids",
    description: "An intensive hands-on workshop introducing AI models in course design. Learn system prompts, zero-shot/few-shot prompts for generating syllabus outlines, interactive case studies, and automated grading assistance while addressing ethical AI boundaries.",
    speakerId: "spk-1",
    speakerName: "Dr. Ananya Sharma",
    speakerRole: "Professor & Chair of Educational Tech, IIT Delhi",
    speakerAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250",
    speakerInstitution: "IIT Delhi",
    location: "Main Auditorium / Virtual Hall 1",
    meetingUrl: "https://meet.google.com/fdp-2026-session1",
    status: "live",
    tags: ["Generative AI", "Prompt Engineering", "Lesson Planning", "Digital Pedagogy"],
    attendanceCode: "AI2026",
    agendaItems: [
      "Introduction to LLM Capabilities in Higher Education",
      "Structuring Effective Prompts for Bloom's Taxonomy Alignment",
      "Live Demo: AI-Assisted Course Design & Interactive Case Studies",
      "Ethical Frameworks, Citation Rules & Anti-Hallucination Controls",
      "Participant Hands-on Activity & AI Template Customization"
    ],
    keyTakeaways: [
      "Mastered 5 core prompt structures for academic workflows.",
      "Built a complete 14-week course module outline in under 15 minutes.",
      "Established AI disclosure guidelines for student assignments."
    ],
    slidesUrl: "#"
  },
  {
    id: "session-2",
    dayNumber: 2,
    date: "Day 2 - Tuesday, Aug 19, 2026",
    time: "10:00 AM - 12:30 PM IST",
    title: "Module 2: Outcome-Based Education (OBE) & CO-PO Attainment Calculation",
    subtitle: "Designing Measurable Course Outcomes and Implementing Direct & Indirect Assessments",
    description: "Comprehensive breakdown of Outcome-Based Education. Master Bloom's action verbs for Course Outcomes (CO), construct CO-PO mapping matrices, and calculate direct/indirect attainment levels required for NAAC/NBA accreditation.",
    speakerId: "spk-2",
    speakerName: "Prof. Rajesh Verma",
    speakerRole: "Dean of Academic Affairs & OBE Consultant, BITS Pilani",
    speakerAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250",
    speakerInstitution: "BITS Pilani",
    location: "Conference Room B / Virtual Hall 1",
    meetingUrl: "https://meet.google.com/fdp-2026-session2",
    status: "upcoming",
    tags: ["OBE Framework", "CO-PO Mapping", "Accreditation", "NBA/NAAC"],
    attendanceCode: "OBE789",
    agendaItems: [
      "Fundamentals of OBE Frameworks and Continuous Quality Improvement (CQI)",
      "Formulating SMART Course Outcomes with Revised Bloom's Taxonomy",
      "Constructing 1-3 Strength Correlation Matrices for POs & PSOs",
      "Excel-Based Automation for Direct & Indirect Attainment Calculation",
      "Q&A on NAAC Criterion 2 & NBA SAR Documentation"
    ],
    keyTakeaways: [
      "Standardized CO formulation template for department alignment.",
      "Automated spreadsheet for calculating CO attainment threshold percentages.",
      "Clear strategy for handling target gap analysis."
    ],
    slidesUrl: "#"
  },
  {
    id: "session-3",
    dayNumber: 3,
    date: "Day 3 - Wednesday, Aug 20, 2026",
    time: "10:00 AM - 12:30 PM IST",
    title: "Module 3: High-Impact Research Methodology, Scopus/WoS Publishing & Grant Proposals",
    subtitle: "From Hypothesis to Q1 Journal Acceptance & Winning External Research Funding",
    description: "Step-by-step masterclass on formulating high-impact research questions, selecting indexed journals (Scopus/Web of Science), writing competitive research grant proposals for SERB/DST/ICSSR, and managing peer-review responses.",
    speakerId: "spk-3",
    speakerName: "Dr. Sarah Jenkins",
    speakerRole: "Senior Research Director & Grant Strategist",
    speakerAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250",
    speakerInstitution: "NSF Research Fellow",
    location: "Virtual Hall 1",
    meetingUrl: "https://meet.google.com/fdp-2026-session3",
    status: "upcoming",
    tags: ["Research Methodology", "Grant Writing", "Scopus Q1", "Academic Writing"],
    attendanceCode: "GRANT26",
    agendaItems: [
      "Identify Research Gaps using Systematic Literature Review Tools",
      "Anatomy of a High-Impact Paper: Abstract, Methodology, Results, Discussion",
      "Navigating Journal Impact Factors, CiteScore, and Predatory Journals",
      "Writing Winning Grant Applications: Budgeting, Impact Statement & Deliverables",
      "Interactive Review of Sample Grant Abstracts"
    ],
    keyTakeaways: [
      "Scopus/WoS manuscript checklist before initial submission.",
      "Grant proposal budget breakdown template.",
      "Effective response letter framework for reviewer comments."
    ],
    slidesUrl: "#"
  },
  {
    id: "session-4",
    dayNumber: 4,
    date: "Day 4 - Thursday, Aug 21, 2026",
    time: "10:00 AM - 12:30 PM IST",
    title: "Module 4: Active Learning Strategies & Flipped Classroom Design",
    subtitle: "Transforming Passive Lectures into High-Engagement Interactive Studios",
    description: "Explore evidence-based active learning models including Think-Pair-Share, Jigsaw cooperative learning, Peer Instruction using clickers, and flipped classroom video micro-modules that dramatically improve student retention.",
    speakerId: "spk-4",
    speakerName: "Dr. Vikram Patel",
    speakerRole: "Head of Active Learning Lab, IISc Bangalore",
    speakerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    speakerInstitution: "IISc Bangalore",
    location: "Virtual Hall 1",
    meetingUrl: "https://meet.google.com/fdp-2026-session4",
    status: "upcoming",
    tags: ["Active Learning", "Flipped Classroom", "Peer Instruction", "Engagement"],
    attendanceCode: "FLIP321",
    agendaItems: [
      "Cognitive Load Theory and Active Learning Psychology",
      "Designing Pre-Class Materials & In-Class Problem Solving Tasks",
      "Implementing Peer Instruction & Live Concept Tests",
      "Managing Diverse Classroom Dynamics & Introverted Participants",
      "Simulated Micro-Teaching Demonstration"
    ],
    keyTakeaways: [
      "10 instant active learning techniques requiring zero software setup.",
      "Flipped classroom lesson architecture blueprint.",
      "Peer instruction diagnostic question design."
    ],
    slidesUrl: "#"
  },
  {
    id: "session-5",
    dayNumber: 5,
    date: "Day 5 - Friday, Aug 22, 2026",
    time: "10:00 AM - 12:30 PM IST",
    title: "Module 5: Diagnostic Assessment Tools, Analytic Rubrics & Academic Integrity",
    subtitle: "Engineering Objective Rubrics, Authentic Evaluation & Validating Student Competencies",
    description: "Final session focusing on modern evaluation strategies. Learn to construct analytic rubrics for presentations, projects, and lab work, integrate open-book authentic assessments, and deploy plagiarism safeguards.",
    speakerId: "spk-5",
    speakerName: "Prof. Meera Nair",
    speakerRole: "Director of Assessment, JNU New Delhi",
    speakerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250",
    speakerInstitution: "JNU New Delhi",
    location: "Auditorium & Virtual Hall 1",
    meetingUrl: "https://meet.google.com/fdp-2026-session5",
    status: "upcoming",
    tags: ["Rubric Engineering", "Authentic Assessment", "Academic Integrity", "Evaluation"],
    attendanceCode: "EVAL999",
    agendaItems: [
      "Analytic vs Holistic Rubrics: When and How to Use Each",
      "Authentic Assessment Design: Problem-Based Scenarios vs Rote Exams",
      "Calibrating Inter-Rater Reliability Across Multiple Faculty Evaluators",
      "Academic Integrity in the AI Era: Portfolio & Defense-Based Marking",
      "Valedictory Ceremony & Certificate Conferral"
    ],
    keyTakeaways: [
      "Ready-to-use Analytic Rubrics for Engineering & Humanities projects.",
      "Inter-rater scoring calibration worksheet.",
      "Guidelines for oral defense and portfolio defense."
    ],
    slidesUrl: "#"
  }
];

export const INITIAL_RESOURCES: ResourceItem[] = [
  {
    id: "res-1",
    title: "AI Prompt Engineering Guide for Educators & Faculty",
    category: "AI & Tech",
    type: "Guidebook",
    format: "PDF",
    fileSize: "3.4 MB",
    downloadCount: 412,
    description: "Comprehensive 28-page PDF featuring 50+ tested system prompts for creating course outlines, discussion questions, case studies, and rubrics.",
    tags: ["Prompt Engineering", "Generative AI", "Teaching Guide"],
    author: "Dr. Ananya Sharma",
    dateAdded: "Aug 15, 2026",
    downloadUrl: "#",
    previewText: "Prompt Structure 1: Course Outcome Alignment Prompt\n'Act as a Senior Curriculum Designer in Computer Science. Create a 4-week module outline on Cloud Computing for 3rd year undergraduates...'"
  },
  {
    id: "res-2",
    title: "Automated CO-PO Attainment Excel Template (NBA/NAAC Compliant)",
    category: "OBE & Assessment",
    type: "Spreadsheet",
    format: "ZIP",
    fileSize: "1.8 MB",
    downloadCount: 680,
    description: "Fully macro-enabled Excel sheet pre-formatted with formula logic for direct CIE/SEE weightage calculations, CO attainment thresholds, and continuous improvement charts.",
    tags: ["OBE", "CO-PO Attainment", "Excel Template", "NBA"],
    author: "Prof. Rajesh Verma",
    dateAdded: "Aug 16, 2026",
    downloadUrl: "#",
    previewText: "Includes: Direct CIE (40%) + SEE (60%) calculation, Direct/Indirect weight ratio (80:20), gap analysis charts, and PO matrix radar plots."
  },
  {
    id: "res-3",
    title: "SERB / DST Research Grant Proposal Master Template",
    category: "Research & Grants",
    type: "Template",
    format: "DOCX",
    fileSize: "850 KB",
    downloadCount: 320,
    description: "Word document template aligned with federal research grant guidelines. Includes section prompts for Executive Summary, Literature Gap, Methodology, Budgeting, and Impact.",
    tags: ["Grant Writing", "SERB", "DST", "Research Proposal"],
    author: "Dr. Sarah Jenkins",
    dateAdded: "Aug 17, 2026",
    downloadUrl: "#",
    previewText: "Section 2.3: Novelty & Expected Contribution to Knowledge\nExplicitly state why current literature falls short and how your proposed methodology addresses this gap..."
  },
  {
    id: "res-4",
    title: "Flipped Classroom Activity Blueprint & Micro-Teaching Kit",
    category: "Pedagogy",
    type: "ToolKit",
    format: "PPTX",
    fileSize: "5.2 MB",
    downloadCount: 290,
    description: "Slide deck template and timing breakdown for 15-minute, 30-minute, and 50-minute flipped classroom sessions with built-in poll slides and Think-Pair-Share prompts.",
    tags: ["Flipped Classroom", "Active Learning", "Slide Deck"],
    author: "Dr. Vikram Patel",
    dateAdded: "Aug 17, 2026",
    downloadUrl: "#",
    previewText: "Slide 4: The 3-Step Peer Instruction Loop\n1. Concept Question (1 min)\n2. Individual Vote (1 min)\n3. Peer Discussion in Pairs (3 mins)"
  },
  {
    id: "res-5",
    title: "Universal Analytic Rubric Matrix for Student Projects & Capstones",
    category: "OBE & Assessment",
    type: "Rubric",
    format: "PDF",
    fileSize: "1.1 MB",
    downloadCount: 510,
    description: "Standardized 4-tier rubric (Exemplary, Proficient, Developing, Unacceptable) assessing Technical Rigor, Presentation, Innovation, and Teamwork.",
    tags: ["Rubric", "Assessment", "Capstone Project", "Evaluation"],
    author: "Prof. Meera Nair",
    dateAdded: "Aug 18, 2026",
    downloadUrl: "#",
    previewText: "Criterion: Problem Statement Definition\nExemplary (4 pts): Problem is clearly defined with quantitative metrics, socio-technical relevance, and exhaustive constraint mapping."
  }
];

export const INITIAL_PARTICIPANTS: Participant[] = [
  {
    id: "part-1",
    name: "Dr. Aakanksha Bedia",
    department: "Computer Science & Engineering",
    institution: "Institute of Technology & Engineering",
    role: "Associate Professor",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    email: "bediaakanksha@gmail.com",
    researchInterests: ["AI in Education", "Machine Learning", "Data Mining"],
    attendedCount: 1,
  },
  {
    id: "part-2",
    name: "Prof. Suresh Kumar",
    department: "Electrical Engineering",
    institution: "National Institute of Tech",
    role: "Assistant Professor",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
    email: "suresh.k@nit.edu",
    researchInterests: ["Power Systems", "OBE Mapping", "Smart Grids"],
    attendedCount: 1,
  },
  {
    id: "part-3",
    name: "Dr. Priya Sundaram",
    department: "Humanities & Social Sciences",
    institution: "Central University",
    role: "Professor",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=250",
    email: "priya.s@cu.edu",
    researchInterests: ["Digital Humanities", "Educational Psychology", "Blended Learning"],
    attendedCount: 1,
  },
  {
    id: "part-4",
    name: "Dr. Ramesh Chandra",
    department: "Mechanical Engineering",
    institution: "State Technological University",
    role: "Head of Department",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250",
    email: "ramesh.c@stu.edu",
    researchInterests: ["Thermal Eng", "Accreditation Standards", "Robotics"],
    attendedCount: 1,
  },
  {
    id: "part-5",
    name: "Dr. Neha Gupta",
    department: "Biotechnology",
    institution: "AIMS Research University",
    role: "Assistant Professor",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250",
    email: "neha.g@aims.org",
    researchInterests: ["Bioinformatics", "Grant Proposals", "Lab Assessment"],
    attendedCount: 1,
  }
];

export const INITIAL_QUESTIONS: LiveQuestion[] = [
  {
    id: "q-1",
    sessionId: "session-1",
    participantName: "Dr. Suresh Kumar",
    participantAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
    question: "How can we prevent students from using AI for basic code/essay assignments without discouraging legitimate research tools?",
    timestamp: "10:45 AM",
    votes: 14,
    isAnswered: true
  },
  {
    id: "q-2",
    sessionId: "session-1",
    participantName: "Dr. Priya Sundaram",
    participantAvatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=250",
    question: "Is there a recommended prompt formula for generating Bloom's higher-level (Evaluate/Create) assessment rubrics?",
    timestamp: "11:10 AM",
    votes: 9,
    isAnswered: false
  },
  {
    id: "q-3",
    sessionId: "session-2",
    participantName: "Dr. Ramesh Chandra",
    participantAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250",
    question: "In NBA SAR documentation, what is the weightage split between CIE direct assessments and SEE university examination results?",
    timestamp: "Yesterday",
    votes: 11,
    isAnswered: false
  }
];

export const INITIAL_POLLS: Poll[] = [
  {
    id: "poll-1",
    sessionId: "session-1",
    sessionTitle: "Module 1: Generative AI & Prompt Engineering",
    question: "Which AI tool or capability do you currently integrate into your course preparation?",
    options: [
      { id: "opt-1", text: "ChatGPT / Claude for lesson outlines & ideas", votes: 24 },
      { id: "opt-2", text: "Automated Quiz / MCQ Generators", votes: 16 },
      { id: "opt-3", text: "AI presentation slide creators", votes: 9 },
      { id: "opt-4", text: "None yet – looking to start after this FDP!", votes: 12 }
    ],
    totalVotes: 61,
    isActive: true,
  },
  {
    id: "poll-2",
    sessionId: "session-2",
    sessionTitle: "Module 2: OBE & Accreditation",
    question: "What is your institution's biggest challenge in implementing Outcome-Based Education (OBE)?",
    options: [
      { id: "opt-a", text: "Calculating direct/indirect CO attainment manually", votes: 28 },
      { id: "opt-b", text: "Aligning course outcomes with Bloom's Taxonomy", votes: 14 },
      { id: "opt-c", text: "Faculty training & SAR documentation burden", votes: 31 },
      { id: "opt-d", text: "Student feedback collection compliance", votes: 7 }
    ],
    totalVotes: 80,
    isActive: true,
  }
];

export const INITIAL_FEEDBACK: SessionFeedback[] = [
  {
    id: "fb-1",
    sessionId: "session-1",
    sessionTitle: "Module 1: Generative AI & Prompt Engineering",
    participantName: "Dr. Aakanksha Bedia",
    overallRating: 5,
    contentQuality: 5,
    speakerEffectiveness: 5,
    usefulness: 5,
    comments: "Extremely pragmatic session! The live prompt engineering demonstration for generating Bloom's taxonomy rubrics was directly usable for my upcoming semester courses.",
    timestamp: "Aug 18, 2026, 12:45 PM"
  }
];
