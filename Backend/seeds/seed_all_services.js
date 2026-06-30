const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const Salon = require("../models/Salon");
const Service = require("../models/Service");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/BarberAutomation";

const servicesToSeed = [
  // ─── MEN'S SERVICES (40) ───
  // styling (10)
  {
    name: "Classic Executive Cut",
    category: "men",
    price: 350,
    duration: 35,
    description: "A timeless, sharp haircut designed for a professional aesthetic.",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Modern Fade (Skin/Low/Drop)",
    category: "men",
    price: 450,
    duration: 40,
    description: "Ultra-precise gradient fade using clippers and detailers.",
    image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Premium Keratin Infusion",
    category: "men",
    price: 2200,
    duration: 90,
    description: "Hair softening and frizz-reduction treatment for men.",
    image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Indian Wedding Grooming",
    category: "men",
    price: 1500,
    duration: 60,
    description: "Complete luxury hair styling and setting for grooms and wedding guests.",
    image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Kids' Style Cut",
    category: "men",
    price: 250,
    duration: 25,
    description: "Fun, quick hair styling and cutting for children under 12.",
    image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Slick Back Classic Pompadour",
    category: "men",
    price: 500,
    duration: 45,
    description: "Classic slicked back haircut styled with premium high-shine pomade.",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Buzz Cut & Edge-up",
    category: "men",
    price: 200,
    duration: 20,
    description: "Clean, ultra-short buzz cut with sharp razor edge detailing.",
    image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Textured Crop Fade",
    category: "men",
    price: 400,
    duration: 40,
    description: "Modern messy textured top with short high-skin fade sides.",
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Bollywood Premium Styling",
    category: "men",
    price: 800,
    duration: 45,
    description: "Premium celebrity-inspired haircut and volume blow dry styling.",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Scalp Detox & Cut Combo",
    category: "men",
    price: 900,
    duration: 50,
    description: "Detoxifying scalp wash paired with a precise haircut.",
    image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=600&auto=format&fit=crop&q=80"
  },
  // beard (10)
  {
    name: "Beard Sculpting",
    category: "men",
    price: 250,
    duration: 30,
    description: "Expert trimming, shaping, and line-up with hot towel finish.",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Royal Shave Ritual",
    category: "men",
    price: 450,
    duration: 40,
    description: "Traditional straight-razor shave with premium essential oils.",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Beard Hydration & Wash",
    category: "men",
    price: 300,
    duration: 25,
    description: "Deep conditioning wash followed by nourishing oil massage.",
    image: "https://images.unsplash.com/photo-1620331311520-246422fd82f9?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Mustache Styling & Trim",
    category: "men",
    price: 150,
    duration: 15,
    description: "Precise mustache trimming and styling with natural styling wax.",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Charcoal Beard Softening",
    category: "men",
    price: 400,
    duration: 30,
    description: "Activated charcoal treatment to soften rough, dry beard hair.",
    image: "https://images.unsplash.com/photo-1593702295094-aec22597af65?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Signature Hot Towel Shave",
    category: "men",
    price: 350,
    duration: 30,
    description: "Classic wet shave with rich lather and multiple hot towels.",
    image: "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Beard Color Touch-up",
    category: "men",
    price: 500,
    duration: 35,
    description: "Quick gray hair coverage for a younger, natural beard look.",
    image: "https://images.unsplash.com/photo-1595475207225-41836d4b9e5b?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Indian Royal Beard Styling",
    category: "men",
    price: 600,
    duration: 45,
    description: "Luxury royal grooming fit for premium style occasions.",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Detox Clay Beard Mask",
    category: "men",
    price: 450,
    duration: 30,
    description: "Soothing natural bentonite clay mask for healthy beard roots.",
    image: "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Classic Clean Shave",
    category: "men",
    price: 200,
    duration: 20,
    description: "Traditional smooth clean shave using premium cooling gel.",
    image: "https://images.unsplash.com/photo-1605497746444-052d5b597d15?w=600&auto=format&fit=crop&q=80"
  },
  // spa (10)
  {
    name: "Gentleman's Facial",
    category: "men",
    price: 800,
    duration: 45,
    description: "Deep-cleansing treatment to remove impurities and rejuvenate skin.",
    image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Scalp Revitalize Massage",
    category: "men",
    price: 400,
    duration: 30,
    description: "Invigorating scalp massage and oil treatment for hair health.",
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Indian Ayurvedic Head Massage",
    category: "men",
    price: 500,
    duration: 35,
    description: "Classic stress-relieving champi massage with traditional oils.",
    image: "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Detoxifying Charcoal Mask",
    category: "men",
    price: 600,
    duration: 30,
    description: "Activated peel-off mask to cleanse pores and remove blackheads.",
    image: "https://images.unsplash.com/photo-1634449571010-02c2930788c5?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Premium Face & Neck Massage",
    category: "men",
    price: 550,
    duration: 30,
    description: "Relaxing face massage using rich herbal massage creams.",
    image: "https://images.unsplash.com/photo-1453396450673-3fe83d2db2c4?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Tan Removal Peel-off Mask",
    category: "men",
    price: 450,
    duration: 25,
    description: "Advanced de-tan treatment to restore natural skin brightness.",
    image: "https://images.unsplash.com/photo-1609542449464-48e229fdbc7a?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Anti-Stress Neck & Shoulder Rub",
    category: "men",
    price: 400,
    duration: 20,
    description: "Short acupressure massage targeting upper back tension.",
    image: "https://images.unsplash.com/photo-1607460541894-4db6b2a90f89?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Hydrating Aloe Vera Facial",
    category: "men",
    price: 700,
    duration: 40,
    description: "Soothing natural aloe facial treatment for sun-burnt skin.",
    image: "https://images.unsplash.com/photo-1579038773867-044c48829161?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Ice Cool Mint Scalp Massage",
    category: "men",
    price: 450,
    duration: 25,
    description: "Refreshing cooling head massage using organic mint extracts.",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Aromatherapy Facial Spa",
    category: "men",
    price: 1200,
    duration: 50,
    description: "Luxury face massage utilizing premium natural essential oils.",
    image: "https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=600&auto=format&fit=crop&q=80"
  },
  // color (10)
  {
    name: "Grey Blending",
    category: "men",
    price: 1000,
    duration: 60,
    description: "Subtle colour application to reduce grey hair naturally.",
    image: "https://images.unsplash.com/photo-1597764693654-15b3a1e7b6c4?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Global Hair Highlight",
    category: "men",
    price: 1499,
    duration: 75,
    description: "Bold highlights or global coloring for modern styling.",
    image: "https://images.unsplash.com/photo-1454094309557-181967334e22?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Beard Global Coloring",
    category: "men",
    price: 600,
    duration: 40,
    description: "Even global beard coloring using premium ammonia-free colors.",
    image: "https://images.unsplash.com/photo-1654805983816-0efe3ee3f8bd?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Root Touch-Up (Men)",
    category: "men",
    price: 800,
    duration: 45,
    description: "Quick hair root touch up to cover emerging grey hair.",
    image: "https://images.unsplash.com/photo-1696497327672-2bdce2e033dd?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Fashion Streaks (Per Streak)",
    category: "men",
    price: 300,
    duration: 30,
    description: "Single highlight foils with bold electric fashion shades.",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Ammonia-Free Organic Color",
    category: "men",
    price: 1200,
    duration: 60,
    description: "Global hair coloring using certified organic herbal dyes.",
    image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Premium Beard Glossing",
    category: "men",
    price: 500,
    duration: 30,
    description: "Shine-boosting gloss application to soften and enrich beard tone.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Platinum Blonde Highlights",
    category: "men",
    price: 1999,
    duration: 90,
    description: "High-lift platinum highlighting foils with bond protection.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Natural Henna Treatment",
    category: "men",
    price: 500,
    duration: 60,
    description: "Soothing organic henna application for natural reddish-brown tones.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Mustache & Beard Color Combo",
    category: "men",
    price: 900,
    duration: 50,
    description: "Complete beard and mustache color mapping with root grooming.",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80"
  },

  // ─── WOMEN'S SERVICES (40) ───
  // styling (10)
  {
    name: "Precision Cut & Blow Dry",
    category: "women",
    price: 750,
    duration: 60,
    description: "Tailored haircut styled with professional volume.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Bridal Style & Updo",
    category: "women",
    price: 2999,
    duration: 90,
    description: "Couture bridal hair design for weddings and special occasions.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Couture Hair Styling (Curling/Straightening)",
    category: "women",
    price: 1200,
    duration: 45,
    description: "Professional heat styling for a sleek or wavy look.",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Layered Cut & Blowout",
    category: "women",
    price: 999,
    duration: 60,
    description: "Classic layered haircut finished with a premium blowout.",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Creative Hair Makeover",
    category: "women",
    price: 1500,
    duration: 75,
    description: "Complete style redesign with customized color consult.",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Express Hair Wash & Blow Dry",
    category: "women",
    price: 499,
    duration: 30,
    description: "Quick wash and dry for style on the go.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Kids Girls Styling & Cut",
    category: "women",
    price: 400,
    duration: 35,
    description: "Gentle styling and haircutting for young girls.",
    image: "https://images.unsplash.com/photo-1643402305704-474b129161a5?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Bollywood Signature Blowout",
    category: "women",
    price: 1100,
    duration: 50,
    description: "High-volume celebrity blowout with long-lasting hold.",
    image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Anti-Frizz Hair Styling",
    category: "women",
    price: 800,
    duration: 40,
    description: "Smooth heat styling using humidity protection serums.",
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Premium Hot Iron Styling",
    category: "women",
    price: 1300,
    duration: 50,
    description: "Long-lasting flat iron straightening or wand curls.",
    image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&auto=format&fit=crop&q=80"
  },
  // color (10)
  {
    name: "Global Hair Coloring",
    category: "women",
    price: 2199,
    duration: 100,
    description: "Rich global color transformation using ammonia-free pigments.",
    image: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Signature Balayage",
    category: "women",
    price: 3999,
    duration: 150,
    description: "Hand-painted highlights for natural, sun-kissed dimensional depth.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Ammonia-Free Root Touchup",
    category: "women",
    price: 999,
    duration: 45,
    description: "Grey coverage root touchup with gentle organic formulas.",
    image: "https://i.pinimg.com/1200x/8d/21/29/8d2129c8a618f113eb8aa2bc596b1658.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Ombre Hair Transformation",
    category: "women",
    price: 4499,
    duration: 160,
    description: "Gradient color transition from dark roots to light ends.",
    image: "https://i.pinimg.com/736x/7e/7d/b6/7e7db69384f023cf935f954d09e5f5c3.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Fashion Color Streaks (3 Foils)",
    category: "women",
    price: 899,
    duration: 50,
    description: "Vibrant custom fashion shades applied to accent sections.",
    image: "https://i.pinimg.com/1200x/7f/c5/a2/7fc5a2bfa31be902b66a6049d8f4b890.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Blonde Highlights Accent",
    category: "women",
    price: 2499,
    duration: 90,
    description: "Face-framing highlighting foils for a bright, sun-kissed look.",
    image: "https://i.pinimg.com/736x/f5/74/dc/f574dc0a7ae5e8937e0d923b95fdbfa4.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Indian Henna Pack Application",
    category: "women",
    price: 799,
    duration: 70,
    description: "Traditional cooling scalp henna pack for color and shine.",
    image: "https://i.pinimg.com/736x/c4/af/f7/c4aff7cfc65e4a207eb6d58bbfdb37a2.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Shine Toner & Color Glaze",
    category: "women",
    price: 1499,
    duration: 60,
    description: "Express glaze treatment to refresh faded global hair color.",
    image: "https://i.pinimg.com/736x/24/0f/56/240f567877004691c5f56df55ab368d2.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Full Global Highlights",
    category: "women",
    price: 4999,
    duration: 180,
    description: "Complete head-turned highlights with customized tone mapping.",
    image: "https://i.pinimg.com/1200x/69/03/4b/69034b21f1c6a462bc242526af9455bd.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Crown Area Highlights Touch-up",
    category: "women",
    price: 1999,
    duration: 90,
    description: "Crown section highlights touch up to refresh existing color.",
    image: "https://i.pinimg.com/736x/44/75/cf/4475cf227f367f74d7dfe6d7e3a64086.jpg?w=600&auto=format&fit=crop&q=80"
  },
  // spa (10)
  {
    name: "Organic Oil Head Massage",
    category: "women",
    price: 450,
    duration: 30,
    description: "Luxurious oil treatment for hair nourishment and scalp relaxation.",
    image: "https://i.pinimg.com/736x/1d/4b/93/1d4b938c2be5d8cac2c40116795291e5.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Hydrating Hair Spa",
    category: "women",
    price: 999,
    duration: 50,
    description: "Rejuvenating cream-bath spa treatment for dry, damaged hair.",
    image: "https://i.pinimg.com/736x/68/42/21/6842217cdd12a7e73b0c6fd4d347240f.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Therapeutic Scalp Cleansing",
    category: "women",
    price: 1200,
    duration: 45,
    description: "Exfoliating treatment for healthy roots and hair growth.",
    image: "https://i.pinimg.com/736x/1f/46/b1/1f46b1993f85aed2698535c310a6baac.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Relaxing Neck & Back Therapy",
    category: "women",
    price: 800,
    duration: 35,
    description: "Pressure point back massage with cooling herbal massage balms.",
    image: "https://i.pinimg.com/1200x/c9/19/5b/c9195b3d76fedee86ae1031791d732cb.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Anti-Dandruff Scalp Treatment",
    category: "women",
    price: 1100,
    duration: 50,
    description: "Targeted tea-tree scalp peeling treatment for dandruff removal.",
    image: "https://res.klook.com/image/upload/w_750,h_469,c_fill,q_85/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/fchn5h7dfr2mmbbw3nq4.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Intense Nourishing Cream Spa",
    category: "women",
    price: 1299,
    duration: 60,
    description: "Deep hydration hair spa mask with warm steam conditioning.",
    image: "https://i.pinimg.com/736x/b2/f0/73/b2f073d74bf0ee78c31cb870f7bb0d2a.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Ayurvedic Hair Vitality Ritual",
    category: "women",
    price: 1399,
    duration: 70,
    description: "Bhringraj and amla oil head massage for structural hair strength.",
    image: "https://i.pinimg.com/736x/d5/42/e3/d542e36a5630e84bcc7f0214474247e3.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Detoxifying Charcoal Spa",
    category: "women",
    price: 1199,
    duration: 50,
    description: "Absorbent charcoal scalp spa to clear product build-up.",
    image: "https://i.pinimg.com/736x/32/38/c2/3238c237da8df8e986de51ee9ee02f9b.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Deep Moisture Oil Therapy",
    category: "women",
    price: 600,
    duration: 40,
    description: "Hot coconut and almond oil scalp massage treatment.",
    image: "https://i.pinimg.com/736x/28/74/2e/28742e65243fd1b4edb58f71f49a7816.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Aromatic Scalp Soothing Treatment",
    category: "women",
    price: 950,
    duration: 45,
    description: "Lavender oil infused scalp massage to relieve deep stress.",
    image: "https://media.istockphoto.com/id/1305824214/photo/woman-dyeing-her-hair-at-the-salon.jpg?w=600&auto=format&fit=crop&q=80"
  },
  // treatments (10)
  {
    name: "Cysteine Smoothing Treatment",
    category: "women",
    price: 4999,
    duration: 180,
    description: "Premium safe protein smoothing treatment for frizz-free hair.",
    image: "https://i.pinimg.com/736x/ae/65/e3/ae65e3f17deb79872414b037fd997045.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Advanced Keratin Therapy",
    category: "women",
    price: 3499,
    duration: 120,
    description: "Deep repair treatment to restore shine and strength.",
    image: "https://i.pinimg.com/736x/b6/ff/a4/b6ffa4916c9b5f375ba8b01987a07fcc.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Olaplex Damage Repair",
    category: "women",
    price: 1800,
    duration: 60,
    description: "Deep bond-building treatment to restore chemical-damaged hair.",
    image: "https://i.pinimg.com/736x/43/40/f4/4340f4e24eb2ccfde6d8f566459c34d2.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Pro-Keratin Shine Therapy",
    category: "women",
    price: 2999,
    duration: 110,
    description: "Pro-keratin styling treatment to restore smooth mirror shine.",
    image: "https://i.pinimg.com/736x/77/8b/72/778b7245d8b88d8b9bb8e5621379d2b2.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Anti-Hairfall Laser Therapy",
    category: "women",
    price: 5999,
    duration: 90,
    description: "Advanced low-level laser therapy mapping to stimulate roots.",
    image: "https://i.pinimg.com/736x/89/3e/2a/893e2a77f98ee1d8a1dbcb9c25da7eb6.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Biotin Nourishing Infusion",
    category: "women",
    price: 3200,
    duration: 80,
    description: "Intense vitamin B7 biotin injection treatment for hair thickness.",
    image: "https://i.pinimg.com/736x/cb/a1/38/cba138e12154db034df4e287bfef83c3.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Volume-Boost Root Treatment",
    category: "women",
    price: 1500,
    duration: 45,
    description: "Targeted root volumizing styling mask for fine hair texture.",
    image: "https://i.pinimg.com/736x/81/4f/7b/814f7b2bd34a5d89bbd8f28df13b2ce2.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Organic Frizz-Free Smoothing",
    category: "women",
    price: 4500,
    duration: 150,
    description: "Organic botanical smoothing mask with plant-based proteins.",
    image: "https://i.pinimg.com/736x/d6/33/c4/d633c41ea4ee63b40d6c97a8e2cb2c9a.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Silk Protein Glazing",
    category: "women",
    price: 2200,
    duration: 70,
    description: "Glossy silk protein glazing treatment to seal cuticle shafts.",
    image: "https://i.pinimg.com/736x/5f/aa/df/5faadfc9cc51608034db3fe91a5db4b4.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Scalp Hydradermie Treatment",
    category: "women",
    price: 2500,
    duration: 60,
    description: "Hydradermie dry scalp healing mask to prevent irritation.",
    image: "https://i.pinimg.com/1200x/33/92/d6/3392d6b561434dde4bd4f71ba0335449.jpg?w=600&auto=format&fit=crop&q=80"
  },

  // ─── ADDON SERVICES (30) ───
  // massage (10)
  {
    name: "Aromatherapy Scalp Massage",
    category: "addon",
    price: 299,
    duration: 20,
    description: "Deep-pressure scalp massage using premium essential oils to relieve tension.",
    image: "https://i.pinimg.com/1200x/a7/84/59/a784597c5a31691b0c652634fa4726b5.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Acupressure Shoulder Relief",
    category: "addon",
    price: 399,
    duration: 25,
    description: "Targeted tension-release massage for neck and shoulders using warm massage balms.",
    image: "https://i.pinimg.com/736x/4a/14/cb/4a14cb4a8f9eb9dbbfbf2ca8cfb2c8cf.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Charcoal Beard Detox",
    category: "addon",
    price: 449,
    duration: 20,
    description: "Premium charcoal scrub and wash to cleanse and soften beard follicles.",
    image: "https://i.pinimg.com/736x/de/5b/4b/de5b4be8e1f0e20cbda1b9ccb249a5db.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Relaxing Foot Reflexology",
    category: "addon",
    price: 350,
    duration: 20,
    description: "Acupressure foot massage targeting stress points to improve blood flow.",
    image: "https://i.pinimg.com/736x/21/df/b8/21dfb85848bb22be4e2354fdf8bb0c0c.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Warm Herbal Oil Champo",
    category: "addon",
    price: 250,
    duration: 15,
    description: "Traditional hot herbal oil application with vigorous champi massage.",
    image: "https://i.pinimg.com/736x/6f/a7/df/6fa7dfa7cfb2ca3a9cbda1bc8dbf03a6.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Quick Eye Stress Relief",
    category: "addon",
    price: 199,
    duration: 10,
    description: "Cooling cucumber compress and temple massage for tired eyes.",
    image: "https://i.pinimg.com/736x/91/9d/b1/919db1c5240f9076f8aebcfbe9aef7c5.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Face Roller Massage",
    category: "addon",
    price: 150,
    duration: 10,
    description: "Gentle jade rolling face massage to reduce puffiness and soothe facial muscles.",
    image: "https://i.pinimg.com/736x/29/cf/5c/29cf5ce4e7b8f9e1e12762b3fdff40cb.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Deep Back Relief",
    category: "addon",
    price: 450,
    duration: 25,
    description: "Targeted upper back deep-tissue rub to release knots and stiffness.",
    image: "https://i.pinimg.com/736x/bd/8a/76/bd8a760bdf73df011bd7e4115162a8c3.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Mint Cooling Champo",
    category: "addon",
    price: 299,
    duration: 20,
    description: "Champi head massage using organic cooling peppermint scalp oil.",
    image: "https://i.pinimg.com/736x/55/a7/df/55a7df4c0803a111b7dfb8997a47fb72.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Head & Temples Rub",
    category: "addon",
    price: 199,
    duration: 15,
    description: "Quick dry scalp massage focusing on temples to relieve headaches.",
    image: "https://i.pinimg.com/736x/6d/46/74/6d4674395df3d0a29430803cbe31bc2a.jpg?w=600&auto=format&fit=crop&q=80"
  },
  // treatment (10)
  {
    name: "Deep Conditioning Mask",
    category: "addon",
    price: 499,
    duration: 30,
    description: "Moisture-rich nourishing treatment mask for dry or chemically treated hair.",
    image: "https://i.pinimg.com/1200x/74/7a/aa/747aaa2f4f8b5262a552aa4baed6ff60.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Express Keratin Booster",
    category: "addon",
    price: 799,
    duration: 40,
    description: "Quick leave-in keratin protein infusion to reduce frizz and restore shine.",
    image: "https://i.pinimg.com/1200x/81/e1/c2/81e1c2e2bc7932c9abaa57c4a9e46a41.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Instant Bond-Repair Shield",
    category: "addon",
    price: 1199,
    duration: 30,
    description: "Olaplex-infused quick bond strengthening treatment during styling.",
    image: "https://i.pinimg.com/1200x/16/ad/e0/16ade0c394f6e919f1f6dc05c3206d8d.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Anti-Frizz Serum Infusion",
    category: "addon",
    price: 599,
    duration: 20,
    description: "Ultrasonic infusion of professional anti-frizz serums for high humidity protection.",
    image: "https://i.pinimg.com/1200x/ed/ba/9c/edba9c8e676663d02abbac15f2067a53.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Citrus Scalp Scrub",
    category: "addon",
    price: 699,
    duration: 25,
    description: "Exfoliating salicylic acid and citrus scalp scrub to eliminate buildup.",
    image: "https://i.pinimg.com/1200x/79/1b/d4/791bd40e7756ad08631dbb79b6600e95.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Protein Nourishing Spray",
    category: "addon",
    price: 299,
    duration: 15,
    description: "Leave-in protein spray that detangles and rebuilds weak strands.",
    image: "https://i.pinimg.com/736x/40/74/1c/40741c14e86e555444044a7fc5c73667.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Leave-in Moroccan Argan Shot",
    category: "addon",
    price: 399,
    duration: 15,
    description: "Concentrated shot of pure Moroccan argan oil to seal split ends.",
    image: "https://i.pinimg.com/1200x/bb/db/62/bbdb6220af39cd2ce5e4fde1271babc7.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Volumizing Root Boost",
    category: "addon",
    price: 499,
    duration: 20,
    description: "Root-lifting treatment spray that adds height and bounce to flat hair.",
    image: "https://i.pinimg.com/1200x/86/55/da/8655da48743eeb8a7d6418ffdc8104ca.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Scalp Cooling Serum Ampoule",
    category: "addon",
    price: 550,
    duration: 15,
    description: "Tea tree and menthol ampoule to reduce scalp itchiness and irritation.",
    image: "https://i.pinimg.com/736x/ff/0b/10/ff0b100cd3e9e3e6dd4e097955885056.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Split-End Prevention treatment",
    category: "addon",
    price: 450,
    duration: 20,
    description: "Heat-activated nourishing cream designed to mend and prevent split ends.",
    image: "https://i.pinimg.com/1200x/2f/b8/72/2fb8722cd56fc94c01424fa12785641e.jpg?w=600&auto=format&fit=crop&q=80"
  },
  // color (10)
  {
    name: "Premium Shine Glaze / Toner",
    category: "addon",
    price: 999,
    duration: 45,
    description: "Express glossing or color toner to refresh hair vibrancy and shine.",
    image: "https://i.pinimg.com/736x/1d/77/07/1d77071c06be4c6c861511fca8260837.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Silver / Grey Glossing",
    category: "addon",
    price: 899,
    duration: 30,
    description: "Express toner to neutralize brassy tones in blonde, grey, or silver hair.",
    image: "https://i.pinimg.com/736x/58/4d/15/584d151c34e2767f013cbcd38a4103cc.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Gold Highlights Accents (2 foils)",
    category: "addon",
    price: 599,
    duration: 30,
    description: "Dual accent highlight foils for an express sun-kissed look.",
    image: "https://i.pinimg.com/736x/f3/20/ad/f320ad568c178911c0df440181ad0955.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Color Protect Lock Sealant",
    category: "addon",
    price: 499,
    duration: 20,
    description: "Acidic pH treatment that locks pigments in and seals the hair cuticle.",
    image: "https://i.pinimg.com/736x/1f/40/f1/1f40f1ff92767d608252cb554a34ccb5.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Hair Gloss & Luster Spa",
    category: "addon",
    price: 799,
    duration: 30,
    description: "Clear glossing mask that adds glass-like shine without changing color.",
    image: "https://i.pinimg.com/1200x/04/c5/b2/04c5b2b30680f2b5932ca7e6d80f7702.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Copper / Caramel Glaze Refresher",
    category: "addon",
    price: 899,
    duration: 35,
    description: "Color-depositing express glaze to restore warm copper and gold tones.",
    image: "https://i.pinimg.com/1200x/44/46/a2/4446a28a6f30eae2f008d243d6ff460b.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Fashion Streaks booster",
    category: "addon",
    price: 399,
    duration: 20,
    description: "Toner boost to maintain bright fantasy colors like purple, blue, or red.",
    image: "https://i.pinimg.com/1200x/3e/56/86/3e56867afc33e00ee0ca9d5ae850fc0c.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Root Shadow blending",
    category: "addon",
    price: 699,
    duration: 30,
    description: "Smudge root glaze to soften the transition line from natural roots.",
    image: "https://i.pinimg.com/736x/7a/ad/00/7aad00b196e28483ad3b2bc6d5ccd818.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Ammonia-Free color gloss",
    category: "addon",
    price: 750,
    duration: 25,
    description: "Semi-permanent organic gloss to add subtle hues and nourish cuticles.",
    image: "https://i.pinimg.com/736x/d3/7f/85/d37f854123209471bdca3ff76040abdc.jpg?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Balayage glow booster",
    category: "addon",
    price: 899,
    duration: 30,
    description: "Post-bleach highlighting glaze that locks moisture and adds light reflection.",
    image: "https://i.pinimg.com/1200x/ed/65/ee/ed65eef9616d21b73dea4ebc08bbc43a.jpg?w=600&auto=format&fit=crop&q=80"
  }
];

