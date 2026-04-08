export interface MRTLine {
  code: string;
  name: string;
  fullName: string;
  color: string;
}

export const MRT_LINES: MRTLine[] = [
  { code: 'NSL', name: 'NSL', fullName: 'North-South Line', color: '#EF3340' },
  { code: 'EWL', name: 'EWL', fullName: 'East-West Line', color: '#009645' },
  { code: 'NEL', name: 'NEL', fullName: 'North-East Line', color: '#9B26B6' },
  { code: 'CCL', name: 'CCL', fullName: 'Circle Line', color: '#FA9E0D' },
  { code: 'DTL', name: 'DTL', fullName: 'Downtown Line', color: '#005EC4' },
  { code: 'TEL', name: 'TEL', fullName: 'Thomson-East Coast Line', color: '#9D5B25' },
];

export const STATION_NAMES: Record<string, string> = {
  NS1: 'Jurong East', NS2: 'Bukit Batok', NS3: 'Bukit Gombak', NS4: 'Choa Chu Kang',
  NS5: 'Yew Tee', NS7: 'Kranji', NS8: 'Marsiling', NS9: 'Woodlands', NS10: 'Admiralty',
  NS11: 'Sembawang', NS12: 'Canberra', NS13: 'Yishun', NS14: 'Khatib', NS15: 'Yio Chu Kang',
  NS16: 'Ang Mo Kio', NS17: 'Bishan', NS18: 'Braddell', NS19: 'Toa Payoh', NS20: 'Novena',
  NS21: 'Newton', NS22: 'Orchard', NS23: 'Somerset', NS24: 'Dhoby Ghaut', NS25: 'City Hall',
  NS26: 'Raffles Place', NS27: 'Marina Bay', NS28: 'Marina South Pier',
  EW1: 'Pasir Ris', EW2: 'Tampines', EW3: 'Simei', EW4: 'Tanah Merah', EW5: 'Bedok',
  EW6: 'Kembangan', EW7: 'Eunos', EW8: 'Paya Lebar', EW9: 'Aljunied', EW10: 'Kallang',
  EW11: 'Lavender', EW12: 'Bugis', EW13: 'City Hall', EW14: 'Raffles Place',
  EW15: 'Tanjong Pagar', EW16: 'Outram Park', EW17: 'Tiong Bahru', EW18: 'Redhill',
  EW19: 'Queenstown', EW20: 'Commonwealth', EW21: 'Buona Vista', EW22: 'Dover',
  EW23: 'Clementi', EW24: 'Jurong East', EW25: 'Chinese Garden', EW26: 'Lakeside',
  EW27: 'Boon Lay', EW28: 'Pioneer', EW29: 'Joo Koon', EW30: 'Gul Circle',
  EW31: 'Tuas Crescent', EW32: 'Tuas West Road', EW33: 'Tuas Link',
  NE1: 'HarbourFront', NE3: 'Outram Park', NE4: 'Chinatown', NE5: 'Clarke Quay',
  NE6: 'Dhoby Ghaut', NE7: 'Little India', NE8: 'Farrer Park', NE9: 'Boon Keng',
  NE10: 'Potong Pasir', NE11: 'Woodleigh', NE12: 'Serangoon', NE13: 'Kovan',
  NE14: 'Hougang', NE15: 'Buangkok', NE16: 'Sengkang', NE17: 'Punggol',
  CC1: 'Dhoby Ghaut', CC2: 'Bras Basah', CC3: 'Esplanade', CC4: 'Promenade',
  CC5: 'Nicoll Highway', CC6: 'Stadium', CC7: 'Mountbatten', CC8: 'Dakota',
  CC9: 'Paya Lebar', CC10: 'MacPherson', CC11: 'Tai Seng', CC12: 'Bartley',
  CC13: 'Serangoon', CC14: 'Lorong Chuan', CC15: 'Bishan', CC16: 'Marymount',
  CC17: 'Caldecott', CC19: 'Botanic Gardens', CC20: 'Farrer Road', CC21: 'Holland Village',
  CC22: 'Buona Vista', CC23: 'one-north', CC24: 'Kent Ridge', CC25: 'Haw Par Villa',
  CC26: 'Pasir Panjang', CC27: 'Labrador Park', CC28: 'Telok Blangah', CC29: 'HarbourFront',
  DT1: 'Bukit Panjang', DT2: 'Cashew', DT3: 'Hillview', DT5: 'Beauty World',
  DT6: 'King Albert Park', DT7: 'Sixth Avenue', DT8: 'Tan Kah Kee', DT9: 'Botanic Gardens',
  DT10: 'Stevens', DT11: 'Newton', DT12: 'Little India', DT13: 'Rochor', DT14: 'Bugis',
  DT15: 'Promenade', DT16: 'Bayfront', DT17: 'Downtown', DT18: 'Telok Ayer',
  DT19: 'Chinatown', DT20: 'Fort Canning', DT21: 'Bencoolen', DT22: 'Jalan Besar',
  DT23: 'Bendemeer', DT24: 'Geylang Bahru', DT25: 'Mattar', DT26: 'MacPherson',
  DT27: 'Ubi', DT28: 'Kaki Bukit', DT29: 'Bedok North', DT30: 'Bedok Reservoir',
  DT31: 'Tampines West', DT32: 'Tampines', DT33: 'Tampines East', DT34: 'Upper Changi',
  DT35: 'Expo',
  TE1: 'Woodlands North', TE2: 'Woodlands', TE3: 'Woodlands South', TE4: 'Springleaf',
  TE5: 'Lentor', TE6: 'Mayflower', TE7: 'Bright Hill', TE8: 'Upper Thomson',
  TE9: 'Caldecott', TE11: 'Stevens', TE12: 'Napier', TE13: 'Orchard Boulevard',
  TE14: 'Orchard', TE15: 'Great World', TE16: 'Havelock', TE17: 'Outram Park',
  TE18: 'Maxwell', TE19: 'Shenton Way', TE20: 'Marina Bay', TE22: "Founders' Memorial",
  TE23: 'Tanjong Rhu', TE24: 'Katong Park', TE25: 'Tanjong Katong',
  TE26: 'Marine Parade', TE27: 'Marine Terrace', TE28: 'Siglap', TE29: 'Bayshore',
};

