
const {UserOnline,User}= require('../sequelize');


async function saveSocketUser(data,socketId) {

    User.findOne({ where: {id: data.idUser } })
    .then(async (found) => {

        console.log("ho trovato  "+found.id);
        const userOnline = await UserOnline.create({
            user_id:found.id,
            disponibility:true,
            id_socket: socketId,
          });
          if(userOnline) console.log("userOnline created")
          
    });

      
   
}

async function removeSocketUser(socketId) {
    
   await UserOnline.destroy({ where: {id_socket: socketId } });
     console.log("deleted userOnline idSocket = "+ socketId);

}

async function findSocketUser(socketId) {
    
  return await UserOnline.findOne({include: [{
    model: User,
    required: true
   }],
    where: {id_socket: socketId } });

}


module.exports = {saveSocketUser,removeSocketUser,findSocketUser}
