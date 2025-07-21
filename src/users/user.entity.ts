import {
  Entity,
  PrimaryColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";

export type UserRole =
  | "root"
  | "worker"
  | "manager"
  | "logistics"
  | "smm"
  | "call-center";

@Entity("users")
export class User {
  @PrimaryColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255, unique: true })
  login: string;

  @Column({ type: "varchar", length: 255 })
  password: string;

  @Column({
    type: "enum",
    enum: ["root", "worker", "manager", "logistics", "smm", "call-center"],
    default: "worker",
  })
  role: UserRole;

  @Column({ name: "can_edit_products", type: "boolean", default: false })
  canEditProducts: boolean;

  @Column({ name: "can_manage_logistics", type: "boolean", default: false })
  canManageLogistics: boolean;

  @Column({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column({
    name: "updated_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
