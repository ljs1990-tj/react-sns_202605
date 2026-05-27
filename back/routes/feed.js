const express = require('express');
const oracledb = require('oracledb');
const db = require("../db");
const jwtAuthentication = require('../auth');
const router = express.Router();

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `
        SELECT * FROM TBL_FEED F
        INNER JOIN TBL_FEED_IMG I ON F.ID = I.FEEDID
        WHERE USERID = :userId
      `,
      [ userId ],
      {outFormat: oracledb.OUT_FORMAT_OBJECT}
    );
    
    res.json({
        result : "success",
        list : result.rows
    });
    
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Error executing query');
  } finally {
    await connection.close();
  }
});

router.delete('/:feedId', jwtAuthentication, async (req, res) => {
  const { feedId } = req.params;
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `
        DELETE FROM TBL_FEED WHERE ID = :feedId
      `,
      [ feedId ],
      { autoCommit : true }
    );
    
    res.json({
        result : "success",
        message : "삭제 됨"
    });
    
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Error executing query');
  } finally {
    await connection.close();
  }
});

module.exports = router;