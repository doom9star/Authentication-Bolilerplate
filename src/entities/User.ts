import { BeforeInsert, Column, Entity } from "typeorm";
import bcrypt from "bcryptjs";

import Base from "./Base";

@Entity("user")
export default class User extends Base {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
