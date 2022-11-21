export type BikesAvailablePerType = {
  mechanical: number;
  ebike: number;
};

export type StationStatus = {
  station_id: number;
  num_bikes_available: number;
  num_docks_available: number;
  num_docks_disabled: number;
  is_installed: boolean;
  is_returning: boolean;
  is_renting: boolean;
  last_reported: number;
  num_bikes_available_types: BikesAvailablePerType;
};

export type StationInformation = {
  station_id: number;
  name: string;
  lat: number;
  lon: number;
  capacity: number;
};

export type StationNearby = {
  distance: number;
  station: StationDetail;
};

export type StationDetail = {
  info: StationInformation;
  current_status: StationStatus;
  history: StationStatus[];
  nearby: StationNearby[];
};
