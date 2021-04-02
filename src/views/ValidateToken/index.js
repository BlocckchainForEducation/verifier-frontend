import { makeStyles, TextField } from "@material-ui/core";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { ERR_TOP_CENTER } from "../../utils/snackbar-utils";
import { setDecodedData } from "../redux";

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

  // const [tokenValue, setTokenValue] = useState("");

  // function hdChange(e) {
  //   setTokenValue(e.target.value);
  // }

  // async function hdKeyPress(e) {
  //   if (e.key === "Enter") {
  //   }
  // }

  async function hdPasteToken(e) {
    const token = e.clipboardData.getData("Text");
    try {
      const response = await axios.post("/decode-token", { token });
      dp(setDecodedData(response.data));
      navigate("/ket-qua");
    } catch (error) {
      enqueueSnackbar("Token không hợp lệ: " + JSON.stringify(error.response.data), ERR_TOP_CENTER);
    }
  }

  return (
    <div className={cls.root}>
      <div className={cls.box}>
        {/* <TextField label="Token" fullWidth autoFocus onPaste={hdPasteToken} onChange={hdChange} onKeyPress={hdKeyPress}></TextField> */}
        <TextField label="Token" fullWidth autoFocus onPaste={hdPasteToken}></TextField>
      </div>
    </div>
  );
}
