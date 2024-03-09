// import {
//   createIndexer,
//   createHttpRpcClient,
//   Block,
//   createPostgresSubscriptionStore,
//   createSqliteCache,
// } from "chainsauce";
// import path from "path";
// import { Logger, pino } from "pino";
// import { createPublicClient, http } from "viem";
// import { getChainConfigById, getConfig } from "./config.js";
// import { createPriceProvider } from "./prices/provider.js";
// import TTLCache from "@isaacs/ttlcache";
// import { decodeJsonWithBigInts } from "./utils/index.js";
// import { Database } from "./database/index.js";
// import fs from "node:fs/promises";
// import * as pg from "pg";
// import fetch from "make-fetch-happen";
// import { createResourceMonitor } from "./resourceMonitor.js";
// import { postgraphile } from "postgraphile";
// import ConnectionFilterPlugin from "postgraphile-plugin-connection-filter";
// import PgSimplifyInflectorPlugin from "@graphile-contrib/pg-simplify-inflector";
// import { ContractSubscriptionPruner } from "./contractSubscriptionPruner.js";

import { createHttpRpcClient, createIndexer } from "chainsauce";
import "dotenv/config";
import abis from "./indexer/abis/index.js";

// const { Pool, types } = pg.default;
// const RESOURCE_MONITOR_INTERVAL_MS = 1 * 60 * 1000; // every minute

const PhroTokenContract = {
  ERC20: abis["PharoV2/PharoToken"],
};

const indexer = createIndexer({
  contracts: PhroTokenContract,
  chain: {
    id: 421614,
    rpcClient: createHttpRpcClient({
      url: process.env.ARBITRUM_SEPOLIA_RPC_URL as string,
    }),
  },
});

async function main(): Promise<void> {
  console.log("Hello, Pharo indexing folks!");

  indexer.on("ERC20:Approval", async (args) => {
    console.log("Approval event:", args);
  });

  indexer.on("ERC20:Transfer", async (args) => {
    console.log("Approval event:", args);
  });

  // Subscribe to all events
  indexer.on("event", async (args) => {
    console.log("Event:", args);
  });

  // Subscribe to deployed contracts:
  indexer.subscribeToContract({
    contract: "ERC20" as const,
    address: "0xB4204ecc047F026ABfC3B5794cFDBF7dAC7C4C9E",

    // Optional: Start from a specific block
    fromBlock: 0n,
    toBlock: "latest",
  });

  // -- One off indexing:

  // one off indexing, this will resolve when finished or reject if any error happens
  // await indexer.indexToBlock("latest");

  // -- Continous indexing:

  // indexes to the latest block and watches the chain for new events
  // until stopped with `indexer.stop()`
  // errors will be emitted and will not stop indexing
  indexer.on("error", (error) => {
    console.error("whoops", error);
  });

  indexer.watch();
}

// async function main(): Promise<void> {
//   console.log("Hello, world!");

//   const config = getConfig();

//   const baseLogger = pino({
//     level: config.logLevel,
//     formatters: {
//       level(level) {
//         // represent severity as strings so that DataDog can recognize it
//         return { level };
//       },
//     },
//   }).child({
//     service: `indexer-${config.deploymentEnvironment}`,
//   });

//   // parse postgres numeric(78,0) as bigint
//   types.setTypeParser(1700, function (val) {
//     return BigInt(val);
//   });

//   // parse postgres jsonb with bigint support
//   types.setTypeParser(3802, function (val) {
//     return decodeJsonWithBigInts(val);
//   });

//   if (config.cacheDir) {
//     await fs.mkdir(config.cacheDir, { recursive: true });
//   }

//   const databaseConnectionPool = new Pool({
//     connectionString: config.databaseUrl,
//     // Maximum number of connections in the pool
//     max: 15,

//     // Maximum number of milliseconds a client in the pool is allowed to be idle before it is closed
//     idleTimeoutMillis: 30_000,

//     // Maximum number of milliseconds to wait for acquiring a client from the pool
//     connectionTimeoutMillis: 5_000,
//   });

//   const db = new Database({
//     connectionPool: databaseConnectionPool,
//     schemaName: config.databaseSchemaName,
//   });

//   baseLogger.info({
//     msg: "starting",
//     buildTag: config.buildTag,
//     deploymentEnvironment: config.deploymentEnvironment,
//     chains: config.chains.map(
//       (c) =>
//         c.name +
//         " (rpc: " +
//         c.rpc.slice(0, 25) +
//         "..." +
//         c.rpc.slice(-5, -1) +
//         ")"
//     ),
//   });

