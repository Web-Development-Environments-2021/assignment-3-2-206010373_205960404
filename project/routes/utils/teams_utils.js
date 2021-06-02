const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const LEAGUE_ID = 271;
const SEASON_ID = 17328;

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

async function getTeamforfavorite(teamId) {
  teamName = await getTeamName(teamId);
  logo = await getTeamLogo(teamId);
  return{
      teamName : teamName.teamName,
      logo: logo.logo
  }
}

async function getTeamCoachName(teamId) {
  const team = await axios.get(`${api_domain}/teams/${teamId}`,
    {
      params: {
        include: "coach",
        api_token: process.env.api_token,
      },
    }
  );
  console.log(team.data.data.coach.fullname);
  return{
      teamCoachName : team.data.data.coach.fullname
  }
}


//search 
async function getTeamsByName(name) {
  let teams_list = [];
  const teams = await axios.get(`${api_domain}/teams/search/${name}`, {
    params: {
      api_token: process.env.api_token,
    },
  });
  teams.data.data.forEach(team => {
      teams_list.push({"team_name": team.name, "logo_path": team.logo_path})  
  });
  return teams_list;
}

async function getTeamsFavorites(teams_ids_list) {
  let promises = [];
  teams_ids_list.map((id) =>
    promises.push(getTeamforfavorite(id)
    )
  );
  let teams_info = await Promise.all(promises);
  return teams_info;
}


exports.getTeamName = getTeamName;
exports.getTeamCoachName = getTeamCoachName;
exports.getTeamsByName = getTeamsByName;
exports.getTeamsFavorites = getTeamsFavorites;