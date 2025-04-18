
// Industry options with related skills
export const industryOptions = [
  { value: "technology", label: "Technology" },
  { value: "finance", label: "Finance" },
  { value: "marketing", label: "Marketing" },
  { value: "healthcare", label: "Healthcare" },
  { value: "design", label: "Design" },
  { value: "education", label: "Education" },
  { value: "engineering", label: "Engineering" },
  { value: "legal", label: "Legal" },
  { value: "entertainment", label: "Entertainment" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "retail", label: "Retail" },
  { value: "consulting", label: "Consulting" },
  { value: "real_estate", label: "Real Estate" },
  { value: "nonprofit", label: "Nonprofit" },
  { value: "other", label: "Other" },
];

// Skills by industry
export const industrySkills: Record<string, { value: string; label: string }[]> = {
  technology: [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "react", label: "React" },
    { value: "node", label: "Node.js" },
    { value: "cybersecurity", label: "Cybersecurity" },
    { value: "ai", label: "Artificial Intelligence" },
    { value: "machine_learning", label: "Machine Learning" },
    { value: "web_development", label: "Web Development" },
    { value: "mobile_development", label: "Mobile Development" },
    { value: "cloud_computing", label: "Cloud Computing" },
    { value: "devops", label: "DevOps" },
  ],
  finance: [
    { value: "accounting", label: "Accounting" },
    { value: "investment_analysis", label: "Investment Analysis" },
    { value: "risk_management", label: "Risk Management" },
    { value: "financial_planning", label: "Financial Planning" },
    { value: "taxation", label: "Taxation" },
    { value: "banking", label: "Banking" },
    { value: "capital_markets", label: "Capital Markets" },
    { value: "financial_modeling", label: "Financial Modeling" },
  ],
  marketing: [
    { value: "seo", label: "SEO" },
    { value: "social_media", label: "Social Media" },
    { value: "content_strategy", label: "Content Strategy" },
    { value: "ppc", label: "PPC" },
    { value: "email_marketing", label: "Email Marketing" },
    { value: "brand_management", label: "Brand Management" },
    { value: "market_research", label: "Market Research" },
    { value: "analytics", label: "Analytics" },
  ],
  healthcare: [
    { value: "patient_care", label: "Patient Care" },
    { value: "medical_research", label: "Medical Research" },
    { value: "biotechnology", label: "Biotechnology" },
    { value: "healthcare_management", label: "Healthcare Management" },
    { value: "public_health", label: "Public Health" },
    { value: "nursing", label: "Nursing" },
    { value: "pharmacy", label: "Pharmacy" },
  ],
  design: [
    { value: "ui_ux", label: "UI/UX Design" },
    { value: "graphic_design", label: "Graphic Design" },
    { value: "motion_graphics", label: "Motion Graphics" },
    { value: "product_design", label: "Product Design" },
    { value: "branding", label: "Branding" },
    { value: "illustration", label: "Illustration" },
    { value: "photography", label: "Photography" },
  ],
  education: [
    { value: "teaching", label: "Teaching" },
    { value: "research", label: "Research" },
    { value: "curriculum_design", label: "Curriculum Design" },
    { value: "educational_technology", label: "Educational Technology" },
    { value: "e_learning", label: "E-Learning" },
    { value: "assessment", label: "Assessment" },
    { value: "special_education", label: "Special Education" },
  ],
  engineering: [
    { value: "civil_engineering", label: "Civil Engineering" },
    { value: "mechanical_engineering", label: "Mechanical Engineering" },
    { value: "electrical_engineering", label: "Electrical Engineering" },
    { value: "chemical_engineering", label: "Chemical Engineering" },
    { value: "aerospace_engineering", label: "Aerospace Engineering" },
    { value: "biomedical_engineering", label: "Biomedical Engineering" },
  ],
  legal: [
    { value: "corporate_law", label: "Corporate Law" },
    { value: "intellectual_property", label: "Intellectual Property" },
    { value: "litigation", label: "Litigation" },
    { value: "contract_law", label: "Contract Law" },
    { value: "regulatory_compliance", label: "Regulatory Compliance" },
  ],
  entertainment: [
    { value: "film_production", label: "Film Production" },
    { value: "music_production", label: "Music Production" },
    { value: "acting", label: "Acting" },
    { value: "directing", label: "Directing" },
    { value: "screenwriting", label: "Screenwriting" },
    { value: "event_management", label: "Event Management" },
  ],
  manufacturing: [
    { value: "production_management", label: "Production Management" },
    { value: "quality_control", label: "Quality Control" },
    { value: "supply_chain", label: "Supply Chain" },
    { value: "logistics", label: "Logistics" },
    { value: "inventory_management", label: "Inventory Management" },
  ],
  retail: [
    { value: "sales", label: "Sales" },
    { value: "merchandising", label: "Merchandising" },
    { value: "customer_service", label: "Customer Service" },
    { value: "retail_management", label: "Retail Management" },
    { value: "e-commerce", label: "E-Commerce" },
  ],
  consulting: [
    { value: "strategy_consulting", label: "Strategy Consulting" },
    { value: "management_consulting", label: "Management Consulting" },
    { value: "business_analysis", label: "Business Analysis" },
    { value: "operations_consulting", label: "Operations Consulting" },
    { value: "hr_consulting", label: "HR Consulting" },
  ],
  real_estate: [
    { value: "property_management", label: "Property Management" },
    { value: "real_estate_development", label: "Real Estate Development" },
    { value: "real_estate_sales", label: "Real Estate Sales" },
    { value: "mortgage_financing", label: "Mortgage & Financing" },
    { value: "commercial_real_estate", label: "Commercial Real Estate" },
  ],
  nonprofit: [
    { value: "fundraising", label: "Fundraising" },
    { value: "grant_writing", label: "Grant Writing" },
    { value: "volunteer_management", label: "Volunteer Management" },
    { value: "program_development", label: "Program Development" },
    { value: "community_outreach", label: "Community Outreach" },
  ],
  other: [
    { value: "other_skills", label: "Other Skills" },
  ],
};

