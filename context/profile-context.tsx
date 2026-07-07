"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  domain?: string;
  startDate: string;
  endDate: string;
  logoInitials?: string;
  logoBg?: string;
  logoColor?: string;
  description?: string;
  workLinks?: WorkLink[];
}

export interface WorkLink {
  id: string;
  title: string;
  url: string;
}

export interface PortfolioTab {
  id: string;
  label: string;
  order: number;
}

export interface PortfolioItem {
  id: string;
  title: string;
  imageUrl: string;
  platform: "instagram" | "x" | "tiktok" | "youtube" | "behance" | "other";
  sourceUrl: string;
  tabId?: string;
  duration?: string;
  views?: number;
  order: number;
  isHidden?: boolean;
}

export interface Organization {
  id: string;
  name: string;
  type: string;
  domain?: string;
}

export interface ProfileData {
  coverImage?: string;
  avatar?: string;
  name: string;
  realName?: string;
  isPublicProfile?: boolean;
  searchEngineIndexing?: boolean;
  showRealName?: boolean;
  tagline: string;
  studio: string;
  followers: string;
  views: string;
  posts: string;
  about: string;
  location: string;
  website: string;
  skills: string[];
  agency?: Organization;
  socials: SocialLink[];
  experience: Experience[];
  portfolioTabs: PortfolioTab[];
  portfolioItems: PortfolioItem[];
}

interface ProfileContextType {
  profile: ProfileData;
  setProfile: React.Dispatch<React.SetStateAction<ProfileData>>;
}

const defaultProfile: ProfileData = {
  name: "Lina Cho",
  realName: "Lina M. Cho",
  isPublicProfile: true,
  searchEngineIndexing: true,
  showRealName: false,
  tagline: "Independent Designer",
  studio: "Studio Else",
  followers: "862",
  views: "416",
  posts: "32",
  about: "I'm a Designer based in New York. I co-founded Good Day Studio™ where we help early stage founders and startups take their product from 0→1.",
  location: "New York City, NY",
  website: "goodday.studio",
  skills: ["Product Design", "UI Design", "Web Design"],
  agency: {
    id: "good-day-studio",
    name: "Good Day Studio™",
    type: "Design Agency",
  },
  socials: [
    { id: "1", platform: "X (Twitter)", url: "https://twitter.com" },
    { id: "2", platform: "Instagram", url: "https://instagram.com" },
  ],
  experience: [
    {
      id: "1",
      role: "Founding Designer",
      company: "Studio Else",
      domain: "",
      startDate: "Aug 2021",
      endDate: "Present",
      logoInitials: "",
      logoBg: "#0010f6",
      logoColor: "white",
      description: "Brand identity and launch design for a new creative studio focused on early-stage products.",
      workLinks: [
        { id: "studio-else-launch", title: "Studio Else launch campaign", url: "https://instagram.com" },
      ],
    },
    {
      id: "2",
      role: "Product Designer",
      company: "Notion",
      domain: "notion.so",
      startDate: "Mar 2019",
      endDate: "Jul 2021",
      description: "Product storytelling and social content exploring better ways for creative teams to organize their work.",
      workLinks: [
        { id: "notion-workflow", title: "A calmer creative workflow", url: "https://instagram.com" },
        { id: "notion-makers", title: "Meet the makers series", url: "https://instagram.com" },
      ],
    },
    {
      id: "3",
      role: "Visual Designer",
      company: "Wise",
      domain: "wise.com",
      startDate: "May 2018",
      endDate: "Feb 2019",
      description: "A visual campaign making international money movement feel simple, human, and approachable.",
      workLinks: [
        { id: "wise-borderless", title: "Borderless stories", url: "https://instagram.com" },
      ],
    },
    {
      id: "4",
      role: "CX Lead",
      company: "Uber",
      domain: "uber.com",
      startDate: "Jan 2016",
      endDate: "May 2018",
      description: "Creator-led city stories built around the people and places that make each ride memorable.",
      workLinks: [
        { id: "uber-city-stories", title: "City stories campaign", url: "https://instagram.com" },
      ],
    },
  ],
  portfolioTabs: [
    { id: "t-reels", label: "Reels", order: 0 },
    { id: "t-images", label: "Images", order: 1 },
    { id: "t-branding", label: "Branding", order: 2 },
  ],
  portfolioItems: [
    { id: "p1",  title: "Ambara Packaging",   imageUrl: "https://images.unsplash.com/photo-1613243555988-441166d4d6fd?auto=format&fit=crop&q=80&w=600&h=800",  platform: "instagram", sourceUrl: "https://instagram.com", tabId: "t-branding", order: 0 },
    { id: "p2",  title: "Sake Bottle Design", imageUrl: "https://images.unsplash.com/photo-1584346133934-a3afd2a33c4c?auto=format&fit=crop&q=80&w=800&h=800",  platform: "instagram", sourceUrl: "https://instagram.com", tabId: "t-images",    order: 1 },
    { id: "p3",  title: "Less Geometry",      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=500&h=888",  platform: "instagram", sourceUrl: "https://instagram.com", tabId: "t-reels",     duration: "0:14", order: 2 },
    { id: "p4",  title: "Reel 1",             imageUrl: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=800&h=600",  platform: "tiktok",   sourceUrl: "https://tiktok.com",   tabId: "t-reels",     order: 3 },
    { id: "p5",  title: "Kurex Branding",     imageUrl: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&q=80&w=800&h=450",  platform: "behance",  sourceUrl: "https://behance.net",  tabId: "t-branding", order: 4 },
    { id: "p6",  title: "Reel 2",             imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600&h=800",  platform: "instagram", sourceUrl: "https://instagram.com", tabId: "t-reels",     duration: "0:30", order: 5 },
    { id: "p7",  title: "Texture Study",      imageUrl: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80&w=800&h=450",  platform: "instagram", sourceUrl: "https://instagram.com", tabId: "t-images",    order: 6 },
    { id: "p8",  title: "Minimal Setup",      imageUrl: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=800&h=800",  platform: "x",        sourceUrl: "https://x.com",        tabId: "t-images",    order: 7 },
    { id: "p9",  title: "Abstract Shapes",    imageUrl: "https://images.unsplash.com/photo-1604871000636-074fa5117945?auto=format&fit=crop&q=80&w=500&h=888",  platform: "instagram", sourceUrl: "https://instagram.com", tabId: "t-reels",     duration: "1:02", order: 8, isHidden: true },
    { id: "p10", title: "Reel 3",             imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600&h=800",  platform: "tiktok",   sourceUrl: "https://tiktok.com",   tabId: "t-reels",     order: 9 },
    { id: "p11", title: "UI Design",          imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800&h=600",  platform: "behance",  sourceUrl: "https://behance.net",  order: 10 },
    { id: "p12", title: "Architecture",       imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800&h=800",  platform: "instagram", sourceUrl: "https://instagram.com", tabId: "t-images",    order: 11 },
  ],
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
