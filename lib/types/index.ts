/**
 * Core type definitions for Tamedachi
 */

export interface Pet {
  id: string;
  userId: string;
  name: string;
  healthScore: number;
  ageYears: number;
  goodContentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContentSubmission {
  id: string;
  userId: string;
  petId: string;
  url: string;
  credibilityScore: number;
  qualityCategory: QualityCategory;
  isGoodContent: boolean;
  submittedAt: Date;
}

export interface ContentAnalysisResult {
  url: string;
  credibilityScore: number;
  qualityCategory: QualityCategory;
  qualityMessage: string;
  isGoodContent: boolean;
  analysis: string;
}

export type QualityCategory = 'excellent' | 'good' | 'questionable' | 'poor';

export type PetHealthState = 'very-happy' | 'healthy' | 'neutral' | 'unhappy' | 'sick';

export interface PetHealthStateInfo {
  state: PetHealthState;
  message: string;
}
