const DButils = require("./DButils");

/* function for Authentication - checks if the user exists in the admin table */
async function ifisAdmin(user_id) {
    
    const exists = await DButils.execQuery(
      `SELECT TOP 1 user_id FROM Admins WHERE user_id = '${user_id}' `
    );
   
    if(exists.length > 0){
        return true;
    }
    else{
        return false;
    }
}

exports.ifisAdmin=ifisAdmin;