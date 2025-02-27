const events = require("events");
const Audit = require("../model/audit/audit.model");
const Logger = require("../services/logger.services");
const logger = new Logger("audit", "audit.services");
const emitter = new events.EventEmitter();

let event = "auditEvent";

emitter.on(event, async (auditData) => {
  try {
    let newAudit = new Audit(auditData);
    logger.info("Auditing", newAudit);
    await newAudit.save();
  } catch (error) {
    console.log("audit event emitter error", error.message);
  }
});

exports.prepareAuditEvent = (
  auditAction,
  auditData,
  auditStatus,
  errorMessage,
  auditBy,
  auditOn
) => {
  let newAuditData = {
    auditAction,
    auditData,
    auditStatus,
    errorMessage,
    auditBy,
    auditOn,
  };

  emitter.emit(event, newAuditData);
};
