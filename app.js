// Análisis Documental Instantáneo de Sustentabilidad - Main Application

// Application Data Store
const appData = {
  teckQuebradaBlanca: {
    company: "Teck Quebrada Blanca",
    sector: "Minería",
    document: "Reporte Sustentabilidad Teck Quebrada Blanca 2024",
    pages: "2,450 páginas",
    processingTime: "18 segundos",
    overallScore: 72,
    scores: {
      environmental: 65,
      social: 72,
      governance: 78
    },
    criticalAreas: [
      {
        id: "hidrica",
        icon: "💧",
        name: "Gestión Hídrica",
        description: "Dependencia excesiva de aguas superficiales",
        score: 65,
        level: "high",
        investment: "$15M USD",
        timeline: "18 meses",
        roi: "60% reducción riesgo hídrico",
        normativas: ["DGA decreto 203", "Código de aguas"]
      },
      {
        id: "relaves",
        icon: "⚠️",
        name: "Gestión de Relaves",
        description: "Monitoreo geotécnico manual",
        score: 78,
        level: "medium",
        investment: "$2.5M USD",
        timeline: "8 meses",
        roi: "99% reducción riesgo falla",
        normativas: ["DS 248/2007", "Guía técnica SERNAGEOMIN"]
      },
      {
        id: "comunidad",
        icon: "🤝",
        name: "Relaciones Comunitarias",
        description: "Falta programa desarrollo local",
        score: 72,
        level: "medium",
        investment: "$5M USD (5 años)",
        timeline: "Continuo",
        roi: "Licencia social operación",
        normativas: ["Convenio 169 OIT", "Ley consulta indígena"]
      }
    ],
    recommendations: [
      {
        priority: "high",
        title: "Planta Desalinización 50,000 m³/día",
        description: "Reducir dependencia de aguas superficiales y mitigar riesgo hídrico",
        investment: "$15M USD",
        timeline: "18 meses",
        roi: "60% reducción riesgo hídrico",
        category: "immediate"
      },
      {
        priority: "medium",
        title: "Sistema Monitoreo IoT Automatizado",
        description: "Mejorar monitoreo geotécnico de relaves con tecnología IoT",
        investment: "$2.5M USD",
        timeline: "8 meses",
        roi: "99% reducción riesgo falla",
        category: "short-term"
      },
      {
        priority: "medium",
        title: "Fondo Desarrollo Comunitario",
        description: "Programa integral de desarrollo local y relacionamiento comunitario",
        investment: "$1M USD/año",
        timeline: "Continuo",
        roi: "Fortalecimiento licencia social",
        category: "short-term"
      }
    ]
  },
  
  chatResponses: {
    patterns: {
      hidrica: {
        keywords: ["agua", "hídrica", "hídrico", "desalinización", "consumo"],
        response: "El análisis identifica que Teck Quebrada Blanca tiene una dependencia crítica de aguas superficiales (65/100). La recomendación principal es implementar una planta de desalinización de 50,000 m³/día por $15M USD, lo que reduciría el riesgo hídrico en 60% y garantizaría suministro a largo plazo. ¿Te interesa conocer más detalles técnicos o el plan de implementación?"
      },
      relaves: {
        keywords: ["relaves", "geotécnico", "monitoreo", "iot", "automatización"],
        response: "La gestión de relaves muestra oportunidades de mejora (78/100). Actualmente el monitoreo es manual, lo que genera riesgos. Un sistema IoT automatizado costaría $2.5M USD e implementaría sensores en tiempo real, reduciendo 99% el riesgo de fallas. Incluye alertas tempranas y cumplimiento DS 248/2007. ¿Quieres ver las especificaciones técnicas?"
      },
      comunidad: {
        keywords: ["comunidad", "social", "relacionamiento", "indígena", "local"],
        response: "Las relaciones comunitarias tienen potencial de fortalecimiento (72/100). Se recomienda un Fondo de Desarrollo Comunitario de $1M/año enfocado en educación, salud y emprendimiento local. Esto fortalecería la licencia social y cumpliría con el Convenio 169 OIT. ¿Te interesa conocer programas específicos por implementar?"
      },
      normativas: {
        keywords: ["normativa", "regulación", "cumplimiento", "iso", "dga", "sma"],
        response: "Teck tiene buen cumplimiento general pero con gaps específicos: ✅ ISO 14001 vigente, ⚠️ DGA 203 requiere actualización, ❌ DS 248/2007 presenta incumplimientos. Prioridad en monitoreo automatizado de relaves y optimización uso hídrico. ¿Necesitas un cronograma de actualizaciones regulatorias?"
      },
      iso: {
        keywords: ["iso", "certificación", "14001", "45001", "26000", "50001"],
        response: "Análisis de certificaciones ISO: ISO 14001 (Sistema Gestión Ambiental) vigente hasta 2025, oportunidad para ISO 50001 (Gestión Energética) con ROI 15-20% en 2 años, e ISO 45001 (Seguridad) recomendada para sector minero. Plan integrado costaría $300K con beneficios de $1.2M anuales. ¿Priorizamos alguna certificación específica?"
      }
    },
    
    defaultResponses: [
      "Basándome en el análisis de Teck Quebrada Blanca, he identificado oportunidades específicas en gestión hídrica, relaves y relacionamiento comunitario. ¿Qué área te interesa explorar en detalle?",
      "El reporte muestra un score ESG de 72/100 con fortalezas en gobernanza (78) y oportunidades en gestión ambiental (65). ¿Quieres conocer las recomendaciones prioritarias?",
      "Como especialista en normativas chilenas, puedo ayudarte con compliance específico para minería: SEIA, DGA, SERNAGEOMIN, SMA. ¿Qué regulación específica te preocupa?",
      "He procesado 2,450 páginas en 18 segundos identificando 12 acciones recomendadas. Las 3 prioritarias generarían $22.5M en valor con ROI promedio 18 meses. ¿Empezamos por la más crítica?"
    ]
  }
};

