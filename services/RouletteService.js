"use strict";
//const //debug = require("//debug")("test");
const db = require("../config/db.js");
const commonVar = require("../Constants").commonVar;

const userById = async (playerId) => {
  try {
    let sql = `SELECT * FROM users WHERE id= ? limit ?`;
    let user = await db.query(sql, [playerId, 1]);
    return user;
  } catch (err) {
    //debug(err);
  }
};

const getUserBalance = async (playerId) => {
  try {
    let user = await userById(playerId);
    let result = user[0]["cash_balance"];
    return result;
  } catch (err) {
    //debug(err);
  }
};

const userByEmail = async (playerId) => {
  try {
    let sql = `SELECT * FROM users WHERE email= ? limit ?`;
    let user = await db.query(sql, [playerId, 1]);
    return user;
  } catch (err) {
    //debug(err);
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
    //debug(err);
  }
};

const updateUserPoint = async (playerId, winPoints) => {
  try {
    let user = await userByEmail(playerId);
    let result = user[0]["point"];
    let sql = `UPDATE users SET point= ? WHERE email= ? `;
    let savePoint = await db.query(sql, [result + winPoints, playerId]);
    //console.log("databaseupdated", savePoint);
    let user1 = await userByEmail(playerId);
    let result1 = user1[0]["point"];

    return result1;

    //return result;
  } catch (err) {
    //debug(err);
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
    let sql = `SELECT room_id FROM game_record_roulette ORDER BY id DESC LIMIT ?`;
    let result = await db.query(sql, limit);
    let roundCount = result[result.length - 1]["room_id"] + 1;
    return roundCount;
  } catch (err) {
    //debug(err);
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
    //debug("player bet successfully add to db");
    return true;
  } catch (err) {
    //debug(err);
  }
};

