(() => {
  const categories = [
    "Financial Statements", "Concepts", "Calculations"
  ];

  const questionBank = {
    "Financial Statements": [
      { q: "What are the three financial statements, and why do we need them?", id: "FS1" },
      { q: "How do the financial statements link together?", id: "FS2" },
      { q: "What's the most important financial statement?", id: "FS3" },
      { q: "How might the financial statements of a company in the U.K. or Germany be different from those of a company based in the U.S.?", id: "FS4" }
    ],
    "Concepts": [
      { q: "How do you know when a revenue or expense line item should appear on the Income Statement?", id: "C1" },
      { q: "A company collects cash payments from customers for a monthly subscription service one year in advance. Why do companies do this, and what is the cash flow impact?", id: "C2" },
      { q: "Why is Accounts Receivable (AR) an Asset but Deferred Revenue (DR) a Liability?", id: "C3" },
      { q: "What are \"Deferred Taxes,\" and how do they affect the statements?", id: "C4" },
      { q: "A junior accountant in your department asks about how to fund the company's operations via external sources and how they impact the financial statements. What do you say?", id: "C5" },
      { q: "Your firm recently acquired another company for $1,000 and created Goodwill of $400 and Other Intangible Assets of $200 on the Balance Sheet. A junior accountant in your department asks you why your firm did this – how would you respond?", id: "C6" },
      { q: "Explain lease accounting on the financial statements under IFRS 16 / ASC 842, including the differences between Operating Leases and Finance Leases.", id: "C7" },
      { q: "What's the difference between Deferred Tax Assets and Deferred Tax Liabilities? How do Net Operating Losses (NOLs) factor in?", id: "C8" },
      { q: "How do you calculate Free Cash Flow (FCF), and what does it mean?", id: "C9" },
      { q: "What is Working Capital? What does it mean if it's positive or negative?", id: "C10" },
      { q: "What does the Change in Working Capital mean?", id: "C11" },
      { q: "In its filings, a company states that EBITDA is a \"proxy\" for its Cash Flow from Operations. The company's EBITDA has been positive, growing at 20% for the past three years. However, the company recently ran low on Cash and filed for bankruptcy. How could this have happened?", id: "C12" },
      { q: "How do you calculate Return on Invested Capital (ROIC), and what does it tell you?", id: "C13" },
      { q: "What are the advantages and disadvantages of ROE, ROA, and ROIC for measuring company performance?", id: "C14" }
    ],
    "Calculations": [
      { q: "A company hires a new employee for a total cost of $100,000 per year. Walk me through how the financial statements change, assuming a 25% tax rate.", id: "CALC1" },
      { q: "You go into a job interview, and the interviewer points out that every single Interview Guide has a question about how Depreciation going up by $10 affects the statements. So, he asks you to walk through a $10 *decrease* in Depreciation, assuming a 25% tax rate.", id: "CALC2" },
      { q: "A company's CEO has decided to sell all its assets, starting with a factory recorded at a book value of $100 on its Balance Sheet. If this factory sells for $140, how do the statements change?", id: "CALC3" },
      { q: "Walk me through the financial statements when a customer orders a product for $100 and receives it but hasn't yet paid for it. Then, walk me through the cash collection, combining it with the first step. Ignore COGS and other delivery costs for simplicity.", id: "CALC4" },
      { q: "A company hires a marketing agency to run an online advertising campaign for its services. The marketing agency charges $10,000 for this initial campaign, delivers it, and invoices the company, which has 60 days to pay. Walk me through the statements.", id: "CALC5" },
      { q: "Now, walk me through what happens ONLY in Step 2, when the company finally makes payment after 60 days. Also, explain intuitively what happens from start to finish.", id: "CALC6" },
      { q: "Your friend's e-commerce company orders $200 of products from its main supplier. A month later, it sells these products for $500. Walk me through each step of this process SEPARATELY.", id: "CALC7" },
      { q: "A Software-as-a-Service (SaaS) company bills customers upfront for an entire year of service and collects the cash before the contract begins. Walk me through the process for a $250 contract with a $50 delivery cost between January 1 and December 31 of the year. COMBINE the cash collection and revenue recognition.", id: "CALC8" },
      { q: "A company with 1000 shares issues 500 new shares worth $1.00 on January 1 to fund its business. Then, it decides to issue Dividends per Share of $0.10 to all its shareholders at the end of the year. Walk me through both steps SEPARATELY on the statements.", id: "CALC9" },
      { q: "A company issues $200 of Debt at a 10% interest rate. Walk me through the entire first year on the statements, including the initial issuance and the full interest payment. COMBINE both steps.", id: "CALC10" },
      { q: "How does this change if, in addition to the 10% interest rate, the Debt now has a 20% principal repayment each year? Combine both steps and assume the principal repayment occurs on December 31.", id: "CALC11" },
      { q: "A company that follows U.S. GAAP signs a 10-year Operating Lease on January 1. It will pay $160 in Rent each year. Assuming a 5% Discount Rate, walk me through the financial statements over this entire year. For simplicity, you may \"round\" and assume the Present Value of the lease payments equals $1,200.", id: "CALC12" }
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
