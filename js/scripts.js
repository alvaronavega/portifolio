class CyberTerminal {
    constructor() {
        this.modal = document.getElementById('terminal-modal');
        this.output = document.querySelector('.terminal-output');
        this.contactsContainer = document.querySelector('.terminal-contacts');
        this.closeBtn = document.querySelector('.terminal-close');
        this.contactBtn = document.getElementById('contact-btn');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('.section');
        this.skillItems = document.querySelectorAll('.skill-item');
        this.skillDescription = document.getElementById('skill-description');
        
        this.contacts = {
            'linkedin': {
                label: "LinkedIn",
                value: "linkedin.com/in/alvaronavega",
                action: () => window.open('https://www.linkedin.com/in/alvaronavega/', '_blank'),
                icon: "ph ph-linkedin-logo"
            },
            'email': {
                label: "Email",
                value: "alvaronavegawork@gmail.com",
                action: () => window.location.href = 'mailto:alvaronavegawork@gmail.com',
                icon: "ph ph-envelope"
            },
            'whatsapp': {
                label: "WhatsApp",
                value: "+55 46 98807-8385",
                action: () => window.open('https://wa.me/5546988078385', '_blank'),
                icon: "ph ph-whatsapp-logo"
            },
            'github': {
                label: "GitHub",
                value: "github.com/alvaronavega",
                action: () => window.open('https://github.com/alvaronavega', '_blank'),
                icon: "ph ph-github-logo"
            }
        };

        this.initMessages = [
            {text: "> SISTEMA DE CONTATO v2.4.1 INICIADO", delay: 30},
            {text: "> CARREGANDO DADOS DO USUÁRIO...", delay: 25},
            {text: "> VERIFICANDO CREDENCIAIS...", delay: 20},
            {text: "> CONECTANDO À REDE...", delay: 15},
            {text: "> ESTABELECENDO CONEXÃO SEGURA...", delay: 10},
        ];

        this.init();
    }

    init() {
        this.setupEvents();
        this.setupScrollSpy();
        this.setupExperienceAccordion();
        this.setupSkillDescriptions();
        this.setupCompetencyTooltips();
    }

    setupEvents() {
        this.contactBtn.addEventListener('click', this.openTerminal.bind(this));
        
        this.closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeTerminal();
        });
        
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeTerminal();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'flex') {
                this.closeTerminal();
            }
        });

        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = link.getAttribute('href').substring(1);
                this.scrollToSection(sectionId);
            });
        });
    }

    setupScrollSpy() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                    const sectionId = entry.target.id;
                    this.setActiveNavLink(sectionId);
                }
            });
        }, { 
            threshold: [0.5],
            rootMargin: '-70px 0px 0px 0px'
        });

        this.sections.forEach(section => observer.observe(section));
    }

    setupExperienceAccordion() {
        document.querySelectorAll('.experience-item').forEach(item => {
            const header = item.querySelector('.experience-header');
            const icon = header.querySelector('.ph');
            
            header.addEventListener('click', () => {
                document.querySelectorAll('.experience-item').forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.experience-details').style.maxHeight = '0';
                        otherItem.querySelector('.ph').classList.replace('ph-caret-up', 'ph-caret-down');
                    }
                });

                const isActive = item.classList.toggle('active');
                icon.classList.toggle('ph-caret-down', !isActive);
                icon.classList.toggle('ph-caret-up', isActive);

                const details = item.querySelector('.experience-details');
                if (isActive) {
                    details.style.maxHeight = `${details.scrollHeight}px`;
                } else {
                    details.style.maxHeight = '0';
                }
            });
        });
    }

    setupSkillDescriptions() {
        this.skillItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                
                const title = item.textContent.trim();
                const description = item.dataset.description;
                const iconClass = item.querySelector('i')?.className || 'ph ph-info';
                
                this.skillDescription.innerHTML = `
                    <h4><i class="${iconClass}"></i> ${title}</h4>
                    <p>${description}</p>
                    <div class="skill-close">
                        <i class="ph ph-x"></i>
                    </div>
                `;
                
                this.skillDescription.style.display = 'block';
                
                this.skillDescription.querySelector('.skill-close').addEventListener('click', () => {
                    this.skillDescription.style.display = 'none';
                });
                
                document.addEventListener('click', (e) => {
                    if (!this.skillDescription.contains(e.target) && !item.contains(e.target)) {
                        this.skillDescription.style.display = 'none';
                    }
                }, { once: true });
            });
        });
    }

    setupCompetencyTooltips() {
        document.querySelectorAll('.skills-tags span').forEach(tag => {
            const tooltip = tag.dataset.tooltip;
            const description = tag.dataset.description;
            
            if(tooltip && description) {
                tag.addEventListener('click', (e) => {
                    this.skillDescription.innerHTML = `
                        <h4>${tooltip}</h4>
                        <p>${description}</p>
                        <div class="skill-close">
                            <i class="ph ph-x"></i>
                        </div>
                    `;
                    this.skillDescription.style.display = 'block';
                    
                    this.skillDescription.querySelector('.skill-close').addEventListener('click', () => {
                        this.skillDescription.style.display = 'none';
                    });
                });
            }
        });
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            window.scrollTo({
                behavior: 'smooth',
                top: section.offsetTop - 70
            });
            this.setActiveNavLink(sectionId);
        }
    }

    setActiveNavLink(sectionId) {
        this.navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
        });
    }

    openTerminal() {
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        this.output.innerHTML = '';
        this.contactsContainer.innerHTML = '';
        
        this.showInitMessages()
            .then(() => this.showLoadingBar())
            .then(() => this.showContactSheet());
    }

    closeTerminal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    async showInitMessages() {
        for (const item of this.initMessages) {
            await this.typeText(item.text, item.delay);
        }
    }

    async showLoadingBar() {
        const loadingContainer = document.createElement('div');
        loadingContainer.className = 'terminal-line';
        
        const loadingBar = document.createElement('div');
        loadingBar.className = 'loading-bar';
        
        const loadingProgress = document.createElement('div');
        loadingProgress.className = 'loading-progress';
        
        loadingBar.appendChild(loadingProgress);
        loadingContainer.appendChild(loadingBar);
        this.output.appendChild(loadingContainer);
        
        await this.animateLoadingBar(loadingProgress);
        await this.typeText("> CONEXÃO ESTABELECIDA COM SUCESSO", 10);
        await this.typeText("> CARREGANDO DADOS DE CONTATO...", 8);
    }

    animateLoadingBar(progressBar) {
        return new Promise((resolve) => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress > 100) progress = 100;
                progressBar.style.width = `${progress}%`;
                
                if (progress >= 100) {
                    clearInterval(interval);
                    setTimeout(resolve, 300);
                }
            }, 100);
        });
    }

    async showContactSheet() {
        this.clearTerminal();
        
        await this.typeText("> DADOS DE CONTATO DISPONÍVEIS:", 10);
        await this.typeText("> ----------------------------", 10);
        
        const contactData = [
            "NOME: Alvaro Navega",
            "CARGO: QA Specialist",
            "EMAIL: alvaronavegawork@gmail.com",
            "LINKEDIN: linkedin.com/in/alvaronavega",
            "GITHUB: github.com/alvaronavega",
            "WHATSAPP: +55 46 98807-8385"
        ];

        for (const line of contactData) {
            await this.typeText(line, 8);
        }

        await this.typeText("> ----------------------------", 10);
        await this.typeText("> SELECIONE UM MÉTODO DE CONTATO:", 10);
        
        this.createContactButtons();
    }

    createContactButtons() {
        this.contactsContainer.innerHTML = '';
        
        Object.entries(this.contacts).forEach(([key, contact]) => {
            const button = document.createElement('div');
            button.className = 'contact-button';
            button.innerHTML = `<i class="${contact.icon}"></i> ${contact.label}`;
            
            button.addEventListener('click', () => {
                button.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    button.style.transform = '';
                    contact.action();
                }, 200);
            });
            
            this.contactsContainer.appendChild(button);
        });
    }

    clearTerminal() {
        this.output.innerHTML = '';
        this.contactsContainer.innerHTML = '';
    }

    async typeText(text, speed) {
        return new Promise((resolve) => {
            const element = document.createElement('div');
            element.className = 'terminal-line';
            this.output.appendChild(element);

            let i = 0;
            const typingInterval = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    this.output.scrollTop = this.output.scrollHeight;
                } else {
                    clearInterval(typingInterval);
                    setTimeout(resolve, 100);
                }
            }, speed);
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const terminal = new CyberTerminal();
});