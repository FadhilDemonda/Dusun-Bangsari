// ==========================================================================
// Dusun Bangsari Website - Main JavaScript
// ==========================================================================

// Global Variables
let galleryIndex = 0;
const galleryItems = [
    {
        src: 'images/sawah.jpeg', // Contoh gambar lokal
        caption: 'Hamparan Sawah Padi'
    },
    {
        src: 'images/gotong-royong.jpeg', // Ini yang kamu tanyakan
        caption: 'Kegiatan Gotong Royong'
    },
    {
        src: 'images/perkebunan.jpeg', // Contoh gambar lokal
        caption: 'Area Perkebunan'
    },
    {
        src: 'images/panen.jpeg', // Contoh gambar lokal
        caption: 'Musim Panen'
    },
    {
        src: 'images/masjid.jpeg', // Contoh gambar lokal
        caption: 'Masjid Dusun'
    },
    {
        src: 'images/jalan.jpeg', // Contoh gambar lokal
        caption: 'Jalan Utama Dusun'
    }
];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Initialize Website Functions
function initializeWebsite() {
    setupNavigation();
    setupBackToTop();
    loadInitialGallery();
    setupLazyLoading();
    setupAnimations();
}

// Navigation Setup
function setupNavigation() {
    // Active navigation highlighting
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes(currentPage)) {
            link.classList.add('active');
        }
    });

    // Mobile menu auto-close
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        document.addEventListener('click', function(e) {
            const isClickInsideNav = navbarCollapse.contains(e.target) || navbarToggler.contains(e.target);
            if (!isClickInsideNav && navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    }
}

// Back to Top Button
function setupBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });

        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Gallery Functions
function loadInitialGallery() {
    const container = document.getElementById('galleryContainer');
    if (!container) return;

    const itemsToShow = window.innerWidth < 768 ? 3 : 6;
    loadGalleryItems(0, itemsToShow);
}

function loadGalleryItems(start, count) {
    const container = document.getElementById('galleryContainer');
    if (!container) return;

    for (let i = start; i < start + count && i < galleryItems.length; i++) {
        const item = galleryItems[i];
        const galleryItem = createGalleryItem(item);
        container.appendChild(galleryItem);
    }
    
    galleryIndex = start + count;
}

function createGalleryItem(item) {
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6 mb-4';
    
    col.innerHTML = `
        <div class="gallery-item" onclick="openImageModal('${item.src}', '${item.caption}')">
            <img src="${item.src}" alt="${item.caption}" class="img-fluid" loading="lazy">
            <div class="gallery-overlay">
                <div class="gallery-caption">${item.caption}</div>
            </div>
        </div>
    `;
    
    return col;
}

function loadMoreGallery() {
    const itemsToLoad = window.innerWidth < 768 ? 3 : 6;
    
    if (galleryIndex < galleryItems.length) {
        loadGalleryItems(galleryIndex, itemsToLoad);
        
        // Hide button if no more items
        if (galleryIndex >= galleryItems.length) {
            const loadMoreBtn = document.querySelector('button[onclick="loadMoreGallery()"]');
            if (loadMoreBtn) {
                loadMoreBtn.style.display = 'none';
            }
        }
    }
}

// Image Modal
function openImageModal(src, caption) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('imageModal');
    if (!modal) {
        modal = createImageModal();
        document.body.appendChild(modal);
    }
    
    // Update modal content
    const modalImg = modal.querySelector('.modal-body img');
    const modalCaption = modal.querySelector('.modal-title');
    
    modalImg.src = src;
    modalCaption.textContent = caption;
    
    // Show modal
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}

function createImageModal() {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'imageModal';
    modal.tabIndex = '-1';
    
    modal.innerHTML = `
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title"></h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body text-center">
                    <img src="" alt="" class="img-fluid">
                </div>
            </div>
        </div>
    `;
    
    return modal;
}

// Lazy Loading Setup
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Animation Setup
function setupAnimations() {
    if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1
        });

        // Observe elements that should animate on scroll
        document.querySelectorAll('.hover-card, .gallery-item').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            animationObserver.observe(el);
        });
    }
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Contact Functions
function openWhatsApp(number, message = '') {
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${number}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
}

function callPhone(number) {
    window.location.href = `tel:${number}`;
}

// Form Validation
function validateForm(formElement) {
    let isValid = true;
    const requiredFields = formElement.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        }
    });
    
    return isValid;
}

// Event Handlers
function showEventDetails(eventId) {
    // This would typically fetch event details from a database
    const eventDetails = {
        1: {
            title: 'Gotong Royong Dusun',
            date: '15 Juli 2024',
            time: '06:00 - 12:00 WIB',
            location: 'Balai Dusun Bangsari',
            description: 'Kegiatan gotong royong rutin untuk membersihkan lingkungan dusun dan memperbaiki fasilitas umum.',
            coordinator: 'Bapak Ahmad Susilo'
        }
    };
    
    const event = eventDetails[eventId];
    if (event) {
        alert(`${event.title}\n\nTanggal: ${event.date}\nWaktu: ${event.time}\nLokasi: ${event.location}\n\nDeskripsi: ${event.description}\n\nKoordinator: ${event.coordinator}`);
    }
}

// Data Management for Different Pages
const pageData = {
    commodities: [
        {
            id: 1,
            name: 'Padi',
            icon: 'fas fa-seedling',
            description: 'Komoditas utama dengan produksi 500 ton per tahun',
            season: 'Tanam: Maret-April, Panen: Juli-Agustus'
        },
        {
            id: 2,
            name: 'Jagung',
            icon: 'fas fa-corn',
            description: 'Tanaman palawija dengan kualitas unggul',
            season: 'Tanam: Mei-Juni, Panen: September-Oktober'
        },
        {
            id: 3,
            name: 'Sayuran',
            icon: 'fas fa-carrot',
            description: 'Berbagai jenis sayuran untuk kebutuhan lokal',
            season: 'Sepanjang tahun'
        }
    ],
    
    contacts: [
        {
            name: 'Ahmad Susilo',
            position: 'Kepala Dusun',
            phone: '081234567890',
            whatsapp: '6281234567890'
        },
        {
            name: 'Budi Santoso',
            position: 'Sekretaris Dusun',
            phone: '081234567891',
            whatsapp: '6281234567891'
        },
        {
            name: 'Siti Aminah',
            position: 'Bendahara',
            phone: '081234567892',
            whatsapp: '6281234567892'
        }
    ],
    
    events: [
        {
            id: 1,
            title: 'Gotong Royong Dusun',
            date: '2024-07-15',
            time: '06:00',
            location: 'Balai Dusun',
            type: 'Rutin'
        },
        {
            id: 2,
            title: 'Rapat Warga',
            date: '2024-07-20',
            time: '19:00',
            location: 'Masjid Dusun',
            type: 'Penting'
        }
    ]
};

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadMoreGallery,
        openImageModal,
        openWhatsApp,
        callPhone,
        showEventDetails,
        pageData
    };
}

// Resize handler
window.addEventListener('resize', debounce(() => {
    // Adjust gallery layout if needed
    if (window.innerWidth < 768 && document.querySelector('.gallery-item')) {
        // Refresh gallery layout for mobile
    }
}, 250));