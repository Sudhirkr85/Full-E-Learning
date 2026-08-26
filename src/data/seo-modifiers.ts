export interface SeoModifier {
  modifier: string; // URL slug
  label: string; // Intent modifier prefix
  badge: string; // Trust badge text
  ctaText: string; // Call-to-action text
}

export const SEO_MODIFIERS: SeoModifier[] = [
  {
    modifier: "best",
    label: "Best",
    badge: "100% Quality Coaching",
    ctaText: "Enroll in the Best Batch"
  },
  {
    modifier: "top",
    label: "Top-Rated",
    badge: "Highest Selection Rate",
    ctaText: "Join Top-Rated Classes"
  },
  {
    modifier: "online",
    label: "Online",
    badge: "Live Classes from Home",
    ctaText: "Start Learning Online"
  },
  {
    modifier: "offline",
    label: "Classroom/Offline",
    badge: "In-Person Classroom Coaching",
    ctaText: "Join Classroom Batch"
  },
  {
    modifier: "weekend",
    label: "Weekend Batch",
    badge: "Flexible Schedule",
    ctaText: "Register for Weekend Batch"
  },
  {
    modifier: "affordable",
    label: "Affordable",
    badge: "Budget-Friendly Classes",
    ctaText: "Register at Low Cost"
  },
  {
    modifier: "certified",
    label: "Government Certified",
    badge: "Verified Trust & Integrity",
    ctaText: "Enroll in Certified Course"
  },
  {
    modifier: "near-me",
    label: "Coaching Near Me",
    badge: "Local Learning Centers",
    ctaText: "Find Classes Near Me"
  }
];
