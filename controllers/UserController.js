const bcrypt = require("bcrypt");
//const check = require('../validation/CheckValidation')
const conn = require("../config/db");
const moment = require("moment");
//const {authToken} =require('../middleware/getToken')
// User login
var nodemailer = require("nodemailer");

//list of getPlayerDAta
const getPass = async (req, res) => {
  var val = Math.floor(1000 + Math.random() * 9000);
  console.log("allusersValue:", val);
  res.send({
    statusCode: 200,
    message: "password generated",
    password: val,
  });
};

const getPlayerData = async (req, res) => {
  let message = null;
  let statusCode = 400;
  try {
    let sql = `SELECT * FROM  users`;
    const agent = await conn.query(sql);
    if (agent.length > 0) {
      statusCode = 200;
      message = "success";
      data = agent;
    } else {
      statusCode = 404;
      message = "Agent not found";
    }
    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    res.status(500).send("Database error");
  }
};

const getPlayerIdData = async (req, res) => {
  var playerid = "";
  const sql2 = `SELECT COUNT(*) as totalcount  FROM users`;
  const allusers = await conn.query(sql2);
  console.log("allusers:", allusers[0].totalcount);
  if (allusers[0].totalcount >= 0 && allusers[0].totalcount <= 9) {
    //playerid = "GK0000" + allusers[0].totalcount;
    playerid = "GK0010000" + allusers[0].totalcount;
  } else if (
    allusers[0].totalcount / 10 >= 1 &&
    allusers[0].totalcount / 10 <= 9
  ) {
    //playerid = "GK000" + allusers[0].totalcount;
    playerid = "GK001000" + allusers[0].totalcount;
  } else if (
    allusers[0].totalcount / 10 >= 10 &&
    allusers[0].totalcount / 10 <= 99
  ) {
    //playerid = "GK00" + allusers[0].totalcount;
    playerid = "GK00100" + allusers[0].totalcount;
  } else if (
    allusers[0].totalcount / 10 >= 100 &&
    allusers[0].totalcount / 10 <= 999
  ) {
    // playerid = "GK0" + allusers[0].totalcount;
    playerid = "GK0010" + allusers[0].totalcount;
  } else if (
    allusers[0].totalcount / 10 >= 1000 &&
    allusers[0].totalcount / 10 <= 9999
  ) {
    // playerid = "GK" + allusers[0].totalcount;
    playerid = "GK001" + allusers[0].totalcount;
  }
  console.log("playerId", playerid);
  statusCode = 200;
  message = "success";
  data = playerid;

  const responseData = {
    status: statusCode,
    message,
    data,
  };
  res.send(responseData);
};

//list of Super Master
const getSuperMasterData = async (req, res) => {
  let message = null;
  let statusCode = 400;
  try {
    let sql = `SELECT * FROM  supermaster`;
    const agent = await conn.query(sql);
    if (agent.length > 0) {
      statusCode = 200;
      message = "success";
      data = agent;
    } else {
      statusCode = 404;
      message = "Agent not found";
    }
    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    res.status(500).send("Database error");
  }
};

//MasterId

const getMasterIdData = async (req, res) => {
  let message = null;
  let statusCode = 400;
  try {
    let sql = `SELECT * FROM  masterid`;
    const agent = await conn.query(sql);
    if (agent.length > 0) {
      statusCode = 200;
      message = "success";
      data = agent;
    } else {
      statusCode = 404;
      message = "Agent not found";
    }
    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    res.status(500).send("Database error");
  }
};

const getPlayerHistoryData = async (req, res) => {
  let message = null;
  let statusCode = 400;
  try {
    let sql = `SELECT user.id,user.user_id,user.username,game_name.game_name FROM  user left join round_report on user.user_id=round_report.player_id left join game_name on round_report.game=game_name.id`;
    const agent = await conn.query(sql);
    if (agent.length > 0) {
      statusCode = 200;
      message = "success";
      data = agent;
    } else {
      statusCode = 404;
      message = "Agent not found";
    }
    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    res.status(500).send("Database error");
  }
};
const AndarBaharGamePlayHistoryData = async (req, res) => {
  let message = null;
  let statusCode = 400;
  try {
    //let sql = `SELECT * FROM game_record_andarbhar ORDER BY created DESC  `;
    let sql = `SELECT * FROM andarbahar_playerdetails ORDER BY playedtime DESC  `;

    const agent = await conn.query(sql);
    if (agent.length > 0) {
      statusCode = 200;
      message = "success";
      data = agent;
    } else {
      statusCode = 404;
      message = "Agent not found";
    }
    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    res.status(500).send("Database error");
  }
};

const RoulletGamePlayHistoryData = async (req, res) => {
  let message = null;
  let statusCode = 400;
  try {
    //let sql = `SELECT * FROM game_record_roulette ORDER BY created DESC`;
    let sql = `SELECT * FROM roulette_playerdetails ORDER BY playedtime DESC  `;

    const agent = await conn.query(sql);
    if (agent.length > 0) {
      statusCode = 200;
      message = "success";
      data = agent;
    } else {
      statusCode = 404;
      message = "Agent not found";
    }
    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    res.status(500).send("Database error");
  }
};
const FunTargetGamePlayHistoryData = async (req, res) => {
  let message = null;
  let statusCode = 400;
  try {
    //let sql = `SELECT * FROM game_record_funtarget ORDER BY created DESC `;
    let sql = `SELECT * FROM funtarget_playerdetail ORDER BY playedtime DESC  `;

    const agent = await conn.query(sql);
    if (agent.length > 0) {
      statusCode = 200;
      message = "success";
      data = agent;
    } else {
      statusCode = 404;
      message = "Agent not found";
    }
    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    res.status(500).send("Database error");
  }
};
const TripleChanceGamePlayHistoryData = async (req, res) => {
  let message = null;
  let statusCode = 400;
  try {
    // let sql = `SELECT * FROM game_record_triplechance ORDER BY created DESC`;
    let sql = `SELECT * FROM triplechance_playerdetail ORDER BY playedtime DESC  `;

    const agent = await conn.query(sql);
    if (agent.length > 0) {
      statusCode = 200;
      message = "success";
      data = agent;
    } else {
      statusCode = 404;
      message = "Agent not found";
    }
    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    res.status(500).send("Database error");
  }
};

const SevenUpGamePlayHistoryData = async (req, res) => {
  let message = null;
  let statusCode = 400;
  try {
    //let sql = `SELECT * FROM game_record_sevenup ORDER BY created DESC`;
    let sql = `SELECT * FROM seven_playerdetail ORDER BY playedtime DESC  `;

    const agent = await conn.query(sql);
    if (agent.length > 0) {
      statusCode = 200;
      message = "success";
      data = agent;
    } else {
      statusCode = 404;
      message = "Agent not found";
    }
    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    res.status(500).send("Database error");
  }
};
const Transaction = async (req, res) => {
  let message = null;
  let statusCode = 400;
  try {
    let sql = `SELECT * FROM transactions ORDER BY created DESC`;
    const agent = await conn.query(sql);
    if (agent.length > 0) {
      statusCode = 200;
      message = "success";
      data = agent;
    } else {
      statusCode = 404;
      message = "Agent not found";
    }
    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    res.status(500).send("Database error");
  }
};

const PointTransfer = async (req, res) => {
  let message = null;
  let statusCode = 400;
  try {
    let sql = `SELECT * FROM pointtransferred `;
    const agent = await conn.query(sql);
    if (agent.length > 0) {
      statusCode = 200;
      message = "success";
      data = agent;
    } else {
      statusCode = 404;
      message = "Agent not found";
    }
    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    res.status(500).send("Database error");
  }
};

const PointReceive = async (req, res) => {
  let message = null;
  let statusCode = 400;
  try {
    let sql = `SELECT * FROM pointtransferred `;
    const agent = await conn.query(sql);
    if (agent.length > 0) {
      statusCode = 200;
      message = "success";
      data = agent;
    } else {
      statusCode = 404;
      message = "Agent not found";
    }
    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    res.status(500).send("Database error");
  }
};

const PointCancel = async (req, res) => {
  let message = null;
  let statusCode = 400;
  try {
    let sql = `SELECT * FROM pointcanel `;
    const agent = await conn.query(sql);
    if (agent.length > 0) {
      statusCode = 200;
      message = "success";
      data = agent;
    } else {
      statusCode = 404;
      message = "Agent not found";
    }
    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    res.status(500).send("Database error");
  }
};

const PointRejected = async (req, res) => {
  let message = null;
  let statusCode = 400;
  try {
    let sql = `SELECT * FROM pointreject `;
    const agent = await conn.query(sql);
    if (agent.length > 0) {
      statusCode = 200;
      message = "success";
      data = agent;
    } else {
      statusCode = 404;
      message = "Agent not found";
    }
    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    res.status(500).send("Database error");
  }
};
const PointHistory = async (req, res) => {
  let message = null;
  let statusCode = 400;
  try {
    let sql = `SELECT * FROM point_history order by createdat	 desc limit 20`;
    const agent = await conn.query(sql);
    if (agent.length > 0) {
      statusCode = 200;
      message = "success";
      data = agent;
    } else {
      statusCode = 404;
      message = "Agent not found";
    }
    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    res.status(500).send("Database error");
  }
};

const GameReport = async (req, res) => {
  let message = null;
  let statusCode = 400;
  try {
    let sql = `SELECT * FROM join_game `;
    const agent = await conn.query(sql);
    if (agent.length > 0) {
      statusCode = 200;
      message = "success";
      data = agent;
    } else {
      statusCode = 404;
      message = "Agent not found";
    }
    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    res.status(500).send("Database error");
  }
};

const DailyStatus = async (req, res) => {
  let message = null;
  let statusCode = 400;
  try {
    let sql = `SELECT * FROM daily_status`;
    const agent = await conn.query(sql);
    if (agent.length > 0) {
      statusCode = 200;
      message = "success";
      data = agent;
    } else {
      statusCode = 404;
      message = "Agent not found";
    }
    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    res.status(500).send("Database error");
  }
};

//Playerpointhistory
const getPlayerPointHistory = async (req, res) => {
  let message = null;
  let statusCode = 400;
  try {
    let sql = `SELECT user.id,user.user_id,user.username,game_record_dragon.game_id,game_record_dragon.created_at FROM user left join game_record_dragon on user.user_id=game_record_dragon.user_id`;
    const agent = await conn.query(sql);
    if (agent.length > 0) {
      statusCode = 200;
      message = "success";
      data = agent;
    } else {
      statusCode = 404;
      message = "Agenot found";
    }
    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    res.status(500).send("Database error");
  }
};

/* //GamesHistory------------------
const getDoubleChanceHistory= async (req, res) => {
    let message = null
    let statusCode = 400  
    let data;
    try { 
           // let sql = `SELECT * FROM round_report WHERE game=1 and outer_win=NULL and inner_win=NULL `;
           let sql = `SELECT * FROM round_report WHERE game=1 `;

            const agent = await conn.query(sql)
            if(agent.length>0){ 
                statusCode = 200
                message    = "success" 
                data = agent
            }else{
                statusCode = 404
                message    = "NOT found"
            } 
            const responseData = {
                status: statusCode,
                message, 
                data
            }
            res.send(responseData)
     
    } catch (error) {
        res.status(500).send('Database error 1')
    }
}
const getJeetoJokerHistory= async (req, res) => {
    let message = null
    let statusCode = 400  
    try { 
            let sql = `SELECT * FROM round_report WHERE game=2 `;
            const agent = await conn.query(sql)
            if(agent.length>0){ 
                statusCode = 200
                message    = "success" 
                data = agent
            }else{
                statusCode = 404
                message    = "Agent found"
            } 
            const responseData = {
                status: statusCode,
                message, 
                data
            }
            res.send(responseData)
     
    } catch (error) {
        res.status(500).send('Database error 1')
    }
}
const get16CardsHistory= async (req, res) => {
    let message = null
    let statusCode = 400  
    try { 
            let sql = `SELECT * FROM round_report WHERE game=3`;
            const agent = await conn.query(sql)
            if(agent.length>0){ 
                statusCode = 200
                message    = "success" 
                data = agent
            }else{
                statusCode = 404
                message    = "Agent found"
            } 
            const responseData = {
                status: statusCode,
                message, 
                data
            }
            res.send(responseData)
     
    } catch (error) {
        res.status(500).send('Database error 1')
    }
}
const getSpinGameHistory= async (req, res) => {
    let message = null
    let statusCode = 400  
    try { 
            let sql = `SELECT * FROM round_report WHERE game=4 `;
            const agent = await conn.query(sql)
            if(agent.length>0){ 
                statusCode = 200
                message    = "success" 
                data = agent
            }else{
                statusCode = 404
                message    = "Agent found"
            } 
            const responseData = {
                status: statusCode,
                message, 
                data
            }
            res.send(responseData)
     
    } catch (error) {
        res.status(500).send('Database error 1')
    }
}

 */

const sendPoints = async (req, res) => {
  let message = null;
  let statusCode = 400;
  let sql = "";
  let responseData;
  try {
    console.log(req.body, "Send data");
    const { role_id, user_id, distributor_id, stokez_id, points, passcode } =
      req.body;
    switch (role_id) {
      case 4:
        sql = `SELECT * FROM stokez WHERE LOWER(id)= ? limit ?`;
        responseData = await conn.query(sql, [stokez_id, 1]);
        if (responseData.length > 0) {
          sql = `SELECT * FROM stokez_point WHERE LOWER(stokez_id)= ? limit ?`;
          responseData = await conn.query(sql, [stokez_id, 1]);
          if (responseData.length > 0) {
            const tpoints = parseInt(points) + parseInt(responseData[0].point);
            sql = "UPDATE stokez_point SET point= ? WHERE stokez_id=?";
            const userss = await conn.query(sql, [tpoints, stokez_id]);
            if (userss) {
              let formData = {
                stokez_id: stokez_id,
                point: points,
              };
              sql = "INSERT INTO  stokez_point_history SET ?";
              const userss = await conn.query(sql, formData);
              statusCode = 200;
              message = "Points updated";
            } else {
              statusCode = 500;
              message = "Something went wrong! database error";
            }
          } else {
            let formData = {
              stokez_id: stokez_id,
              point: points,
            };
            sql = "INSERT INTO  stokez_point SET ?";
            const userss = await conn.query(sql, formData);
            if (userss) {
              statusCode = 200;
              message = "Points updated";
            } else {
              statusCode = 500;
              message = "Something went wrong! database error";
            }
          }
        } else {
          message = "Invalid stokez id";
          statusCode = 404;
        }
        break;
      case 2:
        break;
      case 3:
        break;

      default:
        break;
    }

    const responseData = {
      status: statusCode,
      message,
    };
    res.send(responseData);
  } catch (error) {
    res.status(500).send("Database error");
  }
};

