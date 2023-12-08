import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Button, Stack, Typography } from "@mui/material";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { z } from "zod";

const FileSchema = z.object({
	filename: z.string(),
	user: z.string(),
	uid: z.string(),
});
const FileArraySchema = z.array(FileSchema);

export default function List() {
	const [files, setFiles] = useState<z.infer<typeof FileSchema>[]>([]);
	const getQueueFiles = async () => {
		const res: AxiosResponse<{ statuscode: number; body: string }> =
			await axios.get(
				"https://qg6wdvbjvh.execute-api.us-east-1.amazonaws.com/1/list",
			);
		const list = JSON.parse(res.data.body);
		console.log(list);
		const parsedList = FileArraySchema.parse(list);
		setFiles(parsedList);
	};
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		getQueueFiles();
	}, []);

	const assign = async () => {
		const res = await axios.post(
			"https://qg6wdvbjvh.execute-api.us-east-1.amazonaws.com/1/assignment",
		);
		console.log(res);
	};

	return (
		<Box sx={{ width: "100%", maxWidth: " 1000px", margin: "0 auto" }}>
			<Stack spacing={2}>
				<Stack direction={"row"} spacing={2} sx={{ width: "100%" }}>
					<Typography variant="h4">アップロードファイル一覧</Typography>
					<Box sx={{ flexGrow: 1 }} />
					<Button variant="contained" onClick={getQueueFiles}>
						更新
					</Button>
					<Button variant="contained" onClick={assign}>
						割り当て実行
					</Button>
				</Stack>
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>ファイル名</TableCell>
								<TableCell>アップロードユーザー</TableCell>
								<TableCell>UID</TableCell>
							</TableRow>
						</TableHead>
						{
							<TableBody>
								{files.map((file) => (
									<TableRow
										key={file.uid}
										sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
									>
										<TableCell component="th" scope="file">
											{file.filename}
										</TableCell>
										<TableCell>{file.user}</TableCell>
										<TableCell>{file.uid}</TableCell>
									</TableRow>
								))}
							</TableBody>
						}
					</Table>
				</TableContainer>
			</Stack>
		</Box>
	);
}
