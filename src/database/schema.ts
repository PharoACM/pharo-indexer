import { Insertable, Selectable, Updateable } from "kysely";
import { Address, ChainId, TPharoState, TUserRole } from "../types.js";

export type Status = "ACTIVE" | "INACTIVE" | "CLOSED";

export type User = {
  address: Address;
  name: string;
  email: string;
  role: TUserRole;
};

export type UserTable = User & {
  id: string;
  created_at: bigint;
  updated_at: bigint;
};

export type CoverPolicy = {
  id: bigint;
  creationDate: bigint;
  owner: Address;
  status: Status;
  pharoId: number;
  coverBought: bigint;
  lengthOfCover: bigint;
  reward: bigint;
  premiumPaid: bigint;
  premium: bigint;
  rateEstimate: bigint;
  minCover: bigint;
};

export type PolicyTable = CoverPolicy & {
  blockNumber: bigint;
};

export type Distribution = {
  id: BigInt;
}

export type DistributionTable = Distribution & {
  blockNumber: BigInt;
}

export type LiquidityProduct = {
  providerAddress: Address;
  maximumRisk: bigint;
  breakevenRate: bigint;
  staked: bigint;
  asset: Address;
  premiumCollected: bigint;
  coverPaid: bigint;
  coverAvailable: bigint;
  reward: bigint;
  rateEstimate: bigint;
};

export type LiquidityProductTable = LiquidityProduct & {
  id: string;
  blockNumber: bigint;
};

export type Obelisk = {
  timestamp: Date;
  pharoId: number;
  cb_wallet_id: Address[];
  cb_policy_id: bigint[];
  cb_preminum: bigint[];
  cb_reward: bigint[];
  cb_rate_estimate: bigint[];
  cb_min_cover: bigint[];
  cb_funds_avail: bigint[];
  cb_cover_bought: bigint[];
  cb_cover_mult: bigint[];
  cb_percentile: bigint[];
  cb_served_wallet_id: Address[][];
  cb_served_product_id: bigint[][];
  cb_served_value: bigint[][];
  cb_incompatible_LPs: bigint[][];
  lp_wallet_id: Address[];
  lp_product_id: bigint[];
  lp_stake: bigint[];
  lp_reward: bigint[];
  lp_rate_estimate: bigint[];
  lp_max_risk: bigint[];
  lp_cover_avail: bigint[];
  lp_breakeven_rate: bigint[];
  lp_served_wallet_id: Address[][];
  lp_served_policy_id: bigint[][];
  lp_served_value: bigint[][];
  lp_incompatible_CBs: bigint[][];
};

export type ObeliskTable = Obelisk & {
  id: string;
  blockNumber: bigint;
};

export type PriceTable = {
  id: string;
  chainId: ChainId;
  tokenAddress: Address;
  priceInUsd: number;
  timestamp: Date;
  blockNumber: bigint;
};

// NOTE: converted from WoC to WoS (wisdom of crowds to wisdom of stakeholders)
export type WoS = {
  pharoId: number;
  alpha: bigint;
  beta: bigint;
  rateProbable: bigint;
  minConfidence: bigint;
  maxConfidence: bigint;
  gof: bigint;
  gammaX: bigint[];
  gammaY: bigint[];
};

export type WoSTable = WoS & {
  id: string;
  blockNumber: bigint;
};

export type SignedPosition = {
  maxRisk: bigint;
  stakeAmount: bigint;
  rateEstimate: bigint;
};

export type SignedPositionTable = SignedPosition & {
  id: string;
  blockNumber: bigint;
};

export type SignedPolicy = {
  minCover: bigint;
  premium: bigint;
  rateEstimate: bigint;
  lengthOfCover: bigint;
};

export type SignedPolicyTable = SignedPolicy & {
  id: string;
  blockNumber: bigint;
};

export type UserRewards = {
  user: Address;
  reward: bigint;
};

export type UserRewardsTable = UserRewards & {
  id: string;
  blockNumber: bigint;
};

export type Transfer = {
  from: Address;
  to: Address;
  amount: bigint;
};

export type TransferTable = Transfer & {
  id: string;
  transfered_at: bigint;
  block_number: bigint;
};

export type Role = {
  user: Address;
  role: string;
};

export type RoleTable = Role & {
  id: string;
  created_at: bigint;
  updated_at: bigint;
};

export type Pharo = {
  pharoId: bigint;
  name: string;
  description: string;
  lifetime: bigint;
  birthdate: bigint;
  state: TPharoState;
  trueEventTime: bigint;
};

export type PharoTable = Pharo & {
  id: string;
  blockNumber: bigint;
};

export type LockToken = {
  user: Address;
  amount: bigint;
  validity: bigint;
  claimed: boolean;
};

export type LockTokenTable = LockToken & {
  id: string;
  blockNumber: bigint;
};

export type TNewPolicy = Insertable<PolicyTable>;
export type TPolicy = Selectable<PolicyTable>;
export type TPartialPolicy = Updateable<PolicyTable>;
export type TNewPrice = Insertable<PriceTable>;
export type TPrice = Selectable<PriceTable>;
export type TPartialPrice = Updateable<PriceTable>;
export type TNewLiquidityProduct = Insertable<LiquidityProductTable>;
export type TLiquidityProduct = Selectable<LiquidityProductTable>;
export type TPartialLiquidityProduct = Updateable<LiquidityProductTable>;
export type TNewObelisk = Insertable<ObeliskTable>;
export type TObelisk = Selectable<ObeliskTable>;
export type TPartialObelisk = Updateable<ObeliskTable>;
export type TNewWoS = Insertable<WoSTable>;
export type TWoS = Selectable<WoSTable>;
export type TPartialWoS = Updateable<WoSTable>;
export type TNewSignedPosition = Insertable<SignedPositionTable>;
export type TSignedPosition = Selectable<SignedPositionTable>;
export type TPartialSignedPosition = Updateable<SignedPositionTable>;
export type TNewSignedPolicy = Insertable<SignedPolicyTable>;
export type TSignedPolicy = Selectable<SignedPolicyTable>;
export type TPartialSignedPolicy = Updateable<SignedPolicyTable>;
export type TNewUserRewards = Insertable<UserRewardsTable>;
export type TUserRewards = Selectable<UserRewardsTable>;
export type TPartialUserRewards = Updateable<UserRewardsTable>;
export type TNewTransfer = Insertable<TransferTable>;
export type TNewUser = Insertable<UserTable>;
export type TNewRole = Selectable<RoleTable>;
export type TRole = Selectable<RoleTable>;
export type TPartialRole = Updateable<RoleTable>;
export type TNewPharo = Insertable<PharoTable>;
export type TPharo = Selectable<PharoTable>;
export type TPartialPharo = Updateable<PharoTable>;
export type TNewLockToken = Insertable<LockTokenTable>;
export type TLockToken = Selectable<LockTokenTable>;
export type TPartialLockToken = Updateable<LockTokenTable>;
export type TNewDistribution = Insertable<DistributionTable>;
