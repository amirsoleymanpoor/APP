export interface InspectionIssue {
  id: string;
  title: string;
  category: 'burn' | 'missing' | 'damage' | 'solder' | 'other';
  severity: 'high' | 'medium' | 'low';
  location: string;
  boundingBox?: [number, number, number, number];
  description: string;
  recommendation: string;
}

export interface InspectionResult {
  id: string;
  timestamp: string;
  componentName: string;
  componentType: string;
  overallStatus: 'PASSED' | 'DEFECTIVE' | 'WARNING';
  defectDetected: boolean;
  qualityScore: number;
  qualityGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  summary: string;
  detectedIssues: InspectionIssue[];
  healthyAreas: string[];
  imageUrl: string;
  inspectionTimeMs: number;
}

export interface ApiResponse {
  success: boolean;
  result?: InspectionResult;
  error?: string;
  detail?: string;
}
