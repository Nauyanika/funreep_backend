"use strict";
const debug = require("debug")("test");
const db = require("../config/db.js");
const commonVar = require("../Constants").commonVar;




const userById = async(playerId) => {
    try{
        let sql = `SELECT * FROM users WHERE id= ? limit ?`;
        let user  = await db.query(sql,[playerId,1])
        return user;
    } catch (err) {
        debug(err);
    }     
}

const getUserBalance = async(playerId) => {
    try{
        let user  = await userById(playerId);
        let result = user[0]['cash_balance'];
        return result;
    } catch (err) {
        debug(err);
    }    
}

const userByEmail = async(playerId) => {
    try{
        let sql = `SELECT * FROM users WHERE email= ? limit ?`;
        let user  = await db.query(sql,[playerId,1])
        return user;
    } catch (err) {
        debug(err);
    }     
}

const getUserPoint = async(playerId,betPoints) => {
    try{
        let user  = await userByEmail(playerId);
        let result = user[0]['point'];
       let sql = `UPDATE users SET point= ? WHERE email= ? `;
        let savePoint  = await db.query(sql,[result-betPoints,playerId]);
       console.log("databaseupdated",savePoint)
                
        return result;
    } catch (err) {
        debug(err);
    }    
}

const updateUserPoint = async(playerId,winPoints) => {
    try{
        /* let admin_commision=(winPoints/5)
       winPoints=winPoints-(admin_commision)
        */ let user  = await userByEmail(playerId);
        let result = user[0]['point'];
       let sql = `UPDATE users SET point= ? WHERE email= ? `;
       let savePoint  = await db.query(sql,[result+winPoints,playerId]);
       console.log("databaseupdated",savePoint)
       let user1 = await userByEmail(playerId);
       let result1 = user1[0]["point"];
      
       return result1;
       
        /* user  = await userByEmail("admin@admin.com");
        result = user[0]['point'];
       sql = `UPDATE users SET point= ? WHERE email= ? `;
       savePoint  = await db.query(sql,[result+admin_commision,"admin@admin.com"]);
      console.log("databaseupdated",savePoint) */
       
        //return result;
    } catch (err) {
        debug(err);
    }    
}
const onSendPointsToPlayer1 = async(senderplayerId,receiverplayerId,point,password) => {
    try{
        //let parms = data;
        let receiver  = await userByEmail(receiverplayerId);
       if(receiver.length==0){
        return 404;
       }
        let user  = await userByEmail(senderplayerId);
if(user[0]['password']==password){
    

        let sql = "Insert Into point_history Set ?"
        let query = await db.query(sql,{receiver:receiverplayerId,sender:senderplayerId,point:point})
       // debug("Winning no. inserted successfuly to db")
        /* user  = await userByEmail(receiverplayerId);
        let result = user[0]['point'];
        */
        /* sql = `UPDATE users SET point= ? WHERE email= ? `;
       let savePoint  = await db.query(sql,[result+point,receiverplayerId]);
       console.log("databaseupdated",savePoint)
        user  = await userByEmail(senderplayerId);
       // password==senderplayerId.password
         result = user[0]['point'];
        */
          /* sql = "Insert Into notification_table Set ?"
           query = await db.query(sql,{receiver_id:receiverplayerId,sender_id:senderplayerId,point:point})
          // debug("Winning no. inserted successfuly to db")
          console.log("query",query)
           */ user  = await userByEmail(senderplayerId);
          let result = user[0]['point'];
          



        sql = `UPDATE users SET point= ? WHERE email= ? `;
       let savePoint  = await db.query(sql,[result-point,senderplayerId]);
       console.log("databaseupdated",savePoint)
       
       return true;
    }
else{
    return false;
} }
     catch (err) {
        console.error(err)
        debug(err);
    }    
}




const onNotification = async(playerId) => {
    try{
        //let limit = 1;
      //  let sql =  `SELECT * FROM receivableapi where ToAccountName =?`

        let sql =  `SELECT * FROM point_history where receiver =? and status=-1`
        let result = await db.query(sql,playerId);
        
        return (result);
    } catch (err) {
        debug(err);
    }    
}

