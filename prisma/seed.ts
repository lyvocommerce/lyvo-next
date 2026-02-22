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
