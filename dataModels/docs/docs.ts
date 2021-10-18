import { createConnection } from "../Connection"

createConnection((orbitDb) => {
    return {
        usersTable : orbitDb.docs("usersTable"),
        postsTable : orbitDb.docs("postsTable"),
    }
}).then( async repository => {
    const postsTable = await repository.postsTable
    const usersTable = await repository.usersTable

    await postsTable.put({ _id: 'QmAwesomeIpfsHash', name: 'shamb0t', followers: 500 })
    await postsTable.put({ _id: 'TEEEST', name : "asdasd", wewewe : 213123})


    const allPosts = postsTable.get('')
    console.log(allPosts);
    
    
}).catch( e => {
    console.log(e);
    
})