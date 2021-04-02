import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCertIntegrityCheckResult } from "../redux";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import { getLinkFromTxid } from "src/utils/utils";
import axios from "axios";
import { ERR_TOP_CENTER } from "../../utils/snackbar-utils";
import { useSnackbar } from "notistack";

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
  // TODO: check if cert versions is sorted
  const newestCertVersionByToken = useSelector((state) => state.appSlice.decodedToken.certificate.versions[0]);
  const [certPart1, certPart2] = separateCertificate(newestCertVersionByToken.plain, newestCertVersionByToken.txid);

  const certVersionsOnBKC = useSelector((state) => state.appSlice.eduProgramOnBKC.certificate.versions);
  const correspondingCertVersionOnBKC = certVersionsOnBKC.find((version) => version.txid === newestCertVersionByToken.txid);
  // console.log({ newestCertVersionByToken, correspondingCertVersionOnBKC });
  // TODO: check if this sort is right?
  const newestCertVersionOnBKC = certVersionsOnBKC.sort((a, b) => a.timestamp - b.timestamp)[0];

  const [isIntegrity, setIsIntegrity] = useState(null);
  const [isOutDate, setIsOutDate] = useState(null);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    checkIntegrity();
    checkOutOfDate();
  }, []);

  async function checkIntegrity() {
    try {
      const response = await axios.post("/check-integrity", {
        hash: correspondingCertVersionOnBKC.hash,
        plain: newestCertVersionByToken.plain,
      });
      setIsIntegrity(response.data.isIntegrity);
    } catch (error) {
      enqueueSnackbar(JSON.stringify(error.response.data), ERR_TOP_CENTER);
    }
  }

  function checkOutOfDate() {
    console.log({ tokenTimeStamp: newestCertVersionByToken.timestamp, onbkctimestamp: newestCertVersionOnBKC.timestamp });
    setIsOutDate(newestCertVersionByToken.timestamp !== newestCertVersionOnBKC.timestamp);
  }

  return (
    <div>
      <Paper className={cls.root}>
        <Box display="flex" alignItems="center" pt={2} pb={1}>
          <Typography variant="h4" className={cls.typo}>
            Thông tin bằng cấp
          </Typography>
          {isIntegrity === null && <CircularProgress size="1.5rem" />}
          {isIntegrity === true && <CheckIcon color="primary" />}
          {isIntegrity === false && <CloseIcon color="secondary" />}
          {isOutDate === null && <CircularProgress size="1.5rem" />}
          {isOutDate === false && <CheckIcon color="primary" />}
          {isOutDate === true && <CloseIcon color="secondary" />}
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

function separateCertificate(cert, txid) {
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
    // "Số hiệu": cert.regisno,
    "Số hiệu vào sổ": cert.globalregisno,
    Txid: getLinkFromTxid(txid),
  };
  return [certPart1, certPart2];
}
