const {Router}=require("express");

const performanceController =
require("../controllers/performance.controller");

const protect =
require("../middleware/auth.middleware");

const authorizeRoles =
require("../middleware/role.middleware");

const validate =
require("../middleware/validate.middleware");

const {
createPerformanceSchema
}=require("../utils/performance.validator");


const performanceRouter=Router();



performanceRouter.post(
"/",
protect,
authorizeRoles("admin"),
validate(createPerformanceSchema),
performanceController.createPerformance
);



performanceRouter.get(
"/",
protect,
authorizeRoles("admin"),
performanceController.getAllPerformance
);



performanceRouter.get(
"/:employeeId",
protect,
authorizeRoles("admin"),
performanceController.getEmployeePerformance
);



performanceRouter.put(
"/:id",
protect,
authorizeRoles("admin"),
performanceController.updatePerformance
);



performanceRouter.delete(
"/:id",
protect,
authorizeRoles("admin"),
performanceController.deletePerformance
);



module.exports=performanceRouter;