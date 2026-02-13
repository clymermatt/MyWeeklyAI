export interface BriefItem {
  title: string;
  url: string;
  summary: string;
  relevanceNote?: string;
}

export interface BriefOutput {
  whatDropped: BriefItem[];
  relevantToYou: BriefItem[];
  whatToTest: BriefItem[];
  ignoreSummary: string;
}
