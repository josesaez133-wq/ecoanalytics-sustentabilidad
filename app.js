// EcoAnalytics - Agente IA de Cumplimiento Normativo Chile
// Funcionalidad JavaScript principal

// Estado global de la aplicación
const appState = {
    uploadedFiles: [],
    currentAnalysis: null,
    activeTab: 'immediate',
    isAnalyzing: false
};

// Datos de ejemplo para Empresa Manufacturera Genérica
const genericCompanyData = {
    company: "Empresa Manufacturera S.A.",
    sector: "Manufactura",
    analysisTime: "18 segundos",
    overallScore: 78,
    complianceScores: {
        ds90: 85, // DS 90/2000 - Residuos Líquidos
        nch1333: 65, // NCh 1333 - Calidad Aguas Riego
        ds148: 45, // DS 148/2003 - Residuos Peligrosos
        ds594: 88, // DS 594/1999 - Seguridad Laboral
        seia: 72  // SEIA - Impacto Ambiental
    },
    criticalIssues: [
        {
            id: 'ds148',
            title: 'DS 148/2003 - Residuos Peligrosos',
            description: 'Falta declaración anual RETC. Plan de manejo desactualizado desde 2022.',
            severity: 'critical',
            riskFine: '$2M - $15M UTM',
            deadline: '30 días',
            icon: '⚠️'
        },
        {
            id: 'nch1333',
            title: 'NCh 1333 - Calidad Aguas Riego',
            description: 'Parámetros de boro y conductividad eléctrica exceden límites permitidos.',
            severity: 'warning',
            findings: 'Boro: 3.2 mg/L (máx 2.0)',
            action: 'Sistema tratamiento',
            icon: '🌾'
        },
        {
            id: 'seia',
            title: 'SEIA - Evaluación Impacto Ambiental',
            description: 'RCA vigente pero próxima a modificación. Monitoreo incompleto últimos 6 meses.',
            severity: 'moderate',
            status: 'Vigente hasta 2026',
            pending: '3 informes semestrales',
            icon: '📋'
        }
    ],
    actionPlan: {
        immediate: [
            {
                title: 'Actualizar Declaración RETC DS148',
                description: 'Completar y enviar declaración anual de residuos peligrosos. Actualizar plan de manejo.',
                cost: '$500K CLP',
                time: '15 días',
                impact: 'Evita multas $15M',
                priority: 'critical',
                icon: '📄'
            },
            {
                title: 'Análisis Calidad Aguas NCh1333',
                description: 'Realizar análisis completo de parámetros según NCh1333 para aguas de riego.',
                cost: '$200K CLP',
                time: '7 días',
                benefit: 'Compliance agua',
                priority: 'high',
                icon: '🧪'
            }
        ],
        short: [
            {
                title: 'Sistema Tratamiento Aguas DS90',
                description: 'Implementar sistema de tratamiento para cumplir límites DS90 en descargas.',
                investment: '$45M CLP',
                time: '4 meses',
                roi: 'Compliance DS90',
                priority: 'medium',
                icon: '🏭'
            },
            {
                title: 'Certificación ISO 14001',
                description: 'Implementar sistema de gestión ambiental bajo estándar ISO 14001:2015.',
                investment: '$8M CLP',
                time: '6 meses',
                benefit: 'Certificación internacional',
                priority: 'medium',
                icon: '🏆'
            }
        ],
        medium: [
            {
                title: 'Transformación Digital Ambiental',
                description: 'Implementar plataforma integrada de monitoreo y reportes ambientales automáticos.',
                investment: '$150M CLP',
                time: '12 meses',
                roi: 'Automatización 80%',
                priority: 'strategic',
                icon: '🌱'
            }
        ]
    }
};

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    animateElements();
});

function initializeApp() {
    // Configurar círculo de progreso del score
    animateScoreCircle();
    
    // Configurar tabs de plan de acción
    setupActionTabs();
    
    // Configurar zona de upload
    setupUploadZone();
    
    // Mostrar datos de ejemplo
    displayGenericAnalysis();
    
    // Configurar animaciones de scores
    setTimeout(() => {
        animateComplianceScores();
    }, 1000);
}

function setupEventListeners() {
    // Botón demo
    const demoBtn = document.getElementById('demo-btn');
    if (demoBtn) {
        demoBtn.addEventListener('click', showDemoAnalysis);
    }
    
    // Botón contacto/asesoría
    const contactBtn = document.getElementById('contact-btn');
    if (contactBtn) {
        contactBtn.addEventListener('click', openContactModal);
    }
    
    // Input de archivos
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }
    
    // Zona de drag & drop
    const uploadZone = document.getElementById('upload-zone');
    if (uploadZone) {
        uploadZone.addEventListener('dragover', handleDragOver);
        uploadZone.addEventListener('dragleave', handleDragLeave);
        uploadZone.addEventListener('drop', handleDrop);
        uploadZone.addEventListener('click', () => {
            document.getElementById('file-input').click();
        });
    }
    
    // Botones CTA
    const startFreeBtn = document.getElementById('start-free-btn');
    if (startFreeBtn) {
        startFreeBtn.addEventListener('click', () => {
            document.getElementById('file-input').click();
        });
    }
    
    const scheduleDemoBtn = document.getElementById('schedule-demo-btn');
    if (scheduleDemoBtn) {
        scheduleDemoBtn.addEventListener('click', openContactModal);
    }
    
    // Modal de contacto
    setupContactModal();
    
    // Botones de acciones
    setupActionButtons();
}

