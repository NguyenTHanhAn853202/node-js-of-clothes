const Account = require('../../App/models/Accounts')

const handleRole = async(req, res, next)=>{
    const id = req.body.id || req.query.id;
    // if(!id) return res.status(403).json({
    //     title:'error',
    //     success:false,
    //     message:'the id is empty'
    // })
    const account  = await Account.findOne({_id:id})
    // if(!account) return res.status(403).json({
    //     title:'Error',
    //     success: false,
    //     message: 'Dont find account that it has this id'
    // })
    return account?.role || '';
}

async function manager(req,res,next){
    const role = await handleRole(req, res, next)
    if(role!=='manager') return res.status(200).json({
        title:'Error',
        success: false,
        message: 'this role dont allow to access manager'
    });
    next()
}

async function employee(req, res, next){
    const role = await handleRole(req, res, next)
   if(role){
        if(role!=='manager' && role!=='employee') return res.status(403).json({
            title:'Error',
            success: false,
            message: 'this role dont allow to access employee'
        });
        next()
   }
}

module.exports = {employee,manager}