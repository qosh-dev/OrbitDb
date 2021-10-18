import * as IPFS from "ipfs-core";
// import * as OrbitDB from "orbit-db";

const OrbitDB = require("orbit-db");

export async function createConnection<T>(callback :  (orbitDb : any) => T) {
  return new Promise<T>((res, rej) => {
    const initIPFSInstance = async () => {
      return await IPFS.create({ repo: "./ipfsRepo" });
    };

    initIPFSInstance()
      .then(async (ipfs) => {
        //Creating instance if OrbitDb
        const orbitdb = await OrbitDB.createInstance(ipfs);
        //Create or Open DB
        res(callback(orbitdb))
        // res(orbitdb.docs("usersDb"));
      })
      .catch((e) => {
        rej(`Error while connection to ipfs ${e}`);
      });
  });
}