//transfer  stokez point
const sendPointstoSuperMaster = async (req, res) => {
  let message = null;
  let statusCode = 400;
  let sql = "";
  let responseData;
  let updateResponse;
  try {
    const { id, points } = req.body;
    console.log(id, points);

    let formData = {
      id: id,
      point: points,
    };
    let formData1 = {
      receiver: id,
      sender: "Company",
      point: points,
    };

    if (points) {
      sql = `SELECT * FROM supermaster WHERE full_name = ? limit ?`;
      responseData = await conn.query(sql, [id, 1]);
      if (responseData.length > 0) {
        console.log(responseData, "responseData");
        statusCode = 404;
        let stokezPointId = responseData[0].id;
        const tpoints = parseInt(points) + parseInt(responseData[0].point);

        sql = "UPDATE supermaster SET ? WHERE full_name=?";
        updateResponse = await conn.query(sql, [{ point: tpoints }, id]);
        if (updateResponse) {
          // statusCode = 200
          // message    = "Points updated"

          sql = "INSERT INTO  point_history SET ?";
          const userss = await conn.query(sql, formData1);
          if (userss) {
            statusCode = 200;
            message = "Points updated";
          } else {
            statusCode = 500;
            message = "Something went wrong! database error";
          }
        } else {
          statusCode = 500;
          message = "Something went wrong! database error";
        }
      }
    } else {
      statusCode = 404;
      message = "Points required";
    }

    const responseDatajson = {
      status: statusCode,
      message,
    };
    res.send(responseDatajson);
  } catch (error) {
    console.log(error);

    res.status(500).send("Database error");
  }
};

//transfer agent point
const sendPointstoMasterId = async (req, res) => {
  let message = null;
  let statusCode = 400;
  let sql = "";
  let responseData;
  let updateResponse;
  try {
    const { id, points } = req.body;
    console.log(id, points);

    let formData = {
      id: id,
      point: points,
    };
    let formData1 = {
      receiver: id,
      sender: "Company",
      point: points,
    };

    if (points) {
      sql = `SELECT * FROM masterid WHERE full_name = ? limit ?`;
      responseData = await conn.query(sql, [id, 1]);
      if (responseData.length > 0) {
        console.log(responseData, "responseData");
        statusCode = 404;
        let stokezPointId = responseData[0].id;
        const tpoints = parseInt(points) + parseInt(responseData[0].point);

        sql = "UPDATE masterid SET ? WHERE full_name=?";
        updateResponse = await conn.query(sql, [{ point: tpoints }, id]);
        if (updateResponse) {
          //statusCode = 200
          //message    = "Points updated"
          sql = "INSERT INTO  point_history SET ?";
          const userss = await conn.query(sql, formData1);
          if (userss) {
            statusCode = 200;
            message = "Points updated";
          } else {
            statusCode = 500;
            message = "Something went wrong! database error";
          }
        } else {
          statusCode = 500;
          message = "Something went wrong! database error";
        }
      }
    } else {
      statusCode = 404;
      message = "Points required";
    }

    const responseDatajson = {
      status: statusCode,
      message,
    };
    res.send(responseDatajson);
  } catch (error) {
    console.log(error);
    res.status(500).send("Database error");
  }
};
//transfer player point
const sendPointstoPlayer = async (req, res) => {
  let message = null;
  let statusCode = 400;
  let sql = "";
  let responseData;
  let updateResponse;
  try {
    const { id, points } = req.body;

    let formData = {
      id: id,
      point: points,
    };
    let formData1 = {
      receiver: id,
      sender: "Company",
      point: points,
    };

    if (points) {
      sql = `SELECT * FROM users WHERE email = ? limit ?`;
      responseData = await conn.query(sql, [id, 1]);
      if (responseData.length > 0) {
        console.log(responseData, "responseData");
        statusCode = 404;
        let stokezPointId = responseData[0].id;
        const tpoints = parseInt(points) + parseInt(responseData[0].point);

        sql = "UPDATE users SET ? WHERE email=?";
        updateResponse = await conn.query(sql, [{ point: tpoints }, id]);
        if (updateResponse) {
          //statusCode = 200
          // message    = "Points updated"
          sql = "INSERT INTO  point_history SET ?";
          const userss = await conn.query(sql, formData1);
          if (userss) {
            statusCode = 200;
            message = "Points updated";
          } else {
            statusCode = 500;
            message = "Something went wrong! database error";
          }
        } else {
          statusCode = 500;
          message = "Something went wrong! database error";
        }
      }
    } else {
      statusCode = 404;
      message = "Points required";
    }

    const responseDatajson = {
      status: statusCode,
      message,
    };
    res.send(responseDatajson);
  } catch (error) {
    res.status(500).send("Database error");
  }
};

const changePercentage = async (req, res) => {
  let message = null;
  let statusCode = 400;
  let sql = "";
  let responseData;
  let updateResponse;
  try {
    const { slots, userpoints, adminpoints } = req.body;

    let formData = {
      name: slots,
      percentage: adminpoints,
    };

    if (adminpoints) {
      sql = "UPDATE usershareprofit SET ? WHERE name=?";
      updateResponse = await conn.query(sql, [formData, slots]);
      if (updateResponse) {
        statusCode = 200;
        message = " Profit Points updated";
      } else {
        statusCode = 500;
        message = "Something went wrong! database error";
      }
    }

    const responseDatajson = {
      status: statusCode,
      message,
    };
    res.send(responseDatajson);
  } catch (error) {
    res.status(500).send("Database error");
  }
};

const UserShare = async (req, res) => {
  let message = null;
  let statusCode = 400;
  try {
    let sql = `SELECT * FROM usershareprofit `;
    const agent = await conn.query(sql);
    if (agent.length > 0) {
      statusCode = 200;
      message = "success";
      data = agent;
    } else {
      statusCode = 404;
      message = "Agent not found";
    }
    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    res.status(500).send("Database error");
  }
};

const transferPoint = async (req, res) => {
  let message = null;
  let statusCode = 400;
  var data = {};
  const { emailId } = req.body;
  try {
    let sql = `SELECT * FROM  trandableapi where FromAccountName=? order by createdat `;

    //let sql = `SELECT * FROM  point_history where sender=? order by createdat desc limit 5 `;
    const agent = await conn.query(sql, emailId);
    if (agent.length > 0) {
      statusCode = 200;
      message = "success";

      var data1 = {};
      var transferRecordArray = [];

      var transferRecord;
      for (i = 0; i < agent.length; i++) {
        transferRecord = {};

        transferRecord.from = agent[i].ToAccountName;
        transferRecord.to = agent[i].FromAccountName;
        transferRecord.amount = agent[i].point;
        transferRecord.date = agent[i].createdat;
        transferRecordArray.push(transferRecord);
      }
      data1.transferRecord = transferRecordArray;
      data = data1;
    } else {
      statusCode = 404;
      message = "detail not found";
    }
    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    res.status(500).send("Database error");
  }
};
const onbalance = async (req, res) => {
  let message = null;
  let statusCode = 400;
  const email = req.body.email;
  let data;
  try {
    let sql = `SELECT point FROM users where email =? `;
    const agent = await conn.query(sql, email);

    if (agent.length > 0) {
      statusCode = 200;
      message = "true";
      var data1 = {};
      data1.balance = agent[0].point;
      data = data1;
    } else {
      statusCode = 404;
      message = "user does not exist";
    }
    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    console.log("error-------", error);

    res.status(500).send("Database error");
  }
};

const SetplayerOnline = async (req, res) => {
  let message = null;
  let statusCode = 400;
  const email = req.body.email;
  let data;
  try {
    let sql = "UPDATE users SET active_player=1 WHERE email=?";
    const agent = await conn.query(sql, email);
    console.log(email, "email");
    //  if (agent.length > 0) {

    statusCode = 200;
    message = "Player is active";
    /*  var data1={}
       data1.activePlayer=agent[0].active_player
      data = data1;
    */ /*  } else {
      statusCode = 404;
      message = "user does not exist";
    }
    */ const responseData = {
      status: statusCode,
      message,
      // data,
    };
    res.send(responseData);
  } catch (error) {
    console.log("error-------", error);

    res.status(500).send("Database error");
  }
};

const SetplayerOffline = async (req, res) => {
  let message = null;
  let statusCode = 400;
  const email = req.body.email;
  let data;
  try {
    let sql = "UPDATE users SET active_player=0 WHERE email=?";

    const agent = await conn.query(sql, email);

    // if (agent.length > 0) {

    statusCode = 200;
    message = "Player is inactive";
    /*  var data1={}
       data1.activePlayer=agent[0].active_player
*/
    // data = data1;
    /*  } else {
      statusCode = 404;
      message = "user does not exist";
    }
    */ const responseData = {
      status: statusCode,
      message,
      // data,
    };
    res.send(responseData);
  } catch (error) {
    console.log("error-------", error);

    res.status(500).send("Database error");
  }
};

const CheckPlayer = async (req, res) => {
  let message = null;
  let statusCode = 400;
  const email = req.body.email;
  let player = false;
  let data;
  try {
    let sql = `SELECT * FROM users where email =? and active_player=1`;
    const agent = await conn.query(sql, email);

    if (agent.length > 0) {
      statusCode = 200;
      message = "player is active in game";
      player = true;
    } else {
      statusCode = 404;
      message = "player is inactive in game";
    }
    const responseData = {
      status: statusCode,
      message,
      player,
    };
    res.send(responseData);
  } catch (error) {
    console.log("error-------", error);

    res.status(500).send("Database error");
  }
};

const updateUser = async (req, res) => {
  try {
    const { id, first_name, password } = req.body;

    // Check if the user exists
    let sql = "SELECT * FROM users WHERE id = ?";
    let users = await conn.query(sql, [id]);
    if (users.length === 0) {
      return res.status(404).send({ message: "User not found" });
    }

    // Update the user data
    sql = "UPDATE users SET first_name = ?, password = ? WHERE id = ?";
    await conn.query(sql, [first_name, password, id]);

    // Return success response
    return res.status(200).send({ message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Something went wrong" });
  }
};

const updateSuperMaster = async (req, res) => {
  try {
    const { id, full_name, password } = req.body;

    // Check if the supermaster exists
    let sql = "SELECT * FROM supermaster WHERE id = ?";
    let supermasters = await conn.query(sql, [id]);
    if (supermasters.length === 0) {
      return res.status(404).send({ message: "Supermaster not found" });
    }

    // Update the supermaster data
    sql = "UPDATE supermaster SET full_name = ?, password = ? WHERE id = ?";
    await conn.query(sql, [full_name, password, id]);

    // Return success response
    return res
      .status(200)
      .send({ message: "Supermaster updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Something went wrong" });
  }
};

const updateMasterId = async (req, res) => {
  try {
    const { id, full_name, password } = req.body;

    // Check if the master id exists
    let sql = "SELECT * FROM masterid WHERE id = ?";
    let masterIds = await conn.query(sql, [id]);
    if (masterIds.length === 0) {
      return res.status(404).send({ message: "Master ID not found" });
    }

    // Update the master id data
    sql = "UPDATE masterid SET full_name = ?, password = ? WHERE id = ?";
    await conn.query(sql, [full_name, password, id]);

    // Return success response
    return res.status(200).send({ message: "Master ID updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Something went wrong" });
  }
};
const Adminfuntarget = async (req, res) => {
  let message = null;
  let statusCode = 400;
  let sql = "";
  let responseData;
  let updateResponse;
  try {
    const value = req.body.value1;
    console.log("value", value);

    sql = "UPDATE admin_funtarget SET value=?";
    updateResponse = await conn.query(sql, [value]);
    if (updateResponse) {
      statusCode = 200;
      message = " Profit Points updated";
    } else {
      statusCode = 500;
      message = "Something went wrong! database error";
    }

    const responseDatajson = {
      status: statusCode,
      message,
    };
    res.send(responseDatajson);
  } catch (error) {
    res.status(500).send("Database error");
  }
};

const getAdminfuntarget = async (req, res) => {
  let message = null;
  let statusCode = 400;
  let sql = "";
  let responseData;
  let updateResponse;
  let data;
  try {
    sql = "select * from admin_funtarget ";
    updateResponse = await conn.query(sql);
    if (updateResponse.length > 0) {
      // console.log("updateResponse",updateResponse)
      data = updateResponse[0];
      statusCode = 200;
      message = " Points updated";
    } else {
      statusCode = 500;
      message = "Something went wrong! database error";
    }

    const responseDatajson = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseDatajson);
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Database error");
  }
};

const Admin7up = async (req, res) => {
  let message = null;
  let statusCode = 400;
  let sql = "";
  let responseData;
  let updateResponse;
  try {
    const { value1, value2 } = req.body;
    // console.log("value",value1)

    sql = "UPDATE admin_7up SET value1=?, value2=?";
    updateResponse = await conn.query(sql, [value1, value2]);
    if (updateResponse) {
      console.log("updateResponse", updateResponse);

      statusCode = 200;
      message = " Points updated";
    } else {
      statusCode = 500;
      message = "Something went wrong! database error";
    }

    const responseDatajson = {
      status: statusCode,
      message,
    };
    res.send(responseDatajson);
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Database error");
  }
};

const getAdmin7up = async (req, res) => {
  let message = null;
  let statusCode = 400;
  let sql = "";
  let responseData;
  let updateResponse;
  let data;
  try {
    sql = "select * from admin_7up ";
    updateResponse = await conn.query(sql);
    if (updateResponse.length > 0) {
      // console.log("updateResponse",updateResponse)
      data = updateResponse[0];
      statusCode = 200;
      message = " Points updated";
    } else {
      statusCode = 500;
      message = "Something went wrong! database error";
    }

    const responseDatajson = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseDatajson);
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Database error");
  }
};

