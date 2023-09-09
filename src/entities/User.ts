import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from "typeorm";
import bcrypt from "bcryptjs";
import Base from "./Base";
import File from "./File";

@Entity("user")
export default class User extends Base {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  activated: boolean;

  @OneToOne(() => File, { cascade: true })
  @JoinColumn()
  avatar: File;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
