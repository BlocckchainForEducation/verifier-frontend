import { Box, Button, makeStyles, TextField } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: "linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url('/static/images/background/1.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center top",
  },
  box: {
    flexBasis: "70%",
    display: "flex",
  },
  textField: {
    flexGrow: 1,
  },
  btnContainer: {
    flexShrink: 0,
    padding: theme.spacing(0, 2),
    display: "flex",
    alignItems: "flex-end",
  },
  button: {},
}));
export default function Verify(props) {
  const cls = useStyles();
  return (
    <div className={cls.root}>
      <div className={cls.box}>
        <TextField
          variant="outlined"
          label="Token"
          fullWidth
          autoFocus
          className={cls.textField}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              console.log("value", e.target.value);
              alert("enter");
            }
          }}
        ></TextField>
        <div className={cls.btnContainer}>
          <Button variant="contained" color="primary">
            Xác thực
          </Button>
        </div>
      </div>
    </div>
  );
}
