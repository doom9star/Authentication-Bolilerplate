import DataURIParser from "datauri/parser";
import path from "path";

const parser = new DataURIParser();

export default function getImageData(
  fileName: string,
  buffer: Buffer
): string | undefined {
  return parser.format(path.extname(fileName), buffer).content;
}
