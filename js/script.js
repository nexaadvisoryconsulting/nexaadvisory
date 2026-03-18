// js/script.js

// Initialize AOS
AOS.init({ duration: 800, once: true });

// ==================== SEARCH FUNCTIONALITY ====================
function toggleSearch() {
    document.getElementById('searchDropdown').classList.toggle('active');
}

// Sample search data
const searchData = [
    { title: 'Accounting Services', category: 'Services', path: 'services.html#accounting' },
    { title: 'Tax Return Filing', category: 'Services', path: 'services.html#tax' },
    { title: 'Corporate Advisory', category: 'Services', path: 'services.html#corporate' },
    { title: 'Management Consulting', category: 'Services', path: 'services.html#management' },
    { title: 'NFRS/IFRS Implementation', category: 'Services', path: 'services.html#ifrs' },
    { title: 'Training & Courses', category: 'Services', path: 'services.html#training' },
    { title: 'Banking & Finance', category: 'Industries', path: 'industries.html' },
    { title: 'Tourism & Hospitality', category: 'Industries', path: 'industries.html' },
    { title: 'About NEXA', category: 'Company', path: 'about.html' }
];

document.getElementById('searchInput')?.addEventListener('input', function(e) {
    const query = e.target.value.toLowerCase();
    const results = searchData.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.category.toLowerCase().includes(query)
    );
    
    const resultsHtml = results.map(result => `
        <a href="${result.path}" class="search-result-item">
            <div class="search-result-title">${result.title}</div>
            <div class="search-result-category">${result.category}</div>
        </a>
    `).join('');
    
    document.getElementById('searchResults').innerHTML = resultsHtml || '<div style="padding: 1rem; text-align: center;">No results found</div>';
});

// Close search dropdown when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.search-wrapper')) {
        document.getElementById('searchDropdown')?.classList.remove('active');
    }
});

// ==================== MOBILE MENU ====================
function toggleMobileMenu() {
    document.getElementById('navMenu').classList.toggle('active');
}

// ==================== MOVE TO TOP ====================
window.addEventListener('scroll', function() {
    const btn = document.getElementById('moveToTop');
    if (window.scrollY > 300) {
        btn.classList.add('show');
    } else {
        btn.classList.remove('show');
    }
});

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==================== CONTACT FORM ====================
function handleContactSubmit(e) {
    e.preventDefault();
    showToast('Thank you for your message! We will get back to you soon.', 'success');
    e.target.reset();
}

// ==================== NEWSLETTER SUBMISSION ====================
function handleNewsletterSubmit(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    showToast(`Thank you for subscribing! We'll keep you updated.`, 'success');
    e.target.reset();
}

// ==================== TOAST NOTIFICATION ====================
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.borderLeftColor = type === 'error' ? '#ef4444' : '#c6a15b';
    toast.style.display = 'block';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// Make functions global
window.toggleSearch = toggleSearch;
window.toggleMobileMenu = toggleMobileMenu;
window.scrollToTop = scrollToTop;
window.handleContactSubmit = handleContactSubmit;
window.handleNewsletterSubmit = handleNewsletterSubmit;

// ==================== ABOUT PAGE FUNCTIONS ====================

// Initialize map tooltips
function initMapTooltips() {
    const mapPins = document.querySelectorAll('.map-pin');
    
    mapPins.forEach(pin => {
        pin.addEventListener('mouseenter', () => {
            const tooltip = pin.querySelector('.map-tooltip');
            if (tooltip) {
                tooltip.style.opacity = '1';
            }
        });
        
        pin.addEventListener('mouseleave', () => {
            const tooltip = pin.querySelector('.map-tooltip');
            if (tooltip) {
                tooltip.style.opacity = '0';
            }
        });
    });
}

// Animate stats counters
function animateStats() {
    const stats = document.querySelectorAll('.stat-number-banner, .story-stat .number, .presence-stat .number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.innerText);
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.innerText = target + (stat.innerText.includes('+') ? '+' : '');
                clearInterval(timer);
            } else {
                stat.innerText = Math.floor(current) + (stat.innerText.includes('+') ? '+' : '');
            }
        }, 20);
    });
}

// Team member hover effects
function initTeamHover() {
    const teamCards = document.querySelectorAll('.leader-card');
    
    teamCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const socialOverlay = card.querySelector('.social-overlay');
            if (socialOverlay) {
                socialOverlay.style.bottom = '0';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const socialOverlay = card.querySelector('.social-overlay');
            if (socialOverlay) {
                socialOverlay.style.bottom = '-50px';
            }
        });
    });
}

// Initialize About page
document.addEventListener('DOMContentLoaded', function() {
    initMapTooltips();
    initTeamHover();
    
    // Animate stats when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.stats-banner');
    if (statsSection) {
        observer.observe(statsSection);
    }
});

// ==================== SERVICES PAGE FUNCTIONS ====================

// Filter Functions
let currentMainFilter = 'all';
let currentSubFilter = 'all';

function filterServices() {
    const cards = document.querySelectorAll('.service-card');
    let visibleCount = 0;
    
    cards.forEach(card => {
        const category = card.dataset.category;
        const subcategory = card.dataset.subcategory;
        
        let showByMain = currentMainFilter === 'all' || category === currentMainFilter;
        let showBySub = currentSubFilter === 'all' || subcategory === currentSubFilter;
        
        if (showByMain && showBySub) {
            card.style.display = 'flex';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Update stats
    const visibleCountEl = document.getElementById('visibleCount');
    const totalCountEl = document.getElementById('totalCount');
    if (visibleCountEl) visibleCountEl.textContent = visibleCount;
    if (totalCountEl) totalCountEl.textContent = cards.length;
    
    // Show no results message if needed
    const grid = document.getElementById('servicesGrid');
    if (!grid) return;
    
    const existingNoResults = document.querySelector('.no-results');
    
    if (visibleCount === 0) {
        if (!existingNoResults) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.innerHTML = '<i class="fas fa-search"></i><p>No services match your filter criteria</p>';
            grid.appendChild(noResults);
        }
    } else {
        if (existingNoResults) {
            existingNoResults.remove();
        }
    }
}

function filterByMainCategory(category) {
    currentMainFilter = category;
    
    // Update active state on main tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
        if (tab.dataset.filter === category) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    filterServices();
}

function filterBySubCategory(subcategory) {
    currentSubFilter = subcategory;
    
    // Update active state on sub tabs
    document.querySelectorAll('.filter-subtab').forEach(tab => {
        if (tab.dataset.subfilter === subcategory) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    filterServices();
}

function clearFilters() {
    currentMainFilter = 'all';
    currentSubFilter = 'all';
    
    // Reset all tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
        if (tab.dataset.filter === 'all') {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    document.querySelectorAll('.filter-subtab').forEach(tab => {
        if (tab.dataset.subfilter === 'all') {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    filterServices();
}

// Make filter functions global
window.filterByMainCategory = filterByMainCategory;
window.filterBySubCategory = filterBySubCategory;
window.clearFilters = clearFilters;

// ==================== INDUSTRIES PAGE FUNCTIONS ====================

// Filter Function for Industries
function filterIndustries(category) {
    const cards = document.querySelectorAll('.industry-card');
    let visibleCount = 0;
    
    cards.forEach(card => {
        const cardCategories = card.dataset.category.split(' ');
        const show = category === 'all' || cardCategories.includes(category);
        card.style.display = show ? 'block' : 'none';
        if (show) visibleCount++;
    });
    
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.filter === category);
    });
    
    // Update stats
    const visibleCountEl = document.getElementById('visibleCount');
    const totalCountEl = document.getElementById('totalCount');
    if (visibleCountEl) visibleCountEl.textContent = visibleCount;
    if (totalCountEl) totalCountEl.textContent = cards.length;
}

// Make filter function global
window.filterIndustries = filterIndustries;

// Initialize stats on page load
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.industries-grid')) {
        const total = document.querySelectorAll('.industry-card').length;
        const visibleCountEl = document.getElementById('visibleCount');
        const totalCountEl = document.getElementById('totalCount');
        if (visibleCountEl) visibleCountEl.textContent = total;
        if (totalCountEl) totalCountEl.textContent = total;
    }
});

// ==================== OUTSOURCING PORTAL FUNCTIONS ====================

// Filter Services
function filterServices(category) {
    const cards = document.querySelectorAll('.service-card');
    let visibleCount = 0;
    
    cards.forEach(card => {
        const cardCategory = card.dataset.category;
        
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
            visibleCount++;
            
            // Add animation class
            card.style.animation = 'none';
            card.offsetHeight;
            card.style.animation = 'fadeInUp 0.5s ease';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.filter === category);
    });
    
    // Update stats
    const visibleCountEl = document.getElementById('visibleCount');
    const totalCountEl = document.getElementById('totalCount');
    if (visibleCountEl) visibleCountEl.textContent = visibleCount;
    if (totalCountEl) totalCountEl.textContent = cards.length;
    
    // Show no results message if needed
    const grid = document.getElementById('servicesGrid');
    if (!grid) return;
    
    const existingNoResults = document.querySelector('.no-results');
    
    if (visibleCount === 0) {
        if (!existingNoResults) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.innerHTML = '<i class="fas fa-search"></i><p>No services match your filter criteria</p>';
            grid.appendChild(noResults);
        }
    } else {
        if (existingNoResults) {
            existingNoResults.remove();
        }
    }
}

