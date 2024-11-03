import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Collapse,
} from "@mui/material";
import {router} from "@inertiajs/react";


const boxStyle = {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: 0,
    height: "calc(100dvh - 1rem)",
    justifyContent: "space-between",
    overflow: "hidden",
    background: "transparent"
}
const SectionLayout = ({component, title, show, handleBack, handleExit, actions = []}) => {

    const hasAction = (handleExit || handleBack || Boolean(actions.length));
    return <Collapse in={show} unmountOnExit>
        <Card sx={boxStyle} elevation={0}>
            <CardHeader sx={{
                width: "100%",
                position: "relative",
                textAlign: "center",
                justifyContent: "center",
                top: 0,
                height: "10%",
                padding: 0,
                borderBottom: "1px solid",
                " div.MuiCardHeader-content": {
                    position: "absolute",
                }
            }}
                        title={title}
                        titleTypographyProps={{
                            color: "black",
                            textAlign: "center",
                            fontWeight: "900",
                        }}
            />
            <CardContent sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                height: hasAction ? "80%" : "90%",
                alignItems:"center"

            }}>
                {component}
            </CardContent>
            {hasAction ? <CardActions sx={{
                width: "100%",
                borderBottomLeftRadius: "25px",
                borderBottomRightRadius: "25px",
                height: "10%",
                borderTop: "1px solid",
                justifyContent: "space-around",
            }}>
                {handleExit ? <Button variant="contained"
                                      size="large"
                                      color="grey"
                                      sx={{fontColor: "#fff", borderRadius: "20px"}}
                                      onClick={handleExit}>Exit</Button> :null}
                {handleBack ? <Button variant="contained"
                                          onClick={handleBack}
                                          size="large"
                                          color="grey"
                                          sx={{
                                              fontColor: "#fff",
                                              borderRadius: "20px"
                                          }}>Back</Button>:null}
                {actions}
            </CardActions> : null}
        </Card>
    </Collapse>

}
export default SectionLayout;
