import { makeStyles, TextField } from "@material-ui/core";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { ERR_TOP_CENTER } from "../../utils/snackbar-utils";
import { setDecodedData, setDecodedTokenAndEduProgramOnBKC } from "../redux";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // backgroundImage: "linear-gradient( rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4) ), url('/static/images/background/1.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center top",
  },
  box: {
    flexBasis: "70%",
    display: "flex",
  },
}));

export default function Verify(props) {
  const cls = useStyles();
  const dp = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  async function hdPasteToken(e) {
    const token = e.clipboardData.getData("Text");
    try {
      const decodeTokenResponse = await axios.post("/decode-token", { token });
      try {
        const onBKCDataResponse = await axios.get("/student/data/" + decodeTokenResponse.data.publicKeyHex);
        const onBKCEduProgram = onBKCDataResponse.data.find(
          (eduprogram) => eduprogram.certificate.versions[0].portfolio_id === decodeTokenResponse.data.certificate.versions[0].portfolio_id
        );
        dp(setDecodedTokenAndEduProgramOnBKC({ decodedToken: decodeTokenResponse.data, eduProgramOnBKC: onBKCEduProgram }));
        navigate("/ket-qua");
      } catch (error) {
        console.error(error);
        error.response && enqueueSnackbar(JSON.stringify(error.response.data), ERR_TOP_CENTER);
      }
    } catch (error) {
      console.error(error);
      error.response && enqueueSnackbar("Token không hợp lệ: " + JSON.stringify(error.response.data), ERR_TOP_CENTER);
    }
  }

  return (
    <div className={cls.root}>
      <div className={cls.box}>
        <TextField label="Token" fullWidth autoFocus onPaste={hdPasteToken}></TextField>
      </div>
    </div>
  );
}
