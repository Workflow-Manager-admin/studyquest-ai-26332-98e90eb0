import React, { useState } from "react";

/**
 * Main Container for StudyQuest AI
 * Implements the ColorCraft frontend: file uploads (.pdf, .docx), content extraction, MCQ generation, and quiz display.
 * UI: dark, student-friendly, modern palette (primary: #2D6A4F, secondary: #40916C, accent: #FFD166)
 */

// PUBLIC_INTERFACE
function StudyQuestMain() {
  // Upload and processing state
  const [file, setFile] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [generating, setGenerating] = useState(false);
  const [mcqs, setMcqs] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizState, setQuizState] = useState({}); // { [index]: selectedOption }

  // Simulated API: Extract content from uploaded file (placeholder)
  async function extractContent(fileObj) {
    setExtracting(true);
    // Placeholder: simulate text extraction (real: use backend/API)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          "The mitochondria is the powerhouse of the cell. Photosynthesis occurs in the chloroplast. DNA stands for Deoxyribonucleic Acid."
        );
      }, 1500);
    });
  }

  // Simulated API: Generate MCQs from text (placeholder)
  async function generateMCQs(text) {
    setGenerating(true);
    // Placeholder: simulate question generation (real: use backend/API)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            question: "What is the powerhouse of the cell?",
            options: [
              "Chloroplast",
              "Nucleus",
              "Mitochondria",
              "Ribosome"
            ],
            answerIdx: 2
          },
          {
            question: "Where does photosynthesis occur?",
            options: [
              "Mitochondria",
              "Chloroplast",
              "Ribosome",
              "Golgi apparatus"
            ],
            answerIdx: 1
          },
          {
            question: "What does DNA stand for?",
            options: [
              "Deoxyribonucleic Acid",
              "Dinucleic Acid",
              "Deoxyribose Acetyl",
              "None of the above"
            ],
            answerIdx: 0
          }
        ]);
      }, 1700);
    });
  }

  // Handle new file upload
  const onFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
    setExtractedText("");
    setMcqs([]);
    setQuizStarted(false);
    setQuizState({});
  };

  // Handle processing pipeline: extract content, then generate MCQs
  const processFile = async () => {
    if (!file) return;
    setExtractedText("");
    setMcqs([]);
    setQuizStarted(false);
    setQuizState({});

    try {
      const text = await extractContent(file);
      setExtractedText(text);
      setExtracting(false);

      const mcqsData = await generateMCQs(text);
      setMcqs(mcqsData);
      setGenerating(false);

      setQuizStarted(true);
    } catch {
      setExtracting(false);
      setGenerating(false);
      setExtractedText("Error extracting content.");
    }
  };

  // Handle quiz answer selection
  const handleOptionSelect = (qIdx, oIdx) => {
    setQuizState({ ...quizState, [qIdx]: oIdx });
  };

  // Reset everything
  const resetAll = () => {
    setFile(null);
    setExtractedText("");
    setMcqs([]);
    setQuizStarted(false);
    setQuizState({});
  };

  return (
    <div className="sq-main">
      <nav className="sq-navbar">
        <div className="sq-logo">
          <span className="sq-logo-symbol">🎨</span>
          <span>StudyQuest AI</span>
        </div>
        <div>
          <button className="sq-btn sq-btn-outlined" onClick={resetAll}>
            Home
          </button>
        </div>
      </nav>
      <main className="sq-content">
        <div className="sq-section sq-upload-area">
          <div className="sq-hero-title">AI-Powered Quiz Maker</div>
          <div className="sq-hero-desc">
            Upload a <span className="sq-accent">PDF</span> or <span className="sq-accent">DOCX</span>, and let StudyQuest AI generate smart MCQs!
          </div>
          <form
            className="sq-file-form"
            onSubmit={e => {
              e.preventDefault();
              processFile();
            }}
          >
            <input
              type="file"
              id="fileInput"
              accept=".pdf,.docx"
              onChange={onFileChange}
              className="sq-file-input"
            />
            <label htmlFor="fileInput" className="sq-btn sq-btn-large sq-btn-accent sq-upload-btn">
              {file ? "File Selected ✔" : "Choose File"}
            </label>
            <span className="sq-file-name">{file ? file.name : "No file chosen"}</span>
            <button
              type="submit"
              className="sq-btn sq-btn-primary sq-btn-large sq-gen-btn"
              disabled={!file || extracting || generating}
            >
              {extracting || generating ? (
                <span className="sq-loader"></span>
              ) : (
                "Generate Quiz"
              )}
            </button>
          </form>
          <div className="sq-progress-msg">
            {extracting && <span>Extracting text from file...</span>}
            {extractedText && !generating && mcqs.length === 0 && (
              <span>Text extracted! Ready to generate MCQs.</span>
            )}
            {generating && <span>Generating MCQs using AI...</span>}
          </div>
        </div>

        {quizStarted && mcqs.length > 0 && (
          <div className="sq-section sq-quiz-area">
            <h2 className="sq-quiz-title">
              Quiz - <span className="sq-accent">{file?.name}</span>
            </h2>
            <div className="sq-quiz-list">
              {mcqs.map((q, qIdx) => (
                <div key={qIdx} className="sq-quiz-card">
                  <div className="sq-question">{qIdx + 1}. {q.question}</div>
                  <div className="sq-options">
                    {q.options.map((opt, oIdx) => {
                      // was this option selected?
                      const selected = quizState[qIdx] === oIdx;
                      // show feedback if answered
                      const showFeedback = quizState[qIdx] !== undefined;
                      let optClass = "sq-option";
                      if (selected) optClass += " sq-option-selected";
                      if (showFeedback) {
                        if (oIdx === q.answerIdx) optClass += " sq-option-correct";
                        else if (selected && oIdx !== q.answerIdx) optClass += " sq-option-wrong";
                      }
                      return (
                        <button
                          key={oIdx}
                          className={optClass}
                          disabled={showFeedback}
                          onClick={() => handleOptionSelect(qIdx, oIdx)}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  <div className="sq-feedback">
                    {quizState[qIdx] !== undefined &&
                      (quizState[qIdx] === q.answerIdx ? (
                        <span className="sq-correct">Correct! 🎉</span>
                      ) : (
                        <span className="sq-wrong">Incorrect. Correct answer: <b>{q.options[q.answerIdx]}</b></span>
                      ))}
                  </div>
                </div>
              ))}
            </div>
            <button className="sq-btn sq-btn-secondary sq-btn-large sq-again-btn" onClick={resetAll}>
              Try Another File
            </button>
          </div>
        )}
      </main>
      {/* Styling for the container (Could go in .css, but kept inline for clarity) */}
      <style>{`
        .sq-main {
          background: #222724;
          min-height: 100vh;
          color: #f7fafd;
        }
        .sq-navbar {
          padding: 18px 0;
          background: #1b2520;
          border-bottom: 2px solid #23342B;
          display: flex; justify-content: space-between; align-items: center;
          position: sticky; top: 0; z-index: 1000;
        }
        .sq-logo {
          font-size: 1.3rem;
          font-weight: 700;
          letter-spacing: 1px;
          color: #FFD166;
          display: flex; align-items: center; gap: 8px;
        }
        .sq-logo-symbol { font-size: 1.6em; color: #FFD166; margin-right: 4px; }

        .sq-btn {
          border: none;
          border-radius: 5px;
          padding: 0.55em 1.5em;
          font-size: 1.08em;
          font-weight: 500;
          transition: background 0.18s;
          cursor: pointer;
          margin-left: 10px;
        }
        .sq-btn-primary { background: #2D6A4F; color: #FFD166; }
        .sq-btn-secondary { background: #40916C; color: #FFD166; }
        .sq-btn-accent { background: #FFD166; color: #222724; }
        .sq-btn-outlined {
          background: none;
          color: #FFD166;
          border: 2px solid #FFD166;
        }
        .sq-btn-large { font-size: 1.12em; padding: 0.7em 2.1em; }
        .sq-file-form {
          margin-top: 2em;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }
        .sq-upload-btn {
          margin: 0;
        }
        .sq-file-input { display: none; }
        .sq-file-name {
          color: #FFD166;
          margin-top: 0;
          font-size: 1em;
        }
        .sq-gen-btn {
          min-width: 170px;
        }
        .sq-loader {
          border: 3px solid #FFD16622;
          border-top: 3px solid #FFD166;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          animation: sq-spin 1s linear infinite;
          display: inline-block;
          vertical-align: middle;
        }
        @keyframes sq-spin { 100% { transform: rotate(360deg);} }

        .sq-section {
          margin: 0 auto;
          max-width: 600px;
          background: #232926;
          border-radius: 1.5em;
          box-shadow: 0 2px 16px 0 #0002;
          margin-top: 72px;
          padding: 2.5em;
        }
        .sq-upload-area {
          text-align: center;
        }
        .sq-hero-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #FFD166;
        }
        .sq-hero-desc {
          margin-top: 10px;
          color: #b9efd6;
          font-size: 1.18em;
        }
        .sq-accent { color: #FFD166; font-weight: 700; }

        .sq-progress-msg {
          margin: 22px 0 0 0;
          color: #FFD166;
          min-height: 22px;
          font-size: 1.08em;
        }
        .sq-quiz-area {
          margin-top: 60px;
        }
        .sq-quiz-title {
          color: #FFD166;
          font-size: 2em;
          font-weight: 700;
        }
        .sq-quiz-list {
          margin: 23px 0 34px 0;
          display: flex;
          flex-direction: column;
          gap: 30px;
        }
        .sq-quiz-card {
          background: #24322a;
          border-radius: 1em;
          padding: 1.5em 1em;
          box-shadow: 0 1px 8px #0003;
        }
        .sq-question {
          color: #fffde9;
          font-size: 1.13em;
          font-weight: 500;
          margin-bottom: 1.1em;
        }
        .sq-options {
          display: flex;
          flex-direction: column;
          gap: 0.8em;
        }
        .sq-option {
          border: none;
          border-radius: 6px;
          background: #222724;
          color: #FFD166;
          font-size: 1em;
          padding: 0.65em 1.2em;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
          margin-bottom: 2px;
          text-align: left;
        }
        .sq-option:hover, .sq-option-selected {
          background: #FFD166;
          color: #1B2520;
          font-weight: 700;
        }
        .sq-option-correct {
          background: #40916C !important;
          color: #FFD166 !important;
        }
        .sq-option-wrong {
          background: #E57373 !important;
          color: #FFF !important;
        }
        .sq-feedback {
          margin-top: 0.8em;
          min-height: 1.1em;
        }
        .sq-correct {
          color: #FFD166;
          font-weight: 600;
        }
        .sq-wrong {
          color: #E57373;
        }
        .sq-again-btn {
          margin-top: 28px;
        }

        /* Responsive tweaks */
        @media (max-width: 720px) {
          .sq-section { padding: 1.4em; margin-top: 50px;}
          .sq-quiz-title, .sq-hero-title { font-size: 1.2em; }
        }
      `}</style>
    </div>
  );
}

export default StudyQuestMain;
