import { Link as RouterLink, LinkProps } from "react-router-dom";
import { Link as MuiLink } from "@mui/material";
export function Link(props: LinkProps, children: React.ReactNode) {
	return (
		<MuiLink component={RouterLink} {...props}>
			{children}
		</MuiLink>
	);
}