// Global Application State
let appState = {
  currentDocument: null,
  isAnalyzing: false,
  processingStep: 1,
  chatHistory: [],
  charts: {},
  isDemoMode: false
};

// Initialize Application
document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
  setupEventListeners();
  initializeUploadZone();
  
  // Add initial chat message
  appState.chatHistory.push({
    type: 'ai',
    content: '¡Hola! Soy tu especialista IA en sustentabilidad. Puedo analizar documentos ESG, reportes de sustentabilidad, certificaciones y más. ¿En qué puedo ayudarte?',
    timestamp: new Date()
  });
}

function setupEventListeners() {
  // Demo buttons - both header and hero CTA
  const demoBtns = [
    document.getElementById('demo-btn'),
    document.getElementById('demo-cta-btn')
  ];
  
  demoBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', runTeckDemo);
    }
  });
  
  // File upload
  document.getElementById('select-file-btn')?.addEventListener('click', () => {
    document.getElementById('file-input')?.click();
  });
  
  document.getElementById('file-input')?.addEventListener('change', handleFileSelect);
  
  // Chat interface
  document.getElementById('chat-toggle')?.addEventListener('click', toggleChat);
  document.getElementById('chat-close')?.addEventListener('click', closeChat);
  document.getElementById('send-message')?.addEventListener('click', sendMessage);
  document.getElementById('chat-input')?.addEventListener('keypress', handleChatKeypress);
  
  // Topic buttons
  document.addEventListener('click', handleTopicClick);
  
  // Results actions
  document.getElementById('new-analysis')?.addEventListener('click', resetToHome);
  document.getElementById('export-report')?.addEventListener('click', exportReport);
  
  // Priority filters
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', handlePriorityFilter);
  });
  
  // Modal
  document.getElementById('modal-close')?.addEventListener('click', closeModal);
  document.addEventListener('click', handleModalBackdrop);
}

function initializeUploadZone() {
  const uploadZone = document.getElementById('upload-zone');
  if (!uploadZone) return;
  
  // Drag and drop events
  uploadZone.addEventListener('dragover', handleDragOver);
  uploadZone.addEventListener('dragleave', handleDragLeave);
  uploadZone.addEventListener('drop', handleFileDrop);
  uploadZone.addEventListener('click', () => {
    document.getElementById('file-input')?.click();
  });
}

function handleDragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
}

function handleFileDrop(e) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  
  const files = Array.from(e.dataTransfer.files);
  if (files.length > 0) {
    processDocument(files[0]);
  }
}

function handleFileSelect(e) {
  const files = Array.from(e.target.files);
  if (files.length > 0) {
    processDocument(files[0]);
  }
}

function runTeckDemo() {
  console.log('Running Teck Demo...');
  appState.isDemoMode = true;
  
  // Create a mock file for demo
  const mockFile = {
    name: "Reporte_Sustentabilidad_Teck_QB_2024.pdf",
    size: 15728640, // 15MB
    type: "application/pdf"
  };
  
  processDocument(mockFile);
}

function processDocument(file) {
  if (appState.isAnalyzing) return;
  
  console.log('Processing document:', file.name);
  appState.isAnalyzing = true;
  appState.currentDocument = file;
  
  // Show loading overlay
  showLoadingOverlay();
  
  // Start processing animation
  startProcessingAnimation();
  
  // Simulate AI processing steps with realistic timing
  setTimeout(() => completeAnalysis(), 4500);
}

function showLoadingOverlay() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    overlay.classList.remove('hidden');
    overlay.classList.add('animate-fade-in');
  }
}

function hideLoadingOverlay() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    overlay.classList.add('hidden');
  }
}

function startProcessingAnimation() {
  const steps = [
    { id: 'step-1', text: 'Extrayendo datos ESG del documento...', delay: 0 },
    { id: 'step-2', text: 'Analizando compliance con normativas chilenas...', delay: 1200 },
    { id: 'step-3', text: 'Calculando scores de sustentabilidad...', delay: 2400 },
    { id: 'step-4', text: 'Generando recomendaciones personalizadas...', delay: 3600 }
  ];
  
  steps.forEach((step, index) => {
    setTimeout(() => {
      // Deactivate previous steps
      document.querySelectorAll('.step-item').forEach(s => s.classList.remove('active'));
      
      // Activate current step
      const stepElement = document.getElementById(step.id);
      if (stepElement) {
        stepElement.classList.add('active');
        
        // Update processing text
        const processingText = document.getElementById('processing-text');
        if (processingText) {
          processingText.textContent = step.text;
        }
      }
    }, step.delay);
  });
}

function completeAnalysis() {
  console.log('Analysis complete!');
  appState.isAnalyzing = false;
  
  // Hide loading and show results
  hideLoadingOverlay();
  document.getElementById('hero-section')?.classList.add('hidden');
  document.getElementById('results-section')?.classList.remove('hidden');
  
  // Populate results
  populateResults();
  
  // Create charts with delay to ensure DOM is ready
  setTimeout(createCharts, 800);
  
  // Add success message to chat
  appState.chatHistory.push({
    type: 'ai',
    content: `¡Análisis completado! He procesado ${appState.isDemoMode ? 'el reporte de Teck Quebrada Blanca' : appState.currentDocument.name} e identificado áreas clave de mejora. Tu score ESG es 72/100 con oportunidades específicas en gestión hídrica. ¿Qué te gustaría explorar primero?`,
    timestamp: new Date()
  });

  // Show success notification
  showNotification('Análisis completado exitosamente. Score ESG: 72/100', 'success');
}

function populateResults() {
  if (!appState.isDemoMode) return;
  
  const data = appData.teckQuebradaBlanca;
  
  // Update document info
  const docNameEl = document.getElementById('document-name');
  const docMetaEl = document.getElementById('document-meta');
  
  if (docNameEl) docNameEl.textContent = data.document;
  if (docMetaEl) {
    docMetaEl.textContent = `${data.sector} • ${data.pages} • Procesado en ${data.processingTime}`;
  }
  
  // Animate score updates with delay
  setTimeout(() => {
    animateScore('overall-score', data.overallScore);
    updateScoreCircle(data.overallScore);
  }, 300);
  
  // Update score bars with animation
  setTimeout(() => {
    updateScoreBars(data.scores);
  }, 800);
}