// Interest options
export const interestOptions = [
  { value: "photography", label: "Photography" },
  { value: "cooking", label: "Cooking" },
  { value: "travel", label: "Travel" },
  { value: "writing", label: "Writing" },
  { value: "gaming", label: "Gaming" },
  { value: "coding", label: "Coding" },
  { value: "public_speaking", label: "Public Speaking" },
  { value: "entrepreneurship", label: "Entrepreneurship" },
  { value: "fitness", label: "Fitness" },
  { value: "music", label: "Music" },
  { value: "reading", label: "Reading" },
  { value: "sports", label: "Sports" },
  { value: "art", label: "Art" },
  { value: "dancing", label: "Dancing" },
  { value: "yoga", label: "Yoga" },
  { value: "meditation", label: "Meditation" },
  { value: "investing", label: "Investing" },
  { value: "gardening", label: "Gardening" },
  { value: "volunteering", label: "Volunteering" },
  { value: "hiking", label: "Hiking" },
];

// Experience levels with time ranges
export const experienceLevels = [
  { value: "beginner", label: "Beginner (0-1 year)" },
  { value: "intermediate", label: "Intermediate (1-3 years)" },
  { value: "advanced", label: "Advanced (3-5 years)" },
  { value: "expert", label: "Expert (5+ years)" },
];

// Indian states and cities
export const indianStates = [
  { value: "andhra_pradesh", label: "Andhra Pradesh" },
  { value: "telangana", label: "Telangana" },
  { value: "karnataka", label: "Karnataka" },
  { value: "tamil_nadu", label: "Tamil Nadu" },
  { value: "maharashtra", label: "Maharashtra" },
  { value: "delhi", label: "Delhi" },
  { value: "haryana", label: "Haryana" },
  { value: "uttar_pradesh", label: "Uttar Pradesh" },
  { value: "gujarat", label: "Gujarat" },
  { value: "kerala", label: "Kerala" },
  { value: "west_bengal", label: "West Bengal" },
  { value: "punjab", label: "Punjab" },
  { value: "rajasthan", label: "Rajasthan" },
  { value: "madhya_pradesh", label: "Madhya Pradesh" },
  { value: "bihar", label: "Bihar" },
];

// Cities by state
export const citiesByState: Record<string, { value: string; label: string }[]> = {
  andhra_pradesh: [
    { value: "visakhapatnam", label: "Visakhapatnam" },
    { value: "vijayawada", label: "Vijayawada" },
    { value: "guntur", label: "Guntur" },
    { value: "nellore", label: "Nellore" },
    { value: "kurnool", label: "Kurnool" },
  ],
  telangana: [
    { value: "hyderabad", label: "Hyderabad" },
    { value: "warangal", label: "Warangal" },
    { value: "nizamabad", label: "Nizamabad" },
    { value: "karimnagar", label: "Karimnagar" },
    { value: "khammam", label: "Khammam" },
  ],
  karnataka: [
    { value: "bengaluru", label: "Bengaluru" },
    { value: "mysuru", label: "Mysuru" },
    { value: "hubli", label: "Hubli" },
    { value: "mangaluru", label: "Mangaluru" },
    { value: "belagavi", label: "Belagavi" },
  ],
  tamil_nadu: [
    { value: "chennai", label: "Chennai" },
    { value: "coimbatore", label: "Coimbatore" },
    { value: "madurai", label: "Madurai" },
    { value: "tiruchirappalli", label: "Tiruchirappalli" },
    { value: "salem", label: "Salem" },
  ],
  maharashtra: [
    { value: "mumbai", label: "Mumbai" },
    { value: "pune", label: "Pune" },
    { value: "nagpur", label: "Nagpur" },
    { value: "thane", label: "Thane" },
    { value: "nashik", label: "Nashik" },
  ],
  delhi: [
    { value: "new_delhi", label: "New Delhi" },
    { value: "delhi_ncr", label: "Delhi NCR" },
    { value: "gurgaon", label: "Gurgaon" },
    { value: "noida", label: "Noida" },
    { value: "faridabad", label: "Faridabad" },
  ],
  haryana: [
    { value: "gurgaon", label: "Gurgaon" },
    { value: "faridabad", label: "Faridabad" },
    { value: "hisar", label: "Hisar" },
    { value: "rohtak", label: "Rohtak" },
    { value: "panipat", label: "Panipat" },
  ],
  uttar_pradesh: [
    { value: "lucknow", label: "Lucknow" },
    { value: "kanpur", label: "Kanpur" },
    { value: "agra", label: "Agra" },
    { value: "varanasi", label: "Varanasi" },
    { value: "meerut", label: "Meerut" },
  ],
  gujarat: [
    { value: "ahmedabad", label: "Ahmedabad" },
    { value: "surat", label: "Surat" },
    { value: "vadodara", label: "Vadodara" },
    { value: "rajkot", label: "Rajkot" },
    { value: "gandhinagar", label: "Gandhinagar" },
  ],
  kerala: [
    { value: "thiruvananthapuram", label: "Thiruvananthapuram" },
    { value: "kochi", label: "Kochi" },
    { value: "kozhikode", label: "Kozhikode" },
    { value: "thrissur", label: "Thrissur" },
    { value: "kollam", label: "Kollam" },
  ],
  west_bengal: [
    { value: "kolkata", label: "Kolkata" },
    { value: "howrah", label: "Howrah" },
    { value: "durgapur", label: "Durgapur" },
    { value: "asansol", label: "Asansol" },
    { value: "siliguri", label: "Siliguri" },
  ],
  punjab: [
    { value: "ludhiana", label: "Ludhiana" },
    { value: "amritsar", label: "Amritsar" },
    { value: "jalandhar", label: "Jalandhar" },
    { value: "patiala", label: "Patiala" },
    { value: "bathinda", label: "Bathinda" },
  ],
  rajasthan: [
    { value: "jaipur", label: "Jaipur" },
    { value: "jodhpur", label: "Jodhpur" },
    { value: "udaipur", label: "Udaipur" },
    { value: "kota", label: "Kota" },
    { value: "ajmer", label: "Ajmer" },
  ],
  madhya_pradesh: [
    { value: "indore", label: "Indore" },
    { value: "bhopal", label: "Bhopal" },
    { value: "jabalpur", label: "Jabalpur" },
    { value: "gwalior", label: "Gwalior" },
    { value: "ujjain", label: "Ujjain" },
  ],
  bihar: [
    { value: "patna", label: "Patna" },
    { value: "gaya", label: "Gaya" },
    { value: "bhagalpur", label: "Bhagalpur" },
    { value: "muzaffarpur", label: "Muzaffarpur" },
    { value: "darbhanga", label: "Darbhanga" },
  ],
};
