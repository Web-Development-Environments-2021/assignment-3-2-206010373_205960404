const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";

async function getTeamName(teamId) {
    const team = await axios.get(
      `https://soccer.sportmonks.com/api/v2.0/teams/${teamId}`,
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

exports.getTeamName = getTeamName;