(() => {
  const categories = [
    "Income Statement", "Balance Sheet", "Cash Flow", "Valuation", "DCF & M&A"
  ];

  const questionBank = {
    "Income Statement": [
      { q: "Walk me through the three financial statements and how they connect.", id: "IS1" },
      { q: "What's the difference between operating expenses and non-operating expenses?", id: "IS2" },
      { q: "How does depreciation affect the three financial statements?", id: "IS3" },
      { q: "Explain the difference between EBIT, EBITDA, and net income.", id: "IS4" },
      { q: "What's the relationship between revenue, COGS, and gross profit?", id: "IS5" },
      { q: "How do deferred revenue and accrued expenses impact the income statement?", id: "IS6" },
      { q: "What is the difference between operating income and net income?", id: "IS7" },
      { q: "How does interest expense affect the income statement and taxes?", id: "IS8" },
      { q: "Explain stock-based compensation and its impact on the P&L.", id: "IS9" },
      { q: "What's the difference between GAAP and non-GAAP earnings?", id: "IS10" }
    ],
    "Balance Sheet": [
      { q: "What are the main components of the balance sheet?", id: "BS1" },
      { q: "How does depreciation affect the balance sheet?", id: "BS2" },
      { q: "Explain the relationship between assets, liabilities, and equity.", id: "BS3" },
      { q: "What's the difference between current and non-current assets?", id: "BS4" },
      { q: "How does issuing debt affect the balance sheet?", id: "BS5" },
      { q: "What is working capital and how is it calculated?", id: "BS6" },
      { q: "Explain the difference between tangible and intangible assets.", id: "BS7" },
      { q: "How does an acquisition affect the buyer's balance sheet?", id: "BS8" },
      { q: "What is goodwill and how is it created?", id: "BS9" },
      { q: "Explain the difference between retained earnings and dividends.", id: "BS10" },
      { q: "What happens to the balance sheet when a company buys back stock?", id: "BS11" },
      { q: "How do operating leases differ from capital leases on the balance sheet?", id: "BS12" }
    ],
    "Cash Flow": [
      { q: "Walk me through the cash flow statement from top to bottom.", id: "CF1" },
      { q: "What's the difference between the direct and indirect method of cash flows?", id: "CF2" },
      { q: "Why can a company show profit but have negative cash flow?", id: "CF3" },
      { q: "How does an increase in accounts receivable affect cash flow?", id: "CF4" },
      { q: "What's the difference between operating, investing, and financing cash flows?", id: "CF5" },
      { q: "How does depreciation affect operating cash flow?", id: "CF6" },
      { q: "Explain how changes in working capital impact cash flow.", id: "CF7" },
      { q: "What happens to cash flow when a company increases inventory?", id: "CF8" },
      { q: "How does issuing equity or debt affect the cash flow statement?", id: "CF9" },
      { q: "Explain free cash flow and why it's important.", id: "CF10" }
    ],
    "Valuation": [
      { q: "Walk me through a DCF valuation from start to finish.", id: "VAL1" },
      { q: "What's the difference between enterprise value and equity value?", id: "VAL2" },
      { q: "How do you calculate WACC and what does it represent?", id: "VAL3" },
      { q: "What are the main drivers of a company's valuation?", id: "VAL4" },
      { q: "Explain the difference between unlevered and levered free cash flow.", id: "VAL5" },
      { q: "How do you determine terminal value in a DCF?", id: "VAL6" },
      { q: "What is the difference between trading and transaction comps?", id: "VAL7" },
      { q: "Walk me through the formula for enterprise value.", id: "VAL8" },
      { q: "What is the difference between IRR and NPV?", id: "VAL9" },
      { q: "How do you adjust EBIT to get to unlevered free cash flow?", id: "VAL10" },
      { q: "Explain accretion and dilution in an M&A transaction.", id: "VAL11" },
      { q: "What is the difference between precedent transactions and public comps?", id: "VAL12" }
    ],
    "DCF & M&A": [
      { q: "Walk me through how to build an LBO model.", id: "LBO1" },
      { q: "What are the main sources and uses of funds in an LBO?", id: "LBO2" },
      { q: "Explain how debt paydown creates returns in an LBO.", id: "LBO3" },
      { q: "What is the difference between a strategic and financial buyer?", id: "LBO4" },
      { q: "Walk me through accretion/dilution analysis.", id: "LBO5" },
      { q: "How do you calculate the combined pro forma financials in an M&A deal?", id: "LBO6" },
      { q: "What are synergies and where do they show up on the financial statements?", id: "LBO7" },
      { q: "Explain the purchase price allocation in an acquisition.", id: "LBO8" },
      { q: "How does goodwill arise in an acquisition?", id: "LBO9" },
      { q: "Walk me through how to model returns in an LBO.", id: "LBO10" },
      { q: "What is the difference between a leveraged and unlevered IRR?", id: "LBO11" },
      { q: "How do you calculate the minimum IRR required for a PE firm?", id: "LBO12" }
    ]
  };

  const els = {
    categoryTabs: document.getElementById("category-tabs"),
    search: document.getElementById("search"),
    questionList: document.getElementById("question-list"),
    answerPanel: document.getElementById("answer-panel"),
    currentQuestion: document.getElementById("current-question"),
    answerInput: document.getElementById("answer-input"),
    submitAnswer: document.getElementById("submit-answer"),
    gradingResult: document.getElementById("grading-result"),
    availableCount: document.getElementById("available-count"),
    statsBar: document.getElementById("stats-bar"),
    statTotal: document.getElementById("stat-total"),
    statAnswered: document.getElementById("stat-answered"),
    statAvg: document.getElementById("stat-avg"),
    questionListView: document.getElementById("question-list-view"),
    answerView: document.getElementById("answer-view"),
    nextQuestionBtn: document.getElementById("next-question-btn"),
    backBtn: document.getElementById("back-btn"),
    questionProgress: document.getElementById("question-progress"),
    emptyState: document.getElementById("empty-state")
  };

  let activeCategory = categories[0];
  let currentQuestion = null;
  let allQuestions = [];
  
  // Flatten all questions with metadata
  Object.keys(questionBank).forEach(cat => {
    questionBank[cat].forEach(item => {
      allQuestions.push({ ...item, category: cat });
    });
  });

  const STORAGE_KEY = "ib_quiz_stars_v1";
  let starsByQuestion = readStars();
  
  function readStars() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") || {}; }
    catch { return {}; }
  }
  
  function writeStars() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(starsByQuestion));
  }

  function getStarRating(id) {
    return starsByQuestion[id] !== undefined ? starsByQuestion[id] : 0;
  }

  function updateStarRating(id, correct) {
    const current = getStarRating(id);
    const newStars = correct ? Math.min(5, current + 1) : Math.max(0, current - 1);
    starsByQuestion[id] = newStars;
    writeStars();
    render();
    updateStats();
  }

  function populateCategories() {
    els.categoryTabs.innerHTML = categories.map(c => 
      `<button class="category-tab ${c === activeCategory ? 'active' : ''}" data-category="${c}">${c}</button>`
    ).join("");
    
    els.categoryTabs.querySelectorAll(".category-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        activeCategory = tab.getAttribute("data-category");
        populateCategories();
        render();
      });
    });
  }

  function filterQuestions(list, term) {
    if (!term) return list;
    const t = term.toLowerCase();
    return list.filter(item => item.q.toLowerCase().includes(t));
  }

  function renderStars(rating) {
    return Array.from({ length: 5 }, (_, i) => 
      `<span class="star ${i < rating ? 'filled' : ''}">${i < rating ? '✓' : ''}</span>`
    ).join("");
  }

  function renderQuestionCard(item) {
    const stars = getStarRating(item.id);
    return `
      <div class="question-card" data-id="${item.id}">
        <div class="question-text">${item.q}</div>
        <div class="question-footer">
          <div class="stars">${renderStars(stars)}</div>
        </div>
      </div>
    `;
  }

  function render() {
    const term = els.search.value.trim();
    const filtered = filterQuestions(questionBank[activeCategory], term);
    
    if (filtered.length === 0) {
      els.emptyState.style.display = "block";
      els.questionList.innerHTML = "";
    } else {
      els.emptyState.style.display = "none";
      els.questionList.innerHTML = filtered.map(renderQuestionCard).join("");
      
      // Bind click events
      els.questionList.querySelectorAll(".question-card").forEach(card => {
        card.addEventListener("click", () => {
          const id = card.getAttribute("data-id");
          const item = allQuestions.find(q => q.id === id);
          openQuestion(item);
        });
      });
    }
    
    updateStats();
  }

  function openQuestion(item) {
    currentQuestion = item;
    els.currentQuestion.textContent = item.q;
    els.answerInput.value = "";
    els.gradingResult.className = "grading-result";
    els.gradingResult.innerHTML = "";
    els.nextQuestionBtn.style.display = "none";
    
    // Update progress text
    const categoryQuestions = questionBank[activeCategory] || [];
    const currentIndex = categoryQuestions.findIndex(q => q.id === item.id);
    els.questionProgress.textContent = `${currentIndex + 1} of ${categoryQuestions.length}`;
    
    els.questionListView.style.display = "none";
    els.answerView.style.display = "block";
    els.answerInput.focus();
  }

  function updateStats() {
    const answered = Object.keys(starsByQuestion).length;
    const avgStars = answered > 0 
      ? (Object.values(starsByQuestion).reduce((a, b) => a + b, 0) / answered).toFixed(1)
      : "0.0";
    
    els.statTotal.textContent = allQuestions.length;
    els.statAnswered.textContent = answered;
    els.statAvg.textContent = avgStars;
    els.statsBar.style.display = "flex";
  }

  async function submitForGrading() {
    if (!currentQuestion) return;
    
    const answer = els.answerInput.value.trim();
    if (!answer) {
      els.answerInput.focus();
      return;
    }

    els.submitAnswer.disabled = true;
    els.submitAnswer.textContent = "Grading...";
    els.nextQuestionBtn.style.display = "none";

    try {
      const response = await fetch('/api/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion.q,
          answer: els.answerInput.value
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Grading failed');
      }

      const correct = result.correct || false;
      const feedback = result.feedback || 'No feedback provided.';
      const correctAnswer = result.correct_answer || '';
      const score = result.score || (correct ? 4 : 2);

      updateStarRating(currentQuestion.id, correct);
      
      els.gradingResult.className = `grading-result show ${correct ? 'correct' : 'incorrect'}`;
      
      let resultHTML = `
        <div class="grading-feedback">
          <strong>${correct ? '✓ Correct!' : '✗ Needs Improvement'}</strong>
          <p>${feedback}</p>
        </div>
      `;
      
      if (correctAnswer) {
        resultHTML += `
          <div class="correct-answer-box">
            <strong>Correct Answer:</strong>
            <p>${correctAnswer}</p>
          </div>
        `;
      }
      
      resultHTML += `
        <div class="grading-stars">
          <span>Progress: ${renderStars(getStarRating(currentQuestion.id))} / 5</span>
        </div>
      `;
      
      els.gradingResult.innerHTML = resultHTML;
      
      els.nextQuestionBtn.style.display = "block";
      els.answerInput.blur();

    } catch (err) {
      els.gradingResult.className = "grading-result show incorrect";
      els.gradingResult.innerHTML = `
        <div class="grading-feedback">
          <strong>⚠ Grading Failed</strong>
          <p>Unable to connect to AI grader. Please check your internet connection and try again.</p>
        </div>
      `;
      els.nextQuestionBtn.style.display = "block";
      console.error(err);
    } finally {
      els.submitAnswer.disabled = false;
      els.submitAnswer.textContent = "Submit Answer";
    }
  }

  function nextQuestion() {
    const currentIndex = allQuestions.findIndex(q => q.id === currentQuestion.id && q.category === activeCategory);
    const filtered = filterQuestions(questionBank[activeCategory], els.search.value.trim());
    
    let nextItem = null;
    for (let i = currentIndex + 1; i < filtered.length; i++) {
      if (filtered[i]) {
        nextItem = filtered[i];
        break;
      }
    }
    
    if (!nextItem && filtered.length > 0) {
      nextItem = filtered[0];
    }
    
    if (nextItem) {
      openQuestion(nextItem);
    } else {
      els.questionListView.style.display = "block";
      els.answerView.style.display = "none";
    }
    els.nextQuestionBtn.style.display = "none";
  }

  function showMainApp() {
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('main-app').style.display = 'flex';
  }

  function init() {
    els.search.addEventListener("input", render);
    els.submitAnswer.addEventListener("click", submitForGrading);
    els.nextQuestionBtn.addEventListener("click", nextQuestion);
    els.backBtn.addEventListener("click", () => {
      els.questionListView.style.display = "block";
      els.answerView.style.display = "none";
    });
    document.getElementById('enter-btn').addEventListener("click", showMainApp);
    
    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && e.metaKey && els.answerView.style.display !== "none") {
        e.preventDefault();
        submitForGrading();
      }
    });
    
    populateCategories();
    render();
    updateStats();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
