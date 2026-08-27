/* ==========================================================================
   K.K. Knitwear Club - product database
   --------------------------------------------------------------------------
   This is the ONLY file to edit when adding, changing or removing a product.

   Every value in `specs` is copied VERBATIM from the manufacturer's own
   published listing. Nothing here is invented, corrected or estimated.
   Filterable values (GSM numbers, width in inches, applications) are NOT
   stored here - they are derived from `specs` at runtime by js/normalize.js,
   so the published text stays the single source of truth.

   Product fields
   --------------
   id          slug used in the URL, e.g. product.html?id=sap-matty-fabric
   name        display name, kept as the manufacturer wrote it
   categories  one or more keys from CATEGORIES below
   source      the original category page this listing came from
   images      1-2 photos, first one is used on cards
   priceValue  number, or null when the site says "Get Latest Price"
   priceUnit   "Kg" or "Meter" - never compare across different units
   moq         minimum order quantity, verbatim, or null when not published
   specs       the full published specification table, verbatim
   description product-specific text from the site, or null.
               Generic company boilerplate is deliberately left out.
   ========================================================================== */

/* `short` is the compact label used on product cards, where the full name
   would wrap onto two lines. */
var CATEGORIES = [
    {
        key: "sportswear",
        name: "Sportswear & Activewear Fabrics",
        short: "Sportswear",
        blurb: "Dot, dri-fit and rim zim knits built for sports and active garments."
    },
    {
        key: "knitted",
        name: "Knitted & Dot Knit Fabrics",
        short: "Knitted & Dot Knit",
        blurb: "The core polyester knitted range - matty, nirmal, rice knit, foma and plain knits."
    },
    {
        key: "lower",
        name: "Lower, Track Suit & Bon Patti",
        short: "Lower & Bon Patti",
        blurb: "Bon patti and interlock trims used in lowers, track suits and pyjamas."
    },
    {
        key: "tshirt",
        name: "T-Shirt & Polo Fabrics",
        short: "T-Shirt & Polo",
        blurb: "Polo matty, micro PP and dot knit fabrics for t-shirts and school house shirts."
    },
    {
        key: "lining",
        name: "Lining, Blanket & Sweater Fabrics",
        short: "Lining & Blanket",
        blurb: "Astar and lining cloth for baby blankets, jackets and sweaters."
    },
    {
        key: "burkha",
        name: "Burkha & Dress Fabrics",
        short: "Burkha & Dress",
        blurb: "Chamki, chandani and bright polyester fabrics used for burkha and dress material."
    },
    {
        key: "home",
        name: "Home Furnishing, Tent & Cover Fabrics",
        short: "Home & Covers",
        blurb: "Pillow cover, chair cover, tent and mesh curtain fabrics."
    },
    {
        key: "surplus",
        name: "Surplus & Stock Lot",
        short: "Surplus",
        blurb: "Surplus polyester fabric available at stock-lot rates."
    }
];

