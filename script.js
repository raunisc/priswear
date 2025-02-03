document.addEventListener('DOMContentLoaded', () => {
    const productButtons = document.querySelectorAll('.product-card button');
    const categoryCards = document.querySelectorAll('.category-card');
    const newsletterForm = document.querySelector('.newsletter-form');
    const searchInput = document.getElementById('product-search');
    const searchButton = document.getElementById('search-button');
    const searchResultsContainer = document.getElementById('search-results-container');
    
    // Updated product highlights for Feminino only
    const productHighlightsFeminino = [
        {
            id: 1,
            name: 'Camiseta Verde',
            price: 'R$ 299,90',
            image: 'img/camiseta-verde.jpg',
            category: 'Feminino'
        },
        {
            id: 2,
            name: 'Blazer Alfaiataria Elegante',
            price: 'R$ 449,90',
            image: 'img/saida-rosa.jpg',
            category: 'Feminino'
        },
        {
            id: 5,
            name: 'Conjunto Casual Confort',
            price: 'R$ 279,90',
            image: 'img/conjunto-vermelho.jpg',
            category: 'Feminino'
        },
        {
            id: 4,
            name: 'Conjunto Black',
            price: 'R$ 349,90',
            image: 'img/conjunto-black.jpg',
            category: 'Feminino'
        }
    ];

    const allProducts = [...productHighlightsFeminino];

    // WhatsApp redirect function
    function redirectToWhatsApp(productName, productPrice) {
        const phoneNumber = '5571999391758';
        const message = encodeURIComponent(`Olá, gostaria de comprar o produto "${productName}" por ${productPrice}. Poderia me dar mais informações?`);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        
        window.open(whatsappUrl, '_blank');
    }

    // Create product card function
    function createProductCard(product) {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card', 'search-result-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" style="height: 400px; object-fit: cover;">
            <div class="product-details">
                <h4>${product.name}</h4>
                <p class="price">${product.price}</p>
                <p>Categoria: ${product.category}</p>
                <button data-product-id="${product.id}">Saiba mais!</button>
            </div>
        `;

        // Add WhatsApp redirect functionality to the button
        const button = productCard.querySelector('button');
        button.addEventListener('click', () => {
            redirectToWhatsApp(product.name, product.price);
        });

        return productCard;
    }

    // Improved search functionality
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        // Clear previous search results
        searchResultsContainer.innerHTML = '';
        
        if (!searchTerm) {
            searchResultsContainer.style.display = 'none';
            return;
        }

        // Filter products
        const filteredProducts = allProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm)
        );

        // Create and display search results
        if (filteredProducts.length > 0) {
            const resultsTitle = document.createElement('h3');
            resultsTitle.textContent = `Resultados da Busca (${filteredProducts.length} produto(s))`;
            searchResultsContainer.appendChild(resultsTitle);

            const resultsWrapper = document.createElement('div');
            resultsWrapper.classList.add('search-results-grid');
            
            filteredProducts.forEach(product => {
                const productCard = createProductCard(product);
                resultsWrapper.appendChild(productCard);
            });

            searchResultsContainer.appendChild(resultsWrapper);
            searchResultsContainer.style.display = 'block';
        } else {
            const noResultsMessage = document.createElement('p');
            noResultsMessage.textContent = 'Nenhum produto encontrado';
            noResultsMessage.style.textAlign = 'center';
            searchResultsContainer.appendChild(noResultsMessage);
            searchResultsContainer.style.display = 'block';
        }

        // Scroll to search results
        searchResultsContainer.scrollIntoView({ behavior: 'smooth' });
    }

    // Event listeners for search
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Populate product highlights for Feminino
    const productWrapperFeminino = document.getElementById('product-wrapper-feminino');
    productHighlightsFeminino.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('swiper-slide', 'product-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-details">
                <h4>${product.name}</h4>
                <p class="price">${product.price}</p>
                <button data-product-id="${product.id}">Adicionar ao Carrinho</button>
            </div>
        `;
        
        // Add WhatsApp redirect functionality to the button
        const button = productCard.querySelector('button');
        button.addEventListener('click', () => {
            redirectToWhatsApp(product.name, product.price);
        });

        productWrapperFeminino.appendChild(productCard);
    });

    // Initialize Swiper for Feminino with autoplay
    new Swiper('.product-swiper-feminino', {
        autoplay: {
            enabled: true,
            delay: 3000,
            disableOnInteraction: false,
        },
        slidesPerView: 3,
        spaceBetween: 30,
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            320: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
        }
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const sidebarNav = document.querySelector('.sidebar-nav');

    // Function to close mobile menu and sidebar
    function closeMenu() {
        hamburger.classList.remove('is-active');
        mobileNav.classList.remove('is-active');
        sidebarNav.classList.remove('is-active');
        document.body.style.overflow = 'auto';
    }

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event from propagating
        if (mobileNav.classList.contains('is-active')) {
            // If menu is already open, close it
            closeMenu();
        } else {
            // If menu is closed, open it
            hamburger.classList.add('is-active');
            mobileNav.classList.add('is-active');
            sidebarNav.classList.add('is-active');
            document.body.style.overflow = 'hidden';
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (
            mobileNav.classList.contains('is-active') || 
            sidebarNav.classList.contains('is-active')
        ) {
            // Check if the click is outside the menu and hamburger
            if (!mobileNav.contains(e.target) && 
                !sidebarNav.contains(e.target) && 
                !hamburger.contains(e.target)) {
                closeMenu();
            }
        }
    });

    // Close mobile nav when a link is clicked
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-content ul li a, .sidebar-nav .main-nav ul li a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Mobile search functionality
    const mobileSearchInput = document.getElementById('product-search-mobile');
    const mobileSearchButton = document.getElementById('search-button-mobile');

    function performMobileSearch() {
        const searchTerm = mobileSearchInput.value.toLowerCase().trim();
        
        // Reuse existing search logic from the main search
        const filteredProducts = allProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm)
        );

        // Clear previous search results
        searchResultsContainer.innerHTML = '';
        
        if (filteredProducts.length > 0) {
            const resultsTitle = document.createElement('h3');
            resultsTitle.textContent = `Resultados da Busca (${filteredProducts.length} produto(s))`;
            searchResultsContainer.appendChild(resultsTitle);

            const resultsWrapper = document.createElement('div');
            resultsWrapper.classList.add('search-results-grid');
            
            filteredProducts.forEach(product => {
                const productCard = createProductCard(product);
                resultsWrapper.appendChild(productCard);
            });

            searchResultsContainer.appendChild(resultsWrapper);
            searchResultsContainer.style.display = 'block';
        } else {
            const noResultsMessage = document.createElement('p');
            noResultsMessage.textContent = 'Nenhum produto encontrado';
            noResultsMessage.style.textAlign = 'center';
            searchResultsContainer.appendChild(noResultsMessage);
            searchResultsContainer.style.display = 'block';
        }

        // Scroll to search results
        searchResultsContainer.scrollIntoView({ behavior: 'smooth' });

        // Close mobile menu after search
        closeMenu();
    }

    mobileSearchButton.addEventListener('click', performMobileSearch);
    mobileSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performMobileSearch();
        }
    });

    // Add interaction to category cards
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            window.location.href = `https://exemplo.com/${category}`;
        });
    });

    // Newsletter form submission
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input');
        
        if (emailInput.value) {
            alert(`Obrigado por assinar nossa newsletter!\nEnviaremos novidades para: ${emailInput.value}`);
            emailInput.value = '';
        }
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="https://exemplo.com/"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Normally you'd navigate to the page, but for demo purposes we'll show an alert
            alert(`Você será redirecionado para: ${this.href}`);
        });
    });

    // Header hide/show on scroll
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (currentScrollTop > 50) {
            if (currentScrollTop > lastScrollTop) {
                // Scrolling down
                header.classList.add('hide');
            } else {
                // Scrolling up
                header.classList.remove('hide');
            }
        } else {
            header.classList.remove('hide');
        }
        
        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    });

    // Mobile menu close button
    const mobileNavCloseButton = document.querySelector('.mobile-nav-close');
    
    if (mobileNavCloseButton) {
        mobileNavCloseButton.addEventListener('click', closeMenu);
    }
});