const bcrypt = require('bcrypt');
// const check = require('../validation/CheckValidation') 
const conn = require('../config/db')
const moment = require('moment');
//const {authToken} =require('../middleware/getToken')
//User login 
var nodemailer = require('nodemailer');
const e = require('express');


const authLogin = async (req, res) => {
    let message = null;
    let statusCode = 400;
    let error = {};
    let data = {};
  
    try {
      const { email, password, device_id } = req.body;
      let sql = `SELECT * FROM users WHERE LOWER(users.email) = ?`;
      let user = await conn.query(sql, [email.toLowerCase()]);
  
      if (user.length > 0) {
        const usersRows = JSON.parse(JSON.stringify(user))[0];
        const comparison = password == usersRows.password;
  
        if (comparison) {
          const updateSuccess = await updateDeviceId(email, device_id);
  
          if (updateSuccess) {
            const last_login = moment().format('YYYY-MM-DD HH:mm:ss');
            statusCode = 200;
            message = 'Login success';
            data = {
              id: usersRows.id,
              distributor_id: 'masterid',
              user_id: usersRows.email,
              username: usersRows.first_name,
              IMEI_no: '0',
              device: 'abcd',
              last_logged_in: usersRows.last_login,
              last_logged_out: usersRows.last_login,
              IsBlocked: usersRows.status,
              password: usersRows.password,
              created_at: usersRows.created,
              updated_at: usersRows.modified,
              active: usersRows.status,
              coins: usersRows.point
            };
          } else {
            statusCode = 500;
            message = 'Failed to update device ID';
          }
        } else {
          statusCode = 401;
          message = 'Password does not match!';
        }
      } else {
        statusCode = 401;
        message = 'Password or email does not match!';
      }
  
      const responseData = {
        status: statusCode,
        message,
        data,
        errors: error,
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJyb2xlIjoiU3VwZXIgQWRtaW4iLCJyb2xlX2lkIjoxLCJhZG1pbl9pZCI6MSwiaWF0IjoxNjUzMTMwNDMwLCJleHAiOjE2NTMxMzQwMzB9.hU41Zvx5uoaI7Nt46LaL8GFjTjAXUnet6GKhc5Ku4TA'
      };
  
      res.send(responseData);
    }  catch (error) {
      res.send({ authLogin: error });
    }
  };
  

const AlreadyLoggedin = async (req, res) => {
    let message = null
    let statusCode = 400
    try {

        const { email, device_id } = req.body;


        // Check requeted user is exist or not
        let sql =  'SELECT device_id FROM users WHERE email = ?';
        let user = await conn.query(sql, [email]);
        const storedDeviceId = user[0]?.device_id;

       // if (user.length > 0) {
        if (storedDeviceId === device_id || storedDeviceId === null) {
            statusCode = 200
            message = 'isAlreadyLoggedIn'
           
        } else {
            statusCode = 204
            message = 'Login '
        }



        const responseData = {
            status: statusCode,
            message
        }
        res.send(responseData)

    } catch (error) {
        res.send({ error: error })
    }
};



