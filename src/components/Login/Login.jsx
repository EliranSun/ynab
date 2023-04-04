import { useState } from "react";
import { login, logout } from "../../utils/auth";
import useAuthState from "../../hooks/useAuth";

const Login = ({ children }) => {
	// const [user, setUser] = useState(null);
	const [user, setUser] = useAuthState();

	if (user && user.uid) {
		return children;
	}

	return (
		<div>
			<h1>Login</h1>
			<button
				onClick={async () => {
					const user = await login();
					setUser(user);
				}}
			>
				Login
			</button>
			<button
				onClick={() => {
					logout();
					setUser(null);
				}}
			>
				Logout
			</button>
		</div>
	);
};

export default Login;
