import { EntitySchema } from "typeorm";

export class Account {
    name: string;
    owner: string;
    bank: string;
    created_at: Date;
}

export const AccountSchema = new EntitySchema<Account>({
  name: "Account",
  columns: {
    name: {
      type: "varchar",
    },
    owner: {
      type: "varchar",
    },
    bank: {
      type: "varchar",
    },
    created_at: {
      type: "timestamp",
    },
  },
});
