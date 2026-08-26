export interface SeoLocation {
  city: string; // URL slug
  label: string; // User-facing name
  state: string; // Indian state name
  region: string; // North, East, West, Central, etc.
}

export const SEO_LOCATIONS: SeoLocation[] = [
  { city: "delhi", label: "Delhi NCR", state: "Delhi", region: "North" },
  { city: "patna", label: "Patna", state: "Bihar", region: "East" },
  { city: "supaul", label: "Supaul", state: "Bihar", region: "East" },
  { city: "lucknow", label: "Lucknow", state: "Uttar Pradesh", region: "North" },
  { city: "jaipur", label: "Jaipur", state: "Rajasthan", region: "North" },
  { city: "bhopal", label: "Bhopal", state: "Madhya Pradesh", region: "Central" },
  { city: "mumbai", label: "Mumbai", state: "Maharashtra", region: "West" },
  { city: "pune", label: "Pune", state: "Maharashtra", region: "West" },
  { city: "ahmedabad", label: "Ahmedabad", state: "Gujarat", region: "West" },
  { city: "ranchi", label: "Ranchi", state: "Jharkhand", region: "East" },
  { city: "indore", label: "Indore", state: "Madhya Pradesh", region: "Central" },
  { city: "chandigarh", label: "Chandigarh", state: "Punjab", region: "North" },
  { city: "varanasi", label: "Varanasi", state: "Uttar Pradesh", region: "North" },
  { city: "dehradun", label: "Dehradun", state: "Uttarakhand", region: "North" },
  { city: "raipur", label: "Raipur", state: "Chhattisgarh", region: "Central" },
  { city: "meerut", label: "Meerut", state: "Uttar Pradesh", region: "North" },
  { city: "muzaffarpur", label: "Muzaffarpur", state: "Bihar", region: "East" },
  { city: "gorakhpur", label: "Gorakhpur", state: "Uttar Pradesh", region: "North" },
  { city: "gaya", label: "Gaya", state: "Bihar", region: "East" },
  { city: "bhagalpur", label: "Bhagalpur", state: "Bihar", region: "East" },
  { city: "kanpur", label: "Kanpur", state: "Uttar Pradesh", region: "North" },
  { city: "prayagraj", label: "Prayagraj", state: "Uttar Pradesh", region: "North" },
  { city: "agra", label: "Agra", state: "Uttar Pradesh", region: "North" },
  { city: "gwalior", label: "Gwalior", state: "Madhya Pradesh", region: "Central" },
  { city: "jabalpur", label: "Jabalpur", state: "Madhya Pradesh", region: "Central" },
  { city: "bhagalpur", label: "Bhagalpur", state: "Bihar", region: "East" },
  { city: "jamshedpur", label: "Jamshedpur", state: "Jharkhand", region: "East" },
  { city: "dhanbad", label: "Dhanbad", state: "Jharkhand", region: "East" },
  { city: "rohtak", label: "Rohtak", state: "Haryana", region: "North" },
  { city: "panipat", label: "Panipat", state: "Haryana", region: "North" }
];
