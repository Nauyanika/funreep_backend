"use strict";
const debug = require("debug")("test");
const db = require("../config/db.js");
const commonVar = require("../Constants").commonVar;

const userById = async (playerId) => {
  try {
    let sql = `SELECT * FROM users WHERE id= ? limit ?`;
    let user = await db.query(sql, [playerId, 1]);
    return user;
  } catch (err) {
    debug(err);
  }
};

const getUserBalance = async (playerId) => {
  try {
    let user = await userById(playerId);
    let result = user[0]["cash_balance"];
    return result;
  } catch (err) {
    debug(err);
  }
};

const userByEmail = async (playerId) => {
  try {
    let sql = `SELECT * FROM users WHERE email= ? limit ?`;
    let user = await db.query(sql, [playerId, 1]);
    return user;
  } catch (err) {
    debug(err);
  }
};

const getUserPoint = async (playerId, betPoints) => {
  try {
    let user = await userByEmail(playerId);
    let result = user[0]["point"];
    let sql = `UPDATE users SET point= ? WHERE email= ? `;
    let savePoint = await db.query(sql, [result - betPoints, playerId]);

    return result;
  } catch (err) {
    debug(err);
  }
};

const updateUserPoint = async (playerId, winPoints) => {
  try {
    let user = await userByEmail(playerId);
    let result = user[0]["point"];
    let sql = `UPDATE users SET point= ? WHERE email= ? `;
    let savePoint = await db.query(sql, [result + winPoints, playerId]);
    console.log("databaseupdated", savePoint);
    let user1 = await userByEmail(playerId);
    let result1 = user1[0]["point"];

    return result1;
  } catch (err) {
    debug(err);
  }
};

const isValidArray = (arr) => {
  if (arr != null && arr != undefined && arr.length > 0) {
    return true;
  } else {
    return false;
  }
};

const getRoundCount = async () => {
  try {
    let limit = 1;
    let sql = `SELECT room_id FROM game_record_sevenup ORDER BY id DESC LIMIT ?`;
    let result = await db.query(sql, limit);
    let roundCount = result[result.length - 1]["room_id"] + 1;
    return roundCount;
  } catch (err) {
    debug(err);
  }
};

const JoinGame = async (data, room_id) => {
  try {
    let user = await userById(data.playerId);
    if (isValidArray(user)) {
      let cash_balance = user[0]["cash_balance"];
      let chip_amt = data.chip;
      if (cash_balance >= chip_amt) {
        let parms = {
          user_id: data.playerId,
          game_id: data.gameId,
          amount: data.chip,
          spot: data.spot,
          room_id: room_id,
        };
        let sql = "Insert Into join_game Set ?";
        let saveBet = await db.query(sql, parms);

        if (
          saveBet != null &&
          saveBet != undefined &&
          Object.keys(saveBet).length != 0
        ) {
          cash_balance -= chip_amt;
          sql = `UPDATE users SET cash_balance= ? WHERE id= ? `;
          let saveBalance = await db.query(sql, [cash_balance, data.playerId]);
        }
      }
    }
    debug("player bet successfully add to db");
    return true;
  } catch (err) {
    debug(err);
  }
};

const lastWinningNo = async () => {
  try {
    let limit = 20;
    let result = new Array(limit);
    let sql = `SELECT spot FROM (SELECT * FROM game_record_sevenup
 ORDER BY id DESC LIMIT ?) sub ORDER BY id ASC`;
    let data = await db.query(sql, limit);
    if (isValidArray(data)) {
      for (var i = 0; i < data.length; i++) {
        let spot = data[i].spot;
        result[limit - 1 - i] = spot;
      }
    }
    return result;
  } catch (err) {
    debug(err);
  }
};

const updateWinningNo = async (data) => {
  try {
    let parms = data;
    let sql = "Insert Into game_record_sevenup Set ?";
    let query = await db.query(sql, parms);
    debug("Winning no. inserted successfuly to db");
    return true;
  } catch (err) {
    debug(err);
  }
};

