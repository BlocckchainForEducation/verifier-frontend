import { Box, CircularProgress, Divider, Grid, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@material-ui/core";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCertIntegrityCheckResult } from "../redux";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0, 2, 2, 2),
  },
  typo: {
    flexGrow: 1,
  },
}));

export default function DecryptedCertInfo(props) {
  const cls = useStyles();
  const certificate = useSelector((state) => state.appSlice.decodedData.certificate.versions[0]);
  const publicKeyHex65 = useSelector((state) => state.appSlice.decodedData.publicKeyHex65);
  const [certPart1, certPart2] = separateCertificate(certificate.plain);
  const dp = useDispatch();

  useEffect(() => {
    checkIntegrity();
  }, []);

  async function checkIntegrity() {
    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/check-integrity`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ txid: certificate.txid, plain: certificate.plain, publicKeyHex65 }),
    });
    const result = await response.json();
    if (!response.ok) {
      console.log(result);
    } else {
      // result: {valid: true/false, timestamp: "12341234"}
      dp(setCertIntegrityCheckResult(result));
    }
  }

  return (
    <div>
      <Paper className={cls.root}>
        <Box display="flex" alignItems="center" pt={2} pb={1}>
          <Typography variant="h4" className={cls.typo}>
            Thông tin bằng cấp
          </Typography>
          {certificate.valid === undefined && <CircularProgress size="1.5rem" />}
          {certificate.valid === true && <CheckIcon color="primary" />}
          {certificate.valid === false && <CloseIcon color="secondary" />}
        </Box>
        <Divider></Divider>
        <Grid container>
          <Grid item sm={12} md={6}>
            <SimpleTable rows={certPart1}></SimpleTable>
          </Grid>
          <Grid item sm={12} md={6}>
            <SimpleTable rows={certPart2}></SimpleTable>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

function SimpleTable({ rows }) {
  return (
    <TableContainer>
      <Table size="small">
        <TableBody>
          {Object.entries(rows).map((entry, index) => (
            <TableRow key={index}>
              <TableCell style={{ width: "50%" }}>{entry[0]}</TableCell>
              <TableCell>{entry[1]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function separateCertificate(cert) {
  let certPart1 = {
    "Họ và tên": cert.name,
    "Ngày sinh": cert.birthday,
    "Giới tính": cert.gender,
    Trường: cert.university,
    "Ngành học": cert.faculty,
    "Loại bằng": cert.degree,
    "Năm tốt nghiệp": cert.gradyear,
  };
  let certPart2 = {
    "Xếp loại": cert.level,
    "Hình thức đào tạo": cert.eduform,
    "Nơi cấp": cert.issuelocation,
    "Ngày cấp": cert.issuedate,
    "Hiệu trưởng": cert.headmaster,
    "Số hiệu": cert.regisno,
    "Số hiệu vào sổ": cert.globalregisno,
  };
  return [certPart1, certPart2];
}

// const certPart1 = {
//   "Họ và tên": "Nguyễn Văn An",
//   "Ngày sinh": "01/01/1998",
//   "Nơi sinh": "Từ Sơn, Bắc Ninh",
//   "Giới tính": "Nam",
//   "Dân tộc": "Kinh",
//   "Học sinh trường": "Trung học cơ sở Hương Mạc I",
//   "Năm tốt nghiệp": "2016",
// };

// const certPart2 = {
//   "Xếp loại tốt nghiệp": "Khá",
//   "Hình thức đào tạo": "Chính quy",
//   "Số hiệu": "A09050634",
//   "Số vào sổ cấp bằng": "185",
//   "Trưởng phòng GD&ĐT": "Nguyễn Văn Bình",
//   Txid: "2443d2798645516f6d985347ba456ce6da416063952565d0a33d0d2009ee7a3f".substr(0, 20),
// };