var PRODUCTS = [

    /* ---------- Polyester Fabric (source category) ---------- */

    {
        id: "sap-matty-fabric",
        name: "SAP Matty Fabric",
        categories: ["knitted"],
        source: "Polyester Fabric",
        images: ["sap-matty-fabric-1.jpg", "sap-matty-fabric-2.jpg"],
        priceValue: 210,
        priceUnit: "Kg",
        moq: "200 Kg",
        specs: {
            "Minimum Order Quantity": "200 Kg",
            "Fabric": "Polyester",
            "Usage/Application": "Garments",
            "Color": "Blue",
            "Design/Pattern": "Sap Matty With Caller Tape is available",
            "Width": "42 inches /Customised",
            "Brand": "K K Knitwear club",
            "Wash Care": "Machine wash",
            "Packaging Type": "Rolls",
            "Country of Origin": "Made in India"
        },
        description: null
    },
    {
        id: "polyester-fabric",
        name: "Polyester Fabric",
        categories: ["knitted"],
        source: "Polyester Fabric",
        images: ["polyester-fabric-1.jpeg", "polyester-fabric-2.jpg"],
        priceValue: 185,
        priceUnit: "Kg",
        moq: "200 Kg",
        specs: {
            "Minimum Order Quantity": "200 Kg",
            "Pattern Type": "Plain",
            "Type": "Knitted",
            "Prints/Pattern": "Plain/Solid",
            "Width": "44 inches",
            "GSM": "150",
            "Usage/Application": "Shirts",
            "Color": "Multicolor",
            "Usage/ Application": "Garments",
            "Fabric Color": "On Order",
            "Fabric Material": "Polyester",
            "Fabric GSM": "130 GSM"
        },
        description: null
    },
    {
        id: "120-gsm-polyester-black-fabric",
        name: "120 GSM Polyester Black Fabric",
        categories: ["knitted"],
        source: "Polyester Fabric",
        images: ["120-gsm-polyester-black-fabric-1.jpg", "120-gsm-polyester-black-fabric-2.jpg"],
        priceValue: 185,
        priceUnit: "Kg",
        moq: "200 Kg",
        specs: {
            "Minimum Order Quantity": "200 Kg",
            "GSM": "120 GSM",
            "Material": "Polyester",
            "Prints/Pattern": "Plain / Solids",
            "Width": "36 Inches/90 cm",
            "Color": "Black",
            "Usage": "Apparel/Clothing"
        },
        description: null
    },
    {
        id: "200-gsm-dot-grindal-fabric",
        name: "200 GSM Dot Grindal Fabric",
        categories: ["sportswear"],
        source: "Polyester Fabric",
        images: ["200-gsm-dot-grindal-fabric-1.jpg", "200-gsm-dot-grindal-fabric-2.jpg"],
        priceValue: 190,
        priceUnit: "Kg",
        moq: "100 Kg",
        specs: {
            "Minimum Order Quantity": "100 Kg",
            "Material": "Polyester",
            "Color": "Multicolour",
            "Prints/Pattern": "Plain/Solids",
            "Usage": "Apparel/Clothing",
            "GSM": "200"
        },
        description: null
    },
    {
        id: "sportswear-polyester-fabric",
        name: "Sportswear Polyester Fabric",
        categories: ["sportswear"],
        source: "Polyester Fabric",
        images: ["sportswear-polyester-fabric-1.jpeg", "sportswear-polyester-fabric-2.jpg"],
        priceValue: 190,
        priceUnit: "Kg",
        moq: "200 Kg",
        specs: {
            "Minimum Order Quantity": "200 Kg",
            "Material": "Polyester",
            "Width": "42 Inches/ 107 cm",
            "Pattern / Design": "Polka Dots",
            "Pattern Type": "Plain",
            "Fabric Usage": "Sports Pazzama or Shirts",
            "Fabric Color": "Black & Colour Dots MANY COLOURS",
            "Products GSM": "190GSM"
        },
        description: null
    },
    {
        id: "170-gsm-polyester-spun-terry-fabric",
        name: "170 GSM Polyester Spun Terry Fabric",
        categories: ["knitted"],
        source: "Polyester Fabric",
        images: ["170-gsm-polyester-spun-terry-fabric-1.jpg", "170-gsm-polyester-spun-terry-fabric-2.jpg"],
        priceValue: 200,
        priceUnit: "Kg",
        moq: "200 Kg",
        specs: {
            "Minimum Order Quantity": "200 Kg",
            "Material": "Knitted",
            "GSM": "120 to 250 GSM",
            "Design/Pattern": "Plain",
            "Fabric Type": "polyester",
            "Prints/Pattern": "Plain/Solids",
            "Color": "COLOR ON ORDER",
            "Usage/Application": "Garments"
        },
        description: null
    },
    {
        id: "pillow-cover-fabric-100-gsm",
        name: "Pillow Cover Fabric",
        categories: ["home"],
        source: "Polyester Fabric",
        images: ["pillow-cover-fabric-100-gsm-1.jpg", "pillow-cover-fabric-100-gsm-2.jpg"],
        priceValue: 175,
        priceUnit: "Kg",
        moq: "200 Kg",
        specs: {
            "Minimum Order Quantity": "200 Kg",
            "Fabric": "Polyester",
            "Pattern": "Striped",
            "GSM": "100",
            "Color": "White",
            "Weight": "20kg roll"
        },
        description: null
    },
    {
        id: "micro-plain-polyester-knitted-fabric",
        name: "Micro Plain Polyester Knitted Fabric",
        categories: ["knitted"],
        source: "Polyester Fabric",
        images: ["micro-plain-polyester-knitted-fabric-1.jpg", "micro-plain-polyester-knitted-fabric-2.jpg"],
        priceValue: 210,
        priceUnit: "Meter",
        moq: "100 Meter",
        specs: {
            "Minimum Order Quantity": "100 Meter",
            "GSM": "150",
            "Pattern": "Plain",
            "Color": "White",
            "Fabrics Material": "Micro",
            "Usage/ Application": "Garments shirts"
        },
        description: null
    },
    {
        id: "chair-cover-polyester-fabric",
        name: "Chair Cover Polyester Fabric",
        categories: ["home"],
        source: "Polyester Fabric",
        images: ["chair-cover-polyester-fabric-1.jpeg", "chair-cover-polyester-fabric-2.jpg"],
        priceValue: 210,
        priceUnit: "Meter",
        moq: "200 Meter",
        specs: {
            "Minimum Order Quantity": "200 Meter",
            "Type": "Cover Fabric",
            "Color": "Red (Base)",
            "Fabric": "Polyester",
            "Usage/Application": "For Chair Covering",
            "Pattern": "Printed",
            "Products GSM": "200"
        },
        description: null
    },
    {
        id: "polyester-knitted-fabric-140-160-gsm",
        name: "Polyester Knitted Fabric",
        categories: ["knitted"],
        source: "Polyester Fabric",
        images: ["polyester-knitted-fabric-140-160-gsm-1.jpg", "polyester-knitted-fabric-140-160-gsm-2.jpg"],
        priceValue: 195,
        priceUnit: "Meter",
        moq: "200 Meter",
        specs: {
            "Minimum Order Quantity": "200 Meter",
            "Material": "Polyester",
            "Prints/Pattern": "Plain / Solids",
            "GSM": "140 to 160GSM",
            "Usage": "Apparel/Clothing"
        },
        description: null
    },
    {
        id: "polyester-knitted-fabric-130-gsm",
        name: "Polyester Knitted Fabric",
        categories: ["knitted"],
        source: "Polyester Fabric",
        images: ["polyester-knitted-fabric-130-gsm-1.jpg", "polyester-knitted-fabric-130-gsm-2.jpg"],
        priceValue: 195,
        priceUnit: "Meter",
        moq: "200 Meter",
        specs: {
            "Minimum Order Quantity": "200 Meter",
            "Material": "Polyester",
            "Prints/Pattern": "Plain / Solids",
            "GSM": "130GSM",
            "Color": "Blue",
            "Usage": "Shirts/Trousers/Suits/Coats/Jackets, Lining, Industrial Use, Bags, Apparel/Clothing, Ethnic Wear/Dresses"
        },
        description: null
    },
    {
        id: "sportswear-black-dot-polyester-fabric",
        name: "Sportswear Black DOT Polyester Fabric",
        categories: ["sportswear"],
        source: "Polyester Fabric",
        images: ["sportswear-black-dot-polyester-fabric-1.webp", "sportswear-black-dot-polyester-fabric-2.jpg"],
        priceValue: 195,
        priceUnit: "Kg",
        moq: "200 Kg",
        specs: {
            "Minimum Order Quantity": "200 Kg",
            "Material": "Polyester",
            "Width": "42 Inches/ 107 cm",
            "Pattern / Design": "Polka Dots",
            "Fabric Usage": "Sportswear Usage",
            "Fabric Color": "Black (Base)",
            "Fabric GSM": "80"
        },
        description: null
    },
    {
        id: "160-gsm-orange-polyester-fabric",
        name: "160 GSM Orange Polyester Fabric",
        categories: ["knitted"],
        source: "Polyester Fabric",
        images: ["160-gsm-orange-polyester-fabric-1.webp", "160-gsm-orange-polyester-fabric-2.jpg"],
        priceValue: 200,
        priceUnit: "Meter",
        moq: "200 Meter",
        specs: {
            "Minimum Order Quantity": "200 Meter",
            "Usage/Application": "Garments",
            "Color": "Orange",
            "Products GSM": "160 GSM",
            "Fabrics Material": "Polyester",
            "Usage And Application": "Textiles Industries"
        },
        description: null
    },
    {
        id: "polyester-sportswear-fabrics",
        name: "Polyester Sportswear Fabrics",
        categories: ["sportswear"],
        source: "Polyester Fabric",
        images: ["polyester-sportswear-fabrics-1.jpg", "polyester-sportswear-fabrics-2.jpg"],
        priceValue: 185,
        priceUnit: "Kg",
        moq: "100 Kg",
        specs: {
            "Minimum Order Quantity": "100 Kg",
            "Material": "Polyester",
            "Type": "Dri-Fit",
            "Width": "42 inches",
            "GSM": "200",
            "Prints/Pattern": "Plain"
        },
        description: null
    },
    {
        id: "tent-house-check-fabric",
        name: "Tent House Check Fabric",
        categories: ["home"],
        source: "Polyester Fabric",
        images: ["tent-house-check-fabric-1.jpeg", "tent-house-check-fabric-2.jpg"],
        priceValue: null,
        priceUnit: null,
        moq: null,
        specs: {
            "Usage/Application": "Use For Tent & Table and chair cover",
            "Color": "Black (Base) and colour",
            "Pattern": "Check Pattern",
            "Fabric": "Polyester",
            "GSM": "110"
        },
        description: null
    },
    {
        id: "bright-fabrics-for-burkha",
        name: "Bright Fabrics for Burkha",
        categories: ["burkha"],
        source: "Polyester Fabric",
        images: ["bright-fabrics-for-bhurka-1.jpg", "bright-fabrics-for-bhurka-2.jpeg"],
        priceValue: 200,
        priceUnit: "Kg",
        moq: "100 Kg",
        specs: {
            "Minimum Order Quantity": "100 Kg",
            "Fabric": "Polyester",
            "Material": "Polyester",
            "Usage/Application": "Burkha",
            "Width": "42 Inches/ 107 cm",
            "Pattern Type": "Plain",
            "Prints/Pattern": "Plain/Solid",
            "GSM": "100-150",
            "Composition": "100% Polyester",
            "Do You Fulfill Sample Orders": "Yes"
        },
        description: null
    },
    {
        id: "140-gsm-plain-polyester-fabric",
        name: "140 GSM Plain Polyester Fabric",
        categories: ["knitted"],
        source: "Polyester Fabric",
        images: ["140-gsm-plain-polyester-fabric-1.jpeg", "140-gsm-plain-polyester-fabric-2.jpg"],
        priceValue: 180,
        priceUnit: "Kg",
        moq: "200 Kg",
        specs: {
            "Minimum Order Quantity": "200 Kg",
            "GSM": "140 GSM",
            "Width": "36 Inches/90 cm",
            "Material": "Polyester",
            "Prints/Pattern": "Plain / Solids",
            "Color": "Blue",
            "Usage": "Apparel/Clothing",
            "Fabric Content": "100% Polyester"
        },
        description: null
    },
    {
        id: "180-gsm-plain-polyester-fabric",
        name: "180 GSM Plain Polyester Fabric",
        categories: ["knitted"],
        source: "Polyester Fabric",
        images: ["180-gsm-plain-polyester-fabric-1.webp", "180-gsm-plain-polyester-fabric-2.jpeg"],
        priceValue: 180,
        priceUnit: "Kg",
        moq: "200 Kg",
        specs: {
            "Minimum Order Quantity": "200 Kg",
            "GSM": "180 GSM",
            "Width": "31 Inches/78 cm",
            "Material": "Polyester",
            "Prints/Pattern": "Plain / Solids",
            "Color": "Blue",
            "Usage": "Apparel/Clothing"
        },
        description: null
    },
    {
        id: "chamki-tent-fabric",
        name: "Chamki Tent Fabric",
        categories: ["home"],
        source: "Polyester Fabric",
        images: ["chamki-tent-fabric-1.webp", "chamki-tent-fabric-2.webp"],
        priceValue: 185,
        priceUnit: "Kg",
        moq: "100 Kg",
        specs: {
            "Minimum Order Quantity": "100 Kg",
            "Width": "on demand",
            "Usage/Application": "Use For Tent",
            "Pattern": "Plain",
            "Fabric": "bright lycra Polyester",
            "Packaging Type": "25 kg per roll",
            "GSM": "100"
        },
        description: null
    },
    {
        id: "polyester-chandani-burkha-fabric",
        name: "Polyester Chandani Burkha Fabric 58 & 68 Inch Export Quality",
        categories: ["burkha"],
        source: "Polyester Fabric",
        images: ["polyester-chandani-burkha-fabric-1.jpeg", "polyester-chandani-burkha-fabric-2.jpg"],
        priceValue: 200,
        priceUnit: "Kg",
        moq: "100 Kg",
        specs: {
            "Minimum Order Quantity": "100 Kg",
            "Fabric": "Polyester",
            "Width": "42 Inches/ 107 cm",
            "GSM": "100-150",
            "Usage/Application": "Burkha",
            "Pattern Type": "Plain",
            "Do You Fulfill Sample Orders": "Yes"
        },
        description: null
    },
    {
        id: "chamki-fabrics-for-burkha",
        name: "Chamki Fabrics for Burkha",
        categories: ["burkha"],
        source: "Polyester Fabric",
        images: ["chamki-fabrics-for-burka-1.jpeg"],
        priceValue: 200,
        priceUnit: "Kg",
        moq: "100 Kg",
        specs: {
            "Minimum Order Quantity": "100 Kg",
            "GSM": "100",
            "Width": "60 inches",
            "Composition": "100% Polyester",
            "Usage/Application": "Burkha",
            "Type": "Dot Knit",
            "Pattern Type": "Plain",
            "Prints/Pattern": "Plain/Solid",
            "Design/Pattern": "Plain",
            "Do You Fulfill Sample Orders": "No",
            "Packaging Type": "Than"
        },
        description: null
    },

    /* ---------- Knitted Fabric (source category) ---------- */

    {
        id: "lining-fabric-for-baby-blankets",
        name: "Lining Fabric For Baby Blankets",
        categories: ["lining"],
        source: "Knitted Fabric",
        images: ["lining-fabric-for-baby-blankets-1.jpg", "lining-fabric-for-baby-blankets-2.jpg"],
        priceValue: 155,
        priceUnit: "Kg",
        moq: null,
        specs: {
            "Material": "Polyester",
            "Weave": "Plain",
            "Color": "White",
            "Pattern": "Plain",
            "GSM": "160 GSM",
            "Usage": "Suit Lining",
            "Packaging Type": "Roll"
        },
        description: "Astar fabric (lining cloth) for baby blankets is a lightweight, breathable, and highly absorbent textile used to construct soft inner layers."
    },
    {
        id: "polyester-foma-fabric-211-240-gsm",
        name: "Polyester Foma Fabric",
        categories: ["knitted"],
        source: "Knitted Fabric",
        images: ["polyester-foma-fabric-211-240-gsm-1.jpg", "polyester-foma-fabric-211-240-gsm-2.jpg"],
        priceValue: 170,
        priceUnit: "Kg",
        moq: "200 Kg",
        specs: {
            "Minimum Order Quantity": "200 Kg",
            "Material": "Polyester",
            "Use": "hoddie, Trouser",
            "Finish": "Easy Care",
            "Weave": "Plain",
            "GSM": "211–240 GSM",
            "Pattern Type": "Plain"
        },
        description: null
    },
    {
        id: "nirmal-knit-fabric",
        name: "Nirmal Knit Fabric",
        categories: ["knitted"],
        source: "Knitted Fabric",
        images: ["nirmal-knit-fabric-1.jpg", "nirmal-knit-fabric-2.jpg"],
        priceValue: 210,
        priceUnit: "Kg",
        moq: "200 Kg",
        specs: {
            "Minimum Order Quantity": "200 Kg",
            "Color": "White",
            "Usage/Application": "Garments",
            "Design/Pattern": "Plain",
            "Fabric GSM": "200"
        },
        description: null
    },
    {
        id: "plain-knit-fabric",
        name: "Plain Knit Fabric",
        categories: ["knitted"],
        source: "Knitted Fabric",
        images: ["plain-knit-fabric-1.jpg", "plain-knit-fabric-2.jpg"],
        priceValue: 210,
        priceUnit: "Kg",
        moq: "200 Kg",
        specs: {
            "Minimum Order Quantity": "200 Kg",
            "Color": "Blue",
            "Prints/Pattern": "Plain/Solids",
            "Usage": "Apparel/Clothing",
            "Fabric Usage": "Garments",
            "GSM": "220",
            "Fabric Type": "Knitted Fabrics"
        },
        description: null
    },
    {
        id: "honeycomb-knitted-fabrics",
        name: "Honeycomb Knitted Fabrics",
        categories: ["knitted"],
        source: "Knitted Fabric",
        images: ["honeycomb-knitted-fabrics-1.webp", "honeycomb-knitted-fabrics-2.jpeg"],
        priceValue: 190,
        priceUnit: "Meter",
        moq: "100 Meter",
        specs: {
            "Minimum Order Quantity": "100 Meter",
            "Material": "100% Polyester",
            "GSM": "150-200",
            "Usage/Application": "Garments",
            "Color": "All",
            "Design/Pattern": "Rice knit",
            "Fabric Material": "polyester",
            "Products GSM": "200"
        },
        description: null
    },
    {
        id: "polyester-knitted-fabric-poly-cotton",
        name: "Polyester Knitted Fabric",
        categories: ["knitted"],
        source: "Knitted Fabric",
        images: ["polyester-knitted-fabric-poly-cotton-1.jpg", "polyester-knitted-fabric-poly-cotton-2.jpg"],
        priceValue: 180,
        priceUnit: "Kg",
        moq: null,
        specs: {
            "Fabric Material": "PC (Poly-Cotton)",
            "Fabric Width": "custom",
            "GSM": "custom",
            "Color": "Multicolor",
            "Usage": "Night Suits, Lowers / Trackpants, Sportswear, T-shirts"
        },
        description: null
    },
    {
        id: "discat-dot-fabrics",
        name: "Discat Dot Fabrics",
        categories: ["sportswear"],
        source: "Knitted Fabric",
        images: ["discat-dot-fabrics-1.jpg"],
        priceValue: 190,
        priceUnit: "Kg",
        moq: "100 Kg",
        specs: {
            "Minimum Order Quantity": "100 Kg",
            "Fabric Type": "Polyester",
            "Color": "Gray",
            "Prints/Pattern": "Plain/Solids",
            "Usage": "Apparel/Clothing",
            "Country of Origin": "Made in India"
        },
        description: null
    },
    {
        id: "rim-zim-fabric",
        name: "Rim Zim Fabric",
        categories: ["sportswear"],
        source: "Knitted Fabric",
        images: ["rim-zim-fabric-1.jpeg"],
        priceValue: 190,
        priceUnit: "Kg",
        moq: "100 Kg",
        specs: {
            "Minimum Order Quantity": "100 Kg",
            "Fabric": "Polyester",
            "GSM": "150-200",
            "Material": "Polyester",
            "Usage/Application": "Garments",
            "Width(In Inches)": "44-45",
            "Country of Origin": "Made in India"
        },
        description: null
    },

    /* ---------- Sportswear Fabric (source category) ---------- */

    {
        id: "rim-zim-doted-knitted-fabrics",
        name: "Rim Zim Doted Knitted Fabrics",
        categories: ["sportswear"],
        source: "Sportswear Fabric",
        images: ["rim-zim-doted-knitted-fabrics-1.jpg", "rim-zim-doted-knitted-fabrics-2.webp"],
        priceValue: 190,
        priceUnit: "Kg",
        moq: "100 Kg",
        specs: {
            "Minimum Order Quantity": "100 Kg",
            "Material": "100% Polyester",
            "GSM": "150-200",
            "Usage/Application": "Garments",
            "Do You Fulfill Sample Orders": "Yes"
        },
        description: null
    },
    {
        id: "rice-knit-fabric",
        name: "Rice Knit Fabric",
        categories: ["sportswear", "knitted"],
        source: "Sportswear Fabric",
        images: ["rice-knit-fabric-1.jpg", "rice-knit-fabric-2.jpeg"],
        priceValue: 185,
        priceUnit: "Kg",
        moq: "100 Kg",
        specs: {
            "Minimum Order Quantity": "100 Kg",
            "Material": "100% Polyester",
            "GSM": "150-200",
            "Width": "44 Inches/ 112 cm",
            "Color": "Multicolour",
            "Usage/Application": "Garments",
            "Packaging Type": "Roll",
            "Do You Provide Sample Orders": "Yes",
            "Gauge": "24",
            "Yarn Count": "100 to 150",
            "Wash Care": "Machine wash",
            "Season": "All Seasons"
        },
        description: null
    },
    {
        id: "polyester-bon-patti",
        name: "Polyester Bon Patti",
        categories: ["lower"],
        source: "Sportswear Fabric",
        images: ["polyester-bon-patti-1.jpg"],
        priceValue: 170,
        priceUnit: "Meter",
        moq: "200 Meter",
        specs: {
            "Minimum Order Quantity": "200 Meter",
            "Material": "Polyester",
            "Color": "Multi colour",
            "Usage/Application": "Lower",
            "GSM": "150",
            "Width": "60 inches",
            "Prints/Pattern": "Plain/Solid",
            "Composition": "100% Polyester"
        },
        description: null
    },
    {
        id: "school-house-t-shirt-fabric",
        name: "School House T Shirt Fabric",
        categories: ["tshirt"],
        source: "Sportswear Fabric",
        images: ["school-house-t-shirt-fabric-1.jpg", "school-house-t-shirt-fabric-2.jpg"],
        priceValue: 190,
        priceUnit: "Kg",
        moq: "100 Kg",
        specs: {
            "Minimum Order Quantity": "100 Kg",
            "Pattern Type": "Plain",
            "Material": "Polyester"
        },
        description: null
    },

    /* ---------- Mens Lower (source category) ---------- */

    {
        id: "150-gsm-bon-patti",
        name: "150 GSM Bon Patti",
        categories: ["lower"],
        source: "Mens Lower",
        images: ["150-gsm-bon-patti-1.jpg", "150-gsm-bon-patti-2.jpg"],
        priceValue: 180,
        priceUnit: "Kg",
        moq: "100 Kg",
        specs: {
            "Minimum Order Quantity": "100 Kg",
            "Fabric Material": "100% Polyester",
            "Knit Type": "Interlock",
            "Material": "Polyster",
            "Pattern": "Solid",
            "GSM": "150",
            "Usage/Application": "Use in lower or Tracksuit making",
            "Fabric Width": "on order",
            "Width": "60 inches",
            "Color": "Multipul",
            "Prints/Pattern": "Plain/Solid",
            "Composition": "100% Polyester"
        },
        description: null
    },
    {
        id: "bon-patti-used-in-tracksuit",
        name: "Bon Patti used in tracksuit",
        categories: ["lower"],
        source: "Mens Lower",
        images: ["bon-patti-used-in-tracksuit-1.jpg", "bon-patti-used-in-tracksuit-2.jpeg"],
        priceValue: 195,
        priceUnit: "Kg",
        moq: "200 Kg",
        specs: {
            "Minimum Order Quantity": "200 Kg",
            "Material": "Polyester",
            "Usage/Application": "Use IN TRACK SUITS SHORTS PAZZAMA",
            "GSM": "140",
            "Pattern": "Plain"
        },
        description: null
    },

    /* ---------- Polyester Knitted Fabric (source category) ---------- */

    {
        id: "micro-knitting-fabric",
        name: "Micro Knitting Fabric",
        categories: ["knitted"],
        source: "Polyester Knitted Fabric",
        images: ["micro-knitting-fabric-1.jpg", "micro-knitting-fabric-2.jpg"],
        priceValue: 190,
        priceUnit: "Kg",
        moq: "100 Kg",
        specs: {
            "Minimum Order Quantity": "100 Kg",
            "Fabric": "Polyester",
            "Type": "Nirmal Knit",
            "GSM": "160",
            "Width": "42 inches"
        },
        description: "White is available and other colour on order."
    },
    {
        id: "black-dot-waffle-fabric",
        name: "Black Dot Waffle Fabric",
        categories: ["sportswear"],
        source: "Polyester Knitted Fabric",
        images: ["black-dot-waffle-fabric-1.jpeg", "black-dot-waffle-fabric-2.jpg"],
        priceValue: 150,
        priceUnit: "Meter",
        moq: "150 Meter",
        specs: {
            "Minimum Order Quantity": "150 Meter",
            "Fabric Type": "Polyester",
            "Width": "58 inches",
            "GSM": "100",
            "Design/Pattern": "Dotted",
            "Usage/Application": "Sport Wears Garments",
            "Country of Origin": "Made in India"
        },
        description: null
    },

    /* ---------- Mens T Shirt (source category) ---------- */

    {
        id: "dot-knit-fabric-100-150-gsm",
        name: "Dot Knit Fabric",
        categories: ["tshirt", "knitted"],
        source: "Mens T Shirt",
        images: ["dot-knit-fabric-100-150-gsm-1.jpg", "dot-knit-fabric-100-150-gsm-2.jpg"],
        priceValue: 190,
        priceUnit: "Kg",
        moq: "100 Kg",
        specs: {
            "Minimum Order Quantity": "100 Kg",
            "Fabric Type": "Polyester",
            "Color": "Multicolour",
            "Prints/Pattern": "Plain/Solids",
            "Usage": "Apparel/Clothing",
            "Material": "Polyester",
            "GSM": "100-150 GSM",
            "Country of Origin": "Made in India"
        },
        description: null
    },
    {
        id: "micro-pp-fabric",
        name: "Micro PP Fabric",
        categories: ["tshirt"],
        source: "Mens T Shirt",
        images: ["micro-pp-fabric-1.jpg", "micro-pp-fabric-2.jpeg"],
        priceValue: 190,
        priceUnit: "Kg",
        moq: "100 Kg",
        specs: {
            "Minimum Order Quantity": "100 Kg",
            "GSM": "121–150 gsm",
            "Fabric Width": "160 cm",
            "Color": "multicolor",
            "Fabric Form": "Roll",
            "Surface Type": "Plain",
            "Fabric Type": "Spunlace",
            "Pattern": "Plain",
            "Country of Origin": "India"
        },
        description: "Micro polyester, all colours on order. GSM 100 or 160 available."
    },

    /* ---------- Foma Fabric (source category) ---------- */

    {
        id: "polo-matty-fabric",
        name: "Polo Matty Fabric",
        categories: ["tshirt"],
        source: "Foma Fabric",
        images: ["polo-matty-fabric-1.jpg", "polo-matty-fabric-2.jpg"],
        priceValue: 210,
        priceUnit: "Kg",
        moq: null,
        specs: {
            "Fabric": "Polyester",
            "Usage/Application": "Garments",
            "Design/Pattern": "DOTS",
            "Width": "42",
            "Brand": "KK KNITWEAR CLUB",
            "Wash Care": "Machine wash",
            "Packaging Type": "Rolls",
            "Country of Origin": "Made in India"
        },
        description: "Use in garments like polo men's t-shirt and school house t-shirts."
    },

    /* ---------- Baby Blanket Fabric Or Jacket Fabrics (source category) ---------- */

    {
        id: "sweater-fabric-or-astar-fabric",
        name: "Sweater Fabric or Astar Fabric",
        categories: ["lining"],
        source: "Baby Blanket Fabric Or Jacket Fabrics",
        images: ["sweater-fabric-or-astar-fabric-1.jpeg", "sweater-fabric-or-astar-fabric-2.jpeg"],
        priceValue: 165,
        priceUnit: "Kg",
        moq: "100 Kg",
        specs: {
            "Minimum Order Quantity": "100 Kg",
            "Fabric": "Polyester",
            "Material": "Polyester",
            "Width": "40-42",
            "GSM": "150-200",
            "Pattern Type": "Plain",
            "Usage/Application": "Garments",
            "Color": "White",
            "Design/Pattern": "Plain",
            "Prints/Pattern": "Plain",
            "Gender": "Unisex"
        },
        description: null
    },

    /* ---------- Home Furnishing (source category) ---------- */

    {
        id: "pillow-cover-fabric-85-gsm",
        name: "Pillow Cover Fabric",
        categories: ["home"],
        source: "Home Furnishing",
        images: ["pillow-cover-fabric-85-gsm-1.jpeg", "pillow-cover-fabric-85-gsm-2.jpeg"],
        priceValue: 170,
        priceUnit: "Kg",
        moq: "100 Kg",
        specs: {
            "Minimum Order Quantity": "100 Kg",
            "Pattern": "Stripe",
            "GSM": "85",
            "Fabric": "Polyester",
            "Color": "White",
            "Type": "On order",
            "Weight": "On order",
            "Use in home furnishing product": "Pillow cover Cartan extra"
        },
        description: null
    },

    /* ---------- Surplus Fabric (source category) ---------- */

    {
        id: "surplus-polyester-fabric",
        name: "Surplus Polyester Fabric",
        categories: ["surplus"],
        source: "Surplus Fabric",
        images: ["surplus-polyester-fabric-1.png", "surplus-polyester-fabric-2.jpeg"],
        priceValue: 150,
        priceUnit: "Kg",
        moq: null,
        specs: {
            "GSM": "180 gsm",
            "Width": "42 inch",
            "Fabric Structure": "dot",
            "Composition": "100% Polyester",
            "Application": "Uniforms, Sportswear, Bags, Lowers/Trackpants, T-shirts, Nightwear, Dress Material, Garments",
            "Finish": "Dri-Fit",
            "Pattern": "Dotted"
        },
        description: null
    },

    /* ---------- Bon Patti (source category) ---------- */

    {
        id: "bon-patti-use-in-lowers-and-track-suits",
        name: "Bon Patti use in Lowers and track suits",
        categories: ["lower"],
        source: "Bon Patti",
        images: ["bon-patti-use-in-lowers-and-track-suits-1.jpeg", "bon-patti-use-in-lowers-and-track-suits-2.jpg"],
        priceValue: 189,
        priceUnit: "Kg",
        moq: "100 Kg",
        specs: {
            "Minimum Order Quantity": "100 Kg",
            "Fabric": "Polyester",
            "Gender": "Unisex",
            "Width": "44 inches",
            "GSM": "220",
            "Pattern Type": "Plain",
            "Weave Type": "Plain"
        },
        description: null
    },

    /* ---------- Dot Knit Fabrics (source category) ---------- */

    {
        id: "dot-knit-fabric-100-180-gsm",
        name: "Dot Knit Fabric",
        categories: ["knitted"],
        source: "Dot Knit Fabrics",
        images: ["dot-knit-fabric-100-180-gsm-1.jpeg", "dot-knit-fabric-100-180-gsm-2.jpg"],
        priceValue: 195,
        priceUnit: "Kg",
        moq: "100 Kg",
        specs: {
            "Minimum Order Quantity": "100 Kg",
            "Color": "Multicolour",
            "Type": "Dot Knit",
            "Prints/Pattern": "Polka Dots",
            "Width": "42 inches",
            "Usage": "Ethnic Wear/Dresses",
            "Material": "Polyester",
            "GSM": "100 to 180 All GSM AVAILABLE"
        },
        description: null
    },

    /* ---------- Dotted Fabric (source category) ---------- */

    {
        id: "polyester-micro-rice-knit-fabric",
        name: "Polyester Micro Rice Knit Fabric",
        categories: ["knitted"],
        source: "Dotted Fabric",
        images: ["polyester-micro-rice-knit-fabric-1.jpg", "polyester-micro-rice-knit-fabric-2.jpg"],
        priceValue: 180,
        priceUnit: "Kg",
        moq: "100 Kg",
        specs: {
            "Minimum Order Quantity": "100 Kg",
            "Fabric": "Polyester",
            "Type": "Rice Knit",
            "GSM": "160",
            "Width": "42 inches"
        },
        description: null
    },

    /* ---------- Foams Films & Fabrics (source category) ---------- */

    {
        id: "polyester-foma-fabric-250-gsm",
        name: "Polyester Foma Fabric",
        categories: ["knitted"],
        source: "Foams Films & Fabrics",
        images: ["polyester-foma-fabric-250-gsm-1.jpeg", "polyester-foma-fabric-250-gsm-2.jpeg"],
        priceValue: 170,
        priceUnit: "Kg",
        moq: "100 Kg",
        specs: {
            "Minimum Order Quantity": "100 Kg",
            "Material": "Polyester",
            "Pattern Type": "Plain",
            "Usage/Application": "Garment",
            "Design/Pattern": "Plain",
            "GSM": "250"
        },
        description: null
    },

    /* ---------- Mesh Fabrics (source category) ---------- */

    {
        id: "nirmal-jali-fabric",
        name: "Nirmal Jali Fabric",
        categories: ["home"],
        source: "Mesh Fabrics",
        images: ["nirmal-jali-fabric-1.jpg", "nirmal-jali-fabric-2.jpg"],
        priceValue: 190,
        priceUnit: "Kg",
        moq: null,
        specs: {
            "Material": "Polyester",
            "Mesh Type": "circular knitted",
            "Mesh Size": "Micro Mesh",
            "GSM": "on order",
            "Usage": "Curtain",
            "Color": "White",
            "Finish": "Soft"
        },
        description: null
    },

    /* ---------- Terry Fabric (source category) ---------- */

    {
        id: "micro-nirmal-knit-fabrics",
        name: "Micro Nirmal Knit Fabrics",
        categories: ["knitted"],
        source: "Terry Fabric",
        images: ["micro-nirmal-knit-fabrics-1.jpg", "micro-nirmal-knit-fabrics-2.jpg"],
        priceValue: 198,
        priceUnit: "Kg",
        moq: "100 Kg",
        specs: {
            "Minimum Order Quantity": "100 Kg",
            "Type": "100% Polyester",
            "Country of Origin": "Made in India",
            "Color": "Green",
            "Pack Type": "Packet",
            "Fabric Type": "Micro Nirmal Knit Fabrics",
            "Usage": "Industrial"
        },
        description: null
    },

    /* ---------- Chair Cover (source category) ---------- */

    {
        id: "tent-table-and-chair-cover-fabrics",
        name: "Tent Table And Chair Cover Fabrics",
        categories: ["home"],
        source: "Chair Cover",
        images: ["tent-table-and-chair-cover-fabrics-1.jpeg", "tent-table-and-chair-cover-fabrics-2.jpeg"],
        priceValue: 200,
        priceUnit: "Kg",
        moq: "100 Kg",
        specs: {
            "Minimum Order Quantity": "100 Kg",
            "Fabric": "Polyester",
            "Width": "37 mm",
            "Usage/Application": "Tent Fabrics",
            "Color": "Multicolor",
            "Packaging Type": "Box",
            "Country of Origin": "Made in India"
        },
        description: null
    }
];

