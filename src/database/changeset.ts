import {
  TNewDistribution,
  TNewLiquidityProduct,
  TNewLockToken,
  TNewObelisk,
  TNewPharo,
  TNewPolicy,
  TNewPrice,
  TNewRole,
  TNewSignedPolicy,
  TNewSignedPosition,
  TNewTransfer,
  TNewUser,
  TNewUserRewards,
  TNewWoS,
  TPartialLiquidityProduct,
  TPartialLockToken,
  TPartialObelisk,
  TPartialPharo,
  TPartialPolicy,
  TPartialPrice,
  TPartialRole,
  TPartialSignedPolicy,
  TPartialSignedPosition,
  TPartialUserRewards,
  TPartialWoS,
} from "./schema.js";

export type Insertable<T> = T;
export type InsertMany<T> = T[];
export type Selectable<T> = T;
export type Updateable<T> = Partial<Omit<T, "id">>;

export type DataChange =
  | {
      type: Insertable<"InsertPolicy">;
      policy: TNewPolicy;
    }
  | {
      type: InsertMany<"InsertManyPolicies">;
      policies: TNewPolicy[];
    }
  | {
      type: "UpdatePolicy";
      policyId: number;
      policy: TPartialPolicy;
    }
  | {
      type: "InsertObelisk";
      obelisk: TNewObelisk;
    }
  | {
      type: "UpdateObelisk";
      obelisk: TPartialObelisk;
    }
  | {
      type: "InsertWoS";
      woc: TNewWoS;
    }
  | {
      type: "UpdateWoS";
      wocId: number;
      woc: TPartialWoS;
    }
  | {
      type: "InsertPrice";
      price: TNewPrice;
    }
  | {
      type: "InsertManyPrices";
      prices: TNewPrice[];
    }
  | {
      type: "UpdatePrice";
      price: TPartialPrice;
    }
  | {
      type: "DeletePolicy";
      policyId: number;
    }
  | {
      type: "DeleteObelisk";
      obeliskId: number;
    }
  | {
      type: "DeleteWoS";
      wocId: number;
    }
  | {
      type: "DeletePrice";
      priceId: number;
    }
  | {
      type: "InsertSignedPosition";
      signedPosition: TNewSignedPosition;
    }
  | {
      type: "UpdateSignedPosition";
      signedPositionId: number;
      signedPosition: TPartialSignedPosition;
    }
  | {
      type: "DeleteSignedPosition";
      signedPositionId: number;
    }
  | {
      type: "InsertSignedPolicy";
      signedPolicy: TNewSignedPolicy;
    }
  | {
      type: "UpdateSignedPolicy";
      signedPolicyId: number;
      signedPolicy: TPartialSignedPolicy;
    }
  | {
      type: "DeleteSignedPolicy";
      signedPolicyId: number;
    }
  | {
      type: "InsertLiquidityProduct";
      liquidityProduct: TNewLiquidityProduct;
    }
  | {
      type: "UpdateLiquidityProduct";
      liquidityProductId: number;
      liquidityProduct: TPartialLiquidityProduct;
    }
  | {
      type: "DeleteLiquidityProduct";
      liquidityProductId: number;
    }
  | {
      type: "InsertUserRewards";
      userRewards: TNewUserRewards;
    }
  | {
      type: "DeleteUserRewards";
      userRewardsId: number;
    }
  | {
      type: "UserRewards";
      user: TPartialUserRewards;
    }
  | {
      type: "InsertTransfer";
      transfer: TNewTransfer;
    }
  | {
      type: "DeleteTransfer";
      transferId: number;
    }
  | {
      type: "InsertUser";
      user: TNewUser;
    }
  | {
      type: "InsertRole";
      role: TNewRole;
    }
  | {
      type: "DeleteRole";
      roleId: number;
    }
  | {
      type: "UpdateRole";
      roleId: number;
      role: TPartialRole;
    }
  | {
      type: "InsertPharo";
      pharo: TNewPharo;
    }
  | {
      type: "DeletePharo";
      pharoId: number;
    }
  | {
      type: "UpdatePharo";
      pharoId: number;
      pharo: TPartialPharo;
    }
  | {
      type: "InsertLockToken";
      lockToken: TNewLockToken;
    }
  | {
      type: "DeleteLockToken";
      lockTokenId: number;
    }
  | {
      type: "UpdateLockToken";
      lockTokenId: number;
      lockToken: TPartialLockToken;
    }
  | {
      type: "InsertPolicy";
      policy: TNewPolicy;
    }
  | {
      type: "UpdatePolicy";
      policyId: number;
      policy: TPartialPolicy;
    }
  | {
      type: "InsertObelisk";
      obelisk: TNewObelisk;
    }
  | {
      type: "UpdateObelisk";
      obelilskId: number;
      obelisk: TPartialObelisk;
    }
  | {
      type: "InsertCoverDistribution";
      distribution: TNewDistribution;
    }
  | { [key: string]: any };