const updateWinningAmount = async (data) => {
  try {
    let winningspot = data["spot"];
    let rate = winningspot === 0 || winningspot === 2 ? 2 : 8; //winning amt multile
    let game_id = 6;
    let room_id = data["room_id"];
    let playeWinningArray = [];

    let sql = `SELECT user_id FROM join_game WHERE game_id= ? AND room_id= ? AND is_updated= ? GROUP BY user_id `;
    let players = await db.query(sql, [game_id, room_id, 0]);

    if (isValidArray(players)) {
      for (let player of players) {
        let playerId = player["user_id"];
        let sql = `SELECT spot,amount FROM join_game WHERE game_id= ? AND room_id= ? AND user_id= ? `;
        let bets = await db.query(sql, [game_id, room_id, playerId]);

        if (isValidArray(bets)) {
          let total_win_amount = 0;
          let total_bet_amount = 0;

          for (let bet of bets) {
            let win_amount = 0;
            let playingSpot = parseInt(bet["spot"]);
            let betAmt = parseInt(bet["amount"]);
            total_bet_amount += betAmt;

            if (playingSpot === winningspot) {
              win_amount = betAmt * (rate - commonVar.adminCommisionRate);
              total_win_amount += win_amount;
            }

            sql = `UPDATE join_game SET  win_amount=? ,is_updated=?  WHERE game_id= ? AND room_id= ? AND user_id= ?  `;
            let update_sql = await db.query(sql, [
              win_amount,
              1,
              game_id,
              room_id,
              playerId,
            ]);
            if (update_sql != null && win_amount > 0) {
              sql = `UPDATE users SET  cash_balance= cash_balance + ?   WHERE id= ?  `;
              let saveBalance = await db.query(sql, [win_amount, playerId]);
            }
          }

          let winningAmount = total_win_amount - total_bet_amount;
          playeWinningArray.push({ playerId, winningAmount });
        }
      }
      debug("Winning amount successfuly updated in db");
    }

    return playeWinningArray;
  } catch (err) {
    debug(err);
  }
};

const gameMartixRecords = async (data) => {
  try {
    let limit = 105;
    let result = new Array(limit);
    let sql = `SELECT spot FROM (SELECT * FROM game_record_sevenup
 ORDER BY id DESC LIMIT ?) sub ORDER BY id ASC`;
    let data = await db.query(sql, limit);
    if (isValidArray(data)) {
      result = data.map((win) => win.spot);
    }
    return result;
  } catch (err) {
    debug(err);
  }
};

// const gameMartixRecords = async(data) => {
//     try{

//         let limit = 210;
//         let maxColumn = 21;
//         let maxRow = 5;
//         let result = new Array(maxColumn);
//         let arr = [];
//         let sql =  `SELECT spot FROM game_record_TripleChan ORDER BY id DESC LIMIT ?`
//         let data = await db.query(sql,limit);
//         if(isValidArray(data)){

//             for (var i = 0; i < data.length; i++) {
//                 let len = arr.length;
//                 if((arr[len-1] != undefined) && (arr[len-1][0] === data[i].spot) && (arr[len-1].length < maxRow)) {
//                     arr[len-1].push(data[i].spot);
//                 }else{
//                     arr[len] = [data[i].spot]
//                     maxColumn--;
//                 }
//                 if(maxColumn === 0) break;
//             }
//             result = arr.reverse();
//         }
//         return result
//     } catch (err) {
//         debug(err);
//     }
// }

const gameSlotRecords = async (data) => {
  try {
    let limit = 10;
    let result = new Array(limit);
    let sql = `SELECT winNo1,winNo2 FROM (SELECT * FROM game_record_sevenup
 ORDER BY id DESC LIMIT ?) sub ORDER BY id ASC`;
    let data = await db.query(sql, limit);
    if (isValidArray(data)) {
      result = data.map((spot) => {
        return { D: spot.winNo1, T: spot.winNo2 };
      });
    }
    return result;
  } catch (err) {
    debug(err);
  }
};

const addwinningpoint = async (playerId, points) => {
  console.log("playerId:", playerId, "points:", points);
  try {
    let sql = `SELECT * FROM users WHERE LOWER(email)= ? limit ?`;
    let responseData = await db.query(sql, [playerId, 1]);
    if (responseData.length > 0) {
      sql = `SELECT * FROM users WHERE LOWER(email)= ? limit ?`;
      responseData = await db.query(sql, [playerId, 1]);
      if (responseData.length > 0) {
        const tpoints = parseInt(points) + parseInt(responseData[0].point);
        sql = "UPDATE users SET point= ? WHERE email=?";

        const userss = await db.query(sql, [tpoints, playerId]);
        console.log(userss);
        if (userss) {
          let formData = {
            email: playerId,
            point: points,
          };
        } else {
        }
      }
    } else {
    }
  } catch (err) {
    debug(err);
  }
};
const onbalance = async (playerId) => {
  try {
    //let limit = 1;
    let sql = `SELECT point FROM users where email =? `;
    let result = await db.query(sql, playerId);

    return result;
  } catch (err) {
    debug(err);
  }
};

