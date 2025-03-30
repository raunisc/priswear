// Configuration file for easy customization

const config = {
    // Restaurant information
    restaurant: {
        name: "Dogão do Canela Fina",
        slogan: "O melhor sabor na cidade!",
        phone: "5571996447078", // Format with country code for WhatsApp
        openingHours: "Terça a Domingo das 18h às 23h"
    },
    
    // Color scheme
    colors: {
        primary: "#8B0000",
        primaryLight: "#C41E3A",
        secondary: "#FFD700",
        success: "#2E8B57",
        warning: "#FF8C00",
        error: "#D32F2F"
    },
    
    // Delivery fees by neighborhood (all lowercase for easy comparison)
    deliveryFees: {
        'itinga': 18.00,
        'centro': 18.00,
        'vida nova': 0.00,
        'paralela': 10.00,
        'mussurunga': 20.00,
        'piatã': 12.00,
        // Add more neighborhoods here
    },
    
    // Default delivery fee if neighborhood not found
    defaultDeliveryFee: 10.00,
    
    // Minimum order value for free delivery (set to 0 to disable)
    freeDeliveryMinimum: 50.00,
    
    // Toast notification duration in milliseconds
    toastDuration: 3000,
    
    // Admin credentials
    admin: {
        username: "admin",
        password: "canelafina123"
    },
    
    // Menu categories
    categories: [
        { id: "lanches", name: "Lanches", icon: "fas fa-hotdog" },
        { id: "acompanhamentos", name: "Acompanhamentos", icon: "fas fa-french-fries" },
        { id: "bebidas", name: "Bebidas", icon: "fas fa-glass-whiskey" },
        { id: "combos", name: "Combos", icon: "fas fa-hamburger" }
    ]
};

export default config;