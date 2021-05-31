const DButils = require("./DButils");

//post
async function markAsFavorite(schema, user_id, added_id) {
  await DButils.execQuery(
    `insert into ${schema} values ('${user_id}',${added_id})`
  );
}

//delete
async function removeAsFavorite(schema, column, user_id, deleted_id) {
  console.log(`delete from ${schema} where user_id='${user_id}' and ${column}='${deleted_id}'`);
  await DButils.execQuery(
    `delete from ${schema} where user_id='${user_id}' and ${column}='${deleted_id}'`
  );
}

//get
async function getFavorites(schema, user_id , getted_id) {
  console.log(schema);
  console.log(user_id);
  const ids = await DButils.execQuery(
    `select ${getted_id} from ${schema} where user_id='${user_id}'`
  );
  return ids;
}

exports.markAsFavorite = markAsFavorite;
exports.removeAsFavorite = removeAsFavorite;
exports.getFavorites = getFavorites;




