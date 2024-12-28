export type Platform = 'linkedin' | 'twitter' | 'blog';
export type ContentType = 'post' | 'article' | 'thread';
export type ToneType = 'professional' | 'casual' | 'technical' | 'engaging';

export interface ContentStructure {
  introduction: string;
  mainPoints: string[];
  conclusion: string;
  callToAction?: string;
}

export interface ContentStrategy {
  platform: Platform;
  contentType: ContentType;
  tone: ToneType;
  structure: ContentStructure;
  guidelines: string[];
  keywords: string[];
  targetAudience: {
    demographics: string[];
    interests: string[];
    painPoints: string[];
  };
  metrics: {
    engagement: {
      likes: number;
      shares: number;
      comments: number;
    };
    reach: number;
    conversion: number;
  };
}

export interface ResearchResult {
  topic: string;
  findings: string[];
  statistics: {
    marketSize: string;
    growth: string;
    adoption: string;
  };
  sources: string[];
}

export interface AudienceAnalysis {
  demographics: {
    primaryAge: string;
    occupation: string;
    interests: string[];
  };
  preferences: {
    contentFormat: string;
    readingTime: string;
    engagementFactors: string[];
  };
  platform: {
    bestTimes: string[];
    contentTypes: string[];
    engagement: {
      likes: number;
      shares: number;
      comments: number;
    };
  };
}

export interface GuidelinesCheck {
  platform: string;
  type: string;
  guidelines: {
    maxLength?: number;
    format?: string[];
    bestPractices?: string[];
  };
  compliance: {
    length: boolean;
    format: boolean;
    structure: boolean;
  };
  suggestions: string[];
}

export interface StorageResult {
  id: string;
  status: string;
} 