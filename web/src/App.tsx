import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";

// import { Routes, Route } from "react-router-dom";

import Upload from "./Upload";
import List from "./List";
import { useState } from "react";
import { CssBaseline, createTheme } from "@mui/material";
import { ThemeProvider } from "@emotion/react";

function App() {
	const [tab, setTab] = useState("1");
	const theme = createTheme({
		palette: {
			mode: "light",
		},
	});
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Box sx={{ flexGrow: 1 }} width={"100vw"} height={"100vh"}>
				<AppBar position="static">
					<Toolbar>
						<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
							3D Printer Server
						</Typography>
					</Toolbar>
				</AppBar>
				<Box>
					<TabContext value={tab}>
						<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
							<TabList
								onChange={(_, v) => setTab(v)}
								aria-label="lab API tabs example"
								centered
							>
								<Tab label="アップロード" value="1" />
								<Tab label="ファイルリスト" value="2" />
							</TabList>
						</Box>
						<TabPanel value="1">
							<Upload />
						</TabPanel>
						<TabPanel value="2">
							<List />
						</TabPanel>
					</TabContext>
				</Box>
			</Box>
		</ThemeProvider>
	);
}

export default App;
