import { Container, makeStyles } from "@material-ui/core";
import View from "../../shared/View";
import DecryptedCertInfo from "./DecryptedCertInfo";
import DecryptedSubjectTable from "./DecryptedSubjectTable";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      marginBottom: theme.spacing(3),
    },
  },
}));

export default function Result(props) {
  const cls = useStyles();
  return (
    <View title="Kết quả xác thực">
      <div className={cls.root}>
        <DecryptedCertInfo></DecryptedCertInfo>
        <DecryptedSubjectTable></DecryptedSubjectTable>
      </div>
    </View>
  );
}
