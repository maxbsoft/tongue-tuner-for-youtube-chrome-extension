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

interface ResponseContext {
  serviceTrackingParams?: ServiceTrackingParams[];
  maxAgeSeconds?: number;
  mainAppWebResponseContext?: MainAppWebResponseContext;
  webResponseContextExtensionData?: WebResponseContextExtensionData;
}

interface ServiceTrackingParams {
  service?: string;
  params?: Param[];
}

interface Param {
  key?: string;
  value?: string;
}

interface MainAppWebResponseContext {
  loggedOut?: boolean;
  trackingParam?: string;
}

interface WebResponseContextExtensionData {
  hasDecorated?: boolean;
}

interface PlayabilityStatus {
  status?: string;
  playableInEmbed?: boolean;
  miniplayer?: Miniplayer;
  contextParams?: string;
}

interface Miniplayer {
  miniplayerRenderer?: MiniplayerRenderer;
}

interface MiniplayerRenderer {
  playbackMode?: string;
}

// Для StreamingData и VideoDetails
interface StreamingData {
  expiresInSeconds?: string;
  formats?: Format[];
  adaptiveFormats?: Format[];
}

interface Format {
  itag?: number;
  url?: string;
  mimeType?: string;
  bitrate?: number;
  width?: number;
  height?: number;
  lastModified?: string;
  contentLength?: string;
  quality?: string;
  fps?: number;
  qualityLabel?: string;
  projectionType?: string;
  averageBitrate?: number;
  audioQuality?: string;
  approxDurationMs?: string;
  audioSampleRate?: string;
  audioChannels?: number;
  initRange?: Range;
  indexRange?: Range;
  colorInfo?: ColorInfo;
}

interface Range {
  start?: string;
  end?: string;
}

interface ColorInfo {
  primaries?: string;
  transferCharacteristics?: string;
  matrixCoefficients?: string;
}

interface VideoDetails {
  videoId?: string;
  title?: string;
  lengthSeconds?: string;
  channelId?: string;
  isOwnerViewing?: boolean;
  shortDescription?: string;
  isCrawlable?: boolean;
  thumbnail?: Thumbnails;
  allowRatings?: boolean;
  viewCount?: string;
  author?: string;
  isPrivate?: boolean;
  isUnpluggedCorpus?: boolean;
  isLiveContent?: boolean;
}

interface Thumbnails {
  thumbnails?: Thumbnail[];
}

interface Thumbnail {
  url?: string;
  width?: number;
  height?: number;
}

// Продолжение определения типов

interface Annotations {
  playerAnnotationsExpandedRenderer?: PlayerAnnotationsExpandedRenderer[];
}

interface PlayerAnnotationsExpandedRenderer {
  featuredChannel?: FeaturedChannel;
  trackingParams?: string;
  navigationEndpoint?: NavigationEndpoint;
  channelName?: string;
  subscribeButton?: SubscribeButton;
  allowSwipeDismiss?: boolean;
  annotationId?: string;
}

interface FeaturedChannel {
  startTimeMs?: string;
  endTimeMs?: string;
  watermark?: Thumbnails;
}

interface NavigationEndpoint {
  clickTrackingParams?: string;
  commandMetadata?: CommandMetadata;
  browseEndpoint?: BrowseEndpoint;
}

interface CommandMetadata {
  webCommandMetadata?: WebCommandMetadata;
}

interface WebCommandMetadata {
  url?: string;
  webPageType?: string;
  rootVe?: number;
  apiUrl?: string;
}

interface BrowseEndpoint {
  browseId?: string;
}

interface SubscribeButton {
  subscribeButtonRenderer?: SubscribeButtonRenderer;
}

interface SubscribeButtonRenderer {
  buttonText?: Text;
  subscribed?: boolean;
  enabled?: boolean;
  type?: string;
  channelId?: string;
  showPreferences?: boolean;
  subscribedButtonText?: Text;
  unsubscribedButtonText?: Text;
  trackingParams?: string;
  unsubscribeButtonText?: Text;
  serviceEndpoints?: ServiceEndpoint[];
}

interface Text {
  runs?: Run[];
}

interface Run {
  text?: string;
}

interface ServiceEndpoint {
  clickTrackingParams?: string;
  commandMetadata?: CommandMetadata;
  subscribeEndpoint?: SubscribeEndpoint;
  signalServiceEndpoint?: SignalServiceEndpoint;
}

interface SubscribeEndpoint {
  channelIds?: string[];
  params?: string;
}

interface SignalServiceEndpoint {
  signal?: string;
  actions?: Action[];
}

interface Action {
  clickTrackingParams?: string;
  openPopupAction?: OpenPopupAction;
}

interface OpenPopupAction {
  popup?: Popup;
  popupType?: string;
}

interface Popup {
  confirmDialogRenderer?: ConfirmDialogRenderer;
}

interface ConfirmDialogRenderer {
  trackingParams?: string;
  dialogMessages?: Text[];
  confirmButton?: ButtonRendererContainer;
  cancelButton?: ButtonRendererContainer;
  primaryIsCancel?: boolean;
}

export interface ButtonRendererContainer {
  buttonRenderer?: ButtonRenderer;
}

export interface ButtonRenderer {
  style?: string;
  size?: string;
  isDisabled?: boolean;
  text?: Text;
  serviceEndpoint?: ServiceEndpoint;
  accessibility?: Accessibility;
  trackingParams?: string;
}

export interface Accessibility {
  label?: string;
}

export interface Captions {
  playerCaptionsTracklistRenderer?: PlayerCaptionsTracklistRenderer;
}

export interface PlayerCaptionsTracklistRenderer {
  captionTracks?: CaptionTrack[];
  audioTracks?: AudioTrack[];
  translationLanguages?: TranslationLanguage[];
  defaultAudioTrackIndex?: number;
}

export interface CaptionTrack {
  baseUrl?: string;
  name?: Text;
  vssId?: string;
  languageCode?: string;
  kind?: string;
  isTranslatable?: boolean;
  trackName?: string;
}

export interface AudioTrack {
  captionTrackIndices?: number[];
}

export interface TranslationLanguage {
  languageCode?: string;
  languageName?: Text;
}

export interface VideoPlayerData {
  responseContext?: ResponseContext;
  playabilityStatus?: PlayabilityStatus;
  streamingData?: StreamingData;
  videoDetails?: VideoDetails;
  annotations?: Annotations;
  captions?: Captions;
}
