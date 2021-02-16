import { makeStyles } from "@material-ui/core";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import View from "../../shared/View";
import { setOffChainCheckResult } from "../redux";
import DecryptedCertInfo from "./DecryptedCertInfo";
import DecryptedSubjectTable from "./DecryptedSubjectTable";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      marginBottom: theme.spacing(3),
    },
    marginLeft: "-32px",
    marginRight: "-32px",
  },
}));

export default function Result(props) {
  const cls = useStyles();
  const subjects = useSelector((state) => state.appSlice.decodedData.subjects);
  const dp = useDispatch();

  useEffect(() => {
    runOffChainCheck();
  }, []);

  function runOffChainCheck() {
    let sumCredit = 0;
    let sumPoint = 0;
    subjects.forEach((subject, index) => {
      const copyVersions = [...subject.versions];
      copyVersions.sort((a, b) => b.timestamp - a.timestamp);
      const newestVersion = copyVersions[0];
      sumCredit += newestVersion.credit;
      sumPoint += newestVersion.credit * newestVersion.pointBase4;
    });
    let CPA = sumPoint / sumCredit;
    dp(setOffChainCheckResult({ sumCredit, CPA }));
  }

  return (
    <View title="Kết quả xác thực">
      <div className={cls.root}>
        <DecryptedCertInfo></DecryptedCertInfo>
        <DecryptedSubjectTable></DecryptedSubjectTable>
      </div>
    </View>
  );
}