const SevenupBets = async (two_sixbet, sevenbet, eight_twelvebet) => {
  console.log(
    "two_sixbet:",
    two_sixbet,
    "sevenbet:",
    sevenbet,
    "eight_twelvebet:",
    eight_twelvebet
  );
  try {
    let sql = `SELECT * FROM sevenup_bet  `;
    let responseData = await db.query(sql, []);
    if (responseData.length > 0) {
      sql = `SELECT * FROM sevenup_bet  `;
      responseData = await db.query(sql, []);
      if (responseData.length > 0) {
        const tpoints =
          parseInt(two_sixbet) + parseInt(responseData[0].two_six);
        const spoints = parseInt(sevenbet) + parseInt(responseData[0].seven);

        const dpoints =
          parseInt(eight_twelvebet) + parseInt(responseData[0].eight_twelve);
        var formData = {
          two_six: tpoints,
          eight_twelve: dpoints,
          seven: spoints,
        };
        sql = "UPDATE sevenup_bet SET ?";

        const userss = await db.query(sql, [formData]);
        console.log(userss);
        if (userss) {
          console.log(userss);
        }
      }
    } else {
    }
  } catch (err) {
    debug(err);
  }
};

const DetailSevenup = async (data) => {
  try {
    let sql = "SELECT * FROM sevenup_bet ";
    let detail = await db.query(sql);
    //debug("Winning no. inserted successfuly to db");
    return detail[0];
  } catch (err) {
    debug(err);
  }
};

const GameRunning = async (
  playername,
  RoundCount,
  singleNo,
  doubleNo,
  tripleNo,
  Win_finalNo
) => {
  try {
    console.log("hello");

    var formData1 = {
      playername: playername,
      RoundCount: RoundCount,
      singleNo: singleNo,
      doubleNo: doubleNo,
      tripleNo: tripleNo,
      Win_finalNo: Win_finalNo,
    };
    let sql = `SELECT * FROM game_running WHERE playername = ? `;
    let responseData = await db.query(sql, playername);
    /*   if (responseData.length > 0) {
          sql = "UPDATE game_running SET singleNo=?,doubleNo=?,tripleNo=?,Win_singleNo=? WHERE playername =? ";
  
          const userss = await db.query(sql,  [singleNo,doubleNo,tripleNo,Win_singleNo ,playername]);
              
          console.log(userss);;
           }
       */ // else {
    sql = "INSERT INTO  game_running SET ?";
    const users = await db.query(sql, formData1);
    if (users) {
    }
    return "successfully";
  } catch (err) {
    console.log("err", err);
    debug(err);
  }
};

const GetGameRunningData = async (playername) => {
  try {
    console.log("hello GetGameRunningData");

    let sql = `SELECT * FROM game_running WHERE playername = ? order by playerTime desc limit 1 `;
    let responseData = await db.query(sql, playername);
    if (responseData.length > 0) {
      return responseData[0];
    }
    return "no user data exits";
  } catch (err) {
    console.log("err", err);
    debug(err);
  }
};
const UpdateGameRunningDataWinSingleNumber = async (
  playername,
  playerTime,
  Win_finalNo
) => {
  try {
    console.log("hello UpdateGameRunningDataWinSingleNumber");

    let sql = `update game_running set Win_finalNo=?  WHERE playername = ? And playerTime=?  `;
    let responseData = await db.query(sql, [
      Win_finalNo,
      playername,
      playerTime,
    ]);
    if (responseData) {
      console.log("important", responseData);
      return responseData;
    }
    return "no user data exits";
  } catch (err) {
    console.log("err", err);
    debug(err);
  }
};

const UpdateGameRunningDataWinpoint = async (
  playername,
  playerTime,
  winpoint
) => {
  try {
    console.log("hello UpdateGameRunningDataWinpoint");

    let sql = `update game_running set winpoint=?  WHERE playername = ? And playerTime=?  `;
    let responseData = await db.query(sql, [winpoint, playername, playerTime]);
    if (responseData) {
      console.log(responseData);
      return responseData;
    }
    return "no user data exits";
  } catch (err) {
    console.log("err", err);
    debug(err);
  }
};

const RemovePlayerIdInBetplaced = async (playerId) => {
  try {
    let sql = `Delete From isbetplaced where playerId= ? `;
    let savePoint = await db.query(sql, [playerId]);
    console.log("databaseupdated", savePoint);
  } catch (err) {
    debug(err);
  }
};

const GetGameHistoryGameRunningData = async () => {
  try {
    console.log("hello GetGameHistoryGameRunningData");

    let sql = `SELECT * FROM game_running  order by playerTime desc limit 6 `;
    let responseData = await db.query(sql);
    if (responseData.length > 0) {
      return responseData;
    }
    return "no user data exits";
  } catch (err) {
    console.log("err", err);
    debug(err);
  }
};
const GetPlayerIdInBetplaced = async () => {
  try {
    let sql = `Select * From isbetplaced  `;
    let savePoint = await db.query(sql, []);
    if (savePoint.length > 0) {
      return true;
    } else {
      return false;
    }
    console.log("databaseupdated", savePoint);
  } catch (err) {
    debug(err);
  }
};

