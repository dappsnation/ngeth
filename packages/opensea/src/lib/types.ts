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