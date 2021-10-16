import * as IPFS from "ipfs-core";
import OrbitDB from "orbit-db";

async function createConnection() {
  return new Promise((res, rej) => {
    // Create IPFS instance
    const initIPFSInstance = async () => {
      return await IPFS.create({ repo: "./ipfsRepo" });
    };

    initIPFSInstance()
      .then(async (ipfs) => {
        //Creating instance if OrbitDb
        const orbitdb = await OrbitDB.createInstance(ipfs);
        //Create or Open DB
        res(orbitdb.log("logDb"));
      })
      .catch((e) => {
        rej(`Error while connection to ipfs ${e}`);
      });
  });
}

createConnection().then(async (logDb) => {
  //Add query: add new entry and return his hash
  const addResult = await logDb.add({ time: new Date().getTime() });
  console.log(addResult);

  //Get one query: return entry based on his hash
  const entryByHash = await logDb.get(addResult)
  console.log(entryByHash);

  //Get all exist entries
  const data = logDb.iterator().collect();
  console.log(data);
});
