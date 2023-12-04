import { Button, Stack, TextField, styled } from "@mui/material";
import Box from "@mui/material/Box";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { createRef, useState } from "react";

const VisuallyHiddenInput = styled("input")({
	clip: "rect(0 0 0 0)",
	clipPath: "inset(50%)",
	height: 1,
	overflow: "hidden",
	position: "absolute",
	bottom: 0,
	left: 0,
	whiteSpace: "nowrap",
	width: 1,
});

export default function Upload() {
	const fileInputRef = createRef<HTMLInputElement>();
	const [filename, setFilename] = useState("");
	const [user, setUser] = useState("hoge");
	const send: React.MouseEventHandler = async (event) => {
		const file = fileInputRef.current?.files?.[0];
		if (!file) return;
		event.preventDefault();
		const submitData = new FormData();

		submitData.append("user", user);
		submitData.append("file", fileInputRef?.current?.files?.[0] as Blob);

		await fetch(
			"https://qg6wdvbjvh.execute-api.us-east-1.amazonaws.com/1/uploadFiles",
			{
				method: "POST",
				body: submitData,
				headers: {
					"content-type": "multipart/form-data",
				},
				mode: "cors",
			},
		);
	};

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
			}}
		>
			<Stack
				spacing={2}
				sx={{
					maxWidth: "500px",
				}}
			>
				<TextField required id="outlined-required" label="ユーザー名" />
				<Button
					component="label"
					variant="contained"
					startIcon={<CloudUploadIcon />}
				>
					ファイル選択
					<VisuallyHiddenInput
						type="file"
						ref={fileInputRef}
						accept=".gcode"
						// onChange={(e) => e.}
					/>
				</Button>
				<Button variant="contained" onClick={send}>
					アップロード
				</Button>
			</Stack>
		</Box>
	);
}
