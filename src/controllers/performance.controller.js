const mongoose = require("mongoose");
const performanceModel = require("../model/performance.model");
const employeeModel = require("../model/employee.model");



// Create Performance Review

const createPerformance = async(req,res)=>{

try{

const {
    employee,
    reviewPeriod,
    rating,
    goals,
    achievements,
    feedback
}=req.body;



if(!mongoose.Types.ObjectId.isValid(employee)){

return res.status(400).json({
success:false,
message:"Invalid Employee Id"
});

}



// employee check

const employeeExist = await employeeModel.findById(employee);


if(!employeeExist){

return res.status(404).json({
success:false,
message:"Employee not found"
});

}



// create performance

const performance = await performanceModel.create({

employee,

reviewPeriod,

rating,

goals,

achievements,

feedback,

reviewedBy:req.user._id

});



return res.status(201).json({

success:true,

message:"Performance created successfully",

performance

});


}catch(error){

console.log(error);


return res.status(500).json({

success:false,

message:"Internal Server Error"

});

}

};

const getAllPerformance = async(req,res)=>{

try{

const performances = await performanceModel
.find()
.populate(
    "employee",
    "employeeId fullName email department designation"
)
.populate(
    "reviewedBy",
    "username email"
)
.sort({
    createdAt:-1
});


return res.status(200).json({

success:true,

count:performances.length,

performances

});


}catch(error){

console.log(error);

return res.status(500).json({

success:false,
message:"Internal Server Error"

});

}

};
const getEmployeePerformance = async(req,res)=>{

try{

const {employeeId}=req.params;


if(!mongoose.Types.ObjectId.isValid(employeeId)){

return res.status(400).json({

success:false,
message:"Invalid Employee Id"

});

}


const performances = await performanceModel
.find({
    employee:employeeId
})
.populate(
    "employee",
    "employeeId fullName department designation"
)
.populate(
    "reviewedBy",
    "username email"
)
.sort({
    createdAt:-1
});



if(!performances.length){

return res.status(404).json({

success:false,
message:"No performance record found"

});

}



return res.status(200).json({

success:true,

performances

});


}catch(error){

console.log(error);

return res.status(500).json({

success:false,
message:"Internal Server Error"

});

}

};
const updatePerformance = async(req,res)=>{

try{

const {id}=req.params;


if(!mongoose.Types.ObjectId.isValid(id)){

return res.status(400).json({

success:false,
message:"Invalid Performance Id"

});

}



const performance =
await performanceModel.findByIdAndUpdate(

id,

{
    ...req.body
},

{
    new:true,
    runValidators:true
}

);



if(!performance){

return res.status(404).json({

success:false,
message:"Performance not found"

});

}



return res.status(200).json({

success:true,

message:"Performance updated successfully",

performance

});


}catch(error){

console.log(error);


return res.status(500).json({

success:false,
message:"Internal Server Error"

});

}

};
const deletePerformance = async(req,res)=>{

try{


const {id}=req.params;


if(!mongoose.Types.ObjectId.isValid(id)){

return res.status(400).json({

success:false,
message:"Invalid Performance Id"

});

}



const performance =
await performanceModel.findByIdAndDelete(id);



if(!performance){

return res.status(404).json({

success:false,
message:"Performance not found"

});

}



return res.status(200).json({

success:true,

message:"Performance deleted successfully"

});



}catch(error){

console.log(error);


return res.status(500).json({

success:false,
message:"Internal Server Error"

});

}

};
module.exports={
createPerformance,
getAllPerformance,

getEmployeePerformance,

updatePerformance,

deletePerformance
};