/**
 * NoidaGym Marketplace - Data Store
 * Initial dataset focused on Noida, Uttar Pradesh, India.
 * Includes realistic sample listings across Sectors 18, 38, 50, 62, 76, 104, 127, and 153.
 */

const NOIDA_SECTORS = [
  { id: 'all', name: 'All Noida' },
  { id: 'sector-18', name: 'Sector 18 (Atta / Metro)' },
  { id: 'sector-38', name: 'Sector 38 / GIP' },
  { id: 'sector-50', name: 'Sector 50 (Central)' },
  { id: 'sector-62', name: 'Sector 62 (Electronic City)' },
  { id: 'sector-76', name: 'Sector 76 (Metro 76)' },
  { id: 'sector-104', name: 'Sector 104 (Expressway)' },
  { id: 'sector-127', name: 'Sector 127 (Tech Boulevard)' },
  { id: 'sector-153', name: 'Sector 153 (Greater Noida Link)' }
];

const NOIDA_GYMS = [
  {
    id: 'pulsefit-elite-104',
    name: 'PulseFit Elite Athletic Club',
    tagline: 'Premium strength, functional turf & heated wellness recovery',
    type: 'Premium Club',
    sector: 'Sector 104',
    sectorId: 'sector-104',
    landmark: 'Hazipur Market, Near Expressway Service Road',
    address: 'Plot 42, Block B, Sector 104, Noida, UP 201304',
    coordinates: { lat: 28.5355, lng: 77.3644 },
    rating: 4.8,
    reviewCount: 142,
    isSample: true,
    isPartner: true,
    statusBadge: 'Verified Marketplace Partner',
    startingPrice: 3200,
    hasPriceOnContact: false,
    trialAvailable: true,
    trialType: 'Free 1-Day Trial',
    trialFee: 0,
    dayPassFee: 499,
    openingHours: {
      weekday: '5:30 AM - 11:00 PM',
      weekend: '6:00 AM - 10:00 PM',
      is24Hours: false,
      womenOnlyTimings: '11:30 AM - 1:00 PM (Mon-Sat)'
    },
    images: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1200&q=80'
    ],
    facilities: [
      'Free Weights & Dumbbells (up to 55kg)',
      'CrossFit Rig & Turf',
      'Steam & Sauna Bath',
      'Swimming Pool (Heated in Winter)',
      'Certified Personal Trainers',
      'Locker & Shower Rooms',
      'Valet & Basement Parking',
      'Air Conditioned',
      'Nutritional Juice Bar',
      'Dedicated Women Timings'
    ],
    facilityTags: ['strength', 'crossfit', 'steam', 'pool', 'trainers', 'parking', 'women-timings', 'lockers'],
    classes: ['HIIT & Bootcamp', 'Yoga for Athletes', 'Spinning / Indoor Cycling', 'Power Zumba'],
    plans: [
      {
        id: 'pf-1m',
        name: '1 Month Flex Pass',
        duration: '1 Month',
        months: 1,
        basePrice: 3800,
        gstRate: 0.18,
        joiningFee: 500,
        totalPrice: 4984,
        features: ['Full gym & cardio floor access', 'Steam & sauna on weekends', 'Initial fitness assessment', 'Locker & shower facilities'],
        pausePolicy: 'No pause permitted on 1-month plan',
        refundPolicy: 'Refund eligible within 48 hours of purchase before first check-in'
      },
      {
        id: 'pf-3m',
        name: '3 Months Quarter Plan',
        duration: '3 Months',
        months: 3,
        basePrice: 9600,
        gstRate: 0.18,
        joiningFee: 0,
        totalPrice: 11328,
        popular: true,
        features: ['All gym & cardio access', 'Unlimited steam & sauna', '2 Personal Trainer strategy sessions', '15-day membership freeze option', 'Access to all weekend group classes'],
        pausePolicy: '1 freeze allowance up to 15 days with 48h prior notice',
        refundPolicy: '7-day satisfaction window minus ₹1,000 administrative charge'
      },
      {
        id: 'pf-12m',
        name: '12 Months Annual Elite',
        duration: '12 Months',
        months: 12,
        basePrice: 28000,
        gstRate: 0.18,
        joiningFee: 0,
        totalPrice: 33040,
        features: ['Unrestricted 365-day access', 'Full access to pool, steam, & sauna', '6 Personal trainer sessions included', '30-day membership pause', '2 Guest day passes every month', 'Complimentary locker allocation'],
        pausePolicy: 'Up to 30 days pause in maximum 2 splits',
        refundPolicy: 'Pro-rata refund eligible within 14 days of activation'
      }
    ],
    equipment: ['Hammer Strength Iso-lateral plate loaded machines', 'Eleiko Olympic competition barbells and bumper plates', 'Life Fitness Elevation Series treadmills & stair climbers', 'Concept2 Rowers and SkiErgs', 'Custom 14-bay functional training rig'],
    contact: {
      phone: '+91 98112 04099',
      email: 'hello@pulsefit104.demo.in',
      manager: 'Rohit Sharma (Center Head)'
    },
    description: 'PulseFit Elite is an expansive 14,000 sq ft fitness facility located at the heart of Noida Sector 104 expressway corridor. Known for clean locker rooms, imported biomechanically tested equipment, and expert certified trainers.'
  },
  {
    id: 'golds-gym-104-demo',
    name: "Gold's Gym - Sector 104 (Research Reference)",
    tagline: 'World-renowned bodybuilding and strength training brand',
    type: 'Franchise Gym',
    sector: 'Sector 104',
    sectorId: 'sector-104',
    landmark: 'Hazipur Main Commercial Belt, Sector 104',
    address: 'Near Sector 104 Commercial Hub, Noida, UP 201304',
    coordinates: { lat: 28.5362, lng: 77.3621 },
    rating: 4.5,
    reviewCount: 310,
    isSample: true,
    isPartner: false,
    statusBadge: 'Demo Listing - Unverified Reference',
    disclaimer: 'This listing is an independent research example. NoidaGym is not an authorized partner or affiliate of Gold\'s Gym. Pricing, amenities, and timings are placeholders and must be verified directly with the center.',
    startingPrice: null,
    hasPriceOnContact: true,
    priceNote: 'Contact gym for authentic rack rates',
    trialAvailable: true,
    trialType: 'Trial on Request',
    trialFee: 0,
    dayPassFee: null,
    openingHours: {
      weekday: '6:00 AM - 10:30 PM',
      weekend: '7:00 AM - 9:00 PM',
      is24Hours: false,
      womenOnlyTimings: 'No separate slot (Open mixed)'
    },
    images: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1200&q=80'
    ],
    facilities: [
      'Extensive Free Weight Section',
      'Cardio Theater',
      'Personal Training Coaching',
      'Locker & Shower Rooms',
      'Steam Room',
      'Dedicated Spinning Studio',
      'Ample Roadside & Reserved Parking'
    ],
    facilityTags: ['strength', 'steam', 'trainers', 'parking', 'lockers'],
    classes: ['Spinning', 'Zumba', 'Power Yoga', 'Body Conditioning'],
    plans: [
      {
        id: 'gold-inquiry',
        name: 'Standard Gold Membership (Official Inquiry)',
        duration: 'Quarterly / Half-Yearly / Annual',
        months: 3,
        basePrice: 0,
        gstRate: 0.18,
        joiningFee: 0,
        totalPrice: 0,
        isContactOnly: true,
        features: ['Full gym access across gold standards', 'Inquire directly for ongoing discounts and festival promotions', 'Free trial availability subject to franchise desk approval'],
        pausePolicy: 'As per Gold\'s Gym franchise policy guidelines',
        refundPolicy: 'Subject to franchise branch terms'
      }
    ],
    equipment: ['Heavy duty cable crossover stations', 'Multi-grip chin up and dipping stations', 'Precor cardio line', 'Dumbbells ranging from 2.5kg to 60kg'],
    contact: {
      phone: '+91 120 4000000 (Sample Reference)',
      email: 'info@sample-reference.demo',
      manager: 'Branch Desk'
    },
    description: 'Gold\'s Gym Sector 104 is a renowned fitness brand presence in the Noida expressway belt. Included as a reference point for users comparing regional gym options.'
  },
  {
    id: 'titan-forge-62',
    name: 'Titan Forge Strength & Conditioning',
    tagline: '24-hour powerlifting, strongman & functional calisthenics hub',
    type: 'Strength & Powerlifting',
    sector: 'Sector 62',
    sectorId: 'sector-62',
    landmark: 'Near Noida Electronic City Metro Station & Fortis Hospital',
    address: 'C-56/12, Institutional Area, Sector 62, Noida, UP 201309',
    coordinates: { lat: 28.6271, lng: 77.3629 },
    rating: 4.9,
    reviewCount: 98,
    isSample: true,
    isPartner: true,
    statusBadge: 'Verified Marketplace Partner',
    startingPrice: 2200,
    hasPriceOnContact: false,
    trialAvailable: true,
    trialType: 'Free 1-Day Trial Pass',
    trialFee: 0,
    dayPassFee: 299,
    openingHours: {
      weekday: '24 Hours Open',
      weekend: '24 Hours Open',
      is24Hours: true,
      womenOnlyTimings: 'Dedicated certified female coaches available on demand'
    },
    images: [
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=80'
    ],
    facilities: [
      '24-Hour Access via RFID Biometrics',
      'Calibrated Steel Powerlifting Plates',
      'Monolift & 6 Squat Racks',
      'Deadlift Dead-bounce Platforms',
      'Gymnastic Rings & Calisthenics Zone',
      'Chalk Friendly Facility',
      'Lockers & Changing Rooms',
      'Secure High-Speed Wi-Fi',
      'Air Conditioned',
      'Bike & Car Parking'
    ],
    facilityTags: ['24-hours', 'strength', 'crossfit', 'trainers', 'parking', 'lockers'],
    classes: ['Olympic Weightlifting Technique', 'Barbell Mechanics', 'Strongman Saturdays', 'Mobility & Hip Prehab'],
    plans: [
      {
        id: 'tf-1m',
        name: '1 Month 24/7 Access',
        duration: '1 Month',
        months: 1,
        basePrice: 2500,
        gstRate: 0.18,
        joiningFee: 300,
        totalPrice: 3250,
        features: ['24/7 RFID door tag access', 'Full access to chalk platforms & power racks', 'Free beginner barbell orientation', 'Locker storage during workout'],
        pausePolicy: 'No pause on 1-month plan',
        refundPolicy: 'Full refund before RFID issue or within 2 days'
      },
      {
        id: 'tf-3m',
        name: '3 Months Iron Cadet',
        duration: '3 Months',
        months: 3,
        basePrice: 6600,
        gstRate: 0.18,
        joiningFee: 0,
        totalPrice: 7788,
        popular: true,
        features: ['24/7 Unlimited access', '1 Strength programming assessment', 'Chalk usage included', '10 days pause grace period'],
        pausePolicy: '1 freeze allowance up to 10 days',
        refundPolicy: '5-day review period minus ₹800 registration cost'
      },
      {
        id: 'tf-12m',
        name: '12 Months Heavy Lifter',
        duration: '12 Months',
        months: 12,
        basePrice: 19500,
        gstRate: 0.18,
        joiningFee: 0,
        totalPrice: 23010,
        features: ['365 days 24/7 access', 'Free gym T-shirt & lifting straps', 'Up to 45 days membership freeze', 'Permanent personal locker included', 'Free entry to internal powerlifting meets'],
        pausePolicy: 'Up to 45 days freeze with 3-day notice',
        refundPolicy: 'Pro-rata refund within 14 calendar days'
      }
    ],
    equipment: ['Rogue Monster Lite Racks', 'Kabuki Strength Transformation Bar & Trap Bar', 'Texas Power Bars & Ivanko Calibrated Discs', 'Prowler sleds and 25m turf track'],
    contact: {
      phone: '+91 99103 48720',
      email: 'lifters@titanforge62.demo.in',
      manager: 'Vikram Choudhary (CSCS Head Coach)'
    },
    description: 'Sector 62’s dedicated strength sanctum. Titan Forge operates round the clock for IT professionals, students, and serious powerlifters who need real equipment and zero commercial fluff.'
  },
  {
    id: 'fitness-first-gip-demo',
    name: 'Fitness First - The Great India Place (Research Reference)',
    tagline: 'High-end fitness club with state-of-the-art group exercise studios',
    type: 'Franchise Gym',
    sector: 'Sector 38A',
    sectorId: 'sector-38',
    landmark: 'The Great India Place Mall, Level 3, Sector 38A',
    address: 'Plot A2, Sector 38A, Noida, UP 201301',
    coordinates: { lat: 28.5672, lng: 77.3245 },
    rating: 4.6,
    reviewCount: 285,
    isSample: true,
    isPartner: false,
    statusBadge: 'Demo Listing - Research Reference',
    disclaimer: 'This listing is an independent research example. NoidaGym is not an authorized partner or affiliate of Fitness First. Details, pricing, and operating conditions are placeholders and must be verified directly with the club.',
    startingPrice: null,
    hasPriceOnContact: true,
    priceNote: 'Direct consultation required for corporate rates & plans',
    trialAvailable: true,
    trialType: 'Day Pass Available',
    trialFee: 499,
    dayPassFee: 499,
    openingHours: {
      weekday: '6:30 AM - 10:00 PM',
      weekend: '7:00 AM - 9:00 PM',
      is24Hours: false,
      womenOnlyTimings: 'Women-only aerobics studio sessions at 10:30 AM'
    },
    images: [
      'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=1200&q=80'
    ],
    facilities: [
      'Spacious Group Exercise Studio',
      'Dedicated Spin Bike Theater',
      'Steam & Relax Lounges',
      'Mall Basement Parking (Paid/Subsidized)',
      'Towel Service & Complimentary Wi-Fi',
      'Cardio & Functional Training'
    ],
    facilityTags: ['steam', 'trainers', 'parking', 'lockers'],
    classes: ['Les Mills BodyPump', 'BodyCombat', 'RPM Spinning', 'Vinyasa Flow'],
    plans: [
      {
        id: 'ff-sample-plan',
        name: 'Club Passport Membership (Sample Reference)',
        duration: 'Quarterly & Annual Contracts',
        months: 3,
        basePrice: 0,
        gstRate: 0.18,
        joiningFee: 0,
        totalPrice: 0,
        isContactOnly: true,
        features: ['Full access to cardio, strength and class studios', 'Towel service included', 'Corporate employer tie-up discounts possible'],
        pausePolicy: 'As per corporate contract conditions',
        refundPolicy: 'Subject to club terms'
      }
    ],
    equipment: ['Technogym Artis Line cardiovascular equipment', 'Synrgy360 dynamic group training frame', 'Full selectorized strength circuit'],
    contact: {
      phone: '+91 120 4888888 (Sample Reference)',
      email: 'gip@sample-reference.demo',
      manager: 'Club Reception'
    },
    description: 'Located in GIP Sector 38A, this facility caters to commuters and mall visitors looking for premier group classes and modern wellness amenities.'
  },
  {
    id: 'noida-arena-18',
    name: 'Noida Arena 24/7 Fitness Hub',
    tagline: 'Multi-level fitness arena with boxing ring, turf & round-the-clock entry',
    type: '24/7 Multi-Specialty',
    sector: 'Sector 18',
    sectorId: 'sector-18',
    landmark: 'Near Sector 18 Metro Station & Wave Silver Tower',
    address: 'B-Block Market, 2nd & 3rd Floor, Sector 18, Noida, UP 201301',
    coordinates: { lat: 28.5708, lng: 77.3261 },
    rating: 4.7,
    reviewCount: 164,
    isSample: true,
    isPartner: true,
    statusBadge: 'Verified Marketplace Partner',
    startingPrice: 2800,
    hasPriceOnContact: false,
    trialAvailable: true,
    trialType: 'Free 1-Day Trial Pass',
    trialFee: 0,
    dayPassFee: 350,
    openingHours: {
      weekday: '24 Hours Open',
      weekend: '24 Hours Open',
      is24Hours: true,
      womenOnlyTimings: 'Women-only strength zone available 10:00 AM - 12:00 PM'
    },
    images: [
      'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1577221084712-45b0445d2b00?auto=format&fit=crop&w=1200&q=80'
    ],
    facilities: [
      '24-Hour Access with Biometric Smart Entry',
      'Full Size Boxing & Sparring Ring',
      'Cardio Deck with Netflix-enabled consoles',
      'Heavy Dumbbells up to 50kg',
      'Steam Rooms with Aromatherapy',
      'Dedicated Locker Rooms with Digital Locks',
      'Metro Station 2-min Walk',
      'Valet Parking Available',
      'Air Conditioned',
      'Protein Shake Bar & Café'
    ],
    facilityTags: ['24-hours', 'strength', 'steam', 'trainers', 'parking', 'lockers', 'women-timings'],
    classes: ['Boxing Fundamentals', 'Kickboxing & Self Defense', 'High Voltage HIIT', 'Core Blast'],
    plans: [
      {
        id: 'na-1m',
        name: '1 Month All-Access',
        duration: '1 Month',
        months: 1,
        basePrice: 3200,
        gstRate: 0.18,
        joiningFee: 400,
        totalPrice: 4176,
        features: ['24/7 unlimited access to all 3 floors', 'Boxing ring and bag zone access', 'Steam room privileges', 'Locker & shower facilities'],
        pausePolicy: 'No pause on 1-month plan',
        refundPolicy: 'Refund eligible within 48h prior to first check-in'
      },
      {
        id: 'na-3m',
        name: '3 Months Warrior',
        duration: '3 Months',
        months: 3,
        basePrice: 8400,
        gstRate: 0.18,
        joiningFee: 0,
        totalPrice: 9912,
        popular: true,
        features: ['Full 24/7 access', 'Weekly group boxing classes included', '1 Body composition analysis per month', '14-day pause option'],
        pausePolicy: '1 pause allowance up to 14 days',
        refundPolicy: '7-day guarantee window minus ₹1,000 onboarding cost'
      },
      {
        id: 'na-12m',
        name: '12 Months Arena Champion',
        duration: '12 Months',
        months: 12,
        basePrice: 24000,
        gstRate: 0.18,
        joiningFee: 0,
        totalPrice: 28320,
        features: ['365 days 24/7 access', 'Free boxing glove starter kit', '35 days membership freeze', '4 Guest workout vouchers', 'Unlimited steam sessions'],
        pausePolicy: 'Up to 35 days freeze in 2 tranches',
        refundPolicy: 'Pro-rata refund within first 14 days'
      }
    ],
    equipment: ['Everlast heavy bags and speedballs', 'Matrix Fitness Ascent trainers and treadmills', 'Dual adjustable pulley cable stations', 'Olympic lifting platform with rubber tiles'],
    contact: {
      phone: '+91 98731 55210',
      email: 'help@noidaarena.demo.in',
      manager: 'Anuj Tyagi (Operations Manager)'
    },
    description: 'Located in Noida Sector 18\'s bustling shopping and metro district, Noida Arena combines high-intensity combat sports training with round-the-clock commercial gym convenience.'
  },
  {
    id: 'zenith-studio-50',
    name: 'Zenith Studio & Reformer Pilates',
    tagline: 'Mind-body wellness, reformer pilates, barre & boutique strength',
    type: 'Boutique Studio',
    sector: 'Sector 50',
    sectorId: 'sector-50',
    landmark: 'Near Sector 50 Central Park & Metro Station',
    address: 'Plot 18, Commercial Belt B, Sector 50, Noida, UP 201301',
    coordinates: { lat: 28.5750, lng: 77.3680 },
    rating: 4.9,
    reviewCount: 84,
    isSample: true,
    isPartner: true,
    statusBadge: 'Verified Marketplace Partner',
    startingPrice: 3500,
    hasPriceOnContact: false,
    trialAvailable: true,
    trialType: 'Trial Class ₹499',
    trialFee: 499,
    dayPassFee: 599,
    openingHours: {
      weekday: '6:30 AM - 8:30 PM',
      weekend: '7:30 AM - 7:00 PM',
      is24Hours: false,
      womenOnlyTimings: 'Women-only Pilates & Barre slots: 10:00 AM & 5:00 PM daily'
    },
    images: [
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80'
    ],
    facilities: [
      'Allegro 2 Reformer Pilates Machines',
      'Natural Sunlight Studio with Wooden Floors',
      'Dedicated Women Batches',
      'Certified Clinical Pilates Instructors',
      'Shower & Changing Suites with Organic Toiletries',
      'Herbal Infusion Tea Bar',
      'Reserved Member Parking',
      'Air Conditioned with HEPA Air Purification'
    ],
    facilityTags: ['women-timings', 'trainers', 'parking', 'lockers'],
    classes: ['Reformer Pilates Beginner & Intermediate', 'Barre Fitness', 'Hatha & Yin Yoga', 'Postnatal Reconditioning'],
    plans: [
      {
        id: 'zenith-8c',
        name: '8 Classes Reformer & Mat Pass',
        duration: '1 Month (8 Sessions)',
        months: 1,
        basePrice: 4800,
        gstRate: 0.18,
        joiningFee: 0,
        totalPrice: 5664,
        features: ['8 booked reformer/yoga classes per month', 'Small groups of max 6 students', 'Individual posture analysis', 'Tea bar access'],
        pausePolicy: 'Validity extension up to 7 days for travel',
        refundPolicy: 'Refund eligible before attending first studio session'
      },
      {
        id: 'zenith-3m',
        name: '3 Months Unlimited Studio Pass',
        duration: '3 Months',
        months: 3,
        basePrice: 13500,
        gstRate: 0.18,
        joiningFee: 0,
        totalPrice: 15930,
        popular: true,
        features: ['Unlimited group reformer and mat classes', 'Priority booking window via app', '1 In-depth physical therapist consultation', '20-day membership pause'],
        pausePolicy: 'Up to 20 days freeze allowance',
        refundPolicy: '7-day satisfaction window with fee deduction'
      }
    ],
    equipment: ['Balanced Body Allegro 2 Reformers', 'Pilates Spine Correctors and Arc Barrels', 'Manduka Pro Yoga Mats and organic cotton bolsters', 'Resistance bands and light sculpting dumbbells'],
    contact: {
      phone: '+91 97184 20330',
      email: 'studio@zenithnoida.demo.in',
      manager: 'Pooja Kashyap (Lead Pilates Master)'
    },
    description: 'A serene sanctuary in Sector 50 designed for mindful movement, core rehabilitation, and posture correction with small class sizes and personal attention.'
  },
  {
    id: 'vanguard-athletic-127',
    name: 'Vanguard Athletic Club',
    tagline: 'Modern corporate fitness, indoor sprint track & executive spa',
    type: 'Corporate & Executive Gym',
    sector: 'Sector 127',
    sectorId: 'sector-127',
    landmark: 'Tech Boulevard, Near Express Trade Towers',
    address: 'Tower D, Ground Floor, Sector 127, Noida, UP 201304',
    coordinates: { lat: 28.5147, lng: 77.3820 },
    rating: 4.8,
    reviewCount: 112,
    isSample: true,
    isPartner: true,
    statusBadge: 'Verified Marketplace Partner',
    startingPrice: 3000,
    hasPriceOnContact: false,
    trialAvailable: true,
    trialType: 'Free 1-Day Trial',
    trialFee: 0,
    dayPassFee: 400,
    openingHours: {
      weekday: '6:00 AM - 10:30 PM',
      weekend: '6:30 AM - 9:00 PM',
      is24Hours: false,
      womenOnlyTimings: 'Women-only strength clinic: 12:00 PM - 1:30 PM'
    },
    images: [
      'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1200&q=80'
    ],
    facilities: [
      'Indoor 30m Tartan Sprint Track',
      'Steam & Ice Recovery Baths',
      'Executive Locker Rooms with Dry Clean Drop',
      'Covered Multi-level Corporate Parking',
      'InBody 770 Body Composition Scanner',
      'Ergonomic Workstations in Fitness Lounge',
      'Air Conditioned with Ozone Filtration'
    ],
    facilityTags: ['strength', 'steam', 'trainers', 'parking', 'lockers', 'women-timings'],
    classes: ['Corporate Express 30-min HIIT', 'Desk Worker Mobility & Spine Health', 'Power Yoga for Focus'],
    plans: [
      {
        id: 'vg-1m',
        name: '1 Month Executive Pass',
        duration: '1 Month',
        months: 1,
        basePrice: 3500,
        gstRate: 0.18,
        joiningFee: 500,
        totalPrice: 4630,
        features: ['Full gym & sprint track access', 'Steam & recovery bath usage', 'InBody assessment report', 'Locker & laundry bag allocation'],
        pausePolicy: 'No pause on monthly pass',
        refundPolicy: 'Refundable before first entry'
      },
      {
        id: 'vg-3m',
        name: '3 Months Corporate Flex',
        duration: '3 Months',
        months: 3,
        basePrice: 9000,
        gstRate: 0.18,
        joiningFee: 0,
        totalPrice: 10620,
        popular: true,
        features: ['All club amenities', 'Unlimited express group classes', '15-day official travel pause flexibility', 'Monthly nutritionist follow-up'],
        pausePolicy: 'Up to 15 days travel freeze with work email proof',
        refundPolicy: '7-day guarantee minus standard registration cost'
      }
    ],
    equipment: ['Woodway Curve non-motorized treadmills', 'Keiser pneumatic air resistance equipment', 'Eleiko sport barbells', 'Escape Fitness functional playground'],
    contact: {
      phone: '+91 98991 76240',
      email: 'corp@vanguardclub.demo.in',
      manager: 'Deepak Mehrotra (Club Director)'
    },
    description: 'Designed for IT professionals and corporate executives along the Noida-Greater Noida Expressway, Vanguard provides high-efficiency training, rapid post-work recovery, and immaculate amenities.'
  },
  {
    id: 'apex-iron-153',
    name: 'Apex Iron Gym & Fitness Studio',
    tagline: 'High-value neighborhood gym with heavy iron & friendly community',
    type: 'Neighborhood Strength Gym',
    sector: 'Sector 153',
    sectorId: 'sector-153',
    landmark: 'Near Noida Expressway Sector 153 Service Lane',
    address: 'Near Commercial Complex, Sector 153, Noida, UP 201306',
    coordinates: { lat: 28.4520, lng: 77.4480 },
    rating: 4.6,
    reviewCount: 65,
    isSample: true,
    isPartner: true,
    statusBadge: 'Verified Marketplace Partner',
    startingPrice: 1400,
    hasPriceOnContact: false,
    trialAvailable: true,
    trialType: 'Free 1-Day Trial Pass',
    trialFee: 0,
    dayPassFee: 199,
    openingHours: {
      weekday: '5:30 AM - 10:30 PM',
      weekend: '6:00 AM - 9:00 PM',
      is24Hours: false,
      womenOnlyTimings: 'Women-only batches: 11:00 AM - 12:30 PM'
    },
    images: [
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80'
    ],
    facilities: [
      'Full Range of Free Weights up to 60kg',
      'Squat Racks and Smith Machines',
      'Cable Crossover & Lat Pulldown Units',
      'Cardio Section (Treadmills & Ellipticals)',
      'Changing Rooms & Shower',
      'Two-Wheeler & Open Car Parking',
      'Air Conditioned Floor'
    ],
    facilityTags: ['strength', 'trainers', 'parking', 'lockers', 'women-timings'],
    classes: ['Circuit Training', 'Fat Loss Bootcamps', 'Core & Abs Blast'],
    plans: [
      {
        id: 'apex-1m',
        name: '1 Month Starter Plan',
        duration: '1 Month',
        months: 1,
        basePrice: 1500,
        gstRate: 0.18,
        joiningFee: 200,
        totalPrice: 1970,
        features: ['Full gym equipment access', 'Workout routine chart provided', 'Changing room access'],
        pausePolicy: 'No pause on 1-month plan',
        refundPolicy: 'Refundable before first day'
      },
      {
        id: 'apex-3m',
        name: '3 Months Value Pack',
        duration: '3 Months',
        months: 3,
        basePrice: 3800,
        gstRate: 0.18,
        joiningFee: 0,
        totalPrice: 4484,
        popular: true,
        features: ['Complete gym access', 'Free trainer diet recommendations', '10 days pause grace period'],
        pausePolicy: 'Up to 10 days freeze permitted',
        refundPolicy: 'Within 3 days of registration'
      },
      {
        id: 'apex-12m',
        name: '12 Months Budget Annual',
        duration: '12 Months',
        months: 12,
        basePrice: 12000,
        gstRate: 0.18,
        joiningFee: 0,
        totalPrice: 14160,
        features: ['Full year unlimited workouts', '30 days membership freeze', 'Complimentary workout shaker'],
        pausePolicy: 'Up to 30 days freeze',
        refundPolicy: 'Pro-rata within 7 days'
      }
    ],
    equipment: ['Heavy duty Olympic power racks', 'Incline/Decline bench press setups', 'Dumbbells from 2.5kg up to 60kg in 2.5kg increments', 'Commercial stepper and spin bikes'],
    contact: {
      phone: '+91 98108 33490',
      email: 'apex153@noidagym.demo.in',
      manager: 'Sunil Bhati'
    },
    description: 'An affordable, hardworking strength gym serving Sector 153 and nearby expressway communities. Offers spacious workout floors, friendly instructors, and unbeatable value.'
  },
  {
    id: 'aura-wellness-76',
    name: 'Aura Wellness & CrossGym',
    tagline: 'Modern family fitness club, swimming pool, sauna & Les Mills classes',
    type: 'Wellness & CrossGym',
    sector: 'Sector 76',
    sectorId: 'sector-76',
    landmark: 'Near Sector 76 Metro Station, Amrapali Silicon City Gate',
    address: 'Commercial Block 2, Sector 76, Noida, UP 201301',
    coordinates: { lat: 28.5650, lng: 77.3850 },
    rating: 4.7,
    reviewCount: 153,
    isSample: true,
    isPartner: true,
    statusBadge: 'Verified Marketplace Partner',
    startingPrice: 2600,
    hasPriceOnContact: false,
    trialAvailable: true,
    trialType: 'Free 1-Day Trial',
    trialFee: 0,
    dayPassFee: 350,
    openingHours: {
      weekday: '6:00 AM - 10:30 PM',
      weekend: '6:30 AM - 9:30 PM',
      is24Hours: false,
      womenOnlyTimings: 'Women-only pool & fitness floor: 11:00 AM - 1:00 PM'
    },
    images: [
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1200&q=80'
    ],
    facilities: [
      'Semi-Olympic Swimming Pool',
      'Steam & Herbal Sauna Bath',
      'Functional Cross-Training Turf',
      'Dedicated Women Timings for Pool & Gym',
      'Certified Swimming Coaches & Gym Trainers',
      'Ample Stilt & Basement Parking',
      'Kids Play & Waiting Lounge',
      'Air Conditioned with Fresh Air Circulation'
    ],
    facilityTags: ['pool', 'steam', 'crossfit', 'strength', 'trainers', 'parking', 'lockers', 'women-timings'],
    classes: ['Aqua Aerobics', 'Zumba Fitness', 'Tabata Extreme', 'Power Yoga'],
    plans: [
      {
        id: 'aura-1m',
        name: '1 Month Gym + Pool',
        duration: '1 Month',
        months: 1,
        basePrice: 3200,
        gstRate: 0.18,
        joiningFee: 400,
        totalPrice: 4176,
        features: ['Full gym & swimming pool access', 'Steam & sauna on weekends', 'Changing room & locker access'],
        pausePolicy: 'No pause on monthly pass',
        refundPolicy: 'Refundable before first visit'
      },
      {
        id: 'aura-3m',
        name: '3 Months Total Wellness',
        duration: '3 Months',
        months: 3,
        basePrice: 8000,
        gstRate: 0.18,
        joiningFee: 0,
        totalPrice: 9440,
        popular: true,
        features: ['Unrestricted gym & pool access', 'Unlimited weekend steam/sauna', '15 days medical/travel pause', '1 Free swimming stroke checkup'],
        pausePolicy: 'Up to 15 days freeze allowance',
        refundPolicy: '7-day money-back guarantee minus ₹1,000 onboarding cost'
      },
      {
        id: 'aura-12m',
        name: '12 Months Family Pass',
        duration: '12 Months',
        months: 12,
        basePrice: 22000,
        gstRate: 0.18,
        joiningFee: 0,
        totalPrice: 25960,
        features: ['365 days full club & pool access', '30 days membership freeze', '4 Guest pool & gym passes', 'Locker allocation included'],
        pausePolicy: 'Up to 30 days freeze in 2 splits',
        refundPolicy: 'Pro-rata refund within 14 days'
      }
    ],
    equipment: ['Cybex VR1 selectorized strength circuit', 'Nautilus cable crossover system', 'Life Fitness treadmill row', 'Functional kettlebells and slam balls'],
    contact: {
      phone: '+91 98711 90812',
      email: 'aura76@noidagym.demo.in',
      manager: 'Monika Bhasin'
    },
    description: 'A vibrant wellness club in Sector 76 offering both indoor gym conditioning and a full-length swimming pool, making it a favorite for families and fitness buffs alike.'
  }
];

// Reference coordinates for Noida landmarks (for distance calculation)
const NOIDA_LANDMARKS = {
  'sector-18': { name: 'Sector 18 Metro & Mall of India', lat: 28.5708, lng: 77.3261 },
  'sector-38': { name: 'The Great India Place (Sector 38A)', lat: 28.5672, lng: 77.3245 },
  'sector-50': { name: 'Sector 50 Central Park', lat: 28.5750, lng: 77.3680 },
  'sector-62': { name: 'Noida Electronic City Metro (Sec 62)', lat: 28.6271, lng: 77.3629 },
  'sector-76': { name: 'Sector 76 Metro Station', lat: 28.5650, lng: 77.3850 },
  'sector-104': { name: 'Hazipur Market (Sector 104)', lat: 28.5355, lng: 77.3644 },
  'sector-127': { name: 'Tech Boulevard (Sector 127)', lat: 28.5147, lng: 77.3820 },
  'sector-153': { name: 'Expressway Growth Hub (Sector 153)', lat: 28.4520, lng: 77.4480 }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    NOIDA_SECTORS,
    NOIDA_GYMS,
    NOIDA_LANDMARKS
  };
}
