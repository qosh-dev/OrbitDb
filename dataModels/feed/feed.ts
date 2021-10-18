import { randomUUID } from "crypto";
import express from "express";
import { createConnection, initIPFSInstance } from "../Connection";
const IPFS = require("ipfs");

const OrbitDB = require("orbit-db");
// createConnection((orbitDb) => {
//   return {
//     postsTable: orbitDb.docs(
//       "/orbitdb/zdpuAxVn2LSHVAsoNVNG2z4oS6WkdVSDny4SQNeKVndf9mPND/postsTable"
//     ),
//   };
// });

initIPFSInstance()
  .then(async (ipfs) => {
    const options = { id: "local-id" };
    const orbitdb = await OrbitDB.createInstance(ipfs);
    //Create or Open DB
    return orbitdb;
  })
  .then((orbitDb) => {
    return {
      postsTable: orbitDb.docs(
        "/orbitdb/zdpuAxVn2LSHVAsoNVNG2z4oS6WkdVSDny4SQNeKVndf9mPND/postsTable"
      ),
    };
  })

  .then(async (repository) => {
    const app = express();

    app.get("/getAll", async (req, res) => {
      const postsTable = await repository.postsTable;
      const allPosts = postsTable.get("");
      res.json(allPosts);
    });

    app.get("/add", async (req, res) => {
      const postsTable = await repository.postsTable;
      const newEntryHash = await postsTable.put({
        _id: randomUUID(),
        name: "Entry From feed",
      });
      res.json(newEntryHash);
    });

    app.get("/getAddress", async (req, res) => {
      const postsTable = await repository.postsTable;

      res.json(postsTable.address);
    });

    app.listen(7070,async () => {
      const postsTable = await repository.postsTable;
      postsTable.events.on("replicated", async () => {
        console.log("replicated SERVER 2");
        const postsTable = await repository.postsTable;
        console.log(postsTable.get(""));
      });

      postsTable.events.on("write", async () => {
        console.log("write SERVER 2");
        const postsTable = await repository.postsTable;
        console.log(postsTable.get(""));
      });
      console.log(`Listen on http://localhost:${7070}`);
    });
  });