function animateScore(elementId, targetScore) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  let currentScore = 0;
  const increment = targetScore / 40; // Slower animation for better effect
  const timer = setInterval(() => {
    currentScore += increment;
    if (currentScore >= targetScore) {
      currentScore = targetScore;
      clearInterval(timer);
    }
    element.textContent = Math.round(currentScore);
  }, 40);
}

function updateScoreBars(scores) {
  const scoreElements = [
    { element: document.querySelector('.score-fill.env'), score: scores.environmental, valueEl: document.querySelector('.score-fill.env')?.parentElement?.nextElementSibling },
    { element: document.querySelector('.score-fill.social'), score: scores.social, valueEl: document.querySelector('.score-fill.social')?.parentElement?.nextElementSibling },
    { element: document.querySelector('.score-fill.gov'), score: scores.governance, valueEl: document.querySelector('.score-fill.gov')?.parentElement?.nextElementSibling }
  ];
  
  scoreElements.forEach(({ element, score, valueEl }, index) => {
    if (element && valueEl) {
      setTimeout(() => {
        element.style.width = `${score}%`;
        valueEl.textContent = score;
      }, index * 200);
    }
  });
}

function updateScoreCircle(score) {
  const circle = document.getElementById('score-circle');
  if (!circle) return;
  
  const percentage = score / 100;
  const degrees = percentage * 360;
  
  circle.style.background = `conic-gradient(
    var(--color-primary) 0deg ${degrees}deg,
    var(--color-secondary) ${degrees}deg 360deg
  )`;
}

function createCharts() {
  createESGTrendChart();
  createBenchmarkChart();
}

function createESGTrendChart() {
  const ctx = document.getElementById('esg-trend-chart')?.getContext('2d');
  if (!ctx) return;
  
  // Generate trend data
  const months = ['Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const baseScore = appState.isDemoMode ? 72 : 65;
  const trendData = months.map((_, i) => baseScore - 10 + (i * 2) + Math.random() * 3);
  
  if (appState.charts.esgTrend) {
    appState.charts.esgTrend.destroy();
  }
  
  appState.charts.esgTrend = new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [{
        label: 'Score ESG',
        data: trendData,
        borderColor: '#1FB8CD',
        backgroundColor: 'rgba(31, 184, 205, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#1FB8CD',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(19, 52, 59, 0.9)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: '#1FB8CD',
          borderWidth: 1
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          min: 50,
          max: 100,
          grid: {
            color: 'rgba(167, 169, 169, 0.1)'
          },
          ticks: {
            color: '#626C71'
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#626C71'
          }
        }
      }
    }
  });
}

function createBenchmarkChart() {
  const ctx = document.getElementById('benchmark-chart')?.getContext('2d');
  if (!ctx) return;
  
  if (appState.charts.benchmark) {
    appState.charts.benchmark.destroy();
  }
  
  appState.charts.benchmark = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Tu empresa', 'Promedio sector', 'Top 10%'],
      datasets: [{
        data: [72, 60, 85],
        backgroundColor: ['#1FB8CD', '#B4413C', '#5D878F'],
        borderRadius: 8,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(19, 52, 59, 0.9)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: '#1FB8CD',
          borderWidth: 1
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          grid: {
            color: 'rgba(167, 169, 169, 0.1)'
          },
          ticks: {
            color: '#626C71'
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#626C71'
          }
        }
      }
    }
  });
}

// Chat Functionality
function toggleChat() {
  const chatInterface = document.getElementById('chat-interface');
  if (!chatInterface) return;
  
  if (chatInterface.classList.contains('hidden')) {
    openChat();
  } else {
    closeChat();
  }
}

function openChat() {
  const chatInterface = document.getElementById('chat-interface');
  if (chatInterface) {
    chatInterface.classList.remove('hidden');
    chatInterface.classList.add('animate-slide-up');
    renderChatMessages();
    focusChatInput();
  }
}