const seedAllServices = async () => {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");

    const salons = await Salon.find({});
    if (salons.length === 0) {
      console.log("No salons found in database. Cannot seed services.");
      process.exit(0);
    }

    console.log(`Found ${salons.length} salons. Updating services...`);

    // Clear existing Service collection entries
    await Service.deleteMany({});
    console.log("Cleared existing Services collection.");

    let salonIdx = 0;
    for (const salon of salons) {
      console.log(`Processing salon: ${salon.salon_name} (${salon._id})`);
      
      const menSvcs = servicesToSeed.filter(s => s.category === "men");
      const womenSvcs = servicesToSeed.filter(s => s.category === "women");
      const addonSvcs = servicesToSeed.filter(s => s.category === "addon");

      // Select 20 men's, 20 women's, 10 addons based on salonIdx
      const selectedMen = menSvcs.filter((_, idx) => (idx + salonIdx) % 2 === 0); // 20 services
      const selectedWomen = womenSvcs.filter((_, idx) => (idx + salonIdx) % 2 === 0); // 20 services
      const selectedAddon = addonSvcs.filter((_, idx) => (idx + salonIdx) % 3 === 0); // 10 services

      const salonServices = [...selectedMen, ...selectedWomen, ...selectedAddon]; // exactly 50 services!

      console.log(`Selected ${salonServices.length} services (Men: ${selectedMen.length}, Women: ${selectedWomen.length}, Addons: ${selectedAddon.length}) for ${salon.salon_name}`);

      // Update the salon's offered services and prices in the Salon schema
      const serviceOffers = salonServices.map(s => s.name);
      const servicePrices = {};
      salonServices.forEach(s => {
        servicePrices[s.name] = s.price;
      });

      salon.services_offered = serviceOffers;
      salon.service_prices = servicePrices;
      await salon.save();

      // Create service catalog entries in the Service collection
      for (const svc of salonServices) {
        await Service.create({
          salon_id: salon._id,
          name: svc.name,
          category: svc.category,
          price: svc.price,
          duration: svc.duration,
          image: svc.image,
          description: svc.description,
          is_active: true
        });
      }

      salonIdx++;
    }

    console.log("Successfully seeded 50 diverse premium services for all salons!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding services:", err);
    process.exit(1);
  }
};

seedAllServices();
