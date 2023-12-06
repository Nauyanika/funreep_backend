"use strict";
const debug = require("debug")("test");
const DB_debug = require("debug")("db");
const service = require("../services/FunTargetService");
const events = require("../Constants").events;
const commonVar = require("../Constants").commonVar;
const state = require("../Constants").state;
const spot = require("../Constants").spot;
const timerVar = require("../Constants").timerVar;
const gameId = 8;
const gameRoom = require("../Constants").selectGame[gameId];
const CardsSet = require("../Constants").setOfCards;

const botManager = require("../utils/BotManager");
const playerManager = require("../utils/PlayerDataManager");

//json
const chipDataJson = require("../jsonfiles/ChipsData.json");
const RandomWinAmounts = require("../jsonfiles/wins.json");

const LEFT_RIGHT_WIN_RATE = 2;
const MIDDLE_WIN_RATE = 8;

let Sockets;
let gameState;
var flags1=0;
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

let previousWin_single = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let NewpreviousWin_single = [0, 1, 2, 3, 4, 5, 6, 7, 8];

let playerName="";
let winX;
let MainwinX;

let winPoint = 0;
let singleNoBet = [];
let singleNoBetAmount = [];
let isbetPlaced=false
let ImageGlobalArr = [];


let Zero=0;
let One=0;
let Two=0;
let Three=0;
let Four=0;
let Five=0;
let Six=0;
let Seven=0;
let Eight=0;
let Nine=0;


var win_global = -1;
var win_globalifnoBet = -1;







let Win_singleNo = 0;
let Win_TwoNo = 0;

let usersingleNoChoice = -1;

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

function StartFunTargetGame(data) {
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
      socket.removeAllListeners(events.OnWinNo);
      socket.removeAllListeners(events.OnTimeUp);
      socket.removeAllListeners(events.OnTimerStart);
      socket.removeAllListeners(events.OnCurrentTimer);

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
/* function OnBetsPlaced(data) {
  let socket = data[commonVar.socket];
  socket.on(events.OnBetsPlaced, async (data) => {
    // socket.to(gameRoom).emit(events.OnChipMove, data);
    console.log("bet request", data);
    singleNoBet = data.BetsValue;
    singleNoBetAmount = data.BetsAmount;
    isbetPlaced=true
    var array=[]
   // array.push(data.BetsValue)
    array=data.BetsAmount
   if(array.length>0){
    Win_singleNo =data.BetsValue[(array.indexOf(Math.min(...array)))]
   }
   else{
    Win_singleNo=Math.floor(Math.random() * 10);

   }
    playerName = data.playerId;

    // usersingleNoChoice = data.colorCode;
    //  usersingleNoChoice = data.category;

    let point = await service.getUserPoint(data.playerId, data.balance);
    console.log("Point", point);

    if (data.BetsValue.length == 0) {
       socket.emit(
        events.OnBetsPlaced,
        {
          status: 400,
          message: "Bet not Confirmed",
          data: { playerId: data.playerId, balance: point - data.balance },
        }
      );
    } else {
      socket.emit(events.OnBetsPlaced, {
        status: 200,
        message: "Bet Confirmed",
        data: { playerId: data.playerId, balance: point - data.balance },
      });
    }
  });
}
 */

function OnBetsPlaced(data) {
  let socket = data[commonVar.socket];
  socket.on("OnBetsPlaced", async (data) => {
    // usersingleNoChoice = data.category;
    console.log(data,"userbet")

    var userBalance = await service.onbalance(data.playerId);
    console.log(userBalance,"user")
    if (
      userBalance[0].point >=
      data.BetOnZero +
        data.BetOnOne +
        data.BetOnTwo +
        data.BetOnThree +
        data.BetOnFour +
        data.BetOnFive +
        data.BetOnSix +
        data.BetOnSeven +
        data.BetOnEight +
        data.BetOnNine 
           ) {
      playerName = data.playerId;

      console.log("bet request", data);
      await service.AddPlayerIdInBetplaced(data.playerId);

      Zero = data.BetOnZero;

      One = data.BetOnOne;

      Two = data.BetOnTwo;

      Three = data.BetOnThree;

      Four = data.BetOnFour;

      Five = data.BetOnFive;

      Six = data.BetOnSix;

      Seven = data.BetOnSeven;

      Eight = data.BetOnEight;

      Nine = data.BetOnNine;

      
      var array = [];
      array.push(data.BetOnZero);
      array.push(data.BetOnOne);
      array.push(data.BetOnTwo);
      array.push(data.BetOnThree);
      array.push(data.BetOnFour);
      array.push(data.BetOnFive);
      array.push(data.BetOnSix);
      array.push(data.BetOnSeven);
      array.push(data.BetOnEight);
      array.push(data.BetOnNine);
    
      isbetPlaced = true;

      Win_singleNo = array.indexOf(Math.min(...array));

      let point = await service.getUserPoint(
        data.playerId,
        data.BetOnZero +
          data.BetOnOne +
          data.BetOnTwo +
          data.BetOnThree +
          data.BetOnFour +
          data.BetOnFive +
          data.BetOnSix +
          data.BetOnSeven +
          data.BetOnEight +
          data.BetOnNine 
        
      );
      console.log("Point", point);
      await service.FuntargetBets(
        data.BetOnZero,
        data.BetOnOne,
        data.BetOnTwo,
        data.BetOnThree,
        data.BetOnFour,
        data.BetOnFive,
        data.BetOnSix,
        data.BetOnSeven,
        data.BetOnEight,
        data.BetOnNine,
         );

      var Funtarget_betsResult = await service.Detailfuntarget();
      console.log("Detailfuntarget", Funtarget_betsResult);
      if (
        Funtarget_betsResult.BetOnZero < Funtarget_betsResult.BetOnOne &&
        Funtarget_betsResult.BetOnZero < Funtarget_betsResult.BetOnTwo &&
        Funtarget_betsResult.BetOnZero < Funtarget_betsResult.BetOnThree &&
        Funtarget_betsResult.BetOnZero < Funtarget_betsResult.BetOnFour &&
        Funtarget_betsResult.BetOnZero < Funtarget_betsResult.BetOnFive &&
        Funtarget_betsResult.BetOnZero < Funtarget_betsResult.BetOnSix &&
        Funtarget_betsResult.BetOnZero < Funtarget_betsResult.BetOnSeven &&
        Funtarget_betsResult.BetOnZero < Funtarget_betsResult.BetOnEight &&
        Funtarget_betsResult.BetOnZero < Funtarget_betsResult.BetOnNine 
              ) {
        Win_singleNo = 0;
      }
      if (
        Funtarget_betsResult.BetOnOne < Funtarget_betsResult.BetOnZero &&
        Funtarget_betsResult.BetOnOne < Funtarget_betsResult.BetOnTwo &&
        Funtarget_betsResult.BetOnOne < Funtarget_betsResult.BetOnThree &&
        Funtarget_betsResult.BetOnOne < Funtarget_betsResult.BetOnFour &&
        Funtarget_betsResult.BetOnOne < Funtarget_betsResult.BetOnFive &&
        Funtarget_betsResult.BetOnOne < Funtarget_betsResult.BetOnSix &&
        Funtarget_betsResult.BetOnOne < Funtarget_betsResult.BetOnSeven &&
        Funtarget_betsResult.BetOnOne < Funtarget_betsResult.BetOnEight &&
        Funtarget_betsResult.BetOnOne < Funtarget_betsResult.BetOnNine 
       
      ) {
        Win_singleNo = 1;
      }
      if (
        Funtarget_betsResult.BetOnTwo < Funtarget_betsResult.BetOnOne &&
        Funtarget_betsResult.BetOnTwo < Funtarget_betsResult.BetOnZero &&
        Funtarget_betsResult.BetOnTwo < Funtarget_betsResult.BetOnThree &&
        Funtarget_betsResult.BetOnTwo < Funtarget_betsResult.BetOnFour &&
        Funtarget_betsResult.BetOnTwo < Funtarget_betsResult.BetOnFive &&
        Funtarget_betsResult.BetOnTwo < Funtarget_betsResult.BetOnSix &&
        Funtarget_betsResult.BetOnTwo < Funtarget_betsResult.BetOnSeven &&
        Funtarget_betsResult.BetOnTwo < Funtarget_betsResult.BetOnEight &&
        Funtarget_betsResult.BetOnTwo < Funtarget_betsResult.BetOnNine 
      ) {
        Win_singleNo = 2;
      }
      if (
        Funtarget_betsResult.BetOnThree < Funtarget_betsResult.BetOnOne &&
        Funtarget_betsResult.BetOnThree < Funtarget_betsResult.BetOnTwo &&
        Funtarget_betsResult.BetOnThree < Funtarget_betsResult.BetOnZero &&
        Funtarget_betsResult.BetOnThree < Funtarget_betsResult.BetOnFour &&
        Funtarget_betsResult.BetOnThree < Funtarget_betsResult.BetOnFive &&
        Funtarget_betsResult.BetOnThree < Funtarget_betsResult.BetOnSix &&
        Funtarget_betsResult.BetOnThree < Funtarget_betsResult.BetOnSeven &&
        Funtarget_betsResult.BetOnThree < Funtarget_betsResult.BetOnEight &&
        Funtarget_betsResult.BetOnThree < Funtarget_betsResult.BetOnNine 
        
      ) {
        Win_singleNo = 3;
      }
      if (
        Funtarget_betsResult.BetOnFour < Funtarget_betsResult.BetOnOne &&
        Funtarget_betsResult.BetOnFour < Funtarget_betsResult.BetOnTwo &&
        Funtarget_betsResult.BetOnFour < Funtarget_betsResult.BetOnThree &&
        Funtarget_betsResult.BetOnFour < Funtarget_betsResult.BetOnZero &&
        Funtarget_betsResult.BetOnFour < Funtarget_betsResult.BetOnFive &&
        Funtarget_betsResult.BetOnFour < Funtarget_betsResult.BetOnSix &&
        Funtarget_betsResult.BetOnFour < Funtarget_betsResult.BetOnSeven &&
        Funtarget_betsResult.BetOnFour < Funtarget_betsResult.BetOnEight &&
        Funtarget_betsResult.BetOnFour < Funtarget_betsResult.BetOnNine
      ) {
        Win_singleNo = 4;
      }
      if (
        Funtarget_betsResult.BetOnFive < Funtarget_betsResult.BetOnOne &&
        Funtarget_betsResult.BetOnFive < Funtarget_betsResult.BetOnTwo &&
        Funtarget_betsResult.BetOnFive < Funtarget_betsResult.BetOnThree &&
        Funtarget_betsResult.BetOnFive < Funtarget_betsResult.BetOnFour &&
        Funtarget_betsResult.BetOnFive < Funtarget_betsResult.BetOnZero &&
        Funtarget_betsResult.BetOnFive < Funtarget_betsResult.BetOnSix &&
        Funtarget_betsResult.BetOnFive < Funtarget_betsResult.BetOnSeven &&
        Funtarget_betsResult.BetOnFive < Funtarget_betsResult.BetOnEight &&
        Funtarget_betsResult.BetOnFive < Funtarget_betsResult.BetOnNine
      ) {
        Win_singleNo = 5;
      }
      if (
        Funtarget_betsResult.BetOnSix < Funtarget_betsResult.BetOnOne &&
        Funtarget_betsResult.BetOnSix < Funtarget_betsResult.BetOnTwo &&
        Funtarget_betsResult.BetOnSix < Funtarget_betsResult.BetOnThree &&
        Funtarget_betsResult.BetOnSix < Funtarget_betsResult.BetOnFour &&
        Funtarget_betsResult.BetOnSix < Funtarget_betsResult.BetOnFive &&
        Funtarget_betsResult.BetOnSix < Funtarget_betsResult.BetOnZero &&
        Funtarget_betsResult.BetOnSix < Funtarget_betsResult.BetOnSeven &&
        Funtarget_betsResult.BetOnSix < Funtarget_betsResult.BetOnEight &&
        Funtarget_betsResult.BetOnSix < Funtarget_betsResult.BetOnNine 
      ) {
        Win_singleNo = 6;
      }
      if (
        Funtarget_betsResult.BetOnSeven < Funtarget_betsResult.BetOnOne &&
        Funtarget_betsResult.BetOnSeven < Funtarget_betsResult.BetOnTwo &&
        Funtarget_betsResult.BetOnSeven < Funtarget_betsResult.BetOnThree &&
        Funtarget_betsResult.BetOnSeven < Funtarget_betsResult.BetOnFour &&
        Funtarget_betsResult.BetOnSeven < Funtarget_betsResult.BetOnFive &&
        Funtarget_betsResult.BetOnSeven < Funtarget_betsResult.BetOnSix &&
        Funtarget_betsResult.BetOnSeven < Funtarget_betsResult.BetOnZero &&
        Funtarget_betsResult.BetOnSeven < Funtarget_betsResult.BetOnEight &&
        Funtarget_betsResult.BetOnSeven < Funtarget_betsResult.BetOnNine 
      ) {
        Win_singleNo = 7;
      }
      if (
        Funtarget_betsResult.BetOnEight < Funtarget_betsResult.BetOnOne &&
        Funtarget_betsResult.BetOnEight < Funtarget_betsResult.BetOnTwo &&
        Funtarget_betsResult.BetOnEight < Funtarget_betsResult.BetOnThree &&
        Funtarget_betsResult.BetOnEight < Funtarget_betsResult.BetOnFour &&
        Funtarget_betsResult.BetOnEight < Funtarget_betsResult.BetOnFive &&
        Funtarget_betsResult.BetOnEight < Funtarget_betsResult.BetOnSix &&
        Funtarget_betsResult.BetOnEight < Funtarget_betsResult.BetOnSeven &&
        Funtarget_betsResult.BetOnEight < Funtarget_betsResult.BetOnZero &&
        Funtarget_betsResult.BetOnEight < Funtarget_betsResult.BetOnNine 
      ) {
        Win_singleNo = 8;
      }
      if (
        Funtarget_betsResult.BetOnNine < Funtarget_betsResult.BetOnOne &&
        Funtarget_betsResult.BetOnNine < Funtarget_betsResult.BetOnTwo &&
        Funtarget_betsResult.BetOnNine < Funtarget_betsResult.BetOnThree &&
        Funtarget_betsResult.BetOnNine < Funtarget_betsResult.BetOnFour &&
        Funtarget_betsResult.BetOnNine < Funtarget_betsResult.BetOnFive &&
        Funtarget_betsResult.BetOnNine < Funtarget_betsResult.BetOnSix &&
        Funtarget_betsResult.BetOnNine < Funtarget_betsResult.BetOnSeven &&
        Funtarget_betsResult.BetOnNine < Funtarget_betsResult.BetOnEight &&
        Funtarget_betsResult.BetOnNine < Funtarget_betsResult.BetOnZero 
      ) {
        Win_singleNo = 9;
      }
     
      let Game = await service.GameRunning(
        data.playerId,
        ROUND_COUNT,
        data.BetOnZero ,
        data.BetOnOne ,
        data.BetOnTwo ,
        data.BetOnThree ,
        data.BetOnFour ,
        data.BetOnFive ,
        data.BetOnSix ,
        data.BetOnSeven ,
        data.BetOnEight ,
        data.BetOnNine ,

        Win_singleNo
      );
      console.log("Game", Game);

      if (
        data.BetOnZero +
          data.BetOnOne +
          data.BetOnTwo +
          data.BetOnThree +
          data.BetOnFour +
          data.BetOnFive +
          data.BetOnSix +
          data.BetOnSeven +
          data.BetOnEight +
          data.BetOnNine ==
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
                (data.BetOnZero +
                  data.BetOnOne +
                  data.BetOnTwo +
                  data.BetOnThree +
                  data.BetOnFour +
                  data.BetOnFive +
                  data.BetOnSix +
                  data.BetOnSeven +
                  data.BetOnEight +
                  data.BetOnNine 
                 ),
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
              (data.BetOnZero +
                data.BetOnOne +
                data.BetOnTwo +
                data.BetOnThree +
                data.BetOnFour +
                data.BetOnFive +
                data.BetOnSix +
                data.BetOnSeven +
                data.BetOnEight +
                data.BetOnNine 
                ),
          },
        });
      }
    } else {
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













async function OnWinNo(data,Multiplier,W) {
  console.log("W-------",W)
  //let socket = data[commonVar.socket];
 // socket.on("OnWinNo", async (data) => {
    //var Win_singleNo = 0;
    var winconatinzero = [];
   var adminWin= await service.getAdminfuntarget()
var game_id =8;
    var playerId = data.playerId;
    var RoundCount = ROUND_COUNT;
    var previousWin_single = previousWin_single;
    //var NewpreviousWin_single = NewpreviousWin_single;

    //var Balance= result2[0].point;
    var isplayerexist = await service.GetPlayerIdInBetplaced(data.playerId);
    if (isplayerexist == true) {
      let Game = await service.GetGameRunningData(data.playerId);
      if (Game == "no user data exits") {
       // socket.emit("OnWinNo", { message: "no user data exits" });
      } else {
        var Funtarget_betsResult = await service.Detailfuntarget();
        console.log("Detailfuntarget", Funtarget_betsResult);
      /*   if (
          Funtarget_betsResult.BetOnZero <= Funtarget_betsResult.BetOnOne &&
          Funtarget_betsResult.BetOnZero <= Funtarget_betsResult.BetOnTwo &&
          Funtarget_betsResult.BetOnZero <= Funtarget_betsResult.BetOnThree &&
          Funtarget_betsResult.BetOnZero <= Funtarget_betsResult.BetOnFour &&
          Funtarget_betsResult.BetOnZero <= Funtarget_betsResult.BetOnFive &&
          Funtarget_betsResult.BetOnZero <= Funtarget_betsResult.BetOnSix &&
          Funtarget_betsResult.BetOnZero <= Funtarget_betsResult.BetOnSeven &&
          Funtarget_betsResult.BetOnZero <= Funtarget_betsResult.BetOnEight &&
          Funtarget_betsResult.BetOnZero <= Funtarget_betsResult.BetOnNine 
                ) {
          Win_singleNo = 0;
        }
        if (
          Funtarget_betsResult.BetOnOne <= Funtarget_betsResult.BetOnZero &&
          Funtarget_betsResult.BetOnOne <= Funtarget_betsResult.BetOnTwo &&
          Funtarget_betsResult.BetOnOne <= Funtarget_betsResult.BetOnThree &&
          Funtarget_betsResult.BetOnOne <= Funtarget_betsResult.BetOnFour &&
          Funtarget_betsResult.BetOnOne <= Funtarget_betsResult.BetOnFive &&
          Funtarget_betsResult.BetOnOne <= Funtarget_betsResult.BetOnSix &&
          Funtarget_betsResult.BetOnOne <= Funtarget_betsResult.BetOnSeven &&
          Funtarget_betsResult.BetOnOne <= Funtarget_betsResult.BetOnEight &&
          Funtarget_betsResult.BetOnOne <= Funtarget_betsResult.BetOnNine 
         
        ) {
          Win_singleNo = 1;
        }
        if (
          Funtarget_betsResult.BetOnTwo <= Funtarget_betsResult.BetOnOne &&
          Funtarget_betsResult.BetOnTwo <= Funtarget_betsResult.BetOnZero &&
          Funtarget_betsResult.BetOnTwo <= Funtarget_betsResult.BetOnThree &&
          Funtarget_betsResult.BetOnTwo <= Funtarget_betsResult.BetOnFour &&
          Funtarget_betsResult.BetOnTwo <= Funtarget_betsResult.BetOnFive &&
          Funtarget_betsResult.BetOnTwo <= Funtarget_betsResult.BetOnSix &&
          Funtarget_betsResult.BetOnTwo <= Funtarget_betsResult.BetOnSeven &&
          Funtarget_betsResult.BetOnTwo <= Funtarget_betsResult.BetOnEight &&
          Funtarget_betsResult.BetOnTwo <= Funtarget_betsResult.BetOnNine 
        ) {
          Win_singleNo = 2;
        }
        if (
          Funtarget_betsResult.BetOnThree <= Funtarget_betsResult.BetOnOne &&
          Funtarget_betsResult.BetOnThree <= Funtarget_betsResult.BetOnTwo &&
          Funtarget_betsResult.BetOnThree <= Funtarget_betsResult.BetOnZero &&
          Funtarget_betsResult.BetOnThree <= Funtarget_betsResult.BetOnFour &&
          Funtarget_betsResult.BetOnThree <= Funtarget_betsResult.BetOnFive &&
          Funtarget_betsResult.BetOnThree <= Funtarget_betsResult.BetOnSix &&
          Funtarget_betsResult.BetOnThree <= Funtarget_betsResult.BetOnSeven &&
          Funtarget_betsResult.BetOnThree <= Funtarget_betsResult.BetOnEight &&
          Funtarget_betsResult.BetOnThree <= Funtarget_betsResult.BetOnNine 
          
        ) {
          Win_singleNo = 3;
        }
        if (
          Funtarget_betsResult.BetOnFour <= Funtarget_betsResult.BetOnOne &&
          Funtarget_betsResult.BetOnFour <= Funtarget_betsResult.BetOnTwo &&
          Funtarget_betsResult.BetOnFour <= Funtarget_betsResult.BetOnThree &&
          Funtarget_betsResult.BetOnFour <= Funtarget_betsResult.BetOnZero &&
          Funtarget_betsResult.BetOnFour <= Funtarget_betsResult.BetOnFive &&
          Funtarget_betsResult.BetOnFour <= Funtarget_betsResult.BetOnSix &&
          Funtarget_betsResult.BetOnFour <= Funtarget_betsResult.BetOnSeven &&
          Funtarget_betsResult.BetOnFour <= Funtarget_betsResult.BetOnEight &&
          Funtarget_betsResult.BetOnFour <= Funtarget_betsResult.BetOnNine
        ) {
          Win_singleNo = 4;
        }
        if (
          Funtarget_betsResult.BetOnFive <= Funtarget_betsResult.BetOnOne &&
          Funtarget_betsResult.BetOnFive <= Funtarget_betsResult.BetOnTwo &&
          Funtarget_betsResult.BetOnFive <= Funtarget_betsResult.BetOnThree &&
          Funtarget_betsResult.BetOnFive <= Funtarget_betsResult.BetOnFour &&
          Funtarget_betsResult.BetOnFive <= Funtarget_betsResult.BetOnZero &&
          Funtarget_betsResult.BetOnFive <= Funtarget_betsResult.BetOnSix &&
          Funtarget_betsResult.BetOnFive <= Funtarget_betsResult.BetOnSeven &&
          Funtarget_betsResult.BetOnFive <= Funtarget_betsResult.BetOnEight &&
          Funtarget_betsResult.BetOnFive <= Funtarget_betsResult.BetOnNine
        ) {
          Win_singleNo = 5;
        }
        if (
          Funtarget_betsResult.BetOnSix <= Funtarget_betsResult.BetOnOne &&
          Funtarget_betsResult.BetOnSix <= Funtarget_betsResult.BetOnTwo &&
          Funtarget_betsResult.BetOnSix <= Funtarget_betsResult.BetOnThree &&
          Funtarget_betsResult.BetOnSix <= Funtarget_betsResult.BetOnFour &&
          Funtarget_betsResult.BetOnSix <= Funtarget_betsResult.BetOnFive &&
          Funtarget_betsResult.BetOnSix <= Funtarget_betsResult.BetOnZero &&
          Funtarget_betsResult.BetOnSix <= Funtarget_betsResult.BetOnSeven &&
          Funtarget_betsResult.BetOnSix <= Funtarget_betsResult.BetOnEight &&
          Funtarget_betsResult.BetOnSix <= Funtarget_betsResult.BetOnNine 
        ) {
          Win_singleNo = 6;
        }
        if (
          Funtarget_betsResult.BetOnSeven <= Funtarget_betsResult.BetOnOne &&
          Funtarget_betsResult.BetOnSeven <= Funtarget_betsResult.BetOnTwo &&
          Funtarget_betsResult.BetOnSeven <= Funtarget_betsResult.BetOnThree &&
          Funtarget_betsResult.BetOnSeven <= Funtarget_betsResult.BetOnFour &&
          Funtarget_betsResult.BetOnSeven <= Funtarget_betsResult.BetOnFive &&
          Funtarget_betsResult.BetOnSeven <= Funtarget_betsResult.BetOnSix &&
          Funtarget_betsResult.BetOnSeven <= Funtarget_betsResult.BetOnZero &&
          Funtarget_betsResult.BetOnSeven <= Funtarget_betsResult.BetOnEight &&
          Funtarget_betsResult.BetOnSeven <= Funtarget_betsResult.BetOnNine 
        ) {
          Win_singleNo = 7;
        }
        if (
          Funtarget_betsResult.BetOnEight <= Funtarget_betsResult.BetOnOne &&
          Funtarget_betsResult.BetOnEight <= Funtarget_betsResult.BetOnTwo &&
          Funtarget_betsResult.BetOnEight <= Funtarget_betsResult.BetOnThree &&
          Funtarget_betsResult.BetOnEight <= Funtarget_betsResult.BetOnFour &&
          Funtarget_betsResult.BetOnEight <= Funtarget_betsResult.BetOnFive &&
          Funtarget_betsResult.BetOnEight <= Funtarget_betsResult.BetOnSix &&
          Funtarget_betsResult.BetOnEight <= Funtarget_betsResult.BetOnSeven &&
          Funtarget_betsResult.BetOnEight <= Funtarget_betsResult.BetOnZero &&
          Funtarget_betsResult.BetOnEight <= Funtarget_betsResult.BetOnNine 
        ) {
          Win_singleNo = 8;
        }
        if (
          Funtarget_betsResult.BetOnNine <= Funtarget_betsResult.BetOnOne &&
          Funtarget_betsResult.BetOnNine <= Funtarget_betsResult.BetOnTwo &&
          Funtarget_betsResult.BetOnNine <= Funtarget_betsResult.BetOnThree &&
          Funtarget_betsResult.BetOnNine <= Funtarget_betsResult.BetOnFour &&
          Funtarget_betsResult.BetOnNine <= Funtarget_betsResult.BetOnFive &&
          Funtarget_betsResult.BetOnNine <= Funtarget_betsResult.BetOnSix &&
          Funtarget_betsResult.BetOnNine <= Funtarget_betsResult.BetOnSeven &&
          Funtarget_betsResult.BetOnNine <= Funtarget_betsResult.BetOnEight &&
          Funtarget_betsResult.BetOnNine <= Funtarget_betsResult.BetOnZero 
        ) {
          Win_singleNo = 9;
        }
       
 */
/* if(adminWin.value==-1){
  if (Funtarget_betsResult.BetOnZero == 0) {
    winconatinzero.push(0);
  }
  if (Funtarget_betsResult.BetOnOne == 0) {
    winconatinzero.push(1);
  }
  if (Funtarget_betsResult.BetOnTwo == 0) {
    winconatinzero.push(2);
  }
  if (Funtarget_betsResult.BetOnThree == 0) {
    winconatinzero.push(3);
  }
  if (Funtarget_betsResult.BetOnFour == 0) {
    winconatinzero.push(4);
  }
  if (Funtarget_betsResult.BetOnFive == 0) {
    winconatinzero.push(5);
  }
  if (Funtarget_betsResult.BetOnSix == 0) {
    winconatinzero.push(6);
  }
  if (Funtarget_betsResult.BetOnSeven == 0) {
    winconatinzero.push(7);
  }
  if (Funtarget_betsResult.BetOnEight == 0) {
    winconatinzero.push(8);
  }
  if (Funtarget_betsResult.BetOnNine == 0) {
    winconatinzero.push(9);
  }
  console.log(Funtarget_betsResult.BetOnEight)

  console.log("wincog***************************************",winconatinzero.length)

 */ /*  if (winconatinzero.length > 0) {
    var l = winconatinzero.length;
    var r = Math.floor(Math.random() * l);
    Win_singleNo = winconatinzero[r];
    
  }
  */ //NewpreviousWin_single.pop();
 
  //NewpreviousWin_single.push(Win_singleNo);

  console.log("Win_singleNo", W);
  await service.UpdateGameRunningDataWinSingleNumber(
    data.playerId,
    Game.playedTime,
    W
  //  Win_singleNo
  );

  /*  await service.RemoveTitaliBetsOfUser(
    Game.Zero,
    Game.One,
    Game.Two,
    Game.Four,
    Game.Three,
    Game.Six,
    Game.Five,
    Game.Seven,
    Game.Eight,
    Game.Nine,
    Game.butterfly,
    Game.lattu
  );
  */


 /*  var times=[1,1,1,1,1,1,2,1,1,1,1,1,1,2,1,1,1,1,1,1,2,1,1,1,1,1,1,2,1,1,1,1,1,1,1]
  var WinXIndex=Math.floor(Math.random()*times.length)
  
  winX=times[WinXIndex]
  var Multiplier
  if(winX==2){
    Multiplier=18
  }
  else{
    Multiplier=9;
  }
  console.log("mul",Multiplier)
  console.log("mulgame",Game)
 */
  if (W == 0) {
    let Game1 = await service.UpdateGameRunningDataWinpoint(
      data.playerId,
      Game.playedTime,
      //Game.Zero * 9
      Game.Zero * Multiplier

    );
   /*  let point = await service.updateUserPoint(
      data.playerId,
      Game.Zero * 9
    );
    console.log("Points", point);
    *////*  await service.RemovePlayerIdInBetplaced(data.playerId); */
  //  await service.PlayerDetails(data.playerId,ROUND_COUNT,Win_singleNo,Game.winX+"X")
    await service.PlayerDetails(data.playerId,ROUND_COUNT,W,winX+"X")

    await service.WinamountDetails(data.playerId,game_id, Game.Zero * Multiplier)

   /*  socket.emit("OnWinNo", {
      message: "Zero wins",
      winX:Game.winX+"X",
      winPoint: Game.Zero * 9,
      winNo: Win_singleNo,
      playerId: data.playerId,
      RoundCount: ROUND_COUNT,
      // previousWin_single: previousWin_single,
      previousWin_single: NewpreviousWin_single,

     // Balance: point,
    });
    */ SuffleBots();
  }
  if (W == 1) {
    let Game2 = await service.UpdateGameRunningDataWinpoint(
      data.playerId,
      Game.playedTime,
    //  Game.One * 9
    Game.One *Multiplier
    );
   /*  let point = await service.updateUserPoint(
      data.playerId,
      Game.One * 9
    );
    console.log("Points", point);
*/
   /*  await service.RemovePlayerIdInBetplaced(data.playerId); */
    await service.PlayerDetails(data.playerId,ROUND_COUNT,W,winX+"X")
    await service.WinamountDetails(data.playerId,game_id, Game.One * Multiplier)

   /*  socket.emit("OnWinNo", {
      message: "One wins",
      winX:Game.winX+"X",

      winPoint: Game.One * 9,
      winNo: Win_singleNo,
      playerId: data.playerId,
      RoundCount: ROUND_COUNT,
      // previousWin_single: previousWin_single,
      previousWin_single: NewpreviousWin_single,

     // Balance: point,
    });
    */ SuffleBots();
  }

  if (W == 2) {
    let Game2 = await service.UpdateGameRunningDataWinpoint(
      data.playerId,
      Game.playedTime,
      //Game.Two * 9
      Game.Two*Multiplier
    );
    /* let point = await service.updateUserPoint(
      data.playerId,
      Game.Two * 9
    );
    console.log("Points", point);
     *///await service.RemovePlayerIdInBetplaced(data.playerId);
     await service.PlayerDetails(data.playerId,ROUND_COUNT,W,winX+"X")
     await service.WinamountDetails(data.playerId,game_id, Game.Two * Multiplier)

   /*  socket.emit("OnWinNo", {
      message: "Two wins",
      winX:Game.winX+"X",

      winPoint: Game.Two * 9,
      winNo: Win_singleNo,
      playerId: data.playerId,
      RoundCount: ROUND_COUNT,
      // previousWin_single: previousWin_single,
      previousWin_single: NewpreviousWin_single,

     // Balance: point,
    });
    */ SuffleBots();
  }
  if (W == 3) {
    let Game2 = await service.UpdateGameRunningDataWinpoint(
      data.playerId,
      Game.playedTime,
      //Game.Three * 9
      Game.Three*Multiplier
    );
   /*  let point = await service.updateUserPoint(
      data.playerId,
      Game.Three * 9
    );
    console.log("Points", point);
    */ //await service.RemovePlayerIdInBetplaced(data.playerId);
    await service.PlayerDetails(data.playerId,ROUND_COUNT,W,winX+"X")
    await service.WinamountDetails(data.playerId,game_id, Game.Three * Multiplier)

   /*  socket.emit("OnWinNo", {
      message: "Three wins",
      winX:Game.winX+"X",

      winPoint: Game.Three * 9,
      winNo: Win_singleNo,
      playerId: data.playerId,
      RoundCount: ROUND_COUNT,
      //previousWin_single: previousWin_single,
      previousWin_single: NewpreviousWin_single,

     // Balance: point,
    }); */
    SuffleBots();
  }
  if (W == 4) {
    let Game2 = await service.UpdateGameRunningDataWinpoint(
      data.playerId,
      Game.playedTime,
      //Game.Four * 9
      Game.Four*Multiplier
    );
    /* let point = await service.updateUserPoint(
      data.playerId,
      Game.Four * 9
    );
    console.log("Points", point);
     *///await service.RemovePlayerIdInBetplaced(data.playerId);
     await service.PlayerDetails(data.playerId,ROUND_COUNT,W,winX+"X")
     await service.WinamountDetails(data.playerId,game_id, Game.Four * Multiplier)

  /*   socket.emit("OnWinNo", {
      message: "Four wins",
      winX:Game.winX+"X",

      winPoint: Game.Four * 9,
      winNo: Win_singleNo,
      playerId: data.playerId,
      RoundCount: ROUND_COUNT,
      // previousWin_single: previousWin_single,
      previousWin_single: NewpreviousWin_single,

     // Balance: point,
    });*/
    SuffleBots();
  }
  if (W == 5) {
    let Game2 = await service.UpdateGameRunningDataWinpoint(
      data.playerId,
      Game.playedTime,
      //Game.Five * 9
      Game.Five*Multiplier
    );
    /* let point = await service.updateUserPoint(
      data.playerId,
      Game.Five * 9
    );
    console.log("Points", point);
     *///await service.RemovePlayerIdInBetplaced(data.playerId);
     await service.PlayerDetails(data.playerId,ROUND_COUNT,W,winX+"X")
     await service.WinamountDetails(data.playerId,game_id, Game.Five * Multiplier)


   /*  socket.emit("OnWinNo", {
      message: "Five wins",
      winX:Game.winX+"X",

      winPoint: Game.Five * 9,
      winNo: Win_singleNo,
      playerId: data.playerId,
      RoundCount: ROUND_COUNT,
      // previousWin_single: previousWin_single,
      previousWin_single: NewpreviousWin_single,

//Balance: point,
    });*/
    SuffleBots();
  }
  if (W == 6) {
    let Game2 = await service.UpdateGameRunningDataWinpoint(
      data.playerId,
      Game.playedTime,
      //Game.Six * 9
      Game.Six*Multiplier
    );
    /* let point = await service.updateUserPoint(
      data.playerId,
      Game.Six * 9
    );
    console.log("Points", point);
     *///await service.RemovePlayerIdInBetplaced(data.playerId);
     await service.PlayerDetails(data.playerId,ROUND_COUNT,W,winX+"X")
     await service.WinamountDetails(data.playerId,game_id, Game.Six * Multiplier)

    /* socket.emit("OnWinNo", {
      message: "Six wins",
      winX:Game.winX+"X",

      winPoint: Game.Six * 9,
      winNo: Win_singleNo,
      playerId: data.playerId,
      RoundCount: ROUND_COUNT,
      //previousWin_single: previousWin_single,
      previousWin_single: NewpreviousWin_single,

     // Balance: point,
    });
     */SuffleBots();
  }
  if (W == 7) {
    let Game2 = await service.UpdateGameRunningDataWinpoint(
      data.playerId,
      Game.playedTime,
      //Game.Seven * 9
      Game.Seven*Multiplier
    );
    /* let point = await service.updateUserPoint(
      data.playerId,
      Game.Seven * 9
    );
    console.log("Points", point);
     *///await service.RemovePlayerIdInBetplaced(data.playerId);
     await service.PlayerDetails(data.playerId,ROUND_COUNT,W,winX+"X")
     await service.WinamountDetails(data.playerId,game_id, Game.Seven * Multiplier)

    /* socket.emit("OnWinNo", {
      message: "Seven wins",
      winX:Game.winX+"X",

      winPoint: Game.Seven * 9,
      winNo: Win_singleNo,
      playerId: data.playerId,
      RoundCount: ROUND_COUNT,
      // previousWin_single: previousWin_single,
      previousWin_single: NewpreviousWin_single,

   //   Balance: point,
    });
     */SuffleBots();
  }
  if (W== 8) {
    let Game2 = await service.UpdateGameRunningDataWinpoint(
      data.playerId,
      Game.playedTime,
      //Game.Eight * 9
      Game.Eight*Multiplier
    );
    /* let point = await service.updateUserPoint(
      data.playerId,
      Game.Eight * 9
    );
    console.log("Points", point);
     *///await service.RemovePlayerIdInBetplaced(data.playerId);
     await service.PlayerDetails(data.playerId,ROUND_COUNT,W,winX+"X")
     await service.WinamountDetails(data.playerId,game_id, Game.Eight * Multiplier)

   /*  socket.emit("OnWinNo", {
      message: "Eight wins",
      winX:Game.winX+"X",

      winPoint: Game.Eight * 9,
      winNo: Win_singleNo,
      playerId: data.playerId,
      RoundCount: ROUND_COUNT,
      // previousWin_single: previousWin_single,
      previousWin_single: NewpreviousWin_single,

  //    Balance: point,
    }); */
    SuffleBots();
  }
  if (W == 9) {
    let Game2 = await service.UpdateGameRunningDataWinpoint(
      data.playerId,
      Game.playedTime,
     // Game.Nine * 9
     Game.Nine*Multiplier
    );
   /*  let point = await service.updateUserPoint(
      data.playerId,
      Game.Nine * 9
    );
    console.log("Points", point);
    */ //await service.RemovePlayerIdInBetplaced(data.playerId);
    await service.PlayerDetails(data.playerId,ROUND_COUNT,W,winX+"X")
    await service.WinamountDetails(data.playerId,game_id, Game.Nine * Multiplier)

    /* socket.emit("OnWinNo", {
      message: "Nine wins",
      winX:Game.winX+"X",

      winPoint: Game.Nine * 9,
      winNo: Win_singleNo,
      playerId: data.playerId,
      RoundCount: ROUND_COUNT,
      //previousWin_single: previousWin_single,
      previousWin_single: NewpreviousWin_single,

   //   Balance: point,
    }); */
    SuffleBots();
  }






//}

     



        //    socket.emit("OnWinNoResult",{message:Game})
      }
    }
    
    //  console.log("Game", Game);
}










/* function OnWinAmount(data) {
  let socket = data[commonVar.socket];
  socket.on(events.OnWinAmount, async (data) => {
    console.log("winAmount hit", data);
    // await service.updateUserPoint(data.playerId, winPoint);
    var userbalance = 0;

    await service.updatePoint(data.playerId,data.balance);
    let result = await service.onbalance(playerName);
    userbalance = result[0].point;

    socket.emit(events.OnWinAmount, {
      // win_no: Win_singleNo,
      //RoundCount: ROUND_COUNT,
      //win_point: winPoint,
       playerId: playerName,
      balance: userbalance,
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
  */     //win_point: data.winpoint,
      playerId: data.playerId,
      Balance:point,
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
    RoundCount:ROUND_COUNT,
    gametimer: i,

    // timer,
    // gameState,
    // socketId : player.socketId,
    ImageGlobalArr:ImageGlobalArr,
    previousWins:NewpreviousWin_single,
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
    socket.emit(events.OnHistoryRecord, { matrixRecord, slotRecord });
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
    game_id: 8,
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
   // winx: winX + "x",
   winx: winXarray[numb] + "x",

   imagenumber:imagenumber,
       
    winNo: singleNo,
    previousWin_single: previousWin_single,
    winPoint: winPoint,
    balance:result2[0].point
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
  }
 if(isbetPlaced==false){
  
  Win_singleNo = Math.floor(Math.random() * 10); ///Dice 1
 
  // Win_TwoNo = Math.floor(Math.random() * 6) + 1; ////Dice 2
 }
 let winXRandom = Math.floor(Math.random() * 2);

 numb=Math.floor(Math.random() * 11);
 if (winXRandom == 0) {
  winX = 1;
} else if (winXRandom == 1) {
  winX = 2;
}  /* else {

  winX = 4;
} */
if (winXarray[numb] == 1) {
 // winX = 1;
let imgrandom=Math.floor(Math.random() * 4);
imagenumber=imgrandom
} else 
 {
  //winX = 2;
  imagenumber=4
}
 isbetPlaced=false

  previousWin_single.push(Win_singleNo);

  //previousWin_single.push(Win_TwoNo);

  winPoint = 0;
  /* --------------------CartegoriesTypes Bets---------------------------*/
  if (singleNoBet.indexOf(Win_singleNo) != -1) {
     winPoint =
      winPoint +
      singleNoBetAmount[singleNoBet.indexOf(Win_singleNo)] * 9 * winX; //kitn lgn hai******** 2 to 6 ke liye
  }
  singleNoBet = [];
  singleNoBetAmount = [];

  /* if (usersingleNoChoice == 1 && Win_singleNo + Win_TwoNo == 7) {
    winPoint = winPoint + singleNoBet * 5.5; //kitn lgn hai********  7 ke
  }
  if (
    usersingleNoChoice == 2 &&
    [8, 9, 10, 11, 12].indexOf(Win_singleNo + Win_TwoNo) != -1
  ) {
    winPoint = winPoint + singleNoBet * 2.2; //kitn lgn hai**** 8to 12 ke
  }
 */
  //    win_ = Math.floor(Math.random() * 6) + 1
  if (playerName != "") {
    await service.addwinningpoint(playerName, winPoint);
  } //db

  return {
    win_point: winPoint,
    singleNo: Win_singleNo,
    winNo: winNo,
    spot: leastBetSpot,
  };
}

function generateSpotWinningNo(leastBetSpot) {
  let win1;
  let win2;
  switch (leastBetSpot) {
    case spot.left:
      win1 = Math.floor(GetRandomNo(2, 37));
      win2 = Math.floor(GetRandomNo(1, win1));
      break;
    case spot.middle:
      win1 = Math.floor(GetRandomNo(1, 37));
      win2 = win1;
      break;
    case spot.right:
      win2 = Math.floor(GetRandomNo(2, 37));
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

/**
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
let i = timerVar.bettingFunTarget;
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
  i = timerVar.bettingFunTarget;
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
  // SendBotData();
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

  //if (j === 8) OnSendWinNo();
  if (j === 8) {
var winconatinzero=[]
var playerData=await service.GetAllplayer()
console.log(playerData)
//var times=[2,2,2,2,2,2,2,1,1]

var times=[1,1,1,1,1,1,2,1,1,1,1,1,1,2,1,1,1,1,1,1,2,1,1,1,1,1,1,2,1,1,1,1,1,1,1]
var WinXIndex=Math.floor(Math.random()*times.length)

winX=times[WinXIndex]
var Multiplier
if(winX==2){
  Multiplier=18
}
else{
  Multiplier=9;
}
console.log("mul",Multiplier)


     
     
      /* playerData.forEach(item => {
        OnWinNo({playerId:item.playerId})
      }); */
      if(playerData.length>0){  
   var Funtarget_betsResult = await service.Detailfuntarget();
        console.log("Detailfuntarget", Funtarget_betsResult);









        var objectKey = Object.keys( Funtarget_betsResult ).map(function ( key ) { return  key; })
        // objectKey.shift()
         console.log("objectKey",objectKey)
         var objectValue = Object.keys( Funtarget_betsResult ).map(function ( key ) { return Funtarget_betsResult[key]; })
        // objectValue.shift()
         console.log("objectValue",objectValue)
    var minimumValue=Math.min(...objectValue)
    console.log('minimum value',minimumValue)
    var minimumIndex=objectValue.indexOf(minimumValue)
    if(minimumIndex==0)
    {
      Win_singleNo=0
    
     // Win_singleNo="00"
    }
    else{
      Win_singleNo=minimumIndex-1
    }













       /*  if (
          Funtarget_betsResult.BetOnZero <= Funtarget_betsResult.BetOnOne &&
          Funtarget_betsResult.BetOnZero <= Funtarget_betsResult.BetOnTwo &&
          Funtarget_betsResult.BetOnZero <= Funtarget_betsResult.BetOnThree &&
          Funtarget_betsResult.BetOnZero <= Funtarget_betsResult.BetOnFour &&
          Funtarget_betsResult.BetOnZero <= Funtarget_betsResult.BetOnFive &&
          Funtarget_betsResult.BetOnZero <= Funtarget_betsResult.BetOnSix &&
          Funtarget_betsResult.BetOnZero <= Funtarget_betsResult.BetOnSeven &&
          Funtarget_betsResult.BetOnZero <= Funtarget_betsResult.BetOnEight &&
          Funtarget_betsResult.BetOnZero <= Funtarget_betsResult.BetOnNine 
                ) {
          Win_singleNo = 0;
        }
        if (
          Funtarget_betsResult.BetOnOne <= Funtarget_betsResult.BetOnZero &&
          Funtarget_betsResult.BetOnOne <= Funtarget_betsResult.BetOnTwo &&
          Funtarget_betsResult.BetOnOne <= Funtarget_betsResult.BetOnThree &&
          Funtarget_betsResult.BetOnOne <= Funtarget_betsResult.BetOnFour &&
          Funtarget_betsResult.BetOnOne <= Funtarget_betsResult.BetOnFive &&
          Funtarget_betsResult.BetOnOne <= Funtarget_betsResult.BetOnSix &&
          Funtarget_betsResult.BetOnOne <= Funtarget_betsResult.BetOnSeven &&
          Funtarget_betsResult.BetOnOne <= Funtarget_betsResult.BetOnEight &&
          Funtarget_betsResult.BetOnOne <= Funtarget_betsResult.BetOnNine 
         
        ) {
          Win_singleNo = 1;
        }
        if (
          Funtarget_betsResult.BetOnTwo <= Funtarget_betsResult.BetOnOne &&
          Funtarget_betsResult.BetOnTwo <= Funtarget_betsResult.BetOnZero &&
          Funtarget_betsResult.BetOnTwo <= Funtarget_betsResult.BetOnThree &&
          Funtarget_betsResult.BetOnTwo <= Funtarget_betsResult.BetOnFour &&
          Funtarget_betsResult.BetOnTwo <= Funtarget_betsResult.BetOnFive &&
          Funtarget_betsResult.BetOnTwo <= Funtarget_betsResult.BetOnSix &&
          Funtarget_betsResult.BetOnTwo <= Funtarget_betsResult.BetOnSeven &&
          Funtarget_betsResult.BetOnTwo <= Funtarget_betsResult.BetOnEight &&
          Funtarget_betsResult.BetOnTwo <= Funtarget_betsResult.BetOnNine 
        ) {
          Win_singleNo = 2;
        }
        if (
          Funtarget_betsResult.BetOnThree <= Funtarget_betsResult.BetOnOne &&
          Funtarget_betsResult.BetOnThree <= Funtarget_betsResult.BetOnTwo &&
          Funtarget_betsResult.BetOnThree <= Funtarget_betsResult.BetOnZero &&
          Funtarget_betsResult.BetOnThree <= Funtarget_betsResult.BetOnFour &&
          Funtarget_betsResult.BetOnThree <= Funtarget_betsResult.BetOnFive &&
          Funtarget_betsResult.BetOnThree <= Funtarget_betsResult.BetOnSix &&
          Funtarget_betsResult.BetOnThree <= Funtarget_betsResult.BetOnSeven &&
          Funtarget_betsResult.BetOnThree <= Funtarget_betsResult.BetOnEight &&
          Funtarget_betsResult.BetOnThree <= Funtarget_betsResult.BetOnNine 
          
        ) {
          Win_singleNo = 3;
        }
        if (
          Funtarget_betsResult.BetOnFour <= Funtarget_betsResult.BetOnOne &&
          Funtarget_betsResult.BetOnFour <= Funtarget_betsResult.BetOnTwo &&
          Funtarget_betsResult.BetOnFour <= Funtarget_betsResult.BetOnThree &&
          Funtarget_betsResult.BetOnFour <= Funtarget_betsResult.BetOnZero &&
          Funtarget_betsResult.BetOnFour <= Funtarget_betsResult.BetOnFive &&
          Funtarget_betsResult.BetOnFour <= Funtarget_betsResult.BetOnSix &&
          Funtarget_betsResult.BetOnFour <= Funtarget_betsResult.BetOnSeven &&
          Funtarget_betsResult.BetOnFour <= Funtarget_betsResult.BetOnEight &&
          Funtarget_betsResult.BetOnFour <= Funtarget_betsResult.BetOnNine
        ) {
          Win_singleNo = 4;
        }
        if (
          Funtarget_betsResult.BetOnFive <= Funtarget_betsResult.BetOnOne &&
          Funtarget_betsResult.BetOnFive <= Funtarget_betsResult.BetOnTwo &&
          Funtarget_betsResult.BetOnFive <= Funtarget_betsResult.BetOnThree &&
          Funtarget_betsResult.BetOnFive <= Funtarget_betsResult.BetOnFour &&
          Funtarget_betsResult.BetOnFive <= Funtarget_betsResult.BetOnZero &&
          Funtarget_betsResult.BetOnFive <= Funtarget_betsResult.BetOnSix &&
          Funtarget_betsResult.BetOnFive <= Funtarget_betsResult.BetOnSeven &&
          Funtarget_betsResult.BetOnFive <= Funtarget_betsResult.BetOnEight &&
          Funtarget_betsResult.BetOnFive <= Funtarget_betsResult.BetOnNine
        ) {
          Win_singleNo = 5;
        }
        if (
          Funtarget_betsResult.BetOnSix <= Funtarget_betsResult.BetOnOne &&
          Funtarget_betsResult.BetOnSix <= Funtarget_betsResult.BetOnTwo &&
          Funtarget_betsResult.BetOnSix <= Funtarget_betsResult.BetOnThree &&
          Funtarget_betsResult.BetOnSix <= Funtarget_betsResult.BetOnFour &&
          Funtarget_betsResult.BetOnSix <= Funtarget_betsResult.BetOnFive &&
          Funtarget_betsResult.BetOnSix <= Funtarget_betsResult.BetOnZero &&
          Funtarget_betsResult.BetOnSix <= Funtarget_betsResult.BetOnSeven &&
          Funtarget_betsResult.BetOnSix <= Funtarget_betsResult.BetOnEight &&
          Funtarget_betsResult.BetOnSix <= Funtarget_betsResult.BetOnNine 
        ) {
          Win_singleNo = 6;
        }
        if (
          Funtarget_betsResult.BetOnSeven <= Funtarget_betsResult.BetOnOne &&
          Funtarget_betsResult.BetOnSeven <= Funtarget_betsResult.BetOnTwo &&
          Funtarget_betsResult.BetOnSeven <= Funtarget_betsResult.BetOnThree &&
          Funtarget_betsResult.BetOnSeven <= Funtarget_betsResult.BetOnFour &&
          Funtarget_betsResult.BetOnSeven <= Funtarget_betsResult.BetOnFive &&
          Funtarget_betsResult.BetOnSeven <= Funtarget_betsResult.BetOnSix &&
          Funtarget_betsResult.BetOnSeven <= Funtarget_betsResult.BetOnZero &&
          Funtarget_betsResult.BetOnSeven <= Funtarget_betsResult.BetOnEight &&
          Funtarget_betsResult.BetOnSeven <= Funtarget_betsResult.BetOnNine 
        ) {
          Win_singleNo = 7;
        }
        if (
          Funtarget_betsResult.BetOnEight <= Funtarget_betsResult.BetOnOne &&
          Funtarget_betsResult.BetOnEight <= Funtarget_betsResult.BetOnTwo &&
          Funtarget_betsResult.BetOnEight <= Funtarget_betsResult.BetOnThree &&
          Funtarget_betsResult.BetOnEight <= Funtarget_betsResult.BetOnFour &&
          Funtarget_betsResult.BetOnEight <= Funtarget_betsResult.BetOnFive &&
          Funtarget_betsResult.BetOnEight <= Funtarget_betsResult.BetOnSix &&
          Funtarget_betsResult.BetOnEight <= Funtarget_betsResult.BetOnSeven &&
          Funtarget_betsResult.BetOnEight <= Funtarget_betsResult.BetOnZero &&
          Funtarget_betsResult.BetOnEight <= Funtarget_betsResult.BetOnNine 
        ) {
          Win_singleNo = 8;
        }
        if (
          Funtarget_betsResult.BetOnNine <= Funtarget_betsResult.BetOnOne &&
          Funtarget_betsResult.BetOnNine <= Funtarget_betsResult.BetOnTwo &&
          Funtarget_betsResult.BetOnNine <= Funtarget_betsResult.BetOnThree &&
          Funtarget_betsResult.BetOnNine <= Funtarget_betsResult.BetOnFour &&
          Funtarget_betsResult.BetOnNine <= Funtarget_betsResult.BetOnFive &&
          Funtarget_betsResult.BetOnNine <= Funtarget_betsResult.BetOnSix &&
          Funtarget_betsResult.BetOnNine <= Funtarget_betsResult.BetOnSeven &&
          Funtarget_betsResult.BetOnNine <= Funtarget_betsResult.BetOnEight &&
          Funtarget_betsResult.BetOnNine <= Funtarget_betsResult.BetOnZero 
        ) {
          Win_singleNo = 9;
        }
        */ if (Funtarget_betsResult.BetOnZero == minimumValue) {
          winconatinzero.push(0);
        console.log("if0",Funtarget_betsResult.BetOnZero)

        }
        if (Funtarget_betsResult.BetOnOne == minimumValue) {
          winconatinzero.push(1);
        console.log("if1",Funtarget_betsResult.BetOnOne)

        }

        if (Funtarget_betsResult.BetOnTwo == minimumValue) {
          winconatinzero.push(2);
        console.log("if2",Funtarget_betsResult.BetOnTwo)

        }

        if (Funtarget_betsResult.BetOnThree == minimumValue) {
          winconatinzero.push(3);
        console.log("if3",Funtarget_betsResult.BetOnThree)

        }

        if (Funtarget_betsResult.BetOnFour == minimumValue) {
          winconatinzero.push(4);
        console.log("if4",Funtarget_betsResult.BetOnFour)

        }

        if (Funtarget_betsResult.BetOnFive == minimumValue) {
          winconatinzero.push(5);
        console.log("if5",Funtarget_betsResult.BetOnFive)

        }

        if (Funtarget_betsResult.BetOnSix == minimumValue) {
          winconatinzero.push(6);
        console.log("if6",Funtarget_betsResult.BetOnSix)


        }

        if (Funtarget_betsResult.BetOnSeven == minimumValue) {
          winconatinzero.push(7);
        console.log("if7",Funtarget_betsResult.BetOnSeven)

        }

        if (Funtarget_betsResult.BetOnEight == minimumValue) {
          winconatinzero.push(8);
        console.log("if8",Funtarget_betsResult.BetOnEight)

        }

        if (Funtarget_betsResult.BetOnNine == minimumValue) {
          winconatinzero.push(9);
        console.log("if9",Funtarget_betsResult.BetOnNine)

        }
       

  
        var adminWin= await service.getAdminfuntarget()
        if(
          adminWin.value==-1)
        {
          console.log("wincog***************************************",winconatinzero)


          if (winconatinzero.length > 0) {
            var l = winconatinzero.length;

            var r = Math.floor(Math.random() * l);
            Win_singleNo = winconatinzero[r];
          }
          NewpreviousWin_single.push(Win_singleNo)

                     for(var index=0;index<playerData.length;index++){
                      await OnWinNo({playerId:playerData[index].playerId},Multiplier,Win_singleNo)
                 
                     }
                  
                   
/* let imgrandom=Math.floor(Math.random() * 4);
 var imagenumber=imgrandom
 */ 

 /* var times=[1,1,1,1,1,1,2,1,1,1,1,1,1,2,1,1,1,1,1,1,2,1,1,1,1,1,1,2,1,1,1,1,1,1,1]
  var WinXIndex=Math.floor(Math.random()*times.length)
  winX=times[WinXIndex]
  */ let imgrandom=Math.floor(Math.random() * 4);
  var imagenumber=imgrandom
 
 
  if(winX==2){
   imagenumber=4
    
   }
   else{
   imagenumber=imgrandom
 
   }
  ImageGlobalArr.push(imagenumber)
            Sockets.to(gameRoom).emit(events.OnWinNo, {

      message:Win_singleNo+ " wins",
     // winX:"1X",
    winX:winX+"X",

      winNo: Win_singleNo,
      RoundCount: ROUND_COUNT,
      imagenumber:imagenumber,
      previousWin_single: NewpreviousWin_single,

    });
   
          
        }
        else{
  Win_singleNo=adminWin.value
 // NewpreviousWin_single.push(Win_singleNo)
 /* var times=[1,1,1,1,1,1,2,1,1,1,1,1,1,2,1,1,1,1,1,1,2,1,1,1,1,1,1,2,1,1,1,1,1,1,1]
 var WinXIndex=Math.floor(Math.random()*times.length)
 winX=times[WinXIndex]
  */let imgrandom=Math.floor(Math.random() * 4);
 var imagenumber=imgrandom


 if(winX==2){
  imagenumber=4
   
  }
  else{
  imagenumber=imgrandom

  }
  ImageGlobalArr.push(imagenumber)
  for(var index=0;index<playerData.length;index++){
    await OnWinNo({playerId:playerData[index].playerId},Multiplier,Win_singleNo)

   }


          Sockets.to(gameRoom).emit(events.OnWinNo, {

            message:Win_singleNo+ " wins",
          //  winX:"1X",
    winX:winX+"X",

      imagenumber:imagenumber,

            winNo: Win_singleNo,
            RoundCount: ROUND_COUNT,
            previousWin_single: NewpreviousWin_single,
      
          });



        }
  
      }
      else{
        var Win = 0;
      //  let point = await service.updateUserPoint(data.playerId, 0);
        var winNo = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        var messagearray = [
          "Zero",
          "One",
          "Two",
          "Three",
          "Four",
          "Six",
          "Five",
          "Seven",
          "Eight",
          "Nine",
                ];
  
        var l = winNo.length;
        var r = Math.floor(Math.random() * l);
          Win = winNo[r];
        
        //NewpreviousWin_single.pop();
        if(NewpreviousWin_single[NewpreviousWin_single.length-1]!=Win){
       //   NewpreviousWin_single.push(Win);
  
  
        }
      /*   var times=[1,1,1,1,1,1,2,1,1,1,1,1,1,2,1,1,1,1,1,1,2,1,1,1,1,1,1,2,1,1,1,1,1,1,1]
        var WinXIndex=Math.floor(Math.random()*times.length)
        winX=times[WinXIndex]
       */  let imgrandom=Math.floor(Math.random() * 4);
        var imagenumber=imgrandom
       
       
        if(winX==2){
         imagenumber=4
          
         }
         else{
         imagenumber=imgrandom
       
         }
       
       
          Sockets.to(gameRoom).emit(events.OnWinNo, {

          message: messagearray[Win] + " wins",
          winX:winX+"X",
          imagenumber:imagenumber,
  
          winNo: Win,
          RoundCount: ROUND_COUNT,
          previousWin_single: NewpreviousWin_single,
  
        });
        SuffleBots();
  
      }
      await service.RemovefunBetsAll();
    await service.RemoveAllplayer();

  win_global = -1;
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

module.exports.StartFunTargetGame = StartFunTargetGame;
module.exports.GetSocket = GetSocket;
