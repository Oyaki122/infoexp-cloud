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

const AssignSchema = z.object({
	filename: z.string(),
	fileId: z.string(),
	assignedUser: z.string(),
	assigneduserId: z.string(),
	uploadUser: z.string(),
});
const FileArraySchema = z.array(AssignSchema);

export default function Assign() {
	const [files, setFiles] = useState<z.infer<typeof AssignSchema>[]>([]);
	const getAssignment = async () => {
		const res: AxiosResponse<{ statuscode: number; body: string }> =
			await axios.get(
				"https://qg6wdvbjvh.execute-api.us-east-1.amazonaws.com/1/assignment",
			);
		const list = JSON.parse(res.data.body);
		console.log(list);
		const parsedList = FileArraySchema.parse(list);
		setFiles(parsedList);
	};
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		getAssignment();
	}, []);

	const print = async (fileid: string, filename: string) => {
		const res = await axios.post(
			"https://exxpe7exxi.execute-api.us-east-1.amazonaws.com/default/infoexp-start-print",
			{ fileid, filename },
		);
		console.log(res);
	};

	return (
		<Box sx={{ width: "100%" }}>
			<Stack spacing={2}>
				<Stack direction={"row"} spacing={2} sx={{ width: "100%" }}>
					<Typography variant="h4">アップロードファイル一覧</Typography>
					<Box sx={{ flexGrow: 1 }} />
					<Button variant="contained" onClick={getAssignment}>
						更新
					</Button>
				</Stack>
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>ファイル名</TableCell>
								<TableCell>割り当てられたユーザー</TableCell>
								<TableCell>アップロードユーザー</TableCell>
								<TableCell>印刷開始</TableCell>
							</TableRow>
						</TableHead>
						{
							<TableBody>
								{files.map((file) => (
									<TableRow
										key={file.fileId}
										sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
									>
										<TableCell component="th" scope="file">
											{file.filename}
										</TableCell>
										<TableCell>{file.assignedUser}</TableCell>
										<TableCell>{file.uploadUser}</TableCell>
										<TableCell>
											<Button
												variant="contained"
												onClick={() => print(file.fileId, file.filename)}
											/>
										</TableCell>
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