function animateScoreCircle() {
    const circle = document.querySelector('.circle-progress');
    if (circle) {
        const percentage = genericCompanyData.overallScore;
        
        // Animar el círculo de progreso
        setTimeout(() => {
            const gradient = `conic-gradient(#00d4aa ${percentage}%, #f1f5f9 0%)`;
            circle.style.background = gradient;
        }, 500);
    }
}

function setupActionTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Actualizar botones activos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Actualizar contenido activo
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
            
            appState.activeTab = tabId;
            
            // Animar entrada del contenido
            const activeContent = document.getElementById(tabId);
            if (activeContent) {
                activeContent.style.opacity = '0';
                activeContent.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    activeContent.style.transition = 'all 0.3s ease';
                    activeContent.style.opacity = '1';
                    activeContent.style.transform = 'translateY(0)';
                }, 50);
            }
        });
    });
}

function setupUploadZone() {
    const uploadZone = document.getElementById('upload-zone');
    
    if (uploadZone) {
        uploadZone.style.cursor = 'pointer';
    }
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.style.borderColor = '#00d4aa';
    e.currentTarget.style.backgroundColor = 'rgba(0, 212, 170, 0.1)';
    e.currentTarget.style.transform = 'scale(1.02)';
}

function handleDragLeave(e) {
    e.preventDefault();
    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    e.currentTarget.style.transform = 'scale(1)';
}

function handleDrop(e) {
    e.preventDefault();
    handleDragLeave(e);
    
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
}

function handleFileUpload(e) {
    const files = Array.from(e.target.files);
    processFiles(files);
}

function processFiles(files) {
    if (files.length === 0 || appState.isAnalyzing) return;
    
    appState.isAnalyzing = true;
    appState.uploadedFiles = files;
    
    // Mostrar overlay de análisis
    showAnalysisModal();
    
    // Simular proceso de análisis
    setTimeout(() => {
        hideAnalysisModal();
        showAnalysisResults(files);
        appState.isAnalyzing = false;
    }, 6000);
}

function showAnalysisModal() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.classList.remove('hidden');
        animateAnalysisSteps();
    }
}

function animateAnalysisSteps() {
    const steps = [
        { id: 'step-1', text: '📄 Extrayendo datos', delay: 0 },
        { id: 'step-2', text: '⚖️ Verificando DS y normativas', delay: 1500 },
        { id: 'step-3', text: '📊 Calculando scores ESG', delay: 3000 },
        { id: 'step-4', text: '💡 Generando plan de acción', delay: 4500 }
    ];
    
    const processingText = document.getElementById('processing-text');
    const detailedTexts = [
        'Extrayendo datos y verificando cumplimiento normativo...',
        'Analizando DS90, NCh1333, DS148 y otras normativas...',
        'Calculando scores de cumplimiento por área...',
        'Generando recomendaciones prioritarias...'
    ];
    
    steps.forEach((step, index) => {
        setTimeout(() => {
            // Remover active de todos los steps
            document.querySelectorAll('.step-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Activar step actual
            const stepElement = document.getElementById(step.id);
            if (stepElement) {
                stepElement.classList.add('active');
            }
            
            // Actualizar texto de procesamiento
            if (processingText && detailedTexts[index]) {
                processingText.textContent = detailedTexts[index];
            }
        }, step.delay);
    });
}

function hideAnalysisModal() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
}

function showAnalysisResults(files) {
    // Scroll a la sección de resultados
    const caseStudy = document.querySelector('.case-study');
    if (caseStudy) {
        caseStudy.scrollIntoView({ behavior: 'smooth' });
        
        // Mostrar notificación de éxito
        setTimeout(() => {
            showNotification('✅ Análisis completado! Se identificaron áreas críticas de cumplimiento.', 'success');
        }, 1000);
        
        // Re-animar elementos
        setTimeout(() => {
            animateScoreCircle();
            animateComplianceScores();
        }, 1500);
    }
}

function displayGenericAnalysis() {
    // Los datos ya están en el HTML, solo necesitamos animar
    setTimeout(() => {
        animateComplianceScores();
    }, 2000);
}

function animateComplianceScores() {
    const scoreBars = document.querySelectorAll('.score-fill');
    
    scoreBars.forEach((bar, index) => {
        // Obtener el width original
        const targetWidth = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.transition = 'width 1s ease-out';
            bar.style.width = targetWidth;
        }, index * 200 + 500);
    });
}

