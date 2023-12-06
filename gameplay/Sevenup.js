"use strict";
const debug = require("debug")("test");
const DB_debug = require("debug")("db");
const service = require("../services/SevnupGameService");
const events = require("../Constants").events;
const commonVar = require("../Constants").commonVar;
const state = require("../Constants").state;
const spot = require("../Constants").spot;
const timerVar = require("../Constants").timerVar;
const gameId = 1;
const gameRoom = require("../Constants").selectGame[gameId];
const CardsSet = require("../Constants").setOfCards;

const botManager = require("../utils/BotManager");
const playerManager = require("../utils/PlayerDataManager");

//json
const chipDataJson = require("../jsonfiles/ChipsData.json");
const RandomWinAmounts = require("../jsonfiles/wins.json");
const { flags } = require("socket.io/lib/namespace");

const LEFT_RIGHT_WIN_RATE = 2;
const MIDDLE_WIN_RATE = 8;

let Sockets;
let gameState;
var global_win=0
let currentRoundData = {}; //this will users bets, playerId and spot
let BetHolder = new Object(); //user bet on each spot sum
let LeftBets = [];
let MiddleBets = [];
let RightBets = [];
let fakeLeftBets; //bot fake bet
let fakeMiddleBets;
let fakeRightBets;

let timeStamp; //as room id(change after 30 sec)
let ROUND_COUNT = 0; //reset to 0 after 5 round

