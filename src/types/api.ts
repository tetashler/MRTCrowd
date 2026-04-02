export interface TrainServiceAlert {
  Status: number;
  Message: Array<{
    Content: string;
    CreatedDate: string;
  }>;
}

export interface CrowdData {
  Station: string;
  StartTime: string;
  CrowdLevel: 'l' | 'm' | 'h';
}

export interface CrowdDataResponse {
  value: CrowdData[];
}
