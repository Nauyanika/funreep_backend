const router = require("express").Router();
// import auth controller
const UsersController = require("../controllers/UserController");
//const auth = require('../middleware/authVerification')
//import validation
//const check = require('../validation/CheckValidation')
/* router.post('/createDistrubutor',check.distValidator(),UsersController.createDistrubutor)
router.post('/createStokez',check.stokezValidator(),UsersController.createStokez)
router.post('/createAgent',check.agentValidator(),UsersController.createAgent)
router.post('/createPlayer',check.playerValidator(),UsersController.createPlayer)



router.post('/createUser',check.userValidator(),UsersController.createUser)

router.post('/sendPoints',check.userPointsVal(),UsersController.sendPoints)
router.post('/sendStokezPoints',check.stokezPointsVal(),UsersController.sendPointstoStokez)
router.post('/sendAgentPoints',check.agentPointsVal(),UsersController.sendPointstoAgent)
router.post('/sendPlayerPoints',check.playerPointsVal(),UsersController.sendPointstoPlayer)


 */

//router.post('/transferPoints',UsersController.transferPoints)

//router.get('/getAgents',UsersController.getAgentsData)
router.get("/getPlayer", UsersController.getPlayerData);
router.get("/getPassword", UsersController.getPass);

router.put("/updateUser", UsersController.updateUser);
router.put("/updateSuperMaster", UsersController.updateSuperMaster);
router.put("/updateMasterId", UsersController.updateMasterId);

router.get("/getPlayerId", UsersController.getPlayerIdData);




router.get("/getCityIdData", UsersController.getCityIdData);
router.get("/getStateIdData", UsersController.getStateIdData);
router.post("/getStatebyAdmin", UsersController.getStatebyAdmin);
router.post("/getCitybyState", UsersController.getCitybyState);
router.post("/getmainbycity", UsersController.getmainbycity);
router.get("/getMainIdData", UsersController.getMainIdData);

router.post("/deleteState", UsersController.deleteStateId);
router.post("/deleteCity", UsersController.deletecity);
router.post("/deletemain", UsersController.deletemain);
router.post("/deleteplayer", UsersController.deleteplayer);
router.post("/deleteUser", UsersController.deleteUser);
router.post("/Setplayer", UsersController.Setplayer);







router.get("/getSuperMasterData", UsersController.getSuperMasterData);

router.get("/getMasterIdData", UsersController.getMasterIdData);

router.get(
  "/AndarBaharGamePlayHistory",
  UsersController.AndarBaharGamePlayHistoryData
);
router.get(
  "/RoulletGamePlayHistory",
  UsersController.RoulletGamePlayHistoryData
);
router.get(
  "/FunTargetGamePlayHistory",
  UsersController.FunTargetGamePlayHistoryData
);
router.get(
  "/TripleChanceGamePlayHistory",
  UsersController.TripleChanceGamePlayHistoryData
);
router.get(
  "/SevenUpGamePlayHistory",
  UsersController.SevenUpGamePlayHistoryData
);

router.get("/TransactionHistory", UsersController.Transaction);
router.get("/PointTransferred", UsersController.PointTransfer);
router.get("/PointReceived", UsersController.PointReceive);
router.get("/PointCancel", UsersController.PointCancel);
router.get("/PointRejected", UsersController.PointRejected);
router.get("/PointHistory", UsersController.PointHistory);

router.post("/sendPoints", UsersController.sendPoints);

router.post("/sendSuperMasterPoints", UsersController.sendPointstoSuperMaster);
router.post("/sendMasterIdPoints", UsersController.sendPointstoMasterId);
router.post("/sendPlayerPoints", UsersController.sendPointstoPlayer);
/* ----------------------------------------------------------------------------------------- */
router.post("/changePercentage", UsersController.changePercentage);
router.get("/UserShare", UsersController.UserShare);

router.get("/GameReport", UsersController.GameReport);
router.get("/DailyStatus", UsersController.DailyStatus);
router.post("/SetplayerOnline", UsersController.SetplayerOnline);
router.post("/SetplayerOffline", UsersController.SetplayerOffline);
router.post("/CheckPlayer", UsersController.CheckPlayer);
router.post("/pinPassword", UsersController.pinPassword);


/* router.get('/PokergetPlayerHistory',UsersController.PokergetPlayerHistoryData)
router.get('/TigerVsElephantgetPlayerHistory',UsersController.TigerVsElephangetPlayerHistoryData)
router.get('/LuckyBallgetPlayerHistory',UsersController.LuckyBallgetPlayerHistoryData) */

//router.get('/getAllPlayer',UsersController.getAllPlayerData)

