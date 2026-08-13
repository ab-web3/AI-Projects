import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  // Initialize Gemini AI Client lazily/safely
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Assistant Endpoint for Lesson Plans, Quiz Maker, and Pedagogical Q&A
  app.post("/api/gemini/assistant", async (req, res) => {
    try {
      const { mode, prompt, extraData } = req.body;
      const ai = getGeminiClient();

      if (!mode) {
        return res.status(400).json({ error: "Mode parameter is required." });
      }

      if (mode === "lesson-plan") {
        const subject = extraData?.subject || "Higher Education";
        const topic = prompt || extraData?.topic || "Active Learning Strategies";
        const audience = extraData?.targetAudience || "Undergraduate Students";
        const duration = extraData?.durationMinutes || "60 minutes";
        const bloom = extraData?.bloomLevel || "Apply & Analyze";

        if (!ai) {
          // Fallback structured lesson plan if no API key provided
          return res.json({
            result: {
              title: `Comprehensive Lesson Plan: ${topic}`,
              subject,
              targetAudience: audience,
              duration,
              bloomLevel: bloom,
              learningObjectives: [
                `Formulate clear, measurable outcomes for ${topic} aligned with Bloom's ${bloom} level.`,
                `Critique existing instructional methods and apply interactive peer-learning techniques.`,
                `Evaluate student comprehension using structured formative assessment rubrics.`
              ],
              prerequisites: [
                "Basic understanding of course syllabus mapping",
                "Familiarity with digital presentation or polling tools"
              ],
              timeline: [
                {
                  phase: "Introduction & Hook (10%)",
                  duration: "10 mins",
                  teacherAction: `Present a real-world case challenge on ${topic}. Conduct a 2-minute diagnostic poll.`,
                  studentAction: "Participate in live poll and share initial hypotheses with peer partner.",
                  toolOrMethod: "Live Poll / Think-Pair-Share"
                },
                {
                  phase: "Core Direct Instruction & Demonstration (30%)",
                  duration: "20 mins",
                  teacherAction: `Deconstruct key theoretical principles of ${topic} using visual diagrams and interactive examples.`,
                  studentAction: "Take structured notes on key framework pillars; post clarifying questions in digital queue.",
                  toolOrMethod: "Interactive Slide Deck & Mindmap"
                },
                {
                  phase: "Guided Practice & Group Workshop (40%)",
                  duration: "20 mins",
                  teacherAction: "Divide class into breakout teams. Assign problem scenario with specific constraints.",
                  studentAction: "Collaborate in groups of 3-4 to draft solution matrix and assign role tasks.",
                  toolOrMethod: "Group Worksheet & Jigsaw Framework"
                },
                {
                  phase: "Synthesis & Formative Assessment (20%)",
                  duration: "10 mins",
                  teacherAction: "Invite 2 student teams to present findings. Provide instant rubric-based feedback.",
                  studentAction: "Submit exit ticket reflection and peer-review partner contributions.",
                  toolOrMethod: "Exit Ticket & Analytic Rubric"
                }
              ],
              assessmentRubric: [
                {
                  criteria: "Conceptual Mastery & Rigor",
                  exemplary: "Demonstrates flawless synthesis of theoretical frameworks with original context application.",
                  proficient: "Applies concepts correctly with minor logical gaps in fringe scenarios.",
                  developing: "Recalls terminology but struggles to transfer principles to novel problem contexts."
                },
                {
                  criteria: "Critical Problem-Solving",
                  exemplary: "Proposes multi-faceted, evidence-backed solutions with quantitative gap analysis.",
                  proficient: "Proposes viable solutions with adequate reasoning and standard methodologies.",
                  developing: "Offers superficial solutions lacking empirical justification or structure."
                },
                {
                  criteria: "Peer Collaboration & Communication",
                  exemplary: "Articulates ideas with exceptional clarity, active listening, and balanced team dynamics.",
                  proficient: "Communicates effectively and contributes equitably to team deliverables.",
                  developing: "Passive participation or dominates group discussion without peer consensus."
                }
              ],
              pedagogicalTips: [
                "Use 3-minute pause points every 15 minutes to allow cognitive processing.",
                "Incorporate low-stakes digital polling to identify misconceptions early.",
                "Provide rubrics to students prior to task initiation to promote self-regulated learning."
              ]
            }
          });
        }

        const systemInstruction = `You are an expert Educational Consultant, Curriculum Engineer, and Master Pedagogy Specialist for Faculty Development Programs.
Generates structured, professional, Bloom's Taxonomy-aligned lesson plans and rubric matrices in valid JSON matching the schema provided.`;

        const userPrompt = `Generate an exhaustive, highly practical higher-education lesson plan for:
Subject/Course: ${subject}
Topic: ${topic}
Target Audience: ${audience}
Duration: ${duration}
Bloom's Cognitive Level: ${bloom}
Additional Context: ${extraData?.additionalNotes || "Focus on active student engagement and Outcome-Based Education alignment."}`;

        const geminiResponse = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: userPrompt,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                subject: { type: Type.STRING },
                targetAudience: { type: Type.STRING },
                duration: { type: Type.STRING },
                bloomLevel: { type: Type.STRING },
                learningObjectives: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                prerequisites: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                timeline: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      phase: { type: Type.STRING },
                      duration: { type: Type.STRING },
                      teacherAction: { type: Type.STRING },
                      studentAction: { type: Type.STRING },
                      toolOrMethod: { type: Type.STRING },
                    },
                    required: ["phase", "duration", "teacherAction", "studentAction", "toolOrMethod"],
                  },
                },
                assessmentRubric: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      criteria: { type: Type.STRING },
                      exemplary: { type: Type.STRING },
                      proficient: { type: Type.STRING },
                      developing: { type: Type.STRING },
                    },
                    required: ["criteria", "exemplary", "proficient", "developing"],
                  },
                },
                pedagogicalTips: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: [
                "title",
                "subject",
                "targetAudience",
                "duration",
                "bloomLevel",
                "learningObjectives",
                "timeline",
                "assessmentRubric",
                "pedagogicalTips",
              ],
            },
          },
        });

        const parsedResult = JSON.parse(geminiResponse.text || "{}");
        return res.json({ result: parsedResult });
      }

      if (mode === "quiz-maker") {
        const topic = prompt || extraData?.topic || "Generative AI in Pedagogy & OBE";
        const count = extraData?.questionCount || 5;

        if (!ai) {
          // Fallback questions if no API key
          return res.json({
            questions: [
              {
                question: "According to Revised Bloom's Taxonomy, which action verb corresponds to the 'Analyze' cognitive level?",
                options: [
                  "A) Differentiate and Organize",
                  "B) Define and List",
                  "C) Execute and Implement",
                  "D) Design and Construct"
                ],
                correctAnswerIndex: 0,
                explanation: "'Analyze' involves breaking material into constituent parts and determining how parts relate to one another (e.g., differentiate, organize, attribute)."
              },
              {
                question: "In Outcome-Based Education (OBE), what primary relationship defines Course Outcomes (CO) to Program Outcomes (PO)?",
                options: [
                  "A) COs are broad institutional goals, while POs are weekly lesson goals.",
                  "B) COs represent subject-specific competencies mapped directly to broader program graduate attributes (POs).",
                  "C) POs are calculated solely based on university end-semester examinations.",
                  "D) COs have no direct bearing on NBA/NAAC accreditation metrics."
                ],
                correctAnswerIndex: 1,
                explanation: "Course Outcomes (COs) specify what students will be able to do at the end of a specific course, mapped in a strength matrix (1-3) to Program Outcomes (POs)."
              },
              {
                question: "What is the primary objective of a 'Flipped Classroom' instructional model?",
                options: [
                  "A) Replacing all in-person faculty lectures with automated AI video recordings permanently.",
                  "B) Shift direct instruction outside the group learning space to preserve in-class time for active problem-solving and peer synthesis.",
                  "C) Conducting open-book examinations without faculty supervision.",
                  "D) Eliminating homework assignments completely from the curriculum."
                ],
                correctAnswerIndex: 1,
                explanation: "The flipped classroom moves lower-level Bloom tasks (Remember/Understand) to pre-class preparation, dedicating class hours to higher-level application and synthesis."
              },
              {
                question: "Which feature distinguishes an 'Analytic Rubric' from a 'Holistic Rubric'?",
                options: [
                  "A) Analytic rubrics score work based on multiple distinct criteria independently with descriptive performance levels.",
                  "B) Analytic rubrics provide only a single overall letter grade without criterion feedback.",
                  "C) Analytic rubrics can only be used for multiple-choice examinations.",
                  "D) Holistic rubrics take longer to grade and require complex statistical modeling."
                ],
                correctAnswerIndex: 0,
                explanation: "Analytic rubrics break down assignment expectations into specific criteria (e.g., Technical Rigor, Presentation, Citation) evaluated along a performance continuum."
              },
              {
                question: "When crafting prompts for Generative AI in course design, what is 'Few-Shot Prompting'?",
                options: [
                  "A) Providing the AI with 0 background information.",
                  "B) Supplying 1 to 3 concrete input-output examples inside the prompt to guide formatting and tone.",
                  "C) Generating 100 questions in a single API call.",
                  "D) Prompting the model repeatedly until it provides a short response."
                ],
                correctAnswerIndex: 1,
                explanation: "Few-shot prompting provides high-quality example inputs and expected outputs within the prompt context, significantly boosting structural consistency."
              }
            ]
          });
        }

        const geminiResponse = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: `Create ${count} challenging, high-quality Multiple Choice Questions (MCQs) for higher-education faculty on the topic: "${topic}".
Ensure each question tests deep conceptual understanding, has 4 options (A, B, C, D), clearly identifies the correct index (0-3), and provides a comprehensive explanation.`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                questions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      options: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      correctAnswerIndex: { type: Type.INTEGER },
                      explanation: { type: Type.STRING },
                    },
                    required: ["question", "options", "correctAnswerIndex", "explanation"],
                  },
                },
              },
              required: ["questions"],
            },
          },
        });

        const parsedResult = JSON.parse(geminiResponse.text || "{}");
        return res.json({ questions: parsedResult.questions || [] });
      }

      if (mode === "qa-bot") {
        const questionPrompt = prompt || "How can I effectively integrate AI in my teaching?";

        if (!ai) {
          return res.json({
            answer: `### Pedagogical Strategy Overview

**Regarding your query:** "${questionPrompt}"

Here are 4 actionable recommendations for Faculty Development & Course Optimization:

1. **Constructive Alignment with Bloom's Taxonomy**
   - Ensure learning outcomes (COs) explicitly specify what cognitive level is required.
   - For lower levels (*Remember / Understand*), utilize self-paced digital quizzes or flipped pre-class reading.
   - For higher levels (*Analyze / Evaluate / Create*), use interactive case studies and peer review.

2. **AI Integration Framework**
   - **Pre-Class**: Use AI to draft 3 variations of real-world problem scenarios.
   - **In-Class**: Challenge students to critique AI-generated code or essays, identifying hallucinations, bias, or logical gaps.
   - **Post-Class**: Employ analytic rubrics to give detailed feedback on authentic capstone deliverables.

3. **Accreditation Readiness (NBA/NAAC)**
   - Maintain evidence dossiers containing syllabus CO-PO mapping, direct assessment spreadsheets, and sample student work across high/medium/low attainment tiers.

*Need custom lesson plans or MCQs? Switch to our AI Lesson Plan Generator or Quiz Maker tabs!*`
          });
        }

        const geminiResponse = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: questionPrompt,
          config: {
            systemInstruction: `You are an expert Academic Advisor and Senior Pedagogical Lead for a National Faculty Development Program (FDP).
Provide clear, authoritative, highly structured, and empathetic advice for university professors and educators.
Use clear headings, bullet points, and practical higher-education examples.`,
          },
        });

        return res.json({ answer: geminiResponse.text });
      }

      return res.status(400).json({ error: "Invalid assistant mode." });
    } catch (error: any) {
      console.error("Error in /api/gemini/assistant:", error);
      res.status(500).json({
        error: "Failed to generate AI response.",
        details: error?.message || String(error),
      });
    }
  });

  // Serve static assets or Vite dev server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