const onAcceptPoints = async(notifyId,playerId) => {
    try{
        //let limit = 1;
        /*let sql =  `SELECT * FROM point_history where receiver =?`
        let result = await db.query(sql,playerId);*/
       let sql = `UPDATE point_history SET status= ? WHERE  id=?`;
          //   let sql = `UPDATE receivableapi SET  WHERE  id=?`;

        let savePoint  = await db.query(sql,[1,notifyId]);
        console.log("databaseupdated",savePoint)
 
         sql = `select * from point_history where id=? `;
         savePoint  = await db.query(sql,[notifyId]);
       // console.log("databaseupdated",savePoint)
       let point = savePoint[0]['point'];

        let user  = await userByEmail(playerId);
       let result = user[0]['point'];
       
        sql = `UPDATE users SET point= ? WHERE email= ? `;
       savePoint  = await db.query(sql,[result+point,playerId]);
      console.log("databaseupdated",savePoint)
      
   /*    sql = `Delete From receivableapi where playerId= ? `;
      let savePoint1 = await db.query(sql, [playerId]);
    console.log("databaseupdated", savePoint1);
    */  
    
        return (result);
    } catch (err) {
        debug(err);
    }    
}





const onchangePassword = async(userId,old_password,new_password) => {
    try{
        //let parms = data;
        
        let user  = await userByEmail(userId);
if(user[0]['password']==old_password){
   // const Password =await db.query(new_password)
 let sql = `UPDATE users SET password= ? WHERE email= ? `;
       let savePoint  = await db.query(sql,[new_password,userId]);
       console.log("databaseupdated",savePoint)
        user  = await userByEmail(userId);
       console.log("user",user)
       return user;
    }
    else{
        return 404
    }
}
     catch (err) {
        console.error(err)
        debug(err);
    }    
}




const onRejectPoints = async(notifyId,playerId) => {
    try{
        //let limit = 1;
        /*let sql =  `SELECT * FROM point_history where receiver =?`
        let result = await db.query(sql,playerId);*/
        let sql = `UPDATE point_history SET status= ? WHERE  id=?`;
    //  let sql = `UPDATE trandableapi SET  WHERE  id=?`;

        let savePoint  = await db.query(sql,[0,notifyId]);
        console.log("databaseupdated",savePoint)
        sql = `select * from point_history where id=? `;

      //   sql = `select * from trandableapi where id=? `;
         savePoint  = await db.query(sql,[notifyId]);
       // console.log("databaseupdated",savePoint)
       let point = savePoint[0]['point'];

          let senderId=savePoint[0]['FromAccountName'];

      let user  = await userByEmail(senderId);
       let result = user[0]['point'];
       
        sql = `UPDATE users SET point= ? WHERE email= ? `;
       savePoint  = await db.query(sql,[result+point,senderId]);
      console.log("databaseupdated",savePoint)
      
       
    
        return (result);
    } catch (err) {
        debug(err);
    }    
}





const onSenderNotification = async(playerId) => {
    try{
        //let limit = 1;
        let sql =  `SELECT * FROM point_history where receiver =? and status=-1`
        let result = await db.query(sql,playerId);
    
        return (result);
    } catch (err) {
        debug(err);
    }    
}



 

 


















const  isValidArray = (arr) => {
    if(arr!=null && arr!=undefined && arr.length>0) {
        return true
    } else {
        return false
    }
}

const getRoundCount = async() => {
    try{
        let limit = 1;
        let sql =  `SELECT room_id FROM game_record_triplechance ORDER BY id DESC LIMIT ?`
        let result = await db.query(sql,limit);
        let roundCount = result[result.length-1]['room_id'] + 1
        return (roundCount);
    } catch (err) {
        debug(err);
    }    
}