const Admintriplechance = async (req, res) => {
  let message = null;
  let statusCode = 400;
  let sql = "";
  let responseData;
  let updateResponse;
  try {
    const { value1, value2, value3 } = req.body;
    console.log("value", value1);

    sql = "UPDATE admin_triplechance SET  value1=?,value2=?,value3=?";
    updateResponse = await conn.query(sql, [value1, value2, value3]);
    if (updateResponse) {
      statusCode = 200;
      message = " Profit Points updated";
    } else {
      statusCode = 500;
      message = "Something went wrong! database error";
    }

    const responseDatajson = {
      status: statusCode,
      message,
    };
    res.send(responseDatajson);
  } catch (error) {
    res.status(500).send("Database error");
  }
};

const getAdmintriplechance = async (req, res) => {
  let message = null;
  let statusCode = 400;
  let sql = "";
  let responseData;
  let updateResponse;
  let data;
  try {
    sql = "select * from admin_triplechance ";
    updateResponse = await conn.query(sql);
    if (updateResponse.length > 0) {
      // console.log("updateResponse",updateResponse)
      data = updateResponse[0];
      statusCode = 200;
      message = " Points updated";
    } else {
      statusCode = 500;
      message = "Something went wrong! database error";
    }

    const responseDatajson = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseDatajson);
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Database error");
  }
};

const Adminroulette = async (req, res) => {
  let message = null;
  let statusCode = 400;
  let sql = "";
  let responseData;
  let updateResponse;
  try {
    const value = req.body.value1;
    console.log("value", value);

    sql = "UPDATE admin_roulette SET  value=?";
    updateResponse = await conn.query(sql, [value]);
    if (updateResponse) {
      statusCode = 200;
      message = " Profit Points updated";
    } else {
      statusCode = 500;
      message = "Something went wrong! database error";
    }

    const responseDatajson = {
      status: statusCode,
      message,
    };
    res.send(responseDatajson);
  } catch (error) {
    res.status(500).send("Database error");
  }
};
const getAdminroulette = async (req, res) => {
  let message = null;
  let statusCode = 400;
  let sql = "";
  let responseData;
  let updateResponse;
  let data;
  try {
    sql = "select * from admin_roulette ";
    updateResponse = await conn.query(sql);
    if (updateResponse.length > 0) {
      // console.log("updateResponse",updateResponse)
      data = updateResponse[0];
      statusCode = 200;
      message = " Points updated";
    } else {
      statusCode = 500;
      message = "Something went wrong! database error";
    }

    const responseDatajson = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseDatajson);
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Database error");
  }
};

const Adminandarbahar = async (req, res) => {
  let message = null;
  let statusCode = 400;
  let sql = "";
  let responseData;
  let updateResponse;
  try {
    const { value } = req.body;
    console.log("value", value);

    sql = "UPDATE admin_andarbahar SET  value=?";
    updateResponse = await conn.query(sql, [value]);
    if (updateResponse) {
      statusCode = 200;
      message = " Profit Points updated";
    } else {
      statusCode = 500;
      message = "Something went wrong! database error";
    }

    const responseDatajson = {
      status: statusCode,
      message,
    };
    res.send(responseDatajson);
  } catch (error) {
    res.status(500).send("Database error");
  }
};
const getAdminandarbahar = async (req, res) => {
  let message = null;
  let statusCode = 400;
  let sql = "";
  let responseData;
  let updateResponse;
  let data;
  try {
    const { value } = req.body;
    console.log("value", value);

    sql = "select * from admin_andarbahar ";
    updateResponse = await conn.query(sql);
    if (updateResponse.length > 0) {
      data = updateResponse[0];
      statusCode = 200;
      message = " Profit Points updated";
    } else {
      statusCode = 500;
      message = "Something went wrong! database error";
    }

    const responseDatajson = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseDatajson);
  } catch (error) {
    res.status(500).send("Database error");
  }
};

const gamerunning = async (req, res) => {
  let message = null;
  let statusCode = 400;
  let sql = "";
  let responseData;
  let updateResponse;
  let data;
  try {
    sql = "select * from game_running order by playerTime desc limit 20 ";
    updateResponse = await conn.query(sql);
    if (updateResponse.length > 0) {
      // console.log("updateResponse",updateResponse)
      data = updateResponse;
      statusCode = 200;
      message = "  updated";
    } else {
      statusCode = 500;
      message = "Something went wrong! database error";
    }

    const responseDatajson = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseDatajson);
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Database error");
  }
};

const gamerunningfuntarget = async (req, res) => {
  let message = null;
  let statusCode = 400;
  let sql = "";
  let responseData;
  let updateResponse;
  let data;
  try {
    sql =
      "SELECT `BetOnZero`, `BetOnOne`, `BetOnTwo`, `BetOnThree`, `BetOnFour`, `BetOnFive`, `BetOnSix`, `BetOnSeven`, `BetOnEight`, `BetOnNine` FROM `funtarget_bet` ";

    //  sql = "select * from game_runningfuntarget order by playedTime desc limit 20 ";
    updateResponse = await conn.query(sql);
    if (updateResponse.length > 0) {
      // console.log("updateResponse",updateResponse)
      data = updateResponse;
      statusCode = 200;
      message = " Points updated";
    } else {
      statusCode = 500;
      message = "Something went wrong! database error";
    }

    const responseDatajson = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseDatajson);
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Database error");
  }
};

const gamerunningandarbahar = async (req, res) => {
  let message = null;
  let statusCode = 400;
  let sql = "";
  let responseData;
  let updateResponse;
  let data;
  try {
    sql =
      "select * from game_running_andarbahar order by playedTime desc limit 20";
    updateResponse = await conn.query(sql);
    if (updateResponse.length > 0) {
      // console.log("updateResponse",updateResponse)
      data = updateResponse;
      statusCode = 200;
      message = " Points updated";
    } else {
      statusCode = 500;
      message = "Something went wrong! database error";
    }

    const responseDatajson = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseDatajson);
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Database error");
  }
};

const gamerunningroulette = async (req, res) => {
  let message = null;
  let statusCode = 400;
  let sql = "";
  let responseData;
  let updateResponse;
  let data;
  try {
    sql =
      "SELECT  `bet0`, `bet00`, `bet1`, `bet2`, `bet3`, `bet4`, `bet5`, `bet6`, `bet7`, `bet8`, `bet9`, `bet10`, `bet11`, `bet12`, `bet13`, `bet14`, `bet15`, `bet16`, `bet17`, `bet18`, `bet19`, `bet20`, `bet21`, `bet22`, `bet23`, `bet24`, `bet25`, `bet26`, `bet27`, `bet28`, `bet29`, `bet30`, `bet31`, `bet32`, `bet33`, `bet34`, `bet35`, `bet36` FROM `rouletebet`   ";

    //  sql = "select * from game_running_roulette order by playedTime desc limit 20";
    updateResponse = await conn.query(sql);
    if (updateResponse.length > 0) {
      // console.log("updateResponse",updateResponse)
      data = updateResponse;
      statusCode = 200;
      message = " Points updated";
    } else {
      statusCode = 500;
      message = "Something went wrong! database error";
    }

    const responseDatajson = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseDatajson);
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Database error");
  }
};

const gamerunningtriplechance = async (req, res) => {
  let message = null;
  let statusCode = 400;
  let sql = "";
  let responseData;
  let updateResponse;
  let data;
  try {
    sql = "SELECT  `singleNo`, `doubleNo`, `tripleNo` FROM `triplechance_bet` ";

    // sql = "select * from game_running_triplechance order by playedTime desc limit 20";
    updateResponse = await conn.query(sql);
    if (updateResponse.length > 0) {
      // console.log("updateResponse",updateResponse)
      data = updateResponse;
      statusCode = 200;
      message = " Points updated";
    } else {
      statusCode = 500;
      message = "Something went wrong! database error";
    }

    const responseDatajson = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseDatajson);
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Database error");
  }
};

const Winamount = async (req, res) => {
  let message = null;
  let statusCode = 400;
  const { playerId, game_id } = req.body;
  let data;
  try {
    let sql = `SELECT * FROM winpoint_details where playerId =? AND game_id=?`;
    const agent = await conn.query(sql, [playerId, game_id]);

    if (agent.length > 0) {
      statusCode = 200;
      message = "true";
      var data1 = {};
      data1.Winamount = agent[0].point;
      data = data1;
    } else {
      statusCode = 404;
      message = "user does not exist";
    }
    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    console.log("error-------", error);

    res.status(500).send("Database error");
  }
};
const DeletePreviousWinamount = async (req, res) => {
  let message = null;
  let statusCode = 400;
  let sql = "";
  let responseData;
  let updateResponse;
  try {
    const { playerId, game_id } = req.body;

    sql = `SELECT * FROM winpoint_details WHERE playerId = ? AND game_id=? `;
    responseData = await conn.query(sql, [playerId, game_id]);
    if (responseData.length > 0) {
      // console.log(responseData, "responseData");
      statusCode = 404;
      let stokezPointId = responseData[0].playerId;
      const points = parseInt(responseData[0].point);
      console.log(points, "points");

      sql = `SELECT * FROM users WHERE email = ?  `;
      let responseData1 = await conn.query(sql, [playerId]);
      if (responseData1.length > 0) {
        //console.log(responseData, "responseData");
        statusCode = 406;
        let p1 = responseData1[0].email;
        const tpoints1 = parseInt(responseData1[0].point);
        console.log(tpoints1, "tpoints1");

        sql = "UPDATE users SET ? WHERE email=?";
        updateResponse = await conn.query(sql, [
          {
            point:
              parseInt(responseData[0].point) +
              parseInt(responseData1[0].point),
          },
          playerId,
        ]);
        if (updateResponse) {
          // console.log(updateResponse, "-----------updateResponse");

          sql = `Delete FROM winpoint_details where playerId =? AND game_id=?`;
          // sql = `UPDATE winpoint_details SET point=?  where playerId =? AND game_id=?`;

          //  const userss = await conn.query(sql, [0,playerId,game_id]);
          const userss = await conn.query(sql, [playerId, game_id]);

          if (userss) {
            statusCode = 200;
            message = "user previous winamount detail is deleted successfully";
          } else {
            statusCode = 500;
            message = "Something went wrong! database error";
          }
        }
      }
    }
    const responseDatajson = {
      status: statusCode,
      message,
    };
    res.send(responseDatajson);
  } catch (error) {
    console.log(error, "error");
    res.status(500).send("Database error");
  }
};