const isAlreadyLoggedin = async (req, res) => {
    try {
        const { email, device_id } = req.body;
        const query = 'SELECT device_id FROM users WHERE email = ?';
        const rows = await conn.query(query, [email]);
        const storedDeviceId = rows[0]?.device_id;

        if (storedDeviceId === device_id || storedDeviceId === null) {
            res.json({ isAlreadyLoggedIn: false });
        } else {
            res.json({ isAlreadyLoggedIn: true });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



const updateDeviceId = async (email, newDeviceId) => {
    try {
      const query = 'UPDATE users SET device_id = ? WHERE email = ?';
      await conn.query(query, [newDeviceId, email]);
      console.log('Device ID updated successfully.');
      return true; 
    } catch (error) {
      console.error('Error updating device ID:', error);
      return false; 
    }
  };













const forceloginDeviceId = async (req,res) => {
    let message = null
        let statusCode = 400
        try {
    
            const { email, newDeviceId } = req.body
            let sql = 'UPDATE users SET device_id = ? WHERE email = ?';
            let user = await conn.query(sql,[newDeviceId, email]);
            if (user) {
                statusCode = 200
                message = 'force login successfully'
           
            } else {
                statusCode = 404
                message = 'login not allowed '
            }
    const responseData = {
                status: statusCode,
                message
            }
            res.send(responseData)
    
        } catch (error) {
            res.send({ error: error })
    
            console.log("updateDeviceId",error )
        }
    }
      
  



const authSignUp = async (req, res) => {
    let message = null
    let register = false

    let statusCode = 400
    try {

        const { username, email, password } = req.body

        const encryptedPassword = await bcrypt.hash(password, 10)
        const formData = {
            username: username,
            email: email,
            password: encryptedPassword
        };

        // Check requeted user is exist or not
        let sql = `SELECT * FROM users WHERE LOWER(email)= ? limit ?`;
        let user = await conn.query(sql, [formData.email.toLowerCase(), 1]);
        if (user.length > 0) {
            statusCode = 401
            message = 'Sorry! Email already exist try another email'
        } else {
            const sql1 = `INSERT INTO users set ?`;
            const users = await conn.query(sql1, formData)
            if (users) {
                statusCode = 201
                message = "User created success"
                register = true
            } else {
                statusCode = 500
                message = "Something went wrong! database error"
            }
        }

        const responseData = {
            status: statusCode,
            message,
            register,

        }
        res.send(responseData)

    } catch (error) {
        res.send({ error: error })
    }
}


const resetPassword = async (req, res) => {
    let message = null;
    let statusCode = 400;
  
    try {
      const { email, old_password, new_password } = req.body;
  
      const sql = `SELECT * FROM users WHERE LOWER(email) = ? LIMIT 1`;
      const user = await conn.query(sql, [email.toLowerCase()]);
  
      if (user.length > 0) {
        const userRow = JSON.parse(JSON.stringify(user))[0];
        const storedPassword = userRow.password;
  
       
        if (old_password === storedPassword) {
          
          const updateSql = `UPDATE users SET password = ? WHERE email = ?`;
          const updateResult = await conn.query(updateSql, [new_password, email]);
  
          if (updateResult) {
            statusCode = 200;
            message = 'Password changed successfully';
          } else {
            statusCode = 500;
            message = 'Something went wrong while changing the password';
          }
        } else {
          statusCode = 401;
          message = 'Old password does not match';
        }
      } else {
        statusCode = 404;
        message = 'User not found';
      }
  
      const responseData = {
        status: statusCode,
        message,
      };
  
      res.send(responseData);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  };



const adduserbyadmin = async (req, res) => {
    let message = null
    let register = false

    let statusCode = 400
    try {

        const { full_name, email, password, role_id } = req.body

        const encryptedPassword = await bcrypt.hash(password, 10)
        const formData = {
            full_name: full_name,
            email: email,
            password: encryptedPassword,

        };

        // Check requeted user is exist or not
        if (role_id == 2) {
            let sql = `SELECT * FROM supermaster WHERE LOWER(email)= ? limit ?`;
            let user = await conn.query(sql, [formData.email.toLowerCase(), 1]);
            if (user.length > 0) {
                statusCode = 201
                message = 'Sorry! Email already exist try another email'
            } else {
                const sql1 = `INSERT INTO supermaster set ?`;
                const users = await conn.query(sql1, formData)
                if (users) {
                    statusCode = 200
                    message = "SuperMaster created success"
                    register = true
                } else {
                    statusCode = 500
                    message = "Something went wrong! database error"
                }
            }
        }



        if (role_id == 3) {
            let sql = `SELECT * FROM masterid WHERE LOWER(email)= ? limit ?`;
            let user = await conn.query(sql, [formData.email.toLowerCase(), 1]);
            if (user.length > 0) {
                statusCode = 201
                message = 'Sorry! Email already exist try another email'
            } else {
                const sql1 = `INSERT INTO masterid set ?`;
                const users = await conn.query(sql1, formData)
                if (users) {
                    statusCode = 200
                    message = "MasterId created success"
                    register = true
                } else {
                    statusCode = 500
                    message = "Something went wrong! database error"
                }
            }
        }


        if (role_id == 4) {
            /*      var playerid=""
                 const sql2 = `SELECT COUNT(*) as totalcount  FROM users`;
                 const allusers = await conn.query(sql2)
                   console.log("allusers:",allusers[0].totalcount)
                   if(allusers[0].totalcount/10==0){
                     playerid="RL0000"+(allusers[0].totalcount+1)
}
else if(allusers[0].totalcount/10>=1 && allusers[0].totalcount/10<=9){
playerid="RL000"+(allusers[0].totalcount+1)
}
else if(allusers[0].totalcount/10>=10 && allusers[0].totalcount/10<=99){
playerid="RL00"+(allusers[0].totalcount+1)
}

else if(allusers[0].totalcount/10>=100 && allusers[0].totalcount/10<=999){
playerid="RL0"+(allusers[0].totalcount+1)
}

else if(allusers[0].totalcount/10>=1000 && allusers[0].totalcount/10<=9999){
playerid="RL"+(allusers[0].totalcount+1)
}
console.log("playerId",playerid)
*/
            const formData = {
                first_name: full_name,
                email: email,
                password: password,
                // player_id:playerid,


            };
            let sql = `SELECT * FROM users WHERE LOWER(email)= ? limit ?`;
            let user = await conn.query(sql, [formData.email.toLowerCase(), 1]);
            if (user.length > 0) {
                statusCode = 201
                message = 'Sorry! Email already exist try another email'
            } else {
                const sql1 = `INSERT INTO users set ?`;
                const users = await conn.query(sql1, formData)
                if (users) {
                    statusCode = 200
                    message = "User created success"
                    register = true
                } else {
                    statusCode = 500
                    message = "Something went wrong! database error"
                }
            }
        }


        const responseData = {
            status: statusCode,
            message,
            register,

        }
        res.send(responseData)

    } catch (error) {
        res.send({ error: error })
    }
}

const adduserbyadmin1 = async (req, res) => {
    let message = null
    let register = false

    let statusCode = 400
    try {

        const { first_name, full_name,email, password, role_id } = req.body

        const encryptedPassword = password
        const formData = {
            first_name: first_name,
            first_name: full_name,
            email: email,
            password: encryptedPassword,
            role_id: 2 ,

        };

        // Check requeted user is exist or not
        if (role_id == 2) {
            let sql = `SELECT * FROM users WHERE LOWER(email)= ? limit ?`;
            let user = await conn.query(sql, [formData.email.toLowerCase(), 1]);
            if (user.length > 0) {
                statusCode = 201
                message = 'Sorry! Email already exist try another email'
            } else {
                const sql1 = `INSERT INTO users set ?`;
                const users = await conn.query(sql1, formData)
                if (users) {
                    statusCode = 200
                    message = "SuperMaster created success"
                    register = true
                } else {
                    statusCode = 500
                    message = "Something went wrong! database error"
                }
            }
        }
      

        if (role_id == 3) {
            let sql = `SELECT * FROM masterid WHERE LOWER(email)= ? limit ?`;
            let user = await conn.query(sql, [formData.email.toLowerCase(), 1]);
            if (user.length > 0) {
                statusCode = 201
                message = 'Sorry! Email already exist try another email'
            } else {
                const sql1 = `INSERT INTO masterid set ?`;
                const users = await conn.query(sql1, formData)
                if (users) {
                    statusCode = 200
                    message = "MasterId created success"
                    register = true
                } else {
                    statusCode = 500
                    message = "Something went wrong! database error"
                }
            }
        }


        // if (role_id == 3) {
        //     let sql = `SELECT * FROM masterid WHERE LOWER(email)= ? limit ?`;
        //     let user = await conn.query(sql, [formData.email.toLowerCase(), 1]);
        //     if (user.length > 0) {
        //         statusCode = 201
        //         message = 'Sorry! Email already exist try another email'
        //     } else {
        //         const sql1 = `INSERT INTO masterid set ?`;
        //         const users = await conn.query(sql1, formData)
        //         if (users) {
        //             statusCode = 200
        //             message = "MasterId created success"
        //             register = true
        //         } else {
        //             statusCode = 500
        //             message = "Something went wrong! database error"
        //         }
        //     }
        // }

        


    
        if (role_id == 4) {
            const formData = {
                first_name: full_name,
                email: email,
                password: password,
                // player_id:playerid,


            };
            // let sql = `SELECT * FROM users WHERE LOWER(email)= ? limit ?`;
            let sql = `SELECT * FROM users WHERE LOWER(email) = ? AND role_id = 0 LIMIT ?`;

            let user = await conn.query(sql, [formData.email.toLowerCase(), 1]);
            if (user.length > 0) {
                statusCode = 201
                message = 'Sorry! Email already exist try another email'
            } else {
                const sql1 = `INSERT INTO users set ?`;
                const users = await conn.query(sql1, formData)
                if (users) {
                    statusCode = 200
                    message = "User created success"
                    register = true
                } else {
                    statusCode = 500
                    message = "Something went wrong! database error"
                }
            }
        }


        const responseData = {
            status: statusCode,
            message,
            register,

        }
        res.send(responseData)

    } catch (error) {
        res.send({ error: error })
    }
}

async function getRoleIdFromEmail(request, response) {
    try {
      const email = request.body.email;
      // Search in users table
      const userQuery = 'SELECT `role_id` FROM users WHERE `email` = ?';
  
      const userResults = await conn.query(userQuery, [email]);
  
      if (userResults.length > 0 && userResults[0].role_id !== null) {
        const roleId = userResults[0].role_id;
        response.send({ roleId });
      } else {
        // Search in supermaster table
        const supermasterQuery = 'SELECT `role_id` FROM supermaster WHERE `email` = ?';
        const supermasterResults = await conn.query(supermasterQuery, [email]);
  
        if (supermasterResults.length > 0 && supermasterResults[0].role_id !== null) {
          const roleId = supermasterResults[0].role_id;
          response.send({ roleId });
        } else {
          response.send({ roleId: null });
        }
      }
    } catch (error) {
      console.error('Error occurred while executing queries:', error);
      response.send({ error: 'An error occurred' });
    }
  }

  const createStateId = async (req, res) => {
    let message = null;
    let register = false;
    let statusCode = 400;
    
    try {
        const { admin_number, email, password ,role_id } = req.body;
        
       
        const formData = {
            admin_number: admin_number,
            email: email,
            password: password,
            role_id: role_id,
        };
        
        let sql = `SELECT * FROM users WHERE LOWER(email) = ? LIMIT ?`;
        let user = await conn.query(sql, [formData.email.toLowerCase(), 1]);
        
        if (user.length > 0) {
            statusCode = 201;
            message = 'Sorry! Email already exists, please use another email.';
        } else {
            const sql1 = `INSERT INTO users SET ?`;
            const users = await conn.query(sql1, formData);
            
            if (users) {
                statusCode = 200;
                message = "User created successfully.";
                register = true;
            } else {
                statusCode = 500;
                message = "Something went wrong! Database error.";
            }
        }
        
        return res.status(statusCode).json({
            status: statusCode,
            message: message,
            register: register,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error.",
        });
    }
};


const createCityId = async (req, res) => {
    let message = null;
    let register = false;
    let statusCode = 400;
    
    try {
        const { admin_number, email, password, role_id, state_id } = req.body;
        
        const formData = {
            admin_number: admin_number,
            email: email,
            password: password,
            role_id: role_id,
            idManager: state_id,
        };
        
        let sql = `SELECT * FROM users WHERE LOWER(email) = ? LIMIT ?`;
        let user = await conn.query(sql, [formData.email.toLowerCase(), 1]);
        
        if (user.length > 0) {
            statusCode = 201;
            message = 'Sorry! Email already exists, please use another email.';
        } else {
            const sql1 = `INSERT INTO users SET ?`;
            const users = await conn.query(sql1, formData);
            
            if (users) {
                statusCode = 200;
                message = "User created successfully.";
                register = true;
            } else {
                statusCode = 500;
                message = "Something went wrong! Database error.";
            }
        }
        
        return res.status(statusCode).json({
            status: statusCode,
            message: message,
            register: register,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error.",
        });
    }
};

const createMainId = async (req, res) => {
    let message = null;
    let register = false;
    let statusCode = 400;
    var raArray=[]
    try {
        const { admin_number, email, password, role_id, city_id } = req.body;
        const formData = {
            admin_number: admin_number,
            email: email,
            password: password,
            role_id: role_id,
            idManager: city_id,
        };
        let sql = `SELECT * FROM users WHERE LOWER(email) = ? LIMIT ?`;
        let user = await conn.query(sql, [formData.email.toLowerCase(), 1]);
        if (user.length > 0) {
            statusCode = 201;
            message = 'Sorry! Email already exists, please use another email.';
        } else {
            const sql1 = `INSERT INTO users SET ?`;
            const users = await conn.query(sql1, formData);
            if (users) {
                statusCode = 200;
                message = "User created successfully.";
                register = true;              
                for(var i=1;i<16;i++){
                  /*   var  t=new Date()
                     var ra=t.getTime()+i

                   */
    var ra=Math.floor(100000+Math.random()*9000);
                  
  var val = Math.floor(1000 + Math.random() * 9000);
                  
                  
                     raArray.push("GK00"+ra)
                                    const formData11 = {
                                        first_name: "player"+ra,
                                        //email: "RL"+t.getTime()+"@demo.com",
                                        email: "GK00"+ra,
                                        password: val,
                                        idManager:email        
                                    };
                                    const player = `INSERT INTO users set ?`;
                                   const playerusers1 = await conn.query(player, formData11)
                                    if (playerusers1) {
                                        statusCode = 200
                                        message = "player created success"
                                        register = true
                                    }
                                    }

            } else {
                statusCode = 500;
                message = "Something went wrong! Database error.";
            }
        }

        return res.status(statusCode).json({
            status: statusCode,
            message: message,
            register: register,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error.",
        });
    }
};
// const createMainId = async (req, res) => {
//     let message = null;
//     let register = false;
//     let statusCode = 400;
    
//     try {
//         const { admin_number, email, password, role_id, city_id } = req.body;
        
//         const formData = {
//             admin_number: admin_number,
//             email: email,
//             password: password,
//             role_id: role_id,
//             idManager: city_id, 
//         };
        
//         let sql = `SELECT * FROM users WHERE LOWER(email) = ? LIMIT ?`;
//         let user = await conn.query(sql, [formData.email.toLowerCase(), 1]);
        
//         if (user.length > 0) {
//             statusCode = 201;
//             message = 'Sorry! Email already exists, please use another email.';
//         } else {
//             const sql1 = `INSERT INTO users SET ?`;
//             const users = await conn.query(sql1, formData);
            
//             if (users) {
//                 statusCode = 200;
//                 message = "User created successfully.";
//                 register = true;
//             } else {
//                 statusCode = 500;
//                 message = "Something went wrong! Database error.";
//             }
//         }
        
//         return res.status(statusCode).json({
//             status: statusCode,
//             message: message,
//             register: register,
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             status: 500,
//             message: "Internal Server Error.",
//         });
//     }
// };

const createPlayerId = async (req, res) => {
    let message = null;
    let register = false;
    let statusCode = 400;
    
    try {
        const { admin_number, email, password, role_id, main_id } = req.body;
        
        const formData = {
            admin_number: admin_number,
            email: email,
            password: password,
            role_id: role_id,
            idManager: main_id, 
        };
        
        let sql = `SELECT * FROM users WHERE LOWER(email) = ? LIMIT ?`;
        let user = await conn.query(sql, [formData.email.toLowerCase(), 1]);
        
        if (user.length > 0) {
            statusCode = 201;
            message = 'Sorry! Email already exists, please use another email.';
        } else {
            const sql1 = `INSERT INTO users SET ?`;
            const users = await conn.query(sql1, formData);
            
            if (users) {
                statusCode = 200;
                message = "User created successfully.";
                register = true;
            } else {
                statusCode = 500;
                message = "Something went wrong! Database error.";
            }
        }
        
        return res.status(statusCode).json({
            status: statusCode,
            message: message,
            register: register,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error.",
        });
    }
};



const getPass = async (req, res) => {
   var val=Math.floor(1000+Math.random()*9000);
   console.log("allusersValue:", val);
   res.send ({
statusCode :200,
  message :"password generated",
  password:val
   })
};

const Checkplayerlist = async (req, res) => {
    let message = null;
    let statusCode = 400;
    var data = {};
    const { idManager } = req.body;
    try {
      let sql = `SELECT * FROM  users where idManager=? `;
      const agent = await conn.query(sql, idManager);
      if (agent.length > 0) {
        statusCode = 200;
        message = "success";
 /*   var data1=[]
   for(i=0;i<agent.length;i++){
     data1.push(agent[i].email)
   }
        data = data1;
  */     } else {
        statusCode = 200;
        message = "detail not found";
      }
      const responseData = {
        status: statusCode,
        message,
        data:agent,
      };
      res.send(responseData);
    } catch (error) {
      res.status(500).send("Database error");
      console.log(error,"error")
    }
  };

  const changePassword = async (req,res) => {
    let message = null
        let statusCode = 400
        try {
    
            const { email, newpassword } = req.body
            let sql = 'UPDATE users SET password = ? WHERE email = ?';
            let user = await conn.query(sql,[newpassword, email]);
            if (user) {
                statusCode = 200
                message = 'force login successfully'
           
            } else {
                statusCode = 404
                message = 'login not allowed '
            }
    const responseData = {
                status: statusCode,
                message
            }
            res.send(responseData)
    
        } catch (error) {
            res.send({ error: error })
    
            console.log("updateDeviceId",error )
        }
    }
      





module.exports = {
    authLogin,
    authSignUp,
    //forgotPassword,
    resetPassword,
    adduserbyadmin,
    isAlreadyLoggedin,
    AlreadyLoggedin,

    adduserbyadmin1,
    getRoleIdFromEmail,
    forceloginDeviceId,
    createStateId,
    getPass,
    createCityId,
    createMainId,
    createPlayerId,
    Checkplayerlist,
    changePassword
}