const JoinGame = async(data,room_id) => {
    try{
        let user  = await userById(data.playerId);
        if(isValidArray(user)){    
            let cash_balance = user[0]['cash_balance'];
            let chip_amt = data.chip;
            if(cash_balance >= chip_amt){
                let parms = {user_id:data.playerId,game_id:data.gameId,amount:data.chip,spot:data.spot,room_id:room_id};
                let sql = "Insert Into join_game Set ?"
                let saveBet = await db.query(sql,parms);

                if(saveBet!=null && saveBet!=undefined && Object.keys(saveBet).length !=0) {
                    cash_balance -= chip_amt
                    sql = `UPDATE users SET cash_balance= ? WHERE id= ? `;
                    let saveBalance  = await db.query(sql,[cash_balance,data.playerId]);
                }    
            } 
        }
        debug("player bet successfully add to db")
        return true;
    } catch (err) {
        debug(err);
    }    
}

const lastWinningNo = async() => {
    try{
        let limit = 20;
        let result = new Array(limit);
        let sql =  `SELECT spot FROM (SELECT * FROM game_record_triplechance
 ORDER BY id DESC LIMIT ?) sub ORDER BY id ASC`
        let data = await db.query(sql,limit);
        if(isValidArray(data)){
            for (var i = 0; i < data.length; i++) {
                let spot=data[i].spot;
                result[(limit-1)-i]=spot;
            }
        }
        return (result);
    } catch (err) {
        debug(err);
    }    
}


const updateWinningNo = async(data) => {
    try{
        let parms = data;
        let sql = "Insert Into game_record_triplechance Set ?"
        let query = await db.query(sql,parms)
        debug("Winning no. inserted successfuly to db")
        return true;
    } catch (err) {
        debug(err);
    }    
}


const updateWinningAmount = async(data) => {
    try{
        let winningspot = data['spot'];
        let rate = (winningspot === 0 || winningspot === 2 ) ? 2 : 8;     //winning amt multile
        let game_id = 6;
        let room_id = data['room_id'];
        let playeWinningArray = [];

        let sql =  `SELECT user_id FROM join_game WHERE game_id= ? AND room_id= ? AND is_updated= ? GROUP BY user_id `;
        let players = await db.query(sql,[game_id,room_id,0]);
        
        if(isValidArray(players)){
            for(let player of players ){

                let playerId = player['user_id'];
                let sql = `SELECT spot,amount FROM join_game WHERE game_id= ? AND room_id= ? AND user_id= ? `;
                let bets = await db.query(sql,[game_id,room_id,playerId]);

                if(isValidArray(bets)){

                    let total_win_amount  = 0; 
                    let total_bet_amount  = 0;
                    
                    for(let bet of bets ){
                        let win_amount  =   0;
                        let playingSpot =   parseInt(bet['spot'])
                        let betAmt      =   parseInt(bet['amount'])
                        total_bet_amount += betAmt;

                        if(playingSpot === winningspot) {
                            win_amount = betAmt * (rate - (commonVar.adminCommisionRate));
                            total_win_amount  += win_amount;
                        } 

                        sql = `UPDATE join_game SET  win_amount=? ,is_updated=?  WHERE game_id= ? AND room_id= ? AND user_id= ?  `;
                        let update_sql = await db.query(sql,[win_amount,1,game_id,room_id,playerId]);
                        if(update_sql!=null && win_amount >0 ) {
                            sql = `UPDATE users SET  cash_balance= cash_balance + ?   WHERE id= ?  `;
                            let saveBalance  = await db.query(sql,[win_amount,playerId]);
                        } 
                    } 

                    let winningAmount = total_win_amount - total_bet_amount;
                    playeWinningArray.push({playerId,winningAmount})   
                } 

            }  
            debug("Winning amount successfuly updated in db")  
        }
        
        return playeWinningArray;
    } catch (err) {
        debug(err);
    }    
}

const gameMartixRecords = async(data) => {
    try{
        let limit = 105;
        let result = new Array(limit);
        let sql =  `SELECT spot FROM (SELECT * FROM game_record_triplechance
 ORDER BY id DESC LIMIT ?) sub ORDER BY id ASC`
        let data = await db.query(sql,limit);
        if(isValidArray(data)){
           result = data.map((win) => win.spot);
        }
        return result
    } catch (err) {
        debug(err);
    }      
}    

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

