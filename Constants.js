const URL = "localhost";
const OnPlayerMove = "OnPlayerMove";
const StartCountDown = "StartCountDown";
const OnTimeUp = "OnTimeUp";

const Events = {
  OnChipMove: "OnChipMove",
  OnPlayerExit: "OnPlayerExit",
  OnJoinRoom: "OnJoinRoom",
  OnTimeUp: "OnTimeUp",
  OnTimerStart: "OnTimerStart",
  OnDrawCompleted: "OnDrawCompleted",
  RegisterPlayer: "RegisterPlayer",
  OnWait: "OnWait",
  OnGameStart: "OnGameStart",
  OnAddNewPlayer: "OnAddNewPlayer",
  OnCurrentTimer: "OnCurrentTimer",
  OnBetsPlaced: "OnBetsPlaced",
  OnWinNo: "OnWinNo",
  OnWinAmount: "OnWinAmount",
  OnSendPoints: "OnSendPoints",
  OnUserProfile: "OnUserProfile",
  OnNotification: "OnNotification",
  OnSenderNotification: "OnSenderNotification",
  OnChangePassword: "OnChangePassword",
  OnAcceptPoints: "OnAcceptPoints",
  OnRejectPoints: "OnRejectPoints",

  OnBotsData: "OnBotsData",
  OnPlayerWin: "OnPlayerWin",
  // OnPlaceBet :"OnPlaceBet",

  onEnterLobby: "onEnterLobby",
  onleaveRoom: "onleaveRoom",
  OnHistoryRecord: "OnHistoryRecord",

  /* OnSendPoints:"OnSendPoints",
    OnAcceptPoints:"OnAcceptPoints",
    OnRejectPoints:"OnRejectPoints",
 */
};

const CommonVar = {
  playerId: "playerId",
  success: "success",
  chip: "chip",
  spot: "spot",
  username: "username",
  roomName: "roomName",
  spotType: "spotType",
  balance: "balance",
  position: "position",
  profilePic: "profilePic",
  socket: "socket",
  gameplay: "7updown",
  test: "test",
  db: "database",
  win: "win",
  adminCommisionRate: 0.05,
  gameId: "gameId",
};

const GameState = {
  canBet: 0,
  cannotBet: 1,
  wait: 2,
};
const Chip = {
  Chip10: 10,
  Chip50: 50,
  Chip100: 100,
  Chip500: 500,
  Chip1000: 1000,
  Chip5000: 5000,
};

const SelectGame = {
  1: "7updown",
  // 2: "DragonVsTiger",
  3: "AndharBahar",
  //4:"TitaliGame",
  //5:"LuckyBall",
  6: "TripleChance",
  7: "Roulette",
  8: "FunTarget",
};

const Spot = {
  left: 0,
  middle: 1,
  right: 2,
};

const TimerVar = {
  bettingTimer: 15,
  // bettingTimerTitali : 25,
  // bettingTimerLucky : 15,
  bettingTripleChance: 120,
  bettingFunTarget: 50,
  bettingAndharBahar: 20,
  bettingNewAndarbhar: 50,
  bettingRoulette: 60,
  bettingsevenup: 50,

  betCalculationTimer: 10,
  //betCalculationTimerTitali: 5,
  //betCalculationTimerLucky: 10,
  betCalculationTripleChance: 10,

 // waitTimer: 3,
  waitTimer: 0,
  delay: 500,
  intervalDalay: 2000,
  
  /* delay: 1000,
  intervalDalay: 2000,
   */ABHCalculationTimer: 20,
  percardDisplayTime: 600, //per card display time 1.5 sec in app
};

const SelectRange = [
  [0, 0],
  [0, 0],
  [1, 5],
  [6, 10],
  [11, 15],
  [16, 25],
  [26, 30],
  [31, 35],
  [36, 40],
  [41, 52],
];

const AandarBaharSpot = {
  Andar: 0,
  Bahar: 1,
  oneToFive: 2,
  sixToTen: 3,
  elevenToFifteen: 4,
  sixteenToTwentyFive: 5,
  twentySixToThirty: 6,
  thirtyOneToThirtyFive: 7,
  thirtySixToFouty: 8,
  fortyOneAndMore: 9,
};

const SetOfCards = {
  Zero: 0, //Hearts
  One: 1, //Speads
  Two: 2, //Clubs
  Three: 3, //Diamonds
};

const AandarBaharWinningRate = {
  0: 1.9,
  1: 2,
  2: 3.5,
  3: 4.5,
  4: 5.5,
  5: 4.5,
  6: 15,
  7: 25,
  8: 50,
  9: 120,
};

module.exports.commonVar = CommonVar;
module.exports.events = Events;
module.exports.state = GameState;
module.exports.chip = Chip;
module.exports.spot = Spot;
module.exports.selectGame = SelectGame;
module.exports.timerVar = TimerVar;
module.exports.selectRange = SelectRange;
module.exports.AandarBaharSpot = AandarBaharSpot;
module.exports.setOfCards = SetOfCards;
module.exports.andarBaharWinningRate = AandarBaharWinningRate;
