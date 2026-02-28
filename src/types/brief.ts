export interface BriefItem {
  title: string;
  url: string;
  summary: string;
  source?: string;
  relevanceNote?: string;
}

export interface BriefOutput {
  whatDropped: BriefItem[];
  relevantToYou: BriefItem[];
  whatToTest: BriefItem[];
  ignoreSummary: string;
}

export interface FreeBriefOutput {
  industryNews: BriefItem[];
  labUpdates: BriefItem[];
}

/** Pad a free brief into the full BriefOutput shape (empty personalized sections) */
export function freeBriefToBriefOutput(free: FreeBriefOutput): BriefOutput {
  return {
    whatDropped: [...free.industryNews, ...free.labUpdates],
    relevantToYou: [],
    whatToTest: [],
    ignoreSummary: "",
  };
}
