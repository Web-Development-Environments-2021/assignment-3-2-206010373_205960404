const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const LEAGUE_ID = 271;

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

async function getTeamDetails(teamId) {
  const team = await axios.get(`${api_domain}/teams/${teamId}`,
    {
      params: {
        include: "coach",
        api_token: process.env.api_token,
      },
    }
  );
  console.log("#####################");
  console.log(team.data.data);
  console.log("#####################");
  console.log(team.data.data.coach.fullname);
  console.log("#####################");
  return{
      teamCoachName : team.data.data.coach.data.fullname,
      teamName : team.data.data.name,
      logo : team.data.data.logo_path
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

async function getTeamsFavorites(teams_ids_list) {
  let promises = [];
  teams_ids_list.map((id) =>
    promises.push(getTeamforfavorite(id)
    )
  );
  let teams_info = await Promise.all(promises);
  return teams_info;
}


//search 8
async function getTeamsByName(name) {
  let teams_list = [];
  const teams = await axios.get(`${api_domain}/teams/search/${name}`, {
    params: {
      api_token: process.env.api_token,
    },
  });
  teams.data.data.forEach(team => {
      teams_list.push({"teamName": team.name, "teamLogo": team.logo_path})  
  });
  return teams_list;
}


exports.getTeamName = getTeamName;
exports.getTeamDetails = getTeamDetails;
exports.getTeamsFavorites = getTeamsFavorites;
exports.getTeamsByName = getTeamsByName;
exports.getTeamLogo = getTeamLogo;

