const { AuthContextProvider } = require("./AuthCTX");

const ContextStore = (props) => {
  return <AuthContextProvider>{props.children}</AuthContextProvider>;
};

export default ContextStore;
