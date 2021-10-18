import { randomUUID } from "crypto";
// import * as IPFS from "ipfs-core";
// import * as OrbitDB from "orbit-db";
const IPFS = require("ipfs");

const OrbitDB = require("orbit-db");
const Identities = require("orbit-db-identity-provider");

export const initIPFSInstance = async () => {
  return await IPFS.create({
    repo: `./ipfsRepo_${randomUUID()}`,
    EXPERIMENTAL: {
      ipnsPubsub: true,
    },
    config : {
      Addresses: {
        API: '/ip4/127.0.0.1/tcp/0',
        Swarm: ['/ip4/0.0.0.0/tcp/0'],
        Gateway: '/ip4/0.0.0.0/tcp/0'
      },
    }
  });
};
export async function createConnection<T>(callback: (orbitDb: any) => T) {
  return new Promise<T>((res, rej) => {
    

    initIPFSInstance()
      .then(async (ipfs) => {
        //Creating instance if OrbitDb

        const options = { id: "local-id" };
        const identity = await Identities.createIdentity(options);
        const orbitdb = await OrbitDB.createInstance(
          ipfs,
          `./orbitdb${randomUUID()}`
        );
        //Create or Open DB
        res(callback(orbitdb));
        // res(orbitdb.docs("usersDb"));
      })
      .catch((e) => {
        rej(`Error while connection to ipfs ${e}`);
      });
  });
}