function closeChat() {
  const chatInterface = document.getElementById('chat-interface');
  if (chatInterface) {
    chatInterface.classList.add('hidden');
  }
}

function sendMessage() {
  const input = document.getElementById('chat-input');
  const message = input?.value.trim();
  
  if (!message) return;
  
  // Add user message
  appState.chatHistory.push({
    type: 'user',
    content: message,
    timestamp: new Date()
  });
  
  // Clear input
  input.value = '';
  
  // Render messages
  renderChatMessages();
  
  // Generate AI response
  setTimeout(() => {
    const aiResponse = generateAIResponse(message);
    appState.chatHistory.push({
      type: 'ai',
      content: aiResponse,
      timestamp: new Date()
    });
    renderChatMessages();
  }, 1000);
}

function handleChatKeypress(e) {
  if (e.key === 'Enter') {
    sendMessage();
  }
}

function handleTopicClick(e) {
  if (e.target.classList.contains('topic-btn')) {
    const topic = e.target.dataset.topic;
    const chatInput = document.getElementById('chat-input');
    
    if (chatInput && topic) {
      const questions = {
        hidrica: '¿Cómo puedo mejorar la gestión hídrica de mi operación?',
        relaves: '¿Qué tecnologías recomiendas para monitoreo de relaves?',
        normativas: '¿Qué normativas chilenas debo cumplir en minería?',
        iso: '¿Qué certificaciones ISO me convienen más?'
      };
      
      chatInput.value = questions[topic] || '';
      sendMessage();
    }
  }
}

function generateAIResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // Check for specific patterns
  for (const [topic, data] of Object.entries(appData.chatResponses.patterns)) {
    if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
      return data.response;
    }
  }
  
  // Return random default response
  const defaultResponses = appData.chatResponses.defaultResponses;
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

function renderChatMessages() {
  const messagesContainer = document.getElementById('chat-messages');
  if (!messagesContainer) return;
  
  messagesContainer.innerHTML = appState.chatHistory.map((msg, index) => `
    <div class="message ${msg.type}-message">
      <div class="message-avatar">${msg.type === 'ai' ? '🤖' : '👤'}</div>
      <div class="message-content">
        <p>${msg.content}</p>
        ${msg.type === 'ai' && index === 0 ? `
          <div class="quick-topics">
            <button class="topic-btn" data-topic="hidrica">Gestión Hídrica</button>
            <button class="topic-btn" data-topic="relaves">Gestión Relaves</button>
            <button class="topic-btn" data-topic="normativas">Normativas Chilenas</button>
            <button class="topic-btn" data-topic="iso">Certificaciones ISO</button>
          </div>
        ` : ''}
      </div>
    </div>
  `).join('');
  
  // Scroll to bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function focusChatInput() {
  setTimeout(() => {
    document.getElementById('chat-input')?.focus();
  }, 300);
}