// Maps each station code to the OTHER lines it connects to (for interchange badges)
export const INTERCHANGE_LINES: Record<string, string[]> = {
  // Jurong East: NSL + EWL
  NS1: ['EWL'], EW24: ['NSL'],
  // City Hall: NSL + EWL
  NS25: ['EWL'], EW13: ['NSL'],
  // Raffles Place: NSL + EWL
  NS26: ['EWL'], EW14: ['NSL'],
  // Dhoby Ghaut: NSL + NEL + CCL
  NS24: ['NEL', 'CCL'], NE6: ['NSL', 'CCL'], CC1: ['NSL', 'NEL'],
  // Outram Park: EWL + NEL + TEL
  EW16: ['NEL', 'TEL'], NE3: ['EWL', 'TEL'], TE17: ['EWL', 'NEL'],
  // Paya Lebar: EWL + CCL
  EW8: ['CCL'], CC9: ['EWL'],
  // Serangoon: NEL + CCL
  NE12: ['CCL'], CC13: ['NEL'],
  // Bishan: NSL + CCL
  NS17: ['CCL'], CC15: ['NSL'],
  // Botanic Gardens: CCL + DTL
  CC19: ['DTL'], DT9: ['CCL'],
  // Buona Vista: EWL + CCL
  EW21: ['CCL'], CC22: ['EWL'],
  // HarbourFront: NEL + CCL
  NE1: ['CCL'], CC29: ['NEL'],
  // Chinatown: NEL + DTL
  NE4: ['DTL'], DT19: ['NEL'],
  // Little India: NEL + DTL
  NE7: ['DTL'], DT12: ['NEL'],
  // Bugis: EWL + DTL
  EW12: ['DTL'], DT14: ['EWL'],
  // Promenade: CCL + DTL
  CC4: ['DTL'], DT15: ['CCL'],
  // Newton: NSL + DTL
  NS21: ['DTL'], DT11: ['NSL'],
  // Stevens: DTL + TEL
  DT10: ['TEL'], TE11: ['DTL'],
  // Caldecott: CCL + TEL
  CC17: ['TEL'], TE9: ['CCL'],
  // Marina Bay: NSL + TEL
  NS27: ['TEL'], TE20: ['NSL'],
  // MacPherson: CCL + DTL
  CC10: ['DTL'], DT26: ['CCL'],
  // Tampines: EWL + DTL
  EW2: ['DTL'], DT32: ['EWL'],
  // Woodlands: NSL + TEL
  NS9: ['TEL'], TE2: ['NSL'],
  // Orchard: NSL + TEL
  NS22: ['TEL'], TE14: ['NSL'],
};