/* router.get('/pointsStokezHistory',UsersController.getStokezPointHistory)
router.get('/pointsAgentHistory',UsersController.getAgentPointHistory)
router.get('/pointsPlayerHistory',UsersController.getPlayerPointHistory)


router.get('/GameDoubleChanceHistory',UsersController.getDoubleChanceHistory)
router.get('/GameJeetoJokerHistory',UsersController.getJeetoJokerHistory)
router.get('/Game16CardsHistory',UsersController.get16CardsHistory)
router.get('/GameSpinGameHistory',UsersController.getSpinGameHistory)
 */

/* router.post('/changePassword',auth,UsersController.changePassword)
router.post('/resetPassword',check.changePass(),UsersController.resetPassword)
router.get('/',UsersController.getUsers)
router.get('/admindata',UsersController.getAdminData)
router.get('/AgentsData',UsersController.getAllAgents)


router.get('/agents',UsersController.getAgents)

router.get('/getStokez',UsersController.getStokez) */

// router.post('/profileUpload',UsersController.uploadProfilePic)
// router.get('/:id/avatar',UsersController.retrieveProfilePic)
// router.post('/friend_request',check.frientValidator(),UsersController.friendRequest)
// router.get('/find',UsersController.searchPlayers)
// router.get('/friend_req_notification/:user_id', UsersController.getFriendReqNotify)
// router.post('/friend_req_status_update', UsersController.updateFriendReqStatus)
/* router.get("/test", (req, res) => {
    res.send('sdfdfdfd')
}); */
router.post("/funtarget", UsersController.funtarget);
router.post("/triplechance", UsersController.triplechance);
router.post("/roulette", UsersController.roulette);




router.post("/transferPoint", UsersController.transferPoint);
router.post("/onbalance", UsersController.onbalance);



router.post("/Admin7up", UsersController.Admin7up);
router.get("/getAdmin7up", UsersController.getAdmin7up);

router.post("/Adminfuntarget", UsersController.Adminfuntarget);
router.get("/getAdminfuntarget", UsersController.getAdminfuntarget);

router.post("/Adminandarbahar", UsersController.Adminandarbahar);
router.get("/getAdminandarbahar", UsersController.getAdminandarbahar);


  


  router.post("/Adminroulette", UsersController.Adminroulette);
  router.get("/getAdminroulette", UsersController.getAdminroulette);

  router.post("/Admintriplechance", UsersController.Admintriplechance);

  router.get("/getAdmintriplechance", UsersController.getAdmintriplechance);




  router.get("/gamerunning",UsersController.gamerunning);
  router.get("/gamerunningfuntarget",UsersController.gamerunningfuntarget);
  router.get("/gamerunningandarbahar",UsersController.gamerunningandarbahar);
  router.get("/gamerunningroulette",UsersController.gamerunningroulette);
  router.get("/gamerunningtriplechance",UsersController.gamerunningtriplechance);
  
  router.post("/Winamount", UsersController.Winamount);

  router.post("/DeletePreviousWinamount", UsersController.DeletePreviousWinamount);







router.post("/jokerBetPlaced", UsersController.jokerBetPlaced);
router.post("/jokerTakeAmount", UsersController.jokerTakeAmount);
router.post("/jokerDoubleUp", UsersController.jokerDoubleUp);
router.post("/bingoBetsPlaced", UsersController.bingoBetsPlaced);
router.post("/bingoDoubleUp", UsersController.bingoDoubleUp);
router.post("/bingoTakeAmount", UsersController.bingoTakeAmount);
router.post("/bingoGetBalance", UsersController.bingoGetBalance);
//router.post("/sendPointsUsers", UsersController.trysendPointsUser);

router.post("/sendPointsUsers", UsersController.sendPointsUser);

router.post("/DeleteUpdate", UsersController.DeleteUpdate);
router.post("/accpetPointsUser", UsersController.accpetPointsUser);
router.post("/transfer", UsersController.transfer);
router.post("/receive", UsersController.receive);
router.post("/getPlayerPoint", UsersController.getPlayerPoint);

router.post("/sendStateIdPoints", UsersController.sendStateIdPoints);
router.post("/sendMainIdPoints", UsersController.sendMainIdPoints);
router.post("/sendCityIdPoints", UsersController.sendCityIdPoints);
router.post("/sendPlayerIdPoints", UsersController.sendPlayerIdPoints);
router.post("/sendMiniIdPoints", UsersController.sendMiniIdPoints);

router.post("/getEmailsByManager", UsersController.getEmailsByManager);
router.post("/resetUserPassword", UsersController.resetUserPassword);

router.post("/rejectPoint", UsersController.rejectPoint);

router.post("/cancelTransferableId", UsersController.cancelTransferableId);

router.post("/checkPointHistory", UsersController.checkPointHistory);




module.exports = router;
