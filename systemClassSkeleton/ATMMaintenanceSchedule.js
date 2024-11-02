// Represents the maintenance schedule for the ATM machine
class ATMMaintenanceSchedule {
    constructor(scheduleId, atmId, maintenanceDate, typeOfService, workerId, status) {
        this.scheduleId = scheduleId;
        this.atmId = atmId;
        this.maintenanceDate = maintenanceDate;
        this.typeOfService = typeOfService;
        this.workerId = workerId;
        this.status = status;
    }
}

module.exports = ATMMaintenanceSchedule;
