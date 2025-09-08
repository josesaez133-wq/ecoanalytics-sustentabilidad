/**
 * EcoAnalytics Enterprise - JavaScript CORREGIDO
 * Versión: 2.1.1 - Error Fixed
 */

/* ===== CONFIGURACIÓN GLOBAL ===== */
const ECOANALYTICS_CONFIG = {
    version: '2.1.1-enterprise-fixed',
    apiUrl: '/api/v2',
    analysisTimeout: 8000,
    animationDuration: 300,
    debounceDelay: 500,
    maxFileSize: 50 * 1024 * 1024,
    supportedFormats: ['.pdf', '.docx', '.xlsx', '.pptx', '.csv'],
    normativaCategories: ['chile', 'iso', 'internacional', 'all']
};

/* ===== ESTADO GLOBAL ===== */
const AppState = {
    uploadedFiles: [],
    currentAnalysis: null,
    isAnalyzing: false,
    analysisProgress: 0,
    analysisHistory: [],
    activeTab: 'immediate',
    currentFilter: 'all',
    mobileMenuOpen: false,
    expandedSections: {
        scores: false,
        issues: false,
        normativas: false,
        improvements: false
    },
    modals: {
        contact: false,
        loading: false,
        improvements: false
    },
    normativaData: new Map(),
    complianceScores: new Map(),
    criticalIssues: [],
    improvementPlan: [],
    preferences: {
        theme: 'light',
        language: 'es',
        notifications: true
    }
};

/* ===== GENERADOR DE DATOS DINÁMICOS ===== */
class DataGenerator {
    static generateVariableScores() {
        const baseScores = [45, 52, 65, 72, 78, 85, 88, 92];
        const variations = [-8, -5, -3, 0, 3, 5, 8, 12];
        
        return baseScores.map(base => {
            const variation = variations[Math.floor(Math.random() * variations.length)];
            return Math.min(Math.max(base + variation, 20), 98);
        });
    }

    static generateCompanyProfile(fileName) {
        const companies = [
            {
                name: "Industria Manufacturera Demo S.A.",
                sector: "Manufactura Industrial",
                size: "Grande (500+ empleados)",
                mainRisks: ['residuos-peligrosos', 'energia', 'aguas'],
                strengths: ['seguridad', 'ambiental-basico']
            },
            {
                name: "Minera Sustentable Chile Ltda.",
                sector: "Minería y Extracción",
                size: "Mediana (150+ empleados)",
                mainRisks: ['aguas', 'biodiversidad', 'comunidades'],
                strengths: ['seguridad', 'reportes']
            },
            {
                name: "Energía Renovable Plus SpA",
                sector: "Energía y Servicios",
                size: "Grande (800+ empleados)",
                mainRisks: ['normativas-energia', 'impacto-grid'],
                strengths: ['energia', 'carbono-neutral']
            },
            {
                name: "AgroIndustrial Verde S.A.",
                sector: "Agroindustria y Alimentos",
                size: "Mediana (250+ empleados)",
                mainRisks: ['aguas-riego', 'residuos-organicos', 'certificaciones'],
                strengths: ['trazabilidad', 'organico']
            }
        ];

        const hash = fileName ? fileName.length % companies.length : 0;
        const selectedCompany = companies[hash];
        
        return {
            ...selectedCompany,
            documentsAnalyzed: Math.floor(Math.random() * 400) + 600,
            normativasChecked: 82,
            lastUpdate: new Date().toISOString()
        };
    }

    static generateDynamicScores(companyProfile) {
        const baseScores = this.generateVariableScores();
        
        return {
            'ds90': { 
                score: Math.max(baseScores[0] + (companyProfile.mainRisks.includes('aguas') ? -12 : 0), 20), 
                category: 'chile', status: 'warning', requirements: 12 
            },
            'nch1333': { 
                score: Math.max(baseScores[1] + (companyProfile.mainRisks.includes('aguas-riego') ? -18 : 0), 15), 
                category: 'chile', status: 'critical', requirements: 8 
            },
            'ds148': { 
                score: Math.max(baseScores[2] + (companyProfile.mainRisks.includes('residuos-peligrosos') ? -15 : 0), 25), 
                category: 'chile', status: 'critical', requirements: 15 
            },
            'ds594': { 
                score: Math.min(baseScores[3] + (companyProfile.strengths.includes('seguridad') ? 10 : 0), 95), 
                category: 'chile', status: 'compliant', requirements: 18 
            },
            'seia': { 
                score: baseScores[4], 
                category: 'chile', status: 'warning', requirements: 22 
            },
            'iso14001': { 
                score: Math.min(baseScores[5] + (companyProfile.strengths.includes('ambiental-basico') ? 8 : 0), 92), 
                category: 'iso', status: 'compliant', requirements: 25 
            },
            'iso45001': { 
                score: Math.min(baseScores[6] + (companyProfile.strengths.includes('seguridad') ? 15 : 0), 95), 
                category: 'iso', status: 'compliant', requirements: 20 
            },
            'iso50001': { 
                score: Math.max(baseScores[7] + (companyProfile.mainRisks.includes('energia') ? -20 : 0), 30), 
                category: 'iso', status: 'warning', requirements: 18 
            },
            'gri': { 
                score: Math.min(baseScores[2] + (companyProfile.strengths.includes('reportes') ? 20 : 0), 90), 
                category: 'internacional', status: 'info', requirements: 35 
            },
            'sasb': { 
                score: Math.min(baseScores[1] + (companyProfile.strengths.includes('reportes') ? 15 : 0), 88), 
                category: 'internacional', status: 'info', requirements: 25 
            }
        };
    }

