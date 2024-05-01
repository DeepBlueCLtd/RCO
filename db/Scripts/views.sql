-- loanUsers source

CREATE VIEW loanUsers AS
SELECT
  i.loanedTo as id,
  COUNT(i.id) as numItems,
  u.username
from 
  item i
INNER JOIN "_users" u ON
  i.loanedTo = u.id
GROUP BY
  u.name,
  i.loanedTo;


-- richItem source

CREATE VIEW richItem as  SELECT 
i.id, i.mediaType, i.legacyMediaType, i.startDate, i.endDate, i.batch, i.itemNumber, i.consecSheets, i.vaultLocation, i.remarks, i.protectiveMarking, 
i.protectionString, i.musterRemarks, i.loanedTo, i.loanedDate, i.dispatchJob, i.dispatchedDate, i.destruction, i.destructionDate, i.createdAt, i.createdBy, 
b.project, b.platform, b.vault , b.department
FROM item i INNER JOIN batch b ON i.batch = b.id;