export type BrandTeamMember = {
  id: string;
  name: string;
  avatarUrl: string;
  role: string;
};

export type BrandData = {
  id: string;
  domain: string;
  name: string;
  location: string;
  bio: string;
  website: string;
  instagram?: string;
  youtube?: string;
  categories: string[];
  campaignsCount: number;
  creatorsWorkedWith: number;
  rating: number;
  trustMetrics: {
    escrowReleaseDays: number;
    responseRate: number;
    repeatCreatorRate: number;
  };
  team: BrandTeamMember[];
};

export const MOCK_BRANDS: Record<string, BrandData> = {
  "creonity": {
    id: "creonity",
    domain: "creonity.com",
    name: "Creonity",
    location: "Bengaluru, India",
    bio: "The workspace where ambitious brands and creators build better campaigns together.",
    website: "creonity.com",
    instagram: "creonity",
    youtube: "creonity",
    categories: ["Creator Economy", "Marketing", "Technology"],
    campaignsCount: 18,
    creatorsWorkedWith: 94,
    rating: 4.9,
    trustMetrics: { escrowReleaseDays: 2, responseRate: 97, repeatCreatorRate: 78 },
    team: [
      { id: "c1", name: "Rishabh", avatarUrl: "https://i.pravatar.cc/150?u=rishabh", role: "Owner" },
      { id: "c2", name: "Maya Shah", avatarUrl: "https://i.pravatar.cc/150?u=maya", role: "Campaign manager" },
      { id: "c3", name: "Arjun Mehta", avatarUrl: "https://i.pravatar.cc/150?u=arjun", role: "Admin" }
    ]
  },
  "ubereats": {
    id: "ubereats",
    domain: "ubereats.com",
    name: "Uber Eats",
    location: "Chicago, IL",
    bio: "The best way to get your favorite food delivered. We are looking for creators who love food and want to share their favorite local spots with the world.",
    website: "ubereats.com",
    instagram: "ubereats",
    youtube: "ubereats",
    categories: ["Food", "Delivery", "Lifestyle"],
    campaignsCount: 42,
    creatorsWorkedWith: 156,
    rating: 4.8,
    trustMetrics: {
      escrowReleaseDays: 2,
      responseRate: 98,
      repeatCreatorRate: 74,
    },
    team: [
      { id: "1", name: "Priya", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", role: "Campaign Manager" },
      { id: "2", name: "Rohan", avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150", role: "Marketing Director" },
      { id: "3", name: "Sarah", avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150", role: "Social Lead" }
    ]
  },
  "nike": {
    id: "nike",
    domain: "nike.com",
    name: "Nike",
    location: "Beaverton, OR",
    bio: "Just Do It. Inspiring the world's athletes through sport, innovation, and storytelling.",
    website: "nike.com",
    instagram: "nike",
    youtube: "nike",
    categories: ["Sports", "Apparel", "Fitness"],
    campaignsCount: 112,
    creatorsWorkedWith: 450,
    rating: 4.9,
    trustMetrics: {
      escrowReleaseDays: 1,
      responseRate: 99,
      repeatCreatorRate: 85,
    },
    team: [
      { id: "n1", name: "Alex", avatarUrl: "https://i.pravatar.cc/150?u=alex", role: "Partnerships" },
      { id: "n2", name: "Jordan", avatarUrl: "https://i.pravatar.cc/150?u=jordan", role: "Creative Director" }
    ]
  },
  "airbnb": {
    id: "airbnb",
    domain: "airbnb.com",
    name: "Airbnb",
    location: "San Francisco, CA",
    bio: "Belong anywhere. We partner with travel and lifestyle creators to showcase unique stays and experiences.",
    website: "airbnb.com",
    instagram: "airbnb",
    youtube: "airbnb",
    categories: ["Travel", "Hospitality", "Lifestyle"],
    campaignsCount: 89,
    creatorsWorkedWith: 320,
    rating: 4.7,
    trustMetrics: {
      escrowReleaseDays: 3,
      responseRate: 95,
      repeatCreatorRate: 68,
    },
    team: [
      { id: "a1", name: "Mia", avatarUrl: "https://i.pravatar.cc/150?u=mia", role: "Creator Manager" },
      { id: "a2", name: "Leo", avatarUrl: "https://i.pravatar.cc/150?u=leo", role: "Brand Lead" }
    ]
  },
  "apple": {
    id: "apple",
    domain: "apple.com",
    name: "Apple",
    location: "Cupertino, CA",
    bio: "Think different. We work with innovative creators to showcase how our products empower creativity and everyday life.",
    website: "apple.com",
    instagram: "apple",
    youtube: "apple",
    categories: ["Technology", "Design", "Lifestyle"],
    campaignsCount: 156,
    creatorsWorkedWith: 890,
    rating: 4.9,
    trustMetrics: {
      escrowReleaseDays: 1,
      responseRate: 98,
      repeatCreatorRate: 92,
    },
    team: [
      { id: "ap1", name: "Tim", avatarUrl: "https://i.pravatar.cc/150?u=tim", role: "Creator Marketing" },
      { id: "ap2", name: "Sarah", avatarUrl: "https://i.pravatar.cc/150?u=sarah", role: "Design Lead" }
    ]
  },
  "patagonia": {
    id: "patagonia",
    domain: "patagonia.com",
    name: "Patagonia",
    location: "Ventura, CA",
    bio: "We're in business to save our home planet. Partnering with outdoor enthusiasts and environmental advocates.",
    website: "patagonia.com",
    instagram: "patagonia",
    youtube: "patagonia",
    categories: ["Outdoors", "Apparel", "Sustainability"],
    campaignsCount: 45,
    creatorsWorkedWith: 210,
    rating: 4.8,
    trustMetrics: {
      escrowReleaseDays: 2,
      responseRate: 94,
      repeatCreatorRate: 75,
    },
    team: [
      { id: "p1", name: "Yvon", avatarUrl: "https://i.pravatar.cc/150?u=yvon", role: "Sustainability Lead" },
      { id: "p2", name: "Rose", avatarUrl: "https://i.pravatar.cc/150?u=rose", role: "Campaign Manager" }
    ]
  }
};