let previousWin_single = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
let NewpreviousWin_single=[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
let playerName = "";
let win_globalifnoBet=-1;
let winPoint = 0;
var flags1=0;
//let singleNoBet = 0;
let doubleNoBet = 0;
var win_global=-1;
let singleNoBet = 0;
let tripleNoBet = 0;
let Win_singleNo = 0;
let Win_TwoNo = 0;
let Win_finalNo=0;
let usersingleNoChoice = -1;
let isbetPlaced=false
let previousWins = new Array(20);
let BotsBetsDetails = []; //Array of 6 bots with amount of bet on each spot (array filled by RegisterBots ↓)
RegisterBots();
SetInitialData();

function GetSocket(SOCKET) {
  Sockets = SOCKET;
  ResetTimers();
}

async function SetInitialData() {
  //THIS WILL RUN ONLY ONCE
  previousWins = await service.lastWinningNo(); //db
  let D = new Date();
  timeStamp = D.getTime();
}

function StartGame(data) {
  SendCurrentRoundInfo(data);
  //OnChipMove(data);
  OnBetsPlaced(data);
  OnWinAmount(data);
  //OnWinNo(data);
  //OnDissConnected(data);
  gameHistoryRecord(data);
  OnleaveRoom(data);
  OnTest(data);
}

function OnleaveRoom(data) {
  let socket = data[commonVar.socket];
  socket.on(events.onleaveRoom, function (data) {
    try {
      socket.leave(gameRoom);
      socket.removeAllListeners(events.OnChipMove);
      socket.removeAllListeners(commonVar.test);
      socket.removeAllListeners(events.onleaveRoom);
      socket.removeAllListeners(events.OnBetsPlaced);
      socket.removeAllListeners(events.OnCurrentTimer);
      socket.removeAllListeners(events.OnWinNo);

      socket.removeAllListeners(events.OnHistoryRecord);
      playerManager.RemovePlayer(socket.id);
      socket.emit(events.onleaveRoom, {
        success: `successfully leave ${gameRoom} game.`,
      });
    } catch (err) {
      debug(err);
    }
  });
}

//Game events
function OnBetsPlaced(data) {
  let socket = data[commonVar.socket];
  socket.on(events.OnBetsPlaced, async (data) => {
    // socket.to(gameRoom).emit(events.OnChipMove, data);
    var userBalance = await service.onbalance(data.playerId);
    if (
      userBalance[0].point >=
      data.bet_amount_two_six +
        data.bet_amount_seven +
        data.bet_amount_eight_twelve 
        ){
    console.log("bet request", data);
    await service.AddPlayerIdInBetplaced(data.playerId);

    // singleNoBet = data.betValue;
    singleNoBet = data.bet_amount_two_six;
    doubleNoBet = data.bet_amount_seven;
    tripleNoBet = data.bet_amount_eight_twelve;
    isbetPlaced=true
    var array=[]
    array.push(data.bet_amount_two_six)
    array.push(data.bet_amount_seven)
    array.push(data.bet_amount_eight_twelve)
   
   let arrayIndex =array.indexOf(Math.min(...array))
   /*  if(arrayIndex==0){
      Win_finalNo=5
      Win_singleNo=3
      Win_TwoNo=2
    }else if(arrayIndex==1){
      Win_finalNo=7
      Win_singleNo=2
      Win_TwoNo=5
    
    }else{
      Win_finalNo=12
      Win_singleNo=6
      Win_TwoNo=6
    
    }
 */
    playerName = data.playerId;

    // usersingleNoChoice = data.colorCode;
    usersingleNoChoice = data.category;

    let point = await service.getUserPoint(
      data.playerId,
      data.bet_amount_two_six +
        data.bet_amount_seven +
        data.bet_amount_eight_twelve
    );
    console.log("Point", point);

 await service.SevenupBets(
       data.bet_amount_two_six ,
        data.bet_amount_seven ,
        data.bet_amount_eight_twelve
    );
   

    var SevenbetsResult = await service.DetailSevenup();
    console.log("DetailSevenup", SevenbetsResult);
    if (SevenbetsResult.two_six < SevenbetsResult.seven && SevenbetsResult.two_six  <  SevenbetsResult.eight_twelve) {
      Win_finalNo = 6;
    } 
    if(SevenbetsResult.seven <  SevenbetsResult.eight_twelve &&SevenbetsResult.seven  <  SevenbetsResult.two_six) {
      Win_finalNo = 7;
    }

    if(SevenbetsResult.eight_twelve <  SevenbetsResult.two_six&&SevenbetsResult.eight_twelve < SevenbetsResult.seven) {
      Win_finalNo = 12;
    }



    let Game = await service.GameRunning(
      data.playerId,
      ROUND_COUNT,
      singleNoBet,
      doubleNoBet,
      tripleNoBet,
      Win_finalNo,
    );
    console.log("Game", Game);

 if (
      data.bet_amount_two_six +
        data.bet_amount_seven +
        data.bet_amount_eight_twelve ==
      0
    ) {
      /* && data.doubleNo.length==0 && data.triple.length==0) */ socket.emit(
        events.OnBetsPlaced,
        {
          status: 400,
          message: "Bet not Confirmed",
          data: {
            playerId: data.playerId,
            balance:
              point -
              (data.bet_amount_two_six +
                data.bet_amount_seven +
                data.bet_amount_eight_twelve),
          },
        }
      );
    } else {
      socket.emit(events.OnBetsPlaced, {
        status: 200,
        message: "Bet Confirmed",
        data: {
          playerId: data.playerId,
          balance:
            point -
            (data.bet_amount_two_six +
              data.bet_amount_seven +
              data.bet_amount_eight_twelve),
        },
      });
    }
  
 }


 else {
  socket.emit(events.OnBetsPlaced, {
    status: 200,
    message: "insufficient balance ,Please add balance to your account",
    data: {
      playerId: data.playerId,
    },
  });
}




});
}








 async function OnWinNo(data) {
//  let socket = data[commonVar.socket];
  //socket.on("OnWinNo", async (data) => {
    var Win_singleNo=0;
   var adminWin= await service.getAdmin7up()
   console.log("adminWin",adminWin)
    var playerId = data.playerId;
    var RoundCount = ROUND_COUNT;
    var game_id=1;
    var previousWin_single = previousWin_single;
    //var Balance= result2[0].point;
    var isplayerexist = await service.GetPlayerIdInBetplaced(data.playerId);
    if (isplayerexist == true) {
      let Game = await service.GetGameRunningData(data.playerId);
      if (Game == "no user data exits") {
        socket.emit("OnWinNo", { message: "no user data exits" });
      } else {
        var SevenbetsResult = await service.DetailSevenup();
        console.log("DetailSevenup", SevenbetsResult);
        if (SevenbetsResult.two_six <= SevenbetsResult.seven && SevenbetsResult.two_six <= SevenbetsResult.eight_twelve) {
          Win_finalNo = 6;
        } 
        if(SevenbetsResult.seven <=  SevenbetsResult.eight_twelve &&SevenbetsResult.seven  <= SevenbetsResult.two_six) {
          Win_finalNo = 7;
        }
    
        if(SevenbetsResult.eight_twelve <=  SevenbetsResult.two_six&&SevenbetsResult.eight_twelve <=  SevenbetsResult.seven) {
          Win_finalNo = 12;
        }
        global_win=Win_finalNo
        console.log("Win_finalNo", Win_finalNo,global_win);
        if(
          adminWin.value1==-1&&adminWin.value2==-1)
        {
          /* if (win_global != -1) {
            Win_finalNo = win_global;
          } else {
            win_global = Win_finalNo;
            Win_finalNo = win_global;
          } */
          if(NewpreviousWin_single[NewpreviousWin_single.length-1]!=Win_finalNo){
            NewpreviousWin_single.push(Win_finalNo);
    
    
          }
    
         // NewpreviousWin_single.push(Win_finalNo);
        
          console.log("Win_singleNo",Win_finalNo)
          await service.UpdateGameRunningDataWinSingleNumber(data.playerId,Game.playerTime,Win_finalNo)
         
          /* await service.RemoveDragonVsTigerBetOfUser(
            Game.singleNo,
            Game.tripleNo
          );
           */
          if (Win_finalNo == 6) {
            var random=Math.floor(Math.random() * 5)+1
            var wintype="Down"
            let Game1 = await service.UpdateGameRunningDataWinpoint(
              data.playerId,
              Game.playerTime,
              Game.singleNo * 1.9
            );
           /*  let point = await service.updateUserPoint(
              data.playerId,
              Game.singleNo * 2.2
            );
            console.log("Points", point); */
            await service.PlayerDetails(data.playerId,ROUND_COUNT,Win_finalNo-random,random,wintype)
            await service.WinamountDetails(data.playerId,game_id,Game.singleNo * 1.9)
         //   await service.RemovePlayerIdInBetplaced(data.playerId);
  
          /*   socket.emit("OnWinNo", {
              message: "two_six wins",
              winPoint: Game.singleNo * 2.2,
              winNo: [Win_finalNo-random,random],
              playerId: data.playerId,
              RoundCount: ROUND_COUNT,
              previousWin_single: previousWin_single,
              //Balance: point,
            });
 */    SuffleBots();
  
          }
          if (Win_finalNo == 7) {
           var random=Math.floor(Math.random() * 5)+1
            var wintype="Seven"
            let Game2 = await service.UpdateGameRunningDataWinpoint(
              data.playerId,
              Game.playerTime,
              Game.doubleNo * 4.8
            );
           /*  let point = await service.updateUserPoint(
              data.playerId,
              Game.tripleNo * 5.5
            );
            console.log("Points", point);
            */ 
            await service.PlayerDetails(data.playerId,ROUND_COUNT,Win_finalNo-random,random,wintype)
            await service.WinamountDetails(data.playerId,game_id, Game.doubleNo * 4.8)
  
         //  await service.RemovePlayerIdInBetplaced(data.playerId);
  
           /*  socket.emit("OnWinNo", {
              message: "7 wins",
              winPoint: Game.doubleNo * 5.5,
              winNo: [Win_finalNo-random,random],
              playerId: data.playerId,
              RoundCount: ROUND_COUNT,
              previousWin_single: NewpreviousWin_single,
            //  Balance: point,
            }); */
    SuffleBots();
  
          }
          if (Win_finalNo == 12) {
            var random=Math.floor(Math.random() * 5)+1
          var  wintype="Up"
            let Game2 = await service.UpdateGameRunningDataWinpoint(
              data.playerId,
              Game.playerTime,
              Game.tripleNo * 1.9,
            );
           /*  let point = await service.updateUserPoint(
              data.playerId,
              Game.tripleNo * 2.2
            );
            console.log("Points", point);
  
            */
            await service.PlayerDetails(data.playerId,ROUND_COUNT,Win_finalNo-random,random,wintype)
            await service.WinamountDetails(data.playerId,game_id,Game.tripleNo * 1.9)
           
           
           // await service.RemovePlayerIdInBetplaced(data.playerId);
  
           /*  socket.emit("OnWinNo", {
              message: "8 to 12 wins",
              winPoint: Game.tripleNo * 2.2,
              //winNo: [Win_finalNo-8-random,random],
              winNo: [8-random,random],
              
              playerId: data.playerId,
              RoundCount: ROUND_COUNT,
              previousWin_single: NewpreviousWin_single,
             // Balance: point,
            }); */
    SuffleBots();
  
          }
        }
        else{
           Win_finalNo =adminWin.value1+adminWin.value2
         /*  if (win_global != -1) {
            Win_finalNo = win_global;
          } else {
            win_global = Win_finalNo;
            Win_finalNo = win_global;
          }
          */ if(NewpreviousWin_single[NewpreviousWin_single.length-1]!=Win_finalNo){
            NewpreviousWin_single.push(Win_finalNo);
    
    
          }
    
         // NewpreviousWin_single.push(Win_finalNo);
        
          console.log("Win_singleNo",Win_finalNo)
          await service.UpdateGameRunningDataWinSingleNumber(data.playerId,Game.playerTime,Win_finalNo)
         
          /* await service.RemoveDragonVsTigerBetOfUser(
            Game.singleNo,
            Game.tripleNo
          );
           */
          if (Win_finalNo <= 6) {
            var random=Math.floor(Math.random() * 5)+1
            var wintype="Down"
            let Game1 = await service.UpdateGameRunningDataWinpoint(
              data.playerId,
              Game.playerTime,
              Game.singleNo * 1.9
            );
           /*  let point = await service.updateUserPoint(
              data.playerId,
              Game.singleNo * 2.2
            );
            console.log("Points", point); */
            await service.PlayerDetails(data.playerId,ROUND_COUNT,adminWin.value1,adminWin.value2,wintype)
            await service.WinamountDetails(data.playerId,game_id,Game.singleNo * 1.9)

           // await service.RemovePlayerIdInBetplaced(data.playerId);
  
           /*  socket.emit("OnWinNo", {
              message: "two_six wins",
              winPoint: Game.singleNo * 2.2,
              winNo: [adminWin.value1,adminWin.value2],
              playerId: data.playerId,
              RoundCount: ROUND_COUNT,
              previousWin_single: previousWin_single,
              //Balance: point,
            }); */
    SuffleBots();
  
          }
          if (Win_finalNo == 7) {
           var random=Math.floor(Math.random() * 5)+1
            var wintype="Seven"
            let Game2 = await service.UpdateGameRunningDataWinpoint(
              data.playerId,
              Game.playerTime,
               Game.doubleNo * 4.8
            );
           /*  let point = await service.updateUserPoint(
              data.playerId,
               Game.doubleNo * 5.5
            );
            console.log("Points", point);
            */ 
            await service.PlayerDetails(data.playerId,ROUND_COUNT,adminWin.value1,adminWin.value2,wintype)
            await service.WinamountDetails(data.playerId,game_id, Game.doubleNo * 4.8)
  
          // await service.RemovePlayerIdInBetplaced(data.playerId);
  
           /*  socket.emit("OnWinNo", {
              message: "7 wins",
              winPoint:  Game.doubleNo * 5.5,
              winNo: [adminWin.value1,adminWin.value2],
              playerId: data.playerId,
              RoundCount: ROUND_COUNT,
              previousWin_single: NewpreviousWin_single,
             // Balance: point,
            }); */
    SuffleBots();
  
          }
          if (Win_finalNo>=8 && Win_finalNo<= 12) {
            var random=Math.floor(Math.random() * 5)+1
          var  wintype="Up"
            let Game2 = await service.UpdateGameRunningDataWinpoint(
              data.playerId,
              Game.playerTime,
              Game.tripleNo * 1.9,
            );
           /*  let point = await service.updateUserPoint(
              data.playerId,
              Game.tripleNo * 2.2
            );
            console.log("Points", point);
  
            */
            await service.PlayerDetails(data.playerId,ROUND_COUNT,adminWin.value1,adminWin.value2,wintype)
await service.WinamountDetails(data.playerId,game_id, Game.tripleNo * 1.9)
           
        //    await service.RemovePlayerIdInBetplaced(data.playerId);
  
          /*   socket.emit("OnWinNo", {
              message: "8 to 12 wins",
              winPoint: Game.tripleNo * 2.2,
              winNo: [adminWin.value1,adminWin.value2],
              
              playerId: data.playerId,
              RoundCount: ROUND_COUNT,
              previousWin_single: NewpreviousWin_single,
              //Balance: point,
            }); */
    SuffleBots();
  
          }
        }
     
        //    socket.emit("OnWinNoResult",{message:Game})
      }
    } 

    //  console.log("Game", Game);
}












/* function OnWinAmount(data) {
  let socket = data[commonVar.socket];
  socket.on(events.OnWinAmount, async (data) => {
    console.log("winAmount hit", data);
    await service.updateUserPoint(data.playerId, data.win_points);
    socket.emit(events.OnWinAmount, {
      win_no: Win_singleNo,
      RoundCount: ROUND_COUNT,
      win_point: winPoint,
      playerId: playerName,
    });
  });
}
 */



function OnWinAmount(data) {
  let socket = data[commonVar.socket];
  socket.on(events.OnWinAmount, async (data) => {
    console.log("winAmount hit", data);
  //  await service.updateUserPoint(data.playerId, data.win_points);
  let point = await service.updateUserPoint(
    data.playerId,
   // Game.singleNo * 2.2
   //data.point
   data.winpoint,
  );
  console.log("Points", point);
    socket.emit(events.OnWinAmount, {
      /* win_no: Win_singleNo,
      RoundCount: ROUND_COUNT,
  */    // win_point: data.winpoint,
  Balance:point,
      playerId: data.playerId,
      message:"point added in user account"
    });
  });
}

async function addPlayerToRoom(data) {
  let socket = data[commonVar.socket];
  let balance = await service.getUserBalance(data.playerId); //db
  let obj = {
    socketId: socket.id,
    balance, //this value will come from database
    avatarNumber: 0, //this value wil come from frontend
    playerId: data.playerId, //this value will come from database
  };
  playerManager.AddPlayer(obj);
  return obj;
}

function OnDissConnected(data) {
  let socket = data[commonVar.socket];
  socket.on("disconnect", (data) => {
    debug("player got dissconnected " + socket.id);
    playerManager.RemovePlayer(socket.id);
  });
}

async function SendCurrentRoundInfo(data) {
  let socket = data[commonVar.socket];
  let timer = 0;

  switch (gameState) {
    case state.canBet:
      timer = i;
      break;
    case state.cannotBet:
      timer = j;
      break;
    case state.wait:
      timer = k;
      break;
  }

  let player = await addPlayerToRoom(data);

  let obj = {
    gametimer: i,
RoundCount:ROUND_COUNT,
    // timer,
    // gameState,
    // socketId : player.socketId,
    previousWins: previousWin_single,
    botsBetsDetails: BotsBetsDetails,

    balance: player.balance,
  };

  socket.emit(events.OnCurrentTimer, obj);
}

//Game History Record=====================================================================
function gameHistoryRecord(data) {
  let socket = data[commonVar.socket];
  socket.on(events.OnHistoryRecord, async function (data) {
    let matrixRecord = await service.gameMartixRecords();
    let slotRecord = await service.gameSlotRecords();
      //socket.emit(events.OnHistoryRecord, { matrixRecord, slotRecord });
let historydetail= await service.GetGameHistoryGameRunningData();
console.log("GetGameHistoryGameRunningData",historydetail)
var history=[]
historydetail.forEach((iteam) => {
  history.push(iteam.Win_finalNo)
});
console.log("history",history)
    socket.emit(events.OnHistoryRecord, { matrixRecord: history });
  });
}
//====================================END=================================================

//On Chip Move =>Save all user Bet==================================================

function OnChipMove(D) {
  let socket = D[commonVar.socket];
  socket.on(events.OnChipMove, (data) => {
    AddBalanceToDatabase(data);
    switch (data[commonVar.spot]) {
      case spot.left:
        LeftBets.push(data[commonVar.chip]);
        break;
      case spot.middle:
        MiddleBets.push(data[commonVar.chip]);
        break;
      case spot.right:
        RightBets.push(data[commonVar.chip]);
        break;
      default:
        break;
    }

    let obj = {
      chip: data[commonVar.chip],
      position: data[commonVar.position],
    };
    if (currentRoundData[data[socket.id]] === undefined) {
      currentRoundData[data[socket.id]] = {
        //following are the spots
        0: [], //left bets
        1: [], //middle bets
        2: [], //right bets
        playerId: data[commonVar.playerId],
      };
      currentRoundData[data[socket.id]][data[commonVar.spot]].push(obj);
    } else {
      currentRoundData[data[socket.id]][data[commonVar.spot]].push(obj);
    }

    //this will help add bets
    if (BetHolder[socket.id] === undefined) {
      let Obj = {
        0: 0, //left bet
        1: 0, //middle bet
        2: 0, //right bet
        win: 0,
        playerId: data[commonVar.playerId],
        socket,
      };

      BetHolder[socket.id] = Obj;
      BetHolder[socket.id][data[commonVar.spot]] = data[commonVar.chip];
    } else {
      BetHolder[socket.id][data[commonVar.spot]] += data[commonVar.chip];
    }

    socket.to(gameRoom).emit(events.OnChipMove, data);
  });
}

async function AddBalanceToDatabase(data) {
  data[commonVar.gameId] = gameId;
  const saveBet = await service.JoinGame(data, timeStamp); //db
}

//End On Chip Move =>Save all user Bet ==============================================

//On OnSendWinNo =>Calcuate game Winning No when j==8 ======================================

async function OnSendWinNo() {
  let result = await WinNosCalculator();
  let winNo = result.winNo;
  let winningSpot = result.spot;
  let singleNo = result.singleNo;

  let winPoint = result.win_point;

  let data = {
    room_id: timeStamp,
    game_id: 1,
    winNo1: winNo[0],
    winNo2: winNo[1],
    spot: winningSpot,
  };
  let WinningCards = createWinningCards(winNo);

  const saveWinningNo = await service.updateWinningNo(data); //db

  // //ADD WIN NO TO ARRAY
  previousWins = PushWinNo(winningSpot);
  //debug(`L :${fakeLeftBets}, M : ${fakeMiddleBets}, R :${fakeRightBets}`);

  CalculateBotsWinAmount(winningSpot);
  await PlayersWinAmountCalculator(winningSpot);
  let RandomWinAmount =
    RandomWinAmounts[Math.floor(GetRandomNo(0, RandomWinAmounts.length))];
  //debug("random win no:" + RandomWinAmount);
  usersingleNoChoice = [];

  if (playerName != "") {
    var result2 = await service.onbalance(playerName);
  } else {
    var result2 = [{ point: 0 }];
  }

  //var arstr =["00","0","1","2","3","4","5","6"," 7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22"," 23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36"]
  Sockets.to(gameRoom).emit(events.OnWinNo, {
    RoundCount: ROUND_COUNT,
    playerId: playerName,
    // winNo: singleNo,

    winNo,
    previousWin_single: previousWin_single,
    winPoint: winPoint,
    Balance: result2[0].point,
  });

  SuffleBots();
}

function createWinningCards(cards) {
  let andarCardType = generateRandomNo(CardsSet.Zero, CardsSet.Three);
  let baharCardType = generateRandomNo(CardsSet.Zero, CardsSet.Three);
  let winCardArr = [
    { card: cards[0], type: andarCardType },
    { card: cards[1], type: baharCardType },
  ];
  return winCardArr;
}

async function WinNosCalculator() {
  let totalLeftBets = SumOfARRAY(LeftBets) * 2;
  let totalMiddleBets = SumOfARRAY(MiddleBets) * 8;
  let totalRightBets = SumOfARRAY(RightBets) * 2;

  let winNo;
  let leastBetSpot;

  let bets = [totalLeftBets, totalMiddleBets, totalRightBets];

  if (totalLeftBets === totalMiddleBets && totalMiddleBets === totalRightBets) {
    leastBetSpot = Math.floor(Math.random() * 2); //caculate random no form 2 to 12
    winNo = generateSpotWinningNo(leastBetSpot);
    leastBetSpot = Math.floor(Math.random() * 2); // for winning spot 2 to 12
  } else {
    let leastBet = Math.min.apply(Math, bets); //minimum amount bet
    leastBetSpot = bets.indexOf(leastBet); //minimum  bet amount spot
    winNo = generateSpotWinningNo(leastBetSpot);
    leastBetSpot = Math.floor(Math.random() * 2); // for winning spot 2 to 12
  } if(isbetPlaced==false)
  {
  Win_singleNo = Math.floor(Math.random() * 6) + 1; ///Dice 1
  Win_TwoNo = Math.floor(Math.random() * 6) + 1; ////Dice 2
  
//Win_finalNo=Win_singleNo+Win_TwoNo
  }
  isbetPlaced=false
  previousWin_single.pop;

  previousWin_single.push(Win_finalNo);

  //previousWin_single.push(Win_TwoNo);

  winPoint = 0;
  /* --------------------CartegoriesTypes Bets---------------------------*/
  if (
    singleNoBet != 0 &&
    [2, 3, 4, 5, 6].indexOf(Win_finalNo) != -1
  ) {
    winPoint = winPoint + singleNoBet * 2.2; //kitn lgn hai******** 2 to 6 ke liye
  }

  if (doubleNoBet != 1 && Win_finalNo == 7) {
    winPoint = winPoint + doubleNoBet * 5.5; //kitn lgn hai********  7 ke
  }
  if (
    tripleNoBet != 2 &&
    [8, 9, 10, 11, 12].indexOf(Win_finalNo) != -1
  ) {
    winPoint = winPoint + tripleNoBet * 2.2; //kitn lgn hai**** 8to 12 ke
  }
  console.log("Dice sum", Win_finalNo);
  usersingleNoChoice = -1;
  singleNoBet = 0;
  tripleNoBet = 0;
  doubleNoBet = 0;

  if (playerName != "") {
    await service.addwinningpoint(playerName, winPoint);
  } //db

  return {
    win_point: winPoint,
    singleNo: Win_finalNo,
    winNo: [Win_singleNo, Win_TwoNo],
    spot: leastBetSpot,
  };
}

function generateSpotWinningNo(leastBetSpot) {
  let win1;
  let win2;
  switch (leastBetSpot) {
    case spot.left:
      win1 = Math.floor(GetRandomNo(2, 12));
      win2 = Math.floor(GetRandomNo(1, win1));
      break;
    case spot.middle:
      win1 = Math.floor(GetRandomNo(1, 10));
      win2 = win1;
      break;
    case spot.right:
      win2 = Math.floor(GetRandomNo(2, 12));
      win1 = Math.floor(GetRandomNo(1, win2));
      break;
    default:
      break;
  }
  return [win1, win2];
}

function SumOfARRAY(array) {
  return array.reduce(function (a, b) {
    return a + b;
  }, 0);
}
function GetRandomNo(min, max) {
  return Math.random() * (max - min) + min;
}

function PushWinNo(leastBetSpot) {
  if (previousWins != undefined) {
    previousWins.shift();
    previousWins.push(leastBetSpot);
    return previousWins;
  }
}

//OnSendWinNo=================================END============================================

//OnwinningAmount =>Calcuate winning Amount  =================================================

function CalculateBotsWinAmount(winningSpot) {
  for (let i = 0; i < BotsBetsDetails.length; i++) {
    //reset win no to zero
    let win = 0;
    if (winningSpot == 0) {
      BotsBetsDetails[i].win = BotsBetsDetails[i].left * LEFT_RIGHT_WIN_RATE;
      BotsBetsDetails[i].balance +=
        BotsBetsDetails[i].left * LEFT_RIGHT_WIN_RATE;
      win = BotsBetsDetails[i].left * LEFT_RIGHT_WIN_RATE;
    } else if (winningSpot === 1) {
      BotsBetsDetails[i].win = BotsBetsDetails[i].middle * MIDDLE_WIN_RATE;
      BotsBetsDetails[i].balance += BotsBetsDetails[i].middle * MIDDLE_WIN_RATE;
      win = BotsBetsDetails[i].middle * MIDDLE_WIN_RATE;
    } else {
      BotsBetsDetails[i].win = BotsBetsDetails[i].right * LEFT_RIGHT_WIN_RATE;
      BotsBetsDetails[i].balance +=
        BotsBetsDetails[i].right * LEFT_RIGHT_WIN_RATE;
      win = BotsBetsDetails[i].right * LEFT_RIGHT_WIN_RATE;
    }

    if (win === 0) {
      BotsBetsDetails[i].win = -(
        BotsBetsDetails[i].left +
        BotsBetsDetails[i].middle +
        BotsBetsDetails[i].right
      );
    }
  }
}

async function PlayersWinAmountCalculator(winningSpot) {
  for (let socketId in BetHolder) {
    let betData = BetHolder[socketId];

    if (winningSpot === 0) {
      betData[commonVar.win] = betData[0] * LEFT_RIGHT_WIN_RATE;
    } else if (winningSpot === 1) {
      betData[commonVar.win] = betData[1] * MIDDLE_WIN_RATE;
    } else {
      betData[commonVar.win] = betData[2] * LEFT_RIGHT_WIN_RATE;
    }

    BetHolder[socketId] = betData;

    // let winAmount = betData[commonVar.win] - (betData[0]+betData[1]+betData[2])
    // betData[commonVar.socket].emit(events.OnPlayerWin,{winAmount});

    if (betData[commonVar.win] > 0) {
      let winAmount =
        betData[commonVar.win] -
        betData[commonVar.win] * commonVar.adminCommisionRate;
      debug(
        "player " + betData[commonVar.playerId] + ` wins amount ${winAmount}`
      );
      betData[commonVar.socket].emit(events.OnPlayerWin, { winAmount });
    } else {
      debug(
        `player ${betData[commonVar.playerId]} lost ${
          betData[0] + betData[1] + betData[2]
        } `
      );
    }
  }

  //$- Add bet info to Database
  const playerWiningBalance = await service.updateWinningAmount({
    spot: winningSpot,
    room_id: timeStamp,
  });
  debug("Player bet info:");
  BetHolder = new Object();
}
//End OnwinningAmount =========================END============================================

//Create a bot, place and save bot bets=================================================================
const MAX_CHIPS_DATA = chipDataJson.length;
const MAX_BOTS_ON_SCREEN = 6;
const MAX_ITERATION = 8;
const Min_Wait_Time = 0.5;
const Max_Wait_Time = 2.5;
const BOT_CHIP_LIMIT = 500;
const MAX_TIME_BOTS_CAN_PLACE_BETS_IN_SINGLE_ROUND = 2;

function RegisterBots() {
  // register new bots only
  return new Promise(function (myResolve, myReject) {
    BotsBetsDetails = [];
    for (let i = 0; i < botManager.GetBots(gameId).length; i++) {
      let botBetTemplate = {
        name: "",
        left: 0, //this is left bets
        middle: 0, //this is middle bets
        right: 0, //this is right bets
        balance: 0, //this will assign just before the loops starts
        win: 0,
        avatarNumber: 0,
      };
      let botObj = botManager.GetBots(gameId)[i];
      botBetTemplate.balance = botObj.balance;
      botBetTemplate.name = botObj.name;
      botBetTemplate.avatarNumber = botObj.avatarNumber;
      BotsBetsDetails.push(botBetTemplate);
    }
  });
}

/*
 * Here  we add dulicate bets by bots
 * update bots balance and save bot bet on each spot
 * in BotsBetsDetails Array
 */
async function SendBotData() {
  let _leftBets = 0;
  let _middleBets = 0;
  let _rightBets = 0;
  let _botsBetCount = 0;
  while (!isTimeUp) {
    //this array contain random no from 0 to MAX_BOTS_DATA
    //this random number will used in frontent for bots
    let fakeOnlinePlayersBets = [];
    //SET BETS FOR ONLINE PLAYERS
    //IT WILL SHOW IN FRONTENT THAT ONLINE PLAYERS IS BETTING
    for (let i = 0; i < MAX_ITERATION; i++) {
      if (isTimeUp) break;
      let randomNO = Math.floor(GetRandomNo(0, MAX_CHIPS_DATA));
      fakeOnlinePlayersBets.push(randomNO);

      let spot = chipDataJson[randomNO].spot;
      let chip = chipDataJson[randomNO].chip;
      switch (spot) {
        case 0:
          _leftBets += chip;
          break;
        case 1:
          _middleBets += chip;
          break;
        case 2:
          _rightBets += chip;
          break;
        default:
          break;
      }
    }

    let botsBetHolder = [];

    let temp = {};
    let bots = Math.floor(GetRandomNo(0, MAX_BOTS_ON_SCREEN));
    _botsBetCount++;
    //SET BETS FOR BOTS
    if (_botsBetCount > MAX_TIME_BOTS_CAN_PLACE_BETS_IN_SINGLE_ROUND) {
      for (let i = 0; i < bots; i++) {
        if (isTimeUp) break;

        let botIndex = Math.floor(GetRandomNo(0, MAX_BOTS_ON_SCREEN));

        let dataIndex = Math.floor(GetRandomNo(0, MAX_CHIPS_DATA));
        while (chipDataJson[dataIndex].chip > BOT_CHIP_LIMIT) {
          dataIndex = Math.floor(GetRandomNo(0, MAX_CHIPS_DATA));
        }
        let botData = {
          botIndex, //this is just to identify bot on frontend
          dataIndex, //this will identify the index of chipdata index
        };

        botsBetHolder.push(botData);
        let spot = chipDataJson[dataIndex].spot;
        let chip = chipDataJson[dataIndex].chip;
        //this will only get from the fist six bots
        temp[i] = chipDataJson[dataIndex];
        BotsBetsDetails[botIndex].balance -= chip;
        switch (spot) {
          case 0:
            _leftBets += chip;
            BotsBetsDetails[botIndex].left += chip;
            break;
          case 1:
            _middleBets += chip;
            BotsBetsDetails[botIndex].middle += chip;
            break;
          case 2:
            _rightBets += chip;
            BotsBetsDetails[botIndex].right += chip;
            break;
          default:
            break;
        }
      }
    }

    Sockets.to(gameRoom).emit(events.OnBotsData, {
      onlinePlayersBets: fakeOnlinePlayersBets,
      botsBets: botsBetHolder,
    });
    let waitFor = GetRandomNo(Min_Wait_Time, Max_Wait_Time) * 500;
    await sleep(waitFor);
  }
  //debug(BotsBetsDetails);
  fakeLeftBets = _leftBets;
  fakeMiddleBets = _middleBets;
  fakeRightBets = _rightBets;
}

function ResetBotsBets() {
  for (let i = 0; i < BotsBetsDetails.length; i++) {
    BotsBetsDetails[i].left = 0;
    BotsBetsDetails[i].middle = 0;
    BotsBetsDetails[i].right = 0;
  }
}

async function SuffleBots() {
  if (ROUND_COUNT % 5 === 0) {
    botManager.SuffleBots(gameId);
    await sleep(5);
    //register bots again
    RegisterBots();
  }
}

//Create a bot and player bot===================END=====================================================

//game timers------------------------------------------

//helper functions
let i = timerVar.bettingsevenup;
let j = timerVar.betCalculationTimer;
let k = timerVar.waitTimer;
let isTimeUp = false;
let canPlaceBets = true;

 async function ResetTimers() {
  let D = new Date();
  timeStamp = D.getTime();

  //  ROUND_COUNT = (ROUND_COUNT === 5) ? 0 : ++ROUND_COUNT;
  ROUND_COUNT = ROUND_COUNT + 1;
flags1=0;
  i = timerVar.bettingsevenup;
  j = timerVar.betCalculationTimer;
  k = timerVar.waitTimer;

  LeftBets = [];
  MiddleBets = [];
  RightBets = [];

  ResetBotsBets();
 
  Sockets.to(gameRoom).emit(events.OnTimerStart, { result: i });
  debug("betting...");
  isTimeUp = false;
  OnTimerStart();
  SendBotData();
}

async function OnTimerStart() {
  gameState = state.canBet;
  canPlaceBets = true;
  i--;

  //this will help to stop bots betting just before the round end
  if (i === 2) isTimeUp = true;

  if (i == 0) {
    
    await sleep(timerVar.intervalDalay);
    debug("timeUp...");
    Sockets.to(gameRoom).emit(events.OnTimeUp);
    
    isTimeUp = true;
    OnTimeUp();

    return;
  }
  await sleep(timerVar.delay);
  OnTimerStart();
  //SendBotData();
}

async function OnTimeUp() {
  canPlaceBets = false;
  gameState = state.cannotBet;

  j--;

 // if (j === 8) OnSendWinNo();
 if (j === 8) {
  var playerData=await service.GetAllplayer()
  console.log(playerData)
   playerData.forEach(item => {
    OnWinNo({playerId:item.playerId})
  });
 
  // for(var index=0;index<playerData.length;index++){
    // await OnWinNo({playerId:playerData[index].playerId})

  //  }
 
  if(playerData.length>0){  

var SevenbetsResult = await service.DetailSevenup();
        console.log("DetailSevenup", SevenbetsResult);
        if (SevenbetsResult.two_six <= SevenbetsResult.seven && SevenbetsResult.two_six <= SevenbetsResult.eight_twelve) {
          Win_finalNo = 6;
        } 
        if(SevenbetsResult.seven <=  SevenbetsResult.eight_twelve &&SevenbetsResult.seven  <= SevenbetsResult.two_six) {
          Win_finalNo = 7;
        }
    
        if(SevenbetsResult.eight_twelve <=  SevenbetsResult.two_six&&SevenbetsResult.eight_twelve <=  SevenbetsResult.seven) {
          Win_finalNo = 12;
        }
        global_win=Win_finalNo
        
    var adminWin= await service.getAdmin7up()
console.log(adminWin,"adminWin")
    if(
      adminWin.value1==-1&&adminWin.value2==-1)
    {
      console.log("important",global_win)
  //    global_win=adminWin.value1+adminWin.value2
      if (global_win == 6) {
        var random=Math.floor(Math.random() * 5)+1
        var wintype="Down"
        /*  Sockets.emit("OnWinNo", { */
Sockets.to(gameRoom).emit(events.OnWinNo, {

          message: "two_six wins",
          winNo: [global_win-random,random],
          /* playerId: data.playerId, */
          RoundCount: ROUND_COUNT,
          previousWin_single: previousWin_single,
          //Balance: point,
        });
SuffleBots();

      }
      if (global_win == 7) {
       var random=Math.floor(Math.random() * 5)+1
        var wintype="Seven"
       
       /*  Sockets.emit("OnWinNo", { */
Sockets.to(gameRoom).emit(events.OnWinNo, {

          message: "7 wins",
          winNo: [global_win-random,random],
          /* playerId: data.playerId, */
          RoundCount: ROUND_COUNT,
          previousWin_single: NewpreviousWin_single,
        //  Balance: point,
        }); 
SuffleBots();

      }
      if (global_win == 12) {
        var random=Math.floor(Math.random() * 5)+1
      
       /*  Sockets.emit("OnWinNo", { */
Sockets.to(gameRoom).emit(events.OnWinNo, {

          message: "8 to 12 wins",
          //winNo: [global_win-8-random,random],
          winNo: [8-random,random],
          
          /* playerId: data.playerId, */
          RoundCount: ROUND_COUNT,
          previousWin_single: NewpreviousWin_single,
         // Balance: point,
        }); 
SuffleBots();

      }
    }
    else{
      Win_finalNo =adminWin.value1+adminWin.value2

      Sockets.to(gameRoom).emit(events.OnWinNo, {

        message: " wins",
      //  winPoint: 0,
        winNo: [adminWin.value1,adminWin.value2],
      
        /* playerId: data.playerId, */
        RoundCount: ROUND_COUNT,
        previousWin_single: NewpreviousWin_single,
       // Balance: point,
      });
  
    }

  }
  else{
   // let point = await service.updateUserPoint(data.playerId, 0);
    var winNo = [2,3,4,5,6,7,8,9,10,11,12];
    //NewpreviousWin_single.pop;

   // var Win =winNo[Math.floor(Math.random() * 12)]
   var win1 =Math.floor(Math.random() * 6)+1
   var win2 =Math.floor(Math.random() * 6)+1


    //NewpreviousWin_single.push(Win+win2);
   /*  if (win_globalifnoBet != -1) {
      Win = win_globalifnoBet;
    } else {
      win_globalifnoBet = Win+win2;
      Win = win_globalifnoBet;
    } */
    //NewpreviousWin_single.pop();
    if(NewpreviousWin_single[NewpreviousWin_single.length-1]!=win1+win2){
      NewpreviousWin_single.push(win1+win2);


    }

    //NewpreviousWin_single.push(Win+win2);

    var random=Math.floor(Math.random() * 5)+1

   /*  Sockets.emit("OnWinNo", { */
Sockets.to(gameRoom).emit(events.OnWinNo, {

      message: " wins",
    //  winPoint: 0,
      winNo: [win1,win2],
    
      /* playerId: data.playerId, */
      RoundCount: ROUND_COUNT,
      previousWin_single: NewpreviousWin_single,
     // Balance: point,
    });
 SuffleBots();

  }
  await service.RemoveAllplayer();
    
  await service.Remove7BetAll();
  win_global=-1;
  win_globalifnoBet = -1;

  }

  if (j === 0) {
    //round ended restart the timers
    /*  await sleep(timerVar.intervalDalay);
	        debug("wait...");
	        Sockets.to(gameRoom).emit(events.OnWait);
	        OnWait(); */
    ResetTimers();

    return;
  }
  await sleep(timerVar.delay);
  OnTimeUp();
}

async function OnWait() {
  gameState = state.wait;
  canPlaceBets = false;
  k--;

  if (k == 0) {
    //round ended restart the timers
    await sleep(timerVar.intervalDalay);
    ResetTimers();
    return;
  }
  await sleep(timerVar.delay);
  OnWait();
}

//game timers-----------------END-------------------------

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function generateRandomNo(min, max) {
  //min & max include
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//this even is only for debugging purposes
function OnTest(data) {
  let socket = data[commonVar.socket];
  socket.on(commonVar.test, (data) => {
    //service.updateWinningAmount({ spot:2, room_id:'1628516811811' });
    //SendBotData()
    //OnSendWinNo()
    console.table(BetHolder);
    // console.table(currentRoundData);
  });
}

module.exports.StartGame = StartGame;
module.exports.GetSocket = GetSocket;
