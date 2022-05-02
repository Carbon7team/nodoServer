
const {UserOnline,User}= require('../sequelize');


async function sendCallToTechnician(userCall,socket) {

    UserOnline.findOne({include: [{
        model: User,
        required: true
       }], where: {disponibility: true , role: "technician"} })
    .then(async (found) => {

        
        socket.broadcast.to(found.id_socket).emit('message', {
            "type" : "call",
            "user_id" : userCall.user_id,
        } );
        console.log("forward the call to :  "+found.user_id);
    });

      
   
}

async function resendCallToTechnician(userCall,oldTechnicianSocket,socket) {

    UserOnline.findOne({include: [{
        model: User,
        required: true
       }], where: {disponibility: true , role: "technician", id_socket: { $not: oldTechnicianSocket}}  })
    .then(async (found) => {
        if(found ===1){
            socket.broadcast.to(found.id_socket).emit('message', {
                "type" : "call",
                "user_id" : userCall.user_id,
            } );
            console.log("forward the call to :  "+found.user_id);
        }else{
            socket.broadcast.to(userCall.id_socket).emit('message', {
                "type" : "callRefused",
            } );
            console.log("the call of user : "+found.user_id+ "was refused");
        }
        
       
    });

      
   
}



module.exports = {sendCallToTechnician,resendCallToTechnician}
