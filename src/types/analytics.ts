export interface BaseEventProperties {
  client_event_id: string;
  client_event_timestamp: number;
  session_id: string;
  anonymous_id: string;
  user_id?: string;
  country: string;
  market: string;
  language: string;
  user_tier: string;
  device_type: string;
  viewport_size: string;
  route: string;
  page_name: string;
  journey_name: string;
  journey_step: string;
  previous_route: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  app_version: string;
  environment: string;
  [key: string]: any;
}

export interface TrackedEvent {
  id: string;
  timestamp: number;
  event_name: string;
  properties: BaseEventProperties;
}
