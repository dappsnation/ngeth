const textDecoder = new TextDecoder();

export async function ipfsToText(stream: AsyncIterable<Uint8Array>) {
  let text = '';
  for await (const chunk of stream) {
    text += textDecoder.decode(chunk);
  }
  return text;
}

export async function ipfsToJson<T>(stream: AsyncIterable<Uint8Array>): Promise<T> {
  const text = await ipfsToText(stream);
  return JSON.parse(text || '{}');
}

export async function ipfsToBlob(stream: AsyncIterable<Uint8Array>, mime?: string) {
  const parts: BlobPart[] = [];
  for await (const chunk of stream) {
    parts.push(chunk);
  }
  return new Blob(parts, {type: mime})
}

export async function ipfsToBlobUrl(stream: AsyncIterable<Uint8Array>, mime?: string) {
  const blob = await ipfsToBlob(stream, mime);
  return URL.createObjectURL(blob);
}

export const decodeIpfsTo = {
  txt: ipfsToText,
  json: ipfsToJson,
  blob: ipfsToBlob,
  url: ipfsToBlobUrl
}

export type IpfsFormat = keyof typeof decodeIpfsTo;