const gameSlotRecords = async(data) => {
    try{

        let limit = 10;
        let result = new Array(limit);
        let sql =  `SELECT winNo1,winNo2 FROM (SELECT * FROM game_record_triplechance
 ORDER BY id DESC LIMIT ?) sub ORDER BY id ASC`
        let data = await db.query(sql,limit);
        if(isValidArray(data)){
           result = data.map((spot) =>{
              return {'D':spot.winNo1,'T':spot.winNo2}
           });
        }
        return result
    } catch (err) {
        debug(err);
    }      
}    


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
      var formdata={
        playerId:playerId
      }
      let sql = `SELECT * FROM isbetplacedtriple WHERE playerId = ? `;
    let agent= await db.query(sql,[playerId]);
    if(agent.length>0){
    }
    else{
    
      sql = `Insert into isbetplacedtriple set ? `;
      let savePoint = await db.query(sql, [formdata]);
      console.log("databaseupdated", savePoint);
       } }catch (err) {
      debug(err);
    }
  };
  
  const GameRunning = async (playername,RoundCount,singleNo,doubleNo,tripleNo,
    singleNoVal,doubleNoVal,tripleNoVal,
    
    Win_singalNo) => {
    try {
      console.log("hello")
  
     var formData1={
  playername:playername,
  RoundCount:RoundCount,
  singleNo:singleNo,
  doubleNo:doubleNo,
  tripleNo:tripleNo,
  singleVal:singleNoVal,
  doubleVal:doubleNoVal,
  tripleVal:tripleNoVal,
  
  Win_singalNo:Win_singalNo
     }
     let sql = `SELECT * FROM game_running_triplechance WHERE playername = ? `;
      let    responseData = await db.query(sql, playername);
        /*   if (responseData.length > 0) {
            sql = "UPDATE game_running_triplechance SET singleNo=?,doubleNo=?,tripleNo=?,Win_singleNo=? WHERE playername =? ";
    
            const userss = await db.query(sql,  [singleNo,doubleNo,tripleNo,Win_singleNo ,playername]);
                
            console.log(userss);;
             }
         */ // else {
            sql = "INSERT INTO  game_running_triplechance SET ?";
              const users = await db.query(sql, formData1);
              if (users) {
    
                }  
        return "successfully"
      } catch (err) {
        console.log("err",err)
      debug(err);
  
    }
  };
  
  const Detailtriplechance = async (data) => {
    try {
      let sql = "SELECT * FROM triplechance_bet ";
      let detail = await db.query(sql);
      //debug("Winning no. inserted successfuly to db");
      return detail[0];
    } catch (err) {
      debug(err);
    }
  };
  
  const TripleChanceBets = async (singleNo,doubleNo,tripleNo) => {
    console.log("singleNo:", singleNo, "doubleNo:", doubleNo,"tripleNo:",tripleNo);
    try {
      let sql = `SELECT * FROM triplechance_bet  `;
      let responseData = await db.query(sql, []);
      if (responseData.length > 0) {
        sql = `SELECT * FROM triplechance_bet  `;
        responseData = await db.query(sql, []);
        if (responseData.length > 0) {
          const tpoints = parseInt(singleNo) + parseInt(responseData[0].singleNo);
          const spoints = parseInt(doubleNo) + parseInt(responseData[0].doubleNo);
  
          const dpoints = parseInt(tripleNo) + parseInt(responseData[0].tripleNo);
  var formData={
    singleNo:tpoints,
    doubleNo:dpoints,
    tripleNo:spoints
  
  }
          sql = "UPDATE triplechance_bet SET ?";
  
          const userss = await db.query(sql, [formData]);
          console.log(userss);
          if (userss) {
           console.log(userss)
          }
        }
      } else {
      }
    } catch (err) {
      debug(err);
    }
  };
  
  const RemovetripleBetsAll = async () => {
    // console.log("zero:",zero,"one:",one,"two:",two,"three:",three,"four:",four,"five:",five,"six:",six,"seven:",seven,"eight:",eight,"nine:",nine);
    try {
      var formData = {
        singleNo: 0,
        doubleNo: 0,
        tripleNo: 0,
        
      };
      var sql = "UPDATE triplechance_bet SET ?";
  
      const userss = await db.query(sql, [formData]);
      console.log(userss);
    } catch (err) {
      debug(err);
    }
  };

  const GetPlayerIdInBetplaced = async () => {
    try {
      let sql = `Select * From isbetplacedtriple  `;
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
  
  
  const GetGameRunningData = async (playername) => {
    try {
      console.log("hello GetGameRunningData");
  
      let sql = `SELECT * FROM game_running_triplechance WHERE playername = ? order by playedTime desc limit 1 `;
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
  
  const UpdateGameRunningDataWinSingleNumber = async (playername,playedTime,Win_singleNo) => {
    try {
      console.log("hello UpdateGameRunningDataWinSingleNumber")
  
     let sql = `update game_running_triplechance set Win_singleNo=?  WHERE playername = ? And playedTime=?  `;
      let responseData = await db.query(sql, [playername,playedTime,Win_singleNo]);
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
  
  const UpdateGameRunningDataWinpoint = async (playername,playedTime,winpoint) => {
    try {
      console.log("hello UpdateGameRunningDataWinpoint")
  
     let sql = `update game_running_triplechance set winpoint=?  WHERE playername = ? And playedTime=?  `;
      let    responseData = await db.query(sql, [winpoint,playername,playedTime]);
          if (responseData) {
    console.log(responseData)
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
      
      let sql = `Delete From isbetplacedtriple where playerId= ? `;
      let savePoint = await db.query(sql, [playerId]);
      console.log("databaseupdated", savePoint);
       } catch (err) {
      debug(err);
    }
  };
  const RemoveAllplayer = async () => {
    try {
          var sql = "Delete from isbetplacedtriple";
  
      const userss = await db.query(sql);
      console.log(userss);
    } catch (err) {
      debug(err);
    }
  };
  

  const PlayerDetails = async (playername,RoundCount,singleNo,doubleNo,tripleNo, winNo) => {
    try {
      console.log("hello")
  
     var formData1={
  playername:playername,
  RoundCount:RoundCount,
  singleNo:singleNo,
  doubleNo:doubleNo,
  tripleNo:tripleNo,
  
  winNo:winNo
     }
     let sql = `SELECT * FROM triplechance_playerdetail WHERE playername = ? `;
      let    responseData = await db.query(sql, playername);
        /*   if (responseData.length > 0) {
            sql = "UPDATE triplechance_playerdetail SET singleNo=?,doubleNo=?,tripleNo=?,Win_singleNo=? WHERE playername =? ";
    
            const userss = await db.query(sql,  [singleNo,doubleNo,tripleNo,Win_singleNo ,playername]);
                
            console.log(userss);;
             }
         */ // else {
            sql = "INSERT INTO  triplechance_playerdetail SET ?";
              const users = await db.query(sql, formData1);
              if (users) {
    
                }  
        return "successfully"
      } catch (err) {
        console.log("err",err)
      debug(err);
  
    }
  };
 


  const getAdmintriplechance = async () => {
 
    try {
      
        let sql = "select * from admin_triplechance ";
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
      var sql = "Select * from isbetplacedtriple";
  
      const userss = await db.query(sql);
      console.log(userss);
      return userss;
    } catch (err) {
      debug(err);
    }
  };
  const onSendPointsToPlayer =  async(senderplayerId,receiverplayerId,point,password) => {
    try{
        //let parms = data;
        let receiver  = await userByEmail(receiverplayerId);
       let roleidReceiver=receiver[0]['role_id'];
  console.log(roleidReceiver,"re")
       if(receiver.length==0){
        return 404;
       
      }
        let user  = await userByEmail(senderplayerId);
       let roleSender=user[0]['role_id'];
       console.log(roleSender,"se")
  
  if(user[0]['password']==password){
  if(roleSender==2 && roleidReceiver==3||roleSender==3 && roleidReceiver==2){
   let sql = "Insert Into point_history Set ?"
  /*  let sql = "Insert Into trandableapi Set ?"
   let query = await db.query(sql,{ToAccountName:receiverplayerId,FromAccountName:senderplayerId,point:point})
   */
   let query = await db.query(sql,{receiver:receiverplayerId,sender:senderplayerId,point:point})
       user  = await userByEmail(senderplayerId);
          let result = user[0]['point'];
          
    sql = `UPDATE users SET point= ? WHERE email= ? `;
       let savePoint  = await db.query(sql,[result-point,senderplayerId]);
       console.log("databaseupdated",savePoint)
       
       return true;
  }
   else if(roleSender==3 && roleidReceiver==4||roleSender==4 && roleidReceiver==3){
  
    
   let sql = "Insert Into point_history Set ?"
  /* let sql = "Insert Into trandableapi Set ?"
  let query = await db.query(sql,{ToAccountName:receiverplayerId,FromAccountName:senderplayerId,point:point})
   */
    let query = await db.query(sql,{receiver:receiverplayerId,sender:senderplayerId,point:point})
   user  = await userByEmail(senderplayerId);
      let result = user[0]['point'];
      
  
  
  
    sql = `UPDATE users SET point= ? WHERE email= ? `;
   let savePoint  = await db.query(sql,[result-point,senderplayerId]);
   console.log("databaseupdated",savePoint)
   
   return true;
  }
  
  else if(roleSender==4 && roleidReceiver==5||roleSender==5 && roleidReceiver==4){
  
    /* let sql = "Insert Into trandableapi Set ?"
  let query = await db.query(sql,{ToAccountName:receiverplayerId,FromAccountName:senderplayerId,point:point})
   */
    let sql = "Insert Into point_history Set ?"
    let query = await db.query(sql,{receiver:receiverplayerId,sender:senderplayerId,point:point})
   user  = await userByEmail(senderplayerId);
      let result = user[0]['point'];
      
  
  
  
    sql = `UPDATE users SET point= ? WHERE email= ? `;
   let savePoint  = await db.query(sql,[result-point,senderplayerId]);
   console.log("databaseupdated",savePoint)
   
   return true;
  }
  else{
    return 404 ;   }
  }
  
  else{
    return false;
  } }
     catch (err) {
        console.error(err)
        debug(err);
    }    
  }
  


  const onSendPointsToPlayer0 =  async(senderplayerId,receiverplayerId,point,password) => {
    try{
        //let parms = data;
        let receiver  = await userByEmail(receiverplayerId);
       let roleidReceiver=receiver[0]['role_id'];
  console.log(roleidReceiver,"re")
       if(receiver.length==0){
        return 404;
       
      }
        let user  = await userByEmail(senderplayerId);
       let roleSender=user[0]['role_id'];
       console.log(roleSender,"se")
  
  if(user[0]['password']==password){
  if(roleSender==2 && roleidReceiver==3||roleSender==3 && roleidReceiver==2){
    let sql = "Insert Into trandableapi Set ?"
   let query = await db.query(sql,{ToAccountName:receiverplayerId,FromAccountName:senderplayerId,point:point,pin:password})
   
       user  = await userByEmail(senderplayerId);
          let result = user[0]['point'];
          
    sql = `UPDATE users SET point= ? WHERE email= ? `;
       let savePoint  = await db.query(sql,[result-point,senderplayerId]);
       console.log("databaseupdated",savePoint)
        sql = "Insert Into receivableapi Set ?"
        query = await db.query(sql,{ToAccountName:receiverplayerId,FromAccountName:senderplayerId,point:point,pin:password})
       
           
       return true;
  }
   else if(roleSender==3 && roleidReceiver==4||roleSender==4 && roleidReceiver==3){
  
    
   let sql = "Insert Into trandableapi Set ?"
  let query = await db.query(sql,{ToAccountName:receiverplayerId,FromAccountName:senderplayerId,point:point,pin:password})
   
   user  = await userByEmail(senderplayerId);
      let result = user[0]['point'];
      
  
  
  
    sql = `UPDATE users SET point= ? WHERE email= ? `;
   let savePoint  = await db.query(sql,[result-point,senderplayerId]);
   console.log("databaseupdated",savePoint)
   sql = "Insert Into receivableapi Set ?"
   query = await db.query(sql,{ToAccountName:receiverplayerId,FromAccountName:senderplayerId,point:point,pin:password})
  
   return true;
  }
  
  else if(roleSender==4 && roleidReceiver==5||roleSender==5 && roleidReceiver==4){
  
     let sql = "Insert Into trandableapi Set ?"
  let query = await db.query(sql,{ToAccountName:receiverplayerId,FromAccountName:senderplayerId,point:point,pin:password})
   
   user  = await userByEmail(senderplayerId);
      let result = user[0]['point'];
      
  
  
  
    sql = `UPDATE users SET point= ? WHERE email= ? `;
   let savePoint  = await db.query(sql,[result-point,senderplayerId]);
   console.log("databaseupdated",savePoint)
   sql = "Insert Into receivableapi Set ?"
   query = await db.query(sql,{ToAccountName:receiverplayerId,FromAccountName:senderplayerId,point:point,pin:password})
  
   return true;
  }
  else{
    return 404 ;   }
  }
  
  else{
    return false;
  } }
     catch (err) {
        console.error(err)
        debug(err);
    }    
  }
 


  const onNotification0 = async(playerId) => {
    try{
        //let limit = 1;
        let sql =  `SELECT * FROM receivableapi where ToAccountName =?`

        let result = await db.query(sql,playerId);
        console.log(result)
        return (result);
    } catch (err) {
        debug(err);
    }    
}

const onAcceptPoints0 = async(notifyId,playerId) => {
    try{
        //let limit = 1;
        /*let sql =  `SELECT * FROM point_history where receiver =?`
        let result = await db.query(sql,playerId);*/
          
       let  sql = `select * from receivableapi where id=? `;
       let  savePoint  = await db.query(sql,[notifyId]);
       // console.log("databaseupdated",savePoint)
       let point = savePoint[0]['point'];

        let user  = await userByEmail(playerId);
       let result = user[0]['point'];
       
        sql = `UPDATE users SET point= ? WHERE email= ? `;
      let savePoint1  = await db.query(sql,[result+point,playerId]);
      console.log("databaseupdated",savePoint1)
      
       sql = `Delete From receivableapi where id= ? `;
      let savePoint2 = await db.query(sql, [notifyId]);
    console.log("databaseupdated", savePoint2);
    sql = `Delete From trandableapi where ToAccountName= ? `;
     savePoint2 = await db.query(sql, [playerId]);
   
    
        return (result);
    } catch (err) {
        debug(err);
    }    
}

// const onAcceptPoints0 = async(notifyId, playerId) => {
//   try {
//       let sql = `SELECT * FROM receivableapi WHERE id=?`;
//       let savePoint = await db.query(sql, [notifyId]);
//       let points = savePoint[0]['point'];

      
//       sql = `SELECT * FROM users WHERE email=?`;
//       let sender = await db.query(sql, [savePoint[0]['FromAccountName']]);
//       let senderPoints = sender[0]['point'];

      
//       sql = `UPDATE users SET point=? WHERE email=?`;
//       let updatedSenderPoints = senderPoints - points;
//       await db.query(sql, [updatedSenderPoints, savePoint[0]['FromAccountName']]);

      
//       sql = `UPDATE users SET point=? WHERE email=?`;
//       let receiver = await db.query(sql, [senderPoints + points, playerId]);

//       // Delete records
//       sql = `DELETE FROM receivableapi WHERE id=?`;
//       await db.query(sql, [notifyId]);
//       sql = `DELETE FROM trandableapi WHERE ToAccountName=?`;
//       await db.query(sql, [playerId]);

//       return updatedSenderPoints;
//   } catch (err) {
//       debug(err);
//   }    
// }




// const onRejectPoints0 = async(notifyId,playerId) => {
//   try{
//       //let limit = 1;
//       /*let sql =  `SELECT * FROM point_history where receiver =?`
//       let result = await db.query(sql,playerId);*/
//    let sql = `UPDATE trandableapi SET  WHERE  id=?`;

//       let savePoint  = await db.query(sql,[0,notifyId]);
//       console.log("databaseupdated",savePoint)

//        sql = `select * from trandableapi where id=? `;
//        savePoint  = await db.query(sql,[notifyId]);
//      // console.log("databaseupdated",savePoint)
//      let point = savePoint[0]['point'];

//         let senderId=savePoint[0]['FromAccountName'];

//     let user  = await userByEmail(senderId);
//      let result = user[0]['point'];
     
//       sql = `UPDATE users SET point= ? WHERE email= ? `;
//      savePoint  = await db.query(sql,[result+point,senderId]);
//     console.log("databaseupdated",savePoint)
    
     
  
//       return (result);
//   } catch (err) {
//       debug(err);
//   }    
// }
const onRejectPoints0 = async (notifyId, playerId) => {
  try {
  
    let sql = `SELECT * FROM trandableapi WHERE id = ?`;
    let trandableData = await db.query(sql, [notifyId]);

    if (trandableData.length > 0) {
      let point = trandableData[0]['point'];
      let senderId = trandableData[0]['FromAccountName'];

      
      sql = `UPDATE users SET point = point + ? WHERE email = ?`;
      await db.query(sql, [point, senderId]);

      
      sql = `DELETE FROM trandableapi WHERE id = ?`;
      await db.query(sql, [notifyId]);

      sql = `DELETE FROM receivableapi WHERE id = ?`;
      await db.query(sql, [notifyId]);

      return true; 
    } else {
      return false; 
    }
  } catch (err) {
    debug(err);
    return false; 
  }
};

// const onRejectPoints0 = async(notifyId,playerId) => {
//   try{
//       //let limit = 1;
//       /*let sql =  `SELECT * FROM point_history where receiver =?`
//       let result = await db.query(sql,playerId);*/

//   //  let sql = `UPDATE trandableapi SET  WHERE  id=?`;

//       // let savePoint  = await db.query(sql,[0,notifyId]);
//       // console.log("databaseupdated",savePoint)

//       let sql = `select * from trandableapi where id=? `;
//       let  savePoint  = await db.query(sql,[notifyId]);
//      // console.log("databaseupdated",savePoint)
//      let point = savePoint[0]['point'];

//         let senderId=savePoint[0]['FromAccountName'];

//     let user  = await userByEmail(senderId);
//      let result = user[0]['point'];
     
//       sql = `UPDATE users SET point= ? WHERE email= ? `;
//      savePoint  = await db.query(sql,[result+point,senderId]);
//     console.log("databaseupdated",savePoint)
    
     
  
//       return (result);
//   } catch (err) {
//       debug(err);
//   }    
// }



const onSenderNotification0 = async(playerId) => {
  try{
      //let limit = 1;
      let sql =  `SELECT * FROM trandableapi where ToAccountName =? `
      let result = await db.query(sql,playerId);
  
      return (result);
  } catch (err) {
      debug(err);
  }    
}






module.exports = {
  onSendPointsToPlayer0,
  onSenderNotification0,
  onNotification0,
  onAcceptPoints0,
  onRejectPoints0,

  GetAllplayer,
  WinamountDetails,
  getAdmintriplechance,
  PlayerDetails,
  RemoveAllplayer,
    RemovePlayerIdInBetplaced,
    UpdateGameRunningDataWinpoint,
    UpdateGameRunningDataWinSingleNumber,
    GetGameRunningData,
    GetPlayerIdInBetplaced,
    RemovetripleBetsAll,
    TripleChanceBets,
    AddPlayerIdInBetplaced,
    Detailtriplechance,
    GameRunning,
    JoinGame,onbalance,addwinningpoint, lastWinningNo ,getRoundCount ,updateUserPoint
    ,  onchangePassword,updateWinningNo,onSenderNotification ,onNotification
    ,onSendPointsToPlayer,onSendPointsToPlayer1,onAcceptPoints,userByEmail ,onRejectPoints,updateWinningAmount
    ,getUserBalance,getUserPoint,gameMartixRecords,gameSlotRecords}