/**
 * EcoAnalytics Enterprise - Sistema JavaScript Completo
 * Versión: 2.0 Enterprise
 * Plataforma de Cumplimiento ESG con IA Avanzada
 */

/* ===== CONFIGURACIÓN GLOBAL ===== */
const ECOANALYTICS_CONFIG = {
    version: '2.0.0-enterprise',
    apiUrl: '/api/v2',
    analysisTimeout: 8000,
    animationDuration: 300,
    debounceDelay: 500,
    maxFileSize: 50 * 1024 * 1024, // 50MB
    supportedFormats: ['.pdf', '.docx', '.xlsx', '.pptx', '.csv'],
    normativaCategories: ['chile', 'iso', 'internacional', 'all']
};

/* ===== ESTADO GLOBAL DE LA APLICACIÓN ===== */
const AppState = {
    // Estado de archivos y análisis
    uploadedFiles: [],
    currentAnalysis: null,
    isAnalyzing: false,
    analysisProgress: 0,

    // Estado de interfaz
    activeTab: 'immediate',
    currentFilter: 'all',
    mobileMenuOpen: false,
    modals: {
        contact: false,
        loading: false
    },

    // Estado de datos
    normativaData: new Map(),
    complianceScores: new Map(),
    criticalIssues: [],
    
    // Configuración de usuario
    preferences: {
        theme: 'light',
        language: 'es',
        notifications: true
    }
};

/* ===== DATOS DE DEMOSTRACIÓN ENTERPRISE ===== */
const DemoData = {
    company: {
        name: "Industria Manufacturera Demo S.A.",
        sector: "Manufactura Industrial",
        size: "Grande (500+ empleados)",
        documentsAnalyzed: 847,
        normativasChecked: 82,
        lastUpdate: new Date().toISOString()
    },

    overallScore: 78,
    
    complianceScores: {
        // Normativas Chilenas
        'ds90': { score: 85, category: 'chile', status: 'compliant', requirements: 12 },
        'nch1333': { score: 65, category: 'chile', status: 'warning', requirements: 8 },
        'ds148': { score: 45, category: 'chile', status: 'critical', requirements: 15 },
        'ds594': { score: 88, category: 'chile', status: 'compliant', requirements: 18 },
        'seia': { score: 74, category: 'chile', status: 'warning', requirements: 22 },
        
        // ISO Standards
        'iso14001': { score: 82, category: 'iso', status: 'compliant', requirements: 25 },
        'iso45001': { score: 88, category: 'iso', status: 'compliant', requirements: 20 },
        'iso50001': { score: 62, category: 'iso', status: 'warning', requirements: 18 },
        'iso26000': { score: 76, category: 'iso', status: 'info', requirements: 30 },
        'iso37001': { score: 71, category: 'iso', status: 'info', requirements: 16 },
        
        // Reportes Internacionales
        'gri': { score: 72, category: 'internacional', status: 'info', requirements: 35 },
        'sasb': { score: 68, category: 'internacional', status: 'info', requirements: 25 },
        'tcfd': { score: 55, category: 'internacional', status: 'warning', requirements: 12 },
        'cdp': { score: 63, category: 'internacional', status: 'warning', requirements: 18 }
    },

    criticalIssues: [
        {
            id: 'ESG-001',
            title: 'DS 148/2003 - Residuos Peligrosos',
            description: 'Declaración anual RETC pendiente desde marzo 2024. Plan de manejo desactualizado y falta registro de transporte autorizado.',
            severity: 'critical',
            category: 'chile',
            riskLevel: 90,
            financialImpact: '$2M - $15M UTM',
            deadline: '30 días máximo',
            authority: 'SMA - Superintendencia',
            impacts: {
                legal: 90,
                reputacional: 75,
                financial: 90,
                operational: 60
            }
        },
        {
            id: 'ESG-002',
            title: 'ISO 50001 - Gestión Energética',
            description: 'Sin sistema formal de gestión energética. Consumo 25% sobre promedio sectorial. Oportunidad significativa de ahorro.',
            severity: 'high',
            category: 'iso',
            riskLevel: 75,
            savingsPotential: '$450M CLP/año',
            co2Reduction: '2,500 tCO2eq/año',
            roi: '24 meses',
            impacts: {
                economic: 85,
                environmental: 85,
                competitive: 75,
                regulatory: 40
            }
        },
        {
            id: 'ESG-003',
            title: 'NCh 1333 - Calidad Aguas Riego',
            description: 'Parámetros de boro, conductividad eléctrica y sólidos disueltos exceden límites permitidos consistentemente.',
            severity: 'critical',
            category: 'chile',
            riskLevel: 85,
            findings: {
                boro: '3.2 mg/L (máx 2.0)',
                conductividad: '2.8 dS/m (máx 2.0)',
                solidos: '850 mg/L (máx 640)'
            },
            impacts: {
                regulatory: 85,
                operational: 75,
                community: 70,
                environmental: 80
            }
        },
        {
            id: 'ESG-004',
            title: 'GRI Standards - Reportes ESG',
            description: 'Falta reporte de sostenibilidad bajo estándares GRI. Oportunidad de mejora significativa en rating ESG.',
            severity: 'medium',
            category: 'internacional',
            riskLevel: 45,
            benefits: {
                msciRating: '+15 puntos',
                investorAppeal: 'Alto',
                transparency: '+40%'
            },
            timeline: '4-6 meses',
            investment: '$3M - $5M CLP',
            impacts: {
                transparency: 85,
                investor: 85,
                competitive: 60,
                brand: 70
            }
        }
    ],

    trends: {
        monthly: [65, 68, 71, 73, 75, 78],
        categories: {
            environmental: [70, 72, 75, 78, 80, 82],
            social: [60, 63, 66, 68, 71, 74],
            governance: [75, 77, 79, 81, 82, 85]
        }
    },

    benchmarks: {
        sector: 65,
        topQuartile: 85,
        industry: 72,
        regional: 68
    }
};