// Open Request Modal
function openRequestModal(serviceName) {
    const selectedService = document.getElementById('selectedService');
    const modalServiceName = document.getElementById('modalServiceName');
    const requestModal = document.getElementById('requestModal');
    
    if (selectedService) selectedService.value = serviceName;
    if (modalServiceName) modalServiceName.textContent = `Request pricing for ${serviceName}`;
    if (requestModal) requestModal.classList.add('active');
}

// Close Modal
function closeModal(type) {
    const modal = document.getElementById(type + 'Modal');
    if (modal) modal.classList.remove('active');
}

// Handle Request Form Submit
function handleRequestSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('requestName')?.value;
    const email = document.getElementById('requestEmail')?.value;
    const phone = document.getElementById('requestPhone')?.value;
    const company = document.getElementById('requestCompany')?.value;
    const service = document.getElementById('selectedService')?.value;
    const message = document.getElementById('requestMessage')?.value;
    
    // Simple validation
    if (!name || !email || !phone) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    // Show success message
    showToast(`Thank you ${name}! We'll contact you shortly with pricing for ${service}.`, 'success');
    
    // Reset form and close modal
    const requestForm = document.getElementById('requestForm');
    if (requestForm) requestForm.reset();
    closeModal('request');
    
    // Here you would typically send data to a server
    console.log('Request submitted:', { name, email, phone, company, service, message });
}

// Initialize stats on page load
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.services-grid')) {
        const totalCards = document.querySelectorAll('.service-card').length;
        const visibleCountEl = document.getElementById('visibleCount');
        const totalCountEl = document.getElementById('totalCount');
        if (visibleCountEl) visibleCountEl.textContent = totalCards;
        if (totalCountEl) totalCountEl.textContent = totalCards;
    }
});

// Make functions global
window.filterServices = filterServices;
window.openRequestModal = openRequestModal;
window.closeModal = closeModal;
window.handleRequestSubmit = handleRequestSubmit;

// ==================== AOS INITIALIZATION ====================
AOS.init({ duration: 800, once: true });

// ==================== SEARCH FUNCTIONALITY ====================
function toggleSearch() {
    const searchDropdown = document.getElementById('searchDropdown');
    if (searchDropdown) {
        searchDropdown.classList.toggle('active');
    }
}



document.getElementById('searchInput')?.addEventListener('input', function(e) {
    const query = e.target.value.toLowerCase();
    const results = searchData.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.category.toLowerCase().includes(query)
    );
    
    const resultsHtml = results.map(result => `
        <a href="${result.path}" class="search-result-item">
            <div class="search-result-title">${result.title}</div>
            <div class="search-result-category">${result.category}</div>
        </a>
    `).join('');
    
    document.getElementById('searchResults').innerHTML = resultsHtml || '<div style="padding: 1rem; text-align: center;">No results found</div>';
});

// Close search dropdown when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.search-wrapper')) {
        document.getElementById('searchDropdown')?.classList.remove('active');
    }
});

// ==================== MOBILE MENU ====================
function toggleMobileMenu() {
    document.getElementById('navMenu').classList.toggle('active');
}

// ==================== MOVE TO TOP ====================
window.addEventListener('scroll', function() {
    const btn = document.getElementById('moveToTop');
    if (btn) {
        if (window.scrollY > 300) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    }
});

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==================== SERVICE FILTERING ====================
function filterServices(category) {
    const cards = document.querySelectorAll('.service-card');
    let visibleCount = 0;
    
    cards.forEach(card => {
        const cardCategory = card.dataset.category;
        
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
            visibleCount++;
            
            // Add animation class
            card.style.animation = 'none';
            card.offsetHeight;
            card.style.animation = 'fadeInUp 0.5s ease';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.filter === category);
    });
    
    // Update stats
    const visibleCountEl = document.getElementById('visibleCount');
    const totalCountEl = document.getElementById('totalCount');
    if (visibleCountEl) visibleCountEl.textContent = visibleCount;
    if (totalCountEl) totalCountEl.textContent = cards.length;
    
    // Show no results message if needed
    const grid = document.getElementById('servicesGrid');
    if (!grid) return;
    
    const existingNoResults = document.querySelector('.no-results');
    
    if (visibleCount === 0) {
        if (!existingNoResults) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.innerHTML = '<i class="fas fa-search"></i><p>No services match your filter criteria</p>';
            grid.appendChild(noResults);
        }
    } else {
        if (existingNoResults) {
            existingNoResults.remove();
        }
    }
}

// ==================== MODAL FUNCTIONS ====================
function openRequestModal(serviceName) {
    const selectedService = document.getElementById('selectedService');
    const modalServiceName = document.getElementById('modalServiceName');
    const requestModal = document.getElementById('requestModal');
    
    if (selectedService) selectedService.value = serviceName;
    if (modalServiceName) modalServiceName.textContent = `Request pricing for ${serviceName}`;
    if (requestModal) requestModal.classList.add('active');
}

function closeModal(type) {
    const modal = document.getElementById(type + 'Modal');
    if (modal) modal.classList.remove('active');
}

// Close modal when clicking outside
window.onclick = function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
}

// ==================== FORM SUBMISSION ====================
function handleRequestSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('requestName')?.value;
    const email = document.getElementById('requestEmail')?.value;
    const phone = document.getElementById('requestPhone')?.value;
    const company = document.getElementById('requestCompany')?.value;
    const service = document.getElementById('selectedService')?.value;
    const message = document.getElementById('requestMessage')?.value;
    
    // Simple validation
    if (!name || !email || !phone) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    // Show success message
    showToast(`Thank you ${name}! We'll contact you shortly with pricing for ${service}.`, 'success');
    
    // Reset form and close modal
    const requestForm = document.getElementById('requestForm');
    if (requestForm) requestForm.reset();
    closeModal('request');
    
    // Here you would typically send data to a server
    console.log('Request submitted:', { name, email, phone, company, service, message });
}

// ==================== TOAST NOTIFICATION ====================
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.style.borderLeftColor = type === 'error' ? '#ef4444' : '#c6a15b';
    toast.style.display = 'block';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// ==================== INITIALIZE STATS ====================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize filter stats
    if (document.querySelector('.services-grid')) {
        const totalCards = document.querySelectorAll('.service-card').length;
        const visibleCountEl = document.getElementById('visibleCount');
        const totalCountEl = document.getElementById('totalCount');
        if (visibleCountEl) visibleCountEl.textContent = totalCards;
        if (totalCountEl) totalCountEl.textContent = totalCards;
    }
});

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ==================== MAKE FUNCTIONS GLOBAL ====================
window.toggleSearch = toggleSearch;
window.toggleMobileMenu = toggleMobileMenu;
window.scrollToTop = scrollToTop;
window.filterServices = filterServices;
window.openRequestModal = openRequestModal;
window.closeModal = closeModal;
window.handleRequestSubmit = handleRequestSubmit;

// ==================== CAREERS PAGE FUNCTIONS ====================

