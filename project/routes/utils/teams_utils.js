const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const LEAGUE_ID = 271;

/* this function gets team id and returns team name from  API */
async function getTeamName(teamId) {
    const team = await axios.get(`${api_domain}/teams/${teamId}`,
      {
        params: {
          api_token: process.env.api_token,
        },
      }
    );
    return{
        teamName : team.data.data.name
    }
}

/* this function gets team id and returns TeamDetails from  API */
async function getTeamDetails(teamId) {
  const team = await axios.get(`${api_domain}/teams/${teamId}`,
    {
      params: {
        include: "coach",
        api_token: process.env.api_token,
      },
    }
  );
  return{
      teamCoachName : team.data.data.coach.data.fullname,
      teamName : team.data.data.name,
      logo : team.data.data.logo_path
  }
}

/* helper function gets team id and returns TeamDetails from  API */
async function getTeamLogo(teamId) {
  const team = await axios.get(`${api_domain}/teams/${teamId}`,
    {
      params: {
        api_token: process.env.api_token,
      },
    }
  );
  return{
      logo : team.data.data.logo_path
  }
}

/* gets team id and returns TeamDetails from  API */
async function getTeamforfavorite(teamId) {
  teamName = await getTeamName(teamId);
  logo = await getTeamLogo(teamId);
  return{
      team_id : teamId,
      teamName : teamName.teamName,
      logo: logo.logo
  }
}

/* gets  a list of team id's and returns TeamDetails for each*/
async function getTeamsFavorites(teams_ids_list) {
  let promises = [];
  teams_ids_list.map((id) =>
    promises.push(getTeamforfavorite(id)
    )
  );
  let teams_info = await Promise.all(promises);
  return teams_info;
}


/*search 8 - enables to search a team by its name*/
async function getTeamsByName(name) {
  let teams_list = [];
  const teams = await axios.get(`${api_domain}/teams/search/${name}`, {
    params: {
      include: "league",
      api_token: process.env.api_token,
    },
  });
  let TeamsSearchList = [];
  for(i=0;i<teams.data.data.length;i++)
  {
    try{
      if(teams.data.data[i].league.data.id == LEAGUE_ID  && teams.data.data[i].name.includes(name)){
        TeamsSearchList.push(players1.data.data[i]);
      }
  }
  catch (e){
    continue;
  }
  }
  teams.data.data.forEach(team => {
      teams_list.push({"teamName": team.name, "teamLogo": team.logo_path, "id": team.id})  
  });
  return teams_list;
}

exports.getTeamName = getTeamName;
exports.getTeamDetails = getTeamDetails;
exports.getTeamsFavorites = getTeamsFavorites;
exports.getTeamsByName = getTeamsByName;
exports.getTeamLogo = getTeamLogo;

