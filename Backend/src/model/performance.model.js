const mongoose = require("mongoose");


const performanceSchema = new mongoose.Schema({

    employee:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Employee",
        required:true
    },


    reviewPeriod:{
        type:String,
        required:true
    },


    rating:{
        type:Number,
        required:true,
        min:1,
        max:5
    },


    goals:{
        type:String,
        required:true
    },


    achievements:{
        type:String
    },


    feedback:{
        type:String
    },


    reviewedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },


    status:{
        type:String,
        enum:[
            "pending",
            "completed"
        ],
        default:"completed"
    }


},{
    timestamps:true
});


const performanceModel = mongoose.model(
    "Performance",
    performanceSchema
);

module.exports = performanceModel;