//   if (config.dropDb) {
//     baseLogger.info("dropping schema");
//     await db.dropSchemaIfExists();
//   }

//   await db.createSchemaIfNotExists(baseLogger);

//   const subscriptionStore = createPostgresSubscriptionStore({
//     pool: databaseConnectionPool,
//     schema: config.databaseSchemaName,
//   });

//   await subscriptionStore.init();

//   // the chainsauce cache is used to cache events and contract reads
//   const chainsauceCache = config.cacheDir
//     ? createSqliteCache(path.join(config.cacheDir, "chainsauceCache.db"))
//     : null;

//   const priceProvider = createPriceProvider({
//     db,
//     coingeckoApiUrl: config.coingeckoApiUrl,
//     coingeckoApiKey: config.coingeckoApiKey,
//     logger: baseLogger.child({ subsystem: "PriceProvider" }),
//     getBlockTimestampInMs: async (chainId, blockNumber) => {
//       const cachedBlock = await chainsauceCache?.getBlockByNumber({
//         chainId,
//         blockNumber,
//       });

//       if (cachedBlock) {
//         return cachedBlock.timestamp * 1000;
//       }

//       const chain = getChainConfigById(chainId);
//       const client = createPublicClient({
//         transport: http(chain.rpc),
//       });

//       const block = await client.getBlock({ blockNumber });
//       const timestamp = Number(block.timestamp);

//       const chainsauceBlock: Block = {
//         chainId,
//         blockNumber: BigInt(block.number),
//         timestamp: timestamp,
//         blockHash: block.hash,
//       };

//       await chainsauceCache?.insertBlock(chainsauceBlock);

//       return timestamp * 1000;
//     },
//     fetch: (url, options) => {
//       return fetch(url, {
//         ...options,
//         retry: false,
//         cache: "force-cache",
//         cachePath:
//           config.cacheDir !== null
//             ? path.join(config.cacheDir, "prices")
//             : undefined,
//       });
//     },
//   });

//   if (config.enableResourceMonitor) {
//     monitorAndLogResources({
//       logger: baseLogger,
//       directories: [config.storageDir].concat(
//         config.cacheDir ? [config.cacheDir] : []
//       ),
//     });
//   }

//   if (config.runOnce) {
//     await Promise.all(
//       config.chains.map(async (chain) =>
//         catchupAndWatchChain({
//           chainsauceCache,
//           chain,
//           db,
//           subscriptionStore,
//           baseLogger,
//           priceProvider,
//           ...config,
//         })
//       )
//     );
//     baseLogger.info("exiting");
//   } else {
//     // Promises will be resolved once the initial catchup is done. Afterwards, services
//     // will still be in listen-and-update mode.
//     //
//     const chains = config.chains.map((chain) =>
//       catchupAndWatchChain({
//         chainsauceCache,
//         chain,
//         db,
//         subscriptionStore,
//         baseLogger,
//         priceProvider,
//         ...config,
//       })
//     );

//     const [passportProvider] = await Promise.all([
//       catchupAndWatchPassport({
//         ...config,
//         baseLogger,
//         runOnce: config.runOnce,
//       }),
//       ...(config.httpServerWaitForSync ? chains : []),
//     ]);

//     // TODO: use read only connection, use separate pool?
//     const graphqlHandler = postgraphile(
//       databaseConnectionPool,
//       config.databaseSchemaName,
//       {
//         watchPg: false,
//         graphqlRoute: "/graphql",
//         graphiql: true,
//         graphiqlRoute: "/graphiql",
//         enhanceGraphiql: true,
//         disableDefaultMutations: true,
//         dynamicJson: true,
//         bodySizeLimit: "100kb", // response body limit
//         // disableQueryLog: false,
//         // allowExplain: (req) => {
//         //   return true;
//         // },
//         appendPlugins: [
//           PgSimplifyInflectorPlugin.default,
//           ConnectionFilterPlugin,
//         ],
//         legacyRelations: "omit",
//         setofFunctionsContainNulls: false,
//         exportGqlSchemaPath: "./schema.graphql",
//         simpleCollections: "only",
//         graphileBuildOptions: {
//           pgOmitListSuffix: true,
//           pgShortPk: true,
//           connectionFilterRelations: true,
//           connectionFilterUseListInflectors: true,
//           connectionFilterAllowedOperators: [
//             "isNull",
//             "equalTo",
//             "notEqualTo",
//             "lessThan",
//             "lessThanOrEqualTo",
//             "greaterThan",
//             "greaterThanOrEqualTo",
//             "in",
//             "notIn",
//             "contains",
//           ],
//         },

