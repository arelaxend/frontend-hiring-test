import { Avatar, Flex, Tractor } from "@aircall/tractor";

export type MainLayoutProps = {
  children?: any;
};

function MainLayout({ children }: MainLayoutProps) {
  return (
    <Tractor injectStyle>
      <Flex
        bg="base.white"
        color="base.black"
        alignItems="center"
        justifyContent="center"
        borderBottom="1px solid"
        borderColor="grey.light"
        p={3}
        position="fixed"
        width="100%"
        top={0}
      >
        <Avatar
          size="large"
          src="https://cdn.aircall.io/aircall-logo-squared.png"
        >
          Aircall
        </Avatar>
      </Flex>
      {children}
    </Tractor>
  );
}

export default MainLayout;
