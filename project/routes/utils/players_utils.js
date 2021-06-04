const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
// const TEAM_ID = "85";

async function getPlayerIdsByTeam(team_id) {
  let player_ids_list = [];
  const team = await axios.get(`${api_domain}/teams/${team_id}`, {
    params: {
      include: "squad",
      api_token: process.env.api_token,
    },
  });
  team.data.data.squad.data.map((player) =>
    player_ids_list.push(player.player_id)
  );
  return player_ids_list;
}

async function getPlayersInfo(players_ids_list) {
  let promises = [];
  players_ids_list.map((id) =>
    promises.push(
      axios.get(`${api_domain}/players/${id}`, {
        params: {
          api_token: process.env.api_token,
          include: "team",
        },
      })
    )
  );
  let players_info = await Promise.all(promises);
  return extractRelevantPlayerData(players_info);
}

function extractRelevantPlayerData(players_info) {
  return players_info.map((player_info) => {
    const { fullname, image_path, position_id } = player_info.data.data;
    const { name } = player_info.data.data.team.data;
    return {
      name: fullname,
      image: image_path,
      position: position_id,
      team_name: name,
    };
  });
}

function extractRelevantPlayerDataForSearch(players_info) {
  return players_info.map((player_info) => {
    const { fullname, image_path, position_id } = player_info;
    var name;
    if(player_info.team != null){
      var { name } = player_info.team.data;
    }
    else{
      var { name } = "No Team";
    }
    return {
      name: fullname,
      image: image_path,
      position: position_id,
      team_name: name,
    };
  });
}
async function getPlayersByTeam(team_id) {
  let player_ids_list = await getPlayerIdsByTeam(team_id);
  let players_info = await getPlayersInfo(player_ids_list);
  return players_info;
}


async function getPlayerDetails(player_id) {
  const Player = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/players/${player_id}`,
    {
      params: {
        api_token: process.env.api_token,
      },
    }
  );

  const Team = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/teams/${Player.data.data.team_id}`,
    {
      params: {
        api_token: process.env.api_token,
      },
    }
  );

  return{
    playerPreview: {
        player_id : Player.data.data.player_id,
        name: Player.data.data.fullname,
        image: Player.data.data.image_path,
        position: Player.data.data.position_id,
        team_name: Team.data.data.name,
    },
    common_name : Player.data.data.common_name,
    nationality : Player.data.data.nationality,
    birthdate : Player.data.data.birthdate,
    birthcountry : Player.data.data.birthcountry,
    height: Player.data.data.height,
    weight: Player.data.data.weight,
  }
}


async function getPlayerPreviewDetails(player_id) {
  const Player = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/players/${player_id}`,
    {
      params: {
        api_token: process.env.api_token,
      },
    }
  );

  const Team = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/teams/${Player.data.data.team_id}`,
    {
      params: {
        api_token: process.env.api_token,
      },
    }
  );

  return{
    playerPreview: {
        player_id : Player.data.data.player_id,
        name: Player.data.data.fullname,
        image: Player.data.data.image_path,
        position: Player.data.data.position_id,
        team_name: Team.data.data.name,
    },
}
}

//search copied check
async function getplayersByName(name) {
  //console.log(name);
  let players_list = [];
  let players1 = await axios.get(`${api_domain}/players/search/${name}`, {
    params: {
      api_token: process.env.api_token,
      include: "team",
    },
  });

  //console.log(players1.data.data);
  return await extractRelevantPlayerDataForSearch(players1.data.data);
}


exports.getPlayersByTeam = getPlayersByTeam;
exports.getPlayersInfo = getPlayersInfo;
exports.getPlayerDetails = getPlayerDetails;
exports.getPlayerPreviewDetails = getPlayerPreviewDetails;
exports.getplayersByName = getplayersByName;
