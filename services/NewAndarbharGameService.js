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

const userByEmail = async (playerId) => {
  try {
    let sql = `SELECT * FROM users WHERE email= ? limit ?`;
    let user = await db.query(sql, [playerId, 1]);
    return user;
  } catch (err) {
    console.log(err);
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
    let sql = `SELECT room_id FROM game_record_newandarbhar ORDER BY id DESC LIMIT ?`;
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
    let sql = `SELECT spot FROM (SELECT * FROM game_record_newandarbhar
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
    let sql = "Insert Into game_record_newandarbhar Set ?";
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
    let game_id = 3;
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
    let sql = `SELECT spot FROM (SELECT * FROM game_record_newandarbhar
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
    let sql = `SELECT winNo1,winNo2 FROM (SELECT * FROM game_record_newandarbhar
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

const getUserPoint = async (playerId, betPoints) => {
  try {
    console.log("betPoints===", betPoints);
    let user = await userByEmail(playerId);
    let result = user[0]["point"];
    let sql = `UPDATE users SET point= ? WHERE email= ? `;
    let savePoint = await db.query(sql, [result - betPoints, playerId]);

    return result;
  } catch (err) {
    console.log(err);
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
    return result+winPoints;

    //return result;
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
const AddPlayerIdInBetplaced = async (playerId) => {
  try {
    var formdata = {
      playerId: playerId,
    };
    let sql = `SELECT * FROM isbetplacedandar WHERE playerId = ? `;
    let agent= await db.query(sql,[playerId]);
    if(agent.length>0){
    }
    else{
   
    let sql = `Insert into isbetplacedandar set ? `;
    let savePoint = await db.query(sql, [formdata]);
    console.log("databaseupdated", savePoint);
  } }catch (err) {
    debug(err);
  }
};



const AndarBaharBets = async (
  Card_A_amount ,
  Card_2_amount ,
  Card_3_amount ,
  Card_4_amount,
  Card_5_amount,
  Card_6_amount,
  Card_7_amount,
  Card_8_amount,
  Card_9_amount,
  Card_10_amount,
  Card_J_amount,
  Card_Q_amount,
  Card_K_amount,
  Card_Heart_amount,
  Card_Diamond_amount,
  Card_Club_amount,
  Card_Spade_amount,
  Card_Red_amount,
  Card_Black_amount,
  Card_A_6_amount,
  Card_seven_amount,
  Card_8_K_amount,
  Card_Andhar_amount ,
  Card_Bahar_amount,

) => {
  console.log(
    "Card_A_amount :", Card_A_amount,
  "Card_2_amount :",Card_2_amount,
  "Card_3_amount :",Card_3_amount,
 " Card_4_amount:",Card_4_amount,
 " Card_5_amount:",Card_5_amount,
 " Card_6_amount:",Card_6_amount,
 " Card_7_amount:",Card_7_amount,
 " Card_8_amount:",Card_8_amount,
 " Card_9_amount:",Card_9_amount,
  "Card_10_amount:",Card_10_amount,
 " Card_J_amount:",Card_J_amount,
 " Card_Q_amount:",Card_Q_amount,
 " Card_K_amount:",Card_K_amount,
  "Card_Heart_amount:",Card_Heart_amount,
  "Card_Diamond_amount:",Card_Diamond_amount,
  "Card_Club_amount:",Card_Club_amount,
  "Card_Spade_amount:",Card_Spade_amount,
  "Card_Red_amount:",Card_Red_amount,
  "Card_Black_amount:",Card_Black_amount,
  "Card_A_6_amount:",Card_A_6_amount,
  "Card_seven_amount:",Card_seven_amount,
  "Card_8_K_amount:",Card_8_K_amount,
  Card_Andhar_amount ,
  Card_Bahar_amount,

  );
  try {
    let sql = `SELECT * FROM andarbahar_bet  `;
    let responseData = await db.query(sql, []);
    if (responseData.length > 0) {
      sql = `SELECT * FROM andarbahar_bet  `;
      responseData = await db.query(sql, []);
      if (responseData.length > 0) {
        const upoints =
          parseInt(Card_A_amount) + parseInt(responseData[0].Card_A_amount);
        const bpoints = parseInt(Card_2_amount) + parseInt(responseData[0].Card_2_amount);
        const spoints = parseInt(Card_3_amount) + parseInt(responseData[0].Card_3_amount);
        const cpoints = parseInt(Card_4_amount) + parseInt(responseData[0].Card_4_amount);
        const capoints = parseInt(Card_5_amount) + parseInt(responseData[0].Card_5_amount);
        const bupoints = parseInt(Card_6_amount) + parseInt(responseData[0].Card_6_amount);
        const kpoints = parseInt(Card_7_amount) + parseInt(responseData[0].Card_7_amount);
        const ropoints = parseInt(Card_8_amount) + parseInt(responseData[0].Card_8_amount);
        const rapoints = parseInt(Card_9_amount) + parseInt(responseData[0].Card_9_amount);
        const ppoints = parseInt(Card_10_amount) + parseInt(responseData[0].Card_10_amount);
        const butpoints = parseInt(Card_J_amount) + parseInt(responseData[0].Card_J_amount);
        const btpoints = parseInt(Card_Q_amount) + parseInt(responseData[0].Card_Q_amount);

        const lpoints = parseInt(Card_K_amount) + parseInt(responseData[0].Card_K_amount);
        const dpoints = parseInt(Card_Heart_amount) + parseInt(responseData[0].Card_Heart_amount);
        const cupoints = parseInt(Card_Club_amount) + parseInt(responseData[0].Card_Club_amount);
        const dipoints = parseInt(Card_Diamond_amount) + parseInt(responseData[0].Card_Diamond_amount);
        const sppoints = parseInt(Card_Spade_amount) + parseInt(responseData[0].Card_Spade_amount);
        const sdpoints = parseInt(Card_Red_amount) + parseInt(responseData[0].Card_Red_amount);
        const scpoints = parseInt(Card_Black_amount) + parseInt(responseData[0].Card_Black_amount);
        const sspoints = parseInt(Card_A_6_amount) + parseInt(responseData[0].Card_A_6_amount);
        const sepoints = parseInt(Card_seven_amount) + parseInt(responseData[0].Card_seven_amount);
        const s8points = parseInt(Card_8_K_amount) + parseInt(responseData[0].Card_8_K_amount);
        const apoints = parseInt(Card_Andhar_amount) + parseInt(responseData[0].Card_Andhar_amount);
        const brpoints = parseInt(Card_Bahar_amount) + parseInt(responseData[0].Card_Bahar_amount);


        var formData = {
          Card_A_amount : upoints,
          Card_2_amount: bpoints,
          Card_3_amount: spoints,
          Card_4_amount: cpoints,
          Card_5_amount: capoints,
          Card_6_amount: bupoints,
          Card_7_amount: kpoints,
          Card_8_amount: ropoints,
          Card_9_amount: rapoints,
          Card_10_amount: ppoints,
          Card_J_amount: butpoints,
          Card_Q_amount: btpoints,
          Card_K_amount: lpoints,
          Card_Heart_amount:dpoints,
          Card_Club_amount:cupoints

          ,Card_Diamond_amount:dipoints,
          Card_Spade_amount:sppoints,
          Card_Red_amount:sdpoints,
          Card_Black_amount:scpoints,
          Card_A_6_amount:sspoints,
          Card_seven_amount:sepoints,
          Card_8_K_amount:s8points,
          Card_Andhar_amount:apoints,
          Card_Bahar_amount:brpoints

        };
        sql = "UPDATE andarbahar_bet SET ?";

        const userss = await db.query(sql, [formData]);
        console.log(userss);
        if (userss) {
          console.log(userss);
        }
      }
    } else {
    }
  } catch (err) {
    console.log("err",err)
    debug(err);
  }
};





const DetailAndarBahar = async (data) => {
  try {
    let sql = "SELECT * FROM andarbahar_bet ";
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
  Card_A_amount ,
  Card_2_amount ,
  Card_3_amount ,
  Card_4_amount,
  Card_5_amount,
  Card_6_amount,
  Card_7_amount,
  Card_8_amount,
  Card_9_amount,
  Card_10_amount,
  Card_J_amount,
  Card_Q_amount,
  Card_K_amount,
  Card_Heart_amount,
  Card_Diamond_amount,
  Card_Club_amount,
  Card_Spade_amount,
  Card_Red_amount,
  Card_Black_amount,
  Card_A_6_amount,
  Card_seven_amount,
  Card_8_K_amount, 
  Card_Andhar_amount ,
 Card_Bahar_amount,

  Win_singleNo
) => {
  try {
    console.log("hello");

    var formData1 = {
      playername: playername,
      RoundCount:RoundCount,
      Card_A_amount :Card_A_amount,
      Card_2_amount :Card_2_amount,
      Card_3_amount :Card_3_amount,
      Card_4_amount:Card_4_amount,
      Card_5_amount:Card_5_amount,
      Card_6_amount:Card_6_amount,
      Card_7_amount:Card_7_amount,
      Card_8_amount:Card_8_amount,
      Card_9_amount:Card_9_amount,
      Card_10_amount:Card_10_amount,
      Card_J_amount:Card_J_amount,
      Card_Q_amount:Card_Q_amount,
      Card_K_amount:Card_K_amount,
      Card_Heart_amount:Card_Heart_amount,
      Card_Diamond_amount:Card_Diamond_amount,
      Card_Club_amount:Card_Club_amount,
      Card_Spade_amount:Card_Spade_amount,
      Card_Red_amount:Card_Red_amount,
      Card_Black_amount:Card_Black_amount,
      Card_A_6_amount:Card_A_6_amount,
      Card_seven_amount:Card_seven_amount,
      Card_8_K_amount:Card_8_K_amount,
      Card_Andhar_amount:Card_Andhar_amount ,
      Card_Bahar_amount:Card_Bahar_amount,

      Win_singleNo: Win_singleNo,
    };
    let sql = `SELECT * FROM game_running_andarbahar WHERE playername = ? `;
    let responseData = await db.query(sql, playername);
    /*   if (responseData.length > 0) {
          sql = "UPDATE game_running_andarbahar SET singleNo=?,doubleNo=?,tripleNo=?,Win_singleNo=? WHERE playername =? ";
  
          const userss = await db.query(sql,  [singleNo,doubleNo,tripleNo,Win_singleNo ,playername]);
              
          console.log(userss);;
           }
       */ // else {
    sql = "INSERT INTO  game_running_andarbahar SET ?";
    const users = await db.query(sql, formData1);
    if (users) {
    }
    return "successfully";
  } catch (err) {
    console.log("err", err);
    debug(err);
  }
};







const GetPlayerIdInBetplaced = async (playerId) => {
  try {
    let sql = `Select * From isbetplacedandar where playerId= ? `;
    let savePoint = await db.query(sql, [playerId]);
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





const GetGameRunningData = async (playername) => {
  try {
    console.log("hello GetGameRunningData");

    let sql = `SELECT * FROM game_running_andarbahar WHERE playername = ? order by playedTime desc limit 1 `;
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



const UpdateGameRunningDataWinpoint = async (
  playername,
  playedTime,
  winpoint
) => {
  try {
    console.log("hello UpdateGameRunningDataWinpoint");

    let sql = `update game_running_andarbahar set winpoint=?  WHERE playername = ? And playedTime=?  `;
    let responseData = await db.query(sql, [winpoint, playername, playedTime]);
    if (responseData) {
      return responseData;
    }
    return "no user data exits";
  } catch (err) {
    console.log("err", err);
    debug(err);
  }
};
const UpdateGameRunningDataWinSingleNumber = async (playername,playedTime,Win_singleNo) => {
  try {
    console.log("hello UpdateGameRunningDataWinSingleNumber")

   let sql = `update game_running_andarbahar set Win_singleNo=?  WHERE playername = ? And playedTime=?  `;
    let    responseData = await db.query(sql, [Win_singleNo,playername,playedTime]);
        if (responseData) {
  console.log("important",responseData)
      return responseData
              
           }
      return "no user data exits"
    } catch (err) {
      console.log("err",err)
    debug(err);

  }
};
const RemovePlayerIdInBetplaced = async (playerId) => {
  try {
    let sql = `Delete From isbetplacedandar where playerId= ? `;
    let savePoint = await db.query(sql, [playerId]);
    console.log("databaseupdated", savePoint);
  } catch (err) {
    debug(err);
  }
};
const RemoveAllplayer = async () => {
  try {
        var sql = "Delete from isbetplacedandar";

    const userss = await db.query(sql);
    console.log(userss);
  } catch (err) {
    debug(err);
  }
};

const RemoveandarbaharBetsAll = async () => {
  try {
     var formData = {
      Card_A_amount :0,
      Card_2_amount :0,
      Card_3_amount :0,
      Card_4_amount:0,
      Card_5_amount:0,
      Card_6_amount:0,
      Card_7_amount:0,
      Card_8_amount:0,
      Card_9_amount:0,
      Card_10_amount:0,
      Card_J_amount:0,
      Card_Q_amount:0,
      Card_K_amount:0,
      Card_Heart_amount:0,
      Card_Diamond_amount:0,
      Card_Club_amount:0,
      Card_Spade_amount:0,
      Card_Red_amount:0,
      Card_Black_amount:0,
      Card_A_6_amount:0,
      Card_seven_amount:0,
      Card_8_K_amount:0, 
      Card_Andhar_amount :0,
     Card_Bahar_amount:0,
         };
    
     let    sql = "UPDATE andarbahar_bet SET ?";
 
         const userss = await db.query(sql, [formData]);
         console.log(userss);
         if (userss) {
           console.log(userss);
         }
       }
     
   catch (err) {
     debug(err);
   }
 };
 



 
const PlayerDetails = async (
  playername,
  RoundCount,
  Cardresult,
  finalresult,
 
) => {
  try {
    console.log("hello");

    var formData1 = {
      playername: playername,
      RoundCount:RoundCount,
      Cardresult:Cardresult,
      finalresult:finalresult,
      
    };
    let sql = `SELECT * FROM andarbahar_playerdetails WHERE playername = ? `;
    let responseData = await db.query(sql, playername);
    /*   if (responseData.length > 0) {
          sql = "UPDATE andarbahar_playerdetails SET singleNo=?,doubleNo=?,tripleNo=?,Win_singleNo=? WHERE playername =? ";
  
          const userss = await db.query(sql,  [singleNo,doubleNo,tripleNo,Win_singleNo ,playername]);
              
          console.log(userss);;
           }
       */ // else {
    sql = "INSERT INTO  andarbahar_playerdetails SET ?";
    const users = await db.query(sql, formData1);
    if (users) {
    }
    return "successfully";
  } catch (err) {
    console.log("err", err);
    debug(err);
  }
};
const getAdminandarbahar = async () => {
 
  try {
    
      let sql = "select * from admin_andarbahar ";
     let updateResponse = await db.query(sql);
      if (updateResponse.length>0) {
       return updateResponse[0];
      } else{
        return false
      }
   
  } catch (error) {
    console.log("error",error)
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
    var sql = "Select * from isbetplacedandar";

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
  getAdminandarbahar,
  PlayerDetails,
  RemoveandarbaharBetsAll,
  RemoveAllplayer,
  RemovePlayerIdInBetplaced,
  UpdateGameRunningDataWinSingleNumber,
  UpdateGameRunningDataWinpoint,
  GetGameRunningData,
  GetPlayerIdInBetplaced,
  GameRunning,
  AndarBaharBets,
  DetailAndarBahar,
  AddPlayerIdInBetplaced,
  JoinGame,
  onbalance,
  addwinningpoint,
  lastWinningNo,
  getRoundCount,
  getUserPoint,
  userByEmail,
  updateUserPoint,
  updateWinningNo,
  updateWinningAmount,
  getUserBalance,
  gameMartixRecords,
  gameSlotRecords,
};
