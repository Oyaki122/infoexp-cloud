import { Button, Stack, TextField, Typography, styled } from "@mui/material";
import Box from "@mui/material/Box";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { createRef, useState } from "react";
import axios from "axios";

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
	const [user, setUser] = useState("hoge");
	const [filename, setFilename] = useState("");

	const createFormData = async () => {
		const file = fileInputRef.current?.files?.[0];
		if (!file) throw new Error("ファイルが選択されていません");
		const formData = new FormData();
		formData.append("file", file);
		formData.append("user", user);
		return formData;
	};
	const send: React.MouseEventHandler = async () => {
		const formData = await createFormData();
		const res = await axios.post(
			"https://qg6wdvbjvh.execute-api.us-east-1.amazonaws.com/1/uploadFiles",
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			},
		);
		console.log(res);
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
				<TextField
					required
					id="outlined-required"
					label="ユーザー名"
					value={user}
					onChange={(e) => setUser(e.currentTarget.value)}
				/>
				<Box sx={{ display: "flex", flexDirection: "row" }}>
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
							onChange={(e) =>
								e.currentTarget.files &&
								setFilename(e.currentTarget.files[0].name)
							}
						/>
					</Button>
					<Box>
						<Typography>{filename}</Typography>
					</Box>
				</Box>
				<Button variant="contained" onClick={send}>
					アップロード
				</Button>
			</Stack>
		</Box>
	);
}