//         // TODO: buy pro version?
//         // defaultPaginationCap: 1000,
//         // readOnlyConnection: true,
//         // graphqlDepthLimit: 2
//       }
//     );

//     const httpApi = createHttpApi({
//       db,
//       priceProvider,
//       passportProvider: passportProvider,
//       dataProvider: new CachedDataProvider({
//         dataProvider: new DatabaseDataProvider(db),
//         cache: new TTLCache({
//           max: 10,
//           ttl: 1000 * 60 * 1, // 1 minute
//         }),
//       }),
//       port: config.apiHttpPort,
//       logger: baseLogger.child({ subsystem: "HttpApi" }),
//       buildTag: config.buildTag,
//       chains: config.chains,
//       hostname: config.hostname,
//       graphqlHandler: graphqlHandler,
//       enableSentry: config.sentryDsn !== null,
//       calculator: {
//         esimatesLinearQfImplementation:
//           config.estimatesLinearQfWorkerPoolSize === null
//             ? {
//                 type: "in-thread",
//               }
//             : {
//                 type: "worker-pool",
//                 workerPoolSize: config.estimatesLinearQfWorkerPoolSize,
//               },
//       },
//     });

//     await httpApi.start();
//   }
// }

await main().catch((err) => {
  console.error(err);
  process.exit(1);
});

// async function catchupAndWatchChain(
//   config: Omit<Config, "chains"> & {
//     chainsauceCache: Cache | null;
//     subscriptionStore: SubscriptionStore;
//     priceProvider: PriceProvider;
//     db: Database;
//     chain: Chain;
//     baseLogger: Logger;
//   }
// ) {
//   const chainLogger = config.baseLogger.child({
//     chain: config.chain.id,
//   });

//   const { db, priceProvider } = config;

//   try {
//     const cachedIpfsGet = async <T>(cid: string): Promise<T | undefined> => {
//       const cidRegex = /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|baf[0-9A-Za-z]{50,})$/;
//       if (!cidRegex.test(cid)) {
//         chainLogger.warn(`Invalid IPFS CID: ${cid}`);
//         return undefined;
//       }

//       const url = `${config.ipfsGateway}/ipfs/${cid}`;

//       // chainLogger.trace(`Fetching ${url}`);

//       const res = await fetch(url, {
//         timeout: 2000,
//         onRetry(cause) {
//           chainLogger.debug({
//             msg: "Retrying IPFS request",
//             url: url,
//             err: cause,
//           });
//         },
//         retry: { retries: 3, minTimeout: 2000, maxTimeout: 60 * 10000 },
//         // IPFS data is immutable, we can rely entirely on the cache when present
//         cache: "force-cache",
//         cachePath:
//           config.cacheDir !== null
//             ? path.join(config.cacheDir, "ipfs")
//             : undefined,
//       });

//       return (await res.json()) as T;
//     };

//     chainLogger.info("catching up with blockchain events");

//     const indexerLogger = chainLogger.child({ subsystem: "DataUpdater" });

//     const viemRpcClient = createPublicClient({
//       transport: http(config.chain.rpc),
//     });

//     const eventHandlerContext: EventHandlerContext = {
//       chainId: config.chain.id,
//       db,
//       rpcClient: viemRpcClient,
//       ipfsGet: cachedIpfsGet,
//       priceProvider,
//       logger: indexerLogger,
//     };

//     const rpcClient = createHttpRpcClient({
//       retryDelayMs: 1000,
//       maxConcurrentRequests: 10,
//       maxRetries: 3,
//       url: config.chain.rpc,
//       onRequest({ method, params }) {
//         chainLogger.trace({ msg: `RPC Request ${method}`, params });
//       },
//     });