// Area Detail Modal
function showAreaDetail(areaId) {
  const area = appData.teckQuebradaBlanca.criticalAreas.find(a => a.id === areaId);
  if (!area) return;
  
  document.getElementById('area-title').textContent = area.name;
  
  const content = `
    <div class="area-detail">
      <div class="area-summary">
        <div class="area-icon">${area.icon}</div>
        <div class="area-info">
          <h3>${area.name}</h3>
          <p>${area.description}</p>
          <div class="area-score">
            <span class="score-label">Score actual:</span>
            <span class="score-value ${area.level}">${area.score}/100</span>
          </div>
        </div>
      </div>
      
      <div class="area-details">
        <div class="detail-section">
          <h4>💰 Inversión Recomendada</h4>
          <p>${area.investment}</p>
        </div>
        
        <div class="detail-section">
          <h4>⏰ Timeline de Implementación</h4>
          <p>${area.timeline}</p>
        </div>
        
        <div class="detail-section">
          <h4>📈 ROI Esperado</h4>
          <p>${area.roi}</p>
        </div>
        
        <div class="detail-section">
          <h4>📋 Normativas Aplicables</h4>
          <ul>
            ${area.normativas.map(norm => `<li>${norm}</li>`).join('')}
          </ul>
        </div>
        
        <div class="action-buttons">
          <button class="btn btn--primary">Solicitar Cotización</button>
          <button class="btn btn--outline">Descargar Plan Detallado</button>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('area-detail-content').innerHTML = content;
  document.getElementById('area-detail-modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('area-detail-modal')?.classList.add('hidden');
}

function handleModalBackdrop(e) {
  if (e.target.classList.contains('modal-backdrop')) {
    closeModal();
  }
}

// Priority Filter
function handlePriorityFilter(e) {
  if (!e.target.classList.contains('filter-btn')) return;
  
  // Update active filter
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  e.target.classList.add('active');
  
  const priority = e.target.dataset.priority;
  
  // Filter recommendations
  document.querySelectorAll('.recommendation-item').forEach(item => {
    if (priority === 'all') {
      item.style.display = 'flex';
    } else if (priority === 'immediate' && item.classList.contains('high-priority')) {
      item.style.display = 'flex';
    } else if (priority === 'short-term' && item.classList.contains('medium-priority')) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

// Utility Functions
function resetToHome() {
  document.getElementById('results-section')?.classList.add('hidden');
  document.getElementById('hero-section')?.classList.remove('hidden');
  
  // Reset state
  appState.currentDocument = null;
  appState.isDemoMode = false;
  
  // Clear file input
  const fileInput = document.getElementById('file-input');
  if (fileInput) fileInput.value = '';
  
  // Destroy charts
  Object.values(appState.charts).forEach(chart => {
    if (chart && typeof chart.destroy === 'function') {
      chart.destroy();
    }
  });
  appState.charts = {};
  
  showNotification('Lista para nuevo análisis', 'info');
}

function exportReport() {
  showNotification('Generando reporte ejecutivo...', 'info');
  
  // Simulate report generation
  setTimeout(() => {
    showNotification('Reporte ejecutivo generado y descargando...', 'success');
    
    // Simulate file download
    const link = document.createElement('a');
    link.download = 'Reporte_ESG_Teck_QB_2024.pdf';
    link.href = '#'; // In real app, this would be a blob URL
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, 1500);
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `status status--${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10002;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    animation: slideInUp 0.3s ease-out;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'fadeOut 0.3s ease-out forwards';
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// Initialize global functions for HTML onclick handlers
window.showAreaDetail = showAreaDetail;
window.closeModal = closeModal;

// Add CSS for notifications animation
const notificationStyles = `
@keyframes fadeOut {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-10px); }
}

.area-detail {
  max-width: 100%;
}

.area-summary {
  display: flex;
  align-items: center;
  gap: var(--space-16);
  margin-bottom: var(--space-24);
  padding: var(--space-20);
  background: var(--color-bg-1);
  border-radius: var(--radius-lg);
}

.area-icon {
  font-size: var(--font-size-4xl);
}

.area-info h3 {
  color: var(--color-text);
  margin-bottom: var(--space-8);
}

.area-info p {
  color: var(--color-text-secondary);
  margin-bottom: var(--space-12);
}

.area-score {
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.score-label {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.score-value {
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-lg);
}

.score-value.high {
  color: var(--color-error);
}

.score-value.medium {
  color: var(--color-warning);
}

.area-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-20);
  margin-bottom: var(--space-24);
}

.detail-section {
  padding: var(--space-16);
  background: var(--color-surface);
  border-radius: var(--radius-base);
  border: 1px solid var(--color-border);
}

.detail-section h4 {
  color: var(--color-text);
  margin-bottom: var(--space-8);
  font-size: var(--font-size-base);
}

.detail-section p {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin: 0;
}

.detail-section ul {
  margin: 0;
  padding-left: var(--space-16);
}

.detail-section li {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin-bottom: var(--space-4);
}

.action-buttons {
  grid-column: 1 / -1;
  display: flex;
  gap: var(--space-12);
  justify-content: center;
  padding-top: var(--space-20);
  border-top: 1px solid var(--color-border);
}

.hero-cta {
  margin-top: var(--space-16);
}
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);