const jokerBetPlaced = async (req, res) => {
  const { playerId, betAmount } = req.body;
  const cards = generateRandomCards();
  // Insert the player's bet and cards into the database
  savePlayerData(playerId, betAmount, cards);
  res.json({
    status: 200,
    message: "Bet is placed! Dealing cards...",
    data: {
      cards,
    },
  });
  function generateRandomCards() {
    const cards = [];
    for (let i = 0; i < 5; i++) {
      const rank = Math.floor(Math.random() * 13);
      const suit = Math.floor(Math.random() * 4);
      cards.push([rank, suit]);
    }
    return cards;
  }
  // function to save player data
  function savePlayerData(playerId, betAmount, cards) {
    const query = `INSERT INTO game_records_joker (playerId, betAmount, card1_rank, card1_suit, card2_rank, card2_suit, card3_rank, card3_suit, card4_rank, card4_suit, card5_rank, card5_suit)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      playerId,
      betAmount,
      cards[0][0],
      cards[0][1],
      cards[1][0],
      cards[1][1],
      cards[2][0],
      cards[2][1],
      cards[3][0],
      cards[3][1],
      cards[4][0],
      cards[4][1],
    ];
    conn.query(query, values, (err, results) => {
      if (err) {
        console.error("Error saving player data:", err);
      } else {
        console.log("Player data saved successfully");
      }
    });
  }
};

const jokerTakeAmount = async (req, res) => {
  const { playerId, updateBalance } = req.body;
  const fetchCreditsQuery = `SELECT credits FROM game_records_joker WHERE playerId = '${playerId}'`;
  conn.query(fetchCreditsQuery, (err, result) => {
    if (err) {
      console.error("Error fetching credits:", err);
      res.status(500).json({ status: 500, message: "Error fetching credits" });
      return;
    }
    // Check if user exists
    if (result.length === 0) {
      res.status(404).json({ status: 404, message: "User not found" });
      return;
    }
    const currentCredits = result[0].credits;
    const updatedCredits = currentCredits + parseInt(updateBalance);
    const updateCreditsQuery = `UPDATE game_records_joker SET credits = ${updatedCredits} WHERE playerId = '${playerId}'`;
    conn.query(updateCreditsQuery, (err) => {
      if (err) {
        console.error("Error updating credits:", err);
        res
          .status(500)
          .json({ status: 500, message: "Error updating credits" });
        return;
      }
      res.status(200).json({
        status: 200,
        message: "Credits added and fetched updated credits",
        credits: updatedCredits,
      });
    });
  });
};

const jokerDoubleUp = async (req, res) => {
  const playerId = req.body.playerId;
  // Generate a random card rank and suit
  const rank = Math.floor(Math.random() * 13);
  const suit = Math.floor(Math.random() * 4);
  const card = [rank, suit];
  // Save the card in the database
  conn.query(
    "INSERT INTO player_data (`playerId`, `rank`, `suit`) VALUES (?, ?, ?)",
    [playerId, rank, suit],
    (error, results, fields) => {
      if (error) {
        console.error("Error saving card:", error);
        res.status(500).json({
          status: "error",
          message: "An error occurred while saving the card.",
        });
      } else {
        res.json({
          status: "success",
          message: "Card saved successfully.",
          data: { doubleUp_card: card },
        });
      }
    }
  );
};

function getwinamount(
  betamount1,
  betamount2,
  betamount3,
  betamount4,
  betamount4,
  betamount5,
  betamount6
) {
  // Matrix 1
  const matrix1 = [
    [5, 1, 9, 25, 3],
    [8, 22, 10, 19, 7],
    [6, 18, 16, 11, 17],
    [24, 21, 14, 20, 13],
    [12, 23, 2, 4, 15],
  ];

  // Matrix 2
  const matrix2 = [
    [9, 24, 16, 4, 6],
    [13, 19, 14, 20, 25],
    [2, 18, 15, 12, 17],
    [1, 22, 11, 21, 8],
    [10, 7, 5, 23, 3],
  ];

  // Matrix 3
  const matrix3 = [
    [6, 7, 3, 24, 1],
    [23, 4, 12, 18, 2],
    [5, 19, 20, 16, 22],
    [11, 17, 9, 15, 25],
    [10, 13, 21, 4, 8],
  ];

  // Matrix 4
  const matrix4 = [
    [3, 7, 10, 4, 9],
    [24, 21, 18, 22, 8],
    [15, 14, 17, 11, 2],
    [13, 20, 12, 19, 23],
    [6, 25, 16, 1, 5],
  ];

  // Matrix 5
  const matrix5 = [
    [4, 6, 1, 23, 5],
    [25, 15, 3, 17, 13],
    [9, 19, 21, 12, 20],
    [10, 18, 16, 14, 8],
    [7, 24, 22, 2, 11],
  ];

  // Matrix 6
  const matrix6 = [
    [8, 23, 10, 13, 4],
    [2, 17, 16, 14, 24],
    [20, 12, 22, 19, 5],
    [25, 15, 9, 18, 11],
    [1, 7, 21, 3, 6],
  ];

  let winamount = 0;

  function generateRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const numbers = [];

  while (numbers.length < 5) {
    const randomNumber = generateRandomInt(1, 26);
    if (!numbers.includes(randomNumber)) {
      numbers.push(randomNumber);
    }
  }

  console.log(numbers);
  const randomNumber = Math.floor(Math.random() * 2) + 1;

  console.log(randomNumber);

  //Matrix 1
  //ROWS
  for (let i = 0; i < matrix1.length; i++) {
    const m = matrix1[i];

    let is4 = false;

    for (let j = 0; j < 2; j++) {
      const list = [];
      list.push(m[j]);
      list.push(m[j + 1]);
      list.push(m[j + 2]);
      list.push(m[j + 3]);

      if (
        numbers.includes(list[0]) &&
        numbers.includes(list[1]) &&
        numbers.includes(list[2]) &&
        numbers.includes(list[3])
      ) {
        winamount = winamount + 20 * betamount1;
        is4 = true;
      }
    }

    if (!is4) {
      for (let j = 0; j < 3; j++) {
        const list = [];
        list.push(m[j]);
        list.push(m[j + 1]);
        list.push(m[j + 2]);

        if (
          numbers.includes(list[0]) &&
          numbers.includes(list[1]) &&
          numbers.includes(list[2])
        ) {
          winamount = winamount + 4 * betamount1;
        }
      }
    }
  }
  //COLUMNS
  for (let i = 0; i < matrix1.length; i++) {
    const m = [];
    m.push(matrix1[0][i]);
    m.push(matrix1[1][i]);
    m.push(matrix1[2][i]);
    m.push(matrix1[3][i]);
    m.push(matrix1[4][i]);

    let is4 = false;

    for (let j = 0; j < 2; j++) {
      const list = [];
      list.push(m[j]);
      list.push(m[j + 1]);
      list.push(m[j + 2]);
      list.push(m[j + 3]);

      if (
        numbers.includes(list[0]) &&
        numbers.includes(list[1]) &&
        numbers.includes(list[2]) &&
        numbers.includes(list[3])
      ) {
        winamount = winamount + 20 * betamount1;
        is4 = true;
      }
    }

    if (!is4) {
      for (let j = 0; j < 3; j++) {
        const list = [];
        list.push(m[j]);
        list.push(m[j + 1]);
        list.push(m[j + 2]);

        if (
          numbers.includes(list[0]) &&
          numbers.includes(list[1]) &&
          numbers.includes(list[2])
        ) {
          winamount = winamount + 4 * betamount1;
        }
      }
    }
  }

  //DIAGONALS
  let list = [8, 18, 14, 4];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 20 * betamount1;
  } else if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount1;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 4 * betamount1;
  }

  list = [1, 10, 11, 13];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 20 * betamount1;
  } else if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount1;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 4 * betamount1;
  }

  list = [23, 14, 11, 7];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 20 * betamount1;
  } else if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount1;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 4 * betamount1;
  }

  list = [24, 18, 10, 25];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 20 * betamount1;
  } else if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount1;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 4 * betamount1;
  }

  list = [6, 21, 2];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount1;
  }

  list = [9, 19, 17];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount1;
  }

  list = [2, 20, 17];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount1;
  }

  list = [6, 22, 9];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount1;
  }

  list = [5, 22, 16, 20, 15];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 20 * betamount1;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3]) &&
    numbers.includes(list[4])
  ) {
    winamount = winamount + 20 * betamount1;
  } else if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount1;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 4 * betamount1;
  } else if (
    numbers.includes(list[2]) &&
    numbers.includes(list[3]) &&
    numbers.includes(list[4])
  ) {
    winamount = winamount + 4 * betamount1;
  }

  list = [12, 21, 16, 19, 3];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 20 * betamount1;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3]) &&
    numbers.includes(list[4])
  ) {
    winamount = winamount + 20 * betamount1;
  } else if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount1;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 4 * betamount1;
  } else if (
    numbers.includes(list[2]) &&
    numbers.includes(list[3]) &&
    numbers.includes(list[4])
  ) {
    winamount = winamount + 4 * betamount1;
  }

  //<-------------------------------------------------------------------------------------------------------------------------------------------------------->

  // Matrix 2
  // ROWS
  for (let i = 0; i < matrix2.length; i++) {
    const row = matrix2[i];

    let is4 = false;

    for (let j = 0; j < 2; j++) {
      const list = [];
      list.push(row[j]);
      list.push(row[j + 1]);
      list.push(row[j + 2]);
      list.push(row[j + 3]);

      if (
        numbers.includes(list[0]) &&
        numbers.includes(list[1]) &&
        numbers.includes(list[2]) &&
        numbers.includes(list[3])
      ) {
        winamount = winamount + 20 * betamount2;
        is4 = true;
      }
    }

    if (!is4) {
      for (let j = 0; j < 3; j++) {
        const list = [];
        list.push(row[j]);
        list.push(row[j + 1]);
        list.push(row[j + 2]);

        if (
          numbers.includes(list[0]) &&
          numbers.includes(list[1]) &&
          numbers.includes(list[2])
        ) {
          winamount = winamount + 4 * betamount2;
        }
      }
    }
  }

  // COLUMNS
  for (let i = 0; i < matrix2.length; i++) {
    const column = [];
    column.push(matrix2[0][i]);
    column.push(matrix2[1][i]);
    column.push(matrix2[2][i]);
    column.push(matrix2[3][i]);
    column.push(matrix2[4][i]);

    let is4 = false;

    for (let j = 0; j < 2; j++) {
      const list = [];
      list.push(column[j]);
      list.push(column[j + 1]);
      list.push(column[j + 2]);
      list.push(column[j + 3]);

      if (
        numbers.includes(list[0]) &&
        numbers.includes(list[1]) &&
        numbers.includes(list[2]) &&
        numbers.includes(list[3])
      ) {
        winamount = winamount + 20 * betamount2;
        is4 = true;
      }
    }

    if (!is4) {
      for (let j = 0; j < 3; j++) {
        const list = [];
        list.push(column[j]);
        list.push(column[j + 1]);
        list.push(column[j + 2]);

        if (
          numbers.includes(list[0]) &&
          numbers.includes(list[1]) &&
          numbers.includes(list[2])
        ) {
          winamount = winamount + 4 * betamount2;
        }
      }
    }
  }

  // DIAGONALS

  list = [13, 18, 11, 23];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 20 * betamount2;
  } else if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount2;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 4 * betamount2;
  }

  list = [24, 14, 12, 8];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 20 * betamount2;
  } else if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount2;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 4 * betamount2;
  }

  list = [25, 12, 11, 7];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 20 * betamount2;
  } else if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount2;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 4 * betamount2;
  }

  list = [4, 14, 18, 1];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 20 * betamount2;
  } else if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount2;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 4 * betamount2;
  }

  list = [2, 22, 5];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount2;
  }

  list = [16, 20, 17];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount2;
  }

  list = [7, 21, 5];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount2;
  }

  list = [16, 19, 2];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount2;
  }

  list = [9, 19, 15, 21, 3];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 20 * betamount2;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3]) &&
    numbers.includes(list[4])
  ) {
    winamount = winamount + 20 * betamount2;
  } else if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount2;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 4 * betamount2;
  } else if (
    numbers.includes(list[2]) &&
    numbers.includes(list[3]) &&
    numbers.includes(list[4])
  ) {
    winamount = winamount + 4 * betamount2;
  }

  list = [6, 20, 15, 22, 10];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 20 * betamount2;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3]) &&
    numbers.includes(list[4])
  ) {
    winamount = winamount + 20 * betamount2;
  } else if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount2;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 4 * betamount2;
  } else if (
    numbers.includes(list[2]) &&
    numbers.includes(list[3]) &&
    numbers.includes(list[4])
  ) {
    winamount = winamount + 4 * betamount2;
  }

  //<---------------------------------------------------------------------------------------------------------------------------------------------------------------------
  // Matrix 3
  // ROWS
  for (let i = 0; i < matrix3.length; i++) {
    const row = matrix3[i];

    let is4 = false;

    for (let j = 0; j < 2; j++) {
      const list = [];
      list.push(row[j]);
      list.push(row[j + 1]);
      list.push(row[j + 2]);
      list.push(row[j + 3]);

      if (
        numbers.includes(list[0]) &&
        numbers.includes(list[1]) &&
        numbers.includes(list[2]) &&
        numbers.includes(list[3])
      ) {
        winamount = winamount + 20 * betamount3;
        is4 = true;
      }
    }

    if (!is4) {
      for (let j = 0; j < 3; j++) {
        const list = [];
        list.push(row[j]);
        list.push(row[j + 1]);
        list.push(row[j + 2]);

        if (
          numbers.includes(list[0]) &&
          numbers.includes(list[1]) &&
          numbers.includes(list[2])
        ) {
          winamount = winamount + 4 * betamount3;
        }
      }
    }
  }

  // COLUMNS
  for (let i = 0; i < matrix3.length; i++) {
    const column = [];
    column.push(matrix3[0][i]);
    column.push(matrix3[1][i]);
    column.push(matrix3[2][i]);
    column.push(matrix3[3][i]);
    column.push(matrix3[4][i]);

    let is4 = false;

    for (let j = 0; j < 2; j++) {
      const list = [];
      list.push(column[j]);
      list.push(column[j + 1]);
      list.push(column[j + 2]);
      list.push(column[j + 3]);

      if (
        numbers.includes(list[0]) &&
        numbers.includes(list[1]) &&
        numbers.includes(list[2]) &&
        numbers.includes(list[3])
      ) {
        winamount = winamount + 20 * betamount3;
        is4 = true;
      }
    }

    if (!is4) {
      for (let j = 0; j < 3; j++) {
        const list = [];
        list.push(column[j]);
        list.push(column[j + 1]);
        list.push(column[j + 2]);

        if (
          numbers.includes(list[0]) &&
          numbers.includes(list[1]) &&
          numbers.includes(list[2])
        ) {
          winamount = winamount + 4 * betamount3;
        }
      }
    }
  }

  // DIAGONALS
  list = [23, 19, 9, 4];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 20 * betamount3;
  } else if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount3;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 4 * betamount3;
  }

  list = [7, 12, 16, 25];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 20 * betamount3;
  } else if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount3;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 4 * betamount3;
  }

  list = [2, 16, 9, 13];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 20 * betamount3;
  } else if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount3;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 4 * betamount3;
  }

  list = [11, 19, 12, 24];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 20 * betamount3;
  } else if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount3;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 4 * betamount3;
  }

  list = [5, 17, 21];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount3;
  }

  list = [3, 18, 22];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount3;
  }

  list = [21, 15, 22];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount3;
  }

  list = [5, 4, 3];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount3;
  }

  list = [6, 4, 20, 15, 8];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 20 * betamount3;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3]) &&
    numbers.includes(list[4])
  ) {
    winamount = winamount + 20 * betamount3;
  } else if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount3;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 4 * betamount3;
  } else if (
    numbers.includes(list[2]) &&
    numbers.includes(list[3]) &&
    numbers.includes(list[4])
  ) {
    winamount = winamount + 4 * betamount3;
  }

  list = [1, 18, 20, 17, 10];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 20 * betamount3;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3]) &&
    numbers.includes(list[4])
  ) {
    winamount = winamount + 20 * betamount3;
  } else if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount3;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 4 * betamount3;
  } else if (
    numbers.includes(list[2]) &&
    numbers.includes(list[3]) &&
    numbers.includes(list[4])
  ) {
    winamount = winamount + 4 * betamount3;
  }

  //<------------------------------------------------------------------------------------------------------------------------------------------------
  // Matrix 4
  // ROWS
  for (let i = 0; i < matrix4.length; i++) {
    const row = matrix4[i];

    let is4 = false;

    for (let j = 0; j < 2; j++) {
      const list = [];
      list.push(row[j]);
      list.push(row[j + 1]);
      list.push(row[j + 2]);
      list.push(row[j + 3]);

      if (
        numbers.includes(list[0]) &&
        numbers.includes(list[1]) &&
        numbers.includes(list[2]) &&
        numbers.includes(list[3])
      ) {
        winamount = winamount + 20 * betamount4;
        is4 = true;
      }
    }

    if (!is4) {
      for (let j = 0; j < 3; j++) {
        const list = [];
        list.push(row[j]);
        list.push(row[j + 1]);
        list.push(row[j + 2]);

        if (
          numbers.includes(list[0]) &&
          numbers.includes(list[1]) &&
          numbers.includes(list[2])
        ) {
          winamount = winamount + 4 * betamount4;
        }
      }
    }
  }

  // COLUMNS
  for (let i = 0; i < matrix4.length; i++) {
    const column = [];
    column.push(matrix4[0][i]);
    column.push(matrix4[1][i]);
    column.push(matrix4[2][i]);
    column.push(matrix4[3][i]);
    column.push(matrix4[4][i]);

    let is4 = false;

    for (let j = 0; j < 2; j++) {
      const list = [];
      list.push(column[j]);
      list.push(column[j + 1]);
      list.push(column[j + 2]);
      list.push(column[j + 3]);

      if (
        numbers.includes(list[0]) &&
        numbers.includes(list[1]) &&
        numbers.includes(list[2]) &&
        numbers.includes(list[3])
      ) {
        winamount = winamount + 20 * betamount4;
        is4 = true;
      }
    }

    if (!is4) {
      for (let j = 0; j < 3; j++) {
        const list = [];
        list.push(column[j]);
        list.push(column[j + 1]);
        list.push(column[j + 2]);

        if (
          numbers.includes(list[0]) &&
          numbers.includes(list[1]) &&
          numbers.includes(list[2])
        ) {
          winamount = winamount + 4 * betamount4;
        }
      }
    }
  }

  // DIAGONALS
  list = [24, 14, 12, 1];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 20 * betamount4;
  } else if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount4;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 4 * betamount4;
  }

  list = [7, 18, 11, 23];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 20 * betamount4;
  } else if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount4;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 4 * betamount4;
  }

  list = [8, 11, 12, 25];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 20 * betamount4;
  } else if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount4;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 4 * betamount4;
  }

  list = [4, 18, 14, 13];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 20 * betamount4;
  } else if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount4;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 4 * betamount4;
  }

  list = [15, 20, 16];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount4;
  }

  list = [10, 22, 2];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount4;
  }

  list = [10, 21, 15];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount4;
  }

  list = [2, 19, 16];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount4;
  }

  list = [3, 21, 17, 19, 5];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 20 * betamount4;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3]) &&
    numbers.includes(list[4])
  ) {
    winamount = winamount + 20 * betamount4;
  } else if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount4;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 4 * betamount4;
  } else if (
    numbers.includes(list[2]) &&
    numbers.includes(list[3]) &&
    numbers.includes(list[4])
  ) {
    winamount = winamount + 4 * betamount4;
  }

  list = [9, 22, 17, 20, 6];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 20 * betamount4;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3]) &&
    numbers.includes(list[4])
  ) {
    winamount = winamount + 20 * betamount4;
  } else if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount4;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 4 * betamount4;
  } else if (
    numbers.includes(list[2]) &&
    numbers.includes(list[3]) &&
    numbers.includes(list[4])
  ) {
    winamount = winamount + 4 * betamount4;
  }

  //<---------------------------------------------------------------------------------------------------------------------------------------------------------
  // Matrix 5
  // ROWS
  for (let i = 0; i < matrix5.length; i++) {
    const row = matrix5[i];

    let is4 = false;

    for (let j = 0; j < 2; j++) {
      const list = [];
      list.push(row[j]);
      list.push(row[j + 1]);
      list.push(row[j + 2]);
      list.push(row[j + 3]);

      if (
        numbers.includes(list[0]) &&
        numbers.includes(list[1]) &&
        numbers.includes(list[2]) &&
        numbers.includes(list[3])
      ) {
        winamount = winamount + 20 * betamount5;
        is4 = true;
      }
    }

    if (!is4) {
      for (let j = 0; j < 3; j++) {
        const list = [];
        list.push(row[j]);
        list.push(row[j + 1]);
        list.push(row[j + 2]);

        if (
          numbers.includes(list[0]) &&
          numbers.includes(list[1]) &&
          numbers.includes(list[2])
        ) {
          winamount = winamount + 4 * betamount5;
        }
      }
    }
  }

  // COLUMNS
  for (let i = 0; i < matrix5.length; i++) {
    const column = [];
    column.push(matrix5[0][i]);
    column.push(matrix5[1][i]);
    column.push(matrix5[2][i]);
    column.push(matrix5[3][i]);
    column.push(matrix5[4][i]);

    let is4 = false;

    for (let j = 0; j < 2; j++) {
      const list = [];
      list.push(column[j]);
      list.push(column[j + 1]);
      list.push(column[j + 2]);
      list.push(column[j + 3]);

      if (
        numbers.includes(list[0]) &&
        numbers.includes(list[1]) &&
        numbers.includes(list[2]) &&
        numbers.includes(list[3])
      ) {
        winamount = winamount + 20 * betamount5;
        is4 = true;
      }
    }

    if (!is4) {
      for (let j = 0; j < 3; j++) {
        const list = [];
        list.push(column[j]);
        list.push(column[j + 1]);
        list.push(column[j + 2]);

        if (
          numbers.includes(list[0]) &&
          numbers.includes(list[1]) &&
          numbers.includes(list[2])
        ) {
          winamount = winamount + 4 * betamount5;
        }
      }
    }
  }

  // DIAGONALS
  list = [25, 19, 16, 2];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 20 * betamount5;
  } else if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount5;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 4 * betamount5;
  }

  list = [6, 3, 12, 8];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 20 * betamount5;
  } else if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount5;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 4 * betamount5;
  }

  list = [13, 12, 16, 24];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 20 * betamount5;
  } else if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount5;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 4 * betamount5;
  }

  list = [23, 3, 19, 10];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 20 * betamount5;
  } else if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount5;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 4 * betamount5;
  }

  list = [20, 14, 22];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount5;
  }

  list = [1, 15, 9];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount5;
  }

  list = [1, 17, 20];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount5;
  }

  list = [9, 18, 22];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount5;
  }

  list = [4, 15, 21, 14, 11];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 20 * betamount5;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3]) &&
    numbers.includes(list[4])
  ) {
    winamount = winamount + 20 * betamount5;
  } else if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount5;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 4 * betamount5;
  } else if (
    numbers.includes(list[2]) &&
    numbers.includes(list[3]) &&
    numbers.includes(list[4])
  ) {
    winamount = winamount + 4 * betamount5;
  }

  list = [5, 17, 21, 18, 7];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 20 * betamount5;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3]) &&
    numbers.includes(list[4])
  ) {
    winamount = winamount + 20 * betamount5;
  } else if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount5;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 4 * betamount5;
  } else if (
    numbers.includes(list[2]) &&
    numbers.includes(list[3]) &&
    numbers.includes(list[4])
  ) {
    winamount = winamount + 4 * betamount5;
  }

  //<------------------------------------------------------------------------------------------------------------------------------------
  // Matrix 6
  // ROWS
  for (let i = 0; i < matrix6.length; i++) {
    const row = matrix6[i];

    let is4 = false;

    for (let j = 0; j < 2; j++) {
      const list = [];
      list.push(row[j]);
      list.push(row[j + 1]);
      list.push(row[j + 2]);
      list.push(row[j + 3]);

      if (
        numbers.includes(list[0]) &&
        numbers.includes(list[1]) &&
        numbers.includes(list[2]) &&
        numbers.includes(list[3])
      ) {
        winamount = winamount + 20 * betamount6;
        is4 = true;
      }
    }

    if (!is4) {
      for (let j = 0; j < 3; j++) {
        const list = [];
        list.push(row[j]);
        list.push(row[j + 1]);
        list.push(row[j + 2]);

        if (
          numbers.includes(list[0]) &&
          numbers.includes(list[1]) &&
          numbers.includes(list[2])
        ) {
          winamount = winamount + 4 * betamount6;
        }
      }
    }
  }

  // COLUMNS
  for (let i = 0; i < matrix6.length; i++) {
    const column = [];
    column.push(matrix6[0][i]);
    column.push(matrix6[1][i]);
    column.push(matrix6[2][i]);
    column.push(matrix6[3][i]);
    column.push(matrix6[4][i]);

    let is4 = false;

    for (let j = 0; j < 2; j++) {
      const list = [];
      list.push(column[j]);
      list.push(column[j + 1]);
      list.push(column[j + 2]);
      list.push(column[j + 3]);

      if (
        numbers.includes(list[0]) &&
        numbers.includes(list[1]) &&
        numbers.includes(list[2]) &&
        numbers.includes(list[3])
      ) {
        winamount = winamount + 20 * betamount6;
        is4 = true;
      }
    }

    if (!is4) {
      for (let j = 0; j < 3; j++) {
        const list = [];
        list.push(column[j]);
        list.push(column[j + 1]);
        list.push(column[j + 2]);

        if (
          numbers.includes(list[0]) &&
          numbers.includes(list[1]) &&
          numbers.includes(list[2])
        ) {
          winamount = winamount + 4 * betamount6;
        }
      }
    }
  }

  // DIAGONALS
  list = [2, 12, 9, 3];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 20 * betamount6;
  } else if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount6;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 4 * betamount6;
  }

  list = [23, 16, 19, 11];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 20 * betamount6;
  } else if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount6;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 4 * betamount6;
  }

  list = [8, 17, 22, 18, 6];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 20 * betamount6;
  } else if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount6;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 4 * betamount6;
  }

  list = [24, 19, 9, 7];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 20 * betamount6;
  } else if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount6;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 4 * betamount6;
  }

  list = [20, 15, 21];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount6;
  }

  list = [10, 14, 5];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount6;
  }

  list = [5, 18, 21];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount6;
  }

  list = [10, 17, 20];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount6;
  }

  list = [8, 17, 22, 18, 6];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 20 * betamount6;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3]) &&
    numbers.includes(list[4])
  ) {
    winamount = winamount + 20 * betamount6;
  } else if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount6;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 4 * betamount6;
  } else if (
    numbers.includes(list[2]) &&
    numbers.includes(list[3]) &&
    numbers.includes(list[4])
  ) {
    winamount = winamount + 4 * betamount6;
  }

  list = [4, 14, 22, 15, 1];
  if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 20 * betamount6;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3]) &&
    numbers.includes(list[4])
  ) {
    winamount = winamount + 20 * betamount6;
  } else if (
    numbers.includes(list[0]) &&
    numbers.includes(list[1]) &&
    numbers.includes(list[2])
  ) {
    winamount = winamount + 4 * betamount6;
  } else if (
    numbers.includes(list[1]) &&
    numbers.includes(list[2]) &&
    numbers.includes(list[3])
  ) {
    winamount = winamount + 4 * betamount6;
  } else if (
    numbers.includes(list[2]) &&
    numbers.includes(list[3]) &&
    numbers.includes(list[4])
  ) {
    winamount = winamount + 4 * betamount6;
  }

  //console.log(numbers)
  //console.log(randomNumber)
  //console.log(winamount)
  //console.log(randomNumber*winamount)

  const ans = numbers;
  ans.push(randomNumber);
  ans.push(winamount * randomNumber);

  return ans;
}

// const bingoBetsPlaced = async (req, res) => {
//   const id = req.body.id;
//   const target_bets = req.body.target_bet;
//   const bets = JSON.parse(target_bets)
//   const set = bets[0] + bets[1] + bets[2] + bets[3] + bets[4] + bets[5]
//   //console.log(bets)

//   var sql = 'SELECT * FROM players WHERE id = ?'

//   conn.query(sql, [id], (err, result) => {
//     if (err) {
//       res.json(err);
//     }
//     else {
//       if (result.length == 0) {
//         const reply = { message: "User Not Found" }
//         res.status(404).json(reply)
//       }
//       else {

//         const ans = getwinamount(bets[0], bets[1], bets[2], bets[3], bets[4], bets[5])
//         var win
//         const bal = result[0].balance;

//         sql = 'UPDATE players SET balance = ? WHERE id = ?'
//         conn.query(sql, [bal - set, id], (err, result) => {
//           if (err) {
//             throw err;
//           }
//         })
//         if (ans.length < 7) {
//           win = 0
//         }
//         else {
//           win = ans[6]
//         }
//         if (isNaN(win)) {
//           win = 0
//         }
//         const bingo = []
//         bingo.push(ans[0])
//         bingo.push(ans[1])
//         bingo.push(ans[2])
//         bingo.push(ans[3])
//         bingo.push(ans[4])
//         bingo.push(ans[5])

//         sql = 'UPDATE players SET win_amount = ? WHERE id = ?'
//         conn.query(sql, [win, id], (err, result) => {
//           if (err) {
//             throw err;
//           }
//         })
//         const reply = {
//           message: "Bets Have Been Placed",
//           data: { bingo: bingo, win_amount: win, balance: bal - set }
//         }
//         res.status(200).json(reply)

//       }
//     }
//   })
// }

// const bingoDoubleUp = async (req, res) => {
//   const id = req.body.id;
//   const choice = req.body.double_Up;
//   //const winamount = req.body.win_amount;
//   //const w = parseFloat(winamount)

//   var sql = 'SELECT * FROM players WHERE id = ?'

//   conn.query(sql, [id], (err, result) => {
//     if (err) {
//       res.json(err);
//     }
//     else {
//       if (result.length == 0) {
//         const reply = { message: "User Not Found" }
//         res.status(404).json(reply)
//       }
//       else {

//         const small = [0, 1, 2, 3, 4, 5, 13, 14, 15, 16, 17, 18, 26, 27, 28, 29, 30, 31, 39, 40, 41, 42, 43, 44]
//         const guarantee = [6, 19, 32, 45]
//         const big = [7, 8, 9, 10, 11, 12, 20, 21, 22, 23, 24, 25, 33, 34, 35, 36, 37, 38, 46, 47, 48, 49, 50, 51]

//         let randomNumber = Math.floor(Math.random() * 52); // Generates a random number between 0 and 51
//         const w = result[0].win_amount
//         let win = 0
//         if (guarantee.includes(randomNumber)) {
//           win = 2 * w
//         }
//         else {
//           if (choice === 'small' && small.includes(randomNumber)) {
//             win = 2 * w
//           }

//           if (choice === 'big' && big.includes(randomNumber)) {
//             win = 2 * w
//           }
//         }
//         const reply = {
//           message: "Sending Updated Win Amount",
//           data: {
//             "double_up_number": randomNumber,
//             "win_amount": win
//           }
//         }
//         sql = 'UPDATE players SET win_amount = ? WHERE id = ?'
//         conn.query(sql, [win, id], (err, result) => {
//           if (err) {
//             throw err;
//           }
//         })
//         res.status(200).json(reply)

//       }
//     }
//   })

// }

// const bingoTakeAmount = async (req, res) => {
//   const id = req.body.id;

//   var sql = 'SELECT * FROM players WHERE id = ?'

//   conn.query(sql, [id], (err, result) => {
//     if (err) {
//       res.json(err);
//     }
//     else {
//       if (result.length == 0) {
//         const reply = { message: "User Not Found" }
//         res.status(404).json(reply)
//       }
//       else {

//         const win = result[0].win_amount
//         const bal = result[0].balance

//         sql = 'UPDATE players SET win_amount = ? WHERE id = ?'

//         conn.query(sql, [0, id], (err, result) => {
//           if (err) {
//             throw err;
//           }
//         })

//         const newbal = bal + win;

//         sql = 'UPDATE players SET balance = ? WHERE id = ?'

//         conn.query(sql, [newbal, id], (err, result) => {
//           if (err) {
//             throw err;
//           }
//         })

//         const reply = { message: 'Amount Added to Balance', balance: newbal }
//         res.status(200).json(reply)
//       }
//     }
//   })

// }

// const bingoGetBalance = async (req, res) => {
//   const id = req.body.id;

//   var sql = 'SELECT * FROM players where id = ?'

//   conn.query(sql, [id], (err, result) => {
//     if (err) {
//       throw err;
//     }
//     else {
//       if (result.length == 0) {
//         const reply = { message: "User Not Found" }
//         res.status(404).json(reply)
//       }
//       else {
//         const bal = result[0].balance;
//         const reply = { balance: bal }
//         res.status(200).json(reply)
//       }
//     }
//   })
// }

const bingoBetsPlaced = async (req, res) => {
  const email = req.body.email;
  const target_bets = req.body.target_bet;
  const bets = JSON.parse(target_bets);
  const set = bets[0] + bets[1] + bets[2] + bets[3] + bets[4] + bets[5];
  //console.log(bets)

  var sql = "SELECT * FROM users WHERE email = ?";

  conn.query(sql, [email], (err, result) => {
    if (err) {
      res.json(err);
    } else {
      if (result.length == 0) {
        const reply = { message: "User Not Found" };
        res.status(404).json(reply);
      } else {
        const ans = getwinamount(
          bets[0],
          bets[1],
          bets[2],
          bets[3],
          bets[4],
          bets[5]
        );
        var win;
        const poi = result[0].point;

        sql = "UPDATE users SET point = ? WHERE email = ?";
        conn.query(sql, [poi - set, email], (err, result) => {
          if (err) {
            throw err;
          }
        });
        if (ans.length < 7) {
          win = 0;
        } else {
          win = ans[6];
        }
        if (isNaN(win)) {
          win = 0;
        }
        const bingo = [];
        bingo.push(ans[0]);
        bingo.push(ans[1]);
        bingo.push(ans[2]);
        bingo.push(ans[3]);
        bingo.push(ans[4]);
        bingo.push(ans[5]);

        sql = "UPDATE users SET win_amount = ? WHERE email = ?";
        conn.query(sql, [win, email], (err, result) => {
          if (err) {
            throw err;
          }
        });
        const reply = {
          message: "Bets Have Been Placed",
          data: { bingo: bingo, win_amount: win, point: poi - set },
        };
        res.status(200).json(reply);
      }
    }
  });
};

const bingoDoubleUp = async (req, res) => {
  const email = req.body.email;
  const choice = req.body.double_Up;
  //const winamount = req.body.win_amount;
  //const w = parseFloat(winamount)

  var sql = "SELECT * FROM users WHERE email = ?";

  conn.query(sql, [email], (err, result) => {
    if (err) {
      res.json(err);
    } else {
      if (result.length == 0) {
        const reply = { message: "User Not Found" };
        res.status(404).json(reply);
      } else {
        const small = [
          0, 1, 2, 3, 4, 5, 13, 14, 15, 16, 17, 18, 26, 27, 28, 29, 30, 31, 39,
          40, 41, 42, 43, 44,
        ];
        const guarantee = [6, 19, 32, 45];
        const big = [
          7, 8, 9, 10, 11, 12, 20, 21, 22, 23, 24, 25, 33, 34, 35, 36, 37, 38,
          46, 47, 48, 49, 50, 51,
        ];

        let randomNumber = Math.floor(Math.random() * 52); // Generates a random number between 0 and 51
        const w = result[0].win_amount;
        let win = 0;
        if (guarantee.includes(randomNumber)) {
          win = 2 * w;
        } else {
          if (choice === "small" && small.includes(randomNumber)) {
            win = 2 * w;
          }

          if (choice === "big" && big.includes(randomNumber)) {
            win = 2 * w;
          }
        }
        const reply = {
          message: "Sending Updated Win Amount",
          data: {
            double_up_number: randomNumber,
            win_amount: win,
          },
        };
        sql = "UPDATE users SET win_amount = ? WHERE email = ?";
        conn.query(sql, [win, email], (err, result) => {
          if (err) {
            throw err;
          }
        });
        res.status(200).json(reply);
      }
    }
  });
};

const bingoTakeAmount = async (req, res) => {
  const email = req.body.email;

  var sql = "SELECT * FROM users WHERE email = ?";

  conn.query(sql, [email], (err, result) => {
    if (err) {
      res.json(err);
    } else {
      if (result.length == 0) {
        const reply = { message: "User Not Found" };
        res.status(404).json(reply);
      } else {
        const win = result[0].win_amount;
        const poi = result[0].point;

        sql = "UPDATE users SET win_amount = ? WHERE email = ?";

        conn.query(sql, [0, email], (err, result) => {
          if (err) {
            throw err;
          }
        });

        const newpoi = poi + win;

        sql = "UPDATE users SET point = ? WHERE email = ?";

        conn.query(sql, [newpoi, email], (err, result) => {
          if (err) {
            throw err;
          }
        });

        const reply = { message: "Amount Added to Point", point: newpoi };
        res.status(200).json(reply);
      }
    }
  });
};

const bingoGetBalance = async (req, res) => {
  const email = req.body.email;

  var sql = "SELECT * FROM users where email = ?";

  conn.query(sql, [email], (err, result) => {
    if (err) {
      throw err;
    } else {
      if (result.length == 0) {
        const reply = { message: "User Not Found" };
        res.status(404).json(reply);
      } else {
        const poi = result[0].point;
        const reply = { point: poi };
        res.status(200).json(reply);
      }
    }
  });
};

const getStateIdData = async (req, res) => {
  let message = null;
  let statusCode = 400;
  try {
    let sql = `SELECT * FROM users WHERE role_id = 2`;
    const stateIds = await conn.query(sql);
    if (stateIds.length > 0) {
      statusCode = 200;
      message = "Success";
      data = stateIds;
    } else {
      statusCode = 404;
      message = "State IDs not found";
    }
    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    res.status(500).send("Database error");
  }
};

const getCityIdData = async (req, res) => {
  let message = null;
  let statusCode = 400;
  try {
    let sql = `SELECT * FROM users WHERE role_id = 3`;
    const stateIds = await conn.query(sql);
    if (stateIds.length > 0) {
      statusCode = 200;
      message = "Success";
      data = stateIds;
    } else {
      statusCode = 404;
      message = "City IDs not found";
    }
    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    res.status(500).send("Database error");
  }
};

const getMainIdData = async (req, res) => {
  let message = null;
  let statusCode = 400;
  try {
    let sql = `SELECT * FROM users WHERE role_id = 4`;
    const stateIds = await conn.query(sql);
    if (stateIds.length > 0) {
      statusCode = 200;
      message = "Success";
      data = stateIds;
    } else {
      statusCode = 404;
      message = "Main IDs not found";
    }
    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    res.status(500).send("Database error");
  }
};

const getStatebyAdmin = async (req, res) => {
  let message = null;
  let statusCode = 400;

  try {
    const { admin_number } = req.body;

    let sql = `SELECT email FROM users WHERE role_id = 2 AND admin_number = ?`;
    const stateIds = await conn.query(sql, [admin_number]);

    if (stateIds.length > 0) {
      statusCode = 200;
      message = "Success";
      data = stateIds.map((row) => row.email);
    } else {
      statusCode = 404;
      message = "State IDs not found for the provided admin_number";
    }

    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    res.status(500).send("Database error");
  }
};

const getCitybyState = async (req, res) => {
  let message = null;
  let statusCode = 400;

  try {
    const { state_id } = req.body;

    let sql = `SELECT email FROM users WHERE role_id = 3 AND idManager = ?`;
    const cityIds = await conn.query(sql, [state_id]);

    if (cityIds.length > 0) {
      statusCode = 200;
      message = "Success";
      data = cityIds.map((row) => row.email);
    } else {
      statusCode = 404;
      message = "City IDs not found for the provided state_id";
    }

    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    res.status(500).send("Database error");
  }
};

const getmainbycity = async (req, res) => {
  let message = null;
  let statusCode = 400;

  try {
    const { state_id } = req.body;

    let sql = `SELECT email FROM users WHERE role_id = 4 AND idManager = ?`;
    const cityIds = await conn.query(sql, [state_id]);

    if (cityIds.length > 0) {
      statusCode = 200;
      message = "Success";
      data = cityIds.map((row) => row.email);
    } else {
      statusCode = 404;
      message = "City IDs not found for the provided state_id";
    }

    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    res.status(500).send("Database error");
  }
};

const deleteStateId = async (req, res) => {
  let message = null;
  let statusCode = 400;

  try {
    const { email } = req.body;

    let sql = `DELETE * FROM users WHERE email = ? `;
    let user = await conn.query(sql, [email]);

    if (user.length > 0) {
      statusCode = 201;
      message = "deleted email.";
    } else {
      statusCode = 500;
      message = "Something went wrong! Database error.";
    }

    return res.status(statusCode).json({
      status: statusCode,
      message: message,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error.",
    });
  }
};

const deletecity = async (req, res) => {
  let message = null;
  let statusCode = 400;

  try {
    const { email } = req.body;

    let sql = `DELETE * FROM users WHERE email = ? `;
    let user = await conn.query(sql, [email]);

    if (user.length > 0) {
      statusCode = 201;
      message = "deleted email.";
    } else {
      statusCode = 500;
      message = "Something went wrong! Database error.";
    }

    return res.status(statusCode).json({
      status: statusCode,
      message: message,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error.",
    });
  }
};
const deletemain = async (req, res) => {
  let message = null;
  let statusCode = 400;

  try {
    const { email } = req.body;

    let sql = `DELETE * FROM users WHERE email = ? `;
    let user = await conn.query(sql, [email]);

    if (user.length > 0) {
      statusCode = 201;
      message = "deleted email.";
    } else {
      statusCode = 500;
      message = "Something went wrong! Database error.";
    }

    return res.status(statusCode).json({
      status: statusCode,
      message: message,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error.",
    });
  }
};
const deleteplayer = async (req, res) => {
  let message = null;
  let statusCode = 400;

  try {
    const { email } = req.body;

    let sql = `DELETE * FROM users WHERE email = ? `;
    let user = await conn.query(sql, [email]);

    if (user.length > 0) {
      statusCode = 201;
      message = "deleted email.";
    } else {
      statusCode = 500;
      message = "Something went wrong! Database error.";
    }

    return res.status(statusCode).json({
      status: statusCode,
      message: message,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error.",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { email } = req.body;

    const userQuery = "SELECT * FROM users WHERE email = ?";

    const userResult = await conn.query(userQuery, [email]);

    if (userResult.length === 0) {
      return res
        .status(404)
        .json({ status: 404, message: "User does not exist" });
    }

    const deleteQuery = "DELETE FROM users WHERE email = ?";

    await conn.query(deleteQuery, [email]);

    res.status(200).json({ status: 200, message: "User deleted successfully" });
  } catch (error) {
    console.log("Error deleting user:", error);

    res.status(500).json({ status: 500, message: "Failed to delete user" });
  }
};

const sendPointsUser = async (req, res) => {
  let message = null;
  let statusCode = 400;
  let sql = "";
  let responseData;

  try {
      const { sender, receive, point, pin } = req.body;

      
      sql = `SELECT * FROM users WHERE email = ? LIMIT 1`;
      responseData = await conn.query(sql, [sender]);

      if (responseData.length > 0 && responseData[0]["password"] === pin) {
          const formData = {
              ToAccountName: receive,
              FromAccountName: sender,
              point: point,
              pin: pin,
          };

         
          sql = "INSERT INTO trandableapi SET ?";
          const trandableApiResponse = await conn.query(sql, formData);

         
          sql = "INSERT INTO receivableapi SET ?";
          const receivableApiResponse = await conn.query(sql, formData);

          if (trandableApiResponse.affectedRows > 0 && receivableApiResponse.affectedRows > 0) {
              
              sql = "UPDATE users SET point = point - ? WHERE email = ?";
              const updateResponse = await conn.query(sql, [point, sender]);

              if (updateResponse.affectedRows > 0) {
                  statusCode = 200;
                  message = "Points updated";
              } else {
                  statusCode = 500;
                  message = "Failed to deduct points from sender's account";
              }
          } else {
              statusCode = 500;
              message = "Failed to insert data into trandableapi or receivableapi table";
          }
      } else {
          statusCode = 404;
          message = "Invalid PIN or sender email not found";
      }

      const responseDataJson = {
          status: statusCode,
          message: message,
      };
      res.send(responseDataJson);
  } catch (error) {
      console.log(error, "Error occurred");
      res.status(500).send("Database error");
  }
};

const receive1 = async (req, res) => {
  let message = null;

  let statusCode = 400;

  var data = {};

  const { emailId } = req.body;

  try {
    let sql = `SELECT * FROM  receivableapi where FromAccountName=? `;

    // let sql = `SELECT * FROM  trandableapi where FromAccountName=? order by createdat desc limit 1`;

    const agent = await conn.query(sql, emailId);

    if (agent.length > 0) {
      statusCode = 200;

      message = "success";

      data = agent;
    } else {
      statusCode = 404;

      message = "detail not found";
      data = [];
    }

    const responseData = {
      status: statusCode,

      message: message,

      data: data,
    };

    res.send(responseData);
  } catch (error) {
    console.log(error, "error");
    res.status(500).send("Database error");
  }
};
const receive = async (req, res) => {
  let message = null;

  let statusCode = 400;

  var data = {};

  const { emailId } = req.body;

  try {
    let sql = `SELECT * FROM  receivableapi where ToAccountName=? `;

    // let sql = `SELECT * FROM  trandableapi where FromAccountName=? order by createdat desc limit 1`;

    const agent = await conn.query(sql, emailId);

    if (agent.length > 0) {
      statusCode = 200;

      message = "success";

      data = agent;
    } else {
      statusCode = 404;

      message = "detail not found";
      data = [];
    }

    const responseData = {
      status: statusCode,

      message: message,

      data: data,
    };

    res.send(responseData);
  } catch (error) {
    console.log(error, "error");
    res.status(500).send("Database error");
  }
};

const transfer = async (req, res) => {
  let message = null;
  let statusCode = 400;
  var data = {};
  const { emailId } = req.body;
  try {
    let sql = `SELECT * FROM  trandableapi where FromAccountName=? `;
    // let sql = `SELECT * FROM  trandableapi where FromAccountName=? order by createdat desc limit 1`;
    const agent = await conn.query(sql, emailId);
    if (agent.length > 0) {
      statusCode = 200;
      message = "success";
      data = agent;
    } else {
      statusCode = 404;
      message = "detail not found";
      data = [];
    }
    const responseData = {
      status: statusCode,
      message: message,
      data: data,
    };
    res.send(responseData);
  } catch (error) {
    console.log(error, "error");
    res.status(500).send("Database error");
  }
};
const accpetPointsUser = async (req, res) => {
  let message = null;
  let statusCode = 400;
  let sql = "";
  let responseData;
  let updateResponse;
  let data;
  try {
    const { id } = req.body;
    console.log(id);
    for (var i = 0; i < id.length; i++) {
      sql = `SELECT * FROM trandableapi WHERE id = ? limit ?`;
      responseData = await conn.query(sql, [id[i], 1]);
      if (responseData.length > 0) {
        statusCode = 200;
        message = "true";
        data = responseData;
        sql = "INSERT INTO  receivableapi SET ?";

        const userss = await conn.query(sql, responseData);

        if (userss) {
          sql = `Delete FROM trandableapi where id =? `;
          // sql = `UPDATE winpoint_details SET point=?  where playerId =? AND game_id=?`;
          const del = await conn.query(sql, [id[i]]);
          statusCode = 200;
          message = " data is sending in receiver table ";
        } else {
          statusCode = 500;
          message = "Something went wrong! database error";
        }
      }
    }
    const responseDatajson = {
      status: statusCode,
      message: message,
      data: data,
    };
    res.send(responseDatajson);
  } catch (error) {
    console.log(error, "show me err");
    res.status(500).send("Database error");
  }
};

const DeleteUpdate = async (req, res) => {
  let message = null;
  let statusCode = 400;
  let sql = "";
  let responseData;
  let updateResponse;
  try {
      const { id } = req.body;
      for (var i = 0; i < id.length; i++) {
          
          sql = `SELECT * FROM receivableapi WHERE id = ?`;
          responseData = await conn.query(sql, [id[i]]);
          if (responseData.length > 0) {
              statusCode = 404;
              let stokezPointId = responseData[0].ToAccountName;
              
              
              sql = `SELECT * FROM users WHERE email = ?`;
              const responseData1 = await conn.query(sql, [stokezPointId]);
              
              if (responseData1.length > 0) {
                  
                  sql = `UPDATE users SET ? WHERE email = ?`;
                  updateResponse = await conn.query(sql, [
                      {
                          point: parseInt(responseData[0].point) + parseInt(responseData1[0].point),
                      },
                      stokezPointId,
                  ]);

                  if (updateResponse.affectedRows > 0) {
                      
                      sql = `DELETE FROM receivableapi WHERE id = ?`;
                      const receivableApiResponse = await conn.query(sql, [id[i]]);

                      
                      sql = `DELETE FROM trandableapi WHERE id = ?`;
                      const trandableApiResponse = await conn.query(sql, [id[i]]);

                      if (receivableApiResponse.affectedRows > 0 && trandableApiResponse.affectedRows > 0) {
                          statusCode = 200;
                          message = "Data deleted successfully";
                      } else {
                          statusCode = 500;
                          message = "Something went wrong! Database error";
                      }
                  }
              }
          }
      }
      const responseDatajson = {
          status: statusCode,
          message,
      };
      res.send(responseDatajson);
  } catch (error) {
      console.log(error, "error");
      res.status(500).send("Database error");
  }
};

const funtarget = async (req, res) => {
  let message = null;
  let statusCode = 400;
  var data = {};
  const { playerId } = req.body;
  try {
    let sql = `SELECT * FROM  game_runningfuntarget where playername=? ORDER BY playedTime  DESC LIMIT 1 `;

    // let sql = `SELECT Zero, One, Two, Three, Four, Five, Six, Seven, Eight, Nine FROM  game_runningfuntarget where playername=? ORDER BY playedTime  DESC LIMIT 1 `;
    const agent = await conn.query(sql, playerId);
    if (agent.length > 0) {
      statusCode = 200;
      message = "success";

      var data1 = [];
      // var transferRecordArray=[]

      //   var transferRecord ;
      //for(i=0;i<agent.length;i++){
      //  transferRecord={}

      data.zero = agent[0].Zero;
      data.one = agent[0].One;
      data.two = agent[0].Two;
      data.three = agent[0].Three;
      data.four = agent[0].Four;
      data.five = agent[0].Five;
      data.Six = agent[0].Six;
      data.Seven = agent[0].Seven;
      data.Eight = agent[0].Eight;
      data.Nine = agent[0].Nine;

      //transferRecord.date = agent[0].createdat;
      //transferRecordArray.push(transferRecord)

      // }
      //data1.transferRecord=transferRecordArray
      data1.push(data);
    } else {
      statusCode = 404;
      message = "detail not found";
    }
    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    console.log("err", error);
    res.status(500).send("Database error");
  }
};

const triplechance = async (req, res) => {
  let message = null;
  let statusCode = 400;
  var data;
  const { playerId } = req.body;
  try {
    let sql = `SELECT * FROM  game_running_triplechance where playername=? ORDER BY playedTime  DESC LIMIT 1 `;

    const agent = await conn.query(sql, playerId);
    if (agent.length > 0) {
      statusCode = 200;
      message = "success";

      var data1 = {};
      data1.singleNo = agent[0].singleNo;
      data1.doubleNo = agent[0].doubleNo;
      data1.tripleNo = agent[0].tripleNo;
      data1.singleVal = agent[0].singleVal;
      data1.doubleVal = agent[0].doubleVal;
      data1.tripleVal = agent[0].tripleVal;

      data = data1;
      //data1.push(data);
    } else {
      statusCode = 404;
      message = "detail not found";
    }
    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    console.log("err", error);
    res.status(500).send("Database error");
  }
};
const roulette = async (req, res) => {
  let message = null;
  let statusCode = 400;
  var data;
  const { playerId } = req.body;
  try {
    let sql = `SELECT * FROM  game_running_roulette where playername=? ORDER BY playedTime  DESC LIMIT 1 `;

    // let sql = `SELECT Zero, One, Two, Three, Four, Five, Six, Seven, Eight, Nine FROM  game_runningfuntarget where playername=? ORDER BY playedTime  DESC LIMIT 1 `;
    const agent = await conn.query(sql, playerId);
    if (agent.length > 0) {
      statusCode = 200;
      message = "success";

      var data1 = {};
      data1.straightUp = JSON.parse(agent[0].straightUp);
      data1.Split = JSON.parse(agent[0].Split);
      data1.Street = JSON.parse(agent[0].Street);
      data1.Corner = JSON.parse(agent[0].Corner);
      data1.specificBet = JSON.parse(agent[0].specificBet);
      data1.line = JSON.parse(agent[0].line);
      data1.dozen1 = JSON.parse(agent[0].dozen1);
      data1.dozen2 = JSON.parse(agent[0].dozen2);
      data1.dozen3 = JSON.parse(agent[0].dozen3);
      data1.column1 = JSON.parse(agent[0].column1);
      data1.column2 = JSON.parse(agent[0].column2);
      data1.column3 = JSON.parse(agent[0].column3);
      data1.onetoEighteen = JSON.parse(agent[0].onetoEighteen);
      data1.nineteentoThirtysix = JSON.parse(agent[0].nineteentoThirtysix);
      data1.even = JSON.parse(agent[0].even);
      data1.odd = JSON.parse(agent[0].odd);
      data1.black = JSON.parse(agent[0].black);
      data1.red = JSON.parse(agent[0].red);

      data1.straightUpVal = JSON.parse(agent[0].straightUpVal);
      data1.SplitVal = JSON.parse(agent[0].SplitVal);
      data1.StreetVal = JSON.parse(agent[0].StreetVal);
      data1.CornerVal = JSON.parse(agent[0].CornerVal);
      data1.specificBetVal = JSON.parse(agent[0].specificBetVal);
      data1.lineVal = JSON.parse(agent[0].lineVal);
      data1.dozen1Val = JSON.parse(agent[0].dozen1Val);
      data1.dozen2Val = JSON.parse(agent[0].dozen2Val);
      data1.dozen3Val = JSON.parse(agent[0].dozen3Val);
      data1.column1Val = JSON.parse(agent[0].column1Val);
      data1.column2Val = JSON.parse(agent[0].column2Val);
      data1.column3Val = JSON.parse(agent[0].column3Val);
      onetoEighteenVal = JSON.parse(agent[0].onetoEighteenVal);
      data1.nineteentoThirtysixVal = JSON.parse(
        agent[0].nineteentoThirtysixVal
      );
      data1.evenVal = JSON.parse(agent[0].evenVal);
      data1.oddVal = JSON.parse(agent[0].oddVal);
      data1.blackVal = JSON.parse(agent[0].blackVal);
      data1.redVal = JSON.parse(agent[0].redVal);

      //transferRecord.date = JSON.parseInt(agent[0].createdat);
      //transferRecordArray.push(transferRecord)

      // }
      //data1.transferRecord=transferRecordArray
      data = data1;
    } else {
      statusCode = 404;
      message = "detail not found";
    }
    const responseData = {
      status: statusCode,
      message,
      data,
    };
    res.send(responseData);
  } catch (error) {
    console.log("err", error);
    res.status(500).send("Database error");
  }
};
const Setplayer = async (req, res) => {
  let message = null;
  let statusCode = 400;
  const { email } = req.body;
  let data;
  try {
    let sql = "UPDATE users SET playerStatus=1 WHERE email=?";
    const agent = await conn.query(sql, email);
    console.log(email, "email");
    //  if (agent.length > 0) {

    statusCode = 200;
    message = "Player is active";
    /*  var data1={}
       data1.activePlayer=agent[0].active_player
      data = data1;
    */ /*  } else {
      statusCode = 404;
      message = "user does not exist";
    }
    */ const responseData = {
      status: statusCode,
      message,
      // data,
    };
    res.send(responseData);
  } catch (error) {
    console.log("error-------", error);

    res.status(500).send("Database error");
  }
};

const pinPassword = async (req, res) => {
  try {
    const { managerId, MemberId, required } = req.body;

    if (!managerId || !MemberId || !required) {
      return res.status(400).json({ message: "All fields are required" });
    }

    var sql = `INSERT INTO pinpass (managerId, MemberId, required) VALUES (?, ?, ?)`;

    const values = [managerId, MemberId, required];

    await conn.query(sql, values);
    sql = "UPDATE users SET playerStatus=1 WHERE email=?";
    await conn.query(sql, MemberId);


    return res.status(200).json({ message: "Form submitted successfully" });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Database error" });
  }
};


const getPlayerPoint = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const sql = `SELECT point FROM users WHERE email = ?`;
    const rows = await conn.query(sql, [email]);

    if (rows.length > 0) {
      const point = rows[0].point;
      return res.status(200).json({ point });
    } else {
      return res.status(404).json({ message: "Player not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Database error" });
  }
};


const sendStateIdPoints = async (req, res) => {
  try {
    const { senderEmail, email, point } = req.body;

    if (!senderEmail || !email || !point) {
      return res.status(400).json({ message: "Sender email, recipient email, and point are required" });
    }

    let senderPoints = 0;
    if (senderEmail !== 'admin@admin.com') {
      
      const deductPointsQuery = 'SELECT point FROM users WHERE email = ?';
      const deductPointsResult = await conn.query(deductPointsQuery, [senderEmail]).catch((error) => {
        console.error('Database Error:', error);
        return [];
      });
      if (deductPointsResult.length > 0) {
        senderPoints = deductPointsResult[0].point;
      } else {
        return res.status(404).json({ message: "Invalid sender email" });
      }
    }

    let sql = `SELECT * FROM users WHERE email = ? AND role_id = 2`;
    const checkEmailRows = await conn.query(sql, [email]).catch((error) => {
      console.error('Database Error:', error);
      return [];
    });

    if (checkEmailRows.length > 0) {
      const currentPoints = checkEmailRows[0].point;
      const newPoints = parseInt(currentPoints) + parseInt(point);

     
      const updatedSenderPoints = senderPoints - parseInt(point);
      sql = `UPDATE users SET point = ? WHERE email = ?`;
      await conn.query(sql, [updatedSenderPoints, senderEmail]);

     
      sql = `UPDATE users SET point = ? WHERE email = ?`;
      await conn.query(sql, [newPoints, email]);

     
      sql = `INSERT INTO point_history (sender, receiver, point) VALUES (?, ?, ?)`;
      await conn.query(sql, [senderEmail, email, point]);

      return res.status(200).json({ message: "Points updated and transaction recorded successfully" });
    } else {
      return res.status(404).json({ message: "Invalid recipient email or role_id" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Database error" });
  }
};


const sendCityIdPoints = async (req, res) => {
  try {
    const { senderEmail, email, point } = req.body;

    if (!senderEmail || !email || !point) {
      return res.status(400).json({ message: "Sender email, recipient email, and point are required" });
    }

    let senderPoints = 0;
    if (senderEmail !== 'admin@admin.com') {
      
      const deductPointsQuery = 'SELECT point FROM users WHERE email = ?';
      const deductPointsResult = await conn.query(deductPointsQuery, [senderEmail]).catch((error) => {
        console.error('Database Error:', error);
        return [];
      });
      if (deductPointsResult.length > 0) {
        senderPoints = deductPointsResult[0].point;
      } else {
        return res.status(404).json({ message: "Invalid sender email" });
      }
    }

    let sql = `SELECT * FROM users WHERE email = ? AND role_id = 3`;
    const checkEmailRows = await conn.query(sql, [email]).catch((error) => {
      console.error('Database Error:', error);
      return [];
    });

    if (checkEmailRows.length > 0) {
      const currentPoints = checkEmailRows[0].point;
      const newPoints = parseInt(currentPoints) + parseInt(point);

      
      const updatedSenderPoints = senderPoints - parseInt(point);
      sql = `UPDATE users SET point = ? WHERE email = ?`;
      await conn.query(sql, [updatedSenderPoints, senderEmail]);

     
      sql = `UPDATE users SET point = ? WHERE email = ?`;
      await conn.query(sql, [newPoints, email]);

   
      sql = `INSERT INTO point_history (sender, receiver, point) VALUES (?, ?, ?)`;
      await conn.query(sql, [senderEmail, email, point]);

      return res.status(200).json({ message: "Points updated and transaction recorded successfully" });
    } else {
      return res.status(404).json({ message: "Invalid recipient email or role_id" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Database error" });
  }
};









const sendMainIdPoints = async (req, res) => {
  try {
    const { senderEmail, email, point } = req.body;

    if (!senderEmail || !email || !point) {
      return res.status(400).json({ message: "Sender email, recipient email, and point are required" });
    }

    let senderPoints = 0;
    if (senderEmail !== 'admin@admin.com') {
    
      const deductPointsQuery = 'SELECT point FROM users WHERE email = ?';
      const deductPointsResult = await conn.query(deductPointsQuery, [senderEmail]).catch((error) => {
        console.error('Database Error:', error);
        return [];
      });
      if (deductPointsResult.length > 0) {
        senderPoints = deductPointsResult[0].point;
      } else {
        return res.status(404).json({ message: "Invalid sender email" });
      }
    }

    let sql = `SELECT * FROM users WHERE email = ? AND role_id = 4`;
    const checkEmailRows = await conn.query(sql, [email]).catch((error) => {
      console.error('Database Error:', error);
      return [];
    });

    if (checkEmailRows.length > 0) {
      const currentPoints = checkEmailRows[0].point;
      const newPoints = parseInt(currentPoints) + parseInt(point);

    
      const updatedSenderPoints = senderPoints - parseInt(point);
      sql = `UPDATE users SET point = ? WHERE email = ?`;
      await conn.query(sql, [updatedSenderPoints, senderEmail]);

   
      sql = `UPDATE users SET point = ? WHERE email = ?`;
      await conn.query(sql, [newPoints, email]);

      
      sql = `INSERT INTO point_history (sender, receiver, point) VALUES (?, ?, ?)`;
      await conn.query(sql, [senderEmail, email, point]);

      return res.status(200).json({ message: "Points updated and transaction recorded successfully" });
    } else {
      return res.status(404).json({ message: "Invalid recipient email or role_id" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Database error" });
  }
};




const sendPlayerIdPoints = async (req, res) => {
  try {
    const { senderEmail, email, point } = req.body;

    if (!senderEmail || !email || !point) {
      return res.status(400).json({ message: "Sender email, recipient email, and point are required" });
    }

    let senderPoints = 0;
    if (senderEmail !== 'admin@admin.com') {
  
      const deductPointsQuery = 'SELECT point FROM users WHERE email = ?';
      const deductPointsResult = await conn.query(deductPointsQuery, [senderEmail]).catch((error) => {
        console.error('Database Error:', error);
        return [];
      });
      if (deductPointsResult.length > 0) {
        senderPoints = deductPointsResult[0].point;
      } else {
        return res.status(404).json({ message: "Invalid sender email" });
      }
    }

    let sql = `SELECT * FROM users WHERE email = ? AND role_id = 5`;
    const checkEmailRows = await conn.query(sql, [email]).catch((error) => {
      console.error('Database Error:', error);
      return [];
    });

    if (checkEmailRows.length > 0) {
      const currentPoints = checkEmailRows[0].point;
      const newPoints = parseInt(currentPoints) + parseInt(point);

    
      const updatedSenderPoints = senderPoints - parseInt(point);
      sql = `UPDATE users SET point = ? WHERE email = ?`;
      await conn.query(sql, [updatedSenderPoints, senderEmail]);

 
      sql = `UPDATE users SET point = ? WHERE email = ?`;
      await conn.query(sql, [newPoints, email]);

      sql = `INSERT INTO point_history (sender, receiver, point) VALUES (?, ?, ?)`;
      await conn.query(sql, [senderEmail, email, point]);

      return res.status(200).json({ message: "Points updated and transaction recorded successfully" });
    } else {
      return res.status(404).json({ message: "Invalid recipient email or role_id" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Database error" });
  }
};


const getEmailsByManager = async (req, res) => {
  try {
    const { idManager } = req.body;

    if (!idManager) {
      return res.status(400).json({ message: "idManager is required" });
    }

    const sql = `SELECT * FROM users WHERE idManager = ?`; 
    const rows = await conn.query(sql, [idManager]);

    return res.status(200).json({ users: rows }); 
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Database error" });
  }
};


const resetUserPassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword, confirmPassword } = req.body;

  
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New password and confirm password do not match" });
    }

   
    const user = await conn.query("SELECT password FROM users WHERE email = ?", [email]);

    
    if (!user || user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    
    if (oldPassword !== user[0].password) {
      return res.status(401).json({ message: "Incorrect old password" });
    }

    
    const updatePasswordQuery = "UPDATE users SET password = ? WHERE email = ?";
    await conn.query(updatePasswordQuery, [newPassword, email]);

    return res.status(200).json({ status: 200, message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};


const rejectPoint = async (req, res) => {
  let message = null;
  let statusCode = 400;
  let sql = "";
  let responseData;
  let updateResponse;

  try {
    const { id } = req.body;
    for (var i = 0; i < id.length; i++) {
      
      sql = `SELECT * FROM receivableapi WHERE id = ?`;
      responseData = await conn.query(sql, [id[i]]);
      if (responseData.length > 0) {
        statusCode = 404;
        let fromAccountName = responseData[0].FromAccountName;
        const points = parseInt(responseData[0].point);

     
        sql = `UPDATE users SET point = point + ? WHERE email = ?`;
        updateResponse = await conn.query(sql, [points, fromAccountName]);

        if (updateResponse) {
       
          sql = `DELETE FROM receivableapi WHERE id = ?`;
          const deleteUserResponse = await conn.query(sql, [id[i]]);
          
          
          sql = `DELETE FROM trandableapi WHERE id = ?`;
          const deleteTrandableResponse = await conn.query(sql, [id[i]]);

          if (deleteUserResponse && deleteTrandableResponse) {
            statusCode = 200;
            message = "Points rejected and returned successfully";
          } else {
            statusCode = 500;
            message = "Something went wrong! Database error while deleting records";
          }
        } else {
          statusCode = 500;
          message = "Something went wrong! Database error while updating user points";
        }
      }
    }
    const responseDatajson = {
      status: statusCode,
      message,
    };
    res.send(responseDatajson);
  } catch (error) {
    console.log(error, "error");
    res.status(500).send("Database error");
  }
};

const cancelTransferableId = async (req, res) => {
  let message = null;
  let statusCode = 400;
  let sql = "";
  let responseData;
  let updateResponse;

  try {
    const { id } = req.body;
    for (var i = 0; i < id.length; i++) {
      
      
      sql = `SELECT * FROM trandableapi WHERE id = ?`;
      responseData = await conn.query(sql, [id[i]]);
      if (responseData.length > 0) {
        statusCode = 404;
        let fromAccountName = responseData[0].FromAccountName;
        const points = parseInt(responseData[0].point);

        
        sql = `UPDATE users SET point = point + ? WHERE email = ?`;
        updateResponse = await conn.query(sql, [points, fromAccountName]);

        if (updateResponse) {
          
          sql = `DELETE FROM trandableapi WHERE id = ?`;
          const deleteTrandableResponse = await conn.query(sql, [id[i]]);
          
          sql = `DELETE FROM receivableapi WHERE id = ?`;
          const deleteUserResponse = await conn.query(sql, [id[i]]);

          if (deleteUserResponse && deleteTrandableResponse) {
            statusCode = 200;
            message = "Transferable points canceled successfully";
          } else {
            statusCode = 500;
            message = "Something went wrong! Database error while deleting records";
          }
        } else {
          statusCode = 500;
          message = "Something went wrong! Database error while updating user points";
        }
      }
    }
    const responseDatajson = {
      status: statusCode,
      message,
    };
    res.send(responseDatajson);
  } catch (error) {
    console.log(error, "error");
    res.status(500).send("Database error");
  }
};

const checkPointHistory = async (req, res) => {
  try {
    const { sender } = req.body;

    if (!sender) {
      return res.status(400).json({ message: "Sender email is required" });
    }

    let sql = `SELECT sender, receiver, point  , createdat FROM point_history WHERE sender = ?`;
    const historyRows = await conn.query(sql, [sender]).catch((error) => {
      console.error('Database Error:', error);
      return [];
    });

    return res.status(200).json({ history: historyRows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Database error" });
  }
};
const sendMiniIdPoints = async (req, res) => {
  try {
    const { senderEmail, email, point } = req.body;

    if (!senderEmail || !email || !point) {
      return res.status(400).json({ message: "Sender email, recipient email, and point are required" });
    }

    let sql = `SELECT * FROM users WHERE email = ? AND role_id = 1`; 
    const checkEmailRows = await conn.query(sql, [email]).catch((error) => {
      console.error('Database Error:', error);
      return [];
    });

    if (checkEmailRows.length > 0) {
      const currentPoints = checkEmailRows[0].point;
      const newPoints = parseInt(currentPoints) + parseInt(point);

      
      sql = `UPDATE users SET point = ? WHERE email = ?`;
      await conn.query(sql, [newPoints, email]);

      
      sql = `INSERT INTO point_history (sender, receiver, point) VALUES (?, ?, ?)`;
      await conn.query(sql, [senderEmail, email, point]);

      return res.status(200).json({ message: "Points updated and transaction recorded successfully" });
    } else {
      return res.status(404).json({ message: "Invalid recipient email or role_id" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Database error" });
  }
};
const rejectPoint1 = async (req, res) => {
  let message = null;
  let statusCode = 400;
  let sql = "";
  let responseData;
  let updateResponse;

  try {
    const { id } = req.body;
   
      sql = `SELECT * FROM trandableapi WHERE id = ?`;
      responseData = await conn.query(sql, [id[i]]);
      if (responseData.length > 0) {
        statusCode = 404;
        let fromAccountName = responseData[0].FromAccountName;
        const points = parseInt(responseData[0].point);

       
        sql = `UPDATE users SET point = point + ? WHERE email = ?`;
        updateResponse = await conn.query(sql, [points, fromAccountName]);

        if (updateResponse) {
       
        
       
          sql = `DELETE FROM trandableapi WHERE id = ?`;
          const deleteTrandableResponse = await conn.query(sql, [id[i]]);

          if (deleteUserResponse.length>0) {
           
              statusCode = 200;
              message = "Points rejected and returned successfully. Record stored in rejectedpoint_record.";
            } else {
              statusCode = 500;
              message = "Something went wrong! Database error while storing rejected points record.";
            }
          }
      }
    
    const responseDatajson = {
      status: statusCode,
      message,
    };
    res.send(responseDatajson);
  } catch (error) {
    console.log(error, "error");
    res.status(500).send("Database error");
  }
};



module.exports = {
  pinPassword,
  Setplayer,
  roulette,
  triplechance,
  funtarget,
  deleteUser,
  deleteStateId,
  deletecity,
  deleteplayer,
  deletemain,
  getPass,
  DeletePreviousWinamount,
  Winamount,
  gamerunningtriplechance,
  gamerunningroulette,
  gamerunningandarbahar,
  gamerunningfuntarget,
  gamerunning,
  Adminfuntarget,
  Adminandarbahar,
  Adminroulette,
  Admintriplechance,
  Admin7up,
  getAdmin7up,
  getAdminroulette,
  getAdminandarbahar,
  getAdminfuntarget,
  getAdmintriplechance,

  CheckPlayer,
  SetplayerOnline,
  SetplayerOffline,
  receive,
  receive1,

  onbalance,
  transferPoint,
  /* createDistrubutor ,
    createStokez,
    createAgent,
    createPlayer,
    createUser,  
    getUsers,
    getAdminData,
    sendPoints,
    changePassword,
    resetPassword,
    getAgents,
    getAgentsData, */
  getPlayerData,
  getPlayerHistoryData,
  getSuperMasterData,
  getMasterIdData,

  changePercentage,
  UserShare,
  jokerBetPlaced,
  jokerTakeAmount,
  jokerDoubleUp,
  bingoBetsPlaced,
  bingoDoubleUp,
  bingoTakeAmount,
  bingoGetBalance,

  sendPoints,
  sendPointstoSuperMaster,
  sendPointstoMasterId,
  sendPointstoPlayer,

  //getAllPlayerData,
  AndarBaharGamePlayHistoryData,
  RoulletGamePlayHistoryData,
  FunTargetGamePlayHistoryData,
  TripleChanceGamePlayHistoryData,
  SevenUpGamePlayHistoryData,
  // PokergetPlayerHistoryData,
  // TigerVsElephantgetPlayerHistoryData,
  //LuckyBallgetPlayerHistoryData,
  Transaction,
  PointTransfer,
  PointReceive,
  PointCancel,
  PointRejected,
  PointHistory,
  GameReport,
  DailyStatus,

  getPlayerIdData,
  updateUser,
  updateSuperMaster,
  updateMasterId,

  getStateIdData,
  getStatebyAdmin,
  getCitybyState,
  getCityIdData,
  getmainbycity,
  getMainIdData,
  sendPointsUser,
  transfer,
  accpetPointsUser,
  DeleteUpdate,
  getPlayerPoint,
  sendStateIdPoints,
  sendMainIdPoints,
  sendCityIdPoints,
  sendPlayerIdPoints,
  getEmailsByManager,
  resetUserPassword,
  rejectPoint,
  cancelTransferableId,
  checkPointHistory,
  sendMiniIdPoints

  /* getStokezPointHistory,
    getAgentPointHistory,
    getPlayerPointHistory,
    getDoubleChanceHistory,
    getJeetoJokerHistory,
    get16CardsHistory,
    getSpinGameHistory,
 */
};
