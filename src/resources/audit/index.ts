import React from "react";

const AuditList = React.lazy(() => import('./AuditList'));

const audit = {
	list: AuditList,
};

export default audit;