/* ==========================================================================
   Company details - taken from the manufacturer's own published factsheet.
   ========================================================================== */

var COMPANY = {
    name: "K.K. Knitwear Club",
    tagline: "Polyester & knitted fabric manufacturer since 1990",
    established: "1990",
    owner: "Avnish Jain",
    ownerTitle: "Proprietor",
    phone: "07942802251",
    whatsapp: "917942802251",
    email: "info@kkknitwearclub.com",
    addressLines: [
        "Street No-1, K.K Knitwear Club",
        "Kabir Nagar, Sekhonwal Road",
        "Ludhiana - 141008, Punjab, India"
    ],
    mapQuery: "K.K Knitwear Club, Kabir Nagar, Sekhonwal Road, Ludhiana 141008",
    factsheet: [
        ["Nature of Business", "Manufacturer"],
        ["Additional Business", "Factory / Manufacturing"],
        ["Company CEO / Owner", "Avnish Jain"],
        ["Year of Establishment", "1990"],
        ["Legal Status of Firm", "Proprietorship"],
        ["Number of Employees", "11 to 25 People"],
        ["Annual Turnover", "Rs. 1.5 - 5 Crore"],
        ["GST Number", "03ABLPJ0347H1ZZ"],
        ["GST Registration Date", "01-07-2017"],
        ["TAN Number", "JLDA1*****"],
        ["Banking Partner", "HDFC Bank"]
    ],
    trade: [
        ["Payment Modes", "Cash, Cheque, Pay Order, Bank Transfer, Online"],
        ["Shipment Mode", "By Road"],
        ["Infrastructure", "Manufacturing unit, office, warehouse and packaging facilities"]
    ],
    about: [
        "Established in the year 1990, K.K. Knitwear Club is a manufacturer of Polyester Fabric, Knitted Fabric, Sportswear Fabric, Terry Fabric, Baby Blanket and Jacket Fabrics, Dot Knit Fabrics, Polyester Knitted Fabric and Dotted Fabric.",
        "We direct all our activities to cater the expectations of customers by providing them with excellent quality products.",
        "Credit for our growth goes to our proprietor Mr. Avnish Jain for his continual backing and direction."
    ],
    enquiryHint: "To get the best quote, describe your requirement in detail: what you are looking for, features and specifications, application or usage, and the quantity you need."
};