export const LINE_STATIONS: Record<string, string[]> = {
  NSL: ['NS1', 'NS2', 'NS3', 'NS4', 'NS5', 'NS7', 'NS8', 'NS9', 'NS10', 'NS11', 'NS12', 'NS13', 'NS14', 'NS15', 'NS16', 'NS17', 'NS18', 'NS19', 'NS20', 'NS21', 'NS22', 'NS23', 'NS24', 'NS25', 'NS26', 'NS27', 'NS28'],
  EWL: ['EW1', 'EW2', 'EW3', 'EW4', 'EW5', 'EW6', 'EW7', 'EW8', 'EW9', 'EW10', 'EW11', 'EW12', 'EW13', 'EW14', 'EW15', 'EW16', 'EW17', 'EW18', 'EW19', 'EW20', 'EW21', 'EW22', 'EW23', 'EW24', 'EW25', 'EW26', 'EW27', 'EW28', 'EW29', 'EW30', 'EW31', 'EW32', 'EW33'],
  NEL: ['NE1', 'NE3', 'NE4', 'NE5', 'NE6', 'NE7', 'NE8', 'NE9', 'NE10', 'NE11', 'NE12', 'NE13', 'NE14', 'NE15', 'NE16', 'NE17'],
  CCL: ['CC1', 'CC2', 'CC3', 'CC4', 'CC5', 'CC6', 'CC7', 'CC8', 'CC9', 'CC10', 'CC11', 'CC12', 'CC13', 'CC14', 'CC15', 'CC16', 'CC17', 'CC19', 'CC20', 'CC21', 'CC22', 'CC23', 'CC24', 'CC25', 'CC26', 'CC27', 'CC28', 'CC29'],
  DTL: ['DT1', 'DT2', 'DT3', 'DT5', 'DT6', 'DT7', 'DT8', 'DT9', 'DT10', 'DT11', 'DT12', 'DT13', 'DT14', 'DT15', 'DT16', 'DT17', 'DT18', 'DT19', 'DT20', 'DT21', 'DT22', 'DT23', 'DT24', 'DT25', 'DT26', 'DT27', 'DT28', 'DT29', 'DT30', 'DT31', 'DT32', 'DT33', 'DT34', 'DT35'],
  TEL: ['TE1', 'TE2', 'TE3', 'TE4', 'TE5', 'TE6', 'TE7', 'TE8', 'TE9', 'TE11', 'TE12', 'TE13', 'TE14', 'TE15', 'TE16', 'TE17', 'TE18', 'TE19', 'TE20', 'TE22', 'TE23', 'TE24', 'TE25', 'TE26', 'TE27', 'TE28', 'TE29'],
};

export const getStationName = (code: string): string => {
  return STATION_NAMES[code] || code;
};

export const getLineColor = (lineCode: string): string => {
  const line = MRT_LINES.find(l => l.code === lineCode);
  return line?.color || '#999';
};