const AddPlayerIdInBetplaced = async (playerId) => {
  try {
    var formdata = {
      playerId: playerId,
    };
    let sql = `SELECT * FROM isbetplaced WHERE playerId = ? `;
    let agent= await db.query(sql,[playerId]);
    if(agent.length>0){
    }
    else{
    
    let sql = `Insert into isbetplaced set ? `;
    let savePoint = await db.query(sql, [formdata]);
    console.log("databaseupdated", savePoint);
  } }catch (err) {
    debug(err);
  }
};

const Remove7BetAll = async () => {
  //console.log("dragonbet:", dragonbet, "tigerbet:", tigerbet);
  try {
    var formData = {
      two_six: 0,
      seven: 0,
      eight_twelve: 0,
    };
    let sql = "UPDATE sevenup_bet SET ?";

    const userss = await db.query(sql, [formData]);
    console.log(userss);
    if (userss) {
      console.log(userss);
    }
  } catch (err) {
    debug(err);
  }
};
const RemoveAllplayer = async () => {
  try {
    var sql = "Delete from isbetplaced";

    const userss = await db.query(sql);
    console.log(userss);
  } catch (err) {
    debug(err);
  }
};

const PlayerDetails = async (playername, RoundCount, dice1, dice2, wintype) => {
  try {
    console.log("hello");

    var formData1 = {
      playername: playername,
      RoundCount: RoundCount,
      dice1: dice1,
      dice2: dice2,

      wintype: wintype,
    };
    let sql = `SELECT * FROM seven_playerdetail WHERE playername = ? `;
    let responseData = await db.query(sql, playername);
    /*   if (responseData.length > 0) {
          sql = "UPDATE seven_playerdetail SET singleNo=?,doubleNo=?,tripleNo=?,Win_singleNo=? WHERE playername =? ";
  
          const userss = await db.query(sql,  [singleNo,doubleNo,tripleNo,Win_singleNo ,playername]);
              
          console.log(userss);;
           }
       */ // else {
    sql = "INSERT INTO  seven_playerdetail SET ?";
    const users = await db.query(sql, formData1);
    if (users) {
    }
    return "successfully";
  } catch (err) {
    console.log("err", err);
    debug(err);
  }
};

const getAdmin7up = async () => {
  try {
    let sql = "select * from admin_7up ";
    let updateResponse = await db.query(sql);
    if (updateResponse.length > 0) {
      return updateResponse[0];
    } else {
      return false;
    }
  } catch (error) {
    console.log("error", error);
    debug(error);
  }
};

const WinamountDetails = async (playerId, game_id, point) => {
  try {
    console.log("hello");

    var formData1 = {
      playerId: playerId,
      game_id: game_id,
      point: point,
    };
    let sql = `SELECT * FROM winpoint_details WHERE playerId= ? AND game_id= ? `;

    let responseData = await db.query(sql, [playerId, game_id]);
    if (responseData.length > 0) {
      //let user = await userByEmail(playerId);

      let result = responseData[0]["point"];

      sql ="UPDATE winpoint_details SET point=? WHERE playerId =? AND game_id= ? ";

      const userss = await db.query(sql, [result + point, playerId, game_id]);

      console.log("databaseupdated", userss);
      //let user1 = await userByEmail(playerId);
     // let result1 = userss[0]["point"];

     // return result1;

      console.log("WinAmount:-------------------------------", userss);
    } else {
      sql = "INSERT INTO  winpoint_details SET ?";
      const users = await db.query(sql, formData1);
      if (users) {
      }
      return "successfully";
    }
  } catch (err) {
    console.log("err", err);
    debug(err);
  }
};
const GetAllplayer = async () => {
  try {
    var sql = "Select * from isbetplaced";

    const userss = await db.query(sql);
    console.log(userss);
    return userss;
  } catch (err) {
    debug(err);
  }
};

module.exports = {
  GetAllplayer,
  WinamountDetails,
  RemoveAllplayer,
  getAdmin7up,
  PlayerDetails,
  Remove7BetAll,
  AddPlayerIdInBetplaced,
  GetPlayerIdInBetplaced,
  GetGameHistoryGameRunningData,
  RemovePlayerIdInBetplaced,
  UpdateGameRunningDataWinpoint,
  UpdateGameRunningDataWinSingleNumber,
  GetGameRunningData,
  GameRunning,
  DetailSevenup,
  SevenupBets,
  JoinGame,
  addwinningpoint,
  onbalance,
  lastWinningNo,
  getRoundCount,
  updateUserPoint,
  getUserPoint,
  updateWinningNo,
  updateWinningAmount,
  getUserBalance,
  gameMartixRecords,
  gameSlotRecords,
};
