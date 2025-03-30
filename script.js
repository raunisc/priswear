document.addEventListener('DOMContentLoaded', function() {
    // Import configuration
    import('./config.js').then(module => {
        const config = module.default;
        initApp(config);
    });
    
    function initApp(config) {
        // Create and show notification dropdown
        const notificationDropdown = document.createElement('div');
        notificationDropdown.className = 'notification-dropdown';
        notificationDropdown.innerHTML = `
            <p><i class="fas fa-clock"></i> ${config.restaurant.openingHours}</p>
        `;
        document.body.appendChild(notificationDropdown);
        
        // Show the notification after a small delay
        setTimeout(() => {
            notificationDropdown.classList.add('show');
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                notificationDropdown.classList.remove('show');
            }, 5000);
        }, 500);
        
        // Hide notification when clicking anywhere
        document.addEventListener('click', function() {
            notificationDropdown.classList.remove('show');
        });
    
        // Animation delay for menu sections
        const sections = document.querySelectorAll('.menu-section');
        sections.forEach((section, index) => {
            section.style.animationDelay = `${index * 0.2}s`;
        });
    
        // Mobile menu toggle
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const nav = document.querySelector('nav');
        
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('menu-open');
            const iconElement = this.querySelector('i');
            if (nav.classList.contains('menu-open')) {
                iconElement.classList.remove('fa-bars');
                iconElement.classList.add('fa-times');
            } else {
                iconElement.classList.remove('fa-times');
                iconElement.classList.add('fa-bars');
            }
        });
    
        // Removing the image preview modal functionality
        // Remove the click event on itemImages for the modal
        const itemImages = document.querySelectorAll('.item-image');
        itemImages.forEach(item => {
            item.style.cursor = 'default'; // Change cursor style
            
            // Removing the zoom icon indicator
            item.classList.add('no-zoom');
        });
        
        // Remove the modal-related elements if they exist
        const modalOverlay = document.querySelector('.modal-overlay');
        if (modalOverlay) {
            document.body.removeChild(modalOverlay);
        }
        
        // Add admin login button functionality
        const adminLoginBtn = document.getElementById('admin-login-btn');
        adminLoginBtn.addEventListener('click', function() {
            showAdminLogin();
        });
        
        // Menu data store
        const menuData = {
            lanches: [],
            acompanhamentos: [],
            bebidas: [],
            combos: []
        };
        
        // Get initial menu data from DOM
        function initializeMenuData() {
            // Populate menuData with existing items from the DOM
            config.categories.forEach(category => {
                const sectionElement = document.getElementById(category.id);
                if (!sectionElement) return;
                
                const itemElements = sectionElement.querySelectorAll('.menu-item');
                itemElements.forEach(item => {
                    const nameElement = item.querySelector('h3');
                    const descElement = item.querySelector('.description');
                    const imgElement = item.querySelector('.item-image');
                    const oldPriceElement = item.querySelector('.old-price');
                    const newPriceElement = item.querySelector('.new-price');
                    const badgeElement = item.querySelector('.item-badge');
                    
                    // Create menu item object
                    const menuItem = {
                        id: generateItemId(),
                        name: nameElement ? nameElement.textContent : '',
                        description: descElement ? descElement.textContent : '',
                        image: imgElement ? imgElement.style.backgroundImage.slice(4, -1).replace(/"/g, "") : '',
                        price: newPriceElement ? parseFloat(newPriceElement.textContent.replace('R$', '').replace(',', '.').trim()) : 0,
                        oldPrice: oldPriceElement ? parseFloat(oldPriceElement.textContent.replace('R$', '').replace(',', '.').trim()) : 0,
                        badge: badgeElement ? badgeElement.textContent : '',
                        category: category.id
                    };
                    
                    // Add to menuData
                    menuData[category.id].push(menuItem);
                });
            });
        }
        
        // Initialize menu data
        initializeMenuData();
        
        // Show admin login modal
        function showAdminLogin() {
            const loginOverlay = document.createElement('div');
            loginOverlay.className = 'admin-overlay';
            
            loginOverlay.innerHTML = `
                <div class="login-form">
                    <h2>Acesso Administrativo</h2>
                    <div class="form-group">
                        <label for="admin-username">Usuário</label>
                        <input type="text" id="admin-username" placeholder="Nome de usuário">
                    </div>
                    <div class="form-group">
                        <label for="admin-password">Senha</label>
                        <input type="password" id="admin-password" placeholder="Senha">
                    </div>
                    <button id="admin-login-submit">Entrar</button>
                </div>
            `;
            
            document.body.appendChild(loginOverlay);
            
            setTimeout(() => {
                loginOverlay.classList.add('active');
            }, 10);
            
            // Login submit
            const loginSubmit = document.getElementById('admin-login-submit');
            loginSubmit.addEventListener('click', function() {
                const username = document.getElementById('admin-username').value;
                const password = document.getElementById('admin-password').value;
                
                if (username === config.admin.username && password === config.admin.password) {
                    // Success - open admin panel
                    loginOverlay.classList.remove('active');
                    setTimeout(() => {
                        document.body.removeChild(loginOverlay);
                        showAdminPanel();
                    }, 300);
                } else {
                    // Error - show message
                    showToast('Usuário ou senha incorretos', 'error');
                    document.getElementById('admin-password').value = '';
                }
            });
            
            // Close on click outside
            loginOverlay.addEventListener('click', function(e) {
                if (e.target === loginOverlay) {
                    loginOverlay.classList.remove('active');
                    setTimeout(() => {
                        document.body.removeChild(loginOverlay);
                    }, 300);
                }
            });
        }
        
        // Show admin panel
        function showAdminPanel() {
            // Create admin panel elements
            const adminOverlay = document.createElement('div');
            adminOverlay.className = 'admin-overlay';
            
            // Build category tabs
            const categoryTabs = config.categories.map(category => {
                return `<li><a href="#" data-category="${category.id}" class="${category.id === 'lanches' ? 'active' : ''}"><i class="${category.icon}"></i> ${category.name}</a></li>`;
            }).join('');
            
            adminOverlay.innerHTML = `
                <div class="admin-content">
                    <div class="admin-header">
                        <h2>Painel Administrativo - Cardápio</h2>
                        <button class="admin-close"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="admin-body">
                        <div class="admin-sidebar">
                            <ul>
                                ${categoryTabs}
                            </ul>
                        </div>
                        <div class="admin-main">
                            ${config.categories.map(category => `
                                <div id="admin-${category.id}" class="admin-section ${category.id === 'lanches' ? 'active' : ''}">
                                    <div class="admin-actions">
                                        <button class="add-item-btn" data-category="${category.id}"><i class="fas fa-plus"></i> Adicionar ${category.name}</button>
                                    </div>
                                    <h3><i class="${category.icon}"></i> ${category.name}</h3>
                                    <div class="items-grid" id="grid-${category.id}">
                                        <!-- Items will be loaded here -->
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(adminOverlay);
            
            setTimeout(() => {
                adminOverlay.classList.add('active');
            }, 10);
            
            // Load menu items
            renderAdminMenuItems();
            
            // Event listeners for admin panel
            
            // Close button
            const adminCloseBtn = adminOverlay.querySelector('.admin-close');
            adminCloseBtn.addEventListener('click', function() {
                adminOverlay.classList.remove('active');
                setTimeout(() => {
                    document.body.removeChild(adminOverlay);
                }, 300);
            });
            
            // Category tabs
            const categoryLinks = adminOverlay.querySelectorAll('.admin-sidebar a');
            categoryLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Remove active class from all links and sections
                    categoryLinks.forEach(l => l.classList.remove('active'));
                    const sections = adminOverlay.querySelectorAll('.admin-section');
                    sections.forEach(s => s.classList.remove('active'));
                    
                    // Add active class to clicked link and corresponding section
                    this.classList.add('active');
                    const category = this.getAttribute('data-category');
                    const section = adminOverlay.querySelector(`#admin-${category}`);
                    section.classList.add('active');
                });
            });
            
            // Add item buttons
            const addItemBtns = adminOverlay.querySelectorAll('.add-item-btn');
            addItemBtns.forEach(button => {
                button.addEventListener('click', function() {
                    const category = this.getAttribute('data-category');
                    showItemForm(category);
                });
            });
        }
        
        // Render admin menu items
        function renderAdminMenuItems() {
            config.categories.forEach(category => {
                const gridElement = document.getElementById(`grid-${category.id}`);
                if (!gridElement) return;
                
                // Clear existing items
                gridElement.innerHTML = '';
                
                // Add items
                menuData[category.id].forEach(item => {
                    const itemElement = document.createElement('div');
                    itemElement.className = 'admin-item';
                    itemElement.setAttribute('data-id', item.id);
                    
                    itemElement.innerHTML = `
                        <div class="admin-item-img" style="background-image: url('${item.image}')">
                            <div class="admin-item-actions">
                                <button class="admin-item-btn edit" title="Editar"><i class="fas fa-edit"></i></button>
                                <button class="admin-item-btn delete" title="Excluir"><i class="fas fa-trash"></i></button>
                            </div>
                        </div>
                        <div class="admin-item-info">
                            <h4>${item.name}</h4>
                            <p>${item.description.substring(0, 50)}${item.description.length > 50 ? '...' : ''}</p>
                            <div class="admin-item-price">
                                ${item.oldPrice > 0 ? `<span class="old">R$ ${item.oldPrice.toFixed(2).replace('.', ',')}</span>` : ''}
                                R$ ${item.price.toFixed(2).replace('.', ',')}
                            </div>
                        </div>
                    `;
                    
                    // Add edit button event
                    const editBtn = itemElement.querySelector('.edit');
                    editBtn.addEventListener('click', function() {
                        showItemForm(category.id, item);
                    });
                    
                    // Add delete button event
                    const deleteBtn = itemElement.querySelector('.delete');
                    deleteBtn.addEventListener('click', function() {
                        if (confirm(`Deseja realmente excluir "${item.name}"?`)) {
                            deleteMenuItem(item);
                        }
                    });
                    
                    gridElement.appendChild(itemElement);
                });
            });
        }
        
        // Show item form (add/edit)
        function showItemForm(category, item = null) {
            // Create a copy of item if editing
            const editingItem = item ? {...item} : null;
            
            // Find category info
            const categoryInfo = config.categories.find(c => c.id === category);
            
            // Create form dialog
            const formOverlay = document.createElement('div');
            formOverlay.className = 'admin-overlay';
            
            formOverlay.innerHTML = `
                <div class="admin-content" style="max-width: 800px; height: auto; max-height: 90%;">
                    <div class="admin-header">
                        <h2>${item ? 'Editar' : 'Adicionar'} ${categoryInfo.name}</h2>
                        <button class="admin-close"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="admin-main" style="overflow-y: auto; padding: 20px;">
                        <form class="admin-form" id="item-form">
                            <div class="image-cropper-container">
                                <div class="image-upload" id="image-upload-area">
                                    <i class="fas fa-cloud-upload-alt"></i>
                                    <p>Clique para fazer upload da imagem</p>
                                    <p class="small">ou arraste uma imagem para cá</p>
                                    <input type="file" id="item-image-input" accept="image/*">
                                </div>
                                <div class="cropper-container" style="display: none;">
                                    <div class="img-preview"></div>
                                    <div class="cropper-buttons">
                                        <button type="button" id="crop-btn" class="crop-btn">Recortar Imagem</button>
                                        <button type="button" id="cancel-crop-btn">Cancelar</button>
                                    </div>
                                </div>
                                <input type="hidden" id="item-image-data">
                            </div>
                            
                            <div class="form-group">
                                <label for="item-name">Nome do Item</label>
                                <input type="text" id="item-name" placeholder="Ex: Dogão Tradicional" required value="${item ? item.name : ''}">
                            </div>
                            
                            <div class="form-group">
                                <label for="item-description">Descrição</label>
                                <textarea id="item-description" placeholder="Descrição do item">${item ? item.description : ''}</textarea>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="item-price">Preço (R$)</label>
                                    <input type="number" id="item-price" step="0.01" min="0" placeholder="0.00" required value="${item ? item.price : ''}">
                                </div>
                                <div class="form-group">
                                    <label for="item-old-price">Preço Antigo (R$)</label>
                                    <input type="number" id="item-old-price" step="0.01" min="0" placeholder="0.00" value="${item && item.oldPrice ? item.oldPrice : ''}">
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="item-badge">Badge (opcional)</label>
                                <input type="text" id="item-badge" placeholder="Ex: PROMOÇÃO" value="${item && item.badge ? item.badge : ''}">
                            </div>
                            
                            <div style="text-align: right; margin-top: 20px;">
                                <button type="button" id="cancel-form-btn">Cancelar</button>
                                <button type="submit">${item ? 'Atualizar' : 'Adicionar'} Item</button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
            
            document.body.appendChild(formOverlay);
            
            setTimeout(() => {
                formOverlay.classList.add('active');
            }, 10);
            
            // Setup image upload area
            const imageUploadArea = document.getElementById('image-upload-area');
            const imageInput = document.getElementById('item-image-input');
            const imageDataInput = document.getElementById('item-image-data');
            const cropperContainer = document.querySelector('.cropper-container');
            let cropper = null;
            
            // If editing, show existing image
            if (item && item.image) {
                imageDataInput.value = item.image;
                
                const imgPreview = document.createElement('img');
                imgPreview.src = item.image;
                imgPreview.style.width = '100%';
                imgPreview.style.height = '200px';
                imgPreview.style.objectFit = 'cover';
                imgPreview.style.borderRadius = '8px';
                
                imageUploadArea.innerHTML = '';
                imageUploadArea.appendChild(imgPreview);
                imageUploadArea.style.padding = '0';
                imageUploadArea.style.border = 'none';
            }
            
            // Image input change event
            imageInput.addEventListener('change', function(e) {
                handleImageSelection(e.target.files[0]);
            });
            
            // Drag and drop functionality
            imageUploadArea.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.style.backgroundColor = 'rgba(139, 0, 0, 0.1)';
                this.style.borderColor = 'var(--primary-color)';
            });
            
            imageUploadArea.addEventListener('dragleave', function(e) {
                e.preventDefault();
                this.style.backgroundColor = '';
                this.style.borderColor = 'var(--border-color)';
            });
            
            imageUploadArea.addEventListener('drop', function(e) {
                e.preventDefault();
                this.style.backgroundColor = '';
                this.style.borderColor = 'var(--border-color)';
                
                if (e.dataTransfer.files.length) {
                    handleImageSelection(e.dataTransfer.files[0]);
                }
            });
            
            // Click to select image
            imageUploadArea.addEventListener('click', function() {
                imageInput.click();
            });
            
            // Handle image selection
            function handleImageSelection(file) {
                if (!file || !file.type.match('image.*')) {
                    showToast('Por favor, selecione uma imagem válida', 'error');
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    // Hide upload area and show cropper
                    imageUploadArea.style.display = 'none';
                    cropperContainer.style.display = 'block';
                    
                    // Create cropper
                    const imgPreview = document.querySelector('.img-preview');
                    imgPreview.innerHTML = `<img id="crop-image" src="${e.target.result}" style="max-width: 100%;">`;
                    
                    const image = document.getElementById('crop-image');
                    
                    // Initialize cropper - require cropperjs to be loaded
                    if (typeof Cropper !== 'undefined') {
                        cropper = new Cropper(image, {
                            aspectRatio: 5 / 3,
                            viewMode: 1,
                            autoCropArea: 1
                        });
                    } else {
                        // Fallback if Cropper is not available
                        imageDataInput.value = e.target.result;
                        cropperContainer.style.display = 'none';
                        imageUploadArea.style.display = 'block';
                        imageUploadArea.innerHTML = `<img src="${e.target.result}" style="max-width: 100%; max-height: 200px; border-radius: 8px;">`;
                    }
                };
                reader.readAsDataURL(file);
            }
            
            // Crop button event
            document.getElementById('crop-btn').addEventListener('click', function() {
                if (cropper) {
                    const canvas = cropper.getCroppedCanvas({
                        width: 500,
                        height: 300
                    });
                    
                    imageDataInput.value = canvas.toDataURL();
                    
                    // Show cropped image
                    cropperContainer.style.display = 'none';
                    imageUploadArea.style.display = 'block';
                    imageUploadArea.innerHTML = `<img src="${imageDataInput.value}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">`;
                    imageUploadArea.style.padding = '0';
                    imageUploadArea.style.border = 'none';
                    
                    // Destroy cropper
                    cropper.destroy();
                    cropper = null;
                }
            });
            
            // Cancel crop button event
            document.getElementById('cancel-crop-btn').addEventListener('click', function() {
                cropperContainer.style.display = 'none';
                imageUploadArea.style.display = 'block';
                
                if (cropper) {
                    cropper.destroy();
                    cropper = null;
                }
            });
            
            // Form submit event
            const itemForm = document.getElementById('item-form');
            itemForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form values
                const name = document.getElementById('item-name').value.trim();
                const description = document.getElementById('item-description').value.trim();
                const price = parseFloat(document.getElementById('item-price').value);
                const oldPrice = document.getElementById('item-old-price').value ? parseFloat(document.getElementById('item-old-price').value) : 0;
                const badge = document.getElementById('item-badge').value.trim();
                const imageData = document.getElementById('item-image-data').value;
                
                // Validate
                if (!name) {
                    showToast('Por favor, informe o nome do item', 'error');
                    return;
                }
                
                if (isNaN(price) || price <= 0) {
                    showToast('Por favor, informe um preço válido', 'error');
                    return;
                }
                
                // Create item object
                const menuItem = {
                    id: item ? item.id : generateItemId(),
                    name: name,
                    description: description,
                    image: imageData || 'https://via.placeholder.com/500x300?text=Imagem+Indisponivel',
                    price: price,
                    oldPrice: oldPrice,
                    badge: badge,
                    category: category
                };
                
                // Add or update item
                if (item) {
                    // Update existing item
                    updateMenuItem(menuItem);
                } else {
                    // Add new item
                    addMenuItem(menuItem);
                }
                
                // Close form
                formOverlay.classList.remove('active');
                setTimeout(() => {
                    document.body.removeChild(formOverlay);
                }, 300);
            });
            
            // Cancel button event
            document.getElementById('cancel-form-btn').addEventListener('click', function() {
                formOverlay.classList.remove('active');
                setTimeout(() => {
                    document.body.removeChild(formOverlay);
                }, 300);
            });
            
            // Close button event
            const closeBtn = formOverlay.querySelector('.admin-close');
            closeBtn.addEventListener('click', function() {
                formOverlay.classList.remove('active');
                setTimeout(() => {
                    document.body.removeChild(formOverlay);
                }, 300);
            });
        }
        
        // Add menu item
        function addMenuItem(item) {
            // Add to menuData
            menuData[item.category].push(item);
            
            // Update menu in DOM
            updateMenuDOM();
            
            // Update admin panel
            renderAdminMenuItems();
            
            // Show success message
            showToast(`Item "${item.name}" adicionado com sucesso!`, 'success');
        }
        
        // Update menu item
        function updateMenuItem(item) {
            // Find item index
            const index = menuData[item.category].findIndex(i => i.id === item.id);
            
            if (index !== -1) {
                // Update item
                menuData[item.category][index] = item;
                
                // Update menu in DOM
                updateMenuDOM();
                
                // Update admin panel
                renderAdminMenuItems();
                
                // Show success message
                showToast(`Item "${item.name}" atualizado com sucesso!`, 'success');
            }
        }
        
        // Delete menu item
        function deleteMenuItem(item) {
            // Find item index
            const index = menuData[item.category].findIndex(i => i.id === item.id);
            
            if (index !== -1) {
                // Remove item
                menuData[item.category].splice(index, 1);
                
                // Update menu in DOM
                updateMenuDOM();
                
                // Update admin panel
                renderAdminMenuItems();
                
                // Show success message
                showToast(`Item "${item.name}" excluído com sucesso!`, 'success');
            }
        }
        
        // Update menu in DOM
        function updateMenuDOM() {
            config.categories.forEach(category => {
                const sectionElement = document.getElementById(category.id);
                if (!sectionElement) return;
                
                const menuItemsContainer = sectionElement.querySelector('.menu-items');
                if (!menuItemsContainer) return;
                
                // Clear container
                menuItemsContainer.innerHTML = '';
                
                // Add items
                menuData[category.id].forEach(item => {
                    const itemElement = document.createElement('div');
                    itemElement.className = 'menu-item';
                    
                    itemElement.innerHTML = `
                        <div class="item-image no-zoom" style="background-image: url('${item.image}')">
                            ${item.badge ? `<div class="item-badge">${item.badge}</div>` : ''}
                        </div>
                        <div class="item-info">
                            <h3>${item.name}</h3>
                            <p class="description">${item.description}</p>
                            <div class="price">
                                ${item.oldPrice > 0 ? `<span class="old-price">R$ ${item.oldPrice.toFixed(2).replace('.', ',')}</span>` : ''}
                                <span class="new-price">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
                            </div>
                            <button class="add-to-cart">Adicionar <i class="fas fa-cart-plus"></i></button>
                        </div>
                    `;
                    
                    // Add to cart button event
                    const addToCartBtn = itemElement.querySelector('.add-to-cart');
                    addToCartBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        
                        // Get item details
                        const menuItem = this.closest('.menu-item');
                        const name = menuItem.querySelector('h3').textContent;
                        const price = menuItem.querySelector('.new-price').textContent;
                        
                        // Create flying item animation
                        const itemImg = menuItem.querySelector('.item-image');
                        const imgRect = itemImg.getBoundingClientRect();
                        const cartBtn = document.querySelector('.cart-button');
                        const cartRect = cartBtn.getBoundingClientRect();
                        
                        const flyingItem = document.createElement('div');
                        flyingItem.style.cssText = `
                            position: fixed;
                            width: 30px;
                            height: 30px;
                            background-image: ${itemImg.style.backgroundImage};
                            background-size: cover;
                            background-position: center;
                            border-radius: 50%;
                            top: ${imgRect.top + imgRect.height/2}px;
                            left: ${imgRect.left + imgRect.width/2}px;
                            z-index: 1000;
                            transition: all 0.8s cubic-bezier(.2,.8,.2,1);
                        `;
                        document.body.appendChild(flyingItem);
                        
                        setTimeout(() => {
                            flyingItem.style.top = `${cartRect.top + cartRect.height/2}px`;
                            flyingItem.style.left = `${cartRect.left + cartRect.width/2}px`;
                            flyingItem.style.opacity = '0';
                            flyingItem.style.transform = 'scale(0.2)';
                        }, 10);
                        
                        setTimeout(() => {
                            document.body.removeChild(flyingItem);
                            
                            // Update cart count after animation
                            cartCount++;
                            cartCountElement.textContent = cartCount;
                            
                            // Add to cart array
                            cartItems.push({
                                name: name,
                                price: price,
                                quantity: 1
                            });
                            
                            // Show success toast
                            showToast(`${name} adicionado ao carrinho!`, 'success');
                            
                            // Pulse cart button
                            cartBtn.classList.add('pulse-animation');
                            setTimeout(() => cartBtn.classList.remove('pulse-animation'), 1000);
                        }, 800);
                    });
                    
                    menuItemsContainer.appendChild(itemElement);
                });
            });
        }
        
        // Generate unique ID for menu items
        function generateItemId() {
            return '_' + Math.random().toString(36).substr(2, 9);
        }
        
        // Add CSS for no-zoom class
        document.head.insertAdjacentHTML('beforeend', `
            <style>
                .item-image.no-zoom:after {
                    display: none !important;
                }
                .item-image.no-zoom:hover:after {
                    opacity: 0 !important;
                }
                .admin-item-price .old {
                    text-decoration: line-through;
                    color: #999;
                    margin-right: 8px;
                    font-size: 0.9em;
                    font-weight: normal;
                }
            </style>
        `);
        
        // Load Cropper.js for image editing
        function loadCropperJS() {
            // Check if Cropper.js is already loaded
            if (typeof Cropper !== 'undefined') return;
            
            // Load CSS
            const cropperCSS = document.createElement('link');
            cropperCSS.rel = 'stylesheet';
            cropperCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.css';
            document.head.appendChild(cropperCSS);
            
            // Load JS
            const cropperJS = document.createElement('script');
            cropperJS.src = 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.js';
            document.head.appendChild(cropperJS);
        }
        
        // Load necessary libraries
        loadCropperJS();
        
        // Smooth scrolling for navigation
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Close mobile menu if open
                nav.classList.remove('menu-open');
                const iconElement = mobileMenuToggle.querySelector('i');
                iconElement.classList.remove('fa-times');
                iconElement.classList.add('fa-bars');
                
                // Remove active class from all links
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                
                // Add active class to clicked link
                this.classList.add('active');
                
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                window.scrollTo({
                    top: targetSection.offsetTop - 100,
                    behavior: 'smooth'
                });
            });
        });
        
        // Highlight active section on scroll
        window.addEventListener('scroll', function() {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= (sectionTop - 150)) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
        
        // Improved toast notification function
        function showToast(message, type = 'normal', duration = 3000) {
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            
            let icon = '';
            if (type === 'success') icon = '<i class="fas fa-check-circle"></i>';
            else if (type === 'error') icon = '<i class="fas fa-exclamation-circle"></i>';
            else if (type === 'warning') icon = '<i class="fas fa-exclamation-triangle"></i>';
            else icon = '<i class="fas fa-info-circle"></i>';
            
            toast.innerHTML = `${icon}${message}`;
            
            // Remove any existing toasts
            document.querySelectorAll('.toast').forEach(t => {
                t.classList.remove('show');
                setTimeout(() => t.remove(), 300);
            });
            
            document.body.appendChild(toast);
            
            setTimeout(() => toast.classList.add('show'), 10);
            
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    if (document.body.contains(toast)) {
                        document.body.removeChild(toast);
                    }
                }, 300);
            }, duration);
            
            return toast;
        }
        
        let cartCount = 0;
        const cartCountElement = document.querySelector('.cart-count');
        let cartItems = [];
        
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get item details
                const menuItem = this.closest('.menu-item');
                const name = menuItem.querySelector('h3').textContent;
                const price = menuItem.querySelector('.new-price').textContent;
                
                // Create flying item animation
                const itemImg = menuItem.querySelector('.item-image');
                const imgRect = itemImg.getBoundingClientRect();
                const cartBtn = document.querySelector('.cart-button');
                const cartRect = cartBtn.getBoundingClientRect();
                
                const flyingItem = document.createElement('div');
                flyingItem.style.cssText = `
                    position: fixed;
                    width: 30px;
                    height: 30px;
                    background-image: ${itemImg.style.backgroundImage};
                    background-size: cover;
                    background-position: center;
                    border-radius: 50%;
                    top: ${imgRect.top + imgRect.height/2}px;
                    left: ${imgRect.left + imgRect.width/2}px;
                    z-index: 1000;
                    transition: all 0.8s cubic-bezier(.2,.8,.2,1);
                `;
                document.body.appendChild(flyingItem);
                
                setTimeout(() => {
                    flyingItem.style.top = `${cartRect.top + cartRect.height/2}px`;
                    flyingItem.style.left = `${cartRect.left + cartRect.width/2}px`;
                    flyingItem.style.opacity = '0';
                    flyingItem.style.transform = 'scale(0.2)';
                }, 10);
                
                setTimeout(() => {
                    document.body.removeChild(flyingItem);
                    
                    // Update cart count after animation
                    cartCount++;
                    cartCountElement.textContent = cartCount;
                    
                    // Add to cart array
                    cartItems.push({
                        name: name,
                        price: price,
                        quantity: 1
                    });
                    
                    // Show success toast
                    showToast(`${name} adicionado ao carrinho!`, 'success');
                    
                    // Pulse cart button
                    cartBtn.classList.add('pulse-animation');
                    setTimeout(() => cartBtn.classList.remove('pulse-animation'), 1000);
                }, 800);
            });
        });
        
        const cartButton = document.querySelector('.cart-button');
        cartButton.addEventListener('click', function() {
            openCheckoutModal();
        });
        
        function openCheckoutModal() {
            if (cartItems.length === 0) {
                showToast('Seu carrinho está vazio!', 'error');
                return;
            }
            
            const checkoutOverlay = document.createElement('div');
            checkoutOverlay.className = 'checkout-overlay';
            
            const checkoutContent = document.createElement('div');
            checkoutContent.className = 'checkout-content';
            
            const checkoutSteps = document.createElement('div');
            checkoutSteps.className = 'checkout-steps';
            checkoutSteps.innerHTML = `
                <div class="step active" title="Itens do pedido"></div>
                <div class="step" title="Informações de entrega"></div>
                <div class="step" title="Confirmação"></div>
            `;
            
            const checkoutHeader = document.createElement('div');
            checkoutHeader.className = 'checkout-header';
            checkoutHeader.innerHTML = `
                <h2>Finalizar Pedido</h2>
                <button class="checkout-close"><i class="fas fa-times"></i></button>
            `;
            
            const checkoutItems = document.createElement('div');
            checkoutItems.className = 'checkout-items';
            
            let total = 0;
            
            const groupedItems = {};
            cartItems.forEach(item => {
                if (groupedItems[item.name]) {
                    groupedItems[item.name].quantity++;
                } else {
                    groupedItems[item.name] = { ...item };
                }
            });
            
            Object.values(groupedItems).forEach(item => {
                const priceValue = parseFloat(item.price.replace('R$', '').replace(',', '.').trim());
                const itemTotal = priceValue * item.quantity;
                total += itemTotal;
                
                const itemElement = document.createElement('div');
                itemElement.className = 'checkout-item';
                itemElement.innerHTML = `
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <div class="item-controls">
                            <button class="quantity-btn minus" data-name="${item.name}"><i class="fas fa-minus"></i></button>
                            <span class="item-quantity">${item.quantity}</span>
                            <button class="quantity-btn plus" data-name="${item.name}"><i class="fas fa-plus"></i></button>
                        </div>
                    </div>
                    <div class="item-price">R$ ${itemTotal.toFixed(2).replace('.', ',')}</div>
                `;
                
                checkoutItems.appendChild(itemElement);
            });
            
            const customerForm = document.createElement('div');
            customerForm.className = 'customer-form';
            
            const hasSavedData = checkForSavedData();
            
            const savedDataHeader = hasSavedData ? `
                <div class="saved-data-container">
                    <button id="use-saved-data" class="use-saved-data-btn">
                        <i class="fas fa-user-check"></i> Usar dados da última compra
                    </button>
                </div>
            ` : '';
            
            customerForm.innerHTML = `
                ${savedDataHeader}
                <div class="form-group">
                    <label for="customer-name" class="required-field">Nome</label>
                    <input type="text" id="customer-name" placeholder="Seu nome" required>
                    <div class="error-message">Por favor, informe seu nome</div>
                </div>
                <div class="form-group">
                    <label for="customer-cep" class="required-field">CEP</label>
                    <div class="cep-container">
                        <input type="text" id="customer-cep" placeholder="00000-000" maxlength="9" required>
                        <button id="search-cep" class="search-cep-btn"><i class="fas fa-search"></i></button>
                    </div>
                    <small class="cep-status"></small>
                    <div class="error-message">Por favor, informe um CEP válido</div>
                </div>
                <div class="form-group">
                    <label for="customer-street" class="required-field">Rua</label>
                    <input type="text" id="customer-street" placeholder="Rua, Avenida, etc" required>
                    <div class="error-message">Por favor, informe sua rua</div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="customer-number" class="required-field">Número</label>
                        <input type="text" id="customer-number" placeholder="Número" required>
                        <div class="error-message">Por favor, informe o número</div>
                    </div>
                    <div class="form-group">
                        <label for="customer-complement">Complemento</label>
                        <input type="text" id="customer-complement" placeholder="Apto, Bloco, etc">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="customer-neighborhood" class="required-field">Bairro</label>
                        <input type="text" id="customer-neighborhood" placeholder="Bairro" required>
                        <div class="error-message">Por favor, informe seu bairro</div>
                    </div>
                    <div class="form-group">
                        <label for="customer-city" class="required-field">Cidade</label>
                        <input type="text" id="customer-city" placeholder="Cidade" required>
                        <div class="error-message">Por favor, informe sua cidade</div>
                    </div>
                </div>
                <div class="form-group delivery-fee-container" style="display: none;">
                    <div class="delivery-fee-info">
                        <span>Taxa de entrega:</span>
                        <span class="delivery-fee">R$ 0,00</span>
                    </div>
                </div>
                <div class="form-group">
                    <label for="payment-method" class="required-field">Forma de Pagamento</label>
                    <select id="payment-method" required>
                        <option value="">Selecione uma opção</option>
                        <option value="Dinheiro">Dinheiro</option>
                        <option value="Cartão de Crédito">Cartão de Crédito</option>
                        <option value="Cartão de Débito">Cartão de Débito</option>
                        <option value="PIX">PIX</option>
                    </select>
                    <div class="error-message">Por favor, selecione uma forma de pagamento</div>
                </div>
                <div class="form-group" id="change-group" style="display: none;">
                    <label for="change-amount">Troco para</label>
                    <input type="text" id="change-amount" placeholder="R$ 0,00">
                </div>
                <div class="form-group">
                    <label for="customer-notes">Observações</label>
                    <textarea id="customer-notes" placeholder="Alguma observação sobre seu pedido?"></textarea>
                </div>
            `;
            
            const checkoutFooter = document.createElement('div');
            checkoutFooter.className = 'checkout-footer';
            checkoutFooter.innerHTML = `
                <div class="checkout-total">
                    <span>Subtotal:</span>
                    <span class="subtotal-price">R$ ${total.toFixed(2).replace('.', ',')}</span>
                </div>
                <div class="checkout-total delivery-fee-row" style="display: none;">
                    <span>Taxa de entrega:</span>
                    <span class="delivery-fee-total">R$ 0,00</span>
                </div>
                <div class="checkout-total">
                    <span>Total:</span>
                    <span class="total-price">R$ ${total.toFixed(2).replace('.', ',')}</span>
                </div>
                <button class="checkout-button">Finalizar Pedido no WhatsApp</button>
            `;
            
            checkoutContent.appendChild(checkoutHeader);
            checkoutContent.appendChild(checkoutSteps);
            checkoutContent.appendChild(checkoutItems);
            checkoutContent.appendChild(customerForm);
            checkoutContent.appendChild(checkoutFooter);
            checkoutOverlay.appendChild(checkoutContent);
            document.body.appendChild(checkoutOverlay);
            
            setTimeout(() => {
                checkoutOverlay.classList.add('active');
            }, 10);
            
            const deliveryFees = {
                'itinga': 8.00,
                'centro': 8.00,
                'vida nova': 0.00,
            };
            const defaultDeliveryFee = 10.00; 
            const freeDeliveryMinimum = 0; 
            
            const cepInput = document.getElementById('customer-cep');
            const searchCepBtn = document.getElementById('search-cep');
            const cepStatus = document.querySelector('.cep-status');
            const streetInput = document.getElementById('customer-street');
            const neighborhoodInput = document.getElementById('customer-neighborhood');
            const cityInput = document.getElementById('customer-city');
            const deliveryFeeContainer = document.querySelector('.delivery-fee-container');
            const deliveryFeeInfo = document.querySelector('.delivery-fee');
            const deliveryFeeRow = document.querySelector('.delivery-fee-row');
            const deliveryFeeTotal = document.querySelector('.delivery-fee-total');
            const subtotalPrice = document.querySelector('.subtotal-price');
            const totalPrice = document.querySelector('.total-price');
            
            let deliveryFee = 0;
            
            cepInput.addEventListener('input', function() {
                let value = this.value.replace(/\D/g, '');
                if (value.length > 5) {
                    value = value.slice(0, 5) + '-' + value.slice(5, 8);
                }
                this.value = value;
            });
            
            function searchCEP() {
                const cep = cepInput.value.replace(/\D/g, '');
                
                if (cep.length !== 8) {
                    cepStatus.textContent = 'CEP inválido. Digite um CEP com 8 números.';
                    cepStatus.style.color = 'red';
                    return;
                }
                
                cepStatus.innerHTML = '<span class="loading-spinner"></span> Buscando CEP...';
                cepStatus.style.color = 'blue';
                
                const formInputs = document.querySelectorAll('.customer-form input, .customer-form select');
                formInputs.forEach(input => input.disabled = true);
                
                fetch(`https://viacep.com.br/ws/${cep}/json/`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Falha na conexão com o serviço de CEP');
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data.erro) {
                            throw new Error('CEP não encontrado');
                        }
                        
                        streetInput.value = data.logradouro || '';
                        neighborhoodInput.value = data.bairro || '';
                        cityInput.value = data.localidade || '';
                        
                        cepStatus.textContent = 'CEP encontrado!';
                        cepStatus.style.color = 'green';
                        
                        calculateDeliveryFee();
                    })
                    .catch(error => {
                        console.error('Erro na busca de CEP:', error);
                        cepStatus.textContent = error.message || 'Erro ao buscar CEP. Tente novamente.';
                        cepStatus.style.color = 'red';
                    })
                    .finally(() => {
                        formInputs.forEach(input => input.disabled = false);
                    });
            }
            
            searchCepBtn.addEventListener('click', searchCEP);
            
            cepInput.addEventListener('keyup', function(e) {
                if (e.key === 'Enter' && this.value.length >= 8) {
                    searchCEP();
                }
            });
            
            neighborhoodInput.addEventListener('change', calculateDeliveryFee);
            
            function calculateDeliveryFee() {
                const neighborhood = neighborhoodInput.value.toLowerCase().trim();
                
                deliveryFee = defaultDeliveryFee; 
                
                for (const [key, fee] of Object.entries(deliveryFees)) {
                    if (neighborhood.includes(key)) {
                        deliveryFee = fee;
                        break;
                    }
                }
                
                if (freeDeliveryMinimum > 0 && parseFloat(subtotalPrice.textContent.replace('R$', '').replace(',', '.').trim()) >= freeDeliveryMinimum) {
                    deliveryFee = 0;
                }
                
                deliveryFeeInfo.textContent = `R$ ${deliveryFee.toFixed(2).replace('.', ',')}`;
                deliveryFeeTotal.textContent = `R$ ${deliveryFee.toFixed(2).replace('.', ',')}`;
                
                // Clear and reset the delivery fee container before adding content
                deliveryFeeContainer.innerHTML = '';
                
                if (deliveryFee > 0) {
                    deliveryFeeContainer.innerHTML = `
                        <div class="delivery-fee-info">
                            <span>Taxa de entrega:</span>
                            <span class="delivery-fee">R$ ${deliveryFee.toFixed(2).replace('.', ',')}</span>
                        </div>`;
                    deliveryFeeRow.style.display = 'flex';
                } else {
                    deliveryFeeContainer.innerHTML = `<div class="delivery-fee-info free-delivery">🚚 Entrega Grátis! 🎉</div>`;
                    deliveryFeeRow.style.display = 'none';
                }
                
                updateTotal();
            }
            
            function updateTotal() {
                const subtotal = parseFloat(subtotalPrice.textContent.replace('R$', '').replace(',', '.').trim());
                const total = subtotal + deliveryFee;
                totalPrice.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
            }
            
            const paymentMethod = document.getElementById('payment-method');
            const changeGroup = document.getElementById('change-group');
            
            paymentMethod.addEventListener('change', function() {
                if (this.value === 'Dinheiro') {
                    changeGroup.style.display = 'block';
                } else {
                    changeGroup.style.display = 'none';
                }
            });
            
            const closeButton = document.querySelector('.checkout-close');
            closeButton.addEventListener('click', function() {
                checkoutOverlay.classList.remove('active');
                setTimeout(() => {
                    document.body.removeChild(checkoutOverlay);
                }, 300);
            });
            
            if (hasSavedData) {
                const useSavedDataBtn = document.getElementById('use-saved-data');
                useSavedDataBtn.addEventListener('click', function() {
                    loadSavedCustomerData();
                    this.disabled = true;
                    this.innerHTML = '<i class="fas fa-check"></i> Dados carregados';
                    this.classList.add('data-loaded');
                    
                    showToast('Dados carregados com sucesso!', 'success');
                    
                    setTimeout(() => {
                        if (typeof calculateDeliveryFee === 'function') {
                            calculateDeliveryFee();
                        }
                    }, 100);
                });
            }
            
            const minusButtons = document.querySelectorAll('.quantity-btn.minus');
            const plusButtons = document.querySelectorAll('.quantity-btn.plus');
            
            minusButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const itemName = this.getAttribute('data-name');
                    const item = Object.values(groupedItems).find(i => i.name === itemName);
                    if (item && item.quantity > 1) {
                        item.quantity--;
                        updateCheckout(groupedItems);
                    }
                });
            });
            
            plusButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const itemName = this.getAttribute('data-name');
                    const item = Object.values(groupedItems).find(i => i.name === itemName);
                    if (item) {
                        item.quantity++;
                        updateCheckout(groupedItems);
                    }
                });
            });
            
            const checkoutButton = document.querySelector('.checkout-button');
            checkoutButton.addEventListener('click', function() {
                const customerName = document.getElementById('customer-name');
                const customerCep = document.getElementById('customer-cep');
                const customerStreet = document.getElementById('customer-street');
                const customerNumber = document.getElementById('customer-number');
                const customerComplement = document.getElementById('customer-complement').value.trim();
                const customerNeighborhood = document.getElementById('customer-neighborhood');
                const customerCity = document.getElementById('customer-city');
                const paymentMethod = document.getElementById('payment-method');
                const changeAmount = document.getElementById('change-amount').value.trim();
                const customerNotes = document.getElementById('customer-notes').value.trim();
                
                const formGroups = document.querySelectorAll('.form-group');
                formGroups.forEach(group => group.classList.remove('error'));
                
                let isValid = true;
                let firstInvalidField = null;
                
                const requiredFields = [
                    { element: customerName, group: customerName.closest('.form-group') },
                    { element: customerCep, group: customerCep.closest('.form-group') },
                    { element: customerStreet, group: customerStreet.closest('.form-group') },
                    { element: customerNumber, group: customerNumber.closest('.form-group') },
                    { element: customerNeighborhood, group: customerNeighborhood.closest('.form-group') },
                    { element: customerCity, group: customerCity.closest('.form-group') },
                    { element: paymentMethod, group: paymentMethod.closest('.form-group') }
                ];
                
                requiredFields.forEach(field => {
                    if (!field.element.value.trim()) {
                        isValid = false;
                        field.group.classList.add('error');
                        
                        if (!firstInvalidField) {
                            firstInvalidField = field.element;
                        }
                    }
                });
                
                if (!isValid) {
                    showToast('Por favor, preencha todos os campos obrigatórios', 'error');
                    
                    firstInvalidField.focus();
                    firstInvalidField.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                    
                    firstInvalidField.classList.add('highlight-field');
                    setTimeout(() => {
                        firstInvalidField.classList.remove('highlight-field');
                    }, 1500);
                    
                    return;
                }
                
                this.innerHTML = '<span class="loading-spinner"></span> Processando...';
                this.disabled = true;
                
                setTimeout(() => {
                    saveCustomerData();
                    
                    const customerAddressValue = `${customerStreet.value.trim()}, ${customerNumber.value.trim()}${customerComplement ? ', ' + customerComplement : ''}, ${customerNeighborhood.value.trim()}, ${customerCity.value.trim()}`;
                    
                    let message = `*NOVO PEDIDO - Dogão do Canela Fina*\n\n`;
                    message += `*Cliente:* ${customerName.value.trim()}\n`;
                    message += `*Endereço:* ${customerAddressValue}\n`;
                    message += `*Forma de Pagamento:* ${paymentMethod.value}\n`;
                    
                    if (paymentMethod.value === 'Dinheiro' && changeAmount) {
                        message += `*Troco para:* ${changeAmount}\n`;
                    }
                    
                    message += `\n*ITENS DO PEDIDO:*\n`;
                    let subtotal = 0;
                    
                    Object.values(groupedItems).forEach(item => {
                        const priceValue = parseFloat(item.price.replace('R$', '').replace(',', '.').trim());
                        const itemTotal = priceValue * item.quantity;
                        subtotal += itemTotal;
                        
                        message += `• ${item.quantity}x ${item.name} - R$ ${itemTotal.toFixed(2).replace('.', ',')}\n`;
                    });
                    
                    message += `\n*Subtotal:* R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
                    message += `*Taxa de Entrega:* R$ ${deliveryFee.toFixed(2).replace('.', ',')}\n`;
                    message += `*Total do Pedido:* R$ ${(subtotal + deliveryFee).toFixed(2).replace('.', ',')}\n`;
                    
                    if (customerNotes) {
                        message += `\n*Observações:*\n${customerNotes}\n`;
                    }
                    
                    const encodedMessage = encodeURIComponent(message);
                    const whatsappUrl = `https://wa.me/5571996447078?text=${encodedMessage}`;
                    
                    window.open(whatsappUrl, '_blank');
                    
                    cartItems = [];
                    cartCount = 0;
                    cartCountElement.textContent = '0';
                    
                    checkoutOverlay.classList.remove('active');
                    setTimeout(() => {
                        document.body.removeChild(checkoutOverlay);
                    }, 300);
                    
                    showToast('Pedido enviado com sucesso! Abrindo WhatsApp...', 'success', 4000);
                    
                    this.innerHTML = 'Finalizar Pedido no WhatsApp';
                    this.disabled = false;
                }, 800);
            });
            
            function updateCheckout(items) {
                const quantityElements = document.querySelectorAll('.item-quantity');
                const priceElements = document.querySelectorAll('.item-price');
                const subtotalElement = document.querySelector('.subtotal-price');
                
                let newSubtotal = 0;
                let index = 0;
                
                Object.values(items).forEach(item => {
                    const priceValue = parseFloat(item.price.replace('R$', '').replace(',', '.').trim());
                    const itemTotal = priceValue * item.quantity;
                    newSubtotal += itemTotal;
                    
                    quantityElements[index].textContent = item.quantity;
                    priceElements[index].textContent = `R$ ${itemTotal.toFixed(2).replace('.', ',')}`;
                    
                    index++;
                });
                
                subtotalElement.textContent = `R$ ${newSubtotal.toFixed(2).replace('.', ',')}`;
                
                updateTotal();
                
                cartItems = [];
                Object.values(items).forEach(item => {
                    for (let i = 0; i < item.quantity; i++) {
                        cartItems.push({ name: item.name, price: item.price, quantity: 1 });
                    }
                });
                
                cartCount = cartItems.length;
                cartCountElement.textContent = cartCount;
            }
        }
        
        function saveCustomerData() {
            const customerData = {
                name: document.getElementById('customer-name').value,
                cep: document.getElementById('customer-cep').value,
                street: document.getElementById('customer-street').value,
                number: document.getElementById('customer-number').value,
                complement: document.getElementById('customer-complement').value,
                neighborhood: document.getElementById('customer-neighborhood').value,
                city: document.getElementById('customer-city').value,
                paymentMethod: document.getElementById('payment-method').value,
                timestamp: new Date().getTime()
            };
            
            localStorage.setItem('canela_fina_customer_data', JSON.stringify(customerData));
        }
        
        function checkForSavedData() {
            const savedData = localStorage.getItem('canela_fina_customer_data');
            return savedData !== null;
        }
        
        function loadSavedCustomerData() {
            const savedData = localStorage.getItem('canela_fina_customer_data');
            if (savedData) {
                const customerData = JSON.parse(savedData);
                
                document.getElementById('customer-name').value = customerData.name || '';
                document.getElementById('customer-cep').value = customerData.cep || '';
                document.getElementById('customer-street').value = customerData.street || '';
                document.getElementById('customer-number').value = customerData.number || '';
                document.getElementById('customer-complement').value = customerData.complement || '';
                document.getElementById('customer-neighborhood').value = customerData.neighborhood || '';
                document.getElementById('customer-city').value = customerData.city || '';
                
                const paymentSelect = document.getElementById('payment-method');
                if (customerData.paymentMethod && paymentSelect) {
                    paymentSelect.value = customerData.paymentMethod;
                    
                    const event = new Event('change');
                    paymentSelect.dispatchEvent(event);
                }
            }
        }
    }
});