//     const indexer = createIndexer({
//       contracts: abis,
//       chain: {
//         id: config.chain.id,
//         maxBlockRange: config.chain.maxGetLogsRange
//           ? BigInt(config.chain.maxGetLogsRange)
//           : 100000n,
//         pollingIntervalMs: 5 * 1000, // 5 seconds
//         rpcClient,
//       },
//       context: eventHandlerContext,
//       subscriptionStore: config.subscriptionStore,
//       cache: config.chainsauceCache,
//       logLevel: "trace",
//       logger: (level, msg, data) => {
//         if (level === "error") {
//           indexerLogger.error({ msg, data });
//         } else if (level === "warn") {
//           indexerLogger.warn({ msg, data });
//         } else if (level === "info") {
//           indexerLogger.info({ msg, data });
//         } else if (level === "debug") {
//           indexerLogger.debug({ msg, data });
//         } else if (level === "trace") {
//           indexerLogger.trace({ msg, data });
//         }
//       },
//     });

//     indexer.on("event", async (args) => {
//       try {
//         // console.time(args.event.name);
//         // do not await donation inserts as they are write only
//         if (args.event.name === "Voted") {
//           handleAlloV1Event(args)
//             .then((changesets) => db.applyChanges(changesets))
//             .catch((err: unknown) => {
//               indexerLogger.warn({
//                 msg: "error while processing vote",
//                 err,
//               });
//             });
//         } else {
//           const handler = args.event.contractName.startsWith("AlloV1")
//             ? handleAlloV1Event
//             : handleAlloV2Event;

//           const changesets = await handler(args);

//           for (const changeset of changesets) {
//             await db.applyChange(changeset);
//           }
//         }
//       } catch (err) {
//         indexerLogger.warn({
//           msg: "skipping event due to error while processing",
//           err,
//           event: args.event,
//         });
//       } finally {
//         // console.timeEnd(args.event.name);
//       }
//     });

//     indexer.on(
//       "progress",
//       throttle<IndexerEvents["progress"]>(
//         5000,
//         ({ currentBlock, targetBlock, pendingEventsCount }) => {
//           const progressPercentage = (
//             (Number(currentBlock) / Number(targetBlock)) *
//             100
//           ).toFixed(1);

//           const subscriptions = indexer.getSubscriptions();

//           const activeSubscriptions = subscriptions.filter((sub) => {
//             return sub.toBlock === "latest" || sub.toBlock < targetBlock;
//           });

//           indexerLogger.info(
//             `${currentBlock}/${targetBlock} indexed (${progressPercentage}%) (pending events: ${pendingEventsCount}) (contracts: ${activeSubscriptions.length})`
//           );
//         }
//       )
//     );

//     const fromBlock =
//       config.fromBlock === "latest"
//         ? await rpcClient.getLastBlockNumber()
//         : config.fromBlock;

//     for (const subscription of config.chain.subscriptions) {
//       const contractName = subscription.contractName;
//       const subscriptionFromBlock =
//         subscription.fromBlock === undefined
//           ? undefined
//           : BigInt(subscription.fromBlock);

//       indexer.subscribeToContract({
//         contract: contractName,
//         address: subscription.address,
//         fromBlock:
//           subscriptionFromBlock !== undefined &&
//           subscriptionFromBlock > fromBlock
//             ? subscriptionFromBlock
//             : fromBlock,
//       });
//     }

//     await indexer.indexToBlock(config.toBlock);

//     indexerLogger.info({
//       msg: "caught up with blockchain events",
//       toBlock: config.toBlock,
//     });

//     if (!config.runOnce) {
//       chainLogger.info("listening to new blockchain events");

//       indexer.on("error", (err) => {
//         chainLogger.error({
//           msg: `error while watching chain ${config.chain.id}`,
//           err,
//         });
//         // Sentry.captureException(err);
//       });

//       indexer.watch();

//       const contractSubscriptionPruner = new ContractSubscriptionPruner({
//         client: rpcClient,
//         logger: chainLogger,
//         indexer,
//       });

//       contractSubscriptionPruner.start();
//     }

//     return db;
//   } catch (err) {
//     chainLogger.error({
//       msg: `error during initial catch up with chain ${config.chain.id}`,
//       err,
//     });
//     throw err;
//   }
// }

// function monitorAndLogResources(config: {
//   logger: Logger;
//   directories: string[];
// }) {
//   const resourceMonitorLogger = config.logger.child({
//     subsystem: "ResourceMonitor",
//   });

//   resourceMonitorLogger.info({ msg: "starting resource monitor" });

//   const resourceMonitor = createResourceMonitor({
//     logger: resourceMonitorLogger,
//     diskstats,
//     directories: config.directories,
//     pollingIntervalMs: RESOURCE_MONITOR_INTERVAL_MS,
//   });

//   resourceMonitor.start();
// }