const lastWinningNo = async () => {
  try {
    let limit = 20;
    let result = new Array(limit);
    let sql = `SELECT spot FROM (SELECT * FROM game_record_roulette
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
    //debug(err);
  }
};

const updateWinningNo = async (data) => {
  try {
    let parms = data;
    let sql = "Insert Into game_record_roulette Set ?";
    let query = await db.query(sql, parms);
    //debug("Winning no. inserted successfuly to db");
    return true;
  } catch (err) {
    //debug(err);
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
      //debug("Winning amount successfuly updated in db");
    }

    return playeWinningArray;
  } catch (err) {
    //debug(err);
  }
};

const gameMartixRecords = async (data) => {
  try {
    let limit = 105;
    let result = new Array(limit);
    let sql = `SELECT spot FROM (SELECT * FROM game_record_roulette
 ORDER BY id DESC LIMIT ?) sub ORDER BY id ASC`;
    let data = await db.query(sql, limit);
    if (isValidArray(data)) {
      result = data.map((win) => win.spot);
    }
    return result;
  } catch (err) {
    //debug(err);
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
//         //debug(err);
//     }
// }

const gameSlotRecords = async (data) => {
  try {
    let limit = 10;
    let result = new Array(limit);
    let sql = `SELECT winNo1,winNo2 FROM (SELECT * FROM game_record_roulette
 ORDER BY id DESC LIMIT ?) sub ORDER BY id ASC`;
    let data = await db.query(sql, limit);
    if (isValidArray(data)) {
      result = data.map((spot) => {
        return { D: spot.winNo1, T: spot.winNo2 };
      });
    }
    return result;
  } catch (err) {
    //debug(err);
  }
};

const RemoveRouletteBetsAll = async () => {
  // //console.log("zero:",zero,"one:",one,"two:",two,"three:",three,"four:",four,"five:",five,"six:",six,"seven:",seven,"eight:",eight,"nine:",nine);
  try {
    var formData = {
      straightUp: 0,
      Split: 0,
      Street: 0,
      Corner:0,
  specificBet:0,
  line:0,
  dozen1:0,
  dozen2:0,
  dozen3:0,
  column1:0,
  column2:0,
  column3:0,
  onetoEighteen:0,
  nineteentoThirtysix:0,
 even:0,
  odd:0,
  black:0,
  red:0,
  bet00:0,
  bet0:0,
bet1:0,
bet2:0,
bet3:0,
 bet4:0,
 bet5:0,
 bet6:0,
 bet7:0,
 bet8:0,
 bet9:0,
 bet10:0,
 bet11:0,
 bet12:0,
 bet13:0,
 bet14:0,
 bet15:0,
 bet16:0,
 bet17:0,
 bet18:0,
 bet19:0,
 bet20:0,
 bet21:0,
 bet22:0,
 bet23:0,
 bet24:0,
 bet25:0,
 bet26:0,
 bet27:0,
 bet28:0,
 bet29:0,
 bet30:0,
 bet31:0,
 bet32:0,
 bet33:0,
 bet34:0,
 bet35:0,
 bet36:0
    };
    var sql = "UPDATE rouletebet SET ?";

    const userss = await db.query(sql, [formData]);
    //console.log(userss);
  } catch (err) {
    //debug(err);
  }
};

const Detailroulete = async (data) => {
  try {
    let sql = `SELECT  bet00,
    bet0,
  bet1,
  bet2,
  bet3,
   bet4,
   bet5,
   bet6,
   bet7,
   bet8,
   bet9,
   bet10,
   bet11,
   bet12,
   bet13,
   bet14,
   bet15,
   bet16,
   bet17,
   bet18,
   bet19,
   bet20,
   bet21,
   bet22,
   bet23,
   bet24,
   bet25,
   bet26,
   bet27,
   bet28,
   bet29,
   bet30,
   bet31,
   bet32,
   bet33,
   bet34,
   bet35,
   bet36
    FROM rouletebet `;
    let detail = await db.query(sql);
    ////debug("Winning no. inserted successfuly to db");
    return detail[0];
  } catch (err) {
    //debug(err);
  }
};

const GameRunning = async (
  playername,
  RoundCount,
  straightUp,
  Split,
  Street,
  Corner,
  specificBet,
  line,
  dozen1,
  dozen2,
  dozen3,
  column1,
  column2,
  column3,
  onetoEighteen,
  nineteentoThirtysix,
 even,
  odd,
  black,
  red,
  straightUpVal,
  SplitVal,
  StreetVal,
  CornerVal,
  specificBetVal,
  lineVal,
  dozen1Val,
  dozen2Val,
  dozen3Val,
  column1Val,
  column2Val,
  column3Val,
  onetoEighteenVal,
  nineteentoThirtysixVal,
 evenVal,
  oddVal,
  blackVal,
  redVal,

  Win_singleNo
) => {
  try {
    //console.log("hello");

    var formData1 = {
      playername: playername,
      RoundCount: RoundCount,
      straightUp: straightUp,
      Split: Split,
      Street: Street,
      Corner: Corner,
      specificBet: specificBet,
      line: line,
      dozen1: dozen1,
      dozen2: dozen2,
      dozen3: dozen3,
      column1: column1,
      column2: column2,
      column3: column3,
      onetoEighteen:onetoEighteen,
  nineteentoThirtysix:nineteentoThirtysix,
      even: even,
      odd: odd,
      black: black,
      red: red,

      straightUpVal: straightUpVal,
      SplitVal: SplitVal,
      StreetVal: StreetVal,
      CornerVal: CornerVal,
      specificBetVal: specificBetVal,
      lineVal: lineVal,
      dozen1Val: dozen1Val,
      dozen2Val: dozen2Val,
      dozen3Val: dozen3Val,
      column1Val: column1Val,
      column2Val: column2Val,
      column3Val: column3Val,
      onetoEighteenVal:onetoEighteenVal,
  nineteentoThirtysixVal:nineteentoThirtysixVal,
      evenVal: evenVal,
      oddVal: oddVal,
      blackVal: blackVal,
      redVal: redVal,

      Win_singleNo: Win_singleNo,
    };
    let sql = `SELECT * FROM game_running_roulette WHERE playername = ? `;
    let responseData = await db.query(sql, playername);
    /*   if (responseData.length > 0) {
            sql = "UPDATE game_running SET singleNo=?,doubleNo=?,tripleNo=?,Win_singleNo=? WHERE playername =? ";
    
            const userss = await db.query(sql,  [singleNo,doubleNo,tripleNo,Win_singleNo ,playername]);
                
            //console.log(userss);;
             }
         */ // else {
    sql = "INSERT INTO  game_running_roulette SET ?";
    const users = await db.query(sql, formData1);
    if (users) {
    }
    return "successfully";
  } catch (err) {
    //console.log("err", err);
    //debug(err);
  }
};

const GetPlayerIdInBetplaced = async () => {
  try {
    let sql = `Select * From isbetplacedroulette  `;
    let savePoint = await db.query(sql, []);
    if (savePoint.length > 0) {
      return true;
    } else {
      return false;
    }
    //console.log("databaseupdated", savePoint);
  } catch (err) {
    //debug(err);
  }
};
const GetGameRunningData = async (playername) => {
  try {
    //console.log("hello GetGameRunningData");

    let sql = `SELECT * FROM game_running_roulette WHERE playername = ? order by playedTime desc limit 1 `;
    let responseData = await db.query(sql, playername);
    if (responseData.length > 0) {
      return responseData[0];
    }
    return "no user data exits";
  } catch (err) {
    //console.log("err", err);
    //debug(err);
  }
};
const UpdateGameRunningDataWinSingleNumber = async (
  playername,
  playedTime,
  Win_singleNo
) => {
  try {
    //console.log("hello UpdateGameRunningDataWinSingleNumber");

    let sql = `update game_running_roulette set Win_singleNo=?  WHERE playername = ? And playedTime=?  `;
    let responseData = await db.query(sql, [
      Win_singleNo,
      playername,
      playedTime,
    ]);
    if (responseData) {
      //console.log("important", responseData);
      return responseData;
    }
    return "no user data exits";
  } catch (err) {
    //console.log("err", err);
    //debug(err);
  }
};
const UpdateGameRunningDataWinpoint = async (
  playername,
  playedTime,
  winpoint
) => {
  try {
    //console.log("hello UpdateGameRunningDataWinpoint");

    let sql = `update game_running_roulette set winpoint=?  WHERE playername = ? And playedTime=?  `;
    let responseData = await db.query(sql, [winpoint, playername, playedTime]);
    if (responseData) {
      //console.log(responseData);
      return responseData;
    }
    return "no user data exits";
  } catch (err) {
    //console.log("err", err);
    //debug(err);
  }
};

const RemovePlayerIdInBetplaced = async (playerId) => {
  try {
    let sql = `Delete From isbetplacedroulette where playerId= ? `;
    let savePoint = await db.query(sql, [playerId]);
    //console.log("databaseupdated", savePoint);
  } catch (err) {
    //debug(err);
  }
};
const onbalance = async (playerId) => {
  try {
    //let limit = 1;
    let sql = `SELECT point FROM users where email =? `;
    let result = await db.query(sql, playerId);

    return result;
  } catch (err) {
    //debug(err);
  }
};

const AddPlayerIdInBetplaced = async (playerId) => {
  try {
    var formdata = {
      playerId: playerId,
    };
    let sql = `SELECT * FROM isbetplacedroulette WHERE playerId = ? `;
    let agent= await db.query(sql,[playerId]);
    if(agent.length>0){
    }
    else{
    
     sql = `Insert into isbetplacedroulette set ? `;
    let savePoint = await db.query(sql, [formdata]);
    //console.log("databaseupdated", savePoint);
  }} catch (err) {
    //debug(err);
  }
};

const RouletteBets = async (
  straightUpVal,
  SplitVal,
  StreetVal,
  CornerVal,
  specificBetVal,
  lineVal,
  dozen1Val,
  dozen2Val,
  dozen3Val,
  column1Val,
  column2Val,
  column3Val,
  onetoEighteen,
  nineteentoThirtysix,
  evenVal,
  odd,
  blackVal,
  redVal,
  Bet00,
  Bet0,
Bet1,
Bet2,
Bet3,
 Bet4,
 Bet5,
 Bet6,
 Bet7,
 Bet8,
 Bet9,
 Bet10,
 Bet11,
 Bet12,
 Bet13,
 Bet14,
 Bet15,
 Bet16,
 Bet17,
 Bet18,
 Bet19,
 Bet20,
 Bet21,
 Bet22,
 Bet23,
 Bet24,
 Bet25,
 Bet26,
 Bet27,
 Bet28,
 Bet29,
 Bet30,
 Bet31,
 Bet32,
 Bet33,
 Bet34,
 Bet35,
 Bet36,

) => {
  
 
  try {
    console.log("i m in ")
    let sql = `SELECT * FROM rouletebet  `;
    let responseData = await db.query(sql, []);
    if (responseData.length > 0) {
    console.log("i m in2",Bet00)

      sql = `SELECT * FROM rouletebet  `;
      responseData = await db.query(sql, []);
      if (responseData.length > 0) {
        console.log('in bet',responseData[0].bet34);
        const points = parseInt(straightUpVal) + parseInt(responseData[0].straightUp);
        const bpoints = parseInt(SplitVal) + parseInt(responseData[0].Split);
        const cpoints = parseInt(StreetVal) + parseInt(responseData[0].Street);
        const dpoints = parseInt(CornerVal) + parseInt(responseData[0].Corner);
        const epoints = parseInt(specificBetVal) + parseInt(responseData[0].specificBet);
        const fpoints = parseInt(lineVal) + parseInt(responseData[0].line);
        const gpoints = parseInt(dozen1Val) + parseInt(responseData[0].dozen1);
        const hpoints = parseInt(dozen2Val) + parseInt(responseData[0].dozen2);
        const ipoints = parseInt(dozen3Val) + parseInt(responseData[0].dozen3);
        const jpoints = parseInt(column1Val) + parseInt(responseData[0].column1);
        const kpoints = parseInt(column2Val) + parseInt(responseData[0].column2);
        const mpoints = parseInt(column3Val) + parseInt(responseData[0].column3);
        const npoints = parseInt(onetoEighteen) + parseInt(responseData[0].onetoEighteen);
        const opoints = parseInt(nineteentoThirtysix) + parseInt(responseData[0].nineteentoThirtysix);
        const ppoints = parseInt(odd) + parseInt(responseData[0].odd);
        const qpoints = parseInt(evenVal) + parseInt(responseData[0].even);
        const rpoints = parseInt(blackVal) + parseInt(responseData[0].black);
        const spoints = parseInt(redVal) + parseInt(responseData[0].red);
        const sumbet0 = parseInt(Bet0) + parseInt(responseData[0].bet0);
        const sumbet1 = parseInt(Bet1) + parseInt(responseData[0].bet1);
        const sumbet2 = parseInt(Bet2) + parseInt(responseData[0].bet2);
        const sumbet3 = parseInt(Bet3) + parseInt(responseData[0].bet3);
        const sumbet4 = parseInt(Bet4) + parseInt(responseData[0].bet4);

        const sumbet5 = parseInt(Bet5) + parseInt(responseData[0].bet5);
        const sumbet6 = parseInt(Bet6) + parseInt(responseData[0].bet6);
        const sumbet7 = parseInt(Bet7) + parseInt(responseData[0].bet7);
        const sumbet8 = parseInt(Bet8) + parseInt(responseData[0].bet8);
        const sumbet9 = parseInt(Bet9) + parseInt(responseData[0].bet9);
        const sumbet10 = parseInt(Bet10) + parseInt(responseData[0].bet10);
        const sumbet11 = parseInt(Bet11) + parseInt(responseData[0].bet11);
        const sumbet12 = parseInt(Bet12) + parseInt(responseData[0].bet12);
        const sumbet13 = parseInt(Bet13) + parseInt(responseData[0].bet13);
        const sumbet14 = parseInt(Bet14) + parseInt(responseData[0].bet14);

        const sumbet15 = parseInt(Bet15) + parseInt(responseData[0].bet15);
        const sumbet16 = parseInt(Bet16) + parseInt(responseData[0].bet16);
        const sumbet17 = parseInt(Bet17) + parseInt(responseData[0].bet17);
        const sumbet18 = parseInt(Bet18) + parseInt(responseData[0].bet18);
        const sumbet19 = parseInt(Bet19) + parseInt(responseData[0].bet19);
        const sumbet20 = parseInt(Bet20) + parseInt(responseData[0].bet20);
        const sumbet21 = parseInt(Bet21) + parseInt(responseData[0].bet21);
        const sumbet22 = parseInt(Bet22) + parseInt(responseData[0].bet22);
        const sumbet23 = parseInt(Bet23) + parseInt(responseData[0].bet23);
        const sumbet24 = parseInt(Bet24) + parseInt(responseData[0].bet24);

        const sumbet25 = parseInt(Bet25) + parseInt(responseData[0].bet25);
        const sumbet26 = parseInt(Bet26) + parseInt(responseData[0].bet26);
        const sumbet27 = parseInt(Bet27) + parseInt(responseData[0].bet27);
        const sumbet28 = parseInt(Bet28) + parseInt(responseData[0].bet28);
        const sumbet29 = parseInt(Bet29) + parseInt(responseData[0].bet29);
        const sumbet30 = parseInt(Bet30) + parseInt(responseData[0].bet30);
        const sumbet31 = parseInt(Bet31) + parseInt(responseData[0].bet31);
        const sumbet32 = parseInt(Bet32) + parseInt(responseData[0].bet32);
        const sumbet33 = parseInt(Bet33) + parseInt(responseData[0].bet33);
        const sumbet34 = parseInt(Bet34) + parseInt(responseData[0].bet34);

        const sumbet35 = parseInt(Bet35) + parseInt(responseData[0].bet35);
        const sumbet36 = parseInt(Bet36) + parseInt(responseData[0].bet36);
        const sumbet00= parseInt(Bet00) + parseInt(responseData[0].bet00);

            




        var formData = {
          straightUp:points,
          Split:bpoints,
          Street:cpoints,
          Corner:dpoints,
          specificBet:epoints,
          line:fpoints,
          dozen1:gpoints,
          dozen2:hpoints,
          dozen3:ipoints,
          column1:jpoints,
          column2:kpoints,
          column3:mpoints,
          onetoEighteen:npoints,
          nineteentoThirtysix:opoints,
          even:ppoints,
          odd:qpoints,
          black:rpoints,
          red:spoints,
          bet00:sumbet00,
          bet0:sumbet0,
          bet1:sumbet1,
          bet2:sumbet2,
          bet3:sumbet3,
          bet4:sumbet4,
          bet5:sumbet5,
          bet6:sumbet6,
          bet7:sumbet7,
          bet8:sumbet8,
          bet9:sumbet9,
          bet10:sumbet10,
          bet11:sumbet11,
          bet12:sumbet12,
          bet13:sumbet13,
          bet14:sumbet14,
          bet15:sumbet15,
          bet16:sumbet16,
          bet17:sumbet17,
          bet18:sumbet18,
          bet19:sumbet19,
          bet20:sumbet20,
          bet21:sumbet21,
          bet22:sumbet22,
          bet23:sumbet23,
          bet24:sumbet24,
          bet25:sumbet25,
          bet26:sumbet26,
          bet27:sumbet27,
          bet28:sumbet28,
          bet29:sumbet29,
          bet30:sumbet30,
         bet31:sumbet31,
          bet32:sumbet32,
          bet33:sumbet33,
          bet34:sumbet34,
          bet35:sumbet35,
          bet36:sumbet36,
          


        };
        console.log(formData, "form");
        sql = "UPDATE rouletebet SET ?";

        const userss = await db.query(sql, formData);
        //console.log(userss);
        if (userss) {
          //console.log(userss);
        }
      }
    } else {
    }
  } catch (err) {
    //debug(err);
  }
};




const RemoveAllplayer = async () => {
  try {
        var sql = "Delete from isbetplacedroulette";

    const userss = await db.query(sql);
    //console.log(userss);
  } catch (err) {
    //debug(err);
  }
};


const GetGameHistoryGameRunningData = async () => {
  try {
    //console.log("hello GetGameHistoryGameRunningData")

   let sql = `SELECT * FROM game_running_roulette  order by playedTime desc limit 6 `;
    let    responseData = await db.query(sql);
        if (responseData.length > 0) {
  
      return responseData
              
           }
      return "no user data exits"
    } catch (err) {
      //console.log("err",err)
    //debug(err);

  }
};


const PlayerDetails= async (
  playername,
  RoundCount,
   winNo
) => {
  try {
    //console.log("hello");

    var formData1 = {
      playername: playername,
      RoundCount: RoundCount,
      
      winNo: winNo,
    };
    let sql = `SELECT * FROM roulette_playerdetails WHERE playername = ? `;
    let responseData = await db.query(sql, playername);
    /*   if (responseData.length > 0) {
            sql = "UPDATE game_running SET singleNo=?,doubleNo=?,tripleNo=?,Win_singleNo=? WHERE playername =? ";
    
            const userss = await db.query(sql,  [singleNo,doubleNo,tripleNo,Win_singleNo ,playername]);
                
            //console.log(userss);;
             }
         */ // else {
    sql = "INSERT INTO  roulette_playerdetails SET ?";
    const users = await db.query(sql, formData1);
    if (users) {
    }
    return "successfully";
  } catch (err) {
    //console.log("err", err);
    //debug(err);
  }
};


const getAdminroulette = async () => {
 
  try {
    
      let sql = "select * from admin_roulette ";
     let updateResponse = await db.query(sql);
      if (updateResponse.length>0) {
       return updateResponse[0];
      } else{
        return false
      }
   
  } catch (error) {
    //console.log("error",error)
    //debug(error);

  }
};
const WinamountDetails = async (playerId, game_id, point) => {
  try {
    //console.log("hello");

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

      //console.log("databaseupdated", userss);
      //let user1 = await userByEmail(playerId);
     // let result1 = userss[0]["point"];

     // return result1;

      //console.log("WinAmount:-------------------------------", userss);
    } else {
      sql = "INSERT INTO  winpoint_details SET ?";
      const users = await db.query(sql, formData1);
      if (users) {
      }
      return "successfully";
    }
  } catch (err) {
    //console.log("err", err);
    //debug(err);
  }
};
const GetAllplayer = async () => {
  try {
    var sql = "Select * from isbetplacedroulette";

    const userss = await db.query(sql);
    //console.log(userss);
    return userss;
  } catch (err) {
    //debug(err);
  }
};

module.exports = {
  GetAllplayer,
  
  WinamountDetails,
  getAdminroulette,
  PlayerDetails,
  GetGameHistoryGameRunningData,
  RemoveAllplayer,
  RouletteBets,
  AddPlayerIdInBetplaced,
  onbalance,
  RemovePlayerIdInBetplaced,
  RemoveRouletteBetsAll,
  UpdateGameRunningDataWinSingleNumber,
  Detailroulete,
  UpdateGameRunningDataWinpoint,
  GetPlayerIdInBetplaced,
  GetGameRunningData,
  GameRunning,
  JoinGame,
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
