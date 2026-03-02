import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Clear existing categories
  await prisma.category.deleteMany({});

  // Level 1: Main category
  const clothes = await prisma.category.create({
    data: {
      name: "Clothes",
      slug: "clothes",
      level: 1,
      displayOrder: 1,
    },
  });

  const shoes = await prisma.category.create({
    data: {
      name: "Shoes",
      slug: "shoes",
      level: 1,
      displayOrder: 2,
    },
  });

  // Level 2: Second level categories
  const womensClothing = await prisma.category.create({
    data: {
      name: "Women's Clothing",
      slug: "womens-clothing",
      parentId: clothes.id,
      level: 2,
      displayOrder: 1,
    },
  });

  const mensClothing = await prisma.category.create({
    data: {
      name: "Men's Clothing",
      slug: "mens-clothing",
      parentId: clothes.id,
      level: 2,
      displayOrder: 2,
    },
  });

  const kidsClothing = await prisma.category.create({
    data: {
      name: "Kids' Clothing",
      slug: "kids-clothing",
      parentId: clothes.id,
      level: 2,
      displayOrder: 3,
    },
  });

  const underwearNightwear = await prisma.category.create({
    data: {
      name: "Underwear & Nightwear",
      slug: "underwear-nightwear",
      parentId: clothes.id,
      level: 2,
      displayOrder: 4,
    },
  });

  const sportswear = await prisma.category.create({
    data: {
      name: "Sportswear",
      slug: "sportswear",
      parentId: clothes.id,
      level: 2,
      displayOrder: 5,
    },
  });

  const outerwear = await prisma.category.create({
    data: {
      name: "Outerwear",
      slug: "outerwear",
      parentId: clothes.id,
      level: 2,
      displayOrder: 6,
    },
  });

  // Level 3: Third level categories
  // Women's Clothing subcategories
  await prisma.category.createMany({
    data: [
      {
        name: "Dresses",
        slug: "dresses",
        parentId: womensClothing.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Tops & T-Shirts",
        slug: "tops-tshirts",
        parentId: womensClothing.id,
        level: 3,
        displayOrder: 2,
      },
      {
        name: "Trousers & Jeans",
        slug: "womens-trousers-jeans",
        parentId: womensClothing.id,
        level: 3,
        displayOrder: 3,
      },
      {
        name: "Skirts",
        slug: "skirts",
        parentId: womensClothing.id,
        level: 3,
        displayOrder: 4,
      },
      {
        name: "Outerwear",
        slug: "womens-outerwear",
        parentId: womensClothing.id,
        level: 3,
        displayOrder: 5,
      },
    ],
  });

  // Men's Clothing subcategories
  await prisma.category.createMany({
    data: [
      {
        name: "Shirts",
        slug: "shirts",
        parentId: mensClothing.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Trousers & Jeans",
        slug: "mens-trousers-jeans",
        parentId: mensClothing.id,
        level: 3,
        displayOrder: 2,
      },
      {
        name: "Suits & Blazers",
        slug: "suits-blazers",
        parentId: mensClothing.id,
        level: 3,
        displayOrder: 3,
      },
      {
        name: "Outerwear",
        slug: "mens-outerwear",
        parentId: mensClothing.id,
        level: 3,
        displayOrder: 4,
      },
    ],
  });

  // Kids' Clothing subcategories
  await prisma.category.createMany({
    data: [
      {
        name: "Baby Clothing",
        slug: "baby-clothing",
        parentId: kidsClothing.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Everyday Kidswear",
        slug: "everyday-kidswear",
        parentId: kidsClothing.id,
        level: 3,
        displayOrder: 2,
      },
      {
        name: "Schoolwear",
        slug: "schoolwear",
        parentId: kidsClothing.id,
        level: 3,
        displayOrder: 3,
      },
    ],
  });

  // Underwear & Nightwear subcategories
  await prisma.category.createMany({
    data: [
      {
        name: "Underwear",
        slug: "underwear",
        parentId: underwearNightwear.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Sleepwear",
        slug: "sleepwear",
        parentId: underwearNightwear.id,
        level: 3,
        displayOrder: 2,
      },
      {
        name: "Socks & Tights",
        slug: "socks-tights",
        parentId: underwearNightwear.id,
        level: 3,
        displayOrder: 3,
      },
    ],
  });

  // Sportswear subcategories
  await prisma.category.createMany({
    data: [
      {
        name: "Training Apparel",
        slug: "training-apparel",
        parentId: sportswear.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Running Apparel",
        slug: "running-apparel",
        parentId: sportswear.id,
        level: 3,
        displayOrder: 2,
      },
      {
        name: "Outdoor Apparel",
        slug: "outdoor-apparel",
        parentId: sportswear.id,
        level: 3,
        displayOrder: 3,
      },
    ],
  });

  // Outerwear subcategories
  await prisma.category.createMany({
    data: [
      {
        name: "Jackets & Parkas",
        slug: "jackets-parkas",
        parentId: outerwear.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Winter Wear",
        slug: "winter-wear",
        parentId: outerwear.id,
        level: 3,
        displayOrder: 2,
      },
      {
        name: "Rainwear",
        slug: "rainwear",
        parentId: outerwear.id,
        level: 3,
        displayOrder: 3,
      },
    ],
  });

  // Level 2: Shoes categories
  const womensShoes = await prisma.category.create({
    data: {
      name: "Women's Shoes",
      slug: "womens-shoes",
      parentId: shoes.id,
      level: 2,
      displayOrder: 1,
    },
  });

  const mensShoes = await prisma.category.create({
    data: {
      name: "Men's Shoes",
      slug: "mens-shoes",
      parentId: shoes.id,
      level: 2,
      displayOrder: 2,
    },
  });

  const kidsShoes = await prisma.category.create({
    data: {
      name: "Kids' Shoes",
      slug: "kids-shoes",
      parentId: shoes.id,
      level: 2,
      displayOrder: 3,
    },
  });

  const sportsShoes = await prisma.category.create({
    data: {
      name: "Sports Shoes",
      slug: "sports-shoes",
      parentId: shoes.id,
      level: 2,
      displayOrder: 4,
    },
  });

  const slippersIndoorShoes = await prisma.category.create({
    data: {
      name: "Slippers & Indoor Shoes",
      slug: "slippers-indoor-shoes",
      parentId: shoes.id,
      level: 2,
      displayOrder: 5,
    },
  });

  const shoeCareAccessories = await prisma.category.create({
    data: {
      name: "Shoe Care & Accessories",
      slug: "shoe-care-accessories",
      parentId: shoes.id,
      level: 2,
      displayOrder: 6,
    },
  });

  // Level 3: Shoes subcategories
  // Women's Shoes subcategories
  await prisma.category.createMany({
    data: [
      {
        name: "Sneakers",
        slug: "womens-sneakers",
        parentId: womensShoes.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Boots",
        slug: "womens-boots",
        parentId: womensShoes.id,
        level: 3,
        displayOrder: 2,
      },
      {
        name: "Sandals",
        slug: "womens-sandals",
        parentId: womensShoes.id,
        level: 3,
        displayOrder: 3,
      },
    ],
  });

  // Men's Shoes subcategories
  await prisma.category.createMany({
    data: [
      {
        name: "Casual Shoes",
        slug: "mens-casual-shoes",
        parentId: mensShoes.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Formal Shoes",
        slug: "mens-formal-shoes",
        parentId: mensShoes.id,
        level: 3,
        displayOrder: 2,
      },
      {
        name: "Sneakers",
        slug: "mens-sneakers",
        parentId: mensShoes.id,
        level: 3,
        displayOrder: 3,
      },
    ],
  });

  // Kids' Shoes subcategories
  await prisma.category.createMany({
    data: [
      {
        name: "School Shoes",
        slug: "kids-school-shoes",
        parentId: kidsShoes.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Winter Boots",
        slug: "kids-winter-boots",
        parentId: kidsShoes.id,
        level: 3,
        displayOrder: 2,
      },
    ],
  });

  // Sports Shoes subcategories
  await prisma.category.createMany({
    data: [
      {
        name: "Running Shoes",
        slug: "running-shoes",
        parentId: sportsShoes.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Indoor Training Shoes",
        slug: "indoor-training-shoes",
        parentId: sportsShoes.id,
        level: 3,
        displayOrder: 2,
      },
    ],
  });

  // Slippers & Indoor Shoes subcategories
  await prisma.category.createMany({
    data: [
      {
        name: "Slippers",
        slug: "slippers",
        parentId: slippersIndoorShoes.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Home Shoes",
        slug: "home-shoes",
        parentId: slippersIndoorShoes.id,
        level: 3,
        displayOrder: 2,
      },
    ],
  });

  // Shoe Care & Accessories subcategories
  await prisma.category.createMany({
    data: [
      {
        name: "Insoles",
        slug: "insoles",
        parentId: shoeCareAccessories.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Care Products",
        slug: "shoe-care-products",
        parentId: shoeCareAccessories.id,
        level: 3,
        displayOrder: 2,
      },
    ],
  });

  // ============================================
  // Level 1: New root categories (do not touch Clothes/Shoes above)
  // ============================================
  const bagsAccessories = await prisma.category.create({
    data: {
      name: "Bags & Accessories",
      slug: "bags-accessories",
      level: 1,
      displayOrder: 3,
    },
  });

  const jewelryWatches = await prisma.category.create({
    data: {
      name: "Jewelry & Watches",
      slug: "jewelry-watches",
      level: 1,
      displayOrder: 4,
    },
  });

  const beautyWellness = await prisma.category.create({
    data: {
      name: "Beauty & Wellness",
      slug: "beauty-wellness",
      level: 1,
      displayOrder: 5,
    },
  });

  const healthPharmacy = await prisma.category.create({
    data: {
      name: "Health & Pharmacy",
      slug: "health-pharmacy",
      level: 1,
      displayOrder: 6,
    },
  });

  const electronics = await prisma.category.create({
    data: {
      name: "Electronics",
      slug: "electronics",
      level: 1,
      displayOrder: 7,
    },
  });

  const homeAppliances = await prisma.category.create({
    data: {
      name: "Home Appliances",
      slug: "home-appliances",
      level: 1,
      displayOrder: 8,
    },
  });

  const homeGarden = await prisma.category.create({
    data: {
      name: "Home & Garden",
      slug: "home-garden",
      level: 1,
      displayOrder: 9,
    },
  });

  const furniture = await prisma.category.create({
    data: {
      name: "Furniture",
      slug: "furniture",
      level: 1,
      displayOrder: 10,
    },
  });

  const buildingRenovation = await prisma.category.create({
    data: {
      name: "Building & Renovation",
      slug: "building-renovation",
      level: 1,
      displayOrder: 11,
    },
  });

  const carAccessories = await prisma.category.create({
    data: {
      name: "Car Accessories",
      slug: "car-accessories",
      level: 1,
      displayOrder: 12,
    },
  });

  const foodGroceries = await prisma.category.create({
    data: {
      name: "Food & Groceries",
      slug: "food-groceries",
      level: 1,
      displayOrder: 13,
    },
  });

  const petSupplies = await prisma.category.create({
    data: {
      name: "Pet Supplies",
      slug: "pet-supplies",
      level: 1,
      displayOrder: 14,
    },
  });

  const kidsProducts = await prisma.category.create({
    data: {
      name: "Kids’ Products",
      slug: "kids-products",
      level: 1,
      displayOrder: 15,
    },
  });

  const sportsOutdoor = await prisma.category.create({
    data: {
      name: "Sports & Outdoor",
      slug: "sports-outdoor",
      level: 1,
      displayOrder: 16,
    },
  });

  const books = await prisma.category.create({
    data: {
      name: "Books",
      slug: "books",
      level: 1,
      displayOrder: 17,
    },
  });

  const hobbiesCrafts = await prisma.category.create({
    data: {
      name: "Hobbies & Crafts",
      slug: "hobbies-crafts",
      level: 1,
      displayOrder: 18,
    },
  });

  const officeStudy = await prisma.category.create({
    data: {
      name: "Office & Study",
      slug: "office-study",
      level: 1,
      displayOrder: 19,
    },
  });

  const cleaningHousehold = await prisma.category.create({
    data: {
      name: "Cleaning & Household",
      slug: "cleaning-household",
      level: 1,
      displayOrder: 20,
    },
  });

  const digitalProducts = await prisma.category.create({
    data: {
      name: "Digital Products",
      slug: "digital-products",
      level: 1,
      displayOrder: 21,
    },
  });

  const giftCards = await prisma.category.create({
    data: {
      name: "Gift Cards",
      slug: "gift-cards",
      level: 1,
      displayOrder: 22,
    },
  });

  // ============================================
  // Bags & Accessories (L2 + L3)
  // ============================================
  const womensAccessories = await prisma.category.create({
    data: {
      name: "Women’s Accessories",
      slug: "womens-accessories",
      parentId: bagsAccessories.id,
      level: 2,
      displayOrder: 1,
    },
  });

  const mensAccessories = await prisma.category.create({
    data: {
      name: "Men’s Accessories",
      slug: "mens-accessories",
      parentId: bagsAccessories.id,
      level: 2,
      displayOrder: 2,
    },
  });

  const kidsAccessories = await prisma.category.create({
    data: {
      name: "Kids’ Accessories",
      slug: "kids-accessories",
      parentId: bagsAccessories.id,
      level: 2,
      displayOrder: 3,
    },
  });

  const backpacksBags = await prisma.category.create({
    data: {
      name: "Backpacks & Bags",
      slug: "backpacks-bags",
      parentId: bagsAccessories.id,
      level: 2,
      displayOrder: 4,
    },
  });

  const travelAccessories = await prisma.category.create({
    data: {
      name: "Travel Accessories",
      slug: "travel-accessories",
      parentId: bagsAccessories.id,
      level: 2,
      displayOrder: 5,
    },
  });

  const accessoryEssentials = await prisma.category.create({
    data: {
      name: "Accessory Essentials",
      slug: "accessory-essentials",
      parentId: bagsAccessories.id,
      level: 2,
      displayOrder: 6,
    },
  });

  // L3: Women’s Accessories
  await prisma.category.createMany({
    data: [
      {
        name: "Handbags",
        slug: "handbags",
        parentId: womensAccessories.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Wallets",
        slug: "wallets",
        parentId: womensAccessories.id,
        level: 3,
        displayOrder: 2,
      },
      {
        name: "Scarves",
        slug: "womens-scarves",
        parentId: womensAccessories.id,
        level: 3,
        displayOrder: 3,
      },
    ],
  });

  // L3: Men’s Accessories
  await prisma.category.createMany({
    data: [
      {
        name: "Briefcases",
        slug: "briefcases",
        parentId: mensAccessories.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Backpacks",
        slug: "mens-backpacks",
        parentId: mensAccessories.id,
        level: 3,
        displayOrder: 2,
      },
      {
        name: "Belts",
        slug: "mens-belts",
        parentId: mensAccessories.id,
        level: 3,
        displayOrder: 3,
      },
    ],
  });

  // L3: Kids’ Accessories
  await prisma.category.createMany({
    data: [
      {
        name: "School Backpacks",
        slug: "kids-school-backpacks",
        parentId: kidsAccessories.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Small Bags",
        slug: "kids-small-bags",
        parentId: kidsAccessories.id,
        level: 3,
        displayOrder: 2,
      },
    ],
  });

  // L3: Backpacks & Bags
  await prisma.category.createMany({
    data: [
      {
        name: "Backpacks",
        slug: "backpacks",
        parentId: backpacksBags.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Shoulder Bags",
        slug: "shoulder-bags",
        parentId: backpacksBags.id,
        level: 3,
        displayOrder: 2,
      },
    ],
  });

  // L3: Travel Accessories
  await prisma.category.createMany({
    data: [
      {
        name: "Suitcases",
        slug: "suitcases",
        parentId: travelAccessories.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Travel Organizers",
        slug: "travel-organizers",
        parentId: travelAccessories.id,
        level: 3,
        displayOrder: 2,
      },
    ],
  });

  // L3: Accessory Essentials
  await prisma.category.createMany({
    data: [
      {
        name: "Sunglasses",
        slug: "sunglasses",
        parentId: accessoryEssentials.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Hats & Gloves",
        slug: "hats-gloves",
        parentId: accessoryEssentials.id,
        level: 3,
        displayOrder: 2,
      },
    ],
  });

  // ============================================
  // Jewelry & Watches (L2 + L3)
  // ============================================
  const jewelry = await prisma.category.create({
    data: {
      name: "Jewelry",
      slug: "jewelry",
      parentId: jewelryWatches.id,
      level: 2,
      displayOrder: 1,
    },
  });

  const watches = await prisma.category.create({
    data: {
      name: "Watches",
      slug: "watches",
      parentId: jewelryWatches.id,
      level: 2,
      displayOrder: 2,
    },
  });

  const fashionJewelry = await prisma.category.create({
    data: {
      name: "Fashion Jewelry",
      slug: "fashion-jewelry",
      parentId: jewelryWatches.id,
      level: 2,
      displayOrder: 3,
    },
  });

  const kidsJewelry = await prisma.category.create({
    data: {
      name: "Kids’ Jewelry",
      slug: "kids-jewelry",
      parentId: jewelryWatches.id,
      level: 2,
      displayOrder: 4,
    },
  });

  const accessoryJewelry = await prisma.category.create({
    data: {
      name: "Accessory Jewelry",
      slug: "accessory-jewelry",
      parentId: jewelryWatches.id,
      level: 2,
      displayOrder: 5,
    },
  });

  // L3: Jewelry
  await prisma.category.createMany({
    data: [
      {
        name: "Rings",
        slug: "rings",
        parentId: jewelry.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Earrings",
        slug: "earrings",
        parentId: jewelry.id,
        level: 3,
        displayOrder: 2,
      },
      {
        name: "Necklaces",
        slug: "necklaces",
        parentId: jewelry.id,
        level: 3,
        displayOrder: 3,
      },
    ],
  });

  // L3: Watches
  await prisma.category.createMany({
    data: [
      {
        name: "Wristwatches",
        slug: "wristwatches",
        parentId: watches.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Smartwatches",
        slug: "smartwatches",
        parentId: watches.id,
        level: 3,
        displayOrder: 2,
      },
    ],
  });

  // L3: Fashion Jewelry
  await prisma.category.createMany({
    data: [
      {
        name: "Fashion Jewelry",
        slug: "fashion-jewelry-sets",
        parentId: fashionJewelry.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Jewelry Sets",
        slug: "jewelry-sets",
        parentId: fashionJewelry.id,
        level: 3,
        displayOrder: 2,
      },
    ],
  });

  // L3: Kids’ Jewelry
  await prisma.category.createMany({
    data: [
      {
        name: "Kids’ Bracelets",
        slug: "kids-bracelets",
        parentId: kidsJewelry.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Accessory Jewelry
  await prisma.category.createMany({
    data: [
      {
        name: "Brooches",
        slug: "brooches",
        parentId: accessoryJewelry.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // ============================================
  // Beauty & Wellness (L2 + L3)
  // ============================================
  const skincare = await prisma.category.create({
    data: {
      name: "Skincare",
      slug: "skincare",
      parentId: beautyWellness.id,
      level: 2,
      displayOrder: 1,
    },
  });

  const haircare = await prisma.category.create({
    data: {
      name: "Haircare",
      slug: "haircare",
      parentId: beautyWellness.id,
      level: 2,
      displayOrder: 2,
    },
  });

  const makeup = await prisma.category.create({
    data: {
      name: "Makeup",
      slug: "makeup",
      parentId: beautyWellness.id,
      level: 2,
      displayOrder: 3,
    },
  });

  const fragrancesScents = await prisma.category.create({
    data: {
      name: "Fragrances & Scents",
      slug: "fragrances-scents",
      parentId: beautyWellness.id,
      level: 2,
      displayOrder: 4,
    },
  });

  const nailsTools = await prisma.category.create({
    data: {
      name: "Nails & Tools",
      slug: "nails-tools",
      parentId: beautyWellness.id,
      level: 2,
      displayOrder: 5,
    },
  });

  const wellnessDevices = await prisma.category.create({
    data: {
      name: "Wellness Devices",
      slug: "wellness-devices",
      parentId: beautyWellness.id,
      level: 2,
      displayOrder: 6,
    },
  });

  const professionalUse = await prisma.category.create({
    data: {
      name: "Professional Use",
      slug: "professional-use",
      parentId: beautyWellness.id,
      level: 2,
      displayOrder: 7,
    },
  });

  // L3: Skincare
  await prisma.category.createMany({
    data: [
      {
        name: "Face Care",
        slug: "face-care",
        parentId: skincare.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Body Care",
        slug: "body-care",
        parentId: skincare.id,
        level: 3,
        displayOrder: 2,
      },
    ],
  });

  // L3: Haircare
  await prisma.category.createMany({
    data: [
      {
        name: "Shampoo & Conditioner",
        slug: "shampoo-conditioner",
        parentId: haircare.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Styling Products",
        slug: "styling-products",
        parentId: haircare.id,
        level: 3,
        displayOrder: 2,
      },
    ],
  });

  // L3: Makeup
  await prisma.category.createMany({
    data: [
      {
        name: "Face Makeup",
        slug: "face-makeup",
        parentId: makeup.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Eye Makeup",
        slug: "eye-makeup",
        parentId: makeup.id,
        level: 3,
        displayOrder: 2,
      },
    ],
  });

  // L3: Fragrances & Scents
  await prisma.category.createMany({
    data: [
      {
        name: "Perfumes",
        slug: "perfumes",
        parentId: fragrancesScents.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Scented Candles",
        slug: "scented-candles",
        parentId: fragrancesScents.id,
        level: 3,
        displayOrder: 2,
      },
    ],
  });

  // L3: Nails & Tools
  await prisma.category.createMany({
    data: [
      {
        name: "Nail Polishes",
        slug: "nail-polishes",
        parentId: nailsTools.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Nail Tools",
        slug: "nail-tools",
        parentId: nailsTools.id,
        level: 3,
        displayOrder: 2,
      },
    ],
  });

  // L3: Wellness Devices
  await prisma.category.createMany({
    data: [
      {
        name: "Massage Devices",
        slug: "massage-devices",
        parentId: wellnessDevices.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Professional Use
  await prisma.category.createMany({
    data: [
      {
        name: "Salon Equipment",
        slug: "salon-equipment",
        parentId: professionalUse.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // ============================================
  // Health & Pharmacy (L2 + L3)
  // ============================================
  const medicines = await prisma.category.create({
    data: {
      name: "Medicines",
      slug: "medicines",
      parentId: healthPharmacy.id,
      level: 2,
      displayOrder: 1,
    },
  });

  const vitaminsSupplements = await prisma.category.create({
    data: {
      name: "Vitamins & Supplements",
      slug: "vitamins-supplements",
      parentId: healthPharmacy.id,
      level: 2,
      displayOrder: 2,
    },
  });

  const hygieneProducts = await prisma.category.create({
    data: {
      name: "Hygiene Products",
      slug: "hygiene-products",
      parentId: healthPharmacy.id,
      level: 2,
      displayOrder: 3,
    },
  });

  const medicalDevices = await prisma.category.create({
    data: {
      name: "Medical Devices",
      slug: "medical-devices",
      parentId: healthPharmacy.id,
      level: 2,
      displayOrder: 4,
    },
  });

  const orthopedicsRehab = await prisma.category.create({
    data: {
      name: "Orthopedics & Rehab",
      slug: "orthopedics-rehab",
      parentId: healthPharmacy.id,
      level: 2,
      displayOrder: 5,
    },
  });

  const visionOptics = await prisma.category.create({
    data: {
      name: "Vision & Optics",
      slug: "vision-optics",
      parentId: healthPharmacy.id,
      level: 2,
      displayOrder: 6,
    },
  });

  // L3: Medicines
  await prisma.category.createMany({
    data: [
      {
        name: "Over-the-Counter Medicines",
        slug: "otc-medicines",
        parentId: medicines.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Vitamins & Supplements
  await prisma.category.createMany({
    data: [
      {
        name: "Vitamins",
        slug: "vitamins",
        parentId: vitaminsSupplements.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Supplements",
        slug: "supplements",
        parentId: vitaminsSupplements.id,
        level: 3,
        displayOrder: 2,
      },
    ],
  });

  // L3: Hygiene Products
  await prisma.category.createMany({
    data: [
      {
        name: "Oral Care",
        slug: "oral-care",
        parentId: hygieneProducts.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Personal Hygiene",
        slug: "personal-hygiene",
        parentId: hygieneProducts.id,
        level: 3,
        displayOrder: 2,
      },
    ],
  });

  // L3: Medical Devices
  await prisma.category.createMany({
    data: [
      {
        name: "Meters",
        slug: "meters",
        parentId: medicalDevices.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Accessories",
        slug: "medical-accessories",
        parentId: medicalDevices.id,
        level: 3,
        displayOrder: 2,
      },
    ],
  });

  // L3: Orthopedics & Rehab
  await prisma.category.createMany({
    data: [
      {
        name: "Support Products",
        slug: "support-products",
        parentId: orthopedicsRehab.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Vision & Optics
  await prisma.category.createMany({
    data: [
      {
        name: "Eyeglasses",
        slug: "eyeglasses",
        parentId: visionOptics.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Contact Lenses",
        slug: "contact-lenses",
        parentId: visionOptics.id,
        level: 3,
        displayOrder: 2,
      },
    ],
  });

  // ============================================
  // Electronics (L2 + L3)
  // ============================================
  const phonesSmartDevices = await prisma.category.create({
    data: {
      name: "Phones & Smart Devices",
      slug: "phones-smart-devices",
      parentId: electronics.id,
      level: 2,
      displayOrder: 1,
    },
  });

  const computersTablets = await prisma.category.create({
    data: {
      name: "Computers & Tablets",
      slug: "computers-tablets",
      parentId: electronics.id,
      level: 2,
      displayOrder: 2,
    },
  });

  const audioVideo = await prisma.category.create({
    data: {
      name: "Audio & Video",
      slug: "audio-video",
      parentId: electronics.id,
      level: 2,
      displayOrder: 3,
    },
  });

  const photoVideo = await prisma.category.create({
    data: {
      name: "Photography & Video",
      slug: "photography-video",
      parentId: electronics.id,
      level: 2,
      displayOrder: 4,
    },
  });

  const smartHomeSecurity = await prisma.category.create({
    data: {
      name: "Smart Home & Security",
      slug: "smart-home-security",
      parentId: electronics.id,
      level: 2,
      displayOrder: 5,
    },
  });

  const electronicsAccessories = await prisma.category.create({
    data: {
      name: "Accessories & Cables",
      slug: "electronics-accessories",
      parentId: electronics.id,
      level: 2,
      displayOrder: 6,
    },
  });

  // L3: Phones & Smart Devices
  await prisma.category.createMany({
    data: [
      {
        name: "Smartphones",
        slug: "smartphones",
        parentId: phonesSmartDevices.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Smartwatches",
        slug: "electronics-smartwatches",
        parentId: phonesSmartDevices.id,
        level: 3,
        displayOrder: 2,
      },
    ],
  });

  // L3: Computers & Tablets
  await prisma.category.createMany({
    data: [
      {
        name: "Laptops",
        slug: "laptops",
        parentId: computersTablets.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Tablets",
        slug: "tablets",
        parentId: computersTablets.id,
        level: 3,
        displayOrder: 2,
      },
    ],
  });

  // L3: Audio & Video
  await prisma.category.createMany({
    data: [
      {
        name: "Headphones",
        slug: "headphones",
        parentId: audioVideo.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Speakers",
        slug: "speakers",
        parentId: audioVideo.id,
        level: 3,
        displayOrder: 2,
      },
    ],
  });

  // L3: Photography & Video
  await prisma.category.createMany({
    data: [
      {
        name: "Cameras",
        slug: "cameras",
        parentId: photoVideo.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Lenses",
        slug: "lenses",
        parentId: photoVideo.id,
        level: 3,
        displayOrder: 2,
      },
    ],
  });

  // L3: Smart Home & Security
  await prisma.category.createMany({
    data: [
      {
        name: "Sensors",
        slug: "sensors",
        parentId: smartHomeSecurity.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Security Cameras",
        slug: "security-cameras",
        parentId: smartHomeSecurity.id,
        level: 3,
        displayOrder: 2,
      },
    ],
  });

  // L3: Accessories & Cables
  await prisma.category.createMany({
    data: [
      {
        name: "Cables",
        slug: "cables",
        parentId: electronicsAccessories.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Chargers",
        slug: "chargers",
        parentId: electronicsAccessories.id,
        level: 3,
        displayOrder: 2,
      },
    ],
  });

  // ============================================
  // Home Appliances (L2 + L3)
  // ============================================
  const largeAppliances = await prisma.category.create({
    data: {
      name: "Large Appliances",
      slug: "large-appliances",
      parentId: homeAppliances.id,
      level: 2,
      displayOrder: 1,
    },
  });

  const smallAppliances = await prisma.category.create({
    data: {
      name: "Small Appliances",
      slug: "small-appliances",
      parentId: homeAppliances.id,
      level: 2,
      displayOrder: 2,
    },
  });

  const kitchenAppliances = await prisma.category.create({
    data: {
      name: "Kitchen Appliances",
      slug: "kitchen-appliances",
      parentId: homeAppliances.id,
      level: 2,
      displayOrder: 3,
    },
  });

  const cleaningAppliances = await prisma.category.create({
    data: {
      name: "Cleaning Appliances",
      slug: "cleaning-appliances",
      parentId: homeAppliances.id,
      level: 2,
      displayOrder: 4,
    },
  });

  const airClimate = await prisma.category.create({
    data: {
      name: "Air & Climate",
      slug: "air-climate",
      parentId: homeAppliances.id,
      level: 2,
      displayOrder: 5,
    },
  });

  // L3: Large Appliances
  await prisma.category.createMany({
    data: [
      {
        name: "Refrigerators",
        slug: "refrigerators",
        parentId: largeAppliances.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Washing Machines",
        slug: "washing-machines",
        parentId: largeAppliances.id,
        level: 3,
        displayOrder: 2,
      },
    ],
  });

  // L3: Small Appliances
  await prisma.category.createMany({
    data: [
      {
        name: "Coffee Makers",
        slug: "coffee-makers",
        parentId: smallAppliances.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Kettles",
        slug: "kettles",
        parentId: smallAppliances.id,
        level: 3,
        displayOrder: 2,
      },
    ],
  });

  // L3: Kitchen Appliances
  await prisma.category.createMany({
    data: [
      {
        name: "Blenders",
        slug: "blenders",
        parentId: kitchenAppliances.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Stand Mixers",
        slug: "stand-mixers",
        parentId: kitchenAppliances.id,
        level: 3,
        displayOrder: 2,
      },
    ],
  });

  // L3: Cleaning Appliances
  await prisma.category.createMany({
    data: [
      {
        name: "Vacuums",
        slug: "vacuums",
        parentId: cleaningAppliances.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Robot Vacuums",
        slug: "robot-vacuums",
        parentId: cleaningAppliances.id,
        level: 3,
        displayOrder: 2,
      },
    ],
  });

  // L3: Air & Climate
  await prisma.category.createMany({
    data: [
      {
        name: "Air Purifiers",
        slug: "air-purifiers",
        parentId: airClimate.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // ============================================
  // Home & Garden (L2 + L3)
  // ============================================
  const homeDecorTextiles = await prisma.category.create({
    data: {
      name: "Home Decor & Textiles",
      slug: "home-decor-textiles",
      parentId: homeGarden.id,
      level: 2,
      displayOrder: 1,
    },
  });

  const lighting = await prisma.category.create({
    data: {
      name: "Lighting",
      slug: "lighting",
      parentId: homeGarden.id,
      level: 2,
      displayOrder: 2,
    },
  });

  const kitchenDining = await prisma.category.create({
    data: {
      name: "Kitchen & Dining",
      slug: "kitchen-dining",
      parentId: homeGarden.id,
      level: 2,
      displayOrder: 3,
    },
  });

  const bathroom = await prisma.category.create({
    data: {
      name: "Bathroom",
      slug: "bathroom",
      parentId: homeGarden.id,
      level: 2,
      displayOrder: 4,
    },
  });

  const gardenOutdoor = await prisma.category.create({
    data: {
      name: "Garden & Outdoor",
      slug: "garden-outdoor",
      parentId: homeGarden.id,
      level: 2,
      displayOrder: 5,
    },
  });

  const saunaHome = await prisma.category.create({
    data: {
      name: "Sauna",
      slug: "sauna",
      parentId: homeGarden.id,
      level: 2,
      displayOrder: 6,
    },
  });

  const homeEssentials = await prisma.category.create({
    data: {
      name: "Home Essentials",
      slug: "home-essentials",
      parentId: homeGarden.id,
      level: 2,
      displayOrder: 7,
    },
  });

  // L3: Home Decor & Textiles
  await prisma.category.createMany({
    data: [
      {
        name: "Pillows & Rugs",
        slug: "pillows-rugs",
        parentId: homeDecorTextiles.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Lighting
  await prisma.category.createMany({
    data: [
      {
        name: "Ceiling Lights",
        slug: "ceiling-lights",
        parentId: lighting.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Table Lamps",
        slug: "table-lamps",
        parentId: lighting.id,
        level: 3,
        displayOrder: 2,
      },
    ],
  });

  // L3: Kitchen & Dining
  await prisma.category.createMany({
    data: [
      {
        name: "Tableware",
        slug: "tableware",
        parentId: kitchenDining.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Kitchen Tools",
        slug: "kitchen-tools",
        parentId: kitchenDining.id,
        level: 3,
        displayOrder: 2,
      },
    ],
  });

  // L3: Bathroom
  await prisma.category.createMany({
    data: [
      {
        name: "Bathroom Accessories",
        slug: "bathroom-accessories",
        parentId: bathroom.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Garden & Outdoor
  await prisma.category.createMany({
    data: [
      {
        name: "Garden Tools",
        slug: "garden-tools",
        parentId: gardenOutdoor.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Sauna
  await prisma.category.createMany({
    data: [
      {
        name: "Sauna Accessories",
        slug: "sauna-accessories",
        parentId: saunaHome.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Home Essentials
  await prisma.category.createMany({
    data: [
      {
        name: "Storage",
        slug: "storage",
        parentId: homeEssentials.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // ============================================
  // Furniture (L2 + L3)
  // ============================================
  const livingRoom = await prisma.category.create({
    data: {
      name: "Living Room",
      slug: "living-room",
      parentId: furniture.id,
      level: 2,
      displayOrder: 1,
    },
  });

  const bedroom = await prisma.category.create({
    data: {
      name: "Bedroom",
      slug: "bedroom",
      parentId: furniture.id,
      level: 2,
      displayOrder: 2,
    },
  });

  const kitchenDiningFurniture = await prisma.category.create({
    data: {
      name: "Kitchen & Dining",
      slug: "furniture-kitchen-dining",
      parentId: furniture.id,
      level: 2,
      displayOrder: 3,
    },
  });

  const kidsRoom = await prisma.category.create({
    data: {
      name: "Kids’ Room",
      slug: "kids-room",
      parentId: furniture.id,
      level: 2,
      displayOrder: 4,
    },
  });

  const officeFurniture = await prisma.category.create({
    data: {
      name: "Office Furniture",
      slug: "office-furniture",
      parentId: furniture.id,
      level: 2,
      displayOrder: 5,
    },
  });

  const storageFurniture = await prisma.category.create({
    data: {
      name: "Storage Furniture",
      slug: "storage-furniture",
      parentId: furniture.id,
      level: 2,
      displayOrder: 6,
    },
  });

  const outdoorFurniture = await prisma.category.create({
    data: {
      name: "Outdoor Furniture",
      slug: "outdoor-furniture",
      parentId: furniture.id,
      level: 2,
      displayOrder: 7,
    },
  });

  // L3: Living Room
  await prisma.category.createMany({
    data: [
      {
        name: "Sofas",
        slug: "sofas",
        parentId: livingRoom.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Armchairs",
        slug: "armchairs",
        parentId: livingRoom.id,
        level: 3,
        displayOrder: 2,
      },
    ],
  });

  // L3: Bedroom
  await prisma.category.createMany({
    data: [
      {
        name: "Beds",
        slug: "beds",
        parentId: bedroom.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Wardrobes",
        slug: "wardrobes",
        parentId: bedroom.id,
        level: 3,
        displayOrder: 2,
      },
    ],
  });

  // L3: Kitchen & Dining (Furniture)
  await prisma.category.createMany({
    data: [
      {
        name: "Tables",
        slug: "tables",
        parentId: kitchenDiningFurniture.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Chairs",
        slug: "chairs",
        parentId: kitchenDiningFurniture.id,
        level: 3,
        displayOrder: 2,
      },
    ],
  });

  // L3: Kids’ Room
  await prisma.category.createMany({
    data: [
      {
        name: "Kids’ Beds",
        slug: "kids-beds",
        parentId: kidsRoom.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Office Furniture
  await prisma.category.createMany({
    data: [
      {
        name: "Desks",
        slug: "desks",
        parentId: officeFurniture.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Office Chairs",
        slug: "office-chairs",
        parentId: officeFurniture.id,
        level: 3,
        displayOrder: 2,
      },
    ],
  });

  // L3: Storage Furniture
  await prisma.category.createMany({
    data: [
      {
        name: "Shelves",
        slug: "shelves",
        parentId: storageFurniture.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Outdoor Furniture
  await prisma.category.createMany({
    data: [
      {
        name: "Terrace Furniture",
        slug: "terrace-furniture",
        parentId: outdoorFurniture.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // ============================================
  // Building & Renovation (L2 + L3)
  // ============================================
  const buildingMaterials = await prisma.category.create({
    data: {
      name: "Building Materials",
      slug: "building-materials",
      parentId: buildingRenovation.id,
      level: 2,
      displayOrder: 1,
    },
  });

  const tools = await prisma.category.create({
    data: {
      name: "Tools",
      slug: "tools",
      parentId: buildingRenovation.id,
      level: 2,
      displayOrder: 2,
    },
  });

  const electricalSupplies = await prisma.category.create({
    data: {
      name: "Electrical Supplies",
      slug: "electrical-supplies",
      parentId: buildingRenovation.id,
      level: 2,
      displayOrder: 3,
    },
  });

  const plumbing = await prisma.category.create({
    data: {
      name: "Plumbing & Pipes",
      slug: "plumbing-pipes",
      parentId: buildingRenovation.id,
      level: 2,
      displayOrder: 4,
    },
  });

  const heatingVentilation = await prisma.category.create({
    data: {
      name: "Heating & Ventilation",
      slug: "heating-ventilation",
      parentId: buildingRenovation.id,
      level: 2,
      displayOrder: 5,
    },
  });

  const safetyProtection = await prisma.category.create({
    data: {
      name: "Safety & Protection",
      slug: "safety-protection",
      parentId: buildingRenovation.id,
      level: 2,
      displayOrder: 6,
    },
  });

  const saunasAccessories = await prisma.category.create({
    data: {
      name: "Saunas & Accessories",
      slug: "saunas-accessories",
      parentId: buildingRenovation.id,
      level: 2,
      displayOrder: 7,
    },
  });

  // L3: Building Materials
  await prisma.category.createMany({
    data: [
      {
        name: "Timber",
        slug: "timber",
        parentId: buildingMaterials.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Insulation",
        slug: "insulation",
        parentId: buildingMaterials.id,
        level: 3,
        displayOrder: 2,
      },
    ],
  });

  // L3: Tools
  await prisma.category.createMany({
    data: [
      {
        name: "Power Tools",
        slug: "power-tools",
        parentId: tools.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Hand Tools",
        slug: "hand-tools",
        parentId: tools.id,
        level: 3,
        displayOrder: 2,
      },
    ],
  });

  // L3: Electrical Supplies
  await prisma.category.createMany({
    data: [
      {
        name: "Cables",
        slug: "electrical-cables",
        parentId: electricalSupplies.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Plumbing & Pipes
  await prisma.category.createMany({
    data: [
      {
        name: "Pipe Parts",
        slug: "pipe-parts",
        parentId: plumbing.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Heating & Ventilation
  await prisma.category.createMany({
    data: [
      {
        name: "Heaters",
        slug: "heaters",
        parentId: heatingVentilation.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Safety & Protection
  await prisma.category.createMany({
    data: [
      {
        name: "Safety Gloves",
        slug: "safety-gloves",
        parentId: safetyProtection.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Saunas & Accessories
  await prisma.category.createMany({
    data: [
      {
        name: "Sauna Heaters",
        slug: "sauna-heaters",
        parentId: saunasAccessories.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // ============================================
  // Car Accessories (L2 + L3)
  // ============================================
  const carSpareParts = await prisma.category.create({
    data: {
      name: "Car Spare Parts",
      slug: "car-spare-parts",
      parentId: carAccessories.id,
      level: 2,
      displayOrder: 1,
    },
  });

  const tyresRims = await prisma.category.create({
    data: {
      name: "Tyres & Rims",
      slug: "tyres-rims",
      parentId: carAccessories.id,
      level: 2,
      displayOrder: 2,
    },
  });

  const carElectronics = await prisma.category.create({
    data: {
      name: "Car Electronics",
      slug: "car-electronics",
      parentId: carAccessories.id,
      level: 2,
      displayOrder: 3,
    },
  });

  const carCareChemicals = await prisma.category.create({
    data: {
      name: "Car Care & Chemicals",
      slug: "car-care-chemicals",
      parentId: carAccessories.id,
      level: 2,
      displayOrder: 4,
    },
  });

  const carToolsEquipment = await prisma.category.create({
    data: {
      name: "Tools & Equipment",
      slug: "car-tools-equipment",
      parentId: carAccessories.id,
      level: 2,
      displayOrder: 5,
    },
  });

  const motorcycleAccessories = await prisma.category.create({
    data: {
      name: "Motorcycle Accessories",
      slug: "motorcycle-accessories",
      parentId: carAccessories.id,
      level: 2,
      displayOrder: 6,
    },
  });

  // L3: Car Spare Parts
  await prisma.category.createMany({
    data: [
      {
        name: "Engine Parts",
        slug: "engine-parts",
        parentId: carSpareParts.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Tyres & Rims
  await prisma.category.createMany({
    data: [
      {
        name: "Summer Tyres",
        slug: "summer-tyres",
        parentId: tyresRims.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Winter Tyres",
        slug: "winter-tyres",
        parentId: tyresRims.id,
        level: 3,
        displayOrder: 2,
      },
    ],
  });

  // L3: Car Electronics
  await prisma.category.createMany({
    data: [
      {
        name: "Navigation Devices",
        slug: "navigation-devices",
        parentId: carElectronics.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Car Care & Chemicals
  await prisma.category.createMany({
    data: [
      {
        name: "Car Wash",
        slug: "car-wash",
        parentId: carCareChemicals.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Tools & Equipment
  await prisma.category.createMany({
    data: [
      {
        name: "Jacks",
        slug: "car-jacks",
        parentId: carToolsEquipment.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Motorcycle Accessories
  await prisma.category.createMany({
    data: [
      {
        name: "Helmets",
        slug: "helmets",
        parentId: motorcycleAccessories.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // ============================================
  // Food & Groceries (L2 + L3)
  // ============================================
  const fruitVegetables = await prisma.category.create({
    data: {
      name: "Fruit & Vegetables",
      slug: "fruit-vegetables",
      parentId: foodGroceries.id,
      level: 2,
      displayOrder: 1,
    },
  });

  const meatFish = await prisma.category.create({
    data: {
      name: "Meat & Fish",
      slug: "meat-fish",
      parentId: foodGroceries.id,
      level: 2,
      displayOrder: 2,
    },
  });

  const dairyProducts = await prisma.category.create({
    data: {
      name: "Dairy Products",
      slug: "dairy-products",
      parentId: foodGroceries.id,
      level: 2,
      displayOrder: 3,
    },
  });

  const breadBakery = await prisma.category.create({
    data: {
      name: "Bread & Bakery",
      slug: "bread-bakery",
      parentId: foodGroceries.id,
      level: 2,
      displayOrder: 4,
    },
  });

  const dryGoods = await prisma.category.create({
    data: {
      name: "Dry Goods",
      slug: "dry-goods",
      parentId: foodGroceries.id,
      level: 2,
      displayOrder: 5,
    },
  });

  const frozenReady = await prisma.category.create({
    data: {
      name: "Frozen & Ready Meals",
      slug: "frozen-ready-meals",
      parentId: foodGroceries.id,
      level: 2,
      displayOrder: 6,
    },
  });

  const snacksTreats = await prisma.category.create({
    data: {
      name: "Snacks & Treats",
      slug: "snacks-treats",
      parentId: foodGroceries.id,
      level: 2,
      displayOrder: 7,
    },
  });

  const drinks = await prisma.category.create({
    data: {
      name: "Drinks",
      slug: "drinks",
      parentId: foodGroceries.id,
      level: 2,
      displayOrder: 8,
    },
  });

  // L3: Fruit & Vegetables
  await prisma.category.createMany({
    data: [
      {
        name: "Fresh Produce",
        slug: "fresh-produce",
        parentId: fruitVegetables.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Meat & Fish
  await prisma.category.createMany({
    data: [
      {
        name: "Fresh Meat",
        slug: "fresh-meat",
        parentId: meatFish.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Fish",
        slug: "fish",
        parentId: meatFish.id,
        level: 3,
        displayOrder: 2,
      },
    ],
  });

  // L3: Dairy Products
  await prisma.category.createMany({
    data: [
      {
        name: "Milk",
        slug: "milk",
        parentId: dairyProducts.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Cheese",
        slug: "cheese",
        parentId: dairyProducts.id,
        level: 3,
        displayOrder: 2,
      },
    ],
  });

  // L3: Bread & Bakery
  await prisma.category.createMany({
    data: [
      {
        name: "Bread",
        slug: "bread",
        parentId: breadBakery.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Dry Goods
  await prisma.category.createMany({
    data: [
      {
        name: "Pasta",
        slug: "pasta",
        parentId: dryGoods.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Rice",
        slug: "rice",
        parentId: dryGoods.id,
        level: 3,
        displayOrder: 2,
      },
    ],
  });

  // L3: Frozen & Ready Meals
  await prisma.category.createMany({
    data: [
      {
        name: "Frozen Foods",
        slug: "frozen-foods",
        parentId: frozenReady.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Snacks & Treats
  await prisma.category.createMany({
    data: [
      {
        name: "Snacks",
        slug: "snacks",
        parentId: snacksTreats.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Drinks
  await prisma.category.createMany({
    data: [
      {
        name: "Coffee",
        slug: "coffee",
        parentId: drinks.id,
        level: 3,
        displayOrder: 1,
      },
      {
        name: "Tea",
        slug: "tea",
        parentId: drinks.id,
        level: 3,
        displayOrder: 2,
      },
    ],
  });

  // ============================================
  // Pet Supplies (L2 + L3)
  // ============================================
  const dogs = await prisma.category.create({
    data: {
      name: "Dogs",
      slug: "dogs",
      parentId: petSupplies.id,
      level: 2,
      displayOrder: 1,
    },
  });

  const cats = await prisma.category.create({
    data: {
      name: "Cats",
      slug: "cats",
      parentId: petSupplies.id,
      level: 2,
      displayOrder: 2,
    },
  });

  const smallAnimals = await prisma.category.create({
    data: {
      name: "Small Animals",
      slug: "small-animals",
      parentId: petSupplies.id,
      level: 2,
      displayOrder: 3,
    },
  });

  const birds = await prisma.category.create({
    data: {
      name: "Birds",
      slug: "birds",
      parentId: petSupplies.id,
      level: 2,
      displayOrder: 4,
    },
  });

  const fishAquariums = await prisma.category.create({
    data: {
      name: "Fish & Aquariums",
      slug: "fish-aquariums",
      parentId: petSupplies.id,
      level: 2,
      displayOrder: 5,
    },
  });

  const petPharmacy = await prisma.category.create({
    data: {
      name: "Pet Pharmacy",
      slug: "pet-pharmacy",
      parentId: petSupplies.id,
      level: 2,
      displayOrder: 6,
    },
  });

  // L3: Dogs
  await prisma.category.createMany({
    data: [
      {
        name: "Dog Food",
        slug: "dog-food",
        parentId: dogs.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Cats
  await prisma.category.createMany({
    data: [
      {
        name: "Cat Litter",
        slug: "cat-litter",
        parentId: cats.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Small Animals
  await prisma.category.createMany({
    data: [
      {
        name: "Cages",
        slug: "cages",
        parentId: smallAnimals.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Birds
  await prisma.category.createMany({
    data: [
      {
        name: "Bird Food",
        slug: "bird-food",
        parentId: birds.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Fish & Aquariums
  await prisma.category.createMany({
    data: [
      {
        name: "Aquariums",
        slug: "aquariums",
        parentId: fishAquariums.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Pet Pharmacy
  await prisma.category.createMany({
    data: [
      {
        name: "Pet Care Products",
        slug: "pet-care-products",
        parentId: petPharmacy.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // ============================================
  // Kids’ Products (L2 + L3)
  // ============================================
  const babiesToddlers = await prisma.category.create({
    data: {
      name: "Babies & Toddlers",
      slug: "babies-toddlers",
      parentId: kidsProducts.id,
      level: 2,
      displayOrder: 1,
    },
  });

  const kidsClothingEveryday = await prisma.category.create({
    data: {
      name: "Kids’ Clothing",
      slug: "kids-products-clothing",
      parentId: kidsProducts.id,
      level: 2,
      displayOrder: 2,
    },
  });

  const toysGames = await prisma.category.create({
    data: {
      name: "Toys & Games",
      slug: "toys-games",
      parentId: kidsProducts.id,
      level: 2,
      displayOrder: 3,
    },
  });

  const kidsRoomProducts = await prisma.category.create({
    data: {
      name: "Kids’ Room",
      slug: "kids-room-products",
      parentId: kidsProducts.id,
      level: 2,
      displayOrder: 4,
    },
  });

  const childcareSafety = await prisma.category.create({
    data: {
      name: "Childcare & Safety",
      slug: "childcare-safety",
      parentId: kidsProducts.id,
      level: 2,
      displayOrder: 5,
    },
  });

  const schoolLearning = await prisma.category.create({
    data: {
      name: "School & Learning",
      slug: "school-learning",
      parentId: kidsProducts.id,
      level: 2,
      displayOrder: 6,
    },
  });

  // L3: Babies & Toddlers
  await prisma.category.createMany({
    data: [
      {
        name: "Diapers",
        slug: "diapers",
        parentId: babiesToddlers.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Kids’ Clothing (Everyday)
  await prisma.category.createMany({
    data: [
      {
        name: "Everyday Wear",
        slug: "kids-everyday-wear",
        parentId: kidsClothingEveryday.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Toys & Games
  await prisma.category.createMany({
    data: [
      {
        name: "Educational Toys",
        slug: "educational-toys",
        parentId: toysGames.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Kids’ Room
  await prisma.category.createMany({
    data: [
      {
        name: "Kids’ Furniture",
        slug: "kids-furniture",
        parentId: kidsRoomProducts.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Childcare & Safety
  await prisma.category.createMany({
    data: [
      {
        name: "Safety Gates",
        slug: "safety-gates",
        parentId: childcareSafety.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: School & Learning
  await prisma.category.createMany({
    data: [
      {
        name: "School Supplies",
        slug: "school-supplies",
        parentId: schoolLearning.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // ============================================
  // Sports & Outdoor (L2 + L3)
  // ============================================
  const fitnessTraining = await prisma.category.create({
    data: {
      name: "Fitness & Training",
      slug: "fitness-training",
      parentId: sportsOutdoor.id,
      level: 2,
      displayOrder: 1,
    },
  });

  const running = await prisma.category.create({
    data: {
      name: "Running",
      slug: "running",
      parentId: sportsOutdoor.id,
      level: 2,
      displayOrder: 2,
    },
  });

  const cycling = await prisma.category.create({
    data: {
      name: "Cycling",
      slug: "cycling",
      parentId: sportsOutdoor.id,
      level: 2,
      displayOrder: 3,
    },
  });

  const winterSports = await prisma.category.create({
    data: {
      name: "Winter Sports",
      slug: "winter-sports",
      parentId: sportsOutdoor.id,
      level: 2,
      displayOrder: 4,
    },
  });

  const waterSports = await prisma.category.create({
    data: {
      name: "Water Sports",
      slug: "water-sports",
      parentId: sportsOutdoor.id,
      level: 2,
      displayOrder: 5,
    },
  });

  const campingHiking = await prisma.category.create({
    data: {
      name: "Camping & Hiking",
      slug: "camping-hiking",
      parentId: sportsOutdoor.id,
      level: 2,
      displayOrder: 6,
    },
  });

  const sportsNutrition = await prisma.category.create({
    data: {
      name: "Sports Nutrition",
      slug: "sports-nutrition",
      parentId: sportsOutdoor.id,
      level: 2,
      displayOrder: 7,
    },
  });

  // L3: Fitness & Training
  await prisma.category.createMany({
    data: [
      {
        name: "Fitness Equipment",
        slug: "fitness-equipment",
        parentId: fitnessTraining.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Running
  await prisma.category.createMany({
    data: [
      {
        name: "Running Shoes",
        slug: "sports-running-shoes",
        parentId: running.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Cycling
  await prisma.category.createMany({
    data: [
      {
        name: "Bicycles",
        slug: "bicycles",
        parentId: cycling.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Winter Sports
  await prisma.category.createMany({
    data: [
      {
        name: "Skiing",
        slug: "skiing",
        parentId: winterSports.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Water Sports
  await prisma.category.createMany({
    data: [
      {
        name: "Swimming",
        slug: "swimming",
        parentId: waterSports.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Camping & Hiking
  await prisma.category.createMany({
    data: [
      {
        name: "Tents",
        slug: "tents",
        parentId: campingHiking.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Sports Nutrition
  await prisma.category.createMany({
    data: [
      {
        name: "Protein Supplements",
        slug: "protein-supplements",
        parentId: sportsNutrition.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // ============================================
  // Books (L2 + L3)
  // ============================================
  const fiction = await prisma.category.create({
    data: {
      name: "Fiction",
      slug: "fiction",
      parentId: books.id,
      level: 2,
      displayOrder: 1,
    },
  });

  const nonFiction = await prisma.category.create({
    data: {
      name: "Non-Fiction",
      slug: "non-fiction",
      parentId: books.id,
      level: 2,
      displayOrder: 2,
    },
  });

  const textbooks = await prisma.category.create({
    data: {
      name: "Textbooks",
      slug: "textbooks",
      parentId: books.id,
      level: 2,
      displayOrder: 3,
    },
  });

  const childrensBooks = await prisma.category.create({
    data: {
      name: "Children’s Books",
      slug: "childrens-books",
      parentId: books.id,
      level: 2,
      displayOrder: 4,
    },
  });

  const comicsManga = await prisma.category.create({
    data: {
      name: "Comics & Manga",
      slug: "comics-manga",
      parentId: books.id,
      level: 2,
      displayOrder: 5,
    },
  });

  const magazinesPeriodicals = await prisma.category.create({
    data: {
      name: "Magazines & Periodicals",
      slug: "magazines-periodicals",
      parentId: books.id,
      level: 2,
      displayOrder: 6,
    },
  });

  const ebooksAudiobooks = await prisma.category.create({
    data: {
      name: "E-Books & Audiobooks",
      slug: "ebooks-audiobooks",
      parentId: books.id,
      level: 2,
      displayOrder: 7,
    },
  });

  // L3: Fiction
  await prisma.category.createMany({
    data: [
      {
        name: "Novels",
        slug: "novels",
        parentId: fiction.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Non-Fiction
  await prisma.category.createMany({
    data: [
      {
        name: "Wellness",
        slug: "wellness-nonfiction",
        parentId: nonFiction.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Textbooks
  await prisma.category.createMany({
    data: [
      {
        name: "School Books",
        slug: "school-books",
        parentId: textbooks.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Children’s Books
  await prisma.category.createMany({
    data: [
      {
        name: "Picture Books",
        slug: "picture-books",
        parentId: childrensBooks.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Comics & Manga
  await prisma.category.createMany({
    data: [
      {
        name: "Manga",
        slug: "manga",
        parentId: comicsManga.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Magazines & Periodicals
  await prisma.category.createMany({
    data: [
      {
        name: "Magazines",
        slug: "magazines",
        parentId: magazinesPeriodicals.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: E-Books & Audiobooks
  await prisma.category.createMany({
    data: [
      {
        name: "Digital Books",
        slug: "digital-books-category",
        parentId: ebooksAudiobooks.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // ============================================
  // Hobbies & Crafts (L2 + L3)
  // ============================================
  const drawingPainting = await prisma.category.create({
    data: {
      name: "Drawing & Painting",
      slug: "drawing-painting",
      parentId: hobbiesCrafts.id,
      level: 2,
      displayOrder: 1,
    },
  });

  const handicraftsSewing = await prisma.category.create({
    data: {
      name: "Handicrafts & Sewing",
      slug: "handicrafts-sewing",
      parentId: hobbiesCrafts.id,
      level: 2,
      displayOrder: 2,
    },
  });

  const craftsDIY = await prisma.category.create({
    data: {
      name: "Crafts & DIY",
      slug: "crafts-diy",
      parentId: hobbiesCrafts.id,
      level: 2,
      displayOrder: 3,
    },
  });

  const gamesPuzzles = await prisma.category.create({
    data: {
      name: "Games & Puzzles",
      slug: "games-puzzles",
      parentId: hobbiesCrafts.id,
      level: 2,
      displayOrder: 4,
    },
  });

  const instrumentsMusic = await prisma.category.create({
    data: {
      name: "Instruments & Music",
      slug: "instruments-music",
      parentId: hobbiesCrafts.id,
      level: 2,
      displayOrder: 5,
    },
  });

  const techHobbies = await prisma.category.create({
    data: {
      name: "Tech Hobbies",
      slug: "tech-hobbies",
      parentId: hobbiesCrafts.id,
      level: 2,
      displayOrder: 6,
    },
  });

  // L3: Drawing & Painting
  await prisma.category.createMany({
    data: [
      {
        name: "Colored Pencils",
        slug: "colored-pencils",
        parentId: drawingPainting.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Handicrafts & Sewing
  await prisma.category.createMany({
    data: [
      {
        name: "Yarns",
        slug: "yarns",
        parentId: handicraftsSewing.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Crafts & DIY
  await prisma.category.createMany({
    data: [
      {
        name: "DIY Kits",
        slug: "diy-kits",
        parentId: craftsDIY.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Games & Puzzles
  await prisma.category.createMany({
    data: [
      {
        name: "Board Games",
        slug: "board-games",
        parentId: gamesPuzzles.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Instruments & Music
  await prisma.category.createMany({
    data: [
      {
        name: "Guitars",
        slug: "guitars",
        parentId: instrumentsMusic.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Tech Hobbies
  await prisma.category.createMany({
    data: [
      {
        name: "3D Printing",
        slug: "3d-printing",
        parentId: techHobbies.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // ============================================
  // Office & Study (L2 + L3)
  // ============================================
  const paperProducts = await prisma.category.create({
    data: {
      name: "Paper Products",
      slug: "paper-products",
      parentId: officeStudy.id,
      level: 2,
      displayOrder: 1,
    },
  });

  const writingInstruments = await prisma.category.create({
    data: {
      name: "Writing Instruments",
      slug: "writing-instruments",
      parentId: officeStudy.id,
      level: 2,
      displayOrder: 2,
    },
  });

  const filingOrganization = await prisma.category.create({
    data: {
      name: "Filing & Organization",
      slug: "filing-organization",
      parentId: officeStudy.id,
      level: 2,
      displayOrder: 3,
    },
  });

  const printingSupplies = await prisma.category.create({
    data: {
      name: "Printing & Supplies",
      slug: "printing-supplies",
      parentId: officeStudy.id,
      level: 2,
      displayOrder: 4,
    },
  });

  const officeElectronics = await prisma.category.create({
    data: {
      name: "Office Electronics",
      slug: "office-electronics",
      parentId: officeStudy.id,
      level: 2,
      displayOrder: 5,
    },
  });

  const businessSupplies = await prisma.category.create({
    data: {
      name: "Business Supplies",
      slug: "business-supplies",
      parentId: officeStudy.id,
      level: 2,
      displayOrder: 6,
    },
  });

  // L3: Paper Products
  await prisma.category.createMany({
    data: [
      {
        name: "Printer Paper",
        slug: "printer-paper",
        parentId: paperProducts.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Writing Instruments
  await prisma.category.createMany({
    data: [
      {
        name: "Pens",
        slug: "pens",
        parentId: writingInstruments.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Filing & Organization
  await prisma.category.createMany({
    data: [
      {
        name: "Folders",
        slug: "folders",
        parentId: filingOrganization.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Printing & Supplies
  await prisma.category.createMany({
    data: [
      {
        name: "Inks",
        slug: "inks",
        parentId: printingSupplies.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Office Electronics
  await prisma.category.createMany({
    data: [
      {
        name: "Calculators",
        slug: "calculators",
        parentId: officeElectronics.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Business Supplies
  await prisma.category.createMany({
    data: [
      {
        name: "POS Supplies",
        slug: "pos-supplies",
        parentId: businessSupplies.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // ============================================
  // Cleaning & Household (L2 + L3)
  // ============================================
  const cleaningAgents = await prisma.category.create({
    data: {
      name: "Cleaning Agents",
      slug: "cleaning-agents",
      parentId: cleaningHousehold.id,
      level: 2,
      displayOrder: 1,
    },
  });

  // L3: Cleaning Agents
  await prisma.category.createMany({
    data: [
      {
        name: "All-Purpose Cleaners",
        slug: "all-purpose-cleaners",
        parentId: cleaningAgents.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  const laundryCare = await prisma.category.create({
    data: {
      name: "Laundry Care",
      slug: "laundry-care",
      parentId: cleaningHousehold.id,
      level: 2,
      displayOrder: 2,
    },
  });

  // L3: Laundry Care
  await prisma.category.createMany({
    data: [
      {
        name: "Laundry Gels",
        slug: "laundry-gels",
        parentId: laundryCare.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  const cleaningTools = await prisma.category.create({
    data: {
      name: "Cleaning Tools",
      slug: "cleaning-tools",
      parentId: cleaningHousehold.id,
      level: 2,
      displayOrder: 3,
    },
  });

  // L3: Cleaning Tools
  await prisma.category.createMany({
    data: [
      {
        name: "Mops",
        slug: "mops",
        parentId: cleaningTools.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  const disinfectionHygiene = await prisma.category.create({
    data: {
      name: "Disinfection & Hygiene",
      slug: "disinfection-hygiene",
      parentId: cleaningHousehold.id,
      level: 2,
      displayOrder: 4,
    },
  });

  // L3: Disinfection & Hygiene
  await prisma.category.createMany({
    data: [
      {
        name: "Disinfectants",
        slug: "disinfectants",
        parentId: disinfectionHygiene.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  const ecoCleaning = await prisma.category.create({
    data: {
      name: "Eco Cleaning",
      slug: "eco-cleaning",
      parentId: cleaningHousehold.id,
      level: 2,
      displayOrder: 5,
    },
  });

  // L3: Eco Cleaning
  await prisma.category.createMany({
    data: [
      {
        name: "Eco Products",
        slug: "eco-products",
        parentId: ecoCleaning.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // ============================================
  // Digital Products (L2 + L3)
  // ============================================
  const subscriptionsServices = await prisma.category.create({
    data: {
      name: "Subscriptions & Digital Services",
      slug: "subscriptions-digital-services",
      parentId: digitalProducts.id,
      level: 2,
      displayOrder: 1,
    },
  });

  const softwareLicenses = await prisma.category.create({
    data: {
      name: "Software & Licenses",
      slug: "software-licenses",
      parentId: digitalProducts.id,
      level: 2,
      displayOrder: 2,
    },
  });

  const digitalContent = await prisma.category.create({
    data: {
      name: "Digital Content",
      slug: "digital-content",
      parentId: digitalProducts.id,
      level: 2,
      displayOrder: 3,
    },
  });

  const onlineCourses = await prisma.category.create({
    data: {
      name: "Online Courses & Training",
      slug: "online-courses-training",
      parentId: digitalProducts.id,
      level: 2,
      displayOrder: 4,
    },
  });

  // L3: Subscriptions & Digital Services
  await prisma.category.createMany({
    data: [
      {
        name: "Digital Services",
        slug: "digital-services",
        parentId: subscriptionsServices.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Software & Licenses
  await prisma.category.createMany({
    data: [
      {
        name: "Software Licenses",
        slug: "software-license-keys",
        parentId: softwareLicenses.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Digital Content
  await prisma.category.createMany({
    data: [
      {
        name: "Templates",
        slug: "digital-templates",
        parentId: digitalContent.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Online Courses & Training
  await prisma.category.createMany({
    data: [
      {
        name: "Online Courses",
        slug: "online-courses",
        parentId: onlineCourses.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // ============================================
  // Gift Cards (L2 + L3)
  // ============================================
  const generalGiftCards = await prisma.category.create({
    data: {
      name: "General Gift Cards",
      slug: "general-gift-cards",
      parentId: giftCards.id,
      level: 2,
      displayOrder: 1,
    },
  });

  const categoryGiftCards = await prisma.category.create({
    data: {
      name: "Gift Cards by Category",
      slug: "category-gift-cards",
      parentId: giftCards.id,
      level: 2,
      displayOrder: 2,
    },
  });

  const experienceServices = await prisma.category.create({
    data: {
      name: "Experiences & Services",
      slug: "experience-gift-cards",
      parentId: giftCards.id,
      level: 2,
      displayOrder: 3,
    },
  });

  const businessGiftCards = await prisma.category.create({
    data: {
      name: "Business Gift Cards",
      slug: "business-gift-cards",
      parentId: giftCards.id,
      level: 2,
      displayOrder: 4,
    },
  });

  // L3: General Gift Cards
  await prisma.category.createMany({
    data: [
      {
        name: "E-Gift Cards",
        slug: "e-gift-cards",
        parentId: generalGiftCards.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Gift Cards by Category
  await prisma.category.createMany({
    data: [
      {
        name: "Fashion",
        slug: "fashion-gift-cards",
        parentId: categoryGiftCards.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Experiences & Services
  await prisma.category.createMany({
    data: [
      {
        name: "Experience Packages",
        slug: "experience-packages",
        parentId: experienceServices.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  // L3: Business Gift Cards
  await prisma.category.createMany({
    data: [
      {
        name: "B2B Gift Cards",
        slug: "b2b-gift-cards",
        parentId: businessGiftCards.id,
        level: 3,
        displayOrder: 1,
      },
    ],
  });

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
