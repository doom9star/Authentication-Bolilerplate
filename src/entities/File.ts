import { Column, Entity } from "typeorm";
import { FileType } from "../lib/types";
import Base from "./Base";

@Entity("file")
export default class File extends Base {
  @Column()
  url: string;

  @Column()
  cid: string;

  @Column({ type: "enum", enum: FileType, default: FileType.FILE })
  type: FileType;
}
