const config = require("../config/auth.config");
const db = require("../model");
const Coupon = db.coupon;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");


exports.createCoupon = (req,res)=>{
      Coupon.findOne({"couponCode":req.body.couponCode}).exec(function (err, couponDetails) {
        if(couponDetails){
          return res.status(400).send({ message: "Failed! Coupon Code is already in use!" });
        }else{
            const coupon = new Coupon({
                offerName: req.body.offerName,
                couponCode: req.body.couponCode,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                status: req.body.status,
                discountPercentage: req.body.discountPercentage,
                discountAmount : req.body.discountAmount,
                termsConditions: req.body.termsConditions,
                image: req.body.image
              });
              coupon.save((err, coupon) => {
                if (err) {
                  return  res.status(500).send({ message: "Failed to create coupon!", error: err });
                    ;
                  }else{
                    return res.send({ message: "Coupon Added successfully!", data: coupon });
                  }
            })
        }

      })
}
exports.couponStatusUpdate = (req,res)=>{
    Coupon.findOneAndUpdate({"_id":req.body._id},{$set:{"status":req.body.status}}, { new: true }).exec(function (err, couponDetails) {
        
        if (err|| !couponDetails) {
          return res.status(500).send({ message: "Failed to update Coupon status",error: err });
            ;
          }else{
            return res.send({ message: "Coupon updated successfully!",data: couponDetails});
          }
            
          
          
    })
}
exports.deleteCoupon = (req,res)=>{
    Coupon.findOneAndDelete({"_id":req.body._id}, { new: true }).exec(function (err, couponDetails) {
        if (!err) {
          return  res.send({ msg: "Coupon deleted successfully!"});
        } else {
          return res.status(500).send({message: "Failed to delete Coupon", error: err});
        }
          
          
    })
}
exports.getCoupon = (req,res)=>{

    Coupon.findOne({"_id":req.body._id}).exec(function (err, couponDetails) {
        if (err|| !couponDetails) {
          return res.status(500).send({ message: "Failed to get Coupon", error: err });
            ;
          }else{
            return res.send({data: couponDetails});
          }
            

    })
}
exports.updateCoupon = (req,res)=>{

    Coupon.findOne({"_id":req.body._id}).exec(function (err, couponDetails) {

        if (err|| !couponDetails) {
          return res.status(500).send({ message: "Failed! Not able to update coupon!", error: err });
            ;
          }else{
            Coupon.find({"couponCode":{$ne:req.body.couponCode}}).exec(async function (err, couponData) {

                var dataCheck = await couponData.filter(data => {
                  return data.couponCode == req.body.couponCode
              })
              if(dataCheck == [] || dataCheck == null || dataCheck == undefined){
                return  res.status(500).send({ message: "Failed to update coupon! Coupon code already in use!" });
              }else{
                Coupon.findOneAndUpdate({"_id":req.body._id},{$set:{"offerName":req.body.offerName,"couponCode,":req.body.couponCode,
                            "startDate":req.body.startDate,"endDate":req.body.endDate,"status":req.body.status,"discountPercentage":req.body.discountPercentage,
                            "discountAmount":req.body.discountAmount,"image":req.body.image,"updatedAt":new Date()}}, { new: true }).exec(function (err, couponDetails) {
                               
                                if (err|| !couponDetails) {
                                  return  res.status(500).send({ message: "Failed to update Coupon status", error: err });
                                    ;
                                  }
                                  return res.send({ message: "Coupon updated successfully!",data: couponDetails});
                                  
                                  
                            })
              }
            })
          }
    })
}
exports.getListSortSeach = (req,res)=>{
  var searchValue = req.body.searchValue
  var sortValue = req.body.sortValue

  if(searchValue && sortValue){
    if(sortValue == 1 || sortValue == 2){
      
      Coupon.aggregate([{ $match: { $and: [{ "status": { $eq: sortValue } }, {"$or":[{"couponCode":{'$regex':searchValue,'$options':'i'}},
      {"offerName":{'$regex':searchValue,'$options':'i'}}]}]}}]).exec(function (err, couponDetails) {
        if (err|| couponDetails.length < 0) {
          return res.status(500).send({ message: "Failed to get Coupon", error: err });
            ;
          }else{
            return res.send({data: couponDetails});
          }
    })
    }else{
      Coupon.find( {"$or":[{"couponCode":{'$regex':searchValue,'$options':'i'}},
      {"offerName":{'$regex':searchValue,'$options':'i'}}]}).exec(function (err, couponDetails) {
        if (err|| couponDetails.length < 0) {
          return  res.status(500).send({ message: "Failed to get Coupon", error: err });
            ;
          }else{
            return res.send({data: couponDetails});
          }
            

    })
    }
  }else if(!searchValue && sortValue){
    if(sortValue == 1 || sortValue == 2){
      Coupon.find({"status":sortValue}).exec(function (err, couponDetails) {
        if (err|| couponDetails.length < 0) {
          return res.status(500).send({ message: "Failed to get Coupon", error: err });
            ;
          }else{
            return res.send({data: couponDetails});
          }
    })
    }else{
      Coupon.find({}).exec(function (err, couponDetails) {
        if (err|| couponDetails.length < 0) {
            res.status(500).send({ message: "Failed to get Coupon", error: err });
            return;
          }else{
            res.send({data: couponDetails});
          }
    })
    }
  }else if(searchValue && !sortValue){
    Coupon.find( {"$or":[{"couponCode":{'$regex':searchValue,'$options':'i'}},
    {"offerName":{'$regex':searchValue,'$options':'i'}}]}).exec(function (err, couponDetails) {
      if (err|| couponDetails. length < 0) {
        return res.status(500).send({ message: "Failed to get Coupon", error: err });
          ;
        }else{
          return res.send({data: couponDetails});
        }
          

  })
  }

}