// Newsletter Subscription
function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const email = e.target.querySelector('input[type="email"]').value;
    
    // Simple validation
    if (!email || !email.includes('@')) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    // Show success message
    showToast(`Thank you for subscribing! We'll notify you when new positions open.`, 'success');
    
    // Reset form
    e.target.reset();
    
    // Here you would typically send the email to your newsletter service
    console.log('Newsletter subscription:', email);
}

// Make function global
window.handleNewsletterSubmit = handleNewsletterSubmit;

// ==================== CONTACT PAGE FUNCTIONS ====================



// Initialize Firebase (only if not already initialized)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}


// Auth State Observer
auth.onAuthStateChanged((user) => {
    const authButtons = document.getElementById('authButtons');
    const userInfo = document.getElementById('userInfo');
    const userEmail = document.getElementById('userEmail');
    
    if (user) {
        if (authButtons) authButtons.style.display = 'none';
        if (userInfo) {
            userInfo.style.display = 'flex';
            if (userEmail) userEmail.textContent = user.email;
        }
    } else {
        if (authButtons) authButtons.style.display = 'flex';
        if (userInfo) userInfo.style.display = 'none';
    }
});

// Modal Functions
function openModal(type) {
    const modal = document.getElementById(type + 'Modal');
    if (modal) modal.style.display = 'flex';
}

function closeModal(type) {
    const modal = document.getElementById(type + 'Modal');
    if (modal) modal.style.display = 'none';
}

// Login Handler
async function handleLogin(e) {
    e.preventDefault();
    showToast('Login functionality will be integrated');
    closeModal('login');
}

// Signup Handler
async function handleSignup(e) {
    e.preventDefault();
    showToast('Signup functionality will be integrated');
    closeModal('signup');
}

