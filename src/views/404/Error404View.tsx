import { Spacer } from "@aircall/tractor";

function Error404View() {
  return (
    <Spacer
      direction="vertical"
      justifyContent="left"
      width="100%"
      marginTop={73 + 10}
      marginBottom={73 + 10}
    >
      Error (4xx): This is not the web page you are looking for.
    </Spacer>
  );
}

export default Error404View;
