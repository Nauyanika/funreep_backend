"use strict";
const debug = require("debug")("test");
const DB_debug = require("debug")("db");
const service = require("../services/NewAndarbharGameService");
const events = require("../Constants").events;
const commonVar = require("../Constants").commonVar;
const state = require("../Constants").state;
const spot = require("../Constants").spot;
const timerVar = require("../Constants").timerVar;
const gameId = 3;
const gameRoom = require("../Constants").selectGame[gameId];
const CardsSet = require("../Constants").setOfCards;

const botManager = require("../utils/BotManager");
const playerManager = require("../utils/PlayerDataManager");

//json
const chipDataJson = require("../jsonfiles/ChipsData.json");
const RandomWinAmounts = require("../jsonfiles/wins.json");

const LEFT_RIGHT_WIN_RATE = 2;
const MIDDLE_WIN_RATE = 8;
var flags1=0;
let Sockets;
let gameState;

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

var previousWin_single = [1, 2, 3, 5, 23, 34, 22, 45, 12, 20];
var NewpreviousWin_single = [1, 2, 3, 5, 23, 34, 22, 45, 12, 20];

let BotsBetsDetails = []; //Array of 6 bots with amount of bet on each spot (array filled by RegisterBots ↓)

//monika
let random_andhar_bahar_final;
let playerName="";
let winPoint = 0;
let Card_A = 0;
let Card_2 = 0;
let Card_3 = 0;
let Card_4 = 0;
let Card_5 = 0;
let Card_6 = 0;
let Card_7 = 0;
let Card_8 = 0;
let Card_9 = 0;
let Card_10 = 0;
let Card_J = 0;
let Card_Q = 0;
let Card_K = 0;

let Card_Heart = 0;
let Card_Diamond = 0;
let Card_Spade = 0;
let Card_Club = 0;

let Card_Red = 0;
let Card_Black = 0;

let Card_A_6 = 0;
let Card_seven = 0;
let Card_8_K = 0;

let Card_Andhar = 0;
let Card_Bahar = 0;
var Win_singleNo = [];
var Win_singleNo2 = [];
var Win_singleNo3 = [];
var Win_singleNo4 = 0;
var win_global = -1;
var win_globalifnoBet = -1;
var win_AndarBaharifnoBet = -1;

var Andar_Card_List =[14,24,4,34];
var  Bahar_Card_List = [8,26,15,3];


var CardName={
  "Card_A":0  ,
  "Card_2": 1 ,
  "Card_3":  2,
  "Card_4":  3,
  "Card_5":  4,
  "Card_6":  5,
  "Card_7":  6,
  "Card_8":  7,
  "Card_9":  8,
  "Card_10":  9,
  "Card_J":  10,
  "Card_Q":  11,
  "Card_K":  12,

  "Card_Heart":13  ,
  "Card_Diamond":14  ,
  "Card_Spade":  15,
  "Card_Club":  16,

  "Card_Red":  17,
  "Card_Black":  18,

  "Card_A_6":  19,
  "Card_seven":  20,
  "Card_8_K":  21,
}

let previousWins = new Array(20);
let isbetPlaced=false

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

function StartNewAndarbharGame(data) {
  SendCurrentRoundInfo(data);
  OnChipMove(data);
  OnBetsPlaced(data);
  OnWinAmount(data)
 // OnWinNo(data);
  ;
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
      socket.removeAllListeners(events.OnBetsPlaced);
      socket.removeAllListeners(events.OnWinNo);
      socket.removeAllListeners(events.OnTimeUp);
      socket.removeAllListeners(events.OnTimerStart);
      socket.removeAllListeners(events.OnCurrentTimer);

      socket.removeAllListeners(commonVar.test);
      socket.removeAllListeners(events.onleaveRoom);
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
    console.log("bet request", data);
    var userBalance = await service.onbalance(data.playerId);
    if (
      userBalance[0].point >=
      (data.Card_A_amount +
      data.Card_2_amount +
      data.Card_3_amount +
      data.Card_4_amount+
      data.Card_5_amount+
      data.Card_6_amount+
      data.Card_7_amount+
      data.Card_8_amount+
      data.Card_9_amount+
      data.Card_10_amount+
      data.Card_J_amount+
      data.Card_Q_amount+
      data.Card_K_amount+
      data.Card_Heart_amount+
      data.Card_Diamond_amount+
      data.Card_Club_amount+
      data.Card_Spade_amount+
      data.Card_Red_amount+
      data.Card_Black_amount+
      data.Card_A_6_amount+
      data.Card_seven_amount+
      data.Card_8_K_amount+
      data.Card_Andhar_amount+
      data.Card_Bahar_amount
      )

        
    ) {

      console.log("bet request", data);
      await service.AddPlayerIdInBetplaced(data.playerId);

    Card_A = data.Card_A_amount;
    Card_2 = data.Card_2_amount;
    Card_3 = data.Card_3_amount;
    Card_4 = data.Card_4_amount;
    Card_5 = data.Card_5_amount;
    Card_6 = data.Card_6_amount;
    Card_7 = data.Card_7_amount;
    Card_8 = data.Card_8_amount;
    Card_9 = data.Card_9_amount;
    Card_10 = data.Card_10_amount;
    Card_J = data.Card_J_amount;
    Card_Q = data.Card_Q_amount;
    Card_K = data.Card_K_amount;

    Card_Heart = data.Card_Heart_amount;
    Card_Diamond = data.Card_Diamond_amount;
    Card_Spade = data.Card_Spade_amount;
    Card_Club = data.Card_Club_amount;

    Card_Red = data.Card_Red_amount;
    Card_Black = data.Card_Black_amount;

    Card_A_6 = data.Card_A_6_amount;
    Card_seven = data.Card_seven_amount;
    Card_8_K = data.Card_8_K_amount;

    Card_Andhar = data.Card_Andhar_amount;
    Card_Bahar = data.Card_Bahar_amount;
    var array=[]
    array.push(data.Card_A_amount)
    array.push(data.Card_2_amount)
    array.push(data.Card_3_amount)
    array.push(data.Card_4_amount)
    array.push(data.Card_5_amount)
    array.push(data.Card_6_amount)
    array.push(data.Card_7_amount)
    array.push(data.Card_8_amount)
    array.push(data.Card_9_amount)
    array.push(data.Card_10_amount)
    array.push(data.Card_J_amount)
    array.push(data.Card_Q_amount)
    array.push(data.Card_K_amount)


    array.push(data.Card_Heart_amount)
    array.push(data.Card_Diamond_amount)
    array.push(data.Card_Spade_amount)
    array.push(data.Card_Club_amount)
    array.push(data.Card_Red_amount)
    array.push(data.Card_Black_amount)

    array.push(data.Card_A_6_amount)
    array.push(data.Card_seven_amount)
    array.push(data.Card_8_K_amount)
    array.push(data.Card_Andhar_amount)
    array.push(data.Card_Bahar_amount)
     
    
    isbetPlaced=true
    
    Win_singleNo=array.indexOf(Math.min(...array))
    
    playerName = data.playerId;
    /*   usersingleNoChoice=data.betNo;
       BetType=data.BetType
 */
    let point = await service.getUserPoint(
      data.playerId,
      data.Card_A_amount +
        data.Card_2_amount +
        data.Card_3_amount +
        data.Card_4_amount +
        data.Card_5_amount +
        data.Card_6_amount +
        data.Card_7_amount +
        data.Card_8_amount +
        data.Card_9_amount +
        data.Card_10_amount +
        data.Card_J_amount +
        data.Card_Q_amount +
        data.Card_K_amount +
        data.Card_Heart_amount +
        data.Card_Diamond_amount +
        data.Card_Spade_amount +
        data.Card_Club_amount +
        data.Card_Red_amount +
        data.Card_Black_amount +
        data.Card_A_6_amount +
        data.Card_seven_amount +
        data.Card_8_K_amount +
        data.Card_Andhar_amount +
        data.Card_Bahar_amount
    );
    console.log("Point", point);

    await service.AndarBaharBets(
      data.Card_A_amount ,
      data.Card_2_amount ,
      data.Card_3_amount ,
      data.Card_4_amount,
      data.Card_5_amount,
      data.Card_6_amount,
      data.Card_7_amount,
      data.Card_8_amount,
      data.Card_9_amount,
      data.Card_10_amount,
      data.Card_J_amount,
      data.Card_Q_amount,
      data.Card_K_amount,
      data.Card_Heart_amount,
      data.Card_Diamond_amount,
      data.Card_Club_amount,
      data.Card_Spade_amount,
      data.Card_Red_amount,
      data.Card_Black_amount,
      data.Card_A_6_amount,
      data.Card_seven_amount,
      data.Card_8_K_amount,
      data.Card_Andhar_amount ,
      data.Card_Bahar_amount
      );


      var AndarBahar_betsResult = await service.DetailAndarBahar();
      console.log("DetailAndarBahar", AndarBahar_betsResult);
     




      if (
        AndarBahar_betsResult.Card_A_amount < AndarBahar_betsResult.Card_2_amount &&
        AndarBahar_betsResult.Card_A_amount < AndarBahar_betsResult.Card_3_amount &&
        AndarBahar_betsResult.Card_A_amount < AndarBahar_betsResult.Card_4_amount &&
        AndarBahar_betsResult.Card_A_amount < AndarBahar_betsResult.Card_5_amount &&
        AndarBahar_betsResult.Card_A_amount < AndarBahar_betsResult.Card_6_amount &&
        AndarBahar_betsResult.Card_A_amount < AndarBahar_betsResult.Card_7_amount &&
        AndarBahar_betsResult.Card_A_amount < AndarBahar_betsResult.Card_8_amount &&
        AndarBahar_betsResult.Card_A_amount < AndarBahar_betsResult.Card_9_amount &&
        AndarBahar_betsResult.Card_A_amount < AndarBahar_betsResult.Card_10_amount &&
        AndarBahar_betsResult.Card_A_amount < AndarBahar_betsResult.Card_J_amount&&
        AndarBahar_betsResult.Card_A_amount < AndarBahar_betsResult.Card_Q_amount &&
        AndarBahar_betsResult.Card_A_amount < AndarBahar_betsResult.Card_K_amount &&
        AndarBahar_betsResult.Card_A_amount < AndarBahar_betsResult.Card_Heart_amount &&
        AndarBahar_betsResult.Card_A_amount < AndarBahar_betsResult.Card_Diamond_amount &&
        AndarBahar_betsResult.Card_A_amount < AndarBahar_betsResult.Card_Club_amount &&
        AndarBahar_betsResult.Card_A_amount < AndarBahar_betsResult.Card_Spade_amount &&
        AndarBahar_betsResult.Card_A_amount < AndarBahar_betsResult.Card_Red_amount &&
        AndarBahar_betsResult.Card_A_amount < AndarBahar_betsResult.Card_Black_amount &&
        AndarBahar_betsResult.Card_A_amount < AndarBahar_betsResult.Card_A_6_amount &&
        AndarBahar_betsResult.Card_A_amount < AndarBahar_betsResult.Card_seven_amount &&
        AndarBahar_betsResult.Card_A_amount < AndarBahar_betsResult.Card_8_K_amount
      ) {
        Win_singleNo = 0;
      }
      if (
        AndarBahar_betsResult.Card_2_amount < AndarBahar_betsResult.Card_A_amount &&
        AndarBahar_betsResult.Card_2_amount < AndarBahar_betsResult.Card_3_amount &&
        AndarBahar_betsResult.Card_2_amount < AndarBahar_betsResult.Card_4_amount &&
        AndarBahar_betsResult.Card_2_amount < AndarBahar_betsResult.Card_5_amount &&
        AndarBahar_betsResult.Card_2_amount < AndarBahar_betsResult.Card_6_amount &&
        AndarBahar_betsResult.Card_2_amount < AndarBahar_betsResult.Card_7_amount &&
        AndarBahar_betsResult.Card_2_amount < AndarBahar_betsResult.Card_8_amount &&
        AndarBahar_betsResult.Card_2_amount < AndarBahar_betsResult.Card_9_amount &&
        AndarBahar_betsResult.Card_2_amount < AndarBahar_betsResult.Card_10_amount &&
        AndarBahar_betsResult.Card_2_amount < AndarBahar_betsResult.Card_J_amount&&
        AndarBahar_betsResult.Card_2_amount < AndarBahar_betsResult.Card_Q_amount &&
        AndarBahar_betsResult.Card_2_amount < AndarBahar_betsResult.Card_K_amount &&
        AndarBahar_betsResult.Card_2_amount < AndarBahar_betsResult.Card_Heart_amount &&
        AndarBahar_betsResult.Card_2_amount < AndarBahar_betsResult.Card_Diamond_amount &&
        AndarBahar_betsResult.Card_2_amount < AndarBahar_betsResult.Card_Club_amount &&
        AndarBahar_betsResult.Card_2_amount < AndarBahar_betsResult.Card_Spade_amount &&
        AndarBahar_betsResult.Card_2_amount < AndarBahar_betsResult.Card_Red_amount &&
        AndarBahar_betsResult.Card_2_amount < AndarBahar_betsResult.Card_Black_amount &&
        AndarBahar_betsResult.Card_2_amount < AndarBahar_betsResult.Card_A_6_amount &&
        AndarBahar_betsResult.Card_2_amount < AndarBahar_betsResult.Card_seven_amount &&
        AndarBahar_betsResult.Card_2_amount < AndarBahar_betsResult.Card_8_K_amount
      ) {
        Win_singleNo = 1;
      }
      if (
        AndarBahar_betsResult.Card_3_amount < AndarBahar_betsResult.Card_2_amount &&
        AndarBahar_betsResult.Card_3_amount < AndarBahar_betsResult.Card_A_amount &&
        AndarBahar_betsResult.Card_3_amount < AndarBahar_betsResult.Card_4_amount &&
        AndarBahar_betsResult.Card_3_amount < AndarBahar_betsResult.Card_5_amount &&
        AndarBahar_betsResult.Card_3_amount < AndarBahar_betsResult.Card_6_amount &&
        AndarBahar_betsResult.Card_3_amount < AndarBahar_betsResult.Card_7_amount &&
        AndarBahar_betsResult.Card_3_amount < AndarBahar_betsResult.Card_8_amount &&
        AndarBahar_betsResult.Card_3_amount < AndarBahar_betsResult.Card_9_amount &&
        AndarBahar_betsResult.Card_3_amount < AndarBahar_betsResult.Card_10_amount &&
        AndarBahar_betsResult.Card_3_amount < AndarBahar_betsResult.Card_J_amount&&
        AndarBahar_betsResult.Card_3_amount < AndarBahar_betsResult.Card_Q_amount &&
        AndarBahar_betsResult.Card_3_amount < AndarBahar_betsResult.Card_K_amount &&
        AndarBahar_betsResult.Card_3_amount < AndarBahar_betsResult.Card_Heart_amount &&
        AndarBahar_betsResult.Card_3_amount < AndarBahar_betsResult.Card_Diamond_amount &&
        AndarBahar_betsResult.Card_3_amount < AndarBahar_betsResult.Card_Club_amount &&
        AndarBahar_betsResult.Card_3_amount < AndarBahar_betsResult.Card_Spade_amount &&
        AndarBahar_betsResult.Card_3_amount < AndarBahar_betsResult.Card_Red_amount &&
        AndarBahar_betsResult.Card_3_amount < AndarBahar_betsResult.Card_Black_amount &&
        AndarBahar_betsResult.Card_3_amount < AndarBahar_betsResult.Card_A_6_amount &&
        AndarBahar_betsResult.Card_3_amount < AndarBahar_betsResult.Card_seven_amount &&
        AndarBahar_betsResult.Card_3_amount < AndarBahar_betsResult.Card_8_K_amount
      ) {
        Win_singleNo = 2;
      }
      if (
        AndarBahar_betsResult.Card_4_amount < AndarBahar_betsResult.Card_2_amount &&
        AndarBahar_betsResult.Card_4_amount < AndarBahar_betsResult.Card_3_amount &&
        AndarBahar_betsResult.Card_4_amount < AndarBahar_betsResult.Card_A_amount &&
        AndarBahar_betsResult.Card_4_amount < AndarBahar_betsResult.Card_5_amount &&
        AndarBahar_betsResult.Card_4_amount < AndarBahar_betsResult.Card_6_amount &&
        AndarBahar_betsResult.Card_4_amount < AndarBahar_betsResult.Card_7_amount &&
        AndarBahar_betsResult.Card_4_amount < AndarBahar_betsResult.Card_8_amount &&
        AndarBahar_betsResult.Card_4_amount < AndarBahar_betsResult.Card_9_amount &&
        AndarBahar_betsResult.Card_4_amount < AndarBahar_betsResult.Card_10_amount &&
        AndarBahar_betsResult.Card_4_amount < AndarBahar_betsResult.Card_J_amount&&
        AndarBahar_betsResult.Card_4_amount < AndarBahar_betsResult.Card_Q_amount &&
        AndarBahar_betsResult.Card_4_amount < AndarBahar_betsResult.Card_K_amount &&
        AndarBahar_betsResult.Card_4_amount < AndarBahar_betsResult.Card_Heart_amount &&
        AndarBahar_betsResult.Card_4_amount < AndarBahar_betsResult.Card_Diamond_amount &&
        AndarBahar_betsResult.Card_4_amount < AndarBahar_betsResult.Card_Club_amount &&
        AndarBahar_betsResult.Card_4_amount < AndarBahar_betsResult.Card_Spade_amount &&
        AndarBahar_betsResult.Card_4_amount < AndarBahar_betsResult.Card_Red_amount &&
        AndarBahar_betsResult.Card_4_amount < AndarBahar_betsResult.Card_Black_amount &&
        AndarBahar_betsResult.Card_4_amount < AndarBahar_betsResult.Card_A_6_amount &&
        AndarBahar_betsResult.Card_4_amount < AndarBahar_betsResult.Card_seven_amount &&
        AndarBahar_betsResult.Card_4_amount < AndarBahar_betsResult.Card_8_K_amount
      ) {
        Win_singleNo = 3;
      }

      if (
        AndarBahar_betsResult.Card_5_amount < AndarBahar_betsResult.Card_2_amount &&
        AndarBahar_betsResult.Card_5_amount < AndarBahar_betsResult.Card_3_amount &&
        AndarBahar_betsResult.Card_5_amount < AndarBahar_betsResult.Card_4_amount &&
        AndarBahar_betsResult.Card_5_amount < AndarBahar_betsResult.Card_A_amount &&
        AndarBahar_betsResult.Card_5_amount < AndarBahar_betsResult.Card_6_amount &&
        AndarBahar_betsResult.Card_5_amount < AndarBahar_betsResult.Card_7_amount &&
        AndarBahar_betsResult.Card_5_amount < AndarBahar_betsResult.Card_8_amount &&
        AndarBahar_betsResult.Card_5_amount < AndarBahar_betsResult.Card_9_amount &&
        AndarBahar_betsResult.Card_5_amount < AndarBahar_betsResult.Card_10_amount &&
        AndarBahar_betsResult.Card_5_amount < AndarBahar_betsResult.Card_J_amount&&
        AndarBahar_betsResult.Card_5_amount < AndarBahar_betsResult.Card_Q_amount &&
        AndarBahar_betsResult.Card_5_amount < AndarBahar_betsResult.Card_K_amount &&
        AndarBahar_betsResult.Card_5_amount < AndarBahar_betsResult.Card_Heart_amount &&
        AndarBahar_betsResult.Card_5_amount < AndarBahar_betsResult.Card_Diamond_amount &&
        AndarBahar_betsResult.Card_5_amount < AndarBahar_betsResult.Card_Club_amount &&
        AndarBahar_betsResult.Card_5_amount < AndarBahar_betsResult.Card_Spade_amount &&
        AndarBahar_betsResult.Card_5_amount < AndarBahar_betsResult.Card_Red_amount &&
        AndarBahar_betsResult.Card_5_amount < AndarBahar_betsResult.Card_Black_amount &&
        AndarBahar_betsResult.Card_5_amount < AndarBahar_betsResult.Card_A_6_amount &&
        AndarBahar_betsResult.Card_5_amount < AndarBahar_betsResult.Card_seven_amount &&
        AndarBahar_betsResult.Card_5_amount < AndarBahar_betsResult.Card_8_K_amount
      ) {
        Win_singleNo = 4;
      }


      if (
        AndarBahar_betsResult.Card_6_amount < AndarBahar_betsResult.Card_2_amount &&
        AndarBahar_betsResult.Card_6_amount < AndarBahar_betsResult.Card_3_amount &&
        AndarBahar_betsResult.Card_6_amount < AndarBahar_betsResult.Card_4_amount &&
        AndarBahar_betsResult.Card_6_amount < AndarBahar_betsResult.Card_5_amount &&
        AndarBahar_betsResult.Card_6_amount < AndarBahar_betsResult.Card_A_amount &&
        AndarBahar_betsResult.Card_6_amount < AndarBahar_betsResult.Card_7_amount &&
        AndarBahar_betsResult.Card_6_amount < AndarBahar_betsResult.Card_8_amount &&
        AndarBahar_betsResult.Card_6_amount < AndarBahar_betsResult.Card_9_amount &&
        AndarBahar_betsResult.Card_6_amount < AndarBahar_betsResult.Card_10_amount &&
        AndarBahar_betsResult.Card_6_amount < AndarBahar_betsResult.Card_J_amount&&
        AndarBahar_betsResult.Card_6_amount < AndarBahar_betsResult.Card_Q_amount &&
        AndarBahar_betsResult.Card_6_amount < AndarBahar_betsResult.Card_K_amount &&
        AndarBahar_betsResult.Card_6_amount < AndarBahar_betsResult.Card_Heart_amount &&
        AndarBahar_betsResult.Card_6_amount < AndarBahar_betsResult.Card_Diamond_amount &&
        AndarBahar_betsResult.Card_6_amount < AndarBahar_betsResult.Card_Club_amount &&
        AndarBahar_betsResult.Card_6_amount < AndarBahar_betsResult.Card_Spade_amount &&
        AndarBahar_betsResult.Card_6_amount < AndarBahar_betsResult.Card_Red_amount &&
        AndarBahar_betsResult.Card_6_amount < AndarBahar_betsResult.Card_Black_amount &&
        AndarBahar_betsResult.Card_6_amount < AndarBahar_betsResult.Card_A_6_amount &&
        AndarBahar_betsResult.Card_6_amount < AndarBahar_betsResult.Card_seven_amount &&
        AndarBahar_betsResult.Card_6_amount < AndarBahar_betsResult.Card_8_K_amount
      ) {
        Win_singleNo = 5;
      }


      if (
        AndarBahar_betsResult.Card_7_amount < AndarBahar_betsResult.Card_2_amount &&
        AndarBahar_betsResult.Card_7_amount < AndarBahar_betsResult.Card_3_amount &&
        AndarBahar_betsResult.Card_7_amount < AndarBahar_betsResult.Card_4_amount &&
        AndarBahar_betsResult.Card_7_amount < AndarBahar_betsResult.Card_5_amount &&
        AndarBahar_betsResult.Card_7_amount < AndarBahar_betsResult.Card_6_amount &&
        AndarBahar_betsResult.Card_7_amount < AndarBahar_betsResult.Card_A_amount &&
        AndarBahar_betsResult.Card_7_amount < AndarBahar_betsResult.Card_8_amount &&
        AndarBahar_betsResult.Card_7_amount < AndarBahar_betsResult.Card_9_amount &&
        AndarBahar_betsResult.Card_7_amount < AndarBahar_betsResult.Card_10_amount &&
        AndarBahar_betsResult.Card_7_amount < AndarBahar_betsResult.Card_J_amount&&
        AndarBahar_betsResult.Card_7_amount < AndarBahar_betsResult.Card_Q_amount &&
        AndarBahar_betsResult.Card_7_amount < AndarBahar_betsResult.Card_K_amount &&
        AndarBahar_betsResult.Card_7_amount < AndarBahar_betsResult.Card_Heart_amount &&
        AndarBahar_betsResult.Card_7_amount < AndarBahar_betsResult.Card_Diamond_amount &&
        AndarBahar_betsResult.Card_7_amount < AndarBahar_betsResult.Card_Club_amount &&
        AndarBahar_betsResult.Card_7_amount < AndarBahar_betsResult.Card_Spade_amount &&
        AndarBahar_betsResult.Card_7_amount < AndarBahar_betsResult.Card_Red_amount &&
        AndarBahar_betsResult.Card_7_amount < AndarBahar_betsResult.Card_Black_amount &&
        AndarBahar_betsResult.Card_7_amount < AndarBahar_betsResult.Card_A_6_amount &&
        AndarBahar_betsResult.Card_7_amount < AndarBahar_betsResult.Card_seven_amount &&
        AndarBahar_betsResult.Card_7_amount < AndarBahar_betsResult.Card_8_K_amount
      ) {
        Win_singleNo = 6;
      }
      if (
        AndarBahar_betsResult.Card_8_amount < AndarBahar_betsResult.Card_2_amount &&
        AndarBahar_betsResult.Card_8_amount < AndarBahar_betsResult.Card_3_amount &&
        AndarBahar_betsResult.Card_8_amount < AndarBahar_betsResult.Card_4_amount &&
        AndarBahar_betsResult.Card_8_amount < AndarBahar_betsResult.Card_5_amount &&
        AndarBahar_betsResult.Card_8_amount < AndarBahar_betsResult.Card_6_amount &&
        AndarBahar_betsResult.Card_8_amount < AndarBahar_betsResult.Card_7_amount &&
        AndarBahar_betsResult.Card_8_amount < AndarBahar_betsResult.Card_A_amount &&
        AndarBahar_betsResult.Card_8_amount < AndarBahar_betsResult.Card_9_amount &&
        AndarBahar_betsResult.Card_8_amount < AndarBahar_betsResult.Card_10_amount &&
        AndarBahar_betsResult.Card_8_amount < AndarBahar_betsResult.Card_J_amount&&
        AndarBahar_betsResult.Card_8_amount < AndarBahar_betsResult.Card_Q_amount &&
        AndarBahar_betsResult.Card_8_amount < AndarBahar_betsResult.Card_K_amount &&
        AndarBahar_betsResult.Card_8_amount < AndarBahar_betsResult.Card_Heart_amount &&
        AndarBahar_betsResult.Card_8_amount < AndarBahar_betsResult.Card_Diamond_amount &&
        AndarBahar_betsResult.Card_8_amount < AndarBahar_betsResult.Card_Club_amount &&
        AndarBahar_betsResult.Card_8_amount < AndarBahar_betsResult.Card_Spade_amount &&
        AndarBahar_betsResult.Card_8_amount < AndarBahar_betsResult.Card_Red_amount &&
        AndarBahar_betsResult.Card_8_amount < AndarBahar_betsResult.Card_Black_amount &&
        AndarBahar_betsResult.Card_8_amount < AndarBahar_betsResult.Card_A_6_amount &&
        AndarBahar_betsResult.Card_8_amount < AndarBahar_betsResult.Card_seven_amount &&
        AndarBahar_betsResult.Card_8_amount < AndarBahar_betsResult.Card_8_K_amount
      ) {
        Win_singleNo = 7;
      }
      if (
        AndarBahar_betsResult.Card_9_amount < AndarBahar_betsResult.Card_2_amount &&
        AndarBahar_betsResult.Card_9_amount < AndarBahar_betsResult.Card_3_amount &&
        AndarBahar_betsResult.Card_9_amount < AndarBahar_betsResult.Card_4_amount &&
        AndarBahar_betsResult.Card_9_amount < AndarBahar_betsResult.Card_5_amount &&
        AndarBahar_betsResult.Card_9_amount < AndarBahar_betsResult.Card_6_amount &&
        AndarBahar_betsResult.Card_9_amount < AndarBahar_betsResult.Card_7_amount &&
        AndarBahar_betsResult.Card_9_amount < AndarBahar_betsResult.Card_8_amount &&
        AndarBahar_betsResult.Card_9_amount < AndarBahar_betsResult.Card_A_amount &&
        AndarBahar_betsResult.Card_9_amount < AndarBahar_betsResult.Card_10_amount &&
        AndarBahar_betsResult.Card_9_amount < AndarBahar_betsResult.Card_J_amount&&
        AndarBahar_betsResult.Card_9_amount < AndarBahar_betsResult.Card_Q_amount &&
        AndarBahar_betsResult.Card_9_amount < AndarBahar_betsResult.Card_K_amount &&
        AndarBahar_betsResult.Card_9_amount < AndarBahar_betsResult.Card_Heart_amount &&
        AndarBahar_betsResult.Card_9_amount < AndarBahar_betsResult.Card_Diamond_amount &&
        AndarBahar_betsResult.Card_9_amount < AndarBahar_betsResult.Card_Club_amount &&
        AndarBahar_betsResult.Card_9_amount < AndarBahar_betsResult.Card_Spade_amount &&
        AndarBahar_betsResult.Card_9_amount < AndarBahar_betsResult.Card_Red_amount &&
        AndarBahar_betsResult.Card_9_amount < AndarBahar_betsResult.Card_Black_amount &&
        AndarBahar_betsResult.Card_9_amount < AndarBahar_betsResult.Card_A_6_amount &&
        AndarBahar_betsResult.Card_9_amount < AndarBahar_betsResult.Card_seven_amount &&
        AndarBahar_betsResult.Card_9_amount < AndarBahar_betsResult.Card_8_K_amount
      ) {
        Win_singleNo = 8;
      }
      if (
        AndarBahar_betsResult.Card_10_amount < AndarBahar_betsResult.Card_2_amount &&
        AndarBahar_betsResult.Card_10_amount < AndarBahar_betsResult.Card_3_amount &&
        AndarBahar_betsResult.Card_10_amount < AndarBahar_betsResult.Card_4_amount &&
        AndarBahar_betsResult.Card_10_amount < AndarBahar_betsResult.Card_5_amount &&
        AndarBahar_betsResult.Card_10_amount < AndarBahar_betsResult.Card_6_amount &&
        AndarBahar_betsResult.Card_10_amount < AndarBahar_betsResult.Card_7_amount &&
        AndarBahar_betsResult.Card_10_amount < AndarBahar_betsResult.Card_8_amount &&
        AndarBahar_betsResult.Card_10_amount < AndarBahar_betsResult.Card_9_amount &&
        AndarBahar_betsResult.Card_10_amount < AndarBahar_betsResult.Card_A_amount &&
        AndarBahar_betsResult.Card_10_amount < AndarBahar_betsResult.Card_J_amount&&
        AndarBahar_betsResult.Card_10_amount < AndarBahar_betsResult.Card_Q_amount &&
        AndarBahar_betsResult.Card_10_amount < AndarBahar_betsResult.Card_K_amount &&
        AndarBahar_betsResult.Card_10_amount < AndarBahar_betsResult.Card_Heart_amount &&
        AndarBahar_betsResult.Card_10_amount < AndarBahar_betsResult.Card_Diamond_amount &&
        AndarBahar_betsResult.Card_10_amount < AndarBahar_betsResult.Card_Club_amount &&
        AndarBahar_betsResult.Card_10_amount < AndarBahar_betsResult.Card_Spade_amount &&
        AndarBahar_betsResult.Card_10_amount < AndarBahar_betsResult.Card_Red_amount &&
        AndarBahar_betsResult.Card_10_amount < AndarBahar_betsResult.Card_Black_amount &&
        AndarBahar_betsResult.Card_10_amount < AndarBahar_betsResult.Card_A_6_amount &&
        AndarBahar_betsResult.Card_10_amount < AndarBahar_betsResult.Card_seven_amount &&
        AndarBahar_betsResult.Card_10_amount < AndarBahar_betsResult.Card_8_K_amount
      ) {
        Win_singleNo = 9;
      }
      if (
        AndarBahar_betsResult.Card_J_amount < AndarBahar_betsResult.Card_2_amount &&
        AndarBahar_betsResult.Card_J_amount < AndarBahar_betsResult.Card_3_amount &&
        AndarBahar_betsResult.Card_J_amount < AndarBahar_betsResult.Card_4_amount &&
        AndarBahar_betsResult.Card_J_amount < AndarBahar_betsResult.Card_5_amount &&
        AndarBahar_betsResult.Card_J_amount < AndarBahar_betsResult.Card_6_amount &&
        AndarBahar_betsResult.Card_J_amount < AndarBahar_betsResult.Card_7_amount &&
        AndarBahar_betsResult.Card_J_amount < AndarBahar_betsResult.Card_8_amount &&
        AndarBahar_betsResult.Card_J_amount < AndarBahar_betsResult.Card_9_amount &&
        AndarBahar_betsResult.Card_J_amount < AndarBahar_betsResult.Card_10_amount &&
        AndarBahar_betsResult.Card_J_amount < AndarBahar_betsResult.Card_A_amount&&
        AndarBahar_betsResult.Card_J_amount < AndarBahar_betsResult.Card_Q_amount &&
        AndarBahar_betsResult.Card_J_amount < AndarBahar_betsResult.Card_K_amount &&
        AndarBahar_betsResult.Card_J_amount < AndarBahar_betsResult.Card_Heart_amount &&
        AndarBahar_betsResult.Card_J_amount < AndarBahar_betsResult.Card_Diamond_amount &&
        AndarBahar_betsResult.Card_J_amount < AndarBahar_betsResult.Card_Club_amount &&
        AndarBahar_betsResult.Card_J_amount < AndarBahar_betsResult.Card_Spade_amount &&
        AndarBahar_betsResult.Card_J_amount < AndarBahar_betsResult.Card_Red_amount &&
        AndarBahar_betsResult.Card_J_amount < AndarBahar_betsResult.Card_Black_amount &&
        AndarBahar_betsResult.Card_J_amount < AndarBahar_betsResult.Card_A_6_amount &&
        AndarBahar_betsResult.Card_J_amount < AndarBahar_betsResult.Card_seven_amount &&
        AndarBahar_betsResult.Card_J_amount < AndarBahar_betsResult.Card_8_K_amount
      ) {
        Win_singleNo = 10;
      }



      if (
        AndarBahar_betsResult.Card_Q_amount < AndarBahar_betsResult.Card_2_amount &&
        AndarBahar_betsResult.Card_Q_amount < AndarBahar_betsResult.Card_3_amount &&
        AndarBahar_betsResult.Card_Q_amount < AndarBahar_betsResult.Card_4_amount &&
        AndarBahar_betsResult.Card_Q_amount < AndarBahar_betsResult.Card_5_amount &&
        AndarBahar_betsResult.Card_Q_amount < AndarBahar_betsResult.Card_6_amount &&
        AndarBahar_betsResult.Card_Q_amount < AndarBahar_betsResult.Card_7_amount &&
        AndarBahar_betsResult.Card_Q_amount < AndarBahar_betsResult.Card_8_amount &&
        AndarBahar_betsResult.Card_Q_amount < AndarBahar_betsResult.Card_9_amount &&
        AndarBahar_betsResult.Card_Q_amount < AndarBahar_betsResult.Card_10_amount &&
        AndarBahar_betsResult.Card_Q_amount < AndarBahar_betsResult.Card_J_amount&&
        AndarBahar_betsResult.Card_Q_amount < AndarBahar_betsResult.Card_A_amount &&
        AndarBahar_betsResult.Card_Q_amount < AndarBahar_betsResult.Card_K_amount &&
        AndarBahar_betsResult.Card_Q_amount < AndarBahar_betsResult.Card_Heart_amount &&
        AndarBahar_betsResult.Card_Q_amount < AndarBahar_betsResult.Card_Diamond_amount &&
        AndarBahar_betsResult.Card_Q_amount < AndarBahar_betsResult.Card_Club_amount &&
        AndarBahar_betsResult.Card_Q_amount < AndarBahar_betsResult.Card_Spade_amount &&
        AndarBahar_betsResult.Card_Q_amount < AndarBahar_betsResult.Card_Red_amount &&
        AndarBahar_betsResult.Card_Q_amount < AndarBahar_betsResult.Card_Black_amount &&
        AndarBahar_betsResult.Card_Q_amount < AndarBahar_betsResult.Card_A_6_amount &&
        AndarBahar_betsResult.Card_Q_amount < AndarBahar_betsResult.Card_seven_amount &&
        AndarBahar_betsResult.Card_Q_amount < AndarBahar_betsResult.Card_8_K_amount
      ) {
        Win_singleNo = 11;
      }
      if (
        AndarBahar_betsResult.Card_K_amount < AndarBahar_betsResult.Card_2_amount &&
        AndarBahar_betsResult.Card_K_amount < AndarBahar_betsResult.Card_3_amount &&
        AndarBahar_betsResult.Card_K_amount < AndarBahar_betsResult.Card_4_amount &&
        AndarBahar_betsResult.Card_K_amount < AndarBahar_betsResult.Card_5_amount &&
        AndarBahar_betsResult.Card_K_amount < AndarBahar_betsResult.Card_6_amount &&
        AndarBahar_betsResult.Card_K_amount < AndarBahar_betsResult.Card_7_amount &&
        AndarBahar_betsResult.Card_K_amount < AndarBahar_betsResult.Card_8_amount &&
        AndarBahar_betsResult.Card_K_amount < AndarBahar_betsResult.Card_9_amount &&
        AndarBahar_betsResult.Card_K_amount < AndarBahar_betsResult.Card_10_amount &&
        AndarBahar_betsResult.Card_K_amount < AndarBahar_betsResult.Card_J_amount&&
        AndarBahar_betsResult.Card_K_amount < AndarBahar_betsResult.Card_Q_amount &&
        AndarBahar_betsResult.Card_K_amount < AndarBahar_betsResult.Card_A_amount &&
        AndarBahar_betsResult.Card_K_amount < AndarBahar_betsResult.Card_Heart_amount &&
        AndarBahar_betsResult.Card_K_amount < AndarBahar_betsResult.Card_Diamond_amount &&
        AndarBahar_betsResult.Card_K_amount < AndarBahar_betsResult.Card_Club_amount &&
        AndarBahar_betsResult.Card_K_amount < AndarBahar_betsResult.Card_Spade_amount &&
        AndarBahar_betsResult.Card_K_amount < AndarBahar_betsResult.Card_Red_amount &&
        AndarBahar_betsResult.Card_K_amount < AndarBahar_betsResult.Card_Black_amount &&
        AndarBahar_betsResult.Card_K_amount < AndarBahar_betsResult.Card_A_6_amount &&
        AndarBahar_betsResult.Card_K_amount < AndarBahar_betsResult.Card_seven_amount &&
        AndarBahar_betsResult.Card_K_amount < AndarBahar_betsResult.Card_8_K_amount
      ) {
        Win_singleNo = 12;
      }

      if (
        AndarBahar_betsResult.Card_Heart_amount < AndarBahar_betsResult.Card_2_amount &&
        AndarBahar_betsResult.Card_Heart_amount < AndarBahar_betsResult.Card_3_amount &&
        AndarBahar_betsResult.Card_Heart_amount < AndarBahar_betsResult.Card_4_amount &&
        AndarBahar_betsResult.Card_Heart_amount < AndarBahar_betsResult.Card_5_amount &&
        AndarBahar_betsResult.Card_Heart_amount < AndarBahar_betsResult.Card_6_amount &&
        AndarBahar_betsResult.Card_Heart_amount < AndarBahar_betsResult.Card_7_amount &&
        AndarBahar_betsResult.Card_Heart_amount < AndarBahar_betsResult.Card_8_amount &&
        AndarBahar_betsResult.Card_Heart_amount < AndarBahar_betsResult.Card_9_amount &&
        AndarBahar_betsResult.Card_Heart_amount < AndarBahar_betsResult.Card_10_amount &&
        AndarBahar_betsResult.Card_Heart_amount < AndarBahar_betsResult.Card_J_amount&&
        AndarBahar_betsResult.Card_Heart_amount < AndarBahar_betsResult.Card_Q_amount &&
        AndarBahar_betsResult.Card_Heart_amount < AndarBahar_betsResult.Card_K_amount &&
        AndarBahar_betsResult.Card_Heart_amount < AndarBahar_betsResult.Card_A_amount &&
        AndarBahar_betsResult.Card_Heart_amount < AndarBahar_betsResult.Card_Diamond_amount &&
        AndarBahar_betsResult.Card_Heart_amount < AndarBahar_betsResult.Card_Club_amount &&
        AndarBahar_betsResult.Card_Heart_amount < AndarBahar_betsResult.Card_Spade_amount &&
        AndarBahar_betsResult.Card_Heart_amount < AndarBahar_betsResult.Card_Red_amount &&
        AndarBahar_betsResult.Card_Heart_amount < AndarBahar_betsResult.Card_Black_amount &&
        AndarBahar_betsResult.Card_Heart_amount < AndarBahar_betsResult.Card_A_6_amount &&
        AndarBahar_betsResult.Card_Heart_amount < AndarBahar_betsResult.Card_seven_amount &&
        AndarBahar_betsResult.Card_Heart_amount < AndarBahar_betsResult.Card_8_K_amount
      ) {
        Win_singleNo = 13;
      }


      if (
        AndarBahar_betsResult.Card_Diamond_amount < AndarBahar_betsResult.Card_2_amount &&
        AndarBahar_betsResult.Card_Diamond_amount < AndarBahar_betsResult.Card_3_amount &&
        AndarBahar_betsResult.Card_Diamond_amount < AndarBahar_betsResult.Card_4_amount &&
        AndarBahar_betsResult.Card_Diamond_amount < AndarBahar_betsResult.Card_5_amount &&
        AndarBahar_betsResult.Card_Diamond_amount < AndarBahar_betsResult.Card_6_amount &&
        AndarBahar_betsResult.Card_Diamond_amount < AndarBahar_betsResult.Card_7_amount &&
        AndarBahar_betsResult.Card_Diamond_amount < AndarBahar_betsResult.Card_8_amount &&
        AndarBahar_betsResult.Card_Diamond_amount < AndarBahar_betsResult.Card_9_amount &&
        AndarBahar_betsResult.Card_Diamond_amount < AndarBahar_betsResult.Card_10_amount &&
        AndarBahar_betsResult.Card_Diamond_amount < AndarBahar_betsResult.Card_J_amount&&
        AndarBahar_betsResult.Card_Diamond_amount < AndarBahar_betsResult.Card_Q_amount &&
        AndarBahar_betsResult.Card_Diamond_amount < AndarBahar_betsResult.Card_K_amount &&
        AndarBahar_betsResult.Card_Diamond_amount < AndarBahar_betsResult.Card_Heart_amount &&
        AndarBahar_betsResult.Card_Diamond_amount < AndarBahar_betsResult.Card_A_amount &&
        AndarBahar_betsResult.Card_Diamond_amount < AndarBahar_betsResult.Card_Club_amount &&
        AndarBahar_betsResult.Card_Diamond_amount < AndarBahar_betsResult.Card_Spade_amount &&
        AndarBahar_betsResult.Card_Diamond_amount < AndarBahar_betsResult.Card_Red_amount &&
        AndarBahar_betsResult.Card_Diamond_amount < AndarBahar_betsResult.Card_Black_amount &&
        AndarBahar_betsResult.Card_Diamond_amount < AndarBahar_betsResult.Card_A_6_amount &&
        AndarBahar_betsResult.Card_Diamond_amount < AndarBahar_betsResult.Card_seven_amount &&
        AndarBahar_betsResult.Card_Diamond_amount < AndarBahar_betsResult.Card_8_K_amount
      ) {
        Win_singleNo = 14;
      }

      if (
        AndarBahar_betsResult.Card_Club_amount < AndarBahar_betsResult.Card_2_amount &&
        AndarBahar_betsResult.Card_Club_amount < AndarBahar_betsResult.Card_3_amount &&
        AndarBahar_betsResult.Card_Club_amount < AndarBahar_betsResult.Card_4_amount &&
        AndarBahar_betsResult.Card_Club_amount < AndarBahar_betsResult.Card_5_amount &&
        AndarBahar_betsResult.Card_Club_amount < AndarBahar_betsResult.Card_6_amount &&
        AndarBahar_betsResult.Card_Club_amount < AndarBahar_betsResult.Card_7_amount &&
        AndarBahar_betsResult.Card_Club_amount < AndarBahar_betsResult.Card_8_amount &&
        AndarBahar_betsResult.Card_Club_amount < AndarBahar_betsResult.Card_9_amount &&
        AndarBahar_betsResult.Card_Club_amount < AndarBahar_betsResult.Card_10_amount &&
        AndarBahar_betsResult.Card_Club_amount < AndarBahar_betsResult.Card_J_amount&&
        AndarBahar_betsResult.Card_Club_amount < AndarBahar_betsResult.Card_Q_amount &&
        AndarBahar_betsResult.Card_Club_amount < AndarBahar_betsResult.Card_K_amount &&
        AndarBahar_betsResult.Card_Club_amount < AndarBahar_betsResult.Card_Heart_amount &&
        AndarBahar_betsResult.Card_Club_amount < AndarBahar_betsResult.Card_Diamond_amount &&
        AndarBahar_betsResult.Card_Club_amount < AndarBahar_betsResult.Card_A_amount &&
        AndarBahar_betsResult.Card_Club_amount < AndarBahar_betsResult.Card_Spade_amount &&
        AndarBahar_betsResult.Card_Club_amount < AndarBahar_betsResult.Card_Red_amount &&
        AndarBahar_betsResult.Card_Club_amount < AndarBahar_betsResult.Card_Black_amount &&
        AndarBahar_betsResult.Card_Club_amount < AndarBahar_betsResult.Card_A_6_amount &&
        AndarBahar_betsResult.Card_Club_amount < AndarBahar_betsResult.Card_seven_amount &&
        AndarBahar_betsResult.Card_Club_amount < AndarBahar_betsResult.Card_8_K_amount
      ) {
        Win_singleNo = 15;
      }


      if (
        AndarBahar_betsResult.Card_Spade_amount < AndarBahar_betsResult.Card_2_amount &&
        AndarBahar_betsResult.Card_Spade_amount < AndarBahar_betsResult.Card_3_amount &&
        AndarBahar_betsResult.Card_Spade_amount < AndarBahar_betsResult.Card_4_amount &&
        AndarBahar_betsResult.Card_Spade_amount < AndarBahar_betsResult.Card_5_amount &&
        AndarBahar_betsResult.Card_Spade_amount < AndarBahar_betsResult.Card_6_amount &&
        AndarBahar_betsResult.Card_Spade_amount < AndarBahar_betsResult.Card_7_amount &&
        AndarBahar_betsResult.Card_Spade_amount < AndarBahar_betsResult.Card_8_amount &&
        AndarBahar_betsResult.Card_Spade_amount < AndarBahar_betsResult.Card_9_amount &&
        AndarBahar_betsResult.Card_Spade_amount < AndarBahar_betsResult.Card_10_amount &&
        AndarBahar_betsResult.Card_Spade_amount < AndarBahar_betsResult.Card_J_amount&&
        AndarBahar_betsResult.Card_Spade_amount < AndarBahar_betsResult.Card_Q_amount &&
        AndarBahar_betsResult.Card_Spade_amount < AndarBahar_betsResult.Card_K_amount &&
        AndarBahar_betsResult.Card_Spade_amount < AndarBahar_betsResult.Card_Heart_amount &&
        AndarBahar_betsResult.Card_Spade_amount < AndarBahar_betsResult.Card_Diamond_amount &&
        AndarBahar_betsResult.Card_Spade_amount < AndarBahar_betsResult.Card_Club_amount &&
        AndarBahar_betsResult.Card_Spade_amount < AndarBahar_betsResult.Card_A_amount &&
        AndarBahar_betsResult.Card_Spade_amount < AndarBahar_betsResult.Card_Red_amount &&
        AndarBahar_betsResult.Card_Spade_amount < AndarBahar_betsResult.Card_Black_amount &&
        AndarBahar_betsResult.Card_Spade_amount < AndarBahar_betsResult.Card_A_6_amount &&
        AndarBahar_betsResult.Card_Spade_amount < AndarBahar_betsResult.Card_seven_amount &&
        AndarBahar_betsResult.Card_Spade_amount < AndarBahar_betsResult.Card_8_K_amount
      ) {
        Win_singleNo = 16;
      }

      if (
        AndarBahar_betsResult.Card_Red_amount < AndarBahar_betsResult.Card_2_amount &&
        AndarBahar_betsResult.Card_Red_amount < AndarBahar_betsResult.Card_3_amount &&
        AndarBahar_betsResult.Card_Red_amount < AndarBahar_betsResult.Card_4_amount &&
        AndarBahar_betsResult.Card_Red_amount < AndarBahar_betsResult.Card_5_amount &&
        AndarBahar_betsResult.Card_Red_amount < AndarBahar_betsResult.Card_6_amount &&
        AndarBahar_betsResult.Card_Red_amount < AndarBahar_betsResult.Card_7_amount &&
        AndarBahar_betsResult.Card_Red_amount < AndarBahar_betsResult.Card_8_amount &&
        AndarBahar_betsResult.Card_Red_amount < AndarBahar_betsResult.Card_9_amount &&
        AndarBahar_betsResult.Card_Red_amount < AndarBahar_betsResult.Card_10_amount &&
        AndarBahar_betsResult.Card_Red_amount < AndarBahar_betsResult.Card_J_amount&&
        AndarBahar_betsResult.Card_Red_amount < AndarBahar_betsResult.Card_Q_amount &&
        AndarBahar_betsResult.Card_Red_amount < AndarBahar_betsResult.Card_K_amount &&
        AndarBahar_betsResult.Card_Red_amount < AndarBahar_betsResult.Card_Heart_amount &&
        AndarBahar_betsResult.Card_Red_amount < AndarBahar_betsResult.Card_Diamond_amount &&
        AndarBahar_betsResult.Card_Red_amount < AndarBahar_betsResult.Card_Club_amount &&
        AndarBahar_betsResult.Card_Red_amount < AndarBahar_betsResult.Card_Spade_amount &&
        AndarBahar_betsResult.Card_Red_amount < AndarBahar_betsResult.Card_A_amount &&
        AndarBahar_betsResult.Card_Red_amount < AndarBahar_betsResult.Card_Black_amount &&
        AndarBahar_betsResult.Card_Red_amount < AndarBahar_betsResult.Card_A_6_amount &&
        AndarBahar_betsResult.Card_Red_amount < AndarBahar_betsResult.Card_seven_amount &&
        AndarBahar_betsResult.Card_Red_amount < AndarBahar_betsResult.Card_8_K_amount
      ) {
        Win_singleNo = 17;
      }

      if (
        AndarBahar_betsResult.Card_Black_amount < AndarBahar_betsResult.Card_2_amount &&
        AndarBahar_betsResult.Card_Black_amount < AndarBahar_betsResult.Card_3_amount &&
        AndarBahar_betsResult.Card_Black_amount < AndarBahar_betsResult.Card_4_amount &&
        AndarBahar_betsResult.Card_Black_amount < AndarBahar_betsResult.Card_5_amount &&
        AndarBahar_betsResult.Card_Black_amount < AndarBahar_betsResult.Card_6_amount &&
        AndarBahar_betsResult.Card_Black_amount < AndarBahar_betsResult.Card_7_amount &&
        AndarBahar_betsResult.Card_Black_amount < AndarBahar_betsResult.Card_8_amount &&
        AndarBahar_betsResult.Card_Black_amount < AndarBahar_betsResult.Card_9_amount &&
        AndarBahar_betsResult.Card_Black_amount < AndarBahar_betsResult.Card_10_amount &&
        AndarBahar_betsResult.Card_Black_amount < AndarBahar_betsResult.Card_J_amount&&
        AndarBahar_betsResult.Card_Black_amount < AndarBahar_betsResult.Card_Q_amount &&
        AndarBahar_betsResult.Card_Black_amount < AndarBahar_betsResult.Card_K_amount &&
        AndarBahar_betsResult.Card_Black_amount < AndarBahar_betsResult.Card_Heart_amount &&
        AndarBahar_betsResult.Card_Black_amount < AndarBahar_betsResult.Card_Diamond_amount &&
        AndarBahar_betsResult.Card_Black_amount < AndarBahar_betsResult.Card_Club_amount &&
        AndarBahar_betsResult.Card_Black_amount < AndarBahar_betsResult.Card_Spade_amount &&
        AndarBahar_betsResult.Card_Black_amount < AndarBahar_betsResult.Card_Red_amount &&
        AndarBahar_betsResult.Card_Black_amount < AndarBahar_betsResult.Card_A_amount &&
        AndarBahar_betsResult.Card_Black_amount < AndarBahar_betsResult.Card_A_6_amount &&
        AndarBahar_betsResult.Card_Black_amount < AndarBahar_betsResult.Card_seven_amount &&
        AndarBahar_betsResult.Card_Black_amount < AndarBahar_betsResult.Card_8_K_amount
      ) {
        Win_singleNo = 18;
      }
      if (
        AndarBahar_betsResult.Card_A_6_amount < AndarBahar_betsResult.Card_2_amount &&
        AndarBahar_betsResult.Card_A_6_amount < AndarBahar_betsResult.Card_3_amount &&
        AndarBahar_betsResult.Card_A_6_amount < AndarBahar_betsResult.Card_4_amount &&
        AndarBahar_betsResult.Card_A_6_amount < AndarBahar_betsResult.Card_5_amount &&
        AndarBahar_betsResult.Card_A_6_amount < AndarBahar_betsResult.Card_6_amount &&
        AndarBahar_betsResult.Card_A_6_amount < AndarBahar_betsResult.Card_7_amount &&
        AndarBahar_betsResult.Card_A_6_amount < AndarBahar_betsResult.Card_8_amount &&
        AndarBahar_betsResult.Card_A_6_amount < AndarBahar_betsResult.Card_9_amount &&
        AndarBahar_betsResult.Card_A_6_amount < AndarBahar_betsResult.Card_10_amount &&
        AndarBahar_betsResult.Card_A_6_amount < AndarBahar_betsResult.Card_J_amount&&
        AndarBahar_betsResult.Card_A_6_amount < AndarBahar_betsResult.Card_Q_amount &&
        AndarBahar_betsResult.Card_A_6_amount < AndarBahar_betsResult.Card_K_amount &&
        AndarBahar_betsResult.Card_A_6_amount < AndarBahar_betsResult.Card_Heart_amount &&
        AndarBahar_betsResult.Card_A_6_amount < AndarBahar_betsResult.Card_Diamond_amount &&
        AndarBahar_betsResult.Card_A_6_amount < AndarBahar_betsResult.Card_Club_amount &&
        AndarBahar_betsResult.Card_A_6_amount < AndarBahar_betsResult.Card_Spade_amount &&
        AndarBahar_betsResult.Card_A_6_amount < AndarBahar_betsResult.Card_Red_amount &&
        AndarBahar_betsResult.Card_A_6_amount < AndarBahar_betsResult.Card_Black_amount &&
        AndarBahar_betsResult.Card_A_6_amount < AndarBahar_betsResult.Card_A_amount &&
        AndarBahar_betsResult.Card_A_6_amount < AndarBahar_betsResult.Card_seven_amount &&
        AndarBahar_betsResult.Card_A_6_amount < AndarBahar_betsResult.Card_8_K_amount
      ) {
        Win_singleNo = 19;
      }

      if (
        AndarBahar_betsResult.Card_seven_amount < AndarBahar_betsResult.Card_2_amount &&
        AndarBahar_betsResult.Card_seven_amount < AndarBahar_betsResult.Card_3_amount &&
        AndarBahar_betsResult.Card_seven_amount < AndarBahar_betsResult.Card_4_amount &&
        AndarBahar_betsResult.Card_seven_amount < AndarBahar_betsResult.Card_5_amount &&
        AndarBahar_betsResult.Card_seven_amount < AndarBahar_betsResult.Card_6_amount &&
        AndarBahar_betsResult.Card_seven_amount < AndarBahar_betsResult.Card_7_amount &&
        AndarBahar_betsResult.Card_seven_amount < AndarBahar_betsResult.Card_8_amount &&
        AndarBahar_betsResult.Card_seven_amount < AndarBahar_betsResult.Card_9_amount &&
        AndarBahar_betsResult.Card_seven_amount < AndarBahar_betsResult.Card_10_amount &&
        AndarBahar_betsResult.Card_seven_amount < AndarBahar_betsResult.Card_J_amount&&
        AndarBahar_betsResult.Card_seven_amount < AndarBahar_betsResult.Card_Q_amount &&
        AndarBahar_betsResult.Card_seven_amount < AndarBahar_betsResult.Card_K_amount &&
        AndarBahar_betsResult.Card_seven_amount < AndarBahar_betsResult.Card_Heart_amount &&
        AndarBahar_betsResult.Card_seven_amount < AndarBahar_betsResult.Card_Diamond_amount &&
        AndarBahar_betsResult.Card_seven_amount < AndarBahar_betsResult.Card_Club_amount &&
        AndarBahar_betsResult.Card_seven_amount < AndarBahar_betsResult.Card_Spade_amount &&
        AndarBahar_betsResult.Card_seven_amount < AndarBahar_betsResult.Card_Red_amount &&
        AndarBahar_betsResult.Card_seven_amount < AndarBahar_betsResult.Card_Black_amount &&
        AndarBahar_betsResult.Card_seven_amount < AndarBahar_betsResult.Card_A_amount &&
        AndarBahar_betsResult.Card_seven_amount < AndarBahar_betsResult.Card_A_6_amount &&
        AndarBahar_betsResult.Card_seven_amount < AndarBahar_betsResult.Card_8_K_amount
      ) {
        Win_singleNo = 20;
      }

      if (
        AndarBahar_betsResult.Card_8_K < AndarBahar_betsResult.Card_2_amount &&
        AndarBahar_betsResult.Card_8_K < AndarBahar_betsResult.Card_3_amount &&
        AndarBahar_betsResult.Card_8_K < AndarBahar_betsResult.Card_4_amount &&
        AndarBahar_betsResult.Card_8_K < AndarBahar_betsResult.Card_5_amount &&
        AndarBahar_betsResult.Card_8_K < AndarBahar_betsResult.Card_6_amount &&
        AndarBahar_betsResult.Card_8_K < AndarBahar_betsResult.Card_7_amount &&
        AndarBahar_betsResult.Card_8_K < AndarBahar_betsResult.Card_8_amount &&
        AndarBahar_betsResult.Card_8_K < AndarBahar_betsResult.Card_9_amount &&
        AndarBahar_betsResult.Card_8_K < AndarBahar_betsResult.Card_10_amount &&
        AndarBahar_betsResult.Card_8_K < AndarBahar_betsResult.Card_J_amount&&
        AndarBahar_betsResult.Card_8_K < AndarBahar_betsResult.Card_Q_amount &&
        AndarBahar_betsResult.Card_8_K < AndarBahar_betsResult.Card_K_amount &&
        AndarBahar_betsResult.Card_8_K < AndarBahar_betsResult.Card_Heart_amount &&
        AndarBahar_betsResult.Card_8_K < AndarBahar_betsResult.Card_Diamond_amount &&
        AndarBahar_betsResult.Card_8_K < AndarBahar_betsResult.Card_Club_amount &&
        AndarBahar_betsResult.Card_8_K < AndarBahar_betsResult.Card_Spade_amount &&
        AndarBahar_betsResult.Card_8_K < AndarBahar_betsResult.Card_Red_amount &&
        AndarBahar_betsResult.Card_8_K < AndarBahar_betsResult.Card_Black_amount &&
        AndarBahar_betsResult.Card_8_K < AndarBahar_betsResult.Card_A_amount &&
        AndarBahar_betsResult.Card_8_K < AndarBahar_betsResult.Card_seven_amount &&
        AndarBahar_betsResult.Card_8_K < AndarBahar_betsResult.Card_A_6_amount
      ) {
        Win_singleNo = 21;
      }
      let Game = await service.GameRunning(
        data.playerId,
        ROUND_COUNT,
        data.Card_A_amount ,
        data.Card_2_amount ,
        data.Card_3_amount ,
        data.Card_4_amount,
        data.Card_5_amount,
        data.Card_6_amount,
        data.Card_7_amount,
        data.Card_8_amount,
        data.Card_9_amount,
        data.Card_10_amount,
        data.Card_J_amount,
        data.Card_Q_amount,
        data.Card_K_amount,
        data.Card_Heart_amount,
        data.Card_Diamond_amount,
        data.Card_Club_amount,
        data.Card_Spade_amount,
        data.Card_Red_amount,
        data.Card_Black_amount,
        data.Card_A_6_amount,
        data.Card_seven_amount,
        data.Card_8_K_amount,
        data.Card_Andhar_amount ,
        data.Card_Bahar_amount,
  
        Win_singleNo
      );
      console.log("Game", Game);




    if (
      data.Card_A_amount == 0 &&
      data.Card_2_amount == 0 &&
      data.Card_3_amount == 0 &&
      data.Card_4_amount == 0 &&
      data.Card_5_amount == 0 &&
      data.Card_6_amount == 0 &&
      data.Card_7_amount == 0 &&
      data.Card_8_amount == 0 &&
      data.Card_9_amount == 0 &&
      data.Card_10_amount == 0 &&
      data.Card_J_amount == 0 &&
      data.Card_Q_amount == 0 &&
      data.Card_K_amount == 0 &&
      data.Card_Heart_amount == 0 &&
      data.Card_Diamond_amount == 0 &&
      data.Card_Spade_amount == 0 &&
      data.Card_Club_amount == 0 &&
      data.Card_Red_amount == 0 &&
      data.Card_Black_amount == 0 &&
      data.Card_A_6_amount == 0 &&
      data.Card_seven_amount == 0 &&
      data.Card_8_k_amount == 0 &&
      data.Card_Andhar_amount == 0 &&
      data.Card_Bahar_amount == 0
    ) {
      socket.emit(events.OnBetsPlaced, {
        status: 400,
        message: "Bet not Confirmed",
        data: {
          playerId: data.playerId,
          balance:
            point -
            (data.Card_A_amount +
              data.Card_2_amount +
              data.Card_3_amount +
              data.Card_4_amount +
              data.Card_5_amount +
              data.Card_6_amount +
              data.Card_7_amount +
              data.Card_8_amount +
              data.Card_9_amount +
              data.Card_10_amount +
              data.Card_J_amount +
              data.Card_Q_amount +
              data.Card_K_amount +
              data.Card_Heart_amount +
              data.Card_Diamond_amount +
              data.Card_Spade_amount +
              data.Card_Club_amount +
              data.Card_Red_amount +
              data.Card_Black_amount +
              data.Card_A_6_amount +
              data.Card_seven_amount +
              data.Card_8_K_amount +
              data.Card_Andhar_amount +
              data.Card_Bahar_amount),
        },
      });
    } else {
      socket.emit(events.OnBetsPlaced, {
        status: 200,
        message: "Bet Confirmed",
        data: {
          playerId: data.playerId,
          balance:
            point -
            (data.Card_A_amount +
              data.Card_2_amount +
              data.Card_3_amount +
              data.Card_4_amount +
              data.Card_5_amount +
              data.Card_6_amount +
              data.Card_7_amount +
              data.Card_8_amount +
              data.Card_9_amount +
              data.Card_10_amount +
              data.Card_J_amount +
              data.Card_Q_amount +
              data.Card_K_amount +
              data.Card_Heart_amount +
              data.Card_Diamond_amount +
              data.Card_Spade_amount +
              data.Card_Club_amount +
              data.Card_Red_amount +
              data.Card_Black_amount +
              data.Card_A_6_amount +
              data.Card_seven_amount +
              data.Card_8_K_amount +
              data.Card_Andhar_amount +
              data.Card_Bahar_amount),
        },
      });
    }
  
  }else {
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
  //let socket = data[commonVar.socket];
 // socket.on("OnWinNo", async (data) => {
    var Win_singleNo = 0;
    var winconatinzero = [];

    var adminWin= await service.getAdminandarbahar()
   console.log("adminWin",adminWin)
   var game_id=3
    var playerId = data.playerId;
    var RoundCount = ROUND_COUNT;
    var previousWin_single = previousWin_single;
    //var NewpreviousWin_single = NewpreviousWin_single;

    //var Balance= result2[0].point;
    var isplayerexist = await service.GetPlayerIdInBetplaced(data.playerId);
    if (isplayerexist == true) {
      let Game = await service.GetGameRunningData(data.playerId);
      if (Game == "no user data exits") {
      //  socket.emit("OnWinNo", { message: "no user data exits" });
      } else {
        var AndarBahar_betsResult = await service.DetailAndarBahar();
      console.log("DetailAndarBahar", AndarBahar_betsResult);
     




      if (
        AndarBahar_betsResult.Card_A_amount < AndarBahar_betsResult.Card_2_amount &&
        AndarBahar_betsResult.Card_A_amount < AndarBahar_betsResult.Card_3_amount &&
        AndarBahar_betsResult.Card_A_amount < AndarBahar_betsResult.Card_4_amount &&
        AndarBahar_betsResult.Card_A_amount < AndarBahar_betsResult.Card_5_amount &&
        AndarBahar_betsResult.Card_A_amount < AndarBahar_betsResult.Card_6_amount &&
        AndarBahar_betsResult.Card_A_amount < AndarBahar_betsResult.Card_7_amount &&
        AndarBahar_betsResult.Card_A_amount < AndarBahar_betsResult.Card_8_amount &&
        AndarBahar_betsResult.Card_A_amount < AndarBahar_betsResult.Card_9_amount &&
        AndarBahar_betsResult.Card_A_amount < AndarBahar_betsResult.Card_10_amount &&
        AndarBahar_betsResult.Card_A_amount < AndarBahar_betsResult.Card_J_amount&&
        AndarBahar_betsResult.Card_A_amount < AndarBahar_betsResult.Card_Q_amount &&
        AndarBahar_betsResult.Card_A_amount < AndarBahar_betsResult.Card_K_amount &&
        AndarBahar_betsResult.Card_A_amount < AndarBahar_betsResult.Card_Heart_amount &&
        AndarBahar_betsResult.Card_A_amount < AndarBahar_betsResult.Card_Diamond_amount &&
        AndarBahar_betsResult.Card_A_amount < AndarBahar_betsResult.Card_Club_amount &&
        AndarBahar_betsResult.Card_A_amount < AndarBahar_betsResult.Card_Spade_amount &&
        AndarBahar_betsResult.Card_A_amount < AndarBahar_betsResult.Card_Red_amount &&
        AndarBahar_betsResult.Card_A_amount < AndarBahar_betsResult.Card_Black_amount &&
        AndarBahar_betsResult.Card_A_amount < AndarBahar_betsResult.Card_A_6_amount &&
        AndarBahar_betsResult.Card_A_amount < AndarBahar_betsResult.Card_seven_amount &&
        AndarBahar_betsResult.Card_A_amount < AndarBahar_betsResult.Card_8_K_amount
      ) {
        Win_singleNo = 0;
      }
      if (
        AndarBahar_betsResult.Card_2_amount < AndarBahar_betsResult.Card_A_amount &&
        AndarBahar_betsResult.Card_2_amount < AndarBahar_betsResult.Card_3_amount &&
        AndarBahar_betsResult.Card_2_amount < AndarBahar_betsResult.Card_4_amount &&
        AndarBahar_betsResult.Card_2_amount < AndarBahar_betsResult.Card_5_amount &&
        AndarBahar_betsResult.Card_2_amount < AndarBahar_betsResult.Card_6_amount &&
        AndarBahar_betsResult.Card_2_amount < AndarBahar_betsResult.Card_7_amount &&
        AndarBahar_betsResult.Card_2_amount < AndarBahar_betsResult.Card_8_amount &&
        AndarBahar_betsResult.Card_2_amount < AndarBahar_betsResult.Card_9_amount &&
        AndarBahar_betsResult.Card_2_amount < AndarBahar_betsResult.Card_10_amount &&
        AndarBahar_betsResult.Card_2_amount < AndarBahar_betsResult.Card_J_amount&&
        AndarBahar_betsResult.Card_2_amount < AndarBahar_betsResult.Card_Q_amount &&
        AndarBahar_betsResult.Card_2_amount < AndarBahar_betsResult.Card_K_amount &&
        AndarBahar_betsResult.Card_2_amount < AndarBahar_betsResult.Card_Heart_amount &&
        AndarBahar_betsResult.Card_2_amount < AndarBahar_betsResult.Card_Diamond_amount &&
        AndarBahar_betsResult.Card_2_amount < AndarBahar_betsResult.Card_Club_amount &&
        AndarBahar_betsResult.Card_2_amount < AndarBahar_betsResult.Card_Spade_amount &&
        AndarBahar_betsResult.Card_2_amount < AndarBahar_betsResult.Card_Red_amount &&
        AndarBahar_betsResult.Card_2_amount < AndarBahar_betsResult.Card_Black_amount &&
        AndarBahar_betsResult.Card_2_amount < AndarBahar_betsResult.Card_A_6_amount &&
        AndarBahar_betsResult.Card_2_amount < AndarBahar_betsResult.Card_seven_amount &&
        AndarBahar_betsResult.Card_2_amount < AndarBahar_betsResult.Card_8_K_amount
      ) {
        Win_singleNo = 1;
      }
      if (
        AndarBahar_betsResult.Card_3_amount < AndarBahar_betsResult.Card_2_amount &&
        AndarBahar_betsResult.Card_3_amount < AndarBahar_betsResult.Card_A_amount &&
        AndarBahar_betsResult.Card_3_amount < AndarBahar_betsResult.Card_4_amount &&
        AndarBahar_betsResult.Card_3_amount < AndarBahar_betsResult.Card_5_amount &&
        AndarBahar_betsResult.Card_3_amount < AndarBahar_betsResult.Card_6_amount &&
        AndarBahar_betsResult.Card_3_amount < AndarBahar_betsResult.Card_7_amount &&
        AndarBahar_betsResult.Card_3_amount < AndarBahar_betsResult.Card_8_amount &&
        AndarBahar_betsResult.Card_3_amount < AndarBahar_betsResult.Card_9_amount &&
        AndarBahar_betsResult.Card_3_amount < AndarBahar_betsResult.Card_10_amount &&
        AndarBahar_betsResult.Card_3_amount < AndarBahar_betsResult.Card_J_amount&&
        AndarBahar_betsResult.Card_3_amount < AndarBahar_betsResult.Card_Q_amount &&
        AndarBahar_betsResult.Card_3_amount < AndarBahar_betsResult.Card_K_amount &&
        AndarBahar_betsResult.Card_3_amount < AndarBahar_betsResult.Card_Heart_amount &&
        AndarBahar_betsResult.Card_3_amount < AndarBahar_betsResult.Card_Diamond_amount &&
        AndarBahar_betsResult.Card_3_amount < AndarBahar_betsResult.Card_Club_amount &&
        AndarBahar_betsResult.Card_3_amount < AndarBahar_betsResult.Card_Spade_amount &&
        AndarBahar_betsResult.Card_3_amount < AndarBahar_betsResult.Card_Red_amount &&
        AndarBahar_betsResult.Card_3_amount < AndarBahar_betsResult.Card_Black_amount &&
        AndarBahar_betsResult.Card_3_amount < AndarBahar_betsResult.Card_A_6_amount &&
        AndarBahar_betsResult.Card_3_amount < AndarBahar_betsResult.Card_seven_amount &&
        AndarBahar_betsResult.Card_3_amount < AndarBahar_betsResult.Card_8_K_amount
      ) {
        Win_singleNo = 2;
      }
      if (
        AndarBahar_betsResult.Card_4_amount < AndarBahar_betsResult.Card_2_amount &&
        AndarBahar_betsResult.Card_4_amount < AndarBahar_betsResult.Card_3_amount &&
        AndarBahar_betsResult.Card_4_amount < AndarBahar_betsResult.Card_A_amount &&
        AndarBahar_betsResult.Card_4_amount < AndarBahar_betsResult.Card_5_amount &&
        AndarBahar_betsResult.Card_4_amount < AndarBahar_betsResult.Card_6_amount &&
        AndarBahar_betsResult.Card_4_amount < AndarBahar_betsResult.Card_7_amount &&
        AndarBahar_betsResult.Card_4_amount < AndarBahar_betsResult.Card_8_amount &&
        AndarBahar_betsResult.Card_4_amount < AndarBahar_betsResult.Card_9_amount &&
        AndarBahar_betsResult.Card_4_amount < AndarBahar_betsResult.Card_10_amount &&
        AndarBahar_betsResult.Card_4_amount < AndarBahar_betsResult.Card_J_amount&&
        AndarBahar_betsResult.Card_4_amount < AndarBahar_betsResult.Card_Q_amount &&
        AndarBahar_betsResult.Card_4_amount < AndarBahar_betsResult.Card_K_amount &&
        AndarBahar_betsResult.Card_4_amount < AndarBahar_betsResult.Card_Heart_amount &&
        AndarBahar_betsResult.Card_4_amount < AndarBahar_betsResult.Card_Diamond_amount &&
        AndarBahar_betsResult.Card_4_amount < AndarBahar_betsResult.Card_Club_amount &&
        AndarBahar_betsResult.Card_4_amount < AndarBahar_betsResult.Card_Spade_amount &&
        AndarBahar_betsResult.Card_4_amount < AndarBahar_betsResult.Card_Red_amount &&
        AndarBahar_betsResult.Card_4_amount < AndarBahar_betsResult.Card_Black_amount &&
        AndarBahar_betsResult.Card_4_amount < AndarBahar_betsResult.Card_A_6_amount &&
        AndarBahar_betsResult.Card_4_amount < AndarBahar_betsResult.Card_seven_amount &&
        AndarBahar_betsResult.Card_4_amount < AndarBahar_betsResult.Card_8_K_amount
      ) {
        Win_singleNo = 3;
      }

      if (
        AndarBahar_betsResult.Card_5_amount < AndarBahar_betsResult.Card_2_amount &&
        AndarBahar_betsResult.Card_5_amount < AndarBahar_betsResult.Card_3_amount &&
        AndarBahar_betsResult.Card_5_amount < AndarBahar_betsResult.Card_4_amount &&
        AndarBahar_betsResult.Card_5_amount < AndarBahar_betsResult.Card_A_amount &&
        AndarBahar_betsResult.Card_5_amount < AndarBahar_betsResult.Card_6_amount &&
        AndarBahar_betsResult.Card_5_amount < AndarBahar_betsResult.Card_7_amount &&
        AndarBahar_betsResult.Card_5_amount < AndarBahar_betsResult.Card_8_amount &&
        AndarBahar_betsResult.Card_5_amount < AndarBahar_betsResult.Card_9_amount &&
        AndarBahar_betsResult.Card_5_amount < AndarBahar_betsResult.Card_10_amount &&
        AndarBahar_betsResult.Card_5_amount < AndarBahar_betsResult.Card_J_amount&&
        AndarBahar_betsResult.Card_5_amount < AndarBahar_betsResult.Card_Q_amount &&
        AndarBahar_betsResult.Card_5_amount < AndarBahar_betsResult.Card_K_amount &&
        AndarBahar_betsResult.Card_5_amount < AndarBahar_betsResult.Card_Heart_amount &&
        AndarBahar_betsResult.Card_5_amount < AndarBahar_betsResult.Card_Diamond_amount &&
        AndarBahar_betsResult.Card_5_amount < AndarBahar_betsResult.Card_Club_amount &&
        AndarBahar_betsResult.Card_5_amount < AndarBahar_betsResult.Card_Spade_amount &&
        AndarBahar_betsResult.Card_5_amount < AndarBahar_betsResult.Card_Red_amount &&
        AndarBahar_betsResult.Card_5_amount < AndarBahar_betsResult.Card_Black_amount &&
        AndarBahar_betsResult.Card_5_amount < AndarBahar_betsResult.Card_A_6_amount &&
        AndarBahar_betsResult.Card_5_amount < AndarBahar_betsResult.Card_seven_amount &&
        AndarBahar_betsResult.Card_5_amount < AndarBahar_betsResult.Card_8_K_amount
      ) {
        Win_singleNo = 4;
      }


      if (
        AndarBahar_betsResult.Card_6_amount < AndarBahar_betsResult.Card_2_amount &&
        AndarBahar_betsResult.Card_6_amount < AndarBahar_betsResult.Card_3_amount &&
        AndarBahar_betsResult.Card_6_amount < AndarBahar_betsResult.Card_4_amount &&
        AndarBahar_betsResult.Card_6_amount < AndarBahar_betsResult.Card_5_amount &&
        AndarBahar_betsResult.Card_6_amount < AndarBahar_betsResult.Card_A_amount &&
        AndarBahar_betsResult.Card_6_amount < AndarBahar_betsResult.Card_7_amount &&
        AndarBahar_betsResult.Card_6_amount < AndarBahar_betsResult.Card_8_amount &&
        AndarBahar_betsResult.Card_6_amount < AndarBahar_betsResult.Card_9_amount &&
        AndarBahar_betsResult.Card_6_amount < AndarBahar_betsResult.Card_10_amount &&
        AndarBahar_betsResult.Card_6_amount < AndarBahar_betsResult.Card_J_amount&&
        AndarBahar_betsResult.Card_6_amount < AndarBahar_betsResult.Card_Q_amount &&
        AndarBahar_betsResult.Card_6_amount < AndarBahar_betsResult.Card_K_amount &&
        AndarBahar_betsResult.Card_6_amount < AndarBahar_betsResult.Card_Heart_amount &&
        AndarBahar_betsResult.Card_6_amount < AndarBahar_betsResult.Card_Diamond_amount &&
        AndarBahar_betsResult.Card_6_amount < AndarBahar_betsResult.Card_Club_amount &&
        AndarBahar_betsResult.Card_6_amount < AndarBahar_betsResult.Card_Spade_amount &&
        AndarBahar_betsResult.Card_6_amount < AndarBahar_betsResult.Card_Red_amount &&
        AndarBahar_betsResult.Card_6_amount < AndarBahar_betsResult.Card_Black_amount &&
        AndarBahar_betsResult.Card_6_amount < AndarBahar_betsResult.Card_A_6_amount &&
        AndarBahar_betsResult.Card_6_amount < AndarBahar_betsResult.Card_seven_amount &&
        AndarBahar_betsResult.Card_6_amount < AndarBahar_betsResult.Card_8_K_amount
      ) {
        Win_singleNo = 5;
      }


      if (
        AndarBahar_betsResult.Card_7_amount < AndarBahar_betsResult.Card_2_amount &&
        AndarBahar_betsResult.Card_7_amount < AndarBahar_betsResult.Card_3_amount &&
        AndarBahar_betsResult.Card_7_amount < AndarBahar_betsResult.Card_4_amount &&
        AndarBahar_betsResult.Card_7_amount < AndarBahar_betsResult.Card_5_amount &&
        AndarBahar_betsResult.Card_7_amount < AndarBahar_betsResult.Card_6_amount &&
        AndarBahar_betsResult.Card_7_amount < AndarBahar_betsResult.Card_A_amount &&
        AndarBahar_betsResult.Card_7_amount < AndarBahar_betsResult.Card_8_amount &&
        AndarBahar_betsResult.Card_7_amount < AndarBahar_betsResult.Card_9_amount &&
        AndarBahar_betsResult.Card_7_amount < AndarBahar_betsResult.Card_10_amount &&
        AndarBahar_betsResult.Card_7_amount < AndarBahar_betsResult.Card_J_amount&&
        AndarBahar_betsResult.Card_7_amount < AndarBahar_betsResult.Card_Q_amount &&
        AndarBahar_betsResult.Card_7_amount < AndarBahar_betsResult.Card_K_amount &&
        AndarBahar_betsResult.Card_7_amount < AndarBahar_betsResult.Card_Heart_amount &&
        AndarBahar_betsResult.Card_7_amount < AndarBahar_betsResult.Card_Diamond_amount &&
        AndarBahar_betsResult.Card_7_amount < AndarBahar_betsResult.Card_Club_amount &&
        AndarBahar_betsResult.Card_7_amount < AndarBahar_betsResult.Card_Spade_amount &&
        AndarBahar_betsResult.Card_7_amount < AndarBahar_betsResult.Card_Red_amount &&
        AndarBahar_betsResult.Card_7_amount < AndarBahar_betsResult.Card_Black_amount &&
        AndarBahar_betsResult.Card_7_amount < AndarBahar_betsResult.Card_A_6_amount &&
        AndarBahar_betsResult.Card_7_amount < AndarBahar_betsResult.Card_seven_amount &&
        AndarBahar_betsResult.Card_7_amount < AndarBahar_betsResult.Card_8_K_amount
      ) {
        Win_singleNo = 6;
      }
      if (
        AndarBahar_betsResult.Card_8_amount < AndarBahar_betsResult.Card_2_amount &&
        AndarBahar_betsResult.Card_8_amount < AndarBahar_betsResult.Card_3_amount &&
        AndarBahar_betsResult.Card_8_amount < AndarBahar_betsResult.Card_4_amount &&
        AndarBahar_betsResult.Card_8_amount < AndarBahar_betsResult.Card_5_amount &&
        AndarBahar_betsResult.Card_8_amount < AndarBahar_betsResult.Card_6_amount &&
        AndarBahar_betsResult.Card_8_amount < AndarBahar_betsResult.Card_7_amount &&
        AndarBahar_betsResult.Card_8_amount < AndarBahar_betsResult.Card_A_amount &&
        AndarBahar_betsResult.Card_8_amount < AndarBahar_betsResult.Card_9_amount &&
        AndarBahar_betsResult.Card_8_amount < AndarBahar_betsResult.Card_10_amount &&
        AndarBahar_betsResult.Card_8_amount < AndarBahar_betsResult.Card_J_amount&&
        AndarBahar_betsResult.Card_8_amount < AndarBahar_betsResult.Card_Q_amount &&
        AndarBahar_betsResult.Card_8_amount < AndarBahar_betsResult.Card_K_amount &&
        AndarBahar_betsResult.Card_8_amount < AndarBahar_betsResult.Card_Heart_amount &&
        AndarBahar_betsResult.Card_8_amount < AndarBahar_betsResult.Card_Diamond_amount &&
        AndarBahar_betsResult.Card_8_amount < AndarBahar_betsResult.Card_Club_amount &&
        AndarBahar_betsResult.Card_8_amount < AndarBahar_betsResult.Card_Spade_amount &&
        AndarBahar_betsResult.Card_8_amount < AndarBahar_betsResult.Card_Red_amount &&
        AndarBahar_betsResult.Card_8_amount < AndarBahar_betsResult.Card_Black_amount &&
        AndarBahar_betsResult.Card_8_amount < AndarBahar_betsResult.Card_A_6_amount &&
        AndarBahar_betsResult.Card_8_amount < AndarBahar_betsResult.Card_seven_amount &&
        AndarBahar_betsResult.Card_8_amount < AndarBahar_betsResult.Card_8_K_amount
      ) {
        Win_singleNo = 7;
      }
      if (
        AndarBahar_betsResult.Card_9_amount < AndarBahar_betsResult.Card_2_amount &&
        AndarBahar_betsResult.Card_9_amount < AndarBahar_betsResult.Card_3_amount &&
        AndarBahar_betsResult.Card_9_amount < AndarBahar_betsResult.Card_4_amount &&
        AndarBahar_betsResult.Card_9_amount < AndarBahar_betsResult.Card_5_amount &&
        AndarBahar_betsResult.Card_9_amount < AndarBahar_betsResult.Card_6_amount &&
        AndarBahar_betsResult.Card_9_amount < AndarBahar_betsResult.Card_7_amount &&
        AndarBahar_betsResult.Card_9_amount < AndarBahar_betsResult.Card_8_amount &&
        AndarBahar_betsResult.Card_9_amount < AndarBahar_betsResult.Card_A_amount &&
        AndarBahar_betsResult.Card_9_amount < AndarBahar_betsResult.Card_10_amount &&
        AndarBahar_betsResult.Card_9_amount < AndarBahar_betsResult.Card_J_amount&&
        AndarBahar_betsResult.Card_9_amount < AndarBahar_betsResult.Card_Q_amount &&
        AndarBahar_betsResult.Card_9_amount < AndarBahar_betsResult.Card_K_amount &&
        AndarBahar_betsResult.Card_9_amount < AndarBahar_betsResult.Card_Heart_amount &&
        AndarBahar_betsResult.Card_9_amount < AndarBahar_betsResult.Card_Diamond_amount &&
        AndarBahar_betsResult.Card_9_amount < AndarBahar_betsResult.Card_Club_amount &&
        AndarBahar_betsResult.Card_9_amount < AndarBahar_betsResult.Card_Spade_amount &&
        AndarBahar_betsResult.Card_9_amount < AndarBahar_betsResult.Card_Red_amount &&
        AndarBahar_betsResult.Card_9_amount < AndarBahar_betsResult.Card_Black_amount &&
        AndarBahar_betsResult.Card_9_amount < AndarBahar_betsResult.Card_A_6_amount &&
        AndarBahar_betsResult.Card_9_amount < AndarBahar_betsResult.Card_seven_amount &&
        AndarBahar_betsResult.Card_9_amount < AndarBahar_betsResult.Card_8_K_amount
      ) {
        Win_singleNo = 8;
      }
      if (
        AndarBahar_betsResult.Card_10_amount < AndarBahar_betsResult.Card_2_amount &&
        AndarBahar_betsResult.Card_10_amount < AndarBahar_betsResult.Card_3_amount &&
        AndarBahar_betsResult.Card_10_amount < AndarBahar_betsResult.Card_4_amount &&
        AndarBahar_betsResult.Card_10_amount < AndarBahar_betsResult.Card_5_amount &&
        AndarBahar_betsResult.Card_10_amount < AndarBahar_betsResult.Card_6_amount &&
        AndarBahar_betsResult.Card_10_amount < AndarBahar_betsResult.Card_7_amount &&
        AndarBahar_betsResult.Card_10_amount < AndarBahar_betsResult.Card_8_amount &&
        AndarBahar_betsResult.Card_10_amount < AndarBahar_betsResult.Card_9_amount &&
        AndarBahar_betsResult.Card_10_amount < AndarBahar_betsResult.Card_A_amount &&
        AndarBahar_betsResult.Card_10_amount < AndarBahar_betsResult.Card_J_amount&&
        AndarBahar_betsResult.Card_10_amount < AndarBahar_betsResult.Card_Q_amount &&
        AndarBahar_betsResult.Card_10_amount < AndarBahar_betsResult.Card_K_amount &&
        AndarBahar_betsResult.Card_10_amount < AndarBahar_betsResult.Card_Heart_amount &&
        AndarBahar_betsResult.Card_10_amount < AndarBahar_betsResult.Card_Diamond_amount &&
        AndarBahar_betsResult.Card_10_amount < AndarBahar_betsResult.Card_Club_amount &&
        AndarBahar_betsResult.Card_10_amount < AndarBahar_betsResult.Card_Spade_amount &&
        AndarBahar_betsResult.Card_10_amount < AndarBahar_betsResult.Card_Red_amount &&
        AndarBahar_betsResult.Card_10_amount < AndarBahar_betsResult.Card_Black_amount &&
        AndarBahar_betsResult.Card_10_amount < AndarBahar_betsResult.Card_A_6_amount &&
        AndarBahar_betsResult.Card_10_amount < AndarBahar_betsResult.Card_seven_amount &&
        AndarBahar_betsResult.Card_10_amount < AndarBahar_betsResult.Card_8_K_amount
      ) {
        Win_singleNo = 9;
      }
      if (
        AndarBahar_betsResult.Card_J_amount < AndarBahar_betsResult.Card_2_amount &&
        AndarBahar_betsResult.Card_J_amount < AndarBahar_betsResult.Card_3_amount &&
        AndarBahar_betsResult.Card_J_amount < AndarBahar_betsResult.Card_4_amount &&
        AndarBahar_betsResult.Card_J_amount < AndarBahar_betsResult.Card_5_amount &&
        AndarBahar_betsResult.Card_J_amount < AndarBahar_betsResult.Card_6_amount &&
        AndarBahar_betsResult.Card_J_amount < AndarBahar_betsResult.Card_7_amount &&
        AndarBahar_betsResult.Card_J_amount < AndarBahar_betsResult.Card_8_amount &&
        AndarBahar_betsResult.Card_J_amount < AndarBahar_betsResult.Card_9_amount &&
        AndarBahar_betsResult.Card_J_amount < AndarBahar_betsResult.Card_10_amount &&
        AndarBahar_betsResult.Card_J_amount < AndarBahar_betsResult.Card_A_amount&&
        AndarBahar_betsResult.Card_J_amount < AndarBahar_betsResult.Card_Q_amount &&
        AndarBahar_betsResult.Card_J_amount < AndarBahar_betsResult.Card_K_amount &&
        AndarBahar_betsResult.Card_J_amount < AndarBahar_betsResult.Card_Heart_amount &&
        AndarBahar_betsResult.Card_J_amount < AndarBahar_betsResult.Card_Diamond_amount &&
        AndarBahar_betsResult.Card_J_amount < AndarBahar_betsResult.Card_Club_amount &&
        AndarBahar_betsResult.Card_J_amount < AndarBahar_betsResult.Card_Spade_amount &&
        AndarBahar_betsResult.Card_J_amount < AndarBahar_betsResult.Card_Red_amount &&
        AndarBahar_betsResult.Card_J_amount < AndarBahar_betsResult.Card_Black_amount &&
        AndarBahar_betsResult.Card_J_amount < AndarBahar_betsResult.Card_A_6_amount &&
        AndarBahar_betsResult.Card_J_amount < AndarBahar_betsResult.Card_seven_amount &&
        AndarBahar_betsResult.Card_J_amount < AndarBahar_betsResult.Card_8_K_amount
      ) {
        Win_singleNo = 10;
      }



      if (
        AndarBahar_betsResult.Card_Q_amount < AndarBahar_betsResult.Card_2_amount &&
        AndarBahar_betsResult.Card_Q_amount < AndarBahar_betsResult.Card_3_amount &&
        AndarBahar_betsResult.Card_Q_amount < AndarBahar_betsResult.Card_4_amount &&
        AndarBahar_betsResult.Card_Q_amount < AndarBahar_betsResult.Card_5_amount &&
        AndarBahar_betsResult.Card_Q_amount < AndarBahar_betsResult.Card_6_amount &&
        AndarBahar_betsResult.Card_Q_amount < AndarBahar_betsResult.Card_7_amount &&
        AndarBahar_betsResult.Card_Q_amount < AndarBahar_betsResult.Card_8_amount &&
        AndarBahar_betsResult.Card_Q_amount < AndarBahar_betsResult.Card_9_amount &&
        AndarBahar_betsResult.Card_Q_amount < AndarBahar_betsResult.Card_10_amount &&
        AndarBahar_betsResult.Card_Q_amount < AndarBahar_betsResult.Card_J_amount&&
        AndarBahar_betsResult.Card_Q_amount < AndarBahar_betsResult.Card_A_amount &&
        AndarBahar_betsResult.Card_Q_amount < AndarBahar_betsResult.Card_K_amount &&
        AndarBahar_betsResult.Card_Q_amount < AndarBahar_betsResult.Card_Heart_amount &&
        AndarBahar_betsResult.Card_Q_amount < AndarBahar_betsResult.Card_Diamond_amount &&
        AndarBahar_betsResult.Card_Q_amount < AndarBahar_betsResult.Card_Club_amount &&
        AndarBahar_betsResult.Card_Q_amount < AndarBahar_betsResult.Card_Spade_amount &&
        AndarBahar_betsResult.Card_Q_amount < AndarBahar_betsResult.Card_Red_amount &&
        AndarBahar_betsResult.Card_Q_amount < AndarBahar_betsResult.Card_Black_amount &&
        AndarBahar_betsResult.Card_Q_amount < AndarBahar_betsResult.Card_A_6_amount &&
        AndarBahar_betsResult.Card_Q_amount < AndarBahar_betsResult.Card_seven_amount &&
        AndarBahar_betsResult.Card_Q_amount < AndarBahar_betsResult.Card_8_K_amount
      ) {
        Win_singleNo = 11;
      }
      if (
        AndarBahar_betsResult.Card_K_amount < AndarBahar_betsResult.Card_2_amount &&
        AndarBahar_betsResult.Card_K_amount < AndarBahar_betsResult.Card_3_amount &&
        AndarBahar_betsResult.Card_K_amount < AndarBahar_betsResult.Card_4_amount &&
        AndarBahar_betsResult.Card_K_amount < AndarBahar_betsResult.Card_5_amount &&
        AndarBahar_betsResult.Card_K_amount < AndarBahar_betsResult.Card_6_amount &&
        AndarBahar_betsResult.Card_K_amount < AndarBahar_betsResult.Card_7_amount &&
        AndarBahar_betsResult.Card_K_amount < AndarBahar_betsResult.Card_8_amount &&
        AndarBahar_betsResult.Card_K_amount < AndarBahar_betsResult.Card_9_amount &&
        AndarBahar_betsResult.Card_K_amount < AndarBahar_betsResult.Card_10_amount &&
        AndarBahar_betsResult.Card_K_amount < AndarBahar_betsResult.Card_J_amount&&
        AndarBahar_betsResult.Card_K_amount < AndarBahar_betsResult.Card_Q_amount &&
        AndarBahar_betsResult.Card_K_amount < AndarBahar_betsResult.Card_A_amount &&
        AndarBahar_betsResult.Card_K_amount < AndarBahar_betsResult.Card_Heart_amount &&
        AndarBahar_betsResult.Card_K_amount < AndarBahar_betsResult.Card_Diamond_amount &&
        AndarBahar_betsResult.Card_K_amount < AndarBahar_betsResult.Card_Club_amount &&
        AndarBahar_betsResult.Card_K_amount < AndarBahar_betsResult.Card_Spade_amount &&
        AndarBahar_betsResult.Card_K_amount < AndarBahar_betsResult.Card_Red_amount &&
        AndarBahar_betsResult.Card_K_amount < AndarBahar_betsResult.Card_Black_amount &&
        AndarBahar_betsResult.Card_K_amount < AndarBahar_betsResult.Card_A_6_amount &&
        AndarBahar_betsResult.Card_K_amount < AndarBahar_betsResult.Card_seven_amount &&
        AndarBahar_betsResult.Card_K_amount < AndarBahar_betsResult.Card_8_K_amount
      ) {
        Win_singleNo = 12;
      }

      if (
        AndarBahar_betsResult.Card_Heart_amount < AndarBahar_betsResult.Card_2_amount &&
        AndarBahar_betsResult.Card_Heart_amount < AndarBahar_betsResult.Card_3_amount &&
        AndarBahar_betsResult.Card_Heart_amount < AndarBahar_betsResult.Card_4_amount &&
        AndarBahar_betsResult.Card_Heart_amount < AndarBahar_betsResult.Card_5_amount &&
        AndarBahar_betsResult.Card_Heart_amount < AndarBahar_betsResult.Card_6_amount &&
        AndarBahar_betsResult.Card_Heart_amount < AndarBahar_betsResult.Card_7_amount &&
        AndarBahar_betsResult.Card_Heart_amount < AndarBahar_betsResult.Card_8_amount &&
        AndarBahar_betsResult.Card_Heart_amount < AndarBahar_betsResult.Card_9_amount &&
        AndarBahar_betsResult.Card_Heart_amount < AndarBahar_betsResult.Card_10_amount &&
        AndarBahar_betsResult.Card_Heart_amount < AndarBahar_betsResult.Card_J_amount&&
        AndarBahar_betsResult.Card_Heart_amount < AndarBahar_betsResult.Card_Q_amount &&
        AndarBahar_betsResult.Card_Heart_amount < AndarBahar_betsResult.Card_K_amount &&
        AndarBahar_betsResult.Card_Heart_amount < AndarBahar_betsResult.Card_A_amount &&
        AndarBahar_betsResult.Card_Heart_amount < AndarBahar_betsResult.Card_Diamond_amount &&
        AndarBahar_betsResult.Card_Heart_amount < AndarBahar_betsResult.Card_Club_amount &&
        AndarBahar_betsResult.Card_Heart_amount < AndarBahar_betsResult.Card_Spade_amount &&
        AndarBahar_betsResult.Card_Heart_amount < AndarBahar_betsResult.Card_Red_amount &&
        AndarBahar_betsResult.Card_Heart_amount < AndarBahar_betsResult.Card_Black_amount &&
        AndarBahar_betsResult.Card_Heart_amount < AndarBahar_betsResult.Card_A_6_amount &&
        AndarBahar_betsResult.Card_Heart_amount < AndarBahar_betsResult.Card_seven_amount &&
        AndarBahar_betsResult.Card_Heart_amount < AndarBahar_betsResult.Card_8_K_amount
      ) {
        Win_singleNo = 13;
      }


      if (
        AndarBahar_betsResult.Card_Diamond_amount < AndarBahar_betsResult.Card_2_amount &&
        AndarBahar_betsResult.Card_Diamond_amount < AndarBahar_betsResult.Card_3_amount &&
        AndarBahar_betsResult.Card_Diamond_amount < AndarBahar_betsResult.Card_4_amount &&
        AndarBahar_betsResult.Card_Diamond_amount < AndarBahar_betsResult.Card_5_amount &&
        AndarBahar_betsResult.Card_Diamond_amount < AndarBahar_betsResult.Card_6_amount &&
        AndarBahar_betsResult.Card_Diamond_amount < AndarBahar_betsResult.Card_7_amount &&
        AndarBahar_betsResult.Card_Diamond_amount < AndarBahar_betsResult.Card_8_amount &&
        AndarBahar_betsResult.Card_Diamond_amount < AndarBahar_betsResult.Card_9_amount &&
        AndarBahar_betsResult.Card_Diamond_amount < AndarBahar_betsResult.Card_10_amount &&
        AndarBahar_betsResult.Card_Diamond_amount < AndarBahar_betsResult.Card_J_amount&&
        AndarBahar_betsResult.Card_Diamond_amount < AndarBahar_betsResult.Card_Q_amount &&
        AndarBahar_betsResult.Card_Diamond_amount < AndarBahar_betsResult.Card_K_amount &&
        AndarBahar_betsResult.Card_Diamond_amount < AndarBahar_betsResult.Card_Heart_amount &&
        AndarBahar_betsResult.Card_Diamond_amount < AndarBahar_betsResult.Card_A_amount &&
        AndarBahar_betsResult.Card_Diamond_amount < AndarBahar_betsResult.Card_Club_amount &&
        AndarBahar_betsResult.Card_Diamond_amount < AndarBahar_betsResult.Card_Spade_amount &&
        AndarBahar_betsResult.Card_Diamond_amount < AndarBahar_betsResult.Card_Red_amount &&
        AndarBahar_betsResult.Card_Diamond_amount < AndarBahar_betsResult.Card_Black_amount &&
        AndarBahar_betsResult.Card_Diamond_amount < AndarBahar_betsResult.Card_A_6_amount &&
        AndarBahar_betsResult.Card_Diamond_amount < AndarBahar_betsResult.Card_seven_amount &&
        AndarBahar_betsResult.Card_Diamond_amount < AndarBahar_betsResult.Card_8_K_amount
      ) {
        Win_singleNo = 14;
      }

      if (
        AndarBahar_betsResult.Card_Club_amount < AndarBahar_betsResult.Card_2_amount &&
        AndarBahar_betsResult.Card_Club_amount < AndarBahar_betsResult.Card_3_amount &&
        AndarBahar_betsResult.Card_Club_amount < AndarBahar_betsResult.Card_4_amount &&
        AndarBahar_betsResult.Card_Club_amount < AndarBahar_betsResult.Card_5_amount &&
        AndarBahar_betsResult.Card_Club_amount < AndarBahar_betsResult.Card_6_amount &&
        AndarBahar_betsResult.Card_Club_amount < AndarBahar_betsResult.Card_7_amount &&
        AndarBahar_betsResult.Card_Club_amount < AndarBahar_betsResult.Card_8_amount &&
        AndarBahar_betsResult.Card_Club_amount < AndarBahar_betsResult.Card_9_amount &&
        AndarBahar_betsResult.Card_Club_amount < AndarBahar_betsResult.Card_10_amount &&
        AndarBahar_betsResult.Card_Club_amount < AndarBahar_betsResult.Card_J_amount&&
        AndarBahar_betsResult.Card_Club_amount < AndarBahar_betsResult.Card_Q_amount &&
        AndarBahar_betsResult.Card_Club_amount < AndarBahar_betsResult.Card_K_amount &&
        AndarBahar_betsResult.Card_Club_amount < AndarBahar_betsResult.Card_Heart_amount &&
        AndarBahar_betsResult.Card_Club_amount < AndarBahar_betsResult.Card_Diamond_amount &&
        AndarBahar_betsResult.Card_Club_amount < AndarBahar_betsResult.Card_A_amount &&
        AndarBahar_betsResult.Card_Club_amount < AndarBahar_betsResult.Card_Spade_amount &&
        AndarBahar_betsResult.Card_Club_amount < AndarBahar_betsResult.Card_Red_amount &&
        AndarBahar_betsResult.Card_Club_amount < AndarBahar_betsResult.Card_Black_amount &&
        AndarBahar_betsResult.Card_Club_amount < AndarBahar_betsResult.Card_A_6_amount &&
        AndarBahar_betsResult.Card_Club_amount < AndarBahar_betsResult.Card_seven_amount &&
        AndarBahar_betsResult.Card_Club_amount < AndarBahar_betsResult.Card_8_K_amount
      ) {
        Win_singleNo = 15;
      }


      if (
        AndarBahar_betsResult.Card_Spade_amount < AndarBahar_betsResult.Card_2_amount &&
        AndarBahar_betsResult.Card_Spade_amount < AndarBahar_betsResult.Card_3_amount &&
        AndarBahar_betsResult.Card_Spade_amount < AndarBahar_betsResult.Card_4_amount &&
        AndarBahar_betsResult.Card_Spade_amount < AndarBahar_betsResult.Card_5_amount &&
        AndarBahar_betsResult.Card_Spade_amount < AndarBahar_betsResult.Card_6_amount &&
        AndarBahar_betsResult.Card_Spade_amount < AndarBahar_betsResult.Card_7_amount &&
        AndarBahar_betsResult.Card_Spade_amount < AndarBahar_betsResult.Card_8_amount &&
        AndarBahar_betsResult.Card_Spade_amount < AndarBahar_betsResult.Card_9_amount &&
        AndarBahar_betsResult.Card_Spade_amount < AndarBahar_betsResult.Card_10_amount &&
        AndarBahar_betsResult.Card_Spade_amount < AndarBahar_betsResult.Card_J_amount&&
        AndarBahar_betsResult.Card_Spade_amount < AndarBahar_betsResult.Card_Q_amount &&
        AndarBahar_betsResult.Card_Spade_amount < AndarBahar_betsResult.Card_K_amount &&
        AndarBahar_betsResult.Card_Spade_amount < AndarBahar_betsResult.Card_Heart_amount &&
        AndarBahar_betsResult.Card_Spade_amount < AndarBahar_betsResult.Card_Diamond_amount &&
        AndarBahar_betsResult.Card_Spade_amount < AndarBahar_betsResult.Card_Club_amount &&
        AndarBahar_betsResult.Card_Spade_amount < AndarBahar_betsResult.Card_A_amount &&
        AndarBahar_betsResult.Card_Spade_amount < AndarBahar_betsResult.Card_Red_amount &&
        AndarBahar_betsResult.Card_Spade_amount < AndarBahar_betsResult.Card_Black_amount &&
        AndarBahar_betsResult.Card_Spade_amount < AndarBahar_betsResult.Card_A_6_amount &&
        AndarBahar_betsResult.Card_Spade_amount < AndarBahar_betsResult.Card_seven_amount &&
        AndarBahar_betsResult.Card_Spade_amount < AndarBahar_betsResult.Card_8_K_amount
      ) {
        Win_singleNo = 16;
      }

      if (
        AndarBahar_betsResult.Card_Red_amount < AndarBahar_betsResult.Card_2_amount &&
        AndarBahar_betsResult.Card_Red_amount < AndarBahar_betsResult.Card_3_amount &&
        AndarBahar_betsResult.Card_Red_amount < AndarBahar_betsResult.Card_4_amount &&
        AndarBahar_betsResult.Card_Red_amount < AndarBahar_betsResult.Card_5_amount &&
        AndarBahar_betsResult.Card_Red_amount < AndarBahar_betsResult.Card_6_amount &&
        AndarBahar_betsResult.Card_Red_amount < AndarBahar_betsResult.Card_7_amount &&
        AndarBahar_betsResult.Card_Red_amount < AndarBahar_betsResult.Card_8_amount &&
        AndarBahar_betsResult.Card_Red_amount < AndarBahar_betsResult.Card_9_amount &&
        AndarBahar_betsResult.Card_Red_amount < AndarBahar_betsResult.Card_10_amount &&
        AndarBahar_betsResult.Card_Red_amount < AndarBahar_betsResult.Card_J_amount&&
        AndarBahar_betsResult.Card_Red_amount < AndarBahar_betsResult.Card_Q_amount &&
        AndarBahar_betsResult.Card_Red_amount < AndarBahar_betsResult.Card_K_amount &&
        AndarBahar_betsResult.Card_Red_amount < AndarBahar_betsResult.Card_Heart_amount &&
        AndarBahar_betsResult.Card_Red_amount < AndarBahar_betsResult.Card_Diamond_amount &&
        AndarBahar_betsResult.Card_Red_amount < AndarBahar_betsResult.Card_Club_amount &&
        AndarBahar_betsResult.Card_Red_amount < AndarBahar_betsResult.Card_Spade_amount &&
        AndarBahar_betsResult.Card_Red_amount < AndarBahar_betsResult.Card_A_amount &&
        AndarBahar_betsResult.Card_Red_amount < AndarBahar_betsResult.Card_Black_amount &&
        AndarBahar_betsResult.Card_Red_amount < AndarBahar_betsResult.Card_A_6_amount &&
        AndarBahar_betsResult.Card_Red_amount < AndarBahar_betsResult.Card_seven_amount &&
        AndarBahar_betsResult.Card_Red_amount < AndarBahar_betsResult.Card_8_K_amount
      ) {
        Win_singleNo = 17;
      }

      if (
        AndarBahar_betsResult.Card_Black_amount < AndarBahar_betsResult.Card_2_amount &&
        AndarBahar_betsResult.Card_Black_amount < AndarBahar_betsResult.Card_3_amount &&
        AndarBahar_betsResult.Card_Black_amount < AndarBahar_betsResult.Card_4_amount &&
        AndarBahar_betsResult.Card_Black_amount < AndarBahar_betsResult.Card_5_amount &&
        AndarBahar_betsResult.Card_Black_amount < AndarBahar_betsResult.Card_6_amount &&
        AndarBahar_betsResult.Card_Black_amount < AndarBahar_betsResult.Card_7_amount &&
        AndarBahar_betsResult.Card_Black_amount < AndarBahar_betsResult.Card_8_amount &&
        AndarBahar_betsResult.Card_Black_amount < AndarBahar_betsResult.Card_9_amount &&
        AndarBahar_betsResult.Card_Black_amount < AndarBahar_betsResult.Card_10_amount &&
        AndarBahar_betsResult.Card_Black_amount < AndarBahar_betsResult.Card_J_amount&&
        AndarBahar_betsResult.Card_Black_amount < AndarBahar_betsResult.Card_Q_amount &&
        AndarBahar_betsResult.Card_Black_amount < AndarBahar_betsResult.Card_K_amount &&
        AndarBahar_betsResult.Card_Black_amount < AndarBahar_betsResult.Card_Heart_amount &&
        AndarBahar_betsResult.Card_Black_amount < AndarBahar_betsResult.Card_Diamond_amount &&
        AndarBahar_betsResult.Card_Black_amount < AndarBahar_betsResult.Card_Club_amount &&
        AndarBahar_betsResult.Card_Black_amount < AndarBahar_betsResult.Card_Spade_amount &&
        AndarBahar_betsResult.Card_Black_amount < AndarBahar_betsResult.Card_Red_amount &&
        AndarBahar_betsResult.Card_Black_amount < AndarBahar_betsResult.Card_A_amount &&
        AndarBahar_betsResult.Card_Black_amount < AndarBahar_betsResult.Card_A_6_amount &&
        AndarBahar_betsResult.Card_Black_amount < AndarBahar_betsResult.Card_seven_amount &&
        AndarBahar_betsResult.Card_Black_amount < AndarBahar_betsResult.Card_8_K_amount
      ) {
        Win_singleNo = 18;
      }
      if (
        AndarBahar_betsResult.Card_A_6_amount < AndarBahar_betsResult.Card_2_amount &&
        AndarBahar_betsResult.Card_A_6_amount < AndarBahar_betsResult.Card_3_amount &&
        AndarBahar_betsResult.Card_A_6_amount < AndarBahar_betsResult.Card_4_amount &&
        AndarBahar_betsResult.Card_A_6_amount < AndarBahar_betsResult.Card_5_amount &&
        AndarBahar_betsResult.Card_A_6_amount < AndarBahar_betsResult.Card_6_amount &&
        AndarBahar_betsResult.Card_A_6_amount < AndarBahar_betsResult.Card_7_amount &&
        AndarBahar_betsResult.Card_A_6_amount < AndarBahar_betsResult.Card_8_amount &&
        AndarBahar_betsResult.Card_A_6_amount < AndarBahar_betsResult.Card_9_amount &&
        AndarBahar_betsResult.Card_A_6_amount < AndarBahar_betsResult.Card_10_amount &&
        AndarBahar_betsResult.Card_A_6_amount < AndarBahar_betsResult.Card_J_amount&&
        AndarBahar_betsResult.Card_A_6_amount < AndarBahar_betsResult.Card_Q_amount &&
        AndarBahar_betsResult.Card_A_6_amount < AndarBahar_betsResult.Card_K_amount &&
        AndarBahar_betsResult.Card_A_6_amount < AndarBahar_betsResult.Card_Heart_amount &&
        AndarBahar_betsResult.Card_A_6_amount < AndarBahar_betsResult.Card_Diamond_amount &&
        AndarBahar_betsResult.Card_A_6_amount < AndarBahar_betsResult.Card_Club_amount &&
        AndarBahar_betsResult.Card_A_6_amount < AndarBahar_betsResult.Card_Spade_amount &&
        AndarBahar_betsResult.Card_A_6_amount < AndarBahar_betsResult.Card_Red_amount &&
        AndarBahar_betsResult.Card_A_6_amount < AndarBahar_betsResult.Card_Black_amount &&
        AndarBahar_betsResult.Card_A_6_amount < AndarBahar_betsResult.Card_A_amount &&
        AndarBahar_betsResult.Card_A_6_amount < AndarBahar_betsResult.Card_seven_amount &&
        AndarBahar_betsResult.Card_A_6_amount < AndarBahar_betsResult.Card_8_K_amount
      ) {
        Win_singleNo = 19;
      }

      if (
        AndarBahar_betsResult.Card_seven_amount < AndarBahar_betsResult.Card_2_amount &&
        AndarBahar_betsResult.Card_seven_amount < AndarBahar_betsResult.Card_3_amount &&
        AndarBahar_betsResult.Card_seven_amount < AndarBahar_betsResult.Card_4_amount &&
        AndarBahar_betsResult.Card_seven_amount < AndarBahar_betsResult.Card_5_amount &&
        AndarBahar_betsResult.Card_seven_amount < AndarBahar_betsResult.Card_6_amount &&
        AndarBahar_betsResult.Card_seven_amount < AndarBahar_betsResult.Card_7_amount &&
        AndarBahar_betsResult.Card_seven_amount < AndarBahar_betsResult.Card_8_amount &&
        AndarBahar_betsResult.Card_seven_amount < AndarBahar_betsResult.Card_9_amount &&
        AndarBahar_betsResult.Card_seven_amount < AndarBahar_betsResult.Card_10_amount &&
        AndarBahar_betsResult.Card_seven_amount < AndarBahar_betsResult.Card_J_amount&&
        AndarBahar_betsResult.Card_seven_amount < AndarBahar_betsResult.Card_Q_amount &&
        AndarBahar_betsResult.Card_seven_amount < AndarBahar_betsResult.Card_K_amount &&
        AndarBahar_betsResult.Card_seven_amount < AndarBahar_betsResult.Card_Heart_amount &&
        AndarBahar_betsResult.Card_seven_amount < AndarBahar_betsResult.Card_Diamond_amount &&
        AndarBahar_betsResult.Card_seven_amount < AndarBahar_betsResult.Card_Club_amount &&
        AndarBahar_betsResult.Card_seven_amount < AndarBahar_betsResult.Card_Spade_amount &&
        AndarBahar_betsResult.Card_seven_amount < AndarBahar_betsResult.Card_Red_amount &&
        AndarBahar_betsResult.Card_seven_amount < AndarBahar_betsResult.Card_Black_amount &&
        AndarBahar_betsResult.Card_seven_amount < AndarBahar_betsResult.Card_A_amount &&
        AndarBahar_betsResult.Card_seven_amount < AndarBahar_betsResult.Card_A_6_amount &&
        AndarBahar_betsResult.Card_seven_amount < AndarBahar_betsResult.Card_8_K_amount
      ) {
        Win_singleNo = 20;
      }

      if (
        AndarBahar_betsResult.Card_8_K < AndarBahar_betsResult.Card_2_amount &&
        AndarBahar_betsResult.Card_8_K < AndarBahar_betsResult.Card_3_amount &&
        AndarBahar_betsResult.Card_8_K < AndarBahar_betsResult.Card_4_amount &&
        AndarBahar_betsResult.Card_8_K < AndarBahar_betsResult.Card_5_amount &&
        AndarBahar_betsResult.Card_8_K < AndarBahar_betsResult.Card_6_amount &&
        AndarBahar_betsResult.Card_8_K < AndarBahar_betsResult.Card_7_amount &&
        AndarBahar_betsResult.Card_8_K < AndarBahar_betsResult.Card_8_amount &&
        AndarBahar_betsResult.Card_8_K < AndarBahar_betsResult.Card_9_amount &&
        AndarBahar_betsResult.Card_8_K < AndarBahar_betsResult.Card_10_amount &&
        AndarBahar_betsResult.Card_8_K < AndarBahar_betsResult.Card_J_amount&&
        AndarBahar_betsResult.Card_8_K < AndarBahar_betsResult.Card_Q_amount &&
        AndarBahar_betsResult.Card_8_K < AndarBahar_betsResult.Card_K_amount &&
        AndarBahar_betsResult.Card_8_K < AndarBahar_betsResult.Card_Heart_amount &&
        AndarBahar_betsResult.Card_8_K < AndarBahar_betsResult.Card_Diamond_amount &&
        AndarBahar_betsResult.Card_8_K < AndarBahar_betsResult.Card_Club_amount &&
        AndarBahar_betsResult.Card_8_K < AndarBahar_betsResult.Card_Spade_amount &&
        AndarBahar_betsResult.Card_8_K < AndarBahar_betsResult.Card_Red_amount &&
        AndarBahar_betsResult.Card_8_K < AndarBahar_betsResult.Card_Black_amount &&
        AndarBahar_betsResult.Card_8_K < AndarBahar_betsResult.Card_A_amount &&
        AndarBahar_betsResult.Card_8_K < AndarBahar_betsResult.Card_seven_amount &&
        AndarBahar_betsResult.Card_8_K < AndarBahar_betsResult.Card_A_6_amount
      ) {
        Win_singleNo = 21;
      }
      

if(adminWin.value==-1){
  if (AndarBahar_betsResult.Card_A_amount == 0) {
    winconatinzero.push([0,13,26,39]);
  }
  if (AndarBahar_betsResult.Card_2_amount == 0) {
    winconatinzero.push([1,14,27,40]);
  }
  if (AndarBahar_betsResult.Card_3_amount == 0) {
    winconatinzero.push([2,15,28,41]);
  }
  if (AndarBahar_betsResult.Card_4_amount == 0) {
    winconatinzero.push([3,16,29,42]);
  }
  if (AndarBahar_betsResult.Card_5_amount == 0) {
    winconatinzero.push([4,17,30,43]);
  }
  if (AndarBahar_betsResult.Card_6_amount == 0) {
    winconatinzero.push( [5,18,31,44]);
  }
  if (AndarBahar_betsResult.Card_7_amount == 0) {
    winconatinzero.push([6,19,32,45]);
  }
  if (AndarBahar_betsResult.Card_8_amount == 0) {
    winconatinzero.push([7,20,33,46]);
  }
  if (AndarBahar_betsResult.Card_9_amount == 0) {
    winconatinzero.push([8,21,34,47]);
  }
  if (AndarBahar_betsResult.Card_10_amount == 0) {
    winconatinzero.push( [9,22,35,48]);
  }
  if (AndarBahar_betsResult.Card_J_amount == 0) {
    winconatinzero.push([10,23,36,49]);
  }
  if (AndarBahar_betsResult.Card_Q_amount == 0) {
    winconatinzero.push( [11,24,37,50]);
  }
  
  if (AndarBahar_betsResult.Card_K_amount == 0) {
    winconatinzero.push([12,25,38,51]);
  }
  if (AndarBahar_betsResult.Card_Heart_amount == 0) {
    winconatinzero.push([13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]);
  }
  if (AndarBahar_betsResult.Card_Spade_amount ==0){
    winconatinzero.push([39, 40, 41, 42, 43, 44, 45, 47, 46, 48, 49, 50, 51]);
  }
  if (AndarBahar_betsResult.Card_Club_amount==0){
    winconatinzero.push([26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38])  }
    if (AndarBahar_betsResult.Card_Diamond_amount==0){
      winconatinzero.push([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])  }
      if (AndarBahar_betsResult.Card_Red_amount==0){
        winconatinzero.push([
          0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
          21, 22, 23, 24, 25,
        ])  }
      
        if (AndarBahar_betsResult.Card_Black_amount==0){
          winconatinzero.push([
            26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43,
            44, 45, 47, 46, 48, 49, 50, 51,
          ])  }

          if (AndarBahar_betsResult.Card_A_6_amount==0){
            winconatinzero.push([0,1,2,3,4,5,13,14,15,16,17,18,26,27,28,29,30,31,39,40,41,42,43,44])  }
            if (AndarBahar_betsResult.Card_seven_amount==0){
              winconatinzero.push([6,19,32,45])  }
            
              if (AndarBahar_betsResult.Card_8_K_amount==0){
                winconatinzero.push([7,8,9,10,11,12,20,21,22,23,24,25,33,34,35,36,37,38,46,47,48,49,50,51])  }
              
  if (winconatinzero.length > 0) {
    var l = winconatinzero.length;
    var r = Math.floor(Math.random() * l);
    Win_singleNo = winconatinzero[r][Math.floor(Math.random() * winconatinzero[r].length)]
      //Win_singleNo = win_global;

    
  }/* else{
    Win_singleNo=Win_singleNo.concat(Win_singleNo2)
    Win_singleNo=Win_singleNo.concat(Win_singleNo3)
    Win_singleNo=[...new Set(Win_singleNo)]
    console.log("win",Win_singleNo)
    console.log("win2",Win_singleNo2)
    console.log("win3",Win_singleNo3)
   // Win_singleNo=Win_singleNo[Math.floor(Math.random() * Win_singleNo.length)]
    if (win_global != -1) {
      Win_singleNo = win_global;
    } else {
      win_global =Win_singleNo[Math.floor(Math.random() * Win_singleNo.length)]
      Win_singleNo = win_global;

    }

  } */
  //NewpreviousWin_single.pop();



  
  
  /* if(NewpreviousWin_single[NewpreviousWin_single.length-1]!=Win_singleNo){
    NewpreviousWin_single.push(Win_singleNo);


  }
   */winPoint=0
  if (Game.Card_A_amount != 0 && [0, 13, 26, 39].indexOf(Win_singleNo) != -1) {
    winPoint = winPoint + Game.Card_A_amount * 12;
  }

     if (Game.Card_2_amount != 0 &&[1,14,27,40] .indexOf(Win_singleNo) != -1 ) {
    winPoint = winPoint + Game.Card_2_amount * 12; 
  }

     if (Game.Card_3_amount != 0 && [2,15,28,41].indexOf(Win_singleNo) != -1) {
    winPoint = winPoint + Game.Card_3_amount * 12; 
  }
     if (Game.Card_4_amount != 0 && [3,16,29,42].indexOf(Win_singleNo) != -1) {
    winPoint = winPoint + Game.Card_4_amount * 12; 
  }


  if (Game.Card_5_amount != 0 &&[4,17,38,43].indexOf(Win_singleNo) != -1) {
    winPoint = winPoint + Game.Card_5_amount * 12; 
  }

   if (Game.Card_6_amount != 0 && [5,18,31,44].indexOf(Win_singleNo) != -1) {
    winPoint = winPoint + Game.Card_6_amount * 12; 
  }
   if (Game.Card_7_amount != 0 && [6,19,32,45].indexOf(Win_singleNo) != -1) {
    winPoint = winPoint + Game.Card_7_amount * 12; 
  }

     if (Game.Card_8_amount != 0 && [7,20,33,46].indexOf(Win_singleNo) != -1) {

    winPoint = winPoint + Game.Card_8_amount * 12; 
  }

     if (Game.Card_9_amount != 0 && [8,21,34,47].indexOf(Win_singleNo) != -1) {
    winPoint = winPoint + Game.Card_9_amount * 12; 
  }
 
  if (Game.Card_10_amount != 0 && [9,22,35,48].indexOf(Win_singleNo) != -1) {

    winPoint = winPoint + Game.Card_10_amount * 12; 
  }

     if (Game.Card_J_amount != 0 &&[10,23,36,49].indexOf(Win_singleNo) != -1) {
    winPoint = winPoint + Game.Card_J_amount * 12; 
  }

     if (Game.Card_Q_amount != 0 && [11,24,37,50].indexOf(Win_singleNo) != -1) {
    winPoint = winPoint + Game.Card_Q_amount * 12; 
  }

  if (Game.Card_K_amount != 0 && [13, 25, 38, 51].indexOf(Win_singleNo) != -1) {
    winPoint = winPoint + Game.Card_K_amount * 12; 
  }


  if (
    Game.Card_Heart_amount != 0 &&
    [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25].indexOf(
      Win_singleNo
    ) != -1
  ) {
    winPoint = winPoint + Game.Card_Heart_amount * 3.7;
  }

  if (
    Game.Card_Spade_amount != 0 &&
    [39, 40, 41, 42, 43, 44, 45, 47, 46, 48, 49, 50, 51].indexOf(
      Win_singleNo
    ) != -1
  ) {
    winPoint = winPoint + Game.Card_Spade_amount * 3.7; /*------------x9*/
  }

  if (
    Game.Card_Club_amount != 0 &&
    [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38].indexOf(
      Win_singleNo
    ) != -1
  ) {
    winPoint = winPoint + Game.Card_Club_amount * 3.7; /*------------x9*/
  }

  if (
    Game.Card_Diamond_amount != 0 &&
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].indexOf(Win_singleNo) != -1
  ) {
    winPoint = winPoint + Game.Card_Diamond_amount * 3.7; /*------------x9*/
  }

  /*----------------------------------------*/

  if (
    Game.Card_Red_amount != 0 &&
    [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24, 25,
    ].indexOf(Win_singleNo) != -1
  ) {
    winPoint = winPoint + Game.Card_Red_amount * 1.9; /*------------x9*/
  }

  if (
    Game.Card_Black_amount != 0 &&
    [
      26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43,
      44, 45, 47, 46, 48, 49, 50, 51,
    ].indexOf(Win_singleNo) != -1
  ) {
    winPoint = winPoint + Game.Card_Black_amount * 1.9; /*------------x9*/
  }
  /*------------------------------------------------------*/

  if (Game.Card_A_6_amount != 0 && [0,1,2,3,4,5,13,14,15,16,17,18,26,27,28,29,30,31,39,40,41,42,43,44].indexOf(Win_singleNo) != -1) {
    winPoint = winPoint + Game.Card_A_6_amount * 1.9; /*------------x9*/
  }

  //if (Game.Card_seven_amount != 0 && Win_singleNo == 7) {
  if (Game.Card_seven_amount != 0 && [6,19,32,45].indexOf(Win_singleNo) !=-1) {

    winPoint = winPoint + Game.Card_seven_amount * 12; /*------------x9*/
  }

  if (Game.Card_8_K_amount != 0 && [7,8,9,10,11,12,20,21,22,23,24,25,33,34,35,36,37,38,46,47,48,49,50,51].indexOf(Win_singleNo) != -1) {
    winPoint = winPoint + Game.Card_8_K_amount * 1.9; /*------------x9*/
  }
  /*---------------------------------------------------------------- */
  let random_andhar_bahar = AndarBahar_betsResult.Card_Andhar_amount<=AndarBahar_betsResult.Card_Bahar_amount?1:0; //0to1
  random_andhar_bahar_final = random_andhar_bahar;
  if (Game.Card_Andhar_amount != 0 && random_andhar_bahar == 0) {
    if(Andar_Card_List[Andar_Card_List.length-1]!=Win_singleNo){
     // Andar_Card_List.shift()
      Andar_Card_List.push(Win_singleNo);


    }
    
    /* Andar_Card_List.push(Win_singleNo)
     */winPoint = winPoint + Game.Card_Andhar_amount * 1.9; /*------------x9*/
  }

  if (Game.Card_Bahar_amount != 0 && random_andhar_bahar == 1) {
    if(Bahar_Card_List[Bahar_Card_List.length-1]!=Win_singleNo){
    //  Bahar_Card_List.shift()

      Bahar_Card_List.push(Win_singleNo);


    }
  
   // Bahar_Card_List.push(Win_singleNo)
    winPoint = winPoint + Game.Card_Bahar_amount * 1.9; /*------------x9*/
  }

 // NewpreviousWin_single.push(Win_singleNo);
 if(Array.isArray(Win_singleNo)==false){

  console.log("Win_singleNo", Win_singleNo);
  await service.UpdateGameRunningDataWinSingleNumber(
    data.playerId,
    Game.playedTime,
    Win_singleNo
  );

    let Game1 = await service.UpdateGameRunningDataWinpoint(
      data.playerId,
      Game.playedTime,
      winPoint,
    );
 }


 else{

  Win_singleNo=Win_singleNo[Math.floor(Math.random()*Win_singleNo.length)]
  console.log("Win_singleNo", Win_singleNo);
  await service.UpdateGameRunningDataWinSingleNumber(
    data.playerId,
    Game.playedTime,
    Win_singleNo
  );

    let Game1 = await service.UpdateGameRunningDataWinpoint(
      data.playerId,
      Game.playedTime,
      winPoint,
    );
 }
  /*   let point = await service.updateUserPoint(
      data.playerId,
      winPoint
    );
    console.log("Points", point);
   *//*   await service.RemovePlayerIdInBetplaced(data.playerId); */
     await service.PlayerDetails(data.playerId,ROUND_COUNT,Win_singleNo,random_andhar_bahar);

     await service.WinamountDetails(data.playerId,game_id, winPoint)

  /*   socket.emit("OnWinNo", {
      message: " wins",
      winPoint: winPoint,
      win_andhar_bahar: random_andhar_bahar,
Andar_Card_List : Andar_Card_List  ,
Bahar_Card_List : Bahar_Card_List  ,

      winNo: Win_singleNo,
      playerId: data.playerId,
      RoundCount: ROUND_COUNT,
      // previousWin_single: previousWin_single,
      previousWin_single: NewpreviousWin_single,

      //Balance: point,
    });
   */  SuffleBots();
  
  //    socket.emit("OnWinNoResult",{message:Game})


}
  




else{

  Win_singleNo=adminWin.value


  //NewpreviousWin_single.pop();
/*  if(NewpreviousWin_single[NewpreviousWin_single.length-1]!=Win_singleNo){
    NewpreviousWin_single.push(Win_singleNo);


  }
 */  winPoint=0
  if (Game.Card_A_amount != 0 && [0, 13, 26, 39].indexOf(Win_singleNo) != -1) {
    winPoint = winPoint + Game.Card_A_amount * 12;
  }

     if (Game.Card_2_amount != 0 &&[1,14,27,40] .indexOf(Win_singleNo) != -1 ) {
    winPoint = winPoint + Game.Card_2_amount * 12; 
  }

     if (Game.Card_3_amount != 0 && [2,15,28,41].indexOf(Win_singleNo) != -1) {
    winPoint = winPoint + Game.Card_3_amount * 12; 
  }
     if (Game.Card_4_amount != 0 && [3,16,29,42].indexOf(Win_singleNo) != -1) {
    winPoint = winPoint + Game.Card_4_amount * 12; 
  }


  if (Game.Card_5_amount != 0 &&[4,17,38,43].indexOf(Win_singleNo) != -1) {
    winPoint = winPoint + Game.Card_5_amount * 12; 
  }

   if (Game.Card_6_amount != 0 && [5,18,31,44].indexOf(Win_singleNo) != -1) {
    winPoint = winPoint + Game.Card_6_amount * 12; 
  }
   if (Game.Card_7_amount != 0 && [6,19,32,45].indexOf(Win_singleNo) != -1) {
    winPoint = winPoint + Game.Card_7_amount * 12; 
  }

     if (Game.Card_8_amount != 0 && [7,20,33,46].indexOf(Win_singleNo) != -1) {

    winPoint = winPoint + Game.Card_8_amount * 12; 
  }

     if (Game.Card_9_amount != 0 && [8,21,34,47].indexOf(Win_singleNo) != -1) {
    winPoint = winPoint + Game.Card_9_amount * 12; 
  }
 
  if (Game.Card_10_amount != 0 && [9,22,35,48].indexOf(Win_singleNo) != -1) {

    winPoint = winPoint + Game.Card_10_amount * 12; 
  }

     if (Game.Card_J_amount != 0 &&[10,23,36,49].indexOf(Win_singleNo) != -1) {
    winPoint = winPoint + Game.Card_J_amount * 12; 
  }

     if (Game.Card_Q_amount != 0 && [11,24,37,50].indexOf(Win_singleNo) != -1) {
    winPoint = winPoint + Game.Card_Q_amount * 12; 
  }

  if (Game.Card_K_amount != 0 && [13, 25, 38, 51].indexOf(Win_singleNo) != -1) {
    winPoint = winPoint + Game.Card_K_amount * 12; 
  }


  if (
    Game.Card_Heart_amount != 0 &&
    [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25].indexOf(
      Win_singleNo
    ) != -1
  ) {
    winPoint = winPoint + Game.Card_Heart_amount * 3.7;
  }

  if (
    Game.Card_Spade_amount != 0 &&
    [39, 40, 41, 42, 43, 44, 45, 47, 46, 48, 49, 50, 51].indexOf(
      Win_singleNo
    ) != -1
  ) {
    winPoint = winPoint + Game.Card_Spade_amount * 3.7; /*------------x9*/
  }

  if (
    Game.Card_Club_amount != 0 &&
    [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38].indexOf(
      Win_singleNo
    ) != -1
  ) {
    winPoint = winPoint + Game.Card_Club_amount * 3.7; /*------------x9*/
  }

  if (
    Game.Card_Diamond_amount != 0 &&
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].indexOf(Win_singleNo) != -1
  ) {
    winPoint = winPoint + Game.Card_Diamond_amount * 3.7; /*------------x9*/
  }

  /*----------------------------------------*/

  if (
    Game.Card_Red_amount != 0 &&
    [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24, 25,
    ].indexOf(Win_singleNo) != -1
  ) {
    winPoint = winPoint + Game.Card_Red_amount * 1.9; /*------------x9*/
  }

  if (
    Game.Card_Black_amount != 0 &&
    [
      26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43,
      44, 45, 47, 46, 48, 49, 50, 51,
    ].indexOf(Win_singleNo) != -1
  ) {
    winPoint = winPoint + Game.Card_Black_amount * 1.9; /*------------x9*/
  }
  /*------------------------------------------------------*/

  if (Game.Card_A_6_amount != 0 && [0,1,2,3,4,5,13,14,15,16,17,18,26,27,28,29,30,31,39,40,41,42,43,44].indexOf(Win_singleNo) != -1) {
    winPoint = winPoint + Game.Card_A_6_amount * 1.9; /*------------x9*/
  }

  if (Game.Card_seven_amount != 0 && [6,19,32,45].indexOf(Win_singleNo)!= -1) {
 // if (Game.Card_seven_amount != 0 && Win_singleNo == 7) {

    winPoint = winPoint + Game.Card_seven_amount * 12; /*------------x9*/
  }

  if (Game.Card_8_K_amount != 0 && [7,8,9,10,11,12,20,21,22,23,24,25,33,34,35,36,37,38,46,47,48,49,50,51].indexOf(Win_singleNo) != -1) {
    winPoint = winPoint + Game.Card_8_K_amount * 1.9; /*------------x9*/
  }
  /*---------------------------------------------------------------- */
  let random_andhar_bahar = AndarBahar_betsResult.Card_Andhar_amount<=AndarBahar_betsResult.Card_Bahar_amount?1:0; //0to1
  random_andhar_bahar_final = random_andhar_bahar;
  if (Game.Card_Andhar_amount != 0 && random_andhar_bahar == 0) {
    if(Andar_Card_List[Andar_Card_List.length-1]!=Win_singleNo){
    //  Andar_Card_List.shift()
      Andar_Card_List.push(Win_singleNo);


    }
    
    /* Andar_Card_List.push(Win_singleNo)
     */winPoint = winPoint + Game.Card_Andhar_amount * 1.9; /*------------x9*/
  }

  if (Game.Card_Bahar_amount != 0 && random_andhar_bahar == 1) {
    if(Bahar_Card_List[Bahar_Card_List.length-1]!=Win_singleNo){
    //  Bahar_Card_List.shift()

      Bahar_Card_List.push(Win_singleNo);


    }
  
   // Bahar_Card_List.push(Win_singleNo)
    winPoint = winPoint + Game.Card_Bahar_amount * 1.9; /*------------x9*/
  }

 // NewpreviousWin_single.push(Win_singleNo);

 if(Array.isArray(Win_singleNo)==false){

  console.log("Win_singleNo", Win_singleNo);
  await service.UpdateGameRunningDataWinSingleNumber(
    data.playerId,
    Game.playedTime,
    Win_singleNo
  );

    let Game1 = await service.UpdateGameRunningDataWinpoint(
      data.playerId,
      Game.playedTime,
      winPoint,
    );
 }


 else{

  Win_singleNo=Win_singleNo[Math.floor(Math.random()*Win_singleNo.length)]
  console.log("Win_singleNo", Win_singleNo);
  await service.UpdateGameRunningDataWinSingleNumber(
    data.playerId,
    Game.playedTime,
    Win_singleNo
  );

    let Game1 = await service.UpdateGameRunningDataWinpoint(
      data.playerId,
      Game.playedTime,
      winPoint,
    );
 }
 
  /*   let point = await service.updateUserPoint(
      data.playerId,
      winPoint
    );
    console.log("Points", point);
   *//*   await service.RemovePlayerIdInBetplaced(data.playerId); */
    // await service.PlayerDetails(data.playerId,ROUND_COUNT,Win_singleNo,random_andhar_bahar);
    await service.PlayerDetails(data.playerId,ROUND_COUNT,adminWin.value,random_andhar_bahar);

    await service.WinamountDetails(data.playerId,game_id, winPoint)

  /*   socket.emit("OnWinNo", {
      message: " wins",
      winPoint: winPoint,
      win_andhar_bahar: random_andhar_bahar,
Andar_Card_List : Andar_Card_List  ,
Bahar_Card_List : Bahar_Card_List  ,

      winNo: adminWin.value,
      playerId: data.playerId,
      RoundCount: ROUND_COUNT,
      // previousWin_single: previousWin_single,
      previousWin_single: NewpreviousWin_single,

      //Balance: point,
    });
   */  SuffleBots();
  
  //    socket.emit("OnWinNoResult",{message:Game})



}








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

    await service.addwinningpoint(playerName, winPoint);
    let result = await service.onbalance(playerName);
    userbalance = result[0].point;

    socket.emit(events.OnWinAmount, {
      win_no: Win_singleNo,
      RoundCount: ROUND_COUNT,
      win_point: winPoint,
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
    // timer,
    // gameState,
    // socketId : player.socketId,
    gametimer: i,
    previous_Wins: NewpreviousWin_single,
    botsBetsDetails: BotsBetsDetails,
    // balance: player.balance,
  };

  socket.emit(events.OnCurrentTimer, obj);
}

//Game History Record=====================================================================
function gameHistoryRecord(data) {
  let socket = data[commonVar.socket];
  socket.on(events.OnHistoryRecord, async function (data) {
    let matrixRecord = await service.gameMartixRecords();
    let slotRecord = await service.gameSlotRecords();
    socket.emit(events.OnHistoryRecord, {
      matrixRecord: previousWins,
      slotRecord,
    });
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
  let winPoint = result.win_point;
  let singleNo = result.singleNo;

  let data = {
    room_id: timeStamp,
    game_id: 3,
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

   if (playerName != "") {
    var result1 = await service.onbalance(playerName);
  } else {
    var result1 = [{ point: 0 }];
  }
 

  Sockets.to(gameRoom).emit(events.OnWinNo, {
    //displayCard: WinningCards,
    //winNo,

    // winningSpot,
    //previous_win: previousWin_single,
   // winPoint: winPoint,
    //win_andhar_bahar: random_andhar_bahar_final,
    // botsBetsDetails: BotsBetsDetails,
    RoundCount: ROUND_COUNT,

   // Balance: result1[0].point,
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
    leastBetSpot = Math.floor(Math.random() * 3); //caculate random no form 0 to 2
    winNo = generateSpotWinningNo(leastBetSpot);
    leastBetSpot = Math.floor(Math.random() * 3); // for winning spot 0 to 9
  } else {
    let leastBet = Math.min.apply(Math, bets); //minimum amount bet
    leastBetSpot = bets.indexOf(leastBet); //minimum  bet amount spot
    winNo = generateSpotWinningNo(leastBetSpot);
    leastBetSpot = Math.floor(Math.random() * 3); // for winning spot 0 to 9
  }if(isbetPlaced==false){
  Win_singleNo = Math.floor(Math.random() * 52); // for winning spot 0 to 9
  }
  previousWin_single.shift();
isbetPlaced=false
  previousWin_single.push(Win_singleNo);
  console.log("previousWin", previousWin_single, " ", Win_singleNo);
  winPoint = 0;

  /* --------------------CartegoriesTypes Bets---------------------------*/

  /* if (Card_A != 0 && Win_singleNo == 39) {
    winPoint = winPoint + Card_A * 12; /*------------x9
  }*/

   if (Card_A != 0 && [0, 13, 26, 39].indexOf(Win_singleNo) != -1) {
    winPoint = winPoint + Card_A * 12;
  }

     if (Card_2 != 0 &&[1,14,27,40] .indexOf(Win_singleNo) != -1 ) {
    winPoint = winPoint + Card_2 * 12; 
  }

     if (Card_3 != 0 && [2,15,28,41].indexOf(Win_singleNo) != -1) {
    winPoint = winPoint + Card_3 * 12; 
  }
     if (Card_4 != 0 && [3,16,29,42].indexOf(Win_singleNo) != -1) {
    winPoint = winPoint + Card_4 * 12; 
  }


  if (Card_5 != 0 &&[4,17,38,43].indexOf(Win_singleNo) != -1) {
    winPoint = winPoint + Card_5 * 12; 
  }

   if (Card_6 != 0 && [5,18,31,44].indexOf(Win_singleNo) != -1) {
    winPoint = winPoint + Card_6 * 12; 
  }
   if (Card_7 != 0 && [6,19,32,45].indexOf(Win_singleNo) != -1) {
    winPoint = winPoint + Card_7 * 12; 
  }

     if (Card_8 != 0 && [7,20,33,46].indexOf(Win_singleNo) != -1) {

    winPoint = winPoint + Card_8 * 12; 
  }

     if (Card_9 != 0 && [8,21,34,47].indexOf(Win_singleNo) != -1) {
    winPoint = winPoint + Card_9 * 12; 
  }
 
  if (Card_10 != 0 && [9,22,35,48].indexOf(Win_singleNo) != -1) {

    winPoint = winPoint + Card_10 * 12; 
  }

     if (Card_J != 0 &&[10,23,36,49].indexOf(Win_singleNo) != -1) {
    winPoint = winPoint + Card_J * 12; 
  }

     if (Card_Q != 0 && [11,24,37,50].indexOf(Win_singleNo) != -1) {
    winPoint = winPoint + Card_Q * 12; 
  }

  if (Card_K != 0 && [13, 25, 38, 51].indexOf(Win_singleNo) != -1) {
    winPoint = winPoint + Card_K * 12; 
  }

 /*

  if (Card_A != 0 && [0, 13, 26, 39].indexOf(Win_singleNo) != -1) {
    winPoint = winPoint + Card_A * 12;
  }

  if (Card_2 != 0 && Win_singleNo == 40) {
    winPoint = winPoint + Card_2 * 12;
  }

  if (Card_3 != 0 && Win_singleNo == 41) {
    winPoint = winPoint + Card_3 * 12;
  }
  if (Card_4 != 0 && Win_singleNo == 42) {
    winPoint = winPoint + Card_4 * 12;
  }

  if (Card_5 != 0 && Win_singleNo == 43) {
    winPoint = winPoint + Card_5 * 12;
  }

  if (Card_6 != 0 && Win_singleNo == 44) {
    winPoint = winPoint + Card_6 * 12;
  }
  if (Card_7 != 0 && Win_singleNo == 45) {
    winPoint = winPoint + Card_7 * 12;
  }

  if (Card_8 != 0 && Win_singleNo == 46) {
    winPoint = winPoint + Card_8 * 12;
  }

  if (Card_9 != 0 && Win_singleNo == 47) {
    winPoint = winPoint + Card_9 * 12;
  }
  if (Card_10 != 0 && Win_singleNo == 48) {
    winPoint = winPoint + Card_10 * 12;
  }

  if (Card_J != 0 && Win_singleNo == 49) {
    winPoint = winPoint + Card_J * 12;
  }

  if (Card_Q != 0 && Win_singleNo == 50) {
    winPoint = winPoint + Card_Q * 12;
  }
   if (Card_K != 0 && Win_singleNo == 51) {
    winPoint = winPoint + Card_K * 12; //------------x9
  }*/
 
 /*  if (Card_Heart != 0 && [13, 25, 38, 51].indexOf(Win_singleNo) != -1) {
    winPoint = winPoint + Card_Heart * 12; 
  }
 
  /*----------- --------------------------------------------------------------------     ---------------*/

  if (
    Card_Heart != 0 &&
    [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25].indexOf(
      Win_singleNo
    ) != -1
  ) {
    winPoint = winPoint + Card_Heart * 4;
  }

  if (
    Card_Spade != 0 &&
    [39, 40, 41, 42, 43, 44, 45, 47, 46, 48, 49, 50, 51].indexOf(
      Win_singleNo
    ) != -1
  ) {
    winPoint = winPoint + Card_Spade * 4; /*------------x9*/
  }

  if (
    Card_Club != 0 &&
    [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38].indexOf(
      Win_singleNo
    ) != -1
  ) {
    winPoint = winPoint + Card_Club * 4; /*------------x9*/
  }

  if (
    Card_Diamond != 0 &&
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].indexOf(Win_singleNo) != -1
  ) {
    winPoint = winPoint + Card_Diamond * 4; /*------------x9*/
  }

  /*----------------------------------------*/

  if (
    Card_Red != 0 &&
    [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24, 25,
    ].indexOf(Win_singleNo) != -1
  ) {
    winPoint = winPoint + Card_Red * 2; /*------------x9*/
  }

  if (
    Card_Black != 0 &&
    [
      26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43,
      44, 45, 47, 46, 48, 49, 50, 51,
    ].indexOf(Win_singleNo) != -1
  ) {
    winPoint = winPoint + Card_Black * 2; /*------------x9*/
  }
  /*------------------------------------------------------*/

  if (Card_A_6 != 0 && [39, 40, 41, 42, 43, 44].indexOf(Win_singleNo) != -1) {
    winPoint = winPoint + Card_A_6 * 2; /*------------x9*/
  }

  if (Card_seven != 0 && Win_singleNo == 7) {
    winPoint = winPoint + Card_seven * 12; /*------------x9*/
  }

  if (Card_8_K != 0 && [47, 46, 48, 49, 50, 51].indexOf(Win_singleNo) != -1) {
    winPoint = winPoint + Card_8_K * 2; /*------------x9*/
  }
  /*---------------------------------------------------------------- */
  let random_andhar_bahar = Math.floor(Math.random() * 2); //0to1
  random_andhar_bahar_final = random_andhar_bahar;
  if (Card_Andhar != 0 && random_andhar_bahar == 0) {
    winPoint = winPoint + Card_Andhar * 2; /*------------x9*/
  }

  if (Card_Bahar != 0 && random_andhar_bahar == 1) {
    winPoint = winPoint + Card_Bahar * 2; /*------------x9*/
  }
  /*---------------------------------------------------------------- */
  Card_A = 0;
  Card_2 = 0;
  Card_3 = 0;
  Card_4 = 0;
  Card_5 = 0;
  Card_6 = 0;
  Card_7 = 0;
  Card_8 = 0;
  Card_9 = 0;
  Card_10 = 0;
  Card_J = 0;
  Card_Q = 0;
  Card_K = 0;

  Card_Heart = 0;
  Card_Diamond = 0;
  Card_Spade = 0;
  Card_Club = 0;

  Card_Red = 0;
  Card_Black = 0;

  Card_A_6 = 0;
  Card_seven = 0;
  Card_8_K = 0;

  Card_Andhar = 0;
  Card_Bahar = 0;
   if (playerName != "") {
    await service.addwinningpoint(playerName, winPoint);
  } //db
 

  return {
    singleNo: Win_singleNo,
    win_point: winPoint,
    winNo: Win_singleNo,
    spot: leastBetSpot,
  };
}

function generateSpotWinningNo(leastBetSpot) {
  let win1;
  let win2;
  switch (leastBetSpot) {
    case spot.left:
      win1 = Math.floor(GetRandomNo(2, 53));
      win2 = Math.floor(GetRandomNo(1, win1));
      break;
    case spot.middle:
      win1 = Math.floor(GetRandomNo(1, 53));
      win2 = win1;
      break;
    case spot.right:
      win2 = Math.floor(GetRandomNo(2, 53));
      win1 = Math.floor(GetRandomNo(1, win2));
      break;
    default:
      break;
  }
  return win2;
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
let i = timerVar.bettingNewAndarbhar;
let j = timerVar.betCalculationTimer;
let k = timerVar.waitTimer;
let isTimeUp = false;
let canPlaceBets = true;

 async function ResetTimers() {
  let D = new Date();
  timeStamp = D.getTime();

  //ROUND_COUNT = ROUND_COUNT === 5 ? 0 : ++ROUND_COUNT;
  ROUND_COUNT = ROUND_COUNT + 1;
  flags1=0;
  i = timerVar.bettingNewAndarbhar;
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

  if (j === 8){
var winconatinzero=[]
      var playerData=await service.GetAllplayer()
      console.log(playerData)

      for(var index=0;index<playerData.length;index++){
        await OnWinNo({playerId:playerData[index].playerId})
   
       }
     
      /* playerData.forEach(item => {
        OnWinNo({playerId:item.playerId})
      });
       */if(playerData.length>0){  
  
        var AndarBahar_betsResult = await service.DetailAndarBahar();
        console.log("DetailAndarBahar", AndarBahar_betsResult);
       
  
  
  
  
        if (
          AndarBahar_betsResult.Card_A_amount <= AndarBahar_betsResult.Card_2_amount &&
          AndarBahar_betsResult.Card_A_amount <= AndarBahar_betsResult.Card_3_amount &&
          AndarBahar_betsResult.Card_A_amount <= AndarBahar_betsResult.Card_4_amount &&
          AndarBahar_betsResult.Card_A_amount <= AndarBahar_betsResult.Card_5_amount &&
          AndarBahar_betsResult.Card_A_amount <= AndarBahar_betsResult.Card_6_amount &&
          AndarBahar_betsResult.Card_A_amount <= AndarBahar_betsResult.Card_7_amount &&
          AndarBahar_betsResult.Card_A_amount <= AndarBahar_betsResult.Card_8_amount &&
          AndarBahar_betsResult.Card_A_amount <= AndarBahar_betsResult.Card_9_amount &&
          AndarBahar_betsResult.Card_A_amount <= AndarBahar_betsResult.Card_10_amount &&
          AndarBahar_betsResult.Card_A_amount <= AndarBahar_betsResult.Card_J_amount&&
          AndarBahar_betsResult.Card_A_amount <= AndarBahar_betsResult.Card_Q_amount &&
          AndarBahar_betsResult.Card_A_amount <= AndarBahar_betsResult.Card_K_amount &&
          AndarBahar_betsResult.Card_A_amount <= AndarBahar_betsResult.Card_Heart_amount &&
          AndarBahar_betsResult.Card_A_amount <= AndarBahar_betsResult.Card_Diamond_amount &&
          AndarBahar_betsResult.Card_A_amount <= AndarBahar_betsResult.Card_Club_amount &&
          AndarBahar_betsResult.Card_A_amount <= AndarBahar_betsResult.Card_Spade_amount &&
          AndarBahar_betsResult.Card_A_amount <= AndarBahar_betsResult.Card_Red_amount &&
          AndarBahar_betsResult.Card_A_amount <= AndarBahar_betsResult.Card_Black_amount &&
          AndarBahar_betsResult.Card_A_amount <= AndarBahar_betsResult.Card_A_6_amount &&
          AndarBahar_betsResult.Card_A_amount <= AndarBahar_betsResult.Card_seven_amount &&
          AndarBahar_betsResult.Card_A_amount <= AndarBahar_betsResult.Card_8_K_amount
        ) {
          Win_singleNo = 0;
        }
        if (
          AndarBahar_betsResult.Card_2_amount <= AndarBahar_betsResult.Card_A_amount &&
          AndarBahar_betsResult.Card_2_amount <= AndarBahar_betsResult.Card_3_amount &&
          AndarBahar_betsResult.Card_2_amount <= AndarBahar_betsResult.Card_4_amount &&
          AndarBahar_betsResult.Card_2_amount <= AndarBahar_betsResult.Card_5_amount &&
          AndarBahar_betsResult.Card_2_amount <= AndarBahar_betsResult.Card_6_amount &&
          AndarBahar_betsResult.Card_2_amount <= AndarBahar_betsResult.Card_7_amount &&
          AndarBahar_betsResult.Card_2_amount <= AndarBahar_betsResult.Card_8_amount &&
          AndarBahar_betsResult.Card_2_amount <= AndarBahar_betsResult.Card_9_amount &&
          AndarBahar_betsResult.Card_2_amount <= AndarBahar_betsResult.Card_10_amount &&
          AndarBahar_betsResult.Card_2_amount <= AndarBahar_betsResult.Card_J_amount&&
          AndarBahar_betsResult.Card_2_amount <= AndarBahar_betsResult.Card_Q_amount &&
          AndarBahar_betsResult.Card_2_amount <= AndarBahar_betsResult.Card_K_amount &&
          AndarBahar_betsResult.Card_2_amount <= AndarBahar_betsResult.Card_Heart_amount &&
          AndarBahar_betsResult.Card_2_amount <= AndarBahar_betsResult.Card_Diamond_amount &&
          AndarBahar_betsResult.Card_2_amount <= AndarBahar_betsResult.Card_Club_amount &&
          AndarBahar_betsResult.Card_2_amount <= AndarBahar_betsResult.Card_Spade_amount &&
          AndarBahar_betsResult.Card_2_amount <= AndarBahar_betsResult.Card_Red_amount &&
          AndarBahar_betsResult.Card_2_amount <= AndarBahar_betsResult.Card_Black_amount &&
          AndarBahar_betsResult.Card_2_amount <= AndarBahar_betsResult.Card_A_6_amount &&
          AndarBahar_betsResult.Card_2_amount <= AndarBahar_betsResult.Card_seven_amount &&
          AndarBahar_betsResult.Card_2_amount <= AndarBahar_betsResult.Card_8_K_amount
        ) {
          Win_singleNo = 1;
        }
        if (
          AndarBahar_betsResult.Card_3_amount <= AndarBahar_betsResult.Card_2_amount &&
          AndarBahar_betsResult.Card_3_amount <= AndarBahar_betsResult.Card_A_amount &&
          AndarBahar_betsResult.Card_3_amount <= AndarBahar_betsResult.Card_4_amount &&
          AndarBahar_betsResult.Card_3_amount <= AndarBahar_betsResult.Card_5_amount &&
          AndarBahar_betsResult.Card_3_amount <= AndarBahar_betsResult.Card_6_amount &&
          AndarBahar_betsResult.Card_3_amount <= AndarBahar_betsResult.Card_7_amount &&
          AndarBahar_betsResult.Card_3_amount <= AndarBahar_betsResult.Card_8_amount &&
          AndarBahar_betsResult.Card_3_amount <= AndarBahar_betsResult.Card_9_amount &&
          AndarBahar_betsResult.Card_3_amount <= AndarBahar_betsResult.Card_10_amount &&
          AndarBahar_betsResult.Card_3_amount <= AndarBahar_betsResult.Card_J_amount&&
          AndarBahar_betsResult.Card_3_amount <= AndarBahar_betsResult.Card_Q_amount &&
          AndarBahar_betsResult.Card_3_amount <= AndarBahar_betsResult.Card_K_amount &&
          AndarBahar_betsResult.Card_3_amount <= AndarBahar_betsResult.Card_Heart_amount &&
          AndarBahar_betsResult.Card_3_amount <= AndarBahar_betsResult.Card_Diamond_amount &&
          AndarBahar_betsResult.Card_3_amount <= AndarBahar_betsResult.Card_Club_amount &&
          AndarBahar_betsResult.Card_3_amount <= AndarBahar_betsResult.Card_Spade_amount &&
          AndarBahar_betsResult.Card_3_amount <= AndarBahar_betsResult.Card_Red_amount &&
          AndarBahar_betsResult.Card_3_amount <= AndarBahar_betsResult.Card_Black_amount &&
          AndarBahar_betsResult.Card_3_amount <= AndarBahar_betsResult.Card_A_6_amount &&
          AndarBahar_betsResult.Card_3_amount <= AndarBahar_betsResult.Card_seven_amount &&
          AndarBahar_betsResult.Card_3_amount <= AndarBahar_betsResult.Card_8_K_amount
        ) {
          Win_singleNo = 2;
        }
        if (
          AndarBahar_betsResult.Card_4_amount <= AndarBahar_betsResult.Card_2_amount &&
          AndarBahar_betsResult.Card_4_amount <= AndarBahar_betsResult.Card_3_amount &&
          AndarBahar_betsResult.Card_4_amount <= AndarBahar_betsResult.Card_A_amount &&
          AndarBahar_betsResult.Card_4_amount <= AndarBahar_betsResult.Card_5_amount &&
          AndarBahar_betsResult.Card_4_amount <= AndarBahar_betsResult.Card_6_amount &&
          AndarBahar_betsResult.Card_4_amount <= AndarBahar_betsResult.Card_7_amount &&
          AndarBahar_betsResult.Card_4_amount <= AndarBahar_betsResult.Card_8_amount &&
          AndarBahar_betsResult.Card_4_amount <= AndarBahar_betsResult.Card_9_amount &&
          AndarBahar_betsResult.Card_4_amount <= AndarBahar_betsResult.Card_10_amount &&
          AndarBahar_betsResult.Card_4_amount <= AndarBahar_betsResult.Card_J_amount&&
          AndarBahar_betsResult.Card_4_amount <= AndarBahar_betsResult.Card_Q_amount &&
          AndarBahar_betsResult.Card_4_amount <= AndarBahar_betsResult.Card_K_amount &&
          AndarBahar_betsResult.Card_4_amount <= AndarBahar_betsResult.Card_Heart_amount &&
          AndarBahar_betsResult.Card_4_amount <= AndarBahar_betsResult.Card_Diamond_amount &&
          AndarBahar_betsResult.Card_4_amount <= AndarBahar_betsResult.Card_Club_amount &&
          AndarBahar_betsResult.Card_4_amount <= AndarBahar_betsResult.Card_Spade_amount &&
          AndarBahar_betsResult.Card_4_amount <= AndarBahar_betsResult.Card_Red_amount &&
          AndarBahar_betsResult.Card_4_amount <= AndarBahar_betsResult.Card_Black_amount &&
          AndarBahar_betsResult.Card_4_amount <= AndarBahar_betsResult.Card_A_6_amount &&
          AndarBahar_betsResult.Card_4_amount <= AndarBahar_betsResult.Card_seven_amount &&
          AndarBahar_betsResult.Card_4_amount <= AndarBahar_betsResult.Card_8_K_amount
        ) {
          Win_singleNo = 3;
        }
  
        if (
          AndarBahar_betsResult.Card_5_amount <= AndarBahar_betsResult.Card_2_amount &&
          AndarBahar_betsResult.Card_5_amount <= AndarBahar_betsResult.Card_3_amount &&
          AndarBahar_betsResult.Card_5_amount <= AndarBahar_betsResult.Card_4_amount &&
          AndarBahar_betsResult.Card_5_amount <= AndarBahar_betsResult.Card_A_amount &&
          AndarBahar_betsResult.Card_5_amount <= AndarBahar_betsResult.Card_6_amount &&
          AndarBahar_betsResult.Card_5_amount <= AndarBahar_betsResult.Card_7_amount &&
          AndarBahar_betsResult.Card_5_amount <= AndarBahar_betsResult.Card_8_amount &&
          AndarBahar_betsResult.Card_5_amount <= AndarBahar_betsResult.Card_9_amount &&
          AndarBahar_betsResult.Card_5_amount <= AndarBahar_betsResult.Card_10_amount &&
          AndarBahar_betsResult.Card_5_amount <= AndarBahar_betsResult.Card_J_amount&&
          AndarBahar_betsResult.Card_5_amount <= AndarBahar_betsResult.Card_Q_amount &&
          AndarBahar_betsResult.Card_5_amount <= AndarBahar_betsResult.Card_K_amount &&
          AndarBahar_betsResult.Card_5_amount <= AndarBahar_betsResult.Card_Heart_amount &&
          AndarBahar_betsResult.Card_5_amount <= AndarBahar_betsResult.Card_Diamond_amount &&
          AndarBahar_betsResult.Card_5_amount <= AndarBahar_betsResult.Card_Club_amount &&
          AndarBahar_betsResult.Card_5_amount <= AndarBahar_betsResult.Card_Spade_amount &&
          AndarBahar_betsResult.Card_5_amount <= AndarBahar_betsResult.Card_Red_amount &&
          AndarBahar_betsResult.Card_5_amount <= AndarBahar_betsResult.Card_Black_amount &&
          AndarBahar_betsResult.Card_5_amount <= AndarBahar_betsResult.Card_A_6_amount &&
          AndarBahar_betsResult.Card_5_amount <= AndarBahar_betsResult.Card_seven_amount &&
          AndarBahar_betsResult.Card_5_amount <= AndarBahar_betsResult.Card_8_K_amount
        ) {
          Win_singleNo = 4;
        }
  
  
        if (
          AndarBahar_betsResult.Card_6_amount <= AndarBahar_betsResult.Card_2_amount &&
          AndarBahar_betsResult.Card_6_amount <= AndarBahar_betsResult.Card_3_amount &&
          AndarBahar_betsResult.Card_6_amount <= AndarBahar_betsResult.Card_4_amount &&
          AndarBahar_betsResult.Card_6_amount <= AndarBahar_betsResult.Card_5_amount &&
          AndarBahar_betsResult.Card_6_amount <= AndarBahar_betsResult.Card_A_amount &&
          AndarBahar_betsResult.Card_6_amount <= AndarBahar_betsResult.Card_7_amount &&
          AndarBahar_betsResult.Card_6_amount <= AndarBahar_betsResult.Card_8_amount &&
          AndarBahar_betsResult.Card_6_amount <= AndarBahar_betsResult.Card_9_amount &&
          AndarBahar_betsResult.Card_6_amount <= AndarBahar_betsResult.Card_10_amount &&
          AndarBahar_betsResult.Card_6_amount <= AndarBahar_betsResult.Card_J_amount&&
          AndarBahar_betsResult.Card_6_amount <= AndarBahar_betsResult.Card_Q_amount &&
          AndarBahar_betsResult.Card_6_amount <= AndarBahar_betsResult.Card_K_amount &&
          AndarBahar_betsResult.Card_6_amount <= AndarBahar_betsResult.Card_Heart_amount &&
          AndarBahar_betsResult.Card_6_amount <= AndarBahar_betsResult.Card_Diamond_amount &&
          AndarBahar_betsResult.Card_6_amount <= AndarBahar_betsResult.Card_Club_amount &&
          AndarBahar_betsResult.Card_6_amount <= AndarBahar_betsResult.Card_Spade_amount &&
          AndarBahar_betsResult.Card_6_amount <= AndarBahar_betsResult.Card_Red_amount &&
          AndarBahar_betsResult.Card_6_amount <= AndarBahar_betsResult.Card_Black_amount &&
          AndarBahar_betsResult.Card_6_amount <= AndarBahar_betsResult.Card_A_6_amount &&
          AndarBahar_betsResult.Card_6_amount <= AndarBahar_betsResult.Card_seven_amount &&
          AndarBahar_betsResult.Card_6_amount <= AndarBahar_betsResult.Card_8_K_amount
        ) {
          Win_singleNo = 5;
        }
  
  
        if (
          AndarBahar_betsResult.Card_7_amount <= AndarBahar_betsResult.Card_2_amount &&
          AndarBahar_betsResult.Card_7_amount <= AndarBahar_betsResult.Card_3_amount &&
          AndarBahar_betsResult.Card_7_amount <= AndarBahar_betsResult.Card_4_amount &&
          AndarBahar_betsResult.Card_7_amount <= AndarBahar_betsResult.Card_5_amount &&
          AndarBahar_betsResult.Card_7_amount <= AndarBahar_betsResult.Card_6_amount &&
          AndarBahar_betsResult.Card_7_amount <= AndarBahar_betsResult.Card_A_amount &&
          AndarBahar_betsResult.Card_7_amount <= AndarBahar_betsResult.Card_8_amount &&
          AndarBahar_betsResult.Card_7_amount <= AndarBahar_betsResult.Card_9_amount &&
          AndarBahar_betsResult.Card_7_amount <= AndarBahar_betsResult.Card_10_amount &&
          AndarBahar_betsResult.Card_7_amount <= AndarBahar_betsResult.Card_J_amount&&
          AndarBahar_betsResult.Card_7_amount <= AndarBahar_betsResult.Card_Q_amount &&
          AndarBahar_betsResult.Card_7_amount <= AndarBahar_betsResult.Card_K_amount &&
          AndarBahar_betsResult.Card_7_amount <= AndarBahar_betsResult.Card_Heart_amount &&
          AndarBahar_betsResult.Card_7_amount <= AndarBahar_betsResult.Card_Diamond_amount &&
          AndarBahar_betsResult.Card_7_amount <= AndarBahar_betsResult.Card_Club_amount &&
          AndarBahar_betsResult.Card_7_amount <= AndarBahar_betsResult.Card_Spade_amount &&
          AndarBahar_betsResult.Card_7_amount <= AndarBahar_betsResult.Card_Red_amount &&
          AndarBahar_betsResult.Card_7_amount <= AndarBahar_betsResult.Card_Black_amount &&
          AndarBahar_betsResult.Card_7_amount <= AndarBahar_betsResult.Card_A_6_amount &&
          AndarBahar_betsResult.Card_7_amount <= AndarBahar_betsResult.Card_seven_amount &&
          AndarBahar_betsResult.Card_7_amount <= AndarBahar_betsResult.Card_8_K_amount
        ) {
          Win_singleNo = 6;
        }
        if (
          AndarBahar_betsResult.Card_8_amount <= AndarBahar_betsResult.Card_2_amount &&
          AndarBahar_betsResult.Card_8_amount <= AndarBahar_betsResult.Card_3_amount &&
          AndarBahar_betsResult.Card_8_amount <= AndarBahar_betsResult.Card_4_amount &&
          AndarBahar_betsResult.Card_8_amount <= AndarBahar_betsResult.Card_5_amount &&
          AndarBahar_betsResult.Card_8_amount <= AndarBahar_betsResult.Card_6_amount &&
          AndarBahar_betsResult.Card_8_amount <= AndarBahar_betsResult.Card_7_amount &&
          AndarBahar_betsResult.Card_8_amount <= AndarBahar_betsResult.Card_A_amount &&
          AndarBahar_betsResult.Card_8_amount <= AndarBahar_betsResult.Card_9_amount &&
          AndarBahar_betsResult.Card_8_amount <= AndarBahar_betsResult.Card_10_amount &&
          AndarBahar_betsResult.Card_8_amount <= AndarBahar_betsResult.Card_J_amount&&
          AndarBahar_betsResult.Card_8_amount <= AndarBahar_betsResult.Card_Q_amount &&
          AndarBahar_betsResult.Card_8_amount <= AndarBahar_betsResult.Card_K_amount &&
          AndarBahar_betsResult.Card_8_amount <= AndarBahar_betsResult.Card_Heart_amount &&
          AndarBahar_betsResult.Card_8_amount <= AndarBahar_betsResult.Card_Diamond_amount &&
          AndarBahar_betsResult.Card_8_amount <= AndarBahar_betsResult.Card_Club_amount &&
          AndarBahar_betsResult.Card_8_amount <= AndarBahar_betsResult.Card_Spade_amount &&
          AndarBahar_betsResult.Card_8_amount <= AndarBahar_betsResult.Card_Red_amount &&
          AndarBahar_betsResult.Card_8_amount <= AndarBahar_betsResult.Card_Black_amount &&
          AndarBahar_betsResult.Card_8_amount <= AndarBahar_betsResult.Card_A_6_amount &&
          AndarBahar_betsResult.Card_8_amount <= AndarBahar_betsResult.Card_seven_amount &&
          AndarBahar_betsResult.Card_8_amount <= AndarBahar_betsResult.Card_8_K_amount
        ) {
          Win_singleNo = 7;
        }
        if (
          AndarBahar_betsResult.Card_9_amount <= AndarBahar_betsResult.Card_2_amount &&
          AndarBahar_betsResult.Card_9_amount <= AndarBahar_betsResult.Card_3_amount &&
          AndarBahar_betsResult.Card_9_amount <= AndarBahar_betsResult.Card_4_amount &&
          AndarBahar_betsResult.Card_9_amount <= AndarBahar_betsResult.Card_5_amount &&
          AndarBahar_betsResult.Card_9_amount <= AndarBahar_betsResult.Card_6_amount &&
          AndarBahar_betsResult.Card_9_amount <= AndarBahar_betsResult.Card_7_amount &&
          AndarBahar_betsResult.Card_9_amount <= AndarBahar_betsResult.Card_8_amount &&
          AndarBahar_betsResult.Card_9_amount <= AndarBahar_betsResult.Card_A_amount &&
          AndarBahar_betsResult.Card_9_amount <= AndarBahar_betsResult.Card_10_amount &&
          AndarBahar_betsResult.Card_9_amount <= AndarBahar_betsResult.Card_J_amount&&
          AndarBahar_betsResult.Card_9_amount <= AndarBahar_betsResult.Card_Q_amount &&
          AndarBahar_betsResult.Card_9_amount <= AndarBahar_betsResult.Card_K_amount &&
          AndarBahar_betsResult.Card_9_amount <= AndarBahar_betsResult.Card_Heart_amount &&
          AndarBahar_betsResult.Card_9_amount <= AndarBahar_betsResult.Card_Diamond_amount &&
          AndarBahar_betsResult.Card_9_amount <= AndarBahar_betsResult.Card_Club_amount &&
          AndarBahar_betsResult.Card_9_amount <= AndarBahar_betsResult.Card_Spade_amount &&
          AndarBahar_betsResult.Card_9_amount <= AndarBahar_betsResult.Card_Red_amount &&
          AndarBahar_betsResult.Card_9_amount <= AndarBahar_betsResult.Card_Black_amount &&
          AndarBahar_betsResult.Card_9_amount <= AndarBahar_betsResult.Card_A_6_amount &&
          AndarBahar_betsResult.Card_9_amount <= AndarBahar_betsResult.Card_seven_amount &&
          AndarBahar_betsResult.Card_9_amount <= AndarBahar_betsResult.Card_8_K_amount
        ) {
          Win_singleNo = 8;
        }
        if (
          AndarBahar_betsResult.Card_10_amount <= AndarBahar_betsResult.Card_2_amount &&
          AndarBahar_betsResult.Card_10_amount <= AndarBahar_betsResult.Card_3_amount &&
          AndarBahar_betsResult.Card_10_amount <= AndarBahar_betsResult.Card_4_amount &&
          AndarBahar_betsResult.Card_10_amount <= AndarBahar_betsResult.Card_5_amount &&
          AndarBahar_betsResult.Card_10_amount <= AndarBahar_betsResult.Card_6_amount &&
          AndarBahar_betsResult.Card_10_amount <= AndarBahar_betsResult.Card_7_amount &&
          AndarBahar_betsResult.Card_10_amount <= AndarBahar_betsResult.Card_8_amount &&
          AndarBahar_betsResult.Card_10_amount <= AndarBahar_betsResult.Card_9_amount &&
          AndarBahar_betsResult.Card_10_amount <= AndarBahar_betsResult.Card_A_amount &&
          AndarBahar_betsResult.Card_10_amount <= AndarBahar_betsResult.Card_J_amount&&
          AndarBahar_betsResult.Card_10_amount <= AndarBahar_betsResult.Card_Q_amount &&
          AndarBahar_betsResult.Card_10_amount <= AndarBahar_betsResult.Card_K_amount &&
          AndarBahar_betsResult.Card_10_amount <= AndarBahar_betsResult.Card_Heart_amount &&
          AndarBahar_betsResult.Card_10_amount <= AndarBahar_betsResult.Card_Diamond_amount &&
          AndarBahar_betsResult.Card_10_amount <= AndarBahar_betsResult.Card_Club_amount &&
          AndarBahar_betsResult.Card_10_amount <= AndarBahar_betsResult.Card_Spade_amount &&
          AndarBahar_betsResult.Card_10_amount <= AndarBahar_betsResult.Card_Red_amount &&
          AndarBahar_betsResult.Card_10_amount <= AndarBahar_betsResult.Card_Black_amount &&
          AndarBahar_betsResult.Card_10_amount <= AndarBahar_betsResult.Card_A_6_amount &&
          AndarBahar_betsResult.Card_10_amount <= AndarBahar_betsResult.Card_seven_amount &&
          AndarBahar_betsResult.Card_10_amount <= AndarBahar_betsResult.Card_8_K_amount
        ) {
          Win_singleNo = 9;
        }
        if (
          AndarBahar_betsResult.Card_J_amount <= AndarBahar_betsResult.Card_2_amount &&
          AndarBahar_betsResult.Card_J_amount <= AndarBahar_betsResult.Card_3_amount &&
          AndarBahar_betsResult.Card_J_amount <= AndarBahar_betsResult.Card_4_amount &&
          AndarBahar_betsResult.Card_J_amount <= AndarBahar_betsResult.Card_5_amount &&
          AndarBahar_betsResult.Card_J_amount <= AndarBahar_betsResult.Card_6_amount &&
          AndarBahar_betsResult.Card_J_amount <= AndarBahar_betsResult.Card_7_amount &&
          AndarBahar_betsResult.Card_J_amount <= AndarBahar_betsResult.Card_8_amount &&
          AndarBahar_betsResult.Card_J_amount <= AndarBahar_betsResult.Card_9_amount &&
          AndarBahar_betsResult.Card_J_amount <= AndarBahar_betsResult.Card_10_amount &&
          AndarBahar_betsResult.Card_J_amount <= AndarBahar_betsResult.Card_A_amount&&
          AndarBahar_betsResult.Card_J_amount <= AndarBahar_betsResult.Card_Q_amount &&
          AndarBahar_betsResult.Card_J_amount <= AndarBahar_betsResult.Card_K_amount &&
          AndarBahar_betsResult.Card_J_amount <= AndarBahar_betsResult.Card_Heart_amount &&
          AndarBahar_betsResult.Card_J_amount <= AndarBahar_betsResult.Card_Diamond_amount &&
          AndarBahar_betsResult.Card_J_amount <= AndarBahar_betsResult.Card_Club_amount &&
          AndarBahar_betsResult.Card_J_amount <= AndarBahar_betsResult.Card_Spade_amount &&
          AndarBahar_betsResult.Card_J_amount <= AndarBahar_betsResult.Card_Red_amount &&
          AndarBahar_betsResult.Card_J_amount <= AndarBahar_betsResult.Card_Black_amount &&
          AndarBahar_betsResult.Card_J_amount <= AndarBahar_betsResult.Card_A_6_amount &&
          AndarBahar_betsResult.Card_J_amount <= AndarBahar_betsResult.Card_seven_amount &&
          AndarBahar_betsResult.Card_J_amount <= AndarBahar_betsResult.Card_8_K_amount
        ) {
          Win_singleNo = 10;
        }
  
  
  
        if (
          AndarBahar_betsResult.Card_Q_amount <= AndarBahar_betsResult.Card_2_amount &&
          AndarBahar_betsResult.Card_Q_amount <= AndarBahar_betsResult.Card_3_amount &&
          AndarBahar_betsResult.Card_Q_amount <= AndarBahar_betsResult.Card_4_amount &&
          AndarBahar_betsResult.Card_Q_amount <= AndarBahar_betsResult.Card_5_amount &&
          AndarBahar_betsResult.Card_Q_amount <= AndarBahar_betsResult.Card_6_amount &&
          AndarBahar_betsResult.Card_Q_amount <= AndarBahar_betsResult.Card_7_amount &&
          AndarBahar_betsResult.Card_Q_amount <= AndarBahar_betsResult.Card_8_amount &&
          AndarBahar_betsResult.Card_Q_amount <= AndarBahar_betsResult.Card_9_amount &&
          AndarBahar_betsResult.Card_Q_amount <= AndarBahar_betsResult.Card_10_amount &&
          AndarBahar_betsResult.Card_Q_amount <= AndarBahar_betsResult.Card_J_amount&&
          AndarBahar_betsResult.Card_Q_amount <= AndarBahar_betsResult.Card_A_amount &&
          AndarBahar_betsResult.Card_Q_amount <= AndarBahar_betsResult.Card_K_amount &&
          AndarBahar_betsResult.Card_Q_amount <= AndarBahar_betsResult.Card_Heart_amount &&
          AndarBahar_betsResult.Card_Q_amount <= AndarBahar_betsResult.Card_Diamond_amount &&
          AndarBahar_betsResult.Card_Q_amount <= AndarBahar_betsResult.Card_Club_amount &&
          AndarBahar_betsResult.Card_Q_amount <= AndarBahar_betsResult.Card_Spade_amount &&
          AndarBahar_betsResult.Card_Q_amount <= AndarBahar_betsResult.Card_Red_amount &&
          AndarBahar_betsResult.Card_Q_amount <= AndarBahar_betsResult.Card_Black_amount &&
          AndarBahar_betsResult.Card_Q_amount <= AndarBahar_betsResult.Card_A_6_amount &&
          AndarBahar_betsResult.Card_Q_amount <= AndarBahar_betsResult.Card_seven_amount &&
          AndarBahar_betsResult.Card_Q_amount <= AndarBahar_betsResult.Card_8_K_amount
        ) {
          Win_singleNo = 11;
        }
        if (
          AndarBahar_betsResult.Card_K_amount <= AndarBahar_betsResult.Card_2_amount &&
          AndarBahar_betsResult.Card_K_amount <= AndarBahar_betsResult.Card_3_amount &&
          AndarBahar_betsResult.Card_K_amount <= AndarBahar_betsResult.Card_4_amount &&
          AndarBahar_betsResult.Card_K_amount <= AndarBahar_betsResult.Card_5_amount &&
          AndarBahar_betsResult.Card_K_amount <= AndarBahar_betsResult.Card_6_amount &&
          AndarBahar_betsResult.Card_K_amount <= AndarBahar_betsResult.Card_7_amount &&
          AndarBahar_betsResult.Card_K_amount <= AndarBahar_betsResult.Card_8_amount &&
          AndarBahar_betsResult.Card_K_amount <= AndarBahar_betsResult.Card_9_amount &&
          AndarBahar_betsResult.Card_K_amount <= AndarBahar_betsResult.Card_10_amount &&
          AndarBahar_betsResult.Card_K_amount <= AndarBahar_betsResult.Card_J_amount&&
          AndarBahar_betsResult.Card_K_amount <= AndarBahar_betsResult.Card_Q_amount &&
          AndarBahar_betsResult.Card_K_amount <= AndarBahar_betsResult.Card_A_amount &&
          AndarBahar_betsResult.Card_K_amount <= AndarBahar_betsResult.Card_Heart_amount &&
          AndarBahar_betsResult.Card_K_amount <= AndarBahar_betsResult.Card_Diamond_amount &&
          AndarBahar_betsResult.Card_K_amount <= AndarBahar_betsResult.Card_Club_amount &&
          AndarBahar_betsResult.Card_K_amount <= AndarBahar_betsResult.Card_Spade_amount &&
          AndarBahar_betsResult.Card_K_amount <= AndarBahar_betsResult.Card_Red_amount &&
          AndarBahar_betsResult.Card_K_amount <= AndarBahar_betsResult.Card_Black_amount &&
          AndarBahar_betsResult.Card_K_amount <= AndarBahar_betsResult.Card_A_6_amount &&
          AndarBahar_betsResult.Card_K_amount <= AndarBahar_betsResult.Card_seven_amount &&
          AndarBahar_betsResult.Card_K_amount <= AndarBahar_betsResult.Card_8_K_amount
        ) {
          Win_singleNo = 12;
        }
  
        if (
          AndarBahar_betsResult.Card_Heart_amount <= AndarBahar_betsResult.Card_2_amount &&
          AndarBahar_betsResult.Card_Heart_amount <= AndarBahar_betsResult.Card_3_amount &&
          AndarBahar_betsResult.Card_Heart_amount <= AndarBahar_betsResult.Card_4_amount &&
          AndarBahar_betsResult.Card_Heart_amount <= AndarBahar_betsResult.Card_5_amount &&
          AndarBahar_betsResult.Card_Heart_amount <= AndarBahar_betsResult.Card_6_amount &&
          AndarBahar_betsResult.Card_Heart_amount <= AndarBahar_betsResult.Card_7_amount &&
          AndarBahar_betsResult.Card_Heart_amount <= AndarBahar_betsResult.Card_8_amount &&
          AndarBahar_betsResult.Card_Heart_amount <= AndarBahar_betsResult.Card_9_amount &&
          AndarBahar_betsResult.Card_Heart_amount <= AndarBahar_betsResult.Card_10_amount &&
          AndarBahar_betsResult.Card_Heart_amount <= AndarBahar_betsResult.Card_J_amount&&
          AndarBahar_betsResult.Card_Heart_amount <= AndarBahar_betsResult.Card_Q_amount &&
          AndarBahar_betsResult.Card_Heart_amount <= AndarBahar_betsResult.Card_K_amount &&
          AndarBahar_betsResult.Card_Heart_amount <= AndarBahar_betsResult.Card_A_amount &&
          AndarBahar_betsResult.Card_Heart_amount <= AndarBahar_betsResult.Card_Diamond_amount &&
          AndarBahar_betsResult.Card_Heart_amount <= AndarBahar_betsResult.Card_Club_amount &&
          AndarBahar_betsResult.Card_Heart_amount <= AndarBahar_betsResult.Card_Spade_amount &&
          AndarBahar_betsResult.Card_Heart_amount <= AndarBahar_betsResult.Card_Red_amount &&
          AndarBahar_betsResult.Card_Heart_amount <= AndarBahar_betsResult.Card_Black_amount &&
          AndarBahar_betsResult.Card_Heart_amount <= AndarBahar_betsResult.Card_A_6_amount &&
          AndarBahar_betsResult.Card_Heart_amount <= AndarBahar_betsResult.Card_seven_amount &&
          AndarBahar_betsResult.Card_Heart_amount <= AndarBahar_betsResult.Card_8_K_amount
        ) {
          Win_singleNo = 13;
        }
  
  
        if (
          AndarBahar_betsResult.Card_Diamond_amount <= AndarBahar_betsResult.Card_2_amount &&
          AndarBahar_betsResult.Card_Diamond_amount <= AndarBahar_betsResult.Card_3_amount &&
          AndarBahar_betsResult.Card_Diamond_amount <= AndarBahar_betsResult.Card_4_amount &&
          AndarBahar_betsResult.Card_Diamond_amount <= AndarBahar_betsResult.Card_5_amount &&
          AndarBahar_betsResult.Card_Diamond_amount <= AndarBahar_betsResult.Card_6_amount &&
          AndarBahar_betsResult.Card_Diamond_amount <= AndarBahar_betsResult.Card_7_amount &&
          AndarBahar_betsResult.Card_Diamond_amount <= AndarBahar_betsResult.Card_8_amount &&
          AndarBahar_betsResult.Card_Diamond_amount <= AndarBahar_betsResult.Card_9_amount &&
          AndarBahar_betsResult.Card_Diamond_amount <= AndarBahar_betsResult.Card_10_amount &&
          AndarBahar_betsResult.Card_Diamond_amount <= AndarBahar_betsResult.Card_J_amount&&
          AndarBahar_betsResult.Card_Diamond_amount <= AndarBahar_betsResult.Card_Q_amount &&
          AndarBahar_betsResult.Card_Diamond_amount <= AndarBahar_betsResult.Card_K_amount &&
          AndarBahar_betsResult.Card_Diamond_amount <= AndarBahar_betsResult.Card_Heart_amount &&
          AndarBahar_betsResult.Card_Diamond_amount <= AndarBahar_betsResult.Card_A_amount &&
          AndarBahar_betsResult.Card_Diamond_amount <= AndarBahar_betsResult.Card_Club_amount &&
          AndarBahar_betsResult.Card_Diamond_amount <= AndarBahar_betsResult.Card_Spade_amount &&
          AndarBahar_betsResult.Card_Diamond_amount <= AndarBahar_betsResult.Card_Red_amount &&
          AndarBahar_betsResult.Card_Diamond_amount <= AndarBahar_betsResult.Card_Black_amount &&
          AndarBahar_betsResult.Card_Diamond_amount <= AndarBahar_betsResult.Card_A_6_amount &&
          AndarBahar_betsResult.Card_Diamond_amount <= AndarBahar_betsResult.Card_seven_amount &&
          AndarBahar_betsResult.Card_Diamond_amount <= AndarBahar_betsResult.Card_8_K_amount
        ) {
          Win_singleNo = 14;
        }
  
        if (
          AndarBahar_betsResult.Card_Club_amount <= AndarBahar_betsResult.Card_2_amount &&
          AndarBahar_betsResult.Card_Club_amount <= AndarBahar_betsResult.Card_3_amount &&
          AndarBahar_betsResult.Card_Club_amount <= AndarBahar_betsResult.Card_4_amount &&
          AndarBahar_betsResult.Card_Club_amount <= AndarBahar_betsResult.Card_5_amount &&
          AndarBahar_betsResult.Card_Club_amount <= AndarBahar_betsResult.Card_6_amount &&
          AndarBahar_betsResult.Card_Club_amount <= AndarBahar_betsResult.Card_7_amount &&
          AndarBahar_betsResult.Card_Club_amount <= AndarBahar_betsResult.Card_8_amount &&
          AndarBahar_betsResult.Card_Club_amount <= AndarBahar_betsResult.Card_9_amount &&
          AndarBahar_betsResult.Card_Club_amount <= AndarBahar_betsResult.Card_10_amount &&
          AndarBahar_betsResult.Card_Club_amount <= AndarBahar_betsResult.Card_J_amount&&
          AndarBahar_betsResult.Card_Club_amount <= AndarBahar_betsResult.Card_Q_amount &&
          AndarBahar_betsResult.Card_Club_amount <= AndarBahar_betsResult.Card_K_amount &&
          AndarBahar_betsResult.Card_Club_amount <= AndarBahar_betsResult.Card_Heart_amount &&
          AndarBahar_betsResult.Card_Club_amount <= AndarBahar_betsResult.Card_Diamond_amount &&
          AndarBahar_betsResult.Card_Club_amount <= AndarBahar_betsResult.Card_A_amount &&
          AndarBahar_betsResult.Card_Club_amount <= AndarBahar_betsResult.Card_Spade_amount &&
          AndarBahar_betsResult.Card_Club_amount <= AndarBahar_betsResult.Card_Red_amount &&
          AndarBahar_betsResult.Card_Club_amount <= AndarBahar_betsResult.Card_Black_amount &&
          AndarBahar_betsResult.Card_Club_amount <= AndarBahar_betsResult.Card_A_6_amount &&
          AndarBahar_betsResult.Card_Club_amount <= AndarBahar_betsResult.Card_seven_amount &&
          AndarBahar_betsResult.Card_Club_amount <= AndarBahar_betsResult.Card_8_K_amount
        ) {
          Win_singleNo = 15;
        }
  
  
        if (
          AndarBahar_betsResult.Card_Spade_amount <= AndarBahar_betsResult.Card_2_amount &&
          AndarBahar_betsResult.Card_Spade_amount <= AndarBahar_betsResult.Card_3_amount &&
          AndarBahar_betsResult.Card_Spade_amount <= AndarBahar_betsResult.Card_4_amount &&
          AndarBahar_betsResult.Card_Spade_amount <= AndarBahar_betsResult.Card_5_amount &&
          AndarBahar_betsResult.Card_Spade_amount <= AndarBahar_betsResult.Card_6_amount &&
          AndarBahar_betsResult.Card_Spade_amount <= AndarBahar_betsResult.Card_7_amount &&
          AndarBahar_betsResult.Card_Spade_amount <= AndarBahar_betsResult.Card_8_amount &&
          AndarBahar_betsResult.Card_Spade_amount <= AndarBahar_betsResult.Card_9_amount &&
          AndarBahar_betsResult.Card_Spade_amount <= AndarBahar_betsResult.Card_10_amount &&
          AndarBahar_betsResult.Card_Spade_amount <= AndarBahar_betsResult.Card_J_amount&&
          AndarBahar_betsResult.Card_Spade_amount <= AndarBahar_betsResult.Card_Q_amount &&
          AndarBahar_betsResult.Card_Spade_amount <= AndarBahar_betsResult.Card_K_amount &&
          AndarBahar_betsResult.Card_Spade_amount <= AndarBahar_betsResult.Card_Heart_amount &&
          AndarBahar_betsResult.Card_Spade_amount <= AndarBahar_betsResult.Card_Diamond_amount &&
          AndarBahar_betsResult.Card_Spade_amount <= AndarBahar_betsResult.Card_Club_amount &&
          AndarBahar_betsResult.Card_Spade_amount <= AndarBahar_betsResult.Card_A_amount &&
          AndarBahar_betsResult.Card_Spade_amount <= AndarBahar_betsResult.Card_Red_amount &&
          AndarBahar_betsResult.Card_Spade_amount <= AndarBahar_betsResult.Card_Black_amount &&
          AndarBahar_betsResult.Card_Spade_amount <= AndarBahar_betsResult.Card_A_6_amount &&
          AndarBahar_betsResult.Card_Spade_amount <= AndarBahar_betsResult.Card_seven_amount &&
          AndarBahar_betsResult.Card_Spade_amount <= AndarBahar_betsResult.Card_8_K_amount
        ) {
          Win_singleNo = 16;
        }
  
        if (
          AndarBahar_betsResult.Card_Red_amount <= AndarBahar_betsResult.Card_2_amount &&
          AndarBahar_betsResult.Card_Red_amount <= AndarBahar_betsResult.Card_3_amount &&
          AndarBahar_betsResult.Card_Red_amount <= AndarBahar_betsResult.Card_4_amount &&
          AndarBahar_betsResult.Card_Red_amount <= AndarBahar_betsResult.Card_5_amount &&
          AndarBahar_betsResult.Card_Red_amount <= AndarBahar_betsResult.Card_6_amount &&
          AndarBahar_betsResult.Card_Red_amount <= AndarBahar_betsResult.Card_7_amount &&
          AndarBahar_betsResult.Card_Red_amount <= AndarBahar_betsResult.Card_8_amount &&
          AndarBahar_betsResult.Card_Red_amount <= AndarBahar_betsResult.Card_9_amount &&
          AndarBahar_betsResult.Card_Red_amount <= AndarBahar_betsResult.Card_10_amount &&
          AndarBahar_betsResult.Card_Red_amount <= AndarBahar_betsResult.Card_J_amount&&
          AndarBahar_betsResult.Card_Red_amount <= AndarBahar_betsResult.Card_Q_amount &&
          AndarBahar_betsResult.Card_Red_amount <= AndarBahar_betsResult.Card_K_amount &&
          AndarBahar_betsResult.Card_Red_amount <= AndarBahar_betsResult.Card_Heart_amount &&
          AndarBahar_betsResult.Card_Red_amount <= AndarBahar_betsResult.Card_Diamond_amount &&
          AndarBahar_betsResult.Card_Red_amount <= AndarBahar_betsResult.Card_Club_amount &&
          AndarBahar_betsResult.Card_Red_amount <= AndarBahar_betsResult.Card_Spade_amount &&
          AndarBahar_betsResult.Card_Red_amount <= AndarBahar_betsResult.Card_A_amount &&
          AndarBahar_betsResult.Card_Red_amount <= AndarBahar_betsResult.Card_Black_amount &&
          AndarBahar_betsResult.Card_Red_amount <= AndarBahar_betsResult.Card_A_6_amount &&
          AndarBahar_betsResult.Card_Red_amount <= AndarBahar_betsResult.Card_seven_amount &&
          AndarBahar_betsResult.Card_Red_amount <= AndarBahar_betsResult.Card_8_K_amount
        ) {
          Win_singleNo = 17;
        }
  
        if (
          AndarBahar_betsResult.Card_Black_amount <= AndarBahar_betsResult.Card_2_amount &&
          AndarBahar_betsResult.Card_Black_amount <= AndarBahar_betsResult.Card_3_amount &&
          AndarBahar_betsResult.Card_Black_amount <= AndarBahar_betsResult.Card_4_amount &&
          AndarBahar_betsResult.Card_Black_amount <= AndarBahar_betsResult.Card_5_amount &&
          AndarBahar_betsResult.Card_Black_amount <= AndarBahar_betsResult.Card_6_amount &&
          AndarBahar_betsResult.Card_Black_amount <= AndarBahar_betsResult.Card_7_amount &&
          AndarBahar_betsResult.Card_Black_amount <= AndarBahar_betsResult.Card_8_amount &&
          AndarBahar_betsResult.Card_Black_amount <= AndarBahar_betsResult.Card_9_amount &&
          AndarBahar_betsResult.Card_Black_amount <= AndarBahar_betsResult.Card_10_amount &&
          AndarBahar_betsResult.Card_Black_amount <= AndarBahar_betsResult.Card_J_amount&&
          AndarBahar_betsResult.Card_Black_amount <= AndarBahar_betsResult.Card_Q_amount &&
          AndarBahar_betsResult.Card_Black_amount <= AndarBahar_betsResult.Card_K_amount &&
          AndarBahar_betsResult.Card_Black_amount <= AndarBahar_betsResult.Card_Heart_amount &&
          AndarBahar_betsResult.Card_Black_amount <= AndarBahar_betsResult.Card_Diamond_amount &&
          AndarBahar_betsResult.Card_Black_amount <= AndarBahar_betsResult.Card_Club_amount &&
          AndarBahar_betsResult.Card_Black_amount <= AndarBahar_betsResult.Card_Spade_amount &&
          AndarBahar_betsResult.Card_Black_amount <= AndarBahar_betsResult.Card_Red_amount &&
          AndarBahar_betsResult.Card_Black_amount <= AndarBahar_betsResult.Card_A_amount &&
          AndarBahar_betsResult.Card_Black_amount <= AndarBahar_betsResult.Card_A_6_amount &&
          AndarBahar_betsResult.Card_Black_amount <= AndarBahar_betsResult.Card_seven_amount &&
          AndarBahar_betsResult.Card_Black_amount <= AndarBahar_betsResult.Card_8_K_amount
        ) {
          Win_singleNo = 18;
        }
        if (
          AndarBahar_betsResult.Card_A_6_amount <= AndarBahar_betsResult.Card_2_amount &&
          AndarBahar_betsResult.Card_A_6_amount <= AndarBahar_betsResult.Card_3_amount &&
          AndarBahar_betsResult.Card_A_6_amount <= AndarBahar_betsResult.Card_4_amount &&
          AndarBahar_betsResult.Card_A_6_amount <= AndarBahar_betsResult.Card_5_amount &&
          AndarBahar_betsResult.Card_A_6_amount <= AndarBahar_betsResult.Card_6_amount &&
          AndarBahar_betsResult.Card_A_6_amount <= AndarBahar_betsResult.Card_7_amount &&
          AndarBahar_betsResult.Card_A_6_amount <= AndarBahar_betsResult.Card_8_amount &&
          AndarBahar_betsResult.Card_A_6_amount <= AndarBahar_betsResult.Card_9_amount &&
          AndarBahar_betsResult.Card_A_6_amount <= AndarBahar_betsResult.Card_10_amount &&
          AndarBahar_betsResult.Card_A_6_amount <= AndarBahar_betsResult.Card_J_amount&&
          AndarBahar_betsResult.Card_A_6_amount <= AndarBahar_betsResult.Card_Q_amount &&
          AndarBahar_betsResult.Card_A_6_amount <= AndarBahar_betsResult.Card_K_amount &&
          AndarBahar_betsResult.Card_A_6_amount <= AndarBahar_betsResult.Card_Heart_amount &&
          AndarBahar_betsResult.Card_A_6_amount <= AndarBahar_betsResult.Card_Diamond_amount &&
          AndarBahar_betsResult.Card_A_6_amount <= AndarBahar_betsResult.Card_Club_amount &&
          AndarBahar_betsResult.Card_A_6_amount <= AndarBahar_betsResult.Card_Spade_amount &&
          AndarBahar_betsResult.Card_A_6_amount <= AndarBahar_betsResult.Card_Red_amount &&
          AndarBahar_betsResult.Card_A_6_amount <= AndarBahar_betsResult.Card_Black_amount &&
          AndarBahar_betsResult.Card_A_6_amount <= AndarBahar_betsResult.Card_A_amount &&
          AndarBahar_betsResult.Card_A_6_amount <= AndarBahar_betsResult.Card_seven_amount &&
          AndarBahar_betsResult.Card_A_6_amount <= AndarBahar_betsResult.Card_8_K_amount
        ) {
          Win_singleNo = 19;
        }
  
        if (
          AndarBahar_betsResult.Card_seven_amount <= AndarBahar_betsResult.Card_2_amount &&
          AndarBahar_betsResult.Card_seven_amount <= AndarBahar_betsResult.Card_3_amount &&
          AndarBahar_betsResult.Card_seven_amount <= AndarBahar_betsResult.Card_4_amount &&
          AndarBahar_betsResult.Card_seven_amount <= AndarBahar_betsResult.Card_5_amount &&
          AndarBahar_betsResult.Card_seven_amount <= AndarBahar_betsResult.Card_6_amount &&
          AndarBahar_betsResult.Card_seven_amount <= AndarBahar_betsResult.Card_7_amount &&
          AndarBahar_betsResult.Card_seven_amount <= AndarBahar_betsResult.Card_8_amount &&
          AndarBahar_betsResult.Card_seven_amount <= AndarBahar_betsResult.Card_9_amount &&
          AndarBahar_betsResult.Card_seven_amount <= AndarBahar_betsResult.Card_10_amount &&
          AndarBahar_betsResult.Card_seven_amount <= AndarBahar_betsResult.Card_J_amount&&
          AndarBahar_betsResult.Card_seven_amount <= AndarBahar_betsResult.Card_Q_amount &&
          AndarBahar_betsResult.Card_seven_amount <= AndarBahar_betsResult.Card_K_amount &&
          AndarBahar_betsResult.Card_seven_amount <= AndarBahar_betsResult.Card_Heart_amount &&
          AndarBahar_betsResult.Card_seven_amount <= AndarBahar_betsResult.Card_Diamond_amount &&
          AndarBahar_betsResult.Card_seven_amount <= AndarBahar_betsResult.Card_Club_amount &&
          AndarBahar_betsResult.Card_seven_amount <= AndarBahar_betsResult.Card_Spade_amount &&
          AndarBahar_betsResult.Card_seven_amount <= AndarBahar_betsResult.Card_Red_amount &&
          AndarBahar_betsResult.Card_seven_amount <= AndarBahar_betsResult.Card_Black_amount &&
          AndarBahar_betsResult.Card_seven_amount <= AndarBahar_betsResult.Card_A_amount &&
          AndarBahar_betsResult.Card_seven_amount <= AndarBahar_betsResult.Card_A_6_amount &&
          AndarBahar_betsResult.Card_seven_amount <= AndarBahar_betsResult.Card_8_K_amount
        ) {
          Win_singleNo = 20;
        }
  
        if (
          AndarBahar_betsResult.Card_8_K <= AndarBahar_betsResult.Card_2_amount &&
          AndarBahar_betsResult.Card_8_K <= AndarBahar_betsResult.Card_3_amount &&
          AndarBahar_betsResult.Card_8_K <= AndarBahar_betsResult.Card_4_amount &&
          AndarBahar_betsResult.Card_8_K <= AndarBahar_betsResult.Card_5_amount &&
          AndarBahar_betsResult.Card_8_K <= AndarBahar_betsResult.Card_6_amount &&
          AndarBahar_betsResult.Card_8_K <= AndarBahar_betsResult.Card_7_amount &&
          AndarBahar_betsResult.Card_8_K <= AndarBahar_betsResult.Card_8_amount &&
          AndarBahar_betsResult.Card_8_K <= AndarBahar_betsResult.Card_9_amount &&
          AndarBahar_betsResult.Card_8_K <= AndarBahar_betsResult.Card_10_amount &&
          AndarBahar_betsResult.Card_8_K <= AndarBahar_betsResult.Card_J_amount&&
          AndarBahar_betsResult.Card_8_K <= AndarBahar_betsResult.Card_Q_amount &&
          AndarBahar_betsResult.Card_8_K <= AndarBahar_betsResult.Card_K_amount &&
          AndarBahar_betsResult.Card_8_K <= AndarBahar_betsResult.Card_Heart_amount &&
          AndarBahar_betsResult.Card_8_K <= AndarBahar_betsResult.Card_Diamond_amount &&
          AndarBahar_betsResult.Card_8_K <= AndarBahar_betsResult.Card_Club_amount &&
          AndarBahar_betsResult.Card_8_K <= AndarBahar_betsResult.Card_Spade_amount &&
          AndarBahar_betsResult.Card_8_K <= AndarBahar_betsResult.Card_Red_amount &&
          AndarBahar_betsResult.Card_8_K <= AndarBahar_betsResult.Card_Black_amount &&
          AndarBahar_betsResult.Card_8_K <= AndarBahar_betsResult.Card_A_amount &&
          AndarBahar_betsResult.Card_8_K <= AndarBahar_betsResult.Card_seven_amount &&
          AndarBahar_betsResult.Card_8_K <= AndarBahar_betsResult.Card_A_6_amount
        ) {
          Win_singleNo = 21;
        }
        
  
    if (AndarBahar_betsResult.Card_A_amount == 0) {
      winconatinzero.push([0,13,26,39]);
    }
    if (AndarBahar_betsResult.Card_2_amount == 0) {
      winconatinzero.push([1,14,27,40]);
    }
    if (AndarBahar_betsResult.Card_3_amount == 0) {
      winconatinzero.push([2,15,28,41]);
    }
    if (AndarBahar_betsResult.Card_4_amount == 0) {
      winconatinzero.push([3,16,29,42]);
    }
    if (AndarBahar_betsResult.Card_5_amount == 0) {
      winconatinzero.push([4,17,30,43]);
    }
    if (AndarBahar_betsResult.Card_6_amount == 0) {
      winconatinzero.push( [5,18,31,44]);
    }
    if (AndarBahar_betsResult.Card_7_amount == 0) {
      winconatinzero.push([6,19,32,45]);
    }
    if (AndarBahar_betsResult.Card_8_amount == 0) {
      winconatinzero.push([7,20,33,46]);
    }
    if (AndarBahar_betsResult.Card_9_amount == 0) {
      winconatinzero.push([8,21,34,47]);
    }
    if (AndarBahar_betsResult.Card_10_amount == 0) {
      winconatinzero.push( [9,22,35,48]);
    }
    if (AndarBahar_betsResult.Card_J_amount == 0) {
      winconatinzero.push([10,23,36,49]);
    }
    if (AndarBahar_betsResult.Card_Q_amount == 0) {
      winconatinzero.push( [11,24,37,50]);
    }
    
    if (AndarBahar_betsResult.Card_K_amount == 0) {
      winconatinzero.push([12,25,38,51]);
    }
    if (AndarBahar_betsResult.Card_Heart_amount == 0) {
      winconatinzero.push([13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]);
    }
    if (AndarBahar_betsResult.Card_Spade_amount ==0){
      winconatinzero.push([39, 40, 41, 42, 43, 44, 45, 47, 46, 48, 49, 50, 51]);
    }
    if (AndarBahar_betsResult.Card_Club_amount==0){
      winconatinzero.push([26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38])  }
      if (AndarBahar_betsResult.Card_Diamond_amount==0){
        winconatinzero.push([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])  }
        if (AndarBahar_betsResult.Card_Red_amount==0){
          winconatinzero.push([
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
            21, 22, 23, 24, 25,
          ])  }
        
          if (AndarBahar_betsResult.Card_Black_amount==0){
            winconatinzero.push([
              26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43,
              44, 45, 47, 46, 48, 49, 50, 51,
            ])  }
  
            if (AndarBahar_betsResult.Card_A_6_amount==0){
              winconatinzero.push([0,1,2,3,4,5,13,14,15,16,17,18,26,27,28,29,30,31,39,40,41,42,43,44])  }
              if (AndarBahar_betsResult.Card_seven_amount==0){
                winconatinzero.push([6,19,32,45])  }
              
                if (AndarBahar_betsResult.Card_8_K_amount==0){
                  winconatinzero.push([7,8,9,10,11,12,20,21,22,23,24,25,33,34,35,36,37,38,46,47,48,49,50,51])  }
                            
        var adminWin= await service.getAdminandarbahar()
 // var winconatinzero=[]
        if(
          adminWin.value==-1)
        {
          if (winconatinzero.length > 0) {
            var l = winconatinzero.length;
            var r = Math.floor(Math.random() * l);
            Win_singleNo = winconatinzero[r][Math.floor(Math.random() * winconatinzero[r].length)]
        
            
          }
          let random_andhar_bahar = AndarBahar_betsResult.Card_Andhar_amount<=AndarBahar_betsResult.Card_Bahar_amount?1:0; //0to1
          random_andhar_bahar_final = random_andhar_bahar;
       
         /*  if(Win_singleNo.length!=0){
        var WinNoSingle = Win_singleNo[Math.floor(Math.random()*Win_singleNo.length)];
          */ 
        NewpreviousWin_single.push(Win_singleNo);
         // }
        
var NewPreS=NewpreviousWin_single.filter((item)=>item!==null)
console.log("Array of preno:-----------",NewPreS)
  Sockets.to(gameRoom).emit(events.OnWinNo, {

              message: " wins",
              win_andhar_bahar: random_andhar_bahar,
        Andar_Card_List : Andar_Card_List  ,
        Bahar_Card_List : Bahar_Card_List  ,
        
              
        winNo: Win_singleNo,
          //    playerId: data.playerId,
              RoundCount: ROUND_COUNT,
             // previousWin_single: NewpreviousWin_single,
             previousWin_single: NewPreS,
        
            });
            SuffleBots();
        }
        
        else{
          Win_singleNo=adminWin.value

          /*NewpreviousWin_single.push(Win_singleNo)
         */
          let random_andhar_bahar = AndarBahar_betsResult.Card_Andhar_amount<=AndarBahar_betsResult.Card_Bahar_amount?1:0; //0to1
          random_andhar_bahar_final = random_andhar_bahar;
           
          var NewPreS=NewpreviousWin_single.filter((item)=>item!==null)
          console.log("Array of preno:-----------",NewPreS)
          
          Sockets.to(gameRoom).emit(events.OnWinNo, {

            message: " wins",
            win_andhar_bahar: random_andhar_bahar,
      Andar_Card_List : Andar_Card_List  ,
      Bahar_Card_List : Bahar_Card_List  ,
      
            winNo: Win_singleNo,
            //playerId: data.playerId,
            RoundCount: ROUND_COUNT,
            //previousWin_single: NewpreviousWin_single,
            previousWin_single: NewPreS,
      
          });

        }
  
      }
      else{
        var Win = 0;
        var Win1 =0;
        var winNo = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
       
        var l = winNo.length;
        var r = Math.floor(Math.random() * l);
        Win = Math.floor(Math.random()*52);
       // Win=6;
  
  
        if (win_AndarBaharifnoBet != -1) {
          Win1 = win_AndarBaharifnoBet;
        } else {
          win_AndarBaharifnoBet = Math.floor(Math.random()*2);
          Win1 = win_AndarBaharifnoBet;
        }
       
        //NewpreviousWin_single.pop();
        if(Andar_Card_List[Andar_Card_List.length-1]!=Win&&Win1==0){
        // Andar_Card_List.shift()
  
          Andar_Card_List.push(Win);
  
  
        }
        if(Bahar_Card_List[Bahar_Card_List.length-1]!=Win&&Win1==1){
        //  Bahar_Card_List.shift()
  
          Bahar_Card_List.push(Win);
  
  
        }
        
        if(NewpreviousWin_single[NewpreviousWin_single.length-1]!=Win){
          NewpreviousWin_single.push(Win);
  
  
        }
  
      
  Sockets.to(gameRoom).emit(events.OnWinNo, {

          message: " wins",
          win_andhar_bahar:win_AndarBaharifnoBet ,
  Andar_Card_List : Andar_Card_List  ,
  Bahar_Card_List : Bahar_Card_List  ,
  winNo: Win,
  
          RoundCount: ROUND_COUNT,
          previousWin_single: NewpreviousWin_single,
  
        }); 
            SuffleBots();
  
      }
      
      await service.RemoveandarbaharBetsAll();
      await service.RemoveAllplayer();
      win_AndarBaharifnoBet=-1;
     win_global = -1;
     win_globalifnoBet = -1;
    
  




  }
  
  
  //OnSendWinNo();

  if (j === 0) {
    //round ended restart the timers
    /*    await sleep(timerVar.intervalDalay);
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

module.exports.StartNewAndarbharGame = StartNewAndarbharGame;
module.exports.GetSocket = GetSocket;