// Logout Handler
async function handleLogout() {
    try {
        await auth.signOut();
        showToast('Logged out successfully');
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// Form Submission with Formspree
document.getElementById('contactForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = document.getElementById('submitBtn');
    const buttonText = document.getElementById('buttonText');
    const buttonIcon = document.getElementById('buttonIcon');
    const formStatus = document.getElementById('formStatus');
    
    if (!submitBtn || !buttonText || !buttonIcon || !formStatus) return;
    
    // Disable button and show loading
    submitBtn.disabled = true;
    buttonText.textContent = 'Sending...';
    buttonIcon.className = 'fas fa-spinner fa-spin';
    
    try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            // Show success message
            formStatus.innerHTML = `
                <div class="success-message">
                    <i class="fas fa-check-circle"></i>
                    <div>
                        <strong>Thank you for reaching out!</strong><br>
                        We've received your message and will get back to you within 24 hours.
                    </div>
                </div>
            `;
            form.reset();
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        // Show error message
        formStatus.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <div>
                    <strong>Something went wrong!</strong><br>
                    Please try again or contact us directly via phone.
                </div>
            </div>
        `;
    } finally {
        // Re-enable button
        submitBtn.disabled = false;
        buttonText.textContent = 'Send Message';
        buttonIcon.className = 'fas fa-paper-plane';
        
        // Scroll to status message
        formStatus.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});

// Make functions global
window.openModal = openModal;
window.closeModal = closeModal;
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.handleLogout = handleLogout;

// ==================== FAQ ACCORDION FUNCTIONS ====================

// Toggle FAQ Category (expand/collapse all items in a category)
function toggleCategory(header) {
    const category = header.closest('.faq-category');
    const content = category.querySelector('.category-content');
    const icon = header.querySelector('i');
    
    // Close other open categories
    document.querySelectorAll('.faq-category').forEach(cat => {
        if (cat !== category) {
            const otherContent = cat.querySelector('.category-content');
            const otherIcon = cat.querySelector('.category-header i');
            if (otherContent.classList.contains('show')) {
                otherContent.classList.remove('show');
                otherIcon.classList.remove('active');
            }
            
            // Also close all FAQ items in other categories
            const otherFaqAnswers = cat.querySelectorAll('.faq-answer');
            const otherFaqQuestions = cat.querySelectorAll('.faq-question i');
            otherFaqAnswers.forEach(ans => ans.classList.remove('show'));
            otherFaqQuestions.forEach(icon => icon.classList.remove('active'));
        }
    });
    
    // Toggle current category
    content.classList.toggle('show');
    icon.classList.toggle('active');
}

// Toggle individual FAQ item
function toggleFaq(question) {
    const answer = question.nextElementSibling;
    const icon = question.querySelector('i');
    
    // Close other open FAQ items in the same category
    const category = question.closest('.faq-category');
    const otherQuestions = category.querySelectorAll('.faq-question');
    otherQuestions.forEach(q => {
        if (q !== question) {
            const otherAnswer = q.nextElementSibling;
            const otherIcon = q.querySelector('i');
            if (otherAnswer.classList.contains('show')) {
                otherAnswer.classList.remove('show');
                otherIcon.classList.remove('active');
            }
        }
    });
    
    // Toggle current FAQ item
    answer.classList.toggle('show');
    icon.classList.toggle('active');
}

// Mark helpful
function markHelpful(element) {
    element.classList.toggle('fas');
    element.classList.toggle('far');
    element.style.color = '#c6a15b';
    
    // Optional: Show a toast message
    showToast('Thank you for your feedback!', 'success');
}

function markNotHelpful(element) {
    element.classList.toggle('fas');
    element.classList.toggle('far');
    element.style.color = '#c6a15b';
    
    // Optional: Show a toast message
    showToast('Thank you for your feedback!', 'success');
}

// Scroll to category
function scrollToCategory(categoryId) {
    const element = document.getElementById(categoryId);
    if (element) {
        const offset = 100; // Adjust for sticky header
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
        
        // Open the category
        const category = element.closest('.faq-category');
        const content = category.querySelector('.category-content');
        const icon = category.querySelector('.category-header i');
        
        // Close other categories
        document.querySelectorAll('.faq-category').forEach(cat => {
            if (cat !== category) {
                const otherContent = cat.querySelector('.category-content');
                const otherIcon = cat.querySelector('.category-header i');
                otherContent.classList.remove('show');
                otherIcon.classList.remove('active');
            }
        });
        
        // Open selected category
        content.classList.add('show');
        icon.classList.add('active');
    }
    
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
}

// Search functionality for FAQs
function searchFAQs() {
    const searchInput = document.getElementById('faqSearch');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    const faqItems = document.querySelectorAll('.faq-item');
    let visibleCount = 0;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question span').textContent.toLowerCase();
        const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
        
        if (question.includes(searchTerm) || answer.includes(searchTerm)) {
            item.style.display = 'block';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });
    
    // Show/hide categories based on visible items
    document.querySelectorAll('.faq-category').forEach(category => {
        const visibleItems = category.querySelectorAll('.faq-item[style="display: block;"]').length;
        if (visibleItems === 0) {
            category.style.display = 'none';
        } else {
            category.style.display = 'block';
        }
    });
    
    // Show no results message
    const noResults = document.getElementById('noResults');
    if (visibleCount === 0) {
        if (!noResults) {
            const noResultsDiv = document.createElement('div');
            noResultsDiv.id = 'noResults';
            noResultsDiv.className = 'no-results';
            noResultsDiv.innerHTML = '<i class="fas fa-search"></i><p>No FAQs match your search criteria</p>';
            document.querySelector('.faq-accordion-section .container').appendChild(noResultsDiv);
        }
    } else {
        if (noResults) {
            noResults.remove();
        }
    }
}

// Make functions global
window.toggleCategory = toggleCategory;
window.toggleFaq = toggleFaq;
window.markHelpful = markHelpful;
window.markNotHelpful = markNotHelpful;
window.scrollToCategory = scrollToCategory;
window.searchFAQs = searchFAQs;

// ==================== 404 PAGE FUNCTIONS ====================

// Handle search from 404 page
function handleErrorSearch(e) {
    e.preventDefault();
    
    const searchInput = document.getElementById('errorSearchInput');
    const query = searchInput.value.trim();
    
    if (query) {
        // Redirect to search results page or perform search
        showToast(`Searching for "${query}"...`, 'info');
        
        // You can redirect to a search results page
        // window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        
        // For demo purposes, just clear the input
        setTimeout(() => {
            searchInput.value = '';
        }, 2000);
    } else {
        showToast('Please enter a search term', 'error');
    }
}

// Countdown timer (optional feature)
function startCountdown(seconds) {
    const countdownEl = document.getElementById('countdown');
    if (!countdownEl) return;
    
    let remaining = seconds;
    
    const interval = setInterval(() => {
        countdownEl.textContent = remaining;
        remaining--;
        
        if (remaining < 0) {
            clearInterval(interval);
            window.location.href = 'index.html';
        }
    }, 1000);
}

// Random 404 messages
const errorMessages = [
    "Looks like you've ventured into uncharted territory.",
    "The page you're looking for is on a coffee break.",
    "This page has been moved, deleted, or never existed.",
    "Houston, we have a problem - page not found.",
    "Even our best consultants couldn't find this page.",
    "This page is taking a well-deserved vacation.",
    "The link you followed might be broken.",
    "We couldn't find what you were looking for."
];

function getRandomMessage() {
    const messageEl = document.getElementById('errorMessage');
    if (messageEl) {
        const randomIndex = Math.floor(Math.random() * errorMessages.length);
        messageEl.textContent = errorMessages[randomIndex];
    }
}

// Initialize 404 page
document.addEventListener('DOMContentLoaded', function() {
    // Show random message
    getRandomMessage();
    
    // Optional: start countdown (commented out by default)
    // startCountdown(10);
});

// Make functions global
window.handleErrorSearch = handleErrorSearch;

// ==================== DISCLAIMER PAGE FUNCTIONS ====================

// Switch between disclaimer tabs
function switchDisclaimerTab(tabId) {
    // Hide all sections
    document.querySelectorAll('.disclaimer-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const selectedSection = document.getElementById(tabId);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }
    
    // Update active tab
    document.querySelectorAll('.disclaimer-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('onclick')?.includes(tabId)) {
            tab.classList.add('active');
        }
    });
    
    // Scroll to section
    const element = document.getElementById('disclaimerContent');
    if (element) {
        const offset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Print disclaimer
function printDisclaimer() {
    window.print();
}

// Update reading progress
function updateProgress() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        progressFill.style.width = scrolled + '%';
    }
}

// Initialize disclaimer page
document.addEventListener('DOMContentLoaded', function() {
    // Set current date for last updated
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const currentDate = new Date().toLocaleDateString('en-US', options);
        dateElement.textContent = currentDate;
    }
    
    // Add scroll event listener for progress bar
    window.addEventListener('scroll', updateProgress);
});

// Make functions global
window.switchDisclaimerTab = switchDisclaimerTab;
window.printDisclaimer = printDisclaimer;

// ==================== TERMS OF SERVICE PAGE FUNCTIONS ====================

// Print terms
function printTerms() {
    window.print();
}

// Update reading progress
function updateTermsProgress() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    const progressFill = document.getElementById('termsProgressFill');
    if (progressFill) {
        progressFill.style.width = scrolled + '%';
    }
}

// Show/hide back to top button
function toggleBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }
}

// Scroll to section
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Accept terms
function acceptTerms() {
    // Store acceptance in localStorage
    localStorage.setItem('termsAccepted', 'true');
    localStorage.setItem('termsAcceptedDate', new Date().toISOString());
    
    // Show success message
    showToast('Thank you for accepting our Terms of Service', 'success');
    
    // Redirect or update UI
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// Decline terms
function declineTerms() {
    showToast('You must accept the Terms of Service to continue', 'error');
}

// Check if terms were accepted
function checkTermsAccepted() {
    const accepted = localStorage.getItem('termsAccepted');
    const acceptedDate = localStorage.getItem('termsAcceptedDate');
    
    if (accepted && acceptedDate) {
        const date = new Date(acceptedDate);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        
        // You can show a message or update UI
        console.log(`Terms accepted on ${formattedDate}`);
    }
}

// Initialize terms page
document.addEventListener('DOMContentLoaded', function() {
    // Set current date for last updated
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const currentDate = new Date().toLocaleDateString('en-US', options);
        dateElement.textContent = currentDate;
    }
    
    // Add scroll event listeners
    window.addEventListener('scroll', () => {
        updateTermsProgress();
        toggleBackToTop();
    });
    
    // Check if terms were previously accepted
    checkTermsAccepted();
});

// Make functions global
window.printTerms = printTerms;
window.scrollToSection = scrollToSection;
window.acceptTerms = acceptTerms;
window.declineTerms = declineTerms;

// ==================== PRIVACY POLICY PAGE FUNCTIONS ====================

// Toggle navigation menu
function togglePrivacyNav() {
    const header = document.querySelector('.privacy-nav-header');
    const content = document.querySelector('.privacy-nav-content');
    
    if (header && content) {
        header.classList.toggle('active');
        content.classList.toggle('show');
    }
}

// Print privacy policy
function printPrivacyPolicy() {
    window.print();
}

// Update reading progress
function updatePrivacyProgress() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    const progressFill = document.getElementById('privacyProgressFill');
    if (progressFill) {
        progressFill.style.width = scrolled + '%';
    }
}

// Show/hide back to top button
function toggleBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }
}

// Scroll to section
function scrollToPrivacySection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Cookie consent functions
function acceptCookies() {
    localStorage.setItem('cookiesAccepted', 'true');
    localStorage.setItem('cookiesAcceptedDate', new Date().toISOString());
    document.getElementById('consentBanner').classList.remove('show');
    showToast('Thank you for accepting cookies!', 'success');
}

function declineCookies() {
    localStorage.setItem('cookiesAccepted', 'false');
    localStorage.setItem('cookiesAcceptedDate', new Date().toISOString());
    document.getElementById('consentBanner').classList.remove('show');
    showToast('You have declined cookies. Some features may be limited.', 'info');
}

function openCookieSettings() {
    // Scroll to cookie settings section
    const cookieSection = document.getElementById('section-6');
    if (cookieSection) {
        const offset = 100;
        const elementPosition = cookieSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
    document.getElementById('consentBanner').classList.remove('show');
}

// Save cookie preferences
function saveCookiePreferences() {
    const necessaryChecked = document.getElementById('necessaryCookies').checked;
    const analyticsChecked = document.getElementById('analyticsCookies').checked;
    const marketingChecked = document.getElementById('marketingCookies').checked;
    
    const preferences = {
        necessary: necessaryChecked,
        analytics: analyticsChecked,
        marketing: marketingChecked,
        savedDate: new Date().toISOString()
    };
    
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    showToast('Cookie preferences saved successfully!', 'success');
}

// Check if cookies were previously accepted
function checkCookieConsent() {
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    const consentBanner = document.getElementById('consentBanner');
    
    if (!cookiesAccepted && consentBanner) {
        // Show banner after a short delay
        setTimeout(() => {
            consentBanner.classList.add('show');
        }, 1000);
    }
}

// Data subject request
function submitDataRequest(type) {
    const modal = document.getElementById('dataRequestModal');
    const requestType = document.getElementById('requestType');
    
    if (requestType) {
        requestType.value = type;
    }
    
    if (modal) {
        modal.classList.add('active');
    }
}

// Handle data request form submission
function handleDataRequest(e) {
    e.preventDefault();
    
    const name = document.getElementById('requestName').value;
    const email = document.getElementById('requestEmail').value;
    const type = document.getElementById('requestType').value;
    const details = document.getElementById('requestDetails').value;
    
    // Here you would typically send this to your server
    console.log('Data Request:', { name, email, type, details });
    
    showToast(`Your ${type} request has been submitted. We will process it within 30 days.`, 'success');
    
    document.getElementById('dataRequestModal').classList.remove('active');
    e.target.reset();
}

// Initialize privacy page
document.addEventListener('DOMContentLoaded', function() {
    // Set current date for last updated
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const currentDate = new Date().toLocaleDateString('en-US', options);
        dateElement.textContent = currentDate;
    }
    
    // Add scroll event listeners
    window.addEventListener('scroll', () => {
        updatePrivacyProgress();
        toggleBackToTop();
    });
    
    // Check cookie consent
    checkCookieConsent();
    
    // Load saved cookie preferences
    const savedPrefs = localStorage.getItem('cookiePreferences');
    if (savedPrefs) {
        const prefs = JSON.parse(savedPrefs);
        document.getElementById('necessaryCookies').checked = prefs.necessary;
        document.getElementById('analyticsCookies').checked = prefs.analytics;
        document.getElementById('marketingCookies').checked = prefs.marketing;
    }
});

// Make functions global
window.togglePrivacyNav = togglePrivacyNav;
window.printPrivacyPolicy = printPrivacyPolicy;
window.scrollToPrivacySection = scrollToPrivacySection;
window.acceptCookies = acceptCookies;
window.declineCookies = declineCookies;
window.openCookieSettings = openCookieSettings;
window.saveCookiePreferences = saveCookiePreferences;
window.submitDataRequest = submitDataRequest;
window.handleDataRequest = handleDataRequest;

// ==================== ACCOUNTING SERVICES PAGE FUNCTIONS ====================

// FAQ Accordion Function
function toggleFaq(header) {
    const content = header.nextElementSibling;
    const icon = header.querySelector('i');
    
    // Close other open FAQs
    document.querySelectorAll('.faq-accordion-header').forEach(h => {
        if (h !== header) {
            h.classList.remove('active');
            h.nextElementSibling.classList.remove('show');
        }
    });
    
    // Toggle current FAQ
    header.classList.toggle('active');
    content.classList.toggle('show');
}

// Email Functions
function emailForPricing(serviceName) {
    const subject = encodeURIComponent(`Pricing Inquiry - ${serviceName} - NEXA Advisory`);
    const body = encodeURIComponent(
        `Dear NEXA Team,\n\n` +
        `I am interested in your ${serviceName}. Please provide me with detailed information about your services and pricing.\n\n` +
        `Thank you.\n\n` +
        `[Your Name]\n` +
        `[Your Company]\n` +
        `[Your Phone Number]`
    );
    
    window.location.href = `mailto:info@nexaadvisory.com.np?subject=${subject}&body=${body}`;
}

function emailForConsultation() {
    const subject = encodeURIComponent('Consultation Request - Accounting Services - NEXA Advisory');
    const body = encodeURIComponent(
        `Dear NEXA Team,\n\n` +
        `I would like to schedule a consultation to discuss your accounting services for my business. Please let me know your availability.\n\n` +
        `Thank you.\n\n` +
        `[Your Name]\n` +
        `[Your Company]\n` +
        `[Your Phone Number]`
    );
    
    window.location.href = `mailto:info@nexaadvisory.com.np?subject=${subject}&body=${body}`;
}

// Newsletter Subscription
function handleNewsletterSubmit(event) {
    event.preventDefault();
    
    const emailInput = event.target.querySelector('input[type="email"]');
    const email = emailInput.value;
    
    if (!email || !email.includes('@')) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    // Show success message
    showToast(`Thank you for subscribing to our newsletter!`, 'success');
    
    // Reset form
    emailInput.value = '';
}

// Animate stats when they come into view
function animateStats() {
    const stats = document.querySelectorAll('.service-stat .number');
    
    stats.forEach(stat => {
        const targetText = stat.innerText;
        const targetNumber = parseInt(targetText.replace(/[^0-9]/g, ''));
        const suffix = targetText.includes('+') ? '+' : '';
        
        if (isNaN(targetNumber)) return;
        
        let current = 0;
        const increment = targetNumber / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetNumber) {
                stat.innerText = targetNumber + suffix;
                clearInterval(timer);
            } else {
                stat.innerText = Math.floor(current) + suffix;
            }
        }, 20);
    });
}

// Initialize stats observer
document.addEventListener('DOMContentLoaded', function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.service-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
});

// Make functions global
window.toggleFaq = toggleFaq;
window.emailForPricing = emailForPricing;
window.emailForConsultation = emailForConsultation;
window.handleNewsletterSubmit = handleNewsletterSubmit;


// ==================== CORPORATE ADVISORY PAGE FUNCTIONS ====================

// FAQ Accordion Function
function toggleFaq(header) {
    const content = header.nextElementSibling;
    const icon = header.querySelector('i');
    
    // Close other open FAQs
    document.querySelectorAll('.faq-accordion-header').forEach(h => {
        if (h !== header) {
            h.classList.remove('active');
            h.nextElementSibling.classList.remove('show');
        }
    });
    
    // Toggle current FAQ
    header.classList.toggle('active');
    content.classList.toggle('show');
}

// Email Functions
function emailForPricing(serviceName) {
    const subject = encodeURIComponent(`Pricing Inquiry - ${serviceName} - NEXA Advisory`);
    const body = encodeURIComponent(
        `Dear NEXA Team,\n\n` +
        `I am interested in your ${serviceName}. Please provide me with detailed information about your services and pricing.\n\n` +
        `Thank you.\n\n` +
        `[Your Name]\n` +
        `[Your Company]\n` +
        `[Your Phone Number]`
    );
    
    window.location.href = `mailto:info@nexaadvisory.com.np?subject=${subject}&body=${body}`;
}

function emailForConsultation() {
    const subject = encodeURIComponent('Consultation Request - Corporate Advisory - NEXA Advisory');
    const body = encodeURIComponent(
        `Dear NEXA Team,\n\n` +
        `I would like to schedule a consultation to discuss your corporate advisory services for my business. Please let me know your availability.\n\n` +
        `Thank you.\n\n` +
        `[Your Name]\n` +
        `[Your Company]\n` +
        `[Your Phone Number]`
    );
    
    window.location.href = `mailto:info@nexaadvisory.com.np?subject=${subject}&body=${body}`;
}

// Newsletter Subscription
function handleNewsletterSubmit(event) {
    event.preventDefault();
    
    const emailInput = event.target.querySelector('input[type="email"]');
    const email = emailInput.value;
    
    if (!email || !email.includes('@')) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    // Show success message
    showToast(`Thank you for subscribing to our newsletter!`, 'success');
    
    // Reset form
    emailInput.value = '';
}

// Animate stats when they come into view
function animateStats() {
    const stats = document.querySelectorAll('.service-stat .number');
    
    stats.forEach(stat => {
        const targetText = stat.innerText;
        const targetNumber = parseInt(targetText.replace(/[^0-9]/g, ''));
        const suffix = targetText.includes('+') ? '+' : '';
        
        if (isNaN(targetNumber)) return;
        
        let current = 0;
        const increment = targetNumber / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetNumber) {
                stat.innerText = targetNumber + suffix;
                clearInterval(timer);
            } else {
                stat.innerText = Math.floor(current) + suffix;
            }
        }, 20);
    });
}

// Initialize stats observer
document.addEventListener('DOMContentLoaded', function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.service-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
});

// Make functions global
window.toggleFaq = toggleFaq;
window.emailForPricing = emailForPricing;
window.emailForConsultation = emailForConsultation;
window.handleNewsletterSubmit = handleNewsletterSubmit;

// ==================== MANAGEMENT CONSULTING PAGE FUNCTIONS ====================

// FAQ Accordion Function
function toggleFaq(header) {
    const content = header.nextElementSibling;
    const icon = header.querySelector('i');
    
    // Close other open FAQs
    document.querySelectorAll('.faq-accordion-header').forEach(h => {
        if (h !== header) {
            h.classList.remove('active');
            h.nextElementSibling.classList.remove('show');
        }
    });
    
    // Toggle current FAQ
    header.classList.toggle('active');
    content.classList.toggle('show');
}

// Email Functions
function emailForPricing(serviceName) {
    const subject = encodeURIComponent(`Pricing Inquiry - ${serviceName} - NEXA Advisory`);
    const body = encodeURIComponent(
        `Dear NEXA Team,\n\n` +
        `I am interested in your ${serviceName}. Please provide me with detailed information about your services and pricing.\n\n` +
        `Thank you.\n\n` +
        `[Your Name]\n` +
        `[Your Company]\n` +
        `[Your Phone Number]`
    );
    
    window.location.href = `mailto:info@nexaadvisory.com.np?subject=${subject}&body=${body}`;
}

function emailForConsultation() {
    const subject = encodeURIComponent('Consultation Request - Management Consulting - NEXA Advisory');
    const body = encodeURIComponent(
        `Dear NEXA Team,\n\n` +
        `I would like to schedule a consultation to discuss your management consulting services for my business. Please let me know your availability.\n\n` +
        `Thank you.\n\n` +
        `[Your Name]\n` +
        `[Your Company]\n` +
        `[Your Phone Number]`
    );
    
    window.location.href = `mailto:info@nexaadvisory.com.np?subject=${subject}&body=${body}`;
}

// Newsletter Subscription
function handleNewsletterSubmit(event) {
    event.preventDefault();
    
    const emailInput = event.target.querySelector('input[type="email"]');
    const email = emailInput.value;
    
    if (!email || !email.includes('@')) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    // Show success message
    showToast(`Thank you for subscribing to our newsletter!`, 'success');
    
    // Reset form
    emailInput.value = '';
}

// Animate stats when they come into view
function animateStats() {
    const stats = document.querySelectorAll('.service-stat .number, .pillar-stat .number');
    
    stats.forEach(stat => {
        const targetText = stat.innerText;
        const targetNumber = parseInt(targetText.replace(/[^0-9]/g, ''));
        const suffix = targetText.includes('+') ? '+' : '';
        
        if (isNaN(targetNumber)) return;
        
        let current = 0;
        const increment = targetNumber / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetNumber) {
                stat.innerText = targetNumber + suffix;
                clearInterval(timer);
            } else {
                stat.innerText = Math.floor(current) + suffix;
            }
        }, 20);
    });
}

// Initialize stats observer
document.addEventListener('DOMContentLoaded', function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.service-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
});

// Make functions global
window.toggleFaq = toggleFaq;
window.emailForPricing = emailForPricing;
window.emailForConsultation = emailForConsultation;
window.handleNewsletterSubmit = handleNewsletterSubmit;


// ==================== MONITORING & EVALUATION PAGE FUNCTIONS ====================

// FAQ Accordion Function
function toggleFaq(header) {
    const content = header.nextElementSibling;
    const icon = header.querySelector('i');
    
    // Close other open FAQs
    document.querySelectorAll('.faq-accordion-header').forEach(h => {
        if (h !== header) {
            h.classList.remove('active');
            h.nextElementSibling.classList.remove('show');
        }
    });
    
    // Toggle current FAQ
    header.classList.toggle('active');
    content.classList.toggle('show');
}

// Framework Tabs Function
function switchFramework(tabId) {
    // Hide all framework content
    document.querySelectorAll('.framework-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Show selected framework
    const selectedContent = document.getElementById(tabId);
    if (selectedContent) {
        selectedContent.classList.add('active');
    }
    
    // Update active tab
    document.querySelectorAll('.framework-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('onclick')?.includes(tabId)) {
            tab.classList.add('active');
        }
    });
}

// Email Functions
function emailForPricing(serviceName) {
    const subject = encodeURIComponent(`Pricing Inquiry - ${serviceName} - NEXA Advisory`);
    const body = encodeURIComponent(
        `Dear NEXA Team,\n\n` +
        `I am interested in your ${serviceName}. Please provide me with detailed information about your services and pricing.\n\n` +
        `Thank you.\n\n` +
        `[Your Name]\n` +
        `[Your Company]\n` +
        `[Your Phone Number]`
    );
    
    window.location.href = `mailto:info@nexaadvisory.com.np?subject=${subject}&body=${body}`;
}

function emailForConsultation() {
    const subject = encodeURIComponent('Consultation Request - Monitoring & Evaluation - NEXA Advisory');
    const body = encodeURIComponent(
        `Dear NEXA Team,\n\n` +
        `I would like to schedule a consultation to discuss your monitoring and evaluation services for my organization. Please let me know your availability.\n\n` +
        `Thank you.\n\n` +
        `[Your Name]\n` +
        `[Your Organization]\n` +
        `[Your Phone Number]`
    );
    
    window.location.href = `mailto:info@nexaadvisory.com.np?subject=${subject}&body=${body}`;
}

// Newsletter Subscription
function handleNewsletterSubmit(event) {
    event.preventDefault();
    
    const emailInput = event.target.querySelector('input[type="email"]');
    const email = emailInput.value;
    
    if (!email || !email.includes('@')) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    // Show success message
    showToast(`Thank you for subscribing to our newsletter!`, 'success');
    
    // Reset form
    emailInput.value = '';
}

// Animate stats when they come into view
function animateStats() {
    const stats = document.querySelectorAll('.service-stat .number');
    
    stats.forEach(stat => {
        const targetText = stat.innerText;
        const targetNumber = parseInt(targetText.replace(/[^0-9]/g, ''));
        const suffix = targetText.includes('+') ? '+' : '';
        
        if (isNaN(targetNumber)) return;
        
        let current = 0;
        const increment = targetNumber / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetNumber) {
                stat.innerText = targetNumber + suffix;
                clearInterval(timer);
            } else {
                stat.innerText = Math.floor(current) + suffix;
            }
        }, 20);
    });
}

// Initialize stats observer
document.addEventListener('DOMContentLoaded', function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.service-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
});

// Make functions global
window.toggleFaq = toggleFaq;
window.switchFramework = switchFramework;
window.emailForPricing = emailForPricing;
window.emailForConsultation = emailForConsultation;
window.handleNewsletterSubmit = handleNewsletterSubmit;

// ==================== NFRS/IFRS SERVICES PAGE FUNCTIONS ====================

// FAQ Accordion Function
function toggleFaq(header) {
    const content = header.nextElementSibling;
    const icon = header.querySelector('i');
    
    // Close other open FAQs
    document.querySelectorAll('.faq-accordion-header').forEach(h => {
        if (h !== header) {
            h.classList.remove('active');
            h.nextElementSibling.classList.remove('show');
        }
    });
    
    // Toggle current FAQ
    header.classList.toggle('active');
    content.classList.toggle('show');
}

// Framework Tabs Function
function switchFramework(tabId) {
    // Hide all framework content
    document.querySelectorAll('.framework-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Show selected framework
    const selectedContent = document.getElementById(tabId);
    if (selectedContent) {
        selectedContent.classList.add('active');
    }
    
    // Update active tab
    document.querySelectorAll('.framework-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('onclick')?.includes(tabId)) {
            tab.classList.add('active');
        }
    });
}

// Email Functions
function emailForPricing(serviceName) {
    const subject = encodeURIComponent(`Pricing Inquiry - ${serviceName} - NEXA Advisory`);
    const body = encodeURIComponent(
        `Dear NEXA Team,\n\n` +
        `I am interested in your ${serviceName}. Please provide me with detailed information about your services and pricing.\n\n` +
        `Thank you.\n\n` +
        `[Your Name]\n` +
        `[Your Company]\n` +
        `[Your Phone Number]`
    );
    
    window.location.href = `mailto:info@nexaadvisory.com.np?subject=${subject}&body=${body}`;
}

function emailForConsultation() {
    const subject = encodeURIComponent('Consultation Request - NFRS/IFRS Implementation - NEXA Advisory');
    const body = encodeURIComponent(
        `Dear NEXA Team,\n\n` +
        `I would like to schedule a consultation to discuss your NFRS/IFRS implementation services for my organization. Please let me know your availability.\n\n` +
        `Thank you.\n\n` +
        `[Your Name]\n` +
        `[Your Company]\n` +
        `[Your Phone Number]`
    );
    
    window.location.href = `mailto:info@nexaadvisory.com.np?subject=${subject}&body=${body}`;
}

// Newsletter Subscription
function handleNewsletterSubmit(event) {
    event.preventDefault();
    
    const emailInput = event.target.querySelector('input[type="email"]');
    const email = emailInput.value;
    
    if (!email || !email.includes('@')) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    // Show success message
    showToast(`Thank you for subscribing to our newsletter!`, 'success');
    
    // Reset form
    emailInput.value = '';
}

// Animate stats when they come into view
function animateStats() {
    const stats = document.querySelectorAll('.service-stat .number, .adoption-stat .number');
    
    stats.forEach(stat => {
        const targetText = stat.innerText;
        const targetNumber = parseInt(targetText.replace(/[^0-9]/g, ''));
        const suffix = targetText.includes('+') ? '+' : '';
        
        if (isNaN(targetNumber)) return;
        
        let current = 0;
        const increment = targetNumber / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetNumber) {
                stat.innerText = targetNumber + suffix;
                clearInterval(timer);
            } else {
                stat.innerText = Math.floor(current) + suffix;
            }
        }, 20);
    });
}

// Initialize stats observer
document.addEventListener('DOMContentLoaded', function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.service-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
});

// Make functions global
window.toggleFaq = toggleFaq;
window.switchFramework = switchFramework;
window.emailForPricing = emailForPricing;
window.emailForConsultation = emailForConsultation;
window.handleNewsletterSubmit = handleNewsletterSubmit;


// ==================== TAXATION SERVICES PAGE FUNCTIONS ====================

// FAQ Accordion Function
function toggleFaq(header) {
    const content = header.nextElementSibling;
    const icon = header.querySelector('i');
    
    // Close other open FAQs
    document.querySelectorAll('.faq-accordion-header').forEach(h => {
        if (h !== header) {
            h.classList.remove('active');
            h.nextElementSibling.classList.remove('show');
        }
    });
    
    // Toggle current FAQ
    header.classList.toggle('active');
    content.classList.toggle('show');
}

// Email Functions
function emailForPricing(serviceName) {
    const subject = encodeURIComponent(`Pricing Inquiry - ${serviceName} - NEXA Advisory`);
    const body = encodeURIComponent(
        `Dear NEXA Team,\n\n` +
        `I am interested in your ${serviceName}. Please provide me with detailed information about your services and pricing.\n\n` +
        `Thank you.\n\n` +
        `[Your Name]\n` +
        `[Your Company]\n` +
        `[Your Phone Number]`
    );
    
    window.location.href = `mailto:info@nexaadvisory.com.np?subject=${subject}&body=${body}`;
}

function emailForConsultation() {
    const subject = encodeURIComponent('Consultation Request - Taxation Services - NEXA Advisory');
    const body = encodeURIComponent(
        `Dear NEXA Team,\n\n` +
        `I would like to schedule a consultation to discuss your taxation services for my business. Please let me know your availability.\n\n` +
        `Thank you.\n\n` +
        `[Your Name]\n` +
        `[Your Company]\n` +
        `[Your Phone Number]`
    );
    
    window.location.href = `mailto:info@nexaadvisory.com.np?subject=${subject}&body=${body}`;
}

// Newsletter Subscription
function handleNewsletterSubmit(event) {
    event.preventDefault();
    
    const emailInput = event.target.querySelector('input[type="email"]');
    const email = emailInput.value;
    
    if (!email || !email.includes('@')) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    // Show success message
    showToast(`Thank you for subscribing to our newsletter!`, 'success');
    
    // Reset form
    emailInput.value = '';
}

// Animate stats when they come into view
function animateStats() {
    const stats = document.querySelectorAll('.service-stat .number');
    
    stats.forEach(stat => {
        const targetText = stat.innerText;
        const targetNumber = parseInt(targetText.replace(/[^0-9]/g, ''));
        const suffix = targetText.includes('+') ? '+' : '';
        
        if (isNaN(targetNumber)) return;
        
        let current = 0;
        const increment = targetNumber / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetNumber) {
                stat.innerText = targetNumber + suffix;
                clearInterval(timer);
            } else {
                stat.innerText = Math.floor(current) + suffix;
            }
        }, 20);
    });
}

// Initialize stats observer
document.addEventListener('DOMContentLoaded', function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.service-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
});

// Make functions global
window.toggleFaq = toggleFaq;
window.emailForPricing = emailForPricing;
window.emailForConsultation = emailForConsultation;
window.handleNewsletterSubmit = handleNewsletterSubmit;

// ==================== TRAINING & COURSES PAGE FUNCTIONS ====================

// FAQ Accordion Function
function toggleFaq(header) {
    const content = header.nextElementSibling;
    const icon = header.querySelector('i');
    
    // Close other open FAQs
    document.querySelectorAll('.faq-accordion-header').forEach(h => {
        if (h !== header) {
            h.classList.remove('active');
            h.nextElementSibling.classList.remove('show');
        }
    });
    
    // Toggle current FAQ
    header.classList.toggle('active');
    content.classList.toggle('show');
}

// Course Filter Function
function filterCourses(category) {
    const courses = document.querySelectorAll('.course-card');
    let visibleCount = 0;
    
    courses.forEach(course => {
        const courseCategory = course.dataset.category;
        
        if (category === 'all' || courseCategory === category) {
            course.style.display = 'block';
            visibleCount++;
        } else {
            course.style.display = 'none';
        }
    });
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === category) {
            btn.classList.add('active');
        }
    });
    
    // Show no results message if needed
    const grid = document.querySelector('.courses-grid');
    const existingNoResults = document.querySelector('.no-results');
    
    if (visibleCount === 0) {
        if (!existingNoResults) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.innerHTML = '<i class="fas fa-search"></i><p>No courses match your filter criteria</p>';
            grid.appendChild(noResults);
        }
    } else {
        if (existingNoResults) {
            existingNoResults.remove();
        }
    }
}

// Email Functions
function emailForPricing(courseName) {
    const subject = encodeURIComponent(`Course Inquiry - ${courseName} - NEXA Advisory`);
    const body = encodeURIComponent(
        `Dear NEXA Team,\n\n` +
        `I am interested in your "${courseName}" course. Please provide me with detailed information about the curriculum, schedule, and pricing.\n\n` +
        `Thank you.\n\n` +
        `[Your Name]\n` +
        `[Your Email]\n` +
        `[Your Phone Number]`
    );
    
    window.location.href = `mailto:training@nexaadvisory.com.np?subject=${subject}&body=${body}`;
}

function emailForConsultation() {
    const subject = encodeURIComponent('Training Consultation Request - NEXA Advisory');
    const body = encodeURIComponent(
        `Dear NEXA Team,\n\n` +
        `I would like to schedule a consultation to discuss training options for myself/my organization. Please let me know your availability.\n\n` +
        `Thank you.\n\n` +
        `[Your Name]\n` +
        `[Your Organization]\n` +
        `[Your Phone Number]`
    );
    
    window.location.href = `mailto:training@nexaadvisory.com.np?subject=${subject}&body=${body}`;
}

function emailForBatchRegistration(batchName, courseName) {
    const subject = encodeURIComponent(`Registration Inquiry - ${batchName} - ${courseName}`);
    const body = encodeURIComponent(
        `Dear NEXA Team,\n\n` +
        `I am interested in registering for the ${batchName} batch of ${courseName}. Please let me know if seats are available and the registration process.\n\n` +
        `Thank you.\n\n` +
        `[Your Name]\n` +
        `[Your Email]\n` +
        `[Your Phone Number]`
    );
    
    window.location.href = `mailto:training@nexaadvisory.com.np?subject=${subject}&body=${body}`;
}

// Newsletter Subscription
function handleNewsletterSubmit(event) {
    event.preventDefault();
    
    const emailInput = event.target.querySelector('input[type="email"]');
    const email = emailInput.value;
    
    if (!email || !email.includes('@')) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    // Show success message
    showToast(`Thank you for subscribing to our training newsletter!`, 'success');
    
    // Reset form
    emailInput.value = '';
}

// Animate stats when they come into view
function animateStats() {
    const stats = document.querySelectorAll('.service-stat .number');
    
    stats.forEach(stat => {
        const targetText = stat.innerText;
        const targetNumber = parseInt(targetText.replace(/[^0-9]/g, ''));
        const suffix = targetText.includes('+') ? '+' : '';
        
        if (isNaN(targetNumber)) return;
        
        let current = 0;
        const increment = targetNumber / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetNumber) {
                stat.innerText = targetNumber + suffix;
                clearInterval(timer);
            } else {
                stat.innerText = Math.floor(current) + suffix;
            }
        }, 20);
    });
}

// Initialize stats observer
document.addEventListener('DOMContentLoaded', function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.service-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
});

// Make functions global
window.toggleFaq = toggleFaq;
window.filterCourses = filterCourses;
window.emailForPricing = emailForPricing;
window.emailForConsultation = emailForConsultation;
window.emailForBatchRegistration = emailForBatchRegistration;
window.handleNewsletterSubmit = handleNewsletterSubmit;

// ==================== TAX RETURN FILING PAGE FUNCTIONS ====================

// FAQ Accordion Function
function toggleFaq(header) {
    const content = header.nextElementSibling;
    const icon = header.querySelector('i');
    
    // Close other open FAQs
    document.querySelectorAll('.faq-accordion-header').forEach(h => {
        if (h !== header) {
            h.classList.remove('active');
            h.nextElementSibling.classList.remove('show');
        }
    });
    
    // Toggle current FAQ
    header.classList.toggle('active');
    content.classList.toggle('show');
}

// Email Functions
function emailForPricing(serviceName) {
    const subject = encodeURIComponent(`Pricing Inquiry - ${serviceName} - NEXA Advisory`);
    const body = encodeURIComponent(
        `Dear NEXA Team,\n\n` +
        `I am interested in your ${serviceName}. Please provide me with detailed information about your services and pricing.\n\n` +
        `Thank you.\n\n` +
        `[Your Name]\n` +
        `[Your Company]\n` +
        `[Your Phone Number]`
    );
    
    window.location.href = `mailto:info@nexaadvisory.com.np?subject=${subject}&body=${body}`;
}

function emailForConsultation() {
    const subject = encodeURIComponent('Consultation Request - Tax Return Filing - NEXA Advisory');
    const body = encodeURIComponent(
        `Dear NEXA Team,\n\n` +
        `I would like to schedule a consultation to discuss your tax return filing services for my business/personal taxes. Please let me know your availability.\n\n` +
        `Thank you.\n\n` +
        `[Your Name]\n` +
        `[Your Company]\n` +
        `[Your Phone Number]`
    );
    
    window.location.href = `mailto:info@nexaadvisory.com.np?subject=${subject}&body=${body}`;
}

function emailForSpecificReturn(returnType) {
    const subject = encodeURIComponent(`${returnType} Return Filing Inquiry - NEXA Advisory`);
    const body = encodeURIComponent(
        `Dear NEXA Team,\n\n` +
        `I am interested in your ${returnType} return filing services. Please provide me with detailed information about the process, required documents, and pricing.\n\n` +
        `Thank you.\n\n` +
        `[Your Name]\n` +
        `[Your Company]\n` +
        `[Your Phone Number]`
    );
    
    window.location.href = `mailto:info@nexaadvisory.com.np?subject=${subject}&body=${body}`;
}

// Newsletter Subscription
function handleNewsletterSubmit(event) {
    event.preventDefault();
    
    const emailInput = event.target.querySelector('input[type="email"]');
    const email = emailInput.value;
    
    if (!email || !email.includes('@')) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    // Show success message
    showToast(`Thank you for subscribing to our tax newsletter!`, 'success');
    
    // Reset form
    emailInput.value = '';
}

// Animate stats when they come into view
function animateStats() {
    const stats = document.querySelectorAll('.service-stat .number');
    
    stats.forEach(stat => {
        const targetText = stat.innerText;
        const targetNumber = parseInt(targetText.replace(/[^0-9]/g, ''));
        const suffix = targetText.includes('+') ? '+' : '';
        
        if (isNaN(targetNumber)) return;
        
        let current = 0;
        const increment = targetNumber / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetNumber) {
                stat.innerText = targetNumber + suffix;
                clearInterval(timer);
            } else {
                stat.innerText = Math.floor(current) + suffix;
            }
        }, 20);
    });
}

// Initialize stats observer
document.addEventListener('DOMContentLoaded', function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.service-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
});

// Make functions global
window.toggleFaq = toggleFaq;
window.emailForPricing = emailForPricing;
window.emailForConsultation = emailForConsultation;
window.emailForSpecificReturn = emailForSpecificReturn;
window.handleNewsletterSubmit = handleNewsletterSubmit;

// ==================== BOOKKEEPING SERVICES PAGE FUNCTIONS ====================

// FAQ Accordion Function
function toggleFaq(header) {
    const content = header.nextElementSibling;
    const icon = header.querySelector('i');
    
    // Close other open FAQs
    document.querySelectorAll('.faq-accordion-header').forEach(h => {
        if (h !== header) {
            h.classList.remove('active');
            h.nextElementSibling.classList.remove('show');
        }
    });
    
    // Toggle current FAQ
    header.classList.toggle('active');
    content.classList.toggle('show');
}

// Email Functions
function emailForPricing(serviceName) {
    const subject = encodeURIComponent(`Pricing Inquiry - ${serviceName} - NEXA Advisory`);
    const body = encodeURIComponent(
        `Dear NEXA Team,\n\n` +
        `I am interested in your ${serviceName}. Please provide me with detailed information about your services and pricing.\n\n` +
        `Thank you.\n\n` +
        `[Your Name]\n` +
        `[Your Company]\n` +
        `[Your Phone Number]`
    );
    
    window.location.href = `mailto:info@nexaadvisory.com.np?subject=${subject}&body=${body}`;
}

function emailForConsultation() {
    const subject = encodeURIComponent('Consultation Request - Bookkeeping Services - NEXA Advisory');
    const body = encodeURIComponent(
        `Dear NEXA Team,\n\n` +
        `I would like to schedule a consultation to discuss your bookkeeping services for my business. Please let me know your availability.\n\n` +
        `Thank you.\n\n` +
        `[Your Name]\n` +
        `[Your Company]\n` +
        `[Your Phone Number]`
    );
    
    window.location.href = `mailto:info@nexaadvisory.com.np?subject=${subject}&body=${body}`;
}

function emailForSoftwareInquiry(softwareName) {
    const subject = encodeURIComponent(`Software Integration Inquiry - ${softwareName} - NEXA Advisory`);
    const body = encodeURIComponent(
        `Dear NEXA Team,\n\n` +
        `I am interested in your bookkeeping services with ${softwareName} integration. Please provide me with detailed information about how you work with this software.\n\n` +
        `Thank you.\n\n` +
        `[Your Name]\n` +
        `[Your Company]\n` +
        `[Your Phone Number]`
    );
    
    window.location.href = `mailto:info@nexaadvisory.com.np?subject=${subject}&body=${body}`;
}

function emailForIndustryInquiry(industryName) {
    const subject = encodeURIComponent(`Industry-Specific Bookkeeping Inquiry - ${industryName} - NEXA Advisory`);
    const body = encodeURIComponent(
        `Dear NEXA Team,\n\n` +
        `I am interested in your ${industryName} bookkeeping services. Please provide me with detailed information about how you serve businesses in this industry.\n\n` +
        `Thank you.\n\n` +
        `[Your Name]\n` +
        `[Your Company]\n` +
        `[Your Phone Number]`
    );
    
    window.location.href = `mailto:info@nexaadvisory.com.np?subject=${subject}&body=${body}`;
}

// Newsletter Subscription
function handleNewsletterSubmit(event) {
    event.preventDefault();
    
    const emailInput = event.target.querySelector('input[type="email"]');
    const email = emailInput.value;
    
    if (!email || !email.includes('@')) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    // Show success message
    showToast(`Thank you for subscribing to our newsletter!`, 'success');
    
    // Reset form
    emailInput.value = '';
}

// Animate stats when they come into view
function animateStats() {
    const stats = document.querySelectorAll('.service-stat .number');
    
    stats.forEach(stat => {
        const targetText = stat.innerText;
        const targetNumber = parseInt(targetText.replace(/[^0-9]/g, ''));
        const suffix = targetText.includes('+') ? '+' : '';
        
        if (isNaN(targetNumber)) return;
        
        let current = 0;
        const increment = targetNumber / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetNumber) {
                stat.innerText = targetNumber + suffix;
                clearInterval(timer);
            } else {
                stat.innerText = Math.floor(current) + suffix;
            }
        }, 20);
    });
}

// Initialize stats observer
document.addEventListener('DOMContentLoaded', function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.service-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
});

// Make functions global
window.toggleFaq = toggleFaq;
window.emailForPricing = emailForPricing;
window.emailForConsultation = emailForConsultation;
window.emailForSoftwareInquiry = emailForSoftwareInquiry;
window.emailForIndustryInquiry = emailForIndustryInquiry;
window.handleNewsletterSubmit = handleNewsletterSubmit;
