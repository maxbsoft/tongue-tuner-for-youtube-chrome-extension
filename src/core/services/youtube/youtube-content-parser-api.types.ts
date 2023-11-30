export interface ExperimentFlags {
  [key: string]: boolean | number;
}

export interface ClientInfo {
  hl: string;
  gl: string;
  remoteHost: string;
  deviceMake: string;
  deviceModel: string;
  visitorData: string;
  userAgent: string;
  clientName: string;
  clientVersion: string;
  osName: string;
  osVersion: string;
  originalUrl: string;
  platform: string;
  clientFormFactor: string;
  configInfo: ConfigInfo;
  userInterfaceTheme: string;
  timeZone: string;
  browserName: string;
  browserVersion: string;
  acceptHeader: string;
  deviceExperimentId: string;
}

export interface ConfigInfo {
  appInstallData: string;
}

export interface UserContext {
  lockedSafetyMode: boolean;
}

export interface RequestContext {
  useSsl: boolean;
}

export interface ClickTrackingContext {
  clickTrackingParams: string;
}

export interface InnertubeContext {
  client: ClientInfo;
  user: UserContext;
  request: RequestContext;
  clickTracking: ClickTrackingContext;
}

export interface ProductData {
  polymer: string;
  polymer2: string;
  accept_language: string;
}

export interface WebPlayerContextConfigs {
  [key: string]: WebPlayerContextConfig;
}

export interface WebPlayerContextConfig {
  transparentBackground: boolean;
  showMiniplayerButton: boolean;
  externalFullscreen: boolean;
  showMiniplayerUiWhenMinimized: boolean;
  rootElementId: string;
  jsUrl: string;
  cssUrl: string;
  contextId: string;
  eventLabel: string;
  contentRegion: string;
  hl: string;
  hostLanguage: string;
  playerStyle: string;
  innertubeApiKey: string;
  innertubeApiVersion: string;
  innertubeContextClientVersion: string;
  device: DeviceInfo;
  serializedExperimentIds: string;
  serializedExperimentFlags: string;
  cspNonce: string;
  canaryState: string;
  enableCsiLogging: boolean;
  csiPageType: string;
  authorizedUserIndex: number;
  datasyncId: string;
  allowWoffleManagement: boolean;
  cinematicSettingsAvailable: boolean;
  canaryStage: string;
  // ... Other fields, if any
}

export interface DeviceInfo {
  brand: string;
  model: string;
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  platform: string;
  interfaceName: string;
  interfaceVersion: string;
}

export interface FexpExperiments {
  [index: number]: number;
}

export interface YoutubeVideoConfig {
  CLIENT_CANARY_STATE: string;
  DEVICE: string;
  DISABLE_YT_IMG_DELAY_LOADING: boolean;
  ELEMENT_POOL_DEFAULT_CAP: number;
  EVENT_ID: string;
  EXPERIMENT_FLAGS: ExperimentFlags;
  GAPI_HINT_PARAMS: string;
  GAPI_HOST: string;
  GAPI_LOCALE: string;
  GL: string;
  GOOGLE_FEEDBACK_PRODUCT_ID: string;
  GOOGLE_FEEDBACK_PRODUCT_DATA: GoogleFeedbackProductData;
  HL: string;
  HTML_DIR: string;
  HTML_LANG: string;
  ID_TOKEN: string;
  INNERTUBE_API_KEY: string;
  INNERTUBE_API_VERSION: string;
  INNERTUBE_CLIENT_NAME: string;
  INNERTUBE_CLIENT_VERSION: string;
  INNERTUBE_CONTEXT: InnertubeContext;
  INNERTUBE_CONTEXT_CLIENT_NAME: number;
  INNERTUBE_CONTEXT_CLIENT_VERSION: string;
  INNERTUBE_CONTEXT_GL: string;
  INNERTUBE_CONTEXT_HL: string;
  LATEST_ECATCHER_SERVICE_TRACKING_PARAMS: LatestEcatcherServiceTrackingParams;
  LOGGED_IN: boolean;
  PAGE_BUILD_LABEL: string;
  PAGE_CL: number;
  scheduler: SchedulerConfig;
  WEB_PLAYER_CONTEXT_CONFIGS: WebPlayerContextConfigs;
  FEXP_EXPERIMENTS: FexpExperiments;
}

export interface GoogleFeedbackProductData {
  polymer: string;
  polymer2: string;
  accept_language: string;
}

export interface LatestEcatcherServiceTrackingParams {
  'client.name': string;
}

export interface SchedulerConfig {
  useRaf: boolean;
  timeout: number;
}

export interface SubtitleObject {
  wireMagic: string;
  pens: Pen[];
  wsWinStyles: WsWinStyle[];
  wpWinPositions: WpWinPosition[];
  events: SubtitleEvent[];
}

export interface Pen {
  // add Pen properties here
}

export interface WsWinStyle {
  // add the WsWinStyle property here
}

export interface WpWinPosition {
  // add the WpWinPosition property here
}

export interface SubtitleEvent {
  tStartMs: number;
  dDurationMs: number;
  segs: Seg[];
}

export interface Seg {
  utf8: string;
}
