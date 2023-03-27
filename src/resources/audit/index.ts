import React from "react";

const AuditList = React.lazy(async () => await import('./AuditList'));

const audit = {
	list: AuditList,
};

export default audit;