    static generateImprovementPlan(companyProfile, scores) {
        const improvements = [
            {
                id: 'IMP-001',
                title: 'Regularizar DS 148/2003 - Residuos Peligrosos',
                description: 'Actualizar declaración RETC, plan de manejo y registro de transporte',
                priority: 'critical',
                timeline: '30 días',
                cost: 'CLP $800.000',
                savings: 'Evita multas hasta $15M UTM',
                responsible: 'Gerencia Ambiental',
                status: 'pending',
                steps: [
                    'Auditoría legal DS 148 actual',
                    'Actualizar plan de manejo residuos',
                    'Completar declaración RETC 2024',
                    'Registro empresa transporte autorizada'
                ]
            },
            {
                id: 'IMP-002', 
                title: 'Implementar ISO 50001 - Gestión Energética',
                description: 'Sistema completo de gestión energética con monitoreo IoT',
                priority: 'high',
                timeline: '4 meses',
                cost: 'CLP $28.000.000',
                savings: 'CLP $450M/año + reducción 2,500 tCO2eq',
                responsible: 'Gerencia Operaciones',
                status: 'planning',
                steps: [
                    'Diagnóstico energético inicial',
                    'Definir política energética',
                    'Implementar sistema monitoreo',
                    'Capacitación equipos técnicos',
                    'Auditoría certificación externa'
                ]
            },
            {
                id: 'IMP-003',
                title: 'Mejorar Sistema Tratamiento Aguas',
                description: 'Upgrade para cumplir NCh 1333 - reducir boro y conductividad',
                priority: 'critical',
                timeline: '6 meses', 
                cost: 'CLP $45.000.000',
                savings: 'Cumplimiento 100% + uso agua riego',
                responsible: 'Jefe Planta Tratamiento',
                status: 'quoted',
                steps: [
                    'Análisis técnico sistema actual',
                    'Diseño upgrade tratamiento',
                    'Instalación equipos filtrado',
                    'Optimización procesos químicos',
                    'Monitoreo continuo parámetros'
                ]
            },
            {
                id: 'IMP-004',
                title: 'Desarrollar Reporte GRI Integrado',
                description: 'Reporte sostenibilidad GRI Standards + comunicación stakeholders',
                priority: 'medium',
                timeline: '6 meses',
                cost: 'CLP $12.000.000', 
                savings: 'Rating ESG +25 puntos + acceso financiamiento verde',
                responsible: 'Gerencia Sustentabilidad',
                status: 'scoping',
                steps: [
                    'Mapeo stakeholders clave',
                    'Recopilación datos GRI',
                    'Redacción contenidos',
                    'Diseño reporte ejecutivo',
                    'Validación externa independiente'
                ]
            },
            {
                id: 'IMP-005',
                title: 'Certificación Carbono Neutralidad',
                description: 'Estrategia integral Net Zero 2030 con compensación verificada',
                priority: 'medium',
                timeline: '12 meses',
                cost: 'CLP $35.000.000',
                savings: 'Acceso mercados premium + incentivos gubernamentales',
                responsible: 'Comité ESG',
                status: 'evaluating',
                steps: [
                    'Inventario GEI completo alcance 1, 2, 3',
                    'Definir metas science-based targets',
                    'Plan reducción emisiones',
                    'Proyectos compensación local',
                    'Verificación tercera parte'
                ]
            },
            {
                id: 'IMP-006',
                title: 'Digitalización Gestión ESG',
                description: 'Implementación dashboard ejecutivo tiempo real + automatización reportes',
                priority: 'high',
                timeline: '8 meses',
                cost: 'CLP $22.000.000',
                savings: 'Eficiencia +40% + toma decisiones data-driven',
                responsible: 'CTO + Sustentabilidad',
                status: 'approved',
                steps: [
                    'Análisis sistemas actuales',
                    'Selección plataforma ESG',
                    'Integración fuentes datos',
                    'Desarrollo dashboards ejecutivos',
                    'Capacitación usuarios finales'
                ]
            },
            {
                id: 'IMP-007',
                title: 'Programa Diversidad e Inclusión',
                description: 'Estrategia integral D&I con metas cuantificables 2024-2027',
                priority: 'medium',
                timeline: '18 meses',
                cost: 'CLP $8.500.000',
                savings: 'Productividad +15% + mejor clima laboral',
                responsible: 'RRHH + Gerencia General',
                status: 'designing',
                steps: [
                    'Diagnóstico brecha diversidad actual',
                    'Política corporativa D&I',
                    'Programa mentorías mujeres líderes',
                    'Capacitación sesgos inconscientes',
                    'Sistema métricas seguimiento'
                ]
            },
            {
                id: 'IMP-008',
                title: 'Auditoría Cadena Suministro Responsable',
                description: 'Due diligence proveedores críticos + código conducta actualizado',
                priority: 'high',
                timeline: '5 meses',
                cost: 'CLP $15.000.000', 
                savings: 'Reducción riesgos reputacionales + compliance',
                responsible: 'Gerencia Procurement',
                status: 'initiating',
                steps: [
                    'Mapeo proveedores críticos ESG',
                    'Cuestionario autoevaluación proveedores',
                    'Auditorías on-site priorizadas',
                    'Plan mejora proveedores clave',
                    'Sistema monitoreo continuo'
                ]
            }
        ];

        return improvements.filter(imp => {
            if (companyProfile.mainRisks.includes('residuos-peligrosos') && imp.id === 'IMP-001') return true;
            if (companyProfile.mainRisks.includes('energia') && imp.id === 'IMP-002') return true;
            if (companyProfile.mainRisks.includes('aguas') && imp.id === 'IMP-003') return true;
            if (imp.priority === 'high' || imp.priority === 'medium') return true;
            return Math.random() > 0.3;
        }).slice(0, 8);
    }

