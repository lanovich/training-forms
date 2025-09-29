import "./App.css";
import { SignIn } from "./components/SignIn";
import { SignUp } from "./components/SignUp";

function App() {
  const handleSignIn = async (fields: any) => {
    console.log("SignIn отправка…");
    await new Promise<void>((resolve) =>
      setTimeout(() => {
        console.log("SignIn:", fields);
        resolve();
      }, 500)
    );
  };

  const handleSignUp = async (fields: any) => {
    console.log("SignUp отправка…");
    await new Promise<void>((resolve) =>
      setTimeout(() => {
        console.log("SignUp:", fields);
        resolve();
      }, 500)
    );
  };

  return (
    <div className="container">
      <SignIn onSubmit={handleSignIn} />
      <SignUp onSubmit={handleSignUp} />
    </div>
  );
}

export default App;
