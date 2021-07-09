const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const LEAGUE_ID = 271;


/* this function returns the ids of all players in a chosen team*/
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

/* this function returns relevant information on each player from the list*/
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

/* helper function that returns the players data*/
function extractRelevantPlayerData(players_info) {
  return players_info.map((player_info) => {
    const { player_id, fullname, image_path, position_id } = player_info.data.data;
    const { name } = player_info.data.data.team.data;
    return {
      player_id : player_id,
      name: fullname,
      image: image_path,
      position: position_id,
      team_name: name,
    };
  });
}


/* this function returns relevant information of a player by his id*/
async function getPlayersByTeam(team_id) {
  let player_ids_list = await getPlayerIdsByTeam(team_id);
  let players_info = await getPlayersInfo(player_ids_list);
  return players_info;
}


/* this function takes all players relevant data from the API and returns it*/
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

/* this function takes all players relevant data from the API and returns it*/
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
/* this function returns relevant information on a player by his name*/
async function getplayersByName(name) {
  let players1 = await axios.get(`${api_domain}/players/search/${name}`, {
    params: {
      api_token: process.env.api_token,
      include: "team.league",
    },
  });
  console.log(players1.data);
  let PlayersSearchList = [];
  for (i=0; i<players1.data.data.length;i++){
    try{
   
      if(players1.data.data[i].team.data.league.data.id == LEAGUE_ID  && players1.data.data[i].fullname.includes(name))
      {
        PlayersSearchList.push(players1.data.data[i]);
      }
    }
  
  catch (e){
    continue;
    }
  }
  return await extractRelevantPlayerDataForSearch(PlayersSearchList);
}

/* helper function that returns the players data*/
function extractRelevantPlayerDataForSearch(players_info) {
  return players_info.map((player_info) => {
    console.log(player_info);
    const { player_id,team_id, fullname, image_path, position_id } = player_info;
    var name;
    if(player_info.team != null){
      var { name } = player_info.team.data;
    }
    else{
      var { name } = "The Player doesn't have a Team";
    }
    return {
      player_id : player_id,
      team_id : team_id,
      name: fullname,
      image: image_path,
      position: position_id,
      team_name: name,
    };
  });
}

exports.getPlayersByTeam = getPlayersByTeam;
exports.getPlayersInfo = getPlayersInfo;
exports.getPlayerDetails = getPlayerDetails;
exports.getPlayerPreviewDetails = getPlayerPreviewDetails;
exports.getplayersByName = getplayersByName;
