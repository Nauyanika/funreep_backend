const SendSocketToSvenUP = require("./Sevenup").GetSocket;
//const SendSocketToDvT = require("./DragonVsTiger").GetSocket;
//const SendSocketToTitali = require("./TitaliGame").GetSocket;
//const SendSocketToLucky = require("./LuckyBall").GetSocket;
const SendSocketToRoulette = require("./Roulette").GetSocket;
const SendSocketToFunTareget = require("./FunTarget").GetSocket;
const SendSocketToNewAndarbharGame = require("./NewAndarbhar").GetSocket;

const SendSocketToTripleChance = require("./TripleChance").GetSocket;

//const SendSocketToAndarbhar = require("./Andarbhar").GetSocket;

function sendSocket(socket) {
  SendSocketToSvenUP(socket);
  //  SendSocketToDvT(socket)
  //  SendSocketToAndarbhar(socket)
  // SendSocketToTitali(socket)
  //SendSocketToLucky(socket)
  SendSocketToNewAndarbharGame(socket);
  SendSocketToTripleChance(socket);
  SendSocketToRoulette(socket);
  SendSocketToFunTareget(socket);
}

module.exports.sendSocket = sendSocket;