function showDemoAnalysis() {
    // Scroll al caso de estudio
    const caseStudy = document.querySelector('.case-study');
    if (caseStudy) {
        caseStudy.scrollIntoView({ behavior: 'smooth' });
        
        // Mostrar información del demo
        setTimeout(() => {
            showNotification('📊 Visualizando análisis de ejemplo para Empresa Manufacturera Genérica', 'info');
        }, 800);
        
        // Animar elementos
        setTimeout(() => {
            animateElements();
            animateScoreCircle();
            animateComplianceScores();
        }, 1000);
    }
}

function setupContactModal() {
    const modal = document.getElementById('contact-modal');
    const closeBtn = document.getElementById('close-modal');
    const form = document.getElementById('contact-form');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeContactModal);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeContactModal();
            }
        });
    }
    
    if (form) {
        form.addEventListener('submit', handleContactSubmit);
    }
}

function openContactModal() {
    const modal = document.getElementById('contact-modal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Enfocar primer input
        const firstInput = modal.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

function closeContactModal() {
    const modal = document.getElementById('contact-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Mostrar loading en el botón
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    // Simular envío
    setTimeout(() => {
        closeContactModal();
        showNotification('✅ Solicitud enviada! Te contactaremos en las próximas 2 horas.', 'success');
        
        // Reset form
        e.target.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        console.log('Datos de contacto:', data);
    }, 2000);
}

function setupActionButtons() {
    // Botones de implementar
    const implementButtons = document.querySelectorAll('.btn--danger, .btn--warning, .btn--info, .btn--success');
    
    implementButtons.forEach(button => {
        if (button.textContent.includes('Implementar') || 
            button.textContent.includes('Programar') || 
            button.textContent.includes('Planificar')) {
            
            button.addEventListener('click', (e) => {
                const card = e.target.closest('.action-card');
                const title = card ? card.querySelector('h3').textContent : 'Acción';
                
                showNotification(`⚡ Iniciando: ${title}`, 'info');
                
                // Simular progreso
                setTimeout(() => {
                    showNotification('📋 Plan de implementación generado. Revisa tu email.', 'success');
                }, 2000);
            });
        }
    });
    
    // Botones de solicitar asesoría
    const advisoryButtons = document.querySelectorAll('.btn--outline');
    
    advisoryButtons.forEach(button => {
        if (button.textContent.includes('Asesoría') || 
            button.textContent.includes('Detalle') ||
            button.textContent.includes('Cotizar')) {
            
            button.addEventListener('click', () => {
                openContactModal();
            });
        }
    });
}

function animateElements() {
    // Animar cards cuando entran en viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    const animatableElements = document.querySelectorAll('.norma-card, .issue-card, .action-card, .plan-card, .service-card');
    
    animatableElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease-out';
        observer.observe(element);
    });
}

function showNotification(message, type = 'info') {
    // Remover notificaciones existentes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    // Crear nueva notificación
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    // Aplicar estilos
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '0.75rem',
        color: 'white',
        fontWeight: '600',
        fontSize: '0.875rem',
        zIndex: '10000',
        maxWidth: '400px',
        wordWrap: 'break-word',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease-out',
        cursor: 'pointer'
    });
    
    // Colores según tipo
    const colors = {
        success: '#10b981',
        info: '#3b82f6',
        warning: '#f59e0b',
        error: '#ef4444'
    };
    
    notification.style.background = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Click para cerrar
    notification.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Smooth scroll para enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Lazy loading para optimización
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// Performance monitoring
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`EcoAnalytics cargado en ${Math.round(loadTime)}ms`);
    
    // Inicializar animaciones después de cargar
    setTimeout(() => {
        animateElements();
    }, 500);
});

// Error handling global
window.addEventListener('error', (e) => {
    console.error('Error en EcoAnalytics:', e.error);
    showNotification('❌ Ha ocurrido un error. Por favor recarga la página.', 'error');
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape para cerrar modal
    if (e.key === 'Escape') {
        closeContactModal();
        
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay && !loadingOverlay.classList.contains('hidden')) {
            // No permitir cerrar durante análisis
            showNotification('⏳ Análisis en progreso, por favor espera...', 'info');
        }
    }
    
    // Ctrl/Cmd + U para upload
    if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        document.getElementById('file-input').click();
    }
});

// Scroll effects
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.backdropFilter = 'blur(20px) saturate(180%)';
            header.style.backgroundColor = 'rgba(0, 212, 170, 0.95)';
        } else {
            header.style.backdropFilter = 'none';
            header.style.backgroundColor = '';
        }
    }
});

// Exportar funciones para testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        appState,
        genericCompanyData,
        processFiles,
        showNotification
    };
}

// PWA Service Worker registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registrado:', registration);
            })
            .catch(error => {
                console.log('Error registro Service Worker:', error);
            });
    });
}