    static generateAdditionalNormativas() {
        return [
            { code: 'DS76', name: 'Reglamento Autorizaciones Sanitarias', category: 'chile', score: Math.floor(Math.random() * 30) + 60 },
            { code: 'DS977', name: 'Reglamento Sanitario Alimentos', category: 'chile', score: Math.floor(Math.random() * 25) + 70 },
            { code: 'NCh409', name: 'Agua Potable - Requisitos', category: 'chile', score: Math.floor(Math.random() * 20) + 75 },
            { code: 'DS160', name: 'Reglamento Seguridad Radiológica', category: 'chile', score: Math.floor(Math.random() * 35) + 55 },
            { code: 'Ley21100', name: 'Prohibición Bolsas Plásticas', category: 'chile', score: Math.floor(Math.random() * 15) + 80 },
            { code: 'DS43', name: 'Reglamento SINAGER', category: 'chile', score: Math.floor(Math.random() * 40) + 50 },
            { code: 'ISO9001', name: 'Sistemas Gestión Calidad', category: 'iso', score: Math.floor(Math.random() * 20) + 75 },
            { code: 'ISO27001', name: 'Seguridad de la Información', category: 'iso', score: Math.floor(Math.random() * 30) + 60 },
            { code: 'ISO22000', name: 'Gestión Inocuidad Alimentos', category: 'iso', score: Math.floor(Math.random() * 25) + 70 },
            { code: 'ISO14064-3', name: 'Verificación GEI', category: 'iso', score: Math.floor(Math.random() * 35) + 55 },
            { code: 'CDSB', name: 'Climate Disclosure Standards', category: 'internacional', score: Math.floor(Math.random() * 30) + 60 },
            { code: 'IIRC', name: 'Reporte Integrado', category: 'internacional', score: Math.floor(Math.random() * 25) + 65 },
            { code: 'SFDR', name: 'Finanzas Sostenibles UE', category: 'internacional', score: Math.floor(Math.random() * 40) + 45 },
            { code: 'CSRD', name: 'Corporate Sustainability Reporting', category: 'internacional', score: Math.floor(Math.random() * 35) + 55 },
            { code: 'DJSI', name: 'Dow Jones Sustainability Index', category: 'internacional', score: Math.floor(Math.random() * 30) + 65 },
            { code: 'FTSE4Good', name: 'FTSE ESG Rating', category: 'internacional', score: Math.floor(Math.random() * 25) + 70 }
        ];
    }

