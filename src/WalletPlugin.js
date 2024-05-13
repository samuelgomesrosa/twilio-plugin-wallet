import React from "react";
import { View } from "@twilio/flex-ui";
import { FlexPlugin } from "@twilio/flex-plugin";

import WalletTabView from "./components/WalletTabView";
import { SideNavLink } from "./components/SideNavLink";

const PLUGIN_NAME = "WalletPlugin";

export default class WalletPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   */
  async init(flex, manager) {
    flex.SideNav.Content.add(<SideNavLink key="wallet-link" />);

    flex.ViewCollection.Content.add(
      <View name="wallet" key="wallet">
        <WalletTabView flex={flex} manager={manager} />
      </View>
    );

    flex.Notifications.registerNotification({
      id: "send-content-template-notification",
      content: `O template de conteúdo foi enviado com sucesso para o número selecionado!`,
      type: flex.NotificationType.status,
      timeout: 4000,
    });
  }
}
