SELECT
    b.id,
    b.batchNumber,
    b.yearOfReceipt,
    p.name,
    p2.name
FROM
    batch b
LEFT JOIN project p ON
    b.project = p.id
LEFT JOIN platform p2 ON
    b.platform = p2.id;