/* ===== SISTEMA DE EVENTOS ===== */
class EventSystem {
    constructor() {
        this.events = new Map();
    }

    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event).push(callback);
    }

    emit(event, data) {
        if (this.events.has(event)) {
            this.events.get(event).forEach(callback => callback(data));
        }
    }

    off(event, callback) {
        if (this.events.has(event)) {
            const callbacks = this.events.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }
}

const EventBus = new EventSystem();

/* ===== UTILIDADES ===== */
const Utils = {
    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    },

    // Formatear números
    formatNumber(num) {
        return new Intl.NumberFormat('es-CL').format(num);
    },

    // Formatear porcentajes
    formatPercentage(num) {
        return new Intl.NumberFormat('es-CL', { 
            style: 'percent', 
            minimumFractionDigits: 1,
            maximumFractionDigits: 1 
        }).format(num / 100);
    },

    // Formatear moneda chilena
    formatCurrency(num) {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(num);
    },

    // Formatear fechas
    formatDate(date) {
        return new Intl.DateTimeFormat('es-CL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    },

    // Formatear tiempo relativo
    formatRelativeTime(date) {
        const now = new Date();
        const diffMs = now - new Date(date);
        const diffMins = Math.floor(diffMs / (1000 * 60));
        
        if (diffMins < 1) return 'Hace unos segundos';
        if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
        
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
        
        const diffDays = Math.floor(diffHours / 24);
        return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    },

    // Validar archivos
    validateFile(file) {
        const errors = [];
        
        // Verificar tamaño
        if (file.size > ECOANALYTICS_CONFIG.maxFileSize) {
            errors.push(`El archivo ${file.name} excede el tamaño máximo permitido (50MB)`);
        }
        
        // Verificar formato
        const extension = '.' + file.name.split('.').pop().toLowerCase();
        if (!ECOANALYTICS_CONFIG.supportedFormats.includes(extension)) {
            errors.push(`El formato ${extension} no está soportado`);
        }
        
        return { isValid: errors.length === 0, errors };
    },

    // Generar ID único
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Smooth scroll
    smoothScroll(element, duration = 800) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    },

    // Animación de contadores
    animateCounter(element, start, end, duration = 2000) {
        const startTimestamp = performance.now();
        const step = (timestamp) => {
            const elapsed = timestamp - startTimestamp;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(progress * (end - start) + start);
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
    }
};

/* ===== GESTIÓN DE ESTADO ===== */
class StateManager {
    constructor() {
        this.state = { ...AppState };
        this.subscribers = new Map();
    }

    getState() {
        return { ...this.state };
    }

    setState(updates) {
        const previousState = { ...this.state };
        this.state = { ...this.state, ...updates };
        
        // Notificar a suscriptores
        Object.keys(updates).forEach(key => {
            if (this.subscribers.has(key)) {
                this.subscribers.get(key).forEach(callback => {
                    callback(this.state[key], previousState[key]);
                });
            }
        });

        EventBus.emit('stateChanged', { updates, previousState, currentState: this.state });
    }

    subscribe(key, callback) {
        if (!this.subscribers.has(key)) {
            this.subscribers.set(key, []);
        }
        this.subscribers.get(key).push(callback);

        // Retornar función para desuscribirse
        return () => {
            const callbacks = this.subscribers.get(key);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        };
    }
}

const State = new StateManager();

/* ===== GESTIÓN DE ARCHIVOS Y ANÁLISIS ===== */
class AnalysisEngine {
    constructor() {
        this.analysisQueue = [];
        this.isProcessing = false;
    }

    async processFiles(files) {
        if (this.isProcessing) {
            throw new Error('Análisis en progreso. Por favor espera.');
        }

        // Validar archivos
        const validationResults = files.map(file => ({
            file,
            validation: Utils.validateFile(file)
        }));

        const invalidFiles = validationResults.filter(result => !result.validation.isValid);
        if (invalidFiles.length > 0) {
            const errors = invalidFiles.flatMap(result => result.validation.errors);
            throw new Error(errors.join('\n'));
        }

        this.isProcessing = true;
        State.setState({ isAnalyzing: true, analysisProgress: 0 });

        try {
            // Mostrar modal de carga
            this.showAnalysisModal();
            
            // Simular proceso de análisis
            await this.simulateAnalysis();
            
            // Procesar resultados
            const results = this.generateAnalysisResults(files);
            
            // Actualizar estado
            State.setState({
                uploadedFiles: files,
                currentAnalysis: results,
                isAnalyzing: false,
                analysisProgress: 100
            });

            // Ocultar modal y mostrar resultados
            this.hideAnalysisModal();
            this.showResults();

            return results;

        } catch (error) {
            console.error('Error en análisis:', error);
            State.setState({ isAnalyzing: false, analysisProgress: 0 });
            this.hideAnalysisModal();
            throw error;
        } finally {
            this.isProcessing = false;
        }
    }

    showAnalysisModal() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
            this.animateAnalysisSteps();
        }
    }

    hideAnalysisModal() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }

    async simulateAnalysis() {
        const steps = [
            { name: 'Extrayendo y clasificando datos', duration: 1500 },
            { name: 'Verificando 80+ normativas', duration: 2000 },
            { name: 'Calculando scores ESG avanzados', duration: 1500 },
            { name: 'Generando plan de acción estratégico', duration: 1500 },
            { name: 'Priorizando recomendaciones', duration: 1000 }
        ];

        let totalProgress = 0;
        const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);

        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            await this.animateStep(i + 1, step.name);
            
            // Animar progreso
            const stepProgress = (step.duration / totalDuration) * 100;
            await this.animateProgress(totalProgress, totalProgress + stepProgress, step.duration);
            totalProgress += stepProgress;
        }
    }

    async animateStep(stepNumber, stepName) {
        // Actualizar pasos activos
        document.querySelectorAll('.step-item').forEach((item, index) => {
            item.classList.toggle('active', index === stepNumber - 1);
        });

        // Actualizar texto de procesamiento
        const processingText = document.getElementById('processing-text');
        if (processingText) {
            processingText.textContent = stepName;
        }

        return new Promise(resolve => setTimeout(resolve, 300));
    }

    async animateProgress(from, to, duration) {
        const progressFill = document.getElementById('progress-fill');
        const progressPercentage = document.getElementById('progress-percentage');
        
        if (!progressFill || !progressPercentage) return;

        const startTime = performance.now();
        
        const updateProgress = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentValue = from + (to - from) * progress;
            
            progressFill.style.width = `${currentValue}%`;
            progressPercentage.textContent = `${Math.round(currentValue)}%`;
            
            State.setState({ analysisProgress: currentValue });
            
            if (progress < 1) {
                requestAnimationFrame(updateProgress);
            }
        };
        
        requestAnimationFrame(updateProgress);
        
        return new Promise(resolve => setTimeout(resolve, duration));
    }

    animateAnalysisSteps() {
        const steps = [
            { id: 'step-1', delay: 0 },
            { id: 'step-2', delay: 1500 },
            { id: 'step-3', delay: 3000 },
            { id: 'step-4', delay: 4500 },
            { id: 'step-5', delay: 6000 }
        ];

        steps.forEach((step, index) => {
            setTimeout(() => {
                document.querySelectorAll('.step-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                const stepElement = document.getElementById(step.id);
                if (stepElement) {
                    stepElement.classList.add('active');
                }
            }, step.delay);
        });
    }

    generateAnalysisResults(files) {
        return {
            id: Utils.generateId(),
            timestamp: new Date().toISOString(),
            files: files.map(file => ({
                name: file.name,
                size: file.size,
                type: file.type
            })),
            company: DemoData.company,
            overallScore: DemoData.overallScore,
            complianceScores: DemoData.complianceScores,
            criticalIssues: DemoData.criticalIssues,
            trends: DemoData.trends,
            benchmarks: DemoData.benchmarks,
            recommendations: this.generateRecommendations(),
            summary: this.generateSummary()
        };
    }

    generateRecommendations() {
        return [
            {
                priority: 'critical',
                category: 'immediate',
                title: 'Actualizar Declaración RETC DS148',
                description: 'Completar declaración anual de residuos peligrosos',
                cost: 500000,
                timeline: '15 días',
                impact: 'Evita multas hasta $15M UTM'
            },
            {
                priority: 'high',
                category: 'short-term',
                title: 'Implementar ISO 50001',
                description: 'Sistema de gestión energética',
                cost: 25000000,
                timeline: '4 meses',
                impact: 'Ahorro $450M CLP/año'
            }
        ];
    }

    generateSummary() {
        return {
            totalNormativas: 82,
            compliantNormativas: 48,
            warningNormativas: 23,
            criticalNormativas: 11,
            overallTrend: 'positive',
            keyStrengths: ['Seguridad Ocupacional', 'Gestión Ambiental Básica'],
            keyWeaknesses: ['Gestión Energética', 'Residuos Peligrosos', 'Reportes ESG']
        };
    }

    showResults() {
        const caseStudy = document.querySelector('.case-study');
        if (caseStudy) {
            Utils.smoothScroll(caseStudy);
            
            setTimeout(() => {
                NotificationManager.show('✅ Análisis completado! Se identificaron áreas críticas de cumplimiento.', 'success');
                this.animateScoreElements();
            }, 1000);
        }
    }

    animateScoreElements() {
        // Animar círculo principal
        this.animateMainScoreCircle();
        
        // Animar barras de compliance
        this.animateComplianceScores();
        
        // Animar contadores
        this.animateCounters();
    }

    animateMainScoreCircle() {
        const circle = document.querySelector('.circle-progress');
        if (circle) {
            const percentage = DemoData.overallScore;
            setTimeout(() => {
                const gradient = `conic-gradient(var(--primary-500) ${percentage}%, var(--gray-200) 0%)`;
                circle.style.background = gradient;
            }, 500);
        }
    }

    animateComplianceScores() {
        const scoreBars = document.querySelectorAll('.score-fill');
        
        scoreBars.forEach((bar, index) => {
            const targetWidth = bar.style.width;
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                bar.style.width = targetWidth;
            }, index * 200 + 800);
        });
    }

    animateCounters() {
        const counters = document.querySelectorAll('[data-counter]');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-counter') || counter.textContent);
            Utils.animateCounter(counter, 0, target, 2000);
        });
    }
}

const AnalysisEngineInstance = new AnalysisEngine();

/* ===== SISTEMA DE NOTIFICACIONES ===== */
class NotificationManager {
    static notifications = [];
    static container = null;

    static init() {
        // Crear container de notificaciones si no existe
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'notification-container';
            this.container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                pointer-events: none;
            `;
            document.body.appendChild(this.container);
        }
    }

    static show(message, type = 'info', duration = 5000) {
        this.init();
        
        const notification = this.createNotification(message, type);
        this.container.appendChild(notification);
        this.notifications.push(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        }, 100);
        
        // Auto-remove
        setTimeout(() => {
            this.remove(notification);
        }, duration);
        
        return notification;
    }

    static createNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        
        const colors = {
            success: '#10b981',
            info: '#3b82f6', 
            warning: '#f59e0b',
            error: '#ef4444'
        };
        
        const icons = {
            success: '✅',
            info: 'ℹ️',
            warning: '⚠️',
            error: '❌'
        };
        
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${icons[type] || icons.info}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="NotificationManager.remove(this.parentElement.parentElement)">×</button>
            </div>
        `;
        
        Object.assign(notification.style, {
            background: colors[type] || colors.info,
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '0.75rem',
            marginBottom: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            transform: 'translateX(100%)',
            opacity: '0',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            maxWidth: '400px',
            wordWrap: 'break-word',
            pointerEvents: 'auto',
            cursor: 'pointer'
        });
        
        // Click para cerrar
        notification.addEventListener('click', () => {
            this.remove(notification);
        });
        
        return notification;
    }

    static remove(notification) {
        if (!notification || !notification.parentNode) return;
        
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            
            const index = this.notifications.indexOf(notification);
            if (index > -1) {
                this.notifications.splice(index, 1);
            }
        }, 300);
    }

    static clear() {
        this.notifications.forEach(notification => {
            this.remove(notification);
        });
    }
}

/* ===== GESTIÓN DE INTERFAZ ===== */
class UIManager {
    constructor() {
        this.initializeComponents();
        this.setupEventListeners();
        this.setupResponsiveHandlers();
    }

    initializeComponents() {
        // Inicializar tabs
        this.initializeTabs();
        
        // Inicializar filtros
        this.initializeFilters();
        
        // Inicializar upload zone
        this.initializeUploadZone();
        
        // Inicializar modales
        this.initializeModals();
        
        // Inicializar tooltips
        this.initializeTooltips();
        
        // Inicializar lazy loading
        this.initializeLazyLoading();
        
        // Animaciones iniciales
        setTimeout(() => {
            this.animateOnLoad();
        }, 500);
    }

    initializeTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const tabId = button.getAttribute('data-tab');
                
                // Actualizar estado
                State.setState({ activeTab: tabId });
                
                // Actualizar UI
                this.switchTab(tabId, button, tabButtons, tabContents);
            });
        });
    }

    switchTab(tabId, activeButton, allButtons, allContents) {
        // Actualizar botones
        allButtons.forEach(btn => btn.classList.remove('active'));
        activeButton.classList.add('active');
        
        // Actualizar contenidos
        allContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === tabId) {
                content.classList.add('active');
                this.animateTabContent(content);
            }
        });
    }

    animateTabContent(content) {
        content.style.opacity = '0';
        content.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            content.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
        }, 50);
    }

    initializeFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter') || 'all';
                
                // Actualizar estado
                State.setState({ currentFilter: filter });
                
                // Actualizar UI
                this.applyFilter(filter, button, filterButtons);
            });
        });
    }

    applyFilter(filter, activeButton, allButtons) {
        // Actualizar botones
        allButtons.forEach(btn => btn.classList.remove('active'));
        activeButton.classList.add('active');
        
        // Filtrar cards
        const normativaCards = document.querySelectorAll('.norma-card');
        
        normativaCards.forEach((card, index) => {
            const cardCategories = card.getAttribute('data-category') || '';
            const shouldShow = filter === 'all' || cardCategories.includes(filter);
            
            if (shouldShow) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }

    initializeUploadZone() {
        const uploadZone = document.getElementById('upload-zone');
        const fileInput = document.getElementById('file-input');
        
        if (!uploadZone || !fileInput) return;
        
        // Drag and drop handlers
        uploadZone.addEventListener('dragover', this.handleDragOver.bind(this));
        uploadZone.addEventListener('dragleave', this.handleDragLeave.bind(this));
        uploadZone.addEventListener('drop', this.handleDrop.bind(this));
        
        // Click handler
        uploadZone.addEventListener('click', () => {
            fileInput.click();
        });
        
        // File input change
        fileInput.addEventListener('change', (e) => {
            this.handleFileSelection(Array.from(e.target.files));
        });
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('dragover');
        
        const files = Array.from(e.dataTransfer.files);
        this.handleFileSelection(files);
    }

    async handleFileSelection(files) {
        if (files.length === 0) return;
        
        try {
            await AnalysisEngineInstance.processFiles(files);
        } catch (error) {
            console.error('Error processing files:', error);
            NotificationManager.show(error.message, 'error');
        }
    }

    initializeModals() {
        // Modal de contacto
        const contactModal = document.getElementById('contact-modal');
        const closeModalBtn = document.getElementById('close-modal');
        const contactForm = document.getElementById('contact-form');
        
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                this.closeModal('contact');
            });
        }
        
        if (contactModal) {
            contactModal.addEventListener('click', (e) => {
                if (e.target === contactModal) {
                    this.closeModal('contact');
                }
            });
        }
        
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleContactSubmit.bind(this));
        }
    }

    openModal(modalName) {
        const modal = document.getElementById(`${modalName}-modal`);
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            State.setState({
                modals: { ...State.getState().modals, [modalName]: true }
            });
            
            // Focus management
            const firstInput = modal.querySelector('input, textarea, select, button');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    }

    closeModal(modalName) {
        const modal = document.getElementById(`${modalName}-modal`);
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
            
            State.setState({
                modals: { ...State.getState().modals, [modalName]: false }
            });
        }
    }

    async handleContactSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // Validar datos básicos
        if (!data.name || !data.email || !data.company) {
            NotificationManager.show('Por favor completa todos los campos requeridos', 'error');
            return;
        }
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        try {
            // Mostrar loading
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            
            // Simular envío (aquí iría la llamada a API real)
            await this.simulateContactSubmission(data);
            
            // Éxito
            this.closeModal('contact');
            NotificationManager.show('✅ Solicitud enviada! Te contactaremos en las próximas 2 horas.', 'success');
            
            // Reset form
            e.target.reset();
            
        } catch (error) {
            console.error('Error submitting contact form:', error);
            NotificationManager.show('Error al enviar la solicitud. Por favor intenta nuevamente.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async simulateContactSubmission(data) {
        // Simular delay de API
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Contact data submitted:', data);
                resolve();
            }, 2000);
        });
    }

    initializeTooltips() {
        const tooltips = document.querySelectorAll('[title]');
        
        tooltips.forEach(element => {
            element.addEventListener('mouseenter', this.showTooltip.bind(this));
            element.addEventListener('mouseleave', this.hideTooltip.bind(this));
        });
    }

    showTooltip(e) {
        // Implementación de tooltip personalizada
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = e.target.getAttribute('title');
        
        Object.assign(tooltip.style, {
            position: 'absolute',
            background: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            padding: '0.5rem 0.75rem',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            zIndex: '10000',
            pointerEvents: 'none',
            opacity: '0',
            transition: 'opacity 0.2s ease'
        });
        
        document.body.appendChild(tooltip);
        
        const rect = e.target.getBoundingClientRect();
        tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
        
        setTimeout(() => tooltip.style.opacity = '1', 10);
        
        e.target._tooltip = tooltip;
    }

    hideTooltip(e) {
        if (e.target._tooltip) {
            e.target._tooltip.remove();
            e.target._tooltip = null;
        }
    }

    initializeLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }

    animateOnLoad() {
        // Animar elementos cuando entran en viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        const animatableElements = document.querySelectorAll(
            '.norma-card, .issue-card, .action-card, .stat, .metric-card'
        );
        
        animatableElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(element);
        });
    }

    setupEventListeners() {
        // Botones principales
        document.addEventListener('click', (e) => {
            // Demo button
            if (e.target.matches('#demo-btn')) {
                this.showDemo();
            }
            
            // Contact buttons
            if (e.target.matches('#contact-btn, #schedule-demo-btn')) {
                this.openModal('contact');
            }
            
            // Start analysis button
            if (e.target.matches('#start-analysis-btn, #start-free-btn')) {
                const uploadZone = document.getElementById('upload-zone');
                if (uploadZone) {
                    Utils.smoothScroll(uploadZone);
                    setTimeout(() => {
                        document.getElementById('file-input').click();
                    }, 500);
                }
            }
            
            // Refresh analysis
            if (e.target.matches('#refresh-analysis')) {
                this.refreshAnalysis();
            }
            
            // Export report
            if (e.target.matches('#export-report')) {
                this.exportReport();
            }
            
            // Show more buttons
            if (e.target.matches('#show-all-scores, #show-all-issues, #view-all-norms')) {
                this.handleShowMore(e.target);
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Escape para cerrar modales
            if (e.key === 'Escape') {
                this.closeModal('contact');
            }
            
            // Ctrl/Cmd + U para upload
            if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
                e.preventDefault();
                document.getElementById('file-input').click();
            }
            
            // Ctrl/Cmd + K para abrir contacto
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.openModal('contact');
            }
        });
    }

    setupResponsiveHandlers() {
        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
        }
        
        // Scroll effects
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // Resize handler
        window.addEventListener('resize', Utils.debounce(() => {
            this.handleResize();
        }, 250));
    }

    toggleMobileMenu() {
        const isOpen = !State.getState().mobileMenuOpen;
        State.setState({ mobileMenuOpen: isOpen });
        
        // Actualizar UI del menú
        const toggle = document.getElementById('mobile-menu-toggle');
        const nav = document.querySelector('.header-nav');
        
        if (toggle) {
            toggle.classList.toggle('active', isOpen);
        }
        
        if (nav) {
            nav.classList.toggle('active', isOpen);
        }
    }

    handleScroll() {
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        // Update last update time
        this.updateLastUpdateTime();
    }

    handleResize() {
        // Close mobile menu on desktop
        if (window.innerWidth >= 1024) {
            State.setState({ mobileMenuOpen: false });
            
            const toggle = document.getElementById('mobile-menu-toggle');
            const nav = document.querySelector('.header-nav');
            
            if (toggle) toggle.classList.remove('active');
            if (nav) nav.classList.remove('active');
        }
    }

    showDemo() {
        const caseStudy = document.querySelector('.case-study');
        if (caseStudy) {
            Utils.smoothScroll(caseStudy);
            
            setTimeout(() => {
                NotificationManager.show('📊 Visualizando análisis demo para empresa manufacturera', 'info');
                AnalysisEngineInstance.animateScoreElements();
            }, 800);
        }
    }

    refreshAnalysis() {
        NotificationManager.show('🔄 Actualizando análisis...', 'info');
        
        setTimeout(() => {
            // Actualizar timestamp
            const lastUpdate = document.getElementById('last-update');
            if (lastUpdate) {
                lastUpdate.textContent = 'Recién actualizado';
            }
            
            // Re-animar scores
            AnalysisEngineInstance.animateScoreElements();
            
            NotificationManager.show('✅ Análisis actualizado exitosamente', 'success');
        }, 1500);
    }

    exportReport() {
        NotificationManager.show('📄 Generando reporte PDF...', 'info');
        
        // Simular generación de reporte
        setTimeout(() => {
            NotificationManager.show('✅ Reporte exportado. Revisa tu carpeta de descargas.', 'success');
            
            // Simular descarga
            const link = document.createElement('a');
            link.href = '#';
            link.download = 'reporte-cumplimiento-esg.pdf';
            link.textContent = 'Descargar Reporte';
            // En implementación real, aquí se generaría el PDF
        }, 2000);
    }

    handleShowMore(button) {
        const text = button.textContent;
        
        if (text.includes('normativas')) {
            NotificationManager.show('📋 Cargando listado completo de normativas...', 'info');
        } else if (text.includes('áreas')) {
            NotificationManager.show('🔍 Mostrando análisis detallado de todas las áreas...', 'info');
        } else if (text.includes('scores')) {
            NotificationManager.show('📊 Expandiendo dashboard de cumplimiento...', 'info');
        }
        
        // Simular carga de más contenido
        setTimeout(() => {
            button.textContent = 'Contenido expandido';
            button.disabled = true;
            NotificationManager.show('✅ Contenido completo cargado', 'success');
        }, 1000);
    }

    updateLastUpdateTime() {
        const lastUpdate = document.getElementById('last-update');
        if (lastUpdate && DemoData.company.lastUpdate) {
            lastUpdate.textContent = Utils.formatRelativeTime(DemoData.company.lastUpdate);
        }
    }
}

/* ===== INICIALIZACIÓN DE LA APLICACIÓN ===== */
class App {
    constructor() {
        this.ui = null;
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;
        
        try {
            console.log('🚀 Inicializando EcoAnalytics Enterprise v' + ECOANALYTICS_CONFIG.version);
            
            // Inicializar componentes principales
            this.ui = new UIManager();
            
            // Configurar eventos globales
            this.setupGlobalEventHandlers();
            
            // Configurar performance monitoring
            this.setupPerformanceMonitoring();
            
            // Inicializar datos demo
            this.initializeDemoData();
            
            // Marcar como inicializado
            this.initialized = true;
            
            console.log('✅ EcoAnalytics Enterprise inicializado correctamente');
            
            // Evento de inicialización completa
            EventBus.emit('appInitialized', {
                version: ECOANALYTICS_CONFIG.version,
                timestamp: new Date().toISOString()
            });
            
        } catch (error) {
            console.error('❌ Error inicializando la aplicación:', error);
            NotificationManager.show('Error al inicializar la aplicación. Por favor recarga la página.', 'error');
        }
    }

    setupGlobalEventHandlers() {
        // Error handling global
        window.addEventListener('error', (e) => {
            console.error('Error global capturado:', e.error);
            NotificationManager.show('Se ha producido un error. El equipo técnico ha sido notificado.', 'error');
            
            // En producción, aquí se enviaría el error a un servicio de logging
            EventBus.emit('errorOccurred', {
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                timestamp: new Date().toISOString()
            });
        });
        
        // Promise rejection handling
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Promise rejection no manejada:', e.reason);
            NotificationManager.show('Error en operación asíncrona.', 'error');
            e.preventDefault();
        });
        
        // Online/offline status
        window.addEventListener('online', () => {
            NotificationManager.show('✅ Conexión restablecida', 'success');
        });
        
        window.addEventListener('offline', () => {
            NotificationManager.show('⚠️ Sin conexión a internet', 'warning');
        });
    }

    setupPerformanceMonitoring() {
        // Monitor performance
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (entry.entryType === 'navigation') {
                        console.log(`📊 Tiempo de carga: ${Math.round(entry.loadEventEnd)}ms`);
                    }
                });
            });
            
            try {
                observer.observe({ entryTypes: ['navigation'] });
            } catch (e) {
                // Navegadores más antiguos pueden no soportar esta funcionalidad
                console.warn('Performance Observer no soportado');
            }
        }
        
        // Monitor load event
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`⚡ EcoAnalytics cargado en ${Math.round(loadTime)}ms`);
            
            // Inicializar animaciones post-carga
            setTimeout(() => {
                if (this.ui) {
                    this.ui.animateOnLoad();
                }
            }, 200);
        });
    }

    initializeDemoData() {
        // Cargar datos demo en el estado
        State.setState({
            currentAnalysis: {
                company: DemoData.company,
                overallScore: DemoData.overallScore,
                complianceScores: DemoData.complianceScores,
                criticalIssues: DemoData.criticalIssues
            }
        });
        
        // Actualizar elementos de tiempo en la UI
        setInterval(() => {
            if (this.ui) {
                this.ui.updateLastUpdateTime();
            }
        }, 60000); // Actualizar cada minuto
    }
}

/* ===== PUNTO DE ENTRADA PRINCIPAL ===== */
const EcoAnalyticsApp = new App();

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        EcoAnalyticsApp.init();
    });
} else {
    EcoAnalyticsApp.init();
}

// Exportar para testing y debugging
window.EcoAnalytics = {
    App: EcoAnalyticsApp,
    State,
    EventBus,
    Utils,
    NotificationManager,
    AnalysisEngine: AnalysisEngineInstance,
    Config: ECOANALYTICS_CONFIG,
    Version: ECOANALYTICS_CONFIG.version
};

console.log('🌿 EcoAnalytics Enterprise JavaScript cargado correctamente');
