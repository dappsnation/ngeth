

export interface OpenseaCollectionMetadata {
  name: string;
  description: string;
  image: string;
  external_link: string;
  /** 100 -> 1% */
  seller_fee_basis_points: number;
  /** Where seller fees will be paid to. */
  fee_recipient: string;
}

export const attributeTypes = ["boost_percentage", "boost_number", "number", "date", "string"];

export interface AttributeNumber {
  trait_type: string;
  display_type: "boost_percentage" | "boost_number" | "number";
  max_value?: number;
  value: number;
}
export interface AttributeDate {
  trait_type: string;
  display_type: "date";
  /** unix timestamp (seconds) */
  value: number;
}
export interface AttributeString {
  trait_type: string;
  value: string;
}

export interface OpenseaAttribute {
  trait_type: string;
  display_type: "boost_percentage" | "boost_number" | "number" | "date";
  max_value?: number;
  value: number | string;
}

export interface OpenseaTokenMetadata {
  /** 
   * This is the URL to the image of the item. Can be just about any type of image (including SVGs, which will be cached into PNGs by OpenSea), and can be IPFS URLs or paths. We recommend using a 350 x 350 image.
   */
  image?: string;

  /**
   * Raw SVG image data, if you want to generate images on the fly (not recommended). Only use this if you're not including the image parameter.
   */
  image_data?: string;
  
  /**
   * This is the URL that will appear below the asset's image on OpenSea and will allow users to leave OpenSea and view the item on your site.
   */
  external_url?: string;
  
  /**
   * A human readable description of the item. Markdown is supported.
   */
  description?: string;
  
  /**
   * Name of the item.
   */
  name?: string;
  
  /**
   * These are the attributes for the item, which will show up on the OpenSea page for the item. (see below)
   */
  attributes: OpenseaAttribute[];
  
  /**
   * Background color of the item on OpenSea. Must be a six-character hexadecimal without a pre-pended #.
   */
  background_color?: string;
  
  /**
   * A URL to a multi-media attachment for the item. The file extensions GLTF, GLB, WEBM, MP4, M4V, OGV, and OGG are supported, along with the audio-only extensions MP3, WAV, and OGA.
   * Animation_url also supports HTML pages, allowing you to build rich experiences and interactive NFTs using JavaScript canvas, WebGL, and more. Scripts and relative paths within the HTML page are now supported. However, access to browser extensions is not supported.
   */
  animation_url?: string;

  /**
   * A URL to a YouTube video.
   */
  youtube_url?: string;
  
}