/* ==========================================================================
   Buyer reviews - copied verbatim from the manufacturer's own testimonial
   page. Names, cities, ratings, dates and comment text are all as
   published; only the two-digit years were written out in full.

   NOTE ON THE OVERALL FIGURE
   `overall` is quoted from the source page, not averaged from the eight
   reviews below. The source's own star breakdown counts a one-star review
   that it never displays, so the eight visible entries are all 5/5 while
   the published average is 4.5. Recomputing from the visible eight would
   overstate the rating to 5.0, so the mill's own number is used and the
   count is shown alongside it.
   ========================================================================== */

var TESTIMONIALS = {
    overall: "4.5",
    outOf: "5",
    count: 8,
    reviews: [
        {
            name: "Musthafa Shaik", place: "Kovur, Andhra Pradesh",
            stars: 5, date: "26 September 2025",
            product: "Hosiery Fabric", text: null
        },
        {
            name: "Bindiya Taneja", place: "New Delhi, Delhi",
            stars: 5, date: "13 July 2025",
            product: "Polyester Fabric", text: null
        },
        {
            name: "Parul Jain", place: "Ludhiana, Punjab",
            stars: 5, date: "8 September 2024",
            product: "Terry Fabric",
            text: "V. Good dealing, great efforts, full satisfied with clothes and reasonable price."
        },
        {
            name: "Arsala", place: "Delhi, Delhi",
            stars: 5, date: "5 May 2024",
            product: "Jacket Fabric", text: null
        },
        {
            name: "Rahul", place: "Kangra, Himachal Pradesh",
            stars: 5, date: "3 September 2025",
            product: "Tent Fabric", text: null
        },
        {
            name: "Mujakkir", place: "New Delhi, Delhi",
            stars: 5, date: "1 June 2025",
            product: "Polyester Fabric", text: null
        },
        {
            name: "Kamble Rajashekhar", place: "Bengaluru, Karnataka",
            stars: 5, date: "2 January 2025",
            product: "Terry Fabric", text: null
        },
        {
            name: "Bajranglal Agarwal", place: "Guwahati, Assam",
            stars: 5, date: "3 December 2024",
            product: "Home Furnishing", text: null
        }
    ]
};
