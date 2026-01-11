export interface Tweet {
  id: string;
  text: string;
  timestamp: string;
}

export interface RiskFactor {
  id: string;
  name: string;
  deduction: number;
  detected: boolean;
  count: number;
  description: string;
}

export interface AnalysisResult {
  score: number;
  verdict: 'Safe' | 'Moderate Risk' | 'High Risk';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  factors: RiskFactor[];
  tweetsScanned: number;
  recommendations: string[];
}

export enum AnalysisStage {
  IDLE,
  FETCHING,
  ANALYZING,
  COMPLETE,
  ERROR
}