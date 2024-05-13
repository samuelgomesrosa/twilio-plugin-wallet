import { SideLink, Actions } from "@twilio/flex-ui";

export function SideNavLink({ activeView }) {
  function navigate() {
    Actions.invokeAction("NavigateToView", {
      viewName: "wallet",
    });
  }

  return (
    <SideLink
      showLabel={true}
      icon="Directory"
      iconActive="DirectoryBold"
      isActive={activeView === "wallet"}
      onClick={navigate}
    >
      Carteira
    </SideLink>
  );
}