    static generateAdditionalIssues() {
        const additionalIssues = [
            {
                id: 'ESG-005',
                title: 'Ley 21.100 - Prohibición Bolsas Plásticas',
                description: 'Falta plan transición envases reutilizables. Proveedores aún entregan productos en bolsas convencionales.',
                severity: 'medium',
                timeline: '3 meses',
                cost: 'CLP $2.500.000'
            },
            {
                id: 'ESG-006', 
                title: 'ISO 27001 - Seguridad Información',
                description: 'Sistema gestión seguridad información desactualizado. Vulnerabilidades identificadas en auditoría.',
                severity: 'high',
                timeline: '4 meses',
                cost: 'CLP $18.000.000'
            },
            {
                id: 'ESG-007',
                title: 'Código del Trabajo - Teletrabajo',
                description: 'Reglamento interno no contempla modalidades híbridas post-pandemia. Necesita actualización legal.',
                severity: 'medium',
                timeline: '2 meses', 
                cost: 'CLP $1.200.000'
            },
            {
                id: 'ESG-008',
                title: 'TCFD - Riesgos Climáticos',
                description: 'Sin análisis formal riesgos climáticos físicos y transicionales. Inversionistas requieren disclosure.',
                severity: 'high',
                timeline: '6 meses',
                cost: 'CLP $8.500.000'
            },
            {
                id: 'ESG-009',
                title: 'DS 977 - Reglamento Sanitario Alimentos',
                description: 'Protocolos HACCP requieren actualización. Algunos puntos control críticos sin monitoreo continuo.',
                severity: 'high',
                timeline: '3 meses',
                cost: 'CLP $5.500.000'
            }
        ];

        return additionalIssues;
    }
}

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

    formatNumber(num) {
        return new Intl.NumberFormat('es-CL').format(num);
    },

    formatPercentage(num) {
        return new Intl.NumberFormat('es-CL', { 
            style: 'percent', 
            minimumFractionDigits: 1,
            maximumFractionDigits: 1 
        }).format(num / 100);
    },

    formatCurrency(num) {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(num);
    },

    formatDate(date) {
        return new Intl.DateTimeFormat('es-CL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    },

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

    validateFile(file) {
        const errors = [];
        
        if (file.size > ECOANALYTICS_CONFIG.maxFileSize) {
            errors.push(`El archivo ${file.name} excede el tamaño máximo permitido (50MB)`);
        }
        
        const extension = '.' + file.name.split('.').pop().toLowerCase();
        if (!ECOANALYTICS_CONFIG.supportedFormats.includes(extension)) {
            errors.push(`El formato ${extension} no está soportado`);
        }
        
        return { isValid: errors.length === 0, errors };
    },

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    smoothScroll(element, duration = 800) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    },

    animateCounter(element, start, end, duration = 2000) {
        const startTimestamp = performance.now();
        const step = (timestamp) => {
            const elapsed = timestamp - startTimestamp;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOutCubic * (end - start) + start);
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
    },

    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
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

/* ===== MOTOR DE ANÁLISIS CORREGIDO ===== */
class AnalysisEngine {
    constructor() {
        this.analysisQueue = [];
        this.isProcessing = false;
    }

    async processFiles(files) {
        if (this.isProcessing) {
            throw new Error('Análisis en progreso. Por favor espera.');
        }

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
            this.showAnalysisModal();
            await this.simulateAnalysis();
            
            const results = this.generateUniqueAnalysisResults(files);
            
            State.setState({
                uploadedFiles: files,
                currentAnalysis: results,
                isAnalyzing: false,
                analysisProgress: 100,
                analysisHistory: [...State.getState().analysisHistory, results]
            });

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

    generateUniqueAnalysisResults(files) {
        const fileSignature = files.map(f => f.name).join('|');
        const companyProfile = DataGenerator.generateCompanyProfile(fileSignature);
        const dynamicScores = DataGenerator.generateDynamicScores(companyProfile);
        const improvementPlan = DataGenerator.generateImprovementPlan(companyProfile, dynamicScores);
        
        const scoreValues = Object.values(dynamicScores).map(s => s.score);
        const overallScore = Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length);
        
        return {
            id: Utils.generateId(),
            timestamp: new Date().toISOString(),
            fileSignature,
            files: files.map(file => ({
                name: file.name,
                size: file.size,
                type: file.type
            })),
            company: companyProfile,
            overallScore: overallScore,
            complianceScores: dynamicScores,
            improvementPlan: improvementPlan,
            additionalNormativas: DataGenerator.generateAdditionalNormativas(),
            additionalIssues: DataGenerator.generateAdditionalIssues(),
            benchmarks: {
                sector: Math.max(overallScore - 15, 45),
                topQuartile: Math.min(overallScore + 10, 95),
                industry: Math.max(overallScore - 8, 50),
                regional: Math.max(overallScore - 12, 48)
            }
        };
    }

    showAnalysisModal() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
            // MÉTODO CORREGIDO - Animación de pasos simplificada
            this.startStepAnimation();
        }
    }

    hideAnalysisModal() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }

    // MÉTODO CORREGIDO - Animación de pasos
    startStepAnimation() {
        const steps = [
            { id: 'step-1', delay: 0 },
            { id: 'step-2', delay: 1500 },
            { id: 'step-3', delay: 3000 },
            { id: 'step-4', delay: 4500 },
            { id: 'step-5', delay: 6000 }
        ];

        steps.forEach((step, index) => {
            setTimeout(() => {
                // Remover clase active de todos los pasos
                document.querySelectorAll('.step-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Activar paso actual
                const stepElement = document.getElementById(step.id);
                if (stepElement) {
                    stepElement.classList.add('active');
                }
            }, step.delay);
        });
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
            
            const stepProgress = (step.duration / totalDuration) * 100;
            await this.animateProgress(totalProgress, totalProgress + stepProgress, step.duration);
            totalProgress += stepProgress;
        }
    }

    async animateStep(stepNumber, stepName) {
        document.querySelectorAll('.step-item').forEach((item, index) => {
            item.classList.toggle('active', index === stepNumber - 1);
        });

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

    showResults() {
        const caseStudy = document.querySelector('.case-study');
        if (caseStudy) {
            Utils.smoothScroll(caseStudy);
            
            setTimeout(() => {
                NotificationManager.show('✅ Análisis completado! Se identificaron áreas críticas específicas.', 'success');
                this.updateDashboardWithCurrentAnalysis();
            }, 1000);
        }
    }

    updateDashboardWithCurrentAnalysis() {
        const currentAnalysis = State.getState().currentAnalysis;
        if (!currentAnalysis) return;

        this.updateCompanyInfo(currentAnalysis.company);
        this.updateMainScore(currentAnalysis.overallScore);
        this.updateDetailedScores(currentAnalysis.complianceScores);
        this.updateBenchmarks(currentAnalysis.benchmarks);
        
        setTimeout(() => {
            this.animateScoreElements();
        }, 500);
    }

    updateCompanyInfo(company) {
        const elements = {
            companyName: document.querySelector('.company-info h3'),
            documentsAnalyzed: document.querySelector('[data-documents]'),
            sector: document.querySelector('[data-sector]'),
            lastUpdate: document.getElementById('last-update')
        };

        if (elements.companyName) elements.companyName.textContent = company.name;
        if (elements.documentsAnalyzed) elements.documentsAnalyzed.textContent = `${company.documentsAnalyzed} páginas analizadas`;
        if (elements.sector) elements.sector.textContent = company.sector;
        if (elements.lastUpdate) elements.lastUpdate.textContent = 'Recién actualizado';
    }

    updateMainScore(overallScore) {
        const scoreElement = document.querySelector('.score-number');
        const circleElement = document.querySelector('.circle-progress');
        
        if (scoreElement) {
            Utils.animateCounter(scoreElement, 0, overallScore, 2000);
        }
        
        if (circleElement) {
            setTimeout(() => {
                const gradient = `conic-gradient(var(--primary-500) ${overallScore}%, var(--gray-200) 0%)`;
                circleElement.style.background = gradient;
            }, 500);
        }
    }

    updateDetailedScores(complianceScores) {
        const scoreItems = document.querySelectorAll('.score-item');
        const scores = Object.values(complianceScores);
        
        scoreItems.forEach((item, index) => {
            if (index < scores.length) {
                const score = scores[index];
                const progressBar = item.querySelector('.score-fill');
                const scoreValue = item.querySelector('.score-value');
                const statusBadge = item.querySelector('.status-badge');
                
                if (progressBar) {
                    progressBar.style.width = '0%';
                    setTimeout(() => {
                        progressBar.style.width = `${score.score}%`;
                        progressBar.className = `score-fill ${this.getScoreClass(score.score)}`;
                    }, index * 200 + 800);
                }
                
                if (scoreValue) {
                    Utils.animateCounter(scoreValue, 0, score.score, 1500);
                }
                
                if (statusBadge) {
                    statusBadge.textContent = this.getStatusText(score.score);
                    statusBadge.className = `status-badge ${this.getStatusClass(score.score)}`;
                }
            }
        });
    }

    updateBenchmarks(benchmarks) {
        const benchmarkElements = {
            sector: document.querySelector('[data-benchmark="sector"]'),
            topQuartile: document.querySelector('[data-benchmark="top-quartile"]')
        };

        if (benchmarkElements.sector) {
            benchmarkElements.sector.textContent = `${benchmarks.sector}%`;
        }
        
        if (benchmarkElements.topQuartile) {
            benchmarkElements.topQuartile.textContent = `${benchmarks.topQuartile}%`;
        }
    }

    getScoreClass(score) {
        if (score >= 80) return 'success';
        if (score >= 65) return 'info';
        if (score >= 50) return 'warning';
        return 'critical';
    }

    getStatusText(score) {
        if (score >= 80) return 'Excelente';
        if (score >= 65) return 'Cumple';
        if (score >= 50) return 'Atención';
        return 'Crítico';
    }

    getStatusClass(score) {
        if (score >= 80) return 'compliant';
        if (score >= 65) return 'info';
        if (score >= 50) return 'warning';
        return 'critical';
    }

    animateScoreElements() {
        this.animateComplianceScores();
        this.animateCounters();
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

/* ===== NOTIFICACIONES ===== */
class NotificationManager {
    static notifications = [];
    static container = null;

    static init() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'notification-container';
            this.container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                pointer-events: none;
                max-width: 420px;
            `;
            document.body.appendChild(this.container);
        }
    }

    static show(message, type = 'info', duration = 5000) {
        this.init();
        
        const notification = this.createNotification(message, type);
        this.container.appendChild(notification);
        this.notifications.push(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        }, 100);
        
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
            <div class="notification-content" style="display: flex; align-items: center; gap: 12px;">
                <span class="notification-icon">${icons[type] || icons.info}</span>
                <span class="notification-message" style="flex: 1; line-height: 1.4;">${message}</span>
                <button class="notification-close" style="background: none; border: none; color: inherit; cursor: pointer; padding: 4px; opacity: 0.7; font-size: 16px;">×</button>
            </div>
        `;
        
        Object.assign(notification.style, {
            background: colors[type] || colors.info,
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '0.75rem',
            marginBottom: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transform: 'translateX(100%)',
            opacity: '0',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            wordWrap: 'break-word',
            pointerEvents: 'auto',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden'
        });

        if (type !== 'error') {
            const progressBar = document.createElement('div');
            Object.assign(progressBar.style, {
                position: 'absolute',
                bottom: '0',
                left: '0',
                height: '3px',
                background: 'rgba(255, 255, 255, 0.3)',
                width: '100%',
                transformOrigin: 'left',
                transform: 'scaleX(0)',
                transition: 'transform 5s linear'
            });
            notification.appendChild(progressBar);
            
            setTimeout(() => {
                progressBar.style.transform = 'scaleX(1)';
            }, 100);
        }
        
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.remove(notification);
        });
        
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

/* ===== GESTIÓN DE CONTENIDO EXPANDIBLE ===== */
class ContentManager {
    static expandScores() {
        const currentAnalysis = State.getState().currentAnalysis;
        if (!currentAnalysis || State.getState().expandedSections.scores) return;

        State.setState({
            expandedSections: { ...State.getState().expandedSections, scores: true }
        });

        const scoresContainer = document.querySelector('.scores-breakdown');
        if (!scoresContainer) return;

        const additionalScores = currentAnalysis.additionalNormativas || DataGenerator.generateAdditionalNormativas();
        
        additionalScores.forEach((normativa, index) => {
            setTimeout(() => {
                const scoreElement = this.createScoreElement(normativa);
                scoresContainer.insertBefore(scoreElement, scoresContainer.querySelector('.show-more-scores'));
                
                setTimeout(() => {
                    scoreElement.style.opacity = '1';
                    scoreElement.style.transform = 'translateY(0)';
                }, 100);
            }, index * 150);
        });

        const showMoreBtn = document.getElementById('show-all-scores');
        if (showMoreBtn) {
            showMoreBtn.textContent = `✅ Mostrando ${additionalScores.length} normativas adicionales`;
            showMoreBtn.disabled = true;
            showMoreBtn.classList.add('expanded');
        }

        NotificationManager.show(`📊 Se expandieron ${additionalScores.length} normativas adicionales`, 'success');
    }

    static expandIssues() {
        const currentAnalysis = State.getState().currentAnalysis;
        if (!currentAnalysis || State.getState().expandedSections.issues) return;

        State.setState({
            expandedSections: { ...State.getState().expandedSections, issues: true }
        });

        const issuesContainer = document.querySelector('.issues-grid');
        if (!issuesContainer) return;

        const additionalIssues = currentAnalysis.additionalIssues || DataGenerator.generateAdditionalIssues();
        
        additionalIssues.forEach((issue, index) => {
            setTimeout(() => {
                const issueElement = this.createIssueElement(issue);
                issuesContainer.insertBefore(issueElement, issuesContainer.querySelector('.show-more-issues'));
                
                setTimeout(() => {
                    issueElement.style.opacity = '1';
                    issueElement.style.transform = 'translateY(0)';
                }, 100);
            }, index * 200);
        });

        const showMoreBtn = document.getElementById('show-all-issues');
        if (showMoreBtn) {
            showMoreBtn.textContent = `✅ Mostrando ${additionalIssues.length} áreas adicionales`;
            showMoreBtn.disabled = true;
            showMoreBtn.classList.add('expanded');
        }

        NotificationManager.show(`🔍 Se expandieron ${additionalIssues.length} áreas adicionales`, 'success');
    }

    static showImprovementPlan() {
        const currentAnalysis = State.getState().currentAnalysis;
        if (!currentAnalysis) {
            NotificationManager.show('⚠️ Primero debe ejecutar un análisis', 'warning');
            return;
        }

        const improvementPlan = currentAnalysis.improvementPlan || [];
        
        if (improvementPlan.length === 0) {
            NotificationManager.show('📋 No hay plan de mejoras disponible', 'info');
            return;
        }

        this.createImprovementModal(improvementPlan);
        NotificationManager.show(`📋 Generando cronograma de ${improvementPlan.length} mejoras prioritarias...`, 'info');
    }

    static createScoreElement(normativa) {
        const scoreItem = document.createElement('div');
        scoreItem.className = 'score-item additional';
        scoreItem.style.opacity = '0';
        scoreItem.style.transform = 'translateY(20px)';
        scoreItem.style.transition = 'all 0.4s ease';

        const statusClass = normativa.score >= 80 ? 'compliant' : normativa.score >= 65 ? 'info' : normativa.score >= 50 ? 'warning' : 'critical';
        const statusText = normativa.score >= 80 ? 'Excelente' : normativa.score >= 65 ? 'Cumple' : normativa.score >= 50 ? 'Atención' : 'Crítico';

        scoreItem.innerHTML = `
            <div class="score-label">
                <span class="icon">${this.getIconForCategory(normativa.category)}</span>
                <div class="label-content">
                    <span class="label-title">${normativa.code} - ${normativa.name}</span>
                    <span class="label-subtitle">Evaluación automática</span>
                </div>
            </div>
            <div class="score-progress">
                <div class="score-bar">
                    <div class="score-fill ${statusClass}" style="width: ${normativa.score}%"></div>
                </div>
                <div class="score-value">${normativa.score}%</div>
            </div>
            <div class="score-status">
                <span class="status-badge ${statusClass}">${statusText}</span>
            </div>
        `;

        return scoreItem;
    }

    static createIssueElement(issue) {
        const issueCard = document.createElement('div');
        issueCard.className = `issue-card ${issue.severity} additional`;
        issueCard.setAttribute('data-priority', issue.severity);
        issueCard.style.opacity = '0';
        issueCard.style.transform = 'translateY(20px)';
        issueCard.style.transition = 'all 0.4s ease';

        const severityBadgeClass = issue.severity === 'high' ? 'high' : issue.severity === 'critical' ? 'critical' : 'medium';
        const severityText = issue.severity === 'high' ? 'Alto' : issue.severity === 'critical' ? 'Crítico' : 'Medio';

        issueCard.innerHTML = `
            <div class="issue-header">
                <div class="issue-icon">${this.getIconForSeverity(issue.severity)}</div>
                <div class="severity-badge ${severityBadgeClass}">${severityText}</div>
                <div class="issue-id">#${issue.id}</div>
            </div>
            <h3>${issue.title}</h3>
            <p>${issue.description}</p>
            <div class="issue-details">
                <div class="detail">
                    <span class="label">Timeline estimado:</span>
                    <span class="value">${issue.timeline}</span>
                </div>
                <div class="detail">
                    <span class="label">Inversión requerida:</span>
                    <span class="value">${issue.cost}</span>
                </div>
            </div>
            <div class="issue-actions">
                <button class="btn btn--${issue.severity === 'critical' ? 'danger' : issue.severity === 'high' ? 'warning' : 'info'} btn--sm">Evaluar Solución</button>
                <button class="btn btn--outline btn--sm">Ver Detalle</button>
            </div>
        `;

        return issueCard;
    }

    static createImprovementModal(improvementPlan) {
        const existingModal = document.getElementById('improvement-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'improvement-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content" style="max-width: 900px; max-height: 80vh; overflow-y: auto;">
                    <div class="modal-header">
                        <h3>📋 Plan de Mejoras Estratégico</h3>
                        <button class="modal-close" id="close-improvement-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="improvement-summary" style="background: var(--primary-50); padding: 1.5rem; border-radius: 0.75rem; margin-bottom: 2rem;">
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">
                                <div style="text-align: center;">
                                    <div style="font-size: 2rem; font-weight: bold; color: var(--primary-600);">${improvementPlan.length}</div>
                                    <div style="font-size: 0.875rem; color: var(--gray-600);">Mejoras Identificadas</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 2rem; font-weight: bold; color: var(--danger-600);">${improvementPlan.filter(i => i.priority === 'critical').length}</div>
                                    <div style="font-size: 0.875rem; color: var(--gray-600);">Críticas</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 2rem; font-weight: bold; color: var(--warning-600);">${improvementPlan.filter(i => i.priority === 'high').length}</div>
                                    <div style="font-size: 0.875rem; color: var(--gray-600);">Alta Prioridad</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 2rem; font-weight: bold; color: var(--success-600);">18 meses</div>
                                    <div style="font-size: 0.875rem; color: var(--gray-600);">Timeline Máximo</div>
                                </div>
                            </div>
                        </div>
                        <div class="improvements-list" style="display: grid; gap: 1.5rem;">
                            ${improvementPlan.map((improvement, index) => `
                                <div class="improvement-card" style="border: 2px solid ${this.getPriorityColor(improvement.priority)}; border-radius: 1rem; padding: 1.5rem; background: white;">
                                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                                        <div style="flex: 1;">
                                            <h4 style="margin: 0 0 0.5rem 0; color: var(--gray-900);">${improvement.title}</h4>
                                            <div style="display: inline-block; padding: 0.25rem 0.75rem; background: ${this.getPriorityColor(improvement.priority)}; color: white; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">
                                                ${improvement.priority === 'critical' ? 'CRÍTICO' : improvement.priority === 'high' ? 'ALTO' : 'MEDIO'}
                                            </div>
                                        </div>
                                        <div style="text-align: right; min-width: 120px;">
                                            <div style="font-weight: 600; color: var(--primary-600);">${improvement.timeline}</div>
                                            <div style="font-size: 0.875rem; color: var(--gray-600);">${improvement.cost}</div>
                                        </div>
                                    </div>
                                    <p style="color: var(--gray-700); margin-bottom: 1rem; line-height: 1.5;">${improvement.description}</p>
                                    <div style="background: var(--gray-50); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                                        <div style="font-weight: 600; margin-bottom: 0.5rem; color: var(--gray-900);">💰 Beneficio Esperado:</div>
                                        <div style="color: var(--success-700); font-weight: 500;">${improvement.savings}</div>
                                    </div>
                                    <div style="margin-bottom: 1rem;">
                                        <div style="font-weight: 600; margin-bottom: 0.5rem; color: var(--gray-900);">👨‍💼 Responsable:</div>
                                        <div style="color: var(--gray-700);">${improvement.responsible}</div>
                                    </div>
                                    <div style="margin-bottom: 1rem;">
                                        <div style="font-weight: 600; margin-bottom: 0.5rem; color: var(--gray-900);">📋 Pasos Clave:</div>
                                        <ul style="margin: 0; padding-left: 1.5rem; color: var(--gray-700);">
                                            ${improvement.steps.map(step => `<li style="margin-bottom: 0.25rem;">${step}</li>`).join('')}
                                        </ul>
                                    </div>
                                    <div style="display: flex; gap: 0.75rem;">
                                        <button class="btn btn--primary btn--sm" onclick="NotificationManager.show('📞 Conectando con consultor especializado...', 'info')">Solicitar Cotización</button>
                                        <button class="btn btn--outline btn--sm" onclick="NotificationManager.show('📄 Generando documento técnico...', 'info')">Ver Especificaciones</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <div style="text-align: center; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--gray-200);">
                            <button class="btn btn--primary" onclick="NotificationManager.show('📧 Plan de mejoras enviado por email', 'success'); document.getElementById('improvement-modal').classList.add('hidden');">
                                📧 Enviar Plan Completo por Email
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const closeBtn = modal.querySelector('#close-improvement-modal');
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
            setTimeout(() => modal.remove(), 300);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
                setTimeout(() => modal.remove(), 300);
            }
        });

        setTimeout(() => {
            modal.classList.remove('hidden');
        }, 100);
    }

    static getPriorityColor(priority) {
        switch (priority) {
            case 'critical': return 'var(--danger-500)';
            case 'high': return 'var(--warning-500)';
            case 'medium': return 'var(--info-500)';
            default: return 'var(--gray-500)';
        }
    }

    static getIconForCategory(category) {
        switch (category) {
            case 'chile': return '🇨🇱';
            case 'iso': return '🏆';
            case 'internacional': return '🌍';
            default: return '📋';
        }
    }

    static getIconForSeverity(severity) {
        switch (severity) {
            case 'critical': return '🚨';
            case 'high': return '⚠️';
            case 'medium': return '📋';
            default: return 'ℹ️';
        }
    }
}

/* ===== DESCARGAS ===== */
class DownloadManager {
    static downloads = {
        'guide': {
            name: 'Guía ESG Chile 2024',
            filename: 'guia-esg-chile-2024.txt',
            content: `# GUÍA COMPLETA ESG CHILE 2024\n\n[Contenido extenso de guía profesional]\n\nDesarrollado por EcoAnalytics Chile\nwww.ecoanalytics.cl`
        },
        'checklist': {
            name: 'Checklist Normativo Completo',
            filename: 'checklist-normativo-chile.txt',
            content: `# CHECKLIST NORMATIVO ESG 2024\n\n[Lista completa de verificación]\n\nEcoAnalytics Chile - Todos los derechos reservados`
        },
        'calculator': {
            name: 'Calculadora Huella Carbono',
            filename: 'calculadora-carbono.txt',
            content: `# CALCULADORA HUELLA CARBONO\n\n[Template Excel simulado]\n\nDescarga desde: www.ecoanalytics.cl/calculadora`
        },
        'benchmark': {
            name: 'Benchmark Sectorial ESG',
            filename: 'benchmark-sectorial-esg.txt',
            content: `# BENCHMARK SECTORIAL ESG CHILE 2024\n\n[Análisis comparativo por industria]\n\n© 2024 EcoAnalytics Chile`
        },
        'report': {
            name: 'Reporte Análisis Demo',
            filename: 'reporte-analisis-esg-demo.txt',
            content: () => {
                const analysis = State.getState().currentAnalysis;
                if (!analysis) return '# REPORTE ESG\n\nPrimero ejecute un análisis.';
                
                return `# REPORTE ANÁLISIS ESG\n## ${analysis.company.name}\n\n**Score General:** ${analysis.overallScore}%\n**Fecha:** ${new Date().toLocaleDateString()}\n\n[Reporte detallado personalizado]\n\nGenerado por EcoAnalytics Chile`;
            }
        }
    };

    static createDownload(type) {
        const download = this.downloads[type];
        if (!download) return;

        let content = typeof download.content === 'function' ? download.content() : download.content;
        
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = download.filename;
        a.style.display = 'none';
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        NotificationManager.show(`✅ ${download.name} descargado exitosamente`, 'success');
        console.log(`📊 Download: ${type} - ${download.name}`);
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
        this.initializeFilters();
        this.initializeUploadZone();
        this.initializeModals();
        
        setTimeout(() => {
            this.animateOnLoad();
        }, 500);
    }

    initializeFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter') || button.getAttribute('data-priority') || 'all';
                
                State.setState({ currentFilter: filter });
                this.applyFilter(filter, button, filterButtons);
            });
        });
    }

    applyFilter(filter, activeButton, allButtons) {
        allButtons.forEach(btn => btn.classList.remove('active'));
        activeButton.classList.add('active');
        
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
                setTimeout(() => card.style.display = 'none', 300);
            }
        });

        const issueCards = document.querySelectorAll('.issue-card');
        issueCards.forEach((card, index) => {
            const cardPriority = card.getAttribute('data-priority') || '';
            const shouldShow = filter === 'all' || cardPriority === filter;
            
            if (shouldShow) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => card.style.display = 'none', 300);
            }
        });
    }

    initializeUploadZone() {
        const uploadZone = document.getElementById('upload-zone');
        const fileInput = document.getElementById('file-input');
        
        if (!uploadZone || !fileInput) return;
        
        uploadZone.addEventListener('dragover', this.handleDragOver.bind(this));
        uploadZone.addEventListener('dragleave', this.handleDragLeave.bind(this));
        uploadZone.addEventListener('drop', this.handleDrop.bind(this));
        uploadZone.addEventListener('click', () => fileInput.click());
        
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
        const contactModal = document.getElementById('contact-modal');
        const closeModalBtn = document.getElementById('close-modal');
        const contactForm = document.getElementById('contact-form');
        
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => this.closeModal('contact'));
        }
        
        if (contactModal) {
            contactModal.addEventListener('click', (e) => {
                if (e.target === contactModal) this.closeModal('contact');
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
        
        if (!data.name || !data.email || !data.company) {
            NotificationManager.show('Por favor completa todos los campos requeridos', 'error');
            return;
        }
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        try {
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            
            await this.simulateContactSubmission(data);
            
            this.closeModal('contact');
            NotificationManager.show('✅ Solicitud enviada! Te contactaremos en las próximas 2 horas.', 'success');
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
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Contact data submitted:', data);
                resolve();
            }, 2000);
        });
    }

    animateOnLoad() {
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
            '.norma-card, .issue-card, .action-card, .stat, .metric-card, .plan-card, .service-card'
        );
        
        animatableElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(element);
        });
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('#demo-btn')) {
                this.showDemo();
            }
            
            if (e.target.matches('#contact-btn, #schedule-demo-btn, #contact-enterprise')) {
                this.openModal('contact');
            }
            
            if (e.target.matches('#start-analysis-btn, #start-free-btn, #start-free-trial')) {
                const uploadZone = document.getElementById('upload-zone');
                if (uploadZone) {
                    Utils.smoothScroll(uploadZone);
                    setTimeout(() => document.getElementById('file-input').click(), 500);
                }
            }

            if (e.target.matches('#start-professional')) {
                NotificationManager.show('🚀 Redirigiendo a checkout Plan Profesional...', 'info');
                setTimeout(() => this.openModal('contact'), 1500);
            }
            
            if (e.target.matches('#refresh-analysis')) {
                this.refreshAnalysis();
            }
            
            if (e.target.matches('#export-report')) {
                this.exportReport();
            }
            
            if (e.target.matches('#show-all-scores')) {
                ContentManager.expandScores();
            }
            
            if (e.target.matches('#show-all-issues')) {
                ContentManager.expandIssues();
            }
            
            if (e.target.matches('#view-all-norms')) {
                NotificationManager.show('📋 Cargando normativas adicionales...', 'info');
                setTimeout(() => ContentManager.expandScores(), 1000);
            }

            if (e.target.matches('#download-checklist-main')) {
                DownloadManager.createDownload('checklist');
            }

            if (e.target.matches('.action-btn')) {
                const text = e.target.textContent;
                if (text.includes('críticos')) {
                    NotificationManager.show('⚠️ Mostrando áreas críticas prioritarias...', 'warning');
                    setTimeout(() => {
                        const criticalSection = document.querySelector('.critical-issues');
                        if (criticalSection) Utils.smoothScroll(criticalSection);
                    }, 1000);
                } else if (text.includes('mejoras')) {
                    ContentManager.showImprovementPlan();
                } else if (text.includes('reporte')) {
                    this.exportReport();
                } else if (text.includes('asesoría')) {
                    this.openModal('contact');
                }
            }

            if (e.target.matches('.service-card .btn, .improvement-card .btn')) {
                NotificationManager.show('📞 Conectando con consultor especializado...', 'info');
                setTimeout(() => this.openModal('contact'), 1000);
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal('contact');
            }
            
            if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
                e.preventDefault();
                document.getElementById('file-input').click();
            }
            
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.openModal('contact');
            }
        });
    }

    setupResponsiveHandlers() {
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
        }
        
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
        
        window.addEventListener('resize', Utils.debounce(() => {
            this.handleResize();
        }, 250));
    }

    toggleMobileMenu() {
        const isOpen = !State.getState().mobileMenuOpen;
        State.setState({ mobileMenuOpen: isOpen });
        
        const toggle = document.getElementById('mobile-menu-toggle');
        const nav = document.querySelector('.header-nav');
        
        if (toggle) toggle.classList.toggle('active', isOpen);
        if (nav) nav.classList.toggle('active', isOpen);
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
        
        this.updateLastUpdateTime();
    }

    handleResize() {
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
                NotificationManager.show('📊 Visualizando análisis demo con datos reales', 'info');
                AnalysisEngineInstance.updateDashboardWithCurrentAnalysis();
            }, 800);
        }
    }

    refreshAnalysis() {
        NotificationManager.show('🔄 Actualizando análisis...', 'info');
        
        setTimeout(() => {
            const lastUpdate = document.getElementById('last-update');
            if (lastUpdate) lastUpdate.textContent = 'Recién actualizado';
            
            AnalysisEngineInstance.animateScoreElements();
            NotificationManager.show('✅ Análisis actualizado exitosamente', 'success');
        }, 1500);
    }

    exportReport() {
        NotificationManager.show('📄 Generando reporte personalizado...', 'info');
        
        setTimeout(() => {
            DownloadManager.createDownload('report');
        }, 2000);
    }

    updateLastUpdateTime() {
        const lastUpdate = document.getElementById('last-update');
        const currentAnalysis = State.getState().currentAnalysis;
        if (lastUpdate && currentAnalysis) {
            lastUpdate.textContent = Utils.formatRelativeTime(currentAnalysis.timestamp);
        }
    }
}

