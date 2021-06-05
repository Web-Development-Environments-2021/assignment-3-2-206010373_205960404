var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const users_utils = require("./utils/users_utils");
const players_utils = require("./utils/players_utils");
const matches_utils = require("./utils/matches_utils");
const teams_utils = require("./utils/teams_utils");



/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    
    DButils.execQuery("SELECT user_id FROM Users")
      .then((users) => {
        if (users.find((x) => x.user_id === req.session.user_id)) {
          req.user_id = req.session.user_id;
          next();
        }
      })
      .catch((err) => next(err));
  } else {
    res.sendStatus(401);
  }
});

//________________________fav players ___________________________________

 /* This path gets body with playerId and saves this player in the favorites list of the logged-in user */
router.post("/favoritePlayers", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const player_id = req.body.player_id;
    console.log(user_id);
    console.log(player_id);

    await users_utils.markAsFavorite("FavoritePlayers", user_id, player_id);
    res.status(201).send("The player successfully saved as favorite");
  } catch (error) {
    res.status(400).send("The player allready a favorite player");
  }
});

/* This path returns the favorites players that were saved by the logged-in user*/
router.get("/favoritePlayers", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    let favorite_players = {};
    const player_ids = await users_utils.getFavorites("FavoritePlayers", user_id,"player_id");
    let player_ids_array = [];
    player_ids.map((element) => player_ids_array.push(element.player_id)); //extracting the players ids into array
    const results = await players_utils.getPlayersInfo(player_ids_array);
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

/* This path delete the favorite player that was saved by the logged-in user*/
 router.delete("/favoritePlayers", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const player_id_deleted = req.body.player_id;
    
    const player_ids = await users_utils.removeAsFavorite("FavoritePlayers","player_id", user_id ,player_id_deleted);
    res.status(200).send("The player was successfully deleted as favorite");
  } catch (error) {
    next(error);
  }
});


//________________________fav Matches ___________________________________
/*This path gets body with matchId and save this match in the favorites list of the logged-in user*/
 router.post("/favoriteMatches", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const match_id = req.body.match_id;

    await users_utils.markAsFavorite("FavoriteMatches", user_id, match_id);
    res.status(201).send("The match successfully saved as favorite");
  } catch (error) {
    res.status(400).send("The match allready a favorite match");
  }
});

/* This path returns the favorites matchs that were saved by the logged-in user*/
router.get("/favoriteMatches", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    let favorite_matchs = {};
    const match_ids = await users_utils.getFavorites("FavoriteMatches", user_id, "match_id");
    let match_ids_array = [];
    match_ids.map((element) => match_ids_array.push(element.match_id)); //extracting the matchs ids into array
    const results = await matches_utils.getMatchesInfo(match_ids_array);
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

/* This path delete the favorite match that was saved by the logged-in user*/
 router.delete("/favoriteMatches", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const match_id_deleted = req.body.match_id;
    
    const match_ids = await users_utils.removeAsFavorite("FavoriteMatches","match_id", user_id ,match_id_deleted);
    res.status(200).send("The match was successfully deleted as favorite");
  } catch (error) {
    next(error);
  }
});

//_______________________fav Teams ___________________________________
/* This path gets body with teamId and save this team in the favorites list of the logged-in user*/
 router.post("/favoriteTeams", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const team_id = req.body.team_id;
    console.log(user_id);
    console.log(team_id);

    await users_utils.markAsFavorite("FavoriteTeams", user_id, team_id);
    res.status(201).send("The team successfully saved as favorite");
  } catch (error) {
    res.status(400).send("The team allready a favorite team");
  }
});

/*This path returns the favorites teams that were saved by the logged-in user*/
router.get("/favoriteTeams", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    let favorite_teams = {};
    const team_ids = await users_utils.getFavorites("FavoriteTeams", user_id, "team_id");
    let team_ids_array = [];
    team_ids.map((element) => team_ids_array.push(element.team_id)); //extracting the teams ids into array
    const results = await teams_utils.getTeamsFavorites(team_ids_array); // todo liad function
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

/*This path delete the favorite team that was saved by the logged-in user*/
 router.delete("/favoriteTeams", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const team_id_deleted = req.body.team_id;
    
    const team_ids = await users_utils.removeAsFavorite("FavoriteTeams","team_id", user_id ,team_id_deleted);
    res.status(200).send("The team was successfully deleted as favorite");
  } catch (error) {
    next(error);
  }
});
module.exports = router;
