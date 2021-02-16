import React from "react";
import {
  Box,
  CircularProgress,
  Divider,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSubjectIntegrityCheckResult } from "../redux";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import { getLinkFromTxid } from "../../utils/utils";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0, 2, 2, 2),
  },
  typo: {
    flexGrow: 1,
  },
}));

export default function DecryptedSubjectTable(props) {
  const cls = useStyles();
  const subjects = useSelector((state) => state.appSlice.decodedData.subjects);
  const publicKeyHex65 = useSelector(
    (state) => state.appSlice.decodedData.publicKeyHex65
  );
  const dp = useDispatch();

  useEffect(() => {
    checkSubjectsIntegrity();
  }, []);

  async function checkSubjectsIntegrity() {
    subjects.forEach(async (subject, subjectIndex) => {
      subject.versions.map(async (subjectVersion, versionIndex) => {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/check-integrity`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              txid: subjectVersion.txid,
              plain: subjectVersion.plain,
              publicKeyHex65,
            }),
          }
        );
        const result = await response.json();
        if (!response.ok) {
          console.log(result);
        } else {
          // result: {valid: true/false, timestamp: "12341234"/msg: "asdfasdf"}
          setTimeout(() => {
            dp(
              setSubjectIntegrityCheckResult({
                subjectIndex,
                versionIndex,
                ...result,
              })
            );
          }, Math.floor(Math.random() * 2500 + 200));
        }
      });
    });
  }

  return (
    <div>
      <Paper className={cls.root}>
        <Box pt={2} pb={1} display="flex" alignItems="center">
          <Typography variant="h4" className={cls.typo}>
            Thông tin bảng điểm
          </Typography>
          {/* <CircularProgress size="1.5rem"></CircularProgress> */}
        </Box>
        <Divider></Divider>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Kì học</TableCell>
                <TableCell>Mã HP</TableCell>
                <TableCell>Tên HP</TableCell>
                <TableCell>Số TC</TableCell>
                <TableCell>Điểm GK</TableCell>
                <TableCell>Điểm CK</TableCell>
                <TableCell>Mã GV</TableCell>
                <TableCell>Tên GV</TableCell>
                <TableCell>Txid</TableCell>
                <TableCell>Tính toàn vẹn</TableCell>
                <TableCell>Timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subjects.map((subject, subjectIndex) => (
                <React.Fragment key={subjectIndex}>
                  {subject.versions.map((version, versionIndex) => (
                    <TableRow key={versionIndex}>
                      <TableCell>{version.plain.semester}</TableCell>
                      <TableCell>{version.plain.subject.subjectId}</TableCell>
                      <TableCell>{version.plain.subject.name}</TableCell>
                      <TableCell>{version.plain.subject.credit}</TableCell>
                      <TableCell>{version.plain.halfSemesterPoint}</TableCell>
                      <TableCell>{version.plain.finalSemesterPoint}</TableCell>
                      <TableCell>{version.plain.teacherId}</TableCell>
                      <TableCell>{version.plain.teacherName}</TableCell>
                      {/* <TableCell>{version.txid.slice(0, 6) + "..." + version.txid.slice(-6)}</TableCell> */}
                      <TableCell>{getLinkFromTxid(version.txid)}</TableCell>
                      <TableCell align="center">
                        {version.valid === undefined && (
                          <CircularProgress size="1rem" />
                        )}
                        {version.valid === true && (
                          <CheckIcon color="primary" />
                        )}
                        {version.valid === false && (
                          <CloseIcon color="secondary" />
                        )}
                      </TableCell>
                      <TableCell>
                        {version.valid === true && version.timestamp}
                        {version.valid === false && version.msg}
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
