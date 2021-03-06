const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const DButils = require("./DButils");
const teams_utils = require("./teams_utils");

/* this function takes all PreviewMatche relevant data from the DB and returns it*/
async function getPreviewMatch(MatchId) {
    
    Match = await DButils.execQuery(
      `select MatchId, Date, Hour, Stadium, HomeTeamID, AwayTeamID, home_team, away_team from dbo.Matches where MatchId='${MatchId}'`
    );
    console.log(Match);
    // Match[0].HomeTeamName = Match[0].home_team;
    // Match[0].AwayTeamName = Match[0].away_team;
    console.log(Match);
    return Match;
}


/* this function takes all FinishMatches data from the DB and returns it*/
async function getDetailsFinishMatch(MatchId) {
    
    const Match = await DButils.execQuery(
      `select * from dbo.Matches where MatchId='${MatchId}'`
    );
    return Match;
}

/* this function takes a list of Matches and returns the relevant data from the DB of each one*/
async function getMatchesInfo(matches_ids_list) {
    let promises = [];
    matches_ids_list.map((id) =>
      promises.push(getPreviewMatch(id))
    );
    let matches_info = await Promise.all(promises);
    return matches_info;
  }
  
/* this function returns all the Matches of a team that have already been played*/
  async function getTeamsPastMatches(teamId) {
    try {
        let matches = (
            await DButils.execQuery(
            `SELECT * FROM dbo.Matches WHERE (HomeTeamId = '${teamId}' OR AwayTeamId = '${teamId}') AND HomeGoals IS NOT NULL AND AwayGoals IS NOT NULL`
            )
        );    
        for(i=0;i<matches.length;i++){
          let events = (
            await DButils.execQuery(
            `SELECT * FROM dbo.EventDetails WHERE MatchId='${matches[i].MatchID}'`
            )
        );
        matches[i].eventCalendar = events;
        }
        return matches;
        } catch (error) {
        throw new Error(error);
    }
}

/* this function returns all the Matches of a team that has not been played*/
async function getTeamsFutureMatches(teamId) {
  try {
      const fmatches = (
          await DButils.execQuery(
              `SELECT * FROM dbo.Matches WHERE HomeGoals IS NULL AND AwayGoals IS NULL AND (HomeTeamID = '${teamId}' OR AwayTeamID = '${teamId}')`
          )
      );
      return fmatches;
      } catch (error) {
      throw new Error(error);
  }
}


/* this function returns all the Matches have already been played*/
async function getPastMatches() {
  try {
      let matches = (
          await DButils.execQuery(
          `SELECT * FROM dbo.Matches WHERE HomeGoals IS NOT NULL AND AwayGoals IS NOT NULL`
          )
      );    
      for(i=0;i<matches.length;i++){
        let events = (
          await DButils.execQuery(
          `SELECT * FROM dbo.EventDetails WHERE MatchId='${matches[i].MatchID}'`
          )
      );
      matches[i].eventCalendar = events;
      // const HomeTeam =  await axios.get(
      //   `https://soccer.sportmonks.com/api/v2.0/teams/${matches[i].HomeTeamID}`,
      //   {
      //     params: {
      //       api_token: process.env.api_token,
      //     },
      //   }
      // );
      // matches[i].home_team = HomeTeam.data.data.name;
      
      // const AwayTeam = await axios.get(
      //   `https://soccer.sportmonks.com/api/v2.0/teams/${matches[i].AwayTeamID}`,
      //   {
      //     params: {
      //       api_token: process.env.api_token,
      //     },
      //   }
      // );
      // matches[i].away_team = AwayTeam.data.data.name;

      }
      return matches;
      } catch (error) {
      throw new Error(error);
  }
}

/* this function returns all the Matches has not been played*/
async function getFutureMatches() {
  try {
      const fmatches = (
          await DButils.execQuery(
              `SELECT * FROM dbo.Matches WHERE HomeGoals IS NULL AND AwayGoals IS NULL `
          )
      );
      // for(i=0;i<fmatches.length;i++){
      //   const HomeTeam =  await axios.get(
      //     `https://soccer.sportmonks.com/api/v2.0/teams/${fmatches[i].HomeTeamID}`,
      //     {
      //       params: {
      //         api_token: process.env.api_token,
      //       },
      //     }
      //   );
      //   fmatches[i].home_team = HomeTeam.data.data.name;
        
      //   const AwayTeam = await axios.get(
      //     `https://soccer.sportmonks.com/api/v2.0/teams/${fmatches[i].AwayTeamID}`,
      //     {
      //       params: {
      //         api_token: process.env.api_token,
      //       },
      //     }
      //   );
      //   fmatches[i].away_team = AwayTeam.data.data.name;
  
      
      
      return fmatches;
      } catch (error) {
      throw new Error(error);
  }
}

exports.getPreviewMatch = getPreviewMatch;
exports.getDetailsFinishMatch = getDetailsFinishMatch;
exports.getMatchesInfo = getMatchesInfo;
exports.getTeamsPastMatches = getTeamsPastMatches;
exports.getTeamsFutureMatches = getTeamsFutureMatches;
exports.getPastMatches = getPastMatches;
exports.getFutureMatches = getFutureMatches;


