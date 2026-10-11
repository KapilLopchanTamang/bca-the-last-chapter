// CENTRAL MEMORY & PROJECT CONFIGURATION
// Everything in this file is easily editable for batch customization.

export interface ChapterTiming {
  id: 'opening' | 'beginning' | 'classroom' | 'friendships' | 'journey' | 'final' | 'closing';
  title: string;
  subtitle: string;
  startPercent: number; // 0 to 100 percentage of total song duration
  endPercent: number;
}

export interface MemoryProjectConfig {
  collegeName: string;
  batchName: string;
  graduationYear: string;
  motto: string;

  // Opening screen copy
  opening: {
    badge: string;
    title: string;
    subtitle: string;
    quote: string;
    playButtonText: string;
    headphoneNote: string;
  };

  // Final scene graduation message
  finalMessage: {
    mainHeading: string;
    subHeading: string;
    quoteLines: string[];
    signatureTitle: string;
    signatureSub: string;
    date: string;
  };

  // Audio track configuration
  audio: {
    src: string;
    title: string;
    artist: string;
    defaultVolume: number;
  };

  // Chapter timeline progression (normalized to audio duration)
  chapterTimings: ChapterTiming[];

  // Batch members / Yearbook roster
  batchMembers: {
    id: string;
    name: string;
    superlative: string;
    quote?: string;
  }[];

  // Social / Meta
  share: {
    title: string;
    description: string;
    url: string;
  };
}

export const MEMORY_CONFIG: MemoryProjectConfig = {
  collegeName: "Department of Computer Applications",
  batchName: "BCA Batch 2021 — 2024",
  graduationYear: "2024",
  motto: "Code. Create. Cherish.",

  opening: {
    badge: "GRADUATION FAREWELL MEMORY EXPERIENCE",
    title: "BCA — THE LAST CHAPTER",
    subtitle: "Like clouds drifting across the sky, our memories remain forever.",
    quote: "Some places become memories. Some people become family.\nLike clouds that drifted together, now we journey to new skies.",
    playButtonText: "REVISIT OUR MEMORIES",
    headphoneNote: "Put on your headphones for the full cinematic experience",
  },

  finalMessage: {
    mainHeading: "WE CAME AS STUDENTS. WE LEAVE AS MEMORIES.",
    subHeading: "BCA — THE END OF ONE CHAPTER, THE BEGINNING OF ANOTHER.",
    quoteLines: [
      "Like clouds (बादल सरि) that drifted together across these unforgettable college years,",
      "To the late nights, the computer labs, the canteen laughter, and friendships that became family.",
      "Wherever life's winds take each of us, a part of our hearts will always belong here."
    ],
    signatureTitle: "BCA Graduating Batch",
    signatureSub: "Forever a part of our story.",
    date: "Class of 2024",
  },

  audio: {
    src: "/audio/farewell.mp3",
    title: "Badal Sari",
    artist: "BCA Farewell Soundtrack",
    defaultVolume: 0.85,
  },

  // Chapter timings synchronized with total track duration
  chapterTimings: [
    {
      id: "opening",
      title: "Classroom Entrance",
      subtitle: "The doors open to the past",
      startPercent: 0,
      endPercent: 7,
    },
    {
      id: "beginning",
      title: "The Beginning",
      subtitle: "Every journey begins somewhere",
      startPercent: 7,
      endPercent: 24,
    },
    {
      id: "classroom",
      title: "The Classroom",
      subtitle: "More than lectures. More than code.",
      startPercent: 24,
      endPercent: 46,
    },
    {
      id: "friendships",
      title: "The Friendships",
      subtitle: "Some classmates became lifelong family",
      startPercent: 46,
      endPercent: 68,
    },
    {
      id: "journey",
      title: "The Journey",
      subtitle: "We learned. We built. We grew.",
      startPercent: 68,
      endPercent: 86,
    },
    {
      id: "final",
      title: "The Final Chapter",
      subtitle: "Different paths. One unforgettable story.",
      startPercent: 86,
      endPercent: 95,
    },
    {
      id: "closing",
      title: "Forever Memories",
      subtitle: "The doors close, the memories remain",
      startPercent: 95,
      endPercent: 100,
    },
  ],

  batchMembers: [
    { id: "1", name: "BCA Class Representative", superlative: "The Guiding Beacon", quote: "We survived all submissions together!" },
    { id: "2", name: "The Lab Master", superlative: "Segmentation Fault Tamer", quote: "It worked on my local machine!" },
    { id: "3", name: "The Front-Row Scholar", superlative: "Every Assignment Before Deadline", quote: "Can you send the notes from lecture 4?" },
    { id: "4", name: "The Canteen Philosopher", superlative: "Chai & Deep Discussions", quote: "Life's true lessons happened between breaks." },
    { id: "5", name: "The Presentation Hero", superlative: "Speaks for 15 mins Without Slides", quote: "Trust me, I have the demo ready." },
    { id: "6", name: "The Silent Coder", superlative: "10,000 Lines, Zero Errors", quote: "Push to main and pray." },
    { id: "7", name: "The Event Organizer", superlative: "Heart of Every Celebration", quote: "One more photo, guys!" },
    { id: "8", name: "The Backbench Legends", superlative: "Endless Laughter & Last-Minute Wonders", quote: "We came as strangers, we leave as brothers and sisters." },
  ],

  share: {
    title: "BCA — The Last Chapter",
    description: "A cinematic 3D collection of memories, friendships, and moments from our BCA graduation journey.",
    url: "https://bca-the-last-chapter.vercel.app",
  },
};