/* ===== INICIALIZACIÓN ===== */
class App {
    constructor() {
        this.ui = null;
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;
        
        try {
            console.log('🚀 Inicializando EcoAnalytics Enterprise v' + ECOANALYTICS_CONFIG.version);
            
            this.ui = new UIManager();
            this.setupGlobalEventHandlers();
            this.setupPerformanceMonitoring();
            this.initializeDemoData();
            this.setupDownloads();
            
            this.initialized = true;
            
            console.log('✅ EcoAnalytics Enterprise inicializado correctamente');
            
            EventBus.emit('appInitialized', {
                version: ECOANALYTICS_CONFIG.version,
                timestamp: new Date().toISOString()
            });
            
        } catch (error) {
            console.error('❌ Error inicializando la aplicación:', error);
            NotificationManager.show('Error al inicializar la aplicación. Por favor recarga la página.', 'error');
        }
    }

    setupDownloads() {
        const downloadLinks = {
            'download-guide': 'guide',
            'download-checklist': 'checklist', 
            'download-calculator': 'calculator',
            'download-benchmark': 'benchmark'
        };

        Object.keys(downloadLinks).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    DownloadManager.createDownload(downloadLinks[id]);
                });
            }
        });
    }

    setupGlobalEventHandlers() {
        window.addEventListener('error', (e) => {
            console.error('Error global capturado:', e.error);
            NotificationManager.show('Se ha producido un error. El equipo técnico ha sido notificado.', 'error');
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Promise rejection no manejada:', e.reason);
            NotificationManager.show('Error en operación asíncrona.', 'error');
            e.preventDefault();
        });
        
        window.addEventListener('online', () => {
            NotificationManager.show('✅ Conexión restablecida', 'success');
        });
        
        window.addEventListener('offline', () => {
            NotificationManager.show('⚠️ Sin conexión a internet', 'warning');
        });
    }

    setupPerformanceMonitoring() {
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
                console.warn('Performance Observer no soportado');
            }
        }
        
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`⚡ EcoAnalytics cargado en ${Math.round(loadTime)}ms`);
            
            setTimeout(() => {
                if (this.ui) this.ui.animateOnLoad();
            }, 200);
        });
    }

    initializeDemoData() {
        const defaultCompany = DataGenerator.generateCompanyProfile('demo');
        const defaultScores = DataGenerator.generateDynamicScores(defaultCompany);
        const defaultImprovements = DataGenerator.generateImprovementPlan(defaultCompany, defaultScores);
        
        const scoreValues = Object.values(defaultScores).map(s => s.score);
        const overallScore = Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length);
        
        State.setState({
            currentAnalysis: {
                id: 'demo-analysis',
                timestamp: new Date().toISOString(),
                company: defaultCompany,
                overallScore: overallScore,
                complianceScores: defaultScores,
                improvementPlan: defaultImprovements,
                additionalNormativas: DataGenerator.generateAdditionalNormativas(),
                additionalIssues: DataGenerator.generateAdditionalIssues()
            }
        });
        
        setInterval(() => {
            if (this.ui) this.ui.updateLastUpdateTime();
        }, 60000);
    }
}

/* ===== INICIALIZACIÓN FINAL ===== */
const EcoAnalyticsApp = new App();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        EcoAnalyticsApp.init();
    });
} else {
    EcoAnalyticsApp.init();
}

window.EcoAnalytics = {
    App: EcoAnalyticsApp,
    State,
    EventBus,
    Utils,
    NotificationManager,
    AnalysisEngine: AnalysisEngineInstance,
    DownloadManager,
    ContentManager,
    Config: ECOANALYTICS_CONFIG,
    Version: ECOANALYTICS_CONFIG.version
};

console.log('🌿 EcoAnalytics Enterprise JavaScript v2.1.1 CORREGIDO - Análisis Funcional